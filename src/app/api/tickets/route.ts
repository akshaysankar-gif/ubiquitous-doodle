import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "50");
  const skip = (page - 1) * pageSize;

  const filters: any = {};
  const filterFields = [
    "batchId",
    "createdMonth",
    "brand",
    "team",
    "severity",
    "frustrationLevel",
    "assignee",
    "analysisStatus",
    "channel",
  ];

  filterFields.forEach((field) => {
    const value = searchParams.get(field);
    if (value) filters[field] = value;
  });

  const isAIHandled = searchParams.get("isAIHandled");
  if (isAIHandled !== null) {
    filters.isAIHandled = isAIHandled === "true";
  }

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where: filters,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.ticket.count({ where: filters }),
  ]);

  return NextResponse.json({
    tickets,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
