import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const allowedUpdates = [
    "moduleL1",
    "areaL2",
    "subareaL3",
    "primaryIntent",
    "analysisStatus",
  ];

  const data: any = {};
  allowedUpdates.forEach((field) => {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  });

  try {
    const ticket = await prisma.ticket.update({
      where: { id },
      data,
    });

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
