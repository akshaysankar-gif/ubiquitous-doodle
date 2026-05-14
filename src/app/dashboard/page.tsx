"use client";

import React from "react";
import { useSupport } from "@/lib/context";
import { mockData, MONTHS } from "@/lib/mockData";
import { Card, Pill } from "@/components/ui/PrototypeKit";
import { SectionHead, KpiCard, SentimentBar, Bullet, Delta } from "@/components/ui/PrototypePrimitives";

export default function DashboardPage() {
  const { month } = useSupport();
  const cur = mockData.monthAgg(month);
  const monthLabel = MONTHS.find(m => m.key === month)?.label || month;

  // Mocked top blockers based on intents
  const topBlockers = Object.entries(cur.byIntent)
    .map(([intent, count]: any) => ({ intent, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero Card */}
      <Card style={{
        padding: '20px 24px', 
        background: 'linear-gradient(120deg, var(--ss-primary-50) 0%, #fff 60%)',
        borderColor: 'rgba(0,130,141,0.18)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ maxWidth: '58ch' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Pill color="mint" size="sm" dot>This month</Pill>
              <span style={{ fontSize: 11.5, color: 'var(--ss-fg-muted)' }}>
                {monthLabel} · Technical Support
              </span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.25, color: 'var(--ss-fg)' }}>
              {monthLabel}: Support volume held steady — resolving {Math.round(cur.aiShare * 100)}% via automation.
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ss-fg-muted)', marginTop: 8, lineHeight: 1.55 }}>
              {cur.total.toLocaleString()} tickets reached technical support. Frustration averaged {cur.avgFrustration.toFixed(1)}/10.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ss-fg-muted)', textTransform: 'uppercase' }}>Sentiment mix</span>
              <span style={{ fontSize: 11, color: 'var(--ss-fg-muted)' }}>avg <strong style={{ color: 'var(--ss-fg)' }}>{cur.avgFrustration.toFixed(1)}</strong>/10</span>
            </div>
            <SentimentBar distribution={cur.bySentiment} height={14} />
          </div>
        </div>
      </Card>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        <KpiCard icon="Ticket" label="Tickets analysed" value={cur.total.toLocaleString()} delta={0.05} />
        <KpiCard icon="Bot" label="Solved by Zoona AI" value={`${Math.round(cur.aiShare * 100)}%`} accent="accent" />
        <KpiCard icon="Flame" label="Avg frustration" value={cur.avgFrustration.toFixed(1)} accent="warning" delta={0.1} />
        <KpiCard icon="Users" label="Multi-team work" value={cur.multiTeam} accent="negative" />
        <KpiCard icon="Gauge" label="Avg effort (h)" value={cur.avgEffort.toFixed(1)} accent="primary" />
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 1fr', gap: 16 }}>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Module × Intent heatmap" subtitle="Cell value = ticket count · darker = more tickets" />
          <div style={{ height: 320, background: 'var(--ss-neutral-50)', border: '1px dashed var(--ss-border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ss-fg-muted)', fontSize: 13 }}>
            Heatmap porting in next step...
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: '14px 16px' }}>
            <SectionHead title="Top blockers" subtitle="Largest intent categories" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topBlockers.map((b: any, i: number) => (
                <div key={b.intent} className="row-hover" style={{ display: 'grid', gridTemplateColumns: '18px 1fr auto auto', gap: 8, alignItems: 'center', padding: '4px 6px', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ss-fg-muted)' }}>{i + 1}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ss-fg)', truncate: true }}>{b.intent}</div>
                    <Bullet value={b.count / cur.total * 2} height={4} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ss-fg)' }}>{b.count}</div>
                  <Delta value={0.05} size="sm" polarity="bad" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
