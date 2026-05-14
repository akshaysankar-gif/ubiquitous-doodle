import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const brand = searchParams.get("brand");
  const channel = searchParams.get("channel");

  const filters: any = {};
  if (month) filters.createdMonth = month;
  if (brand) filters.brand = brand;
  if (channel) filters.channel = channel;

  const [
    totalTickets,
    eligibleTickets,
    processedTickets,
    aiHandledCount,
    avgScoreResult,
    automationLevels,
    frustrationLevels,
    byDayOfWeek,
    byHourOfDay,
    byPrimaryIntent,
    bySeverity,
    byFrustrationLevel,
    byRootCauseType,
    bySystemicSignal,
    byBrand,
    byChannel,
    byModule,
    monthOverMonth,
  ] = await Promise.all([
    prisma.ticket.count({ where: filters }),
    prisma.ticket.count({ where: { ...filters, analysisStatus: { not: "SKIPPED" } } }),
    prisma.ticket.count({ where: { ...filters, analysisStatus: "DONE" } }),
    prisma.ticket.count({ where: { ...filters, isAIHandled: true } }),
    prisma.ticket.aggregate({
      where: { ...filters, analysisStatus: "DONE" },
      _avg: { scoreTotal: true },
    }),
    prisma.ticket.groupBy({
      by: ["automationLevel"],
      where: { ...filters, analysisStatus: "DONE" },
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["frustrationLevel"],
      where: { ...filters, analysisStatus: "DONE" },
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["dayOfWeek"],
      where: filters,
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["hourOfDay"],
      where: filters,
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["primaryIntent"],
      where: { ...filters, analysisStatus: "DONE" },
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["severity"],
      where: { ...filters, analysisStatus: "DONE" },
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["frustrationLevel"],
      where: { ...filters, analysisStatus: "DONE" },
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["rootCauseType"],
      where: { ...filters, analysisStatus: "DONE" },
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["systemicSignal"],
      where: { ...filters, analysisStatus: "DONE" },
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["brand"],
      where: filters,
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["channel"],
      where: filters,
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["moduleL1"],
      where: filters,
      _count: { _all: true },
    }),
    prisma.ticket.groupBy({
      by: ["createdMonth"],
      _count: { _all: true },
      _avg: { scoreTotal: true },
      orderBy: { createdMonth: "asc" },
    }),
  ]);

  const aiHandledPct = totalTickets > 0 ? (aiHandledCount / totalTickets) * 100 : 0;
  
  const fullyAutomatableCount = automationLevels.find(
    (l) => l.automationLevel === "Fully Automatable"
  )?._count._all || 0;
  const automationRate = processedTickets > 0 ? (fullyAutomatableCount / processedTickets) * 100 : 0;

  const highFrustrationCount = frustrationLevels
    .filter((l) => ["Very Frustrated", "Angry"].includes(l.frustrationLevel || ""))
    .reduce((acc, curr) => acc + curr._count._all, 0);
  const highFrustrationRate = processedTickets > 0 ? (highFrustrationCount / processedTickets) * 100 : 0;

  return NextResponse.json({
    totalTickets,
    eligibleTickets,
    processedTickets,
    aiHandledCount,
    aiHandledPct,
    avgScoreTotal: avgScoreResult._avg.scoreTotal,
    automationRate,
    highFrustrationRate,
    byDayOfWeek: byDayOfWeek.map((d) => ({ day: d.dayOfWeek, count: d._count._all })),
    byHourOfDay: byHourOfDay.map((h) => ({ hour: h.hourOfDay, count: h._count._all })),
    byPrimaryIntent: byPrimaryIntent.map((i) => ({ intent: i.primaryIntent, count: i._count._all })),
    bySeverity: bySeverity.map((s) => ({ severity: s.severity, count: s._count._all })),
    byFrustrationLevel: byFrustrationLevel.map((f) => ({ level: f.frustrationLevel, count: f._count._all })),
    byRootCauseType: byRootCauseType.map((r) => ({ type: r.rootCauseType, count: r._count._all })),
    bySystemicSignal: bySystemicSignal.map((s) => ({ signal: s.systemicSignal, count: s._count._all })),
    byBrand: byBrand.map((b) => ({ brand: b.brand, count: b._count._all })),
    byChannel: byChannel.map((c) => ({ channel: c.channel, count: c._count._all })),
    byModule: byModule.map((m) => ({ module: m.moduleL1, count: m._count._all })),
    monthOverMonth: monthOverMonth.map((m) => ({
      month: m.createdMonth,
      count: m._count._all,
      avgScore: m._avg.scoreTotal,
    })),
  });
}
