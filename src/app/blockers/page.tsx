"use client";

import React, { useMemo } from "react";
import { useSupport } from "@/lib/context";
import { mockData, MONTHS } from "@/lib/mockData";
import { Card } from "@/components/ui/PrototypeKit";
import { SectionHead, Delta, Bullet } from "@/components/ui/PrototypePrimitives";
import { PageScaffold } from "@/components/ui/PageScaffold";

export default function BlockersPage() {
  const { month, compareWith, openDrawer } = useSupport();
  const monthKey = month;
  const cmpKey = compareWith;

  const cur = useMemo(() => mockData.monthAgg(monthKey), [monthKey]);
  const cmp = useMemo(() => cmpKey ? mockData.monthAgg(cmpKey) : null, [cmpKey]);

  const blockers = useMemo(() => {
    if (!cur.byContactCode) return [];
    return Object.entries(cur.byContactCode).map(([code, n]: any) => {
      const prev = cmp?.byContactCode?.[code] || 0;
      return { code, n, prev, pct: prev ? (n - prev) / prev : (n > 0 ? 1 : 0) };
    }).sort((a, b) => b.n - a.n);
  }, [cur, cmp]);

  const top10 = blockers.slice(0, 10);
  const monthLabel = (MONTHS.find(m => m.key === monthKey) || {}).label;

  return (
    <PageScaffold title="Customer blockers" subtitle={`The largest reasons people contacted support in ${monthLabel}`}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Top 10 contact codes" subtitle="By volume · with delta vs previous month" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {top10.map((b, i) => {
              const max = top10[0]?.n || 1;
              return (
                <div key={b.code} className="row-hover" onClick={() => openDrawer(`code-${b.code}`)}
                  style={{ display: 'grid', gridTemplateColumns: '24px 1fr 80px 90px', gap: 12, alignItems: 'center', padding: '12px 8px', borderTop: i === 0 ? 'none' : '1px solid var(--ss-neutral-100)', cursor: 'pointer' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ss-fg-muted)' }}>{i + 1}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ss-fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.code}</div>
                    <div style={{ marginTop: 6 }}><Bullet value={b.n / max} color="var(--ss-primary-500)" width={'100%'} height={6} /></div>
                  </div>
                  <span className="tabular" style={{ fontSize: 14, fontWeight: 700, textAlign: 'right' }}>{b.n}</span>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Delta size="sm" value={b.pct} fmt="pct" polarity="bad" /></div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="What's getting worse" subtitle="Largest % growth (≥10 tickets)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {blockers.filter(b => b.n >= 10).sort((a, b) => b.pct - a.pct).slice(0, 6).map(b => (
              <div key={b.code} className="row-hover" onClick={() => openDrawer(`code-${b.code}`)}
                style={{ padding: '10px 12px', border: '1px solid var(--ss-neutral-100)', borderRadius: 8, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.code}</span>
                  <Delta size="sm" value={b.pct} fmt="pct" polarity="bad" emphasize />
                </div>
                <div className="tabular" style={{ fontSize: 11, color: 'var(--ss-fg-muted)', marginTop: 2 }}>{b.prev} → {b.n} tickets</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageScaffold>
  );
}
