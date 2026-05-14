"use client";

import React, { useMemo } from "react";
import { useSupport } from "@/lib/context";
import { mockData } from "@/lib/mockData";
import { Card } from "@/components/ui/PrototypeKit";
import { SectionHead, SentimentBar, SentimentChip, Tag } from "@/components/ui/PrototypePrimitives";
import { PageScaffold } from "@/components/ui/PageScaffold";

function frustToColor(f: number) {
  if (f < 3) return '#1F8A5B';
  if (f < 5) return '#E1A23B';
  if (f < 7) return '#E96A3E';
  return '#B2401D';
}

export default function FrustrationPage() {
  const { month, compareWith, openDrawer } = useSupport();
  
  const cur = useMemo(() => mockData.monthAgg(month), [month]);
  const cmp = useMemo(() => compareWith ? mockData.monthAgg(compareWith) : null, [compareWith]);
  const tickets = useMemo(() => mockData.tickets.filter((t: any) => t.month === month && t.team === 'Technical Support' && t.status !== 'Archived'), [month]);

  const mods = useMemo(() => {
    const modSent: any = {};
    tickets.forEach((t: any) => {
      if (!modSent[t.module]) modSent[t.module] = { calm: 0, annoyed: 0, frustrated: 0, furious: 0, total: 0, sum: 0 };
      modSent[t.module][t.sentiment]++;
      modSent[t.module].total++;
      modSent[t.module].sum += t.frustration;
    });
    return Object.entries(modSent).map(([m, v]: any) => ({ m, ...v, avg: v.sum / v.total })).sort((a, b) => b.avg - a.avg);
  }, [tickets]);

  const furious = tickets.filter((t: any) => t.sentiment === 'furious').slice(0, 6);

  return (
    <PageScaffold title="Frustration" subtitle="Where customers wrote in hot — and where the temperature is rising">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Sentiment band — this month" subtitle={`${cur.total.toLocaleString()} tickets · avg ${cur.avgFrustration.toFixed(1)}/10`} />
          <SentimentBar distribution={cur.bySentiment} height={20} showLabels />
          {cmp && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--ss-fg-muted)', marginBottom: 4 }}>Previous: {cmp.total.toLocaleString()} · avg {cmp.avgFrustration.toFixed(1)}/10</div>
              <SentimentBar distribution={cmp.bySentiment} height={10} />
            </div>
          )}
        </Card>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Hottest modules" subtitle="Ranked by average frustration" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mods.slice(0, 6).map(m => (
              <div key={m.m} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 80px 56px', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.m}</span>
                <SentimentBar distribution={m} height={8} />
                <span className="tabular" style={{ fontSize: 12, textAlign: 'right' }}>{m.total}</span>
                <span className="tabular" style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', color: frustToColor(m.avg) }}>{m.avg.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ padding: '16px 18px' }}>
        <SectionHead title="Furious tickets — needing immediate attention" subtitle="A sample drawn from the worst-rated conversations" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
          {furious.map((t: any) => (
            <div key={t.id} className="row-hover" onClick={() => openDrawer(`ticket-${t.id}`)}
              style={{ border: '1px solid var(--ss-neutral-100)', borderRadius: 8, padding: '12px 14px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Tag color="red">{t.id}</Tag>
                <SentimentChip band={t.sentiment} size="sm" />
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 6, color: 'var(--ss-fg)', lineHeight: 1.35 }}>{t.subject}</div>
              <div style={{ fontSize: 11, color: 'var(--ss-fg-muted)', marginTop: 6 }}>{t.module} · {t.area} · {t.intentLabel}</div>
            </div>
          ))}
        </div>
      </Card>
    </PageScaffold>
  );
}
