"use client";

import React, { useMemo } from "react";
import { useSupport } from "@/lib/context";
import { mockData } from "@/lib/mockData";
import { Card } from "@/components/ui/PrototypeKit";
import { SectionHead, Bullet, Tag } from "@/components/ui/PrototypePrimitives";
import { PageScaffold } from "@/components/ui/PageScaffold";

export default function AutomationPage() {
  const { month, openDrawer } = useSupport();

  const tickets = useMemo(() => mockData.tickets.filter((t: any) => t.month === month && t.team === 'Technical Support' && t.status !== 'Archived'), [month]);

  const buckets = useMemo(() => {
    const b: any = { 'High (≥0.7)': [], 'Medium (0.4–0.7)': [], 'Low (<0.4)': [] };
    tickets.forEach((t: any) => {
      const k = t.automation >= 0.7 ? 'High (≥0.7)' : t.automation >= 0.4 ? 'Medium (0.4–0.7)' : 'Low (<0.4)';
      b[k].push(t);
    });
    return b;
  }, [tickets]);

  const ranked = useMemo(() => {
    const modAuto: any = {};
    tickets.forEach((t: any) => {
      if (!modAuto[t.module]) modAuto[t.module] = { n: 0, sum: 0 };
      modAuto[t.module].n++; modAuto[t.module].sum += t.automation;
    });
    return Object.entries(modAuto).map(([m, v]: any) => ({ m, n: v.n, avg: v.sum / v.n })).sort((a, b) => b.avg - a.avg);
  }, [tickets]);

  const high = tickets.filter((t: any) => t.automation >= 0.75).slice(0, 8);

  return (
    <PageScaffold title="Automation potential" subtitle="Could Zoona AI handle this work? — scored per ticket, rolled up to module & intent">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
        {Object.entries(buckets).map(([k, arr]: any) => {
          const pct = arr.length / (tickets.length || 1);
          return (
            <Card key={k} style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ss-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <div className="tabular" style={{ fontSize: 26, fontWeight: 700 }}>{arr.length.toLocaleString()}</div>
                <span style={{ fontSize: 12, color: 'var(--ss-fg-muted)' }}>{Math.round(pct * 100)}% of tickets</span>
              </div>
              <div style={{ marginTop: 8 }}><Bullet value={pct} color={k.startsWith('High') ? 'var(--ss-positive-500)' : k.startsWith('Medium') ? 'var(--ss-warning-500)' : 'var(--ss-neutral-300)'} width="100%" height={6} /></div>
            </Card>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Best automation candidates by module" subtitle="High avg potential = self-serve content / Zoona AI win" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ranked.map(r => (
              <div key={r.m} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px 60px', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{r.m}</span>
                <Bullet value={r.avg} color="var(--ss-positive-500)" width="100%" height={6} />
                <span className="tabular" style={{ textAlign: 'right', fontSize: 12, color: 'var(--ss-fg-muted)' }}>{r.n}</span>
                <span className="tabular" style={{ textAlign: 'right', fontSize: 13, fontWeight: 700 }}>{Math.round(r.avg * 100)}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="High-confidence automation candidates" subtitle="Tickets Zoona AI could likely handle next month" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {high.map((t: any) => (
              <div key={t.id} onClick={() => openDrawer(`ticket-${t.id}`)} className="row-hover"
                style={{ border: '1px solid var(--ss-neutral-100)', borderRadius: 8, padding: '10px 12px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color="mint">{Math.round(t.automation * 100)}% auto</Tag>
                  <span style={{ fontSize: 11, color: 'var(--ss-fg-muted)' }}>{t.module} · {t.area}</span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 6, lineHeight: 1.35 }}>{t.subject}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageScaffold>
  );
}
