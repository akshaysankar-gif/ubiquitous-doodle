"use client";

import React, { useMemo } from "react";
import { useSupport } from "@/lib/context";
import { mockData, MONTHS } from "@/lib/mockData";
import { Card } from "@/components/ui/PrototypeKit";
import { SectionHead, Delta, Sparkline } from "@/components/ui/PrototypePrimitives";
import { PageScaffold } from "@/components/ui/PageScaffold";

export default function ContactCodesPage() {
  const { month, compareWith, openDrawer } = useSupport();
  
  const cur = useMemo(() => mockData.monthAgg(month), [month]);
  const cmp = useMemo(() => compareWith ? mockData.monthAgg(compareWith) : null, [compareWith]);

  const rows = useMemo(() => {
    const all = new Set([...Object.keys(cur.byContactCode || {}), ...Object.keys(cmp?.byContactCode || {})]);
    return [...all].map(code => {
      const a = cur.byContactCode[code] || 0;
      const b = cmp?.byContactCode?.[code] || 0;
      return { code, a, b, delta: a - b, pct: b ? (a - b) / b : (a > 0 ? 1 : 0) };
    });
  }, [cur, cmp]);

  const up = rows.filter(r => r.delta > 0).sort((x, y) => y.delta - x.delta).slice(0, 10);
  const down = rows.filter(r => r.delta < 0).sort((x, y) => x.delta - y.delta).slice(0, 10);

  const spark = (code: string) => MONTHS.map(m => mockData.monthAgg(m.key).byContactCode[code] || 0);

  const Row = ({ r }: any) => (
    <div className="row-hover" onClick={() => openDrawer(`code-${r.code}`)}
      style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px 90px', gap: 12, alignItems: 'center', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--ss-neutral-100)', cursor: 'pointer' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.code}</div>
        <div className="tabular" style={{ fontSize: 11, color: 'var(--ss-fg-muted)' }}>{r.b} → {r.a}</div>
      </div>
      <Sparkline values={spark(r.code)} width={120} height={28}
        stroke={r.delta >= 0 ? 'var(--ss-negative-500)' : 'var(--ss-positive-500)'}
        fill={r.delta >= 0 ? 'rgba(233,106,62,0.12)' : 'rgba(31,138,91,0.12)'} />
      <span className="tabular" style={{ textAlign: 'right', fontSize: 12.5, fontWeight: 700, color: r.delta >= 0 ? 'var(--ss-negative-600)' : 'var(--ss-positive-600)' }}>{r.delta > 0 ? '+' : ''}{r.delta}</span>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Delta size="sm" value={r.pct} fmt="pct" polarity="bad" /></div>
    </div>
  );

  return (
    <PageScaffold title="Contact codes" subtitle="Which Module · Area buckets are trending — month-over-month">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Trending up" subtitle="Watch list — these need attention" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{up.map(r => <Row key={r.code} r={r} />)}</div>
        </Card>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Trending down" subtitle="Wins — fewer customer headaches" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{down.map(r => <Row key={r.code} r={r} />)}</div>
        </Card>
      </div>
    </PageScaffold>
  );
}
