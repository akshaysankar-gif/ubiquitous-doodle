"use client";

import React, { useMemo } from "react";
import { useSupport } from "@/lib/context";
import { mockData } from "@/lib/mockData";
import { Card } from "@/components/ui/PrototypeKit";
import { Bullet } from "@/components/ui/PrototypePrimitives";
import { PageScaffold } from "@/components/ui/PageScaffold";

function intentColor(k: string) {
  return ({
    'how-to': '#00828D', 'bug': '#E96A3E', 'feature-req': '#7158F5', 'billing': '#E1A23B',
    'access': '#B2401D', 'data': '#475569', 'integration': '#3B82F6', 'complaint': '#B2401D', 'cancellation': '#7A1F1F',
  } as any)[k] || '#00828D';
}

export default function IntentPage() {
  const { month } = useSupport();
  const monthKey = month;

  const tree = useMemo(() => {
    const tickets = mockData.tickets.filter((t: any) => t.month === monthKey && t.team === 'Technical Support' && t.status !== 'Archived');
    const t: any = {};
    tickets.forEach((tick: any) => {
      const i = tick.intent;
      if (!t[i]) t[i] = { label: tick.intentLabel, total: 0, subs: {} };
      t[i].total++;
      t[i].subs[tick.subIntent] = (t[i].subs[tick.subIntent] || 0) + 1;
    });
    return t;
  }, [monthKey]);

  return (
    <PageScaffold title="Intent / Sub-intent" subtitle="What jobs customers were trying to do — and where each job branches">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {Object.entries(tree).sort((a: any, b: any) => b[1].total - a[1].total).map(([k, v]: any) => {
          const color = intentColor(k);
          const subs = Object.entries(v.subs).sort((a: any, b: any) => b[1] - a[1]);
          const max = (subs[0]?.[1] as number) || 1;
          return (
            <Card key={k} style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 99, background: color }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{v.label}</span>
                </div>
                <span className="tabular" style={{ fontSize: 14, fontWeight: 700 }}>{v.total}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {subs.map(([s, n]: any) => (
                  <div key={s}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 2 }}>
                      <span style={{ color: 'var(--ss-fg)' }}>{s}</span>
                      <span className="tabular" style={{ color: 'var(--ss-fg-muted)', fontWeight: 600 }}>{n}</span>
                    </div>
                    <Bullet value={n / max} color={color} height={5} />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </PageScaffold>
  );
}
