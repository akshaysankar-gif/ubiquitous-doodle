import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { parseTicket, RawTicketData } from "@/lib/parser";

export async function POST(req: NextRequest) {
  // Use the first available user since authentication is disabled
  let defaultUser = await prisma.user.findFirst();
  if (!defaultUser) {
    defaultUser = await prisma.user.create({
      data: {
        email: "akshay.sankar@surveysparrow.com",
        passwordHash: "none", // Placeholder, since it's just for upload relation
        name: "Admin",
        role: "ADMIN",
      }
    });
  }

  const userId = defaultUser.id;

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

    for (const rawRow of rawData) {
      const mappedRow: RawTicketData = {
        id: String(rawRow["Ticket ID"] || rawRow.id || ""),
        status: String(rawRow["Status"] || rawRow.status || ""),
        assignee: String(rawRow["Assignee"] || rawRow.assignee || ""),
        subject: String(rawRow["Subject"] || rawRow.subject || ""),
        brand: String(rawRow["Brand"] || rawRow.brand || ""),
        source: String(rawRow["Source"] || rawRow.source || ""),
        channel: String(rawRow["Channel"] || rawRow.channel || ""),
        team: String(rawRow["Team"] || rawRow.team || ""),
        issueType: String(rawRow["Issue type"] || rawRow["Issue Type"] || rawRow.issueType || ""),
        category: String(rawRow["Category"] || rawRow.category || ""),
        createdAt: String(rawRow["Created at"] || rawRow["CreatedAt"] || rawRow.createdAt || new Date().toISOString()),
        previousStatus: String(rawRow["Previous status"] || rawRow["Previous Status"] || rawRow.previousStatus || ""),
        messagesRaw: String(rawRow["Messages"] || rawRow["Message"] || rawRow.messagesRaw || ""),
      };

      const parsed = parseTicket(mappedRow);
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
