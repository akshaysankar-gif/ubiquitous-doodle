import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
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

  const statusCounts = await prisma.ticket.groupBy({
    by: ["analysisStatus"],
    where: { batchId },
    _count: {
      _all: true,
    },
  });

  return NextResponse.json({
    ...batch,
    statusCounts: statusCounts.reduce((acc: any, curr) => {
      acc[curr.analysisStatus] = curr._count._all;
      return acc;
    }, {}),
  });
}
