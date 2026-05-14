"use client";

import React, { useMemo } from "react";
import { useSupport } from "@/lib/context";
import { mockData } from "@/lib/mockData";
import { Card, Icon } from "@/components/ui/PrototypeKit";
import { Tag } from "@/components/ui/PrototypePrimitives";
import { PageScaffold } from "@/components/ui/PageScaffold";

export default function SignalsPage() {
  const { month, compareWith } = useSupport();

  const cur = useMemo(() => mockData.monthAgg(month), [month]);
  const cmp = useMemo(() => compareWith ? mockData.monthAgg(compareWith) : null, [compareWith]);

  const signals = useMemo(() => {
    const list = [];

    // 1) Biggest mover up
    const movers = compareWith ? mockData.topMovers(compareWith, month, 12) : [];
    const upMover = movers.find((m: any) => m.pct > 0.3 && m.b >= 10);
    if (upMover) list.push({
      kind: 'spike', severity: 'high',
      title: `${upMover.code} spiked +${Math.round(upMover.pct * 100)}%`,
      body: `${upMover.a} → ${upMover.b} tickets vs prior month — investigate whether a recent release or doc gap is driving this.`,
      action: 'Review release notes & doc coverage for this area',
    });

    // 2) High frustration + low automation = customers stuck
    const tickets = mockData.tickets.filter((t: any) => t.month === month && t.team === 'Technical Support' && t.status !== 'Archived');
    const stuck: any = {};
    tickets.forEach((t: any) => {
      const k = t.module + ' · ' + t.area;
      if (!stuck[k]) stuck[k] = { n: 0, sumF: 0, sumA: 0 };
      stuck[k].n++; stuck[k].sumF += t.frustration; stuck[k].sumA += t.automation;
    });
    const stuckArr = Object.entries(stuck).map(([k, v]: any) => ({ k, n: v.n, frust: v.sumF / v.n, auto: v.sumA / v.n }))
      .filter((x: any) => x.n >= 15 && x.frust > 6 && x.auto < 0.4).sort((a: any, b: any) => b.frust - a.frust);
    if (stuckArr[0]) list.push({
      kind: 'frustration', severity: 'high',
      title: `Customers stuck on "${stuckArr[0].k}"`,
      body: `Frustration averages ${stuckArr[0].frust.toFixed(1)}/10 and automation potential is only ${Math.round(stuckArr[0].auto * 100)}%. ${stuckArr[0].n} tickets this month.`,
      action: 'Eng / Product follow-up — likely product fix needed',
    });

    // 3) Multi-team explosion
    if (cmp && cur.multiTeam > cmp.multiTeam * 1.2) {
      list.push({
        kind: 'effort', severity: 'med',
        title: `Multi-team tickets jumped +${Math.round((cur.multiTeam - cmp.multiTeam) / cmp.multiTeam * 100)}%`,
        body: `${cmp.multiTeam} → ${cur.multiTeam} tickets required 2+ teams. Likely root-cause: cross-cutting bugs or unclear ownership.`,
        action: 'Triage process review · clarify owners',
      });
    }

    // 4) Automation upside
    const autoOpp = Object.entries(cur.byContactCode).filter(([k, n]: any) => {
      const ticks = tickets.filter((t: any) => k === t.module + ' · ' + t.area);
      const auto = ticks.reduce((a: any, t: any) => a + t.automation, 0) / ticks.length;
      return n >= 20 && auto >= 0.7;
    }).sort((a: any, b: any) => b[1] - a[1])[0];
    if (autoOpp) list.push({
      kind: 'opportunity', severity: 'low',
      title: `Automation opportunity in ${autoOpp[0]}`,
      body: `${autoOpp[1]} tickets, >70% deemed automatable — a single help-doc + Zoona AI rule could deflect most of these.`,
      action: 'Self-serve content + AI agent rule',
    });

    // 5) Cancellation creeping
    const cancN = (cur.byIntent.cancellation || 0);
    if (cancN > 10) list.push({
      kind: 'cancellation', severity: 'high',
      title: `${cancN} cancellation conversations this month`,
      body: `Mostly tied to billing edge cases and discoverability of the downgrade path. Worth a retention review.`,
      action: 'Loop in Customer Success for save-team plays',
    });

    return list;
  }, [month, compareWith, cur, cmp]);

  const sevColor: any = { high: 'red', med: 'orange', low: 'mint' };

  return (
    <PageScaffold title="Systemic signals" subtitle="The story buried in the data — themes worth raising to product / eng / leadership">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
        {signals.map((s, i) => (
          <Card key={i} style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <Tag color={sevColor[s.severity]}>{s.severity.toUpperCase()}</Tag>
              <Tag color="neutral">{s.kind}</Tag>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ss-fg-muted)', lineHeight: 1.5 }}>{s.body}</div>
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--ss-neutral-50)', borderRadius: 8, fontSize: 12, color: 'var(--ss-fg)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="Zap" size={14} color="var(--ss-primary-500)" />
              <strong>Suggested action:</strong> {s.action}
            </div>
          </Card>
        ))}
      </div>
    </PageScaffold>
  );
}
