import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeTicket } from "@/lib/analyzer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const { batchId } = await params;

  const batch = await prisma.ticketBatch.findUnique({
    where: { id: batchId },
  });

  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  }

  // Trigger background analysis
  analyzeBatch(batchId).catch((err) => {
    console.error(`Background analysis failed for batch ${batchId}:`, err);
  });

  return NextResponse.json({ started: true, batchId });
}

async function analyzeBatch(batchId: string) {
  await prisma.ticketBatch.update({
    where: { id: batchId },
    data: { status: "PROCESSING" },
  });

  const tickets = await prisma.ticket.findMany({
    where: {
      batchId,
      analysisStatus: { in: ["PENDING", "ERROR"] },
    },
  });

  const BATCH_SIZE = 10;
  const DELAY_MS = 300;

  for (let i = 0; i < tickets.length; i += BATCH_SIZE) {
    const chunk = tickets.slice(i, i + BATCH_SIZE);
    
    await Promise.allSettled(
      chunk.map(async (ticket) => {
        try {
          const analysis = await analyzeTicket(ticket.subject, ticket.messagesRaw);
          
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
              ...analysis,
              analysisStatus: "DONE",
            },
          });

          await prisma.ticketBatch.update({
            where: { id: batchId },
            data: { processedCount: { increment: 1 } },
          });
        } catch (error) {
          console.error(`Error analyzing ticket ${ticket.id}:`, error);
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: { analysisStatus: "ERROR" },
          });
          await prisma.ticketBatch.update({
            where: { id: batchId },
            data: { errorCount: { increment: 1 } },
          });
        }
      })
    );

    if (i + BATCH_SIZE < tickets.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  const finalBatch = await prisma.ticketBatch.findUnique({
    where: { id: batchId },
    include: { tickets: true },
  });

  const hasErrors = finalBatch?.tickets.some((t) => t.analysisStatus === "ERROR");
  
  await prisma.ticketBatch.update({
    where: { id: batchId },
    data: { status: hasErrors ? "ERROR" : "DONE" },
  });
}
