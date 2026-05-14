"use client";

import React, { useMemo } from "react";
import { useSupport } from "@/lib/context";
import { mockData } from "@/lib/mockData";
import { Card } from "@/components/ui/PrototypeKit";
import { SectionHead, Bullet } from "@/components/ui/PrototypePrimitives";
import { PageScaffold } from "@/components/ui/PageScaffold";

function frustToColor(f: number) {
  if (f < 3) return '#1F8A5B';
  if (f < 5) return '#E1A23B';
  if (f < 7) return '#E96A3E';
  return '#B2401D';
}

export default function EffortPage() {
  const { month } = useSupport();

  const tickets = useMemo(() => mockData.tickets.filter((t: any) => t.month === month && t.team === 'Technical Support' && t.status !== 'Archived'), [month]);

  const buckets = useMemo(() => {
    const b: any = { '<1h': 0, '1–2h': 0, '2–4h': 0, '4–8h': 0, '>8h': 0 };
    tickets.forEach((t: any) => {
      const h = t.effortHrs;
      const k = h < 1 ? '<1h' : h < 2 ? '1–2h' : h < 4 ? '2–4h' : h < 8 ? '4–8h' : '>8h';
      b[k]++;
    });
    return b;
  }, [tickets]);

  const teamHisto = useMemo(() => {
    const h: any = { 1: 0, 2: 0, 3: 0, 4: 0 };
    tickets.forEach((t: any) => { h[t.teamsInvolved] = (h[t.teamsInvolved] || 0) + 1; });
    return h;
  }, [tickets]);

  const modEffR = useMemo(() => {
    const modEff: any = {};
    tickets.forEach((t: any) => {
      if (!modEff[t.module]) modEff[t.module] = { n: 0, sum: 0, multi: 0 };
      modEff[t.module].n++; modEff[t.module].sum += t.effortHrs;
      if (t.teamsInvolved > 1) modEff[t.module].multi++;
    });
    return Object.entries(modEff).map(([m, v]: any) => ({ m, n: v.n, avg: v.sum / v.n, multi: v.multi })).sort((a, b) => b.avg - a.avg);
  }, [tickets]);

  const max = Math.max(...Object.values(buckets) as number[]);

  return (
    <PageScaffold title="Support effort" subtitle="How much support time these tickets consumed — and where teams had to collaborate">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Resolution time distribution" />
          <div style={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 10 }}>
            {Object.entries(buckets).map(([k, v]: any) => (
              <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%', height: `${(v / max) * 100}%`, background: 'var(--ss-primary-500)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                    <div className="tabular" style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 600, color: 'var(--ss-fg)' }}>{v}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--ss-fg-muted)' }}>{k}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Teams involved" subtitle="Multi-team tickets are the expensive ones" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(teamHisto).map(([k, v]: any) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 60px', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{k} team{k == '1' ? '' : 's'}</span>
                <Bullet value={v / Math.max(...Object.values(teamHisto) as number[])} color={k > 1 ? 'var(--ss-warning-500)' : 'var(--ss-primary-500)'} width="100%" height={8} />
                <span className="tabular" style={{ textAlign: 'right', fontSize: 13, fontWeight: 700 }}>{v.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ padding: '16px 18px' }}>
        <SectionHead title="Most expensive modules" subtitle="Highest avg effort + frequent multi-team handoffs" />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 100px', gap: 10, padding: '4px 8px', fontSize: 10, color: 'var(--ss-fg-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <span>Module</span><span style={{ textAlign: 'right' }}>Tickets</span><span style={{ textAlign: 'right' }}>Avg hrs</span><span style={{ textAlign: 'right' }}>Multi-team</span>
        </div>
        {modEffR.map(r => (
          <div key={r.m} style={{ display: 'grid', gridTemplateColumns: '2fr 100px 100px 100px', gap: 10, padding: '10px 8px', borderTop: '1px solid var(--ss-neutral-100)', alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{r.m}</span>
            <span className="tabular" style={{ textAlign: 'right', fontSize: 12 }}>{r.n}</span>
            <span className="tabular" style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, color: frustToColor(r.avg * 1.5) }}>{r.avg.toFixed(1)}</span>
            <span className="tabular" style={{ textAlign: 'right', fontSize: 12, fontWeight: 600 }}>{r.multi} <span style={{ color: 'var(--ss-fg-muted)', fontWeight: 400 }}>({Math.round(r.multi / r.n * 100)}%)</span></span>
          </div>
        ))}
      </Card>
    </PageScaffold>
  );
}
