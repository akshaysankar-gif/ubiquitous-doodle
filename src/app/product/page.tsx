"use client";

import React, { useMemo } from "react";
import { useSupport } from "@/lib/context";
import { mockData } from "@/lib/mockData";
import { Card } from "@/components/ui/PrototypeKit";
import { Bullet } from "@/components/ui/PrototypePrimitives";
import { PageScaffold } from "@/components/ui/PageScaffold";

const MODULE_COLORS: any = {
  'Survey Builder': '#00828D', 'Distribution': '#7158F5', 'Audience': '#3B82F6',
  'Reports': '#1F8A5B', 'Integrations': '#E96A3E', 'Account': '#B2401D',
  'ThriveSparrow': '#E1A23B', 'SparrowDesk': '#475569',
};

function frustToColor(f: number) {
  if (f < 3) return '#1F8A5B';
  if (f < 5) return '#E1A23B';
  if (f < 7) return '#E96A3E';
  return '#B2401D';
}

export default function ProductPage() {
  const { month, openDrawer } = useSupport();
  const monthKey = month;

  const moduleEntries = useMemo(() => {
    const tickets = mockData.tickets.filter((t: any) => t.month === monthKey && t.team === 'Technical Support' && t.status !== 'Archived');
    const byModuleArea: any = {};
    tickets.forEach((t: any) => {
      if (!byModuleArea[t.module]) byModuleArea[t.module] = { total: 0, areas: {} };
      byModuleArea[t.module].total++;
      if (!byModuleArea[t.module].areas[t.area]) byModuleArea[t.module].areas[t.area] = { n: 0, frust: 0, sum: 0, subs: {} };
      const A = byModuleArea[t.module].areas[t.area];
      A.n++; A.sum += t.frustration; A.frust = A.sum / A.n;
      A.subs[t.subarea] = (A.subs[t.subarea] || 0) + 1;
    });
    return Object.entries(byModuleArea).sort((a: any, b: any) => b[1].total - a[1].total);
  }, [monthKey]);

  return (
    <PageScaffold title="Product hotspots" subtitle="Module → Area → Subarea — exactly where the product is generating support load">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {moduleEntries.map(([mod, info]: any) => {
          const areas = Object.entries(info.areas).sort((a: any, b: any) => b[1].n - a[1].n);
          const max = (areas[0]?.[1] as any)?.n || 1;
          return (
            <Card key={mod} style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 6, height: 24, borderRadius: 3, background: MODULE_COLORS[mod] || '#00828D' }} />
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{mod}</span>
                </div>
                <span className="tabular" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ss-fg-muted)' }}>{info.total} tickets</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {areas.map(([area, a]: any) => {
                  const topSub = Object.entries(a.subs).sort((x: any, y: any) => y[1] - x[1])[0];
                  return (
                    <div key={area} onClick={() => openDrawer(`area-${mod}::${area}`)}
                      className="row-hover" style={{ border: '1px solid var(--ss-neutral-100)', borderRadius: 8, padding: '10px 12px', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{area}</span>
                        <span className="tabular" style={{ fontSize: 12, fontWeight: 700 }}>{a.n}</span>
                      </div>
                      <Bullet value={a.n / max} color={frustToColor(a.frust)} height={5} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, fontSize: 10.5, color: 'var(--ss-fg-muted)' }}>
                        <span>Top: <strong style={{ color: 'var(--ss-fg)' }}>{topSub?.[0] as string}</strong></span>
                        <span className="tabular">frust {a.frust.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </PageScaffold>
  );
}
