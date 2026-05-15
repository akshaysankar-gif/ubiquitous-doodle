import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { parseTicket, RawTicketData } from "@/lib/parser";

export async function POST(req: NextRequest) {
  try {
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

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const batchName = formData.get("batchName") as string;

    console.log(`Upload request received: file=${file?.name}, size=${file?.size}, batchName=${batchName}`);

    if (!file || !batchName) {
      console.error("Missing file or batchName");
      return NextResponse.json({ error: "Missing file or batchName" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    let rawData: any[] = [];
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".csv")) {
      const text = new TextDecoder().decode(buffer);
      const result = Papa.parse(text, { header: true, skipEmptyLines: true });
      rawData = result.data;
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rawData = XLSX.utils.sheet_to_json(sheet);
    } else {
      console.error(`Unsupported format: ${fileName}`);
      return NextResponse.json({ error: "Unsupported file format. Please use .csv, .xlsx, or .xls" }, { status: 400 });
    }

    console.log(`Parsed rawData length: ${rawData.length}`);
    if (rawData.length > 0) {
      console.log("First raw row keys:", Object.keys(rawData[0]));
    }

    if (!rawData || rawData.length === 0) {
      console.error("Empty rawData");
      return NextResponse.json({ error: "The uploaded file is empty or could not be parsed." }, { status: 400 });
    }

    const ticketsToCreate: any[] = [];
    let skippedCount = 0;
    let eligibleCount = 0;

    // Helper to find value in row with case-insensitive key
    const getVal = (row: any, ...keys: string[]) => {
      const rowKeys = Object.keys(row);
      for (const key of keys) {
        // Direct match
        if (row[key] !== undefined) return row[key];
        // Case-insensitive match
        const foundKey = rowKeys.find(k => k.toLowerCase() === key.toLowerCase());
        if (foundKey) return row[foundKey];
      }
      return "";
    };

    for (const rawRow of rawData) {
      const mappedRow: RawTicketData = {
        id: String(getVal(rawRow, "Ticket ID", "id", "ticket_id")),
        status: String(getVal(rawRow, "Status", "status")),
        assignee: String(getVal(rawRow, "Assignee", "assignee")),
        subject: String(getVal(rawRow, "Subject", "subject")),
        brand: String(getVal(rawRow, "Brand", "brand")),
        source: String(getVal(rawRow, "Source", "source")),
        channel: String(getVal(rawRow, "Channel", "channel")),
        team: String(getVal(rawRow, "Team", "team")),
        issueType: String(getVal(rawRow, "Issue type", "Issue Type", "issue_type", "issueType")),
        category: String(getVal(rawRow, "Category", "category")),
        createdAt: String(getVal(rawRow, "Created at", "CreatedAt", "created_at", "createdAt") || new Date().toISOString()),
        previousStatus: String(getVal(rawRow, "Previous status", "Previous Status", "previous_status", "previousStatus")),
        messagesRaw: String(getVal(rawRow, "Messages", "Message", "messages", "messages_raw")),
      };

      if (!mappedRow.id) {
        skippedCount++;
        continue;
      }

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

    if (ticketsToCreate.length === 0) {
      return NextResponse.json({ error: "No valid tickets found in the file. Check headers and brands." }, { status: 400 });
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

      // Chunk the createMany to avoid parameter limits
      const chunkSize = 100;
      for (let i = 0; i < ticketsToCreate.length; i += chunkSize) {
        const chunk = ticketsToCreate.slice(i, i + chunkSize);
        await tx.ticket.createMany({
          data: chunk.map((t) => ({
            ...t,
            batchId: b.id,
          })),
          skipDuplicates: true,
        });
      }

      return b;
    }, {
      timeout: 30000, // 30 seconds for large batches
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
