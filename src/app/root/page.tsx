"use client";

import React, { useMemo } from "react";
import { useSupport } from "@/lib/context";
import { mockData } from "@/lib/mockData";
import { Card, Icon } from "@/components/ui/PrototypeKit";
import { Bullet, Tag } from "@/components/ui/PrototypePrimitives";
import { PageScaffold } from "@/components/ui/PageScaffold";

function familyColor(fam: string) {
  return ({ 'Self-serve': 'mint', 'UX': 'purple', 'Engineering': 'red', 'Product': 'mint', 'External': 'neutral', 'Enablement': 'green' } as any)[fam] || 'default';
}

export default function RootCausePage() {
  const { month } = useSupport();

  const sorted = useMemo(() => {
    const tickets = mockData.tickets.filter((t: any) => t.month === month && t.team === 'Technical Support' && t.status !== 'Archived');
    const byCause: any = {};
    tickets.forEach((t: any) => {
      if (!byCause[t.rootCause]) byCause[t.rootCause] = { cause: t.rootCauseLabel, family: t.rootCauseFamily, n: 0, modules: {}, examples: [] };
      byCause[t.rootCause].n++;
      byCause[t.rootCause].modules[t.module] = (byCause[t.rootCause].modules[t.module] || 0) + 1;
      if (byCause[t.rootCause].examples.length < 3) byCause[t.rootCause].examples.push(t.subject);
    });
    return Object.entries(byCause).sort((a: any, b: any) => b[1].n - a[1].n);
  }, [month]);

  const tickets = mockData.tickets.filter((t: any) => t.month === month && t.team === 'Technical Support' && t.status !== 'Archived');
  const total = tickets.length || 1;

  return (
    <PageScaffold title="Root cause" subtitle="Why this month's tickets were generated, grouped by the underlying cause">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {sorted.map(([k, c]: any) => {
          const topModules = Object.entries(c.modules).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3);
          return (
            <Card key={k} style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <Tag color={familyColor(c.family)}>{c.family}</Tag>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6 }}>{c.cause}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="tabular" style={{ fontSize: 20, fontWeight: 700 }}>{c.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--ss-fg-muted)' }}>{Math.round(c.n / total * 100)}% of month</div>
                </div>
              </div>
              <Bullet value={c.n / (sorted[0][1] as any).n} color="var(--ss-primary-500)" height={5} />
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--ss-fg-muted)' }}>Most affected modules</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                {topModules.map(([m, n]: any) => (
                  <span key={m} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 99, background: 'var(--ss-neutral-50)', border: '1px solid var(--ss-neutral-100)', fontSize: 11, fontWeight: 500 }}>
                    {m} <span className="tabular" style={{ color: 'var(--ss-fg-muted)', fontWeight: 600 }}>· {n}</span>
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--ss-fg-muted)' }}>Example subjects</div>
              <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none' }}>
                {c.examples.map((ex: string, i: number) => (
                  <li key={i} style={{
                    fontSize: 11.5, color: 'var(--ss-fg)', padding: '3px 0', lineHeight: 1.4,
                    borderTop: i ? '1px dashed var(--ss-neutral-100)' : 'none'
                  }}>
                    <Icon name="Quote" size={10} color="var(--ss-fg-muted)" /> <span style={{ marginLeft: 4 }}>{ex}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </PageScaffold>
  );
}
