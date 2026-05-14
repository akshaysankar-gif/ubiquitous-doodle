import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { parseTicket, RawTicketData } from "@/lib/parser";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const batchName = formData.get("batchName") as string;

    if (!file || !batchName) {
      return NextResponse.json({ error: "Missing file or batchName" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    let rawData: any[] = [];

    if (file.name.endsWith(".csv")) {
      const text = new TextDecoder().decode(buffer);
      const result = Papa.parse(text, { header: true, skipEmptyLines: true });
      rawData = result.data;
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rawData = XLSX.utils.sheet_to_json(sheet);
    } else {
      return NextResponse.json({ error: "Unsupported file format" }, { status: 400 });
    }

    const ticketsToCreate: any[] = [];
    let skippedCount = 0;
    let eligibleCount = 0;

    for (const row of rawData) {
      const parsed = parseTicket(row as RawTicketData);
      if (!parsed) {
        skippedCount++;
        continue;
      }

      if (parsed.analysisStatus === "PENDING") {
        eligibleCount++;
      }

      ticketsToCreate.push(parsed);
    }

    const batch = await prisma.$transaction(async (tx) => {
      const b = await tx.ticketBatch.create({
        data: {
          name: batchName,
          uploadedById: userId,
          rowCount: ticketsToCreate.length,
          status: "PENDING",
        },
      });

      await tx.ticket.createMany({
        data: ticketsToCreate.map((t) => ({
          ...t,
          batchId: b.id,
        })),
        skipDuplicates: true,
      });

      return b;
    });

    return NextResponse.json({
      batchId: batch.id,
      rowCount: ticketsToCreate.length,
      skippedCount,
      eligibleCount,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
