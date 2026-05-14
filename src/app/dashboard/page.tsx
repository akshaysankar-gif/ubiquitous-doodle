"use client";

import React, { useMemo } from "react";
import { useSupport } from "@/lib/context";
import { mockData, MONTHS, INTENTS, ROOT_CAUSES } from "@/lib/mockData";
import { Card, Pill, Icon, Button } from "@/components/ui/PrototypeKit";
import { SectionHead, KpiCard, SentimentBar, Bullet, Delta, SentimentChip } from "@/components/ui/PrototypePrimitives";
import { HeatmapMatrix } from "@/components/HeatmapMatrix";

// SelectablePill helper
const SelectablePill = ({ children, size = 'md', variant = 'outline', state = 'regular', onClick }: any) => {
  const isFilled = variant === 'filled';
  return (
    <div onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: size === 'md' ? 28 : 24, padding: size === 'md' ? '0 12px' : '0 8px',
      borderRadius: 99, cursor: 'pointer',
      fontSize: size === 'md' ? 12 : 11, fontWeight: 600,
      background: isFilled ? 'var(--ss-primary-500)' : 'transparent',
      color: isFilled ? '#fff' : 'var(--ss-fg)',
      border: isFilled ? 'none' : '1px solid var(--ss-neutral-200)',
      opacity: state === 'active' || isFilled ? 1 : 0.6,
      transition: 'all .1s'
    }}>
      {children}
    </div>
  );
};

export default function DashboardPage() {
  const { month, compareMode, compareWith, openDrawer } = useSupport();
  
  const monthKey = month;
  const prevMonthKey = useMemo(() => {
    const i = MONTHS.findIndex(m => m.key === month);
    return i > 0 ? MONTHS[i - 1].key : null;
  }, [month]);

  const cur = useMemo(() => mockData.monthAgg(monthKey), [monthKey]);
  const prev = useMemo(() => prevMonthKey ? mockData.monthAgg(prevMonthKey) : null, [prevMonthKey]);
  const cmp = useMemo(() => compareMode && compareWith ? mockData.monthAgg(compareWith) : prev, [compareMode, compareWith, prev]);

  const [hmMode, setHmMode] = React.useState('count'); // count | frustration

  const matrix = useMemo(() => mockData.moduleIntentMatrix(monthKey), [monthKey]);
  const prevMatrix = useMemo(() => prevMonthKey ? mockData.moduleIntentMatrix(prevMonthKey) : null, [prevMonthKey]);

  const delta = (a: number, b?: number) => b ? (a - b) / b : (a > 0 ? 1 : 0);
  const deltaAbs = (a: number, b?: number) => a - (b || 0);

  const topBlockers = useMemo(() => {
    if (!cur || !cur.byContactCode) return [];
    return Object.entries(cur.byContactCode).map(([code, n]: any) => {
      const prevN = (cmp?.byContactCode?.[code]) || 0;
      return { code, n, prevN, delta: prevN ? (n - prevN) / prevN : (n > 0 ? 1 : 0) };
    }).sort((a, b) => b.n - a.n).slice(0, 6);
  }, [cur, cmp]);

  const movers = useMemo(() => cmp ? mockData.topMovers(cmp.monthKey, monthKey, 6) : [], [monthKey, cmp]);

  const intentRanked = useMemo(() => {
    return INTENTS.map(i => ({
      ...i,
      n: cur.byIntent[i.key] || 0,
      prev: cmp?.byIntent?.[i.key] || 0,
    })).sort((a, b) => b.n - a.n);
  }, [cur, cmp]);

  const sparkHistory = useMemo(() => {
    const months = MONTHS.map(m => m.key);
    return {
      total: months.map(k => mockData.monthAgg(k).total),
      autoShare: months.map(k => mockData.monthAgg(k).aiShare),
      frust: months.map(k => mockData.monthAgg(k).avgFrustration),
      multi: months.map(k => mockData.monthAgg(k).multiTeam),
      effort: months.map(k => mockData.monthAgg(k).avgEffort),
    };
  }, []);

  const headline = useMemo(() => {
    const candidates = topBlockers.filter(b => b.delta > 0.15);
    return candidates[0] || topBlockers[0];
  }, [topBlockers]);

  if (!cur) return null;

  const monthLabel = MONTHS.find(m => m.key === monthKey)?.label || '';
  const headlineChange = headline?.delta || 0;
  const headlineDirection = headlineChange > 0 ? 'spiked' : (headlineChange < -0.05 ? 'cooled' : 'held steady');
  const headlineText = headline 
    ? `${monthLabel}: "${headline.code}" ${headlineDirection} ${Math.round(Math.abs(headlineChange) * 100)}% — the dominant blocker for customers this month.`
    : `${monthLabel} — ${cur.total.toLocaleString()} support tickets analysed.`;

  const topIntent = intentRanked[0];
  const movement = cmp ? (cur.total - cmp.total) : 0;
  const movementText = cmp ? `${movement >= 0 ? '+' : '−'}${Math.abs(movement).toLocaleString()} vs comparison month` : '';
  const bodyText = `${cur.total.toLocaleString()} tickets reached Technical Support${movementText ? ', ' + movementText : ''}. Zoona AI resolved ${Math.round(cur.aiShare * 100)}%. Frustration averaged ${cur.avgFrustration.toFixed(1)}/10, led by ${topIntent?.label.toLowerCase()} (${topIntent?.n.toLocaleString()} tickets).`;

  const iconColorForIntent = (k: string) => {
    return ({
      'how-to': 'var(--ss-primary-500)',
      'bug': 'var(--ss-negative-500)',
      'feature-req': 'var(--ss-accent-500)',
      'billing': 'var(--ss-warning-500)',
      'access': 'var(--ss-warning-600)',
      'data': 'var(--ss-secondary-500)',
      'integration': '#3B82F6',
      'complaint': '#B2401D',
      'cancellation': '#7A1F1F',
    } as any)[k] || 'var(--ss-primary-500)';
  };

  return (
    <div style={{ flex: 1, padding: 24, background: 'var(--ss-neutral-50)' }}>
      {/* Month essence header */}
      <Card style={{
        padding: '20px 24px', marginBottom: 16,
        background: 'linear-gradient(120deg, var(--ss-primary-50) 0%, #fff 60%)',
        borderColor: 'rgba(0,130,141,0.18)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ maxWidth: '58ch' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Pill size="sm" color="mint" leading={false} dot>This month</Pill>
              <span style={{ fontSize: 11.5, color: 'var(--ss-fg-muted)' }}>
                {monthLabel} · Technical Support
              </span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.25, color: 'var(--ss-fg)' }}>
              {headlineText}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ss-fg-muted)', marginTop: 8, lineHeight: 1.55 }}>
              {bodyText}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ss-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sentiment mix</span>
              <span className="tabular" style={{ fontSize: 11, color: 'var(--ss-fg-muted)' }}>avg <strong style={{ color: 'var(--ss-fg)' }}>{cur.avgFrustration.toFixed(1)}</strong>/10</span>
            </div>
            <SentimentBar distribution={cur.bySentiment} height={14} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {['calm', 'annoyed', 'frustrated', 'furious'].map(b => (
                <SentimentChip key={b} band={b} count={cur.bySentiment[b]} total={cur.total} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 16 }}>
        <KpiCard icon="Ticket" label="Tickets analysed" value={cur.total.toLocaleString()}
          delta={delta(cur.total, cmp?.total)} polarity="bad" spark={sparkHistory.total} accent="primary" />
        <KpiCard icon="Bot" label="Solved by Zoona AI" value={`${Math.round(cur.aiShare * 100)}%`}
          delta={delta(cur.aiShare, cmp?.aiShare)} deltaFmt="pt" polarity="good" spark={sparkHistory.autoShare} accent="accent" />
        <KpiCard icon="Flame" label="Avg frustration" value={cur.avgFrustration.toFixed(1)}
          delta={deltaAbs(cur.avgFrustration, cmp?.avgFrustration)} deltaFmt="pt" polarity="bad" spark={sparkHistory.frust} accent="warning" />
        <KpiCard icon="Users" label="Multi-team tickets" value={cur.multiTeam.toLocaleString()}
          delta={delta(cur.multiTeam, cmp?.multiTeam)} polarity="bad" spark={sparkHistory.multi} accent="negative" />
        <KpiCard icon="Gauge" label="Avg effort (h)" value={cur.avgEffort.toFixed(1)}
          delta={deltaAbs(cur.avgEffort, cmp?.avgEffort)} deltaFmt="pt" polarity="bad" spark={sparkHistory.effort} accent="highlight" />
      </div>

      {/* Hero — Heatmap + Right rail */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.1fr) minmax(280px, 1fr)', gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead
            title="Module × Intent heatmap"
            subtitle={hmMode === 'count' ? 'Cell value = ticket count · darker = more tickets · Δ vs previous month inline' : 'Cell shade = avg frustration (calm → furious) · number = ticket count'}
            actions={
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { k: 'count', l: 'Volume' },
                  { k: 'frustration', l: 'Frustration' },
                ].map(o => (
                  <SelectablePill key={o.k} size="md" variant={hmMode === o.k ? 'filled' : 'outline'}
                    state={hmMode === o.k ? 'active' : 'regular'}
                    onClick={() => setHmMode(o.k)}>{o.l}</SelectablePill>
                ))}
              </div>
            } />
          <HeatmapMatrix matrix={matrix} mode={hmMode} prevMatrix={prevMatrix}
            onCell={(c: any) => openDrawer(`cell-${c.module}-${c.intent}`)} />
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 14, color: 'var(--ss-fg-muted)', fontSize: 11 }}>
            <Icon name="Info" size={12} />
            <span>Click any cell to drill into the underlying conversations. Only Technical Support team tickets, excluding Archived.</span>
          </div>
        </Card>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <Card style={{ padding: '14px 16px' }}>
            <SectionHead title="Top blockers" subtitle="Largest contact codes this month" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topBlockers.map((b, i) => {
                const max = topBlockers[0]?.n || 1;
                return (
                  <div key={b.code} className="row-hover" onClick={() => openDrawer(`code-${b.code}`)}
                    style={{ display: 'grid', gridTemplateColumns: '18px 1fr auto auto', gap: 8, alignItems: 'center', cursor: 'pointer', padding: '4px 6px', borderRadius: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ss-fg-muted)' }}>{i + 1}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ss-fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.code}</div>
                      <Bullet value={b.n / max} color="var(--ss-primary-500)" width={'100%'} height={4} />
                    </div>
                    <div className="tabular" style={{ fontSize: 12, fontWeight: 700, color: 'var(--ss-fg)' }}>{b.n}</div>
                    <Delta size="sm" value={b.delta} fmt="pct" polarity="bad" />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card style={{ padding: '14px 16px' }}>
            <SectionHead title="Intent leaderboard" subtitle="What customers are writing in about" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {intentRanked.slice(0, 7).map((it) => {
                const max = intentRanked[0]?.n || 1;
                const d = it.prev ? (it.n - it.prev) / it.prev : (it.n > 0 ? 1 : 0);
                return (
                  <div key={it.key} style={{ display: 'grid', gridTemplateColumns: '1fr 80px auto', gap: 10, alignItems: 'center' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ss-fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</div>
                      <Bullet value={it.n / max} color={iconColorForIntent(it.key)} width="100%" height={4} />
                    </div>
                    <span className="tabular" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ss-fg)', textAlign: 'right' }}>{it.n.toLocaleString()}</span>
                    <Delta size="sm" value={d} fmt="pct" polarity="bad" />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Movers strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.1fr) minmax(280px, 1fr)', gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead
            title="Trending contact codes"
            subtitle={compareMode && compareWith ? `Movement from ${MONTHS.find(m => m.key === compareWith)?.label} → ${monthLabel}` : `Movement from ${MONTHS.find(m => m.key === prevMonthKey)?.label || 'previous'} → ${monthLabel}`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            {movers.map((m: any) => {
              const dir = m.delta >= 0 ? 'up' : 'down';
              return (
                <div key={m.code} className="row-hover" onClick={() => openDrawer(`code-${m.code}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                    borderRadius: 8, border: '1px solid var(--ss-neutral-100)', cursor: 'pointer'
                  }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, background: dir === 'up' ? '#FDD8CE' : '#D7F0D7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Icon name={dir === 'up' ? 'TrendingUp' : 'TrendingDown'} size={14} color={dir === 'up' ? '#9B2C0F' : '#1F5E2A'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ss-fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.code}</div>
                    <div className="tabular" style={{ fontSize: 11, color: 'var(--ss-fg-muted)' }}>{m.a} → {m.b}</div>
                  </div>
                  <Delta size="sm" value={m.pct} fmt="pct" polarity={dir === 'up' ? 'bad' : 'good'} emphasize />
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: '14px 16px' }}>
          <SectionHead title="Root-cause families" subtitle="Where the work really lives" />
          <RootCauseBreakdown monthAgg={cur} prevAgg={cmp} />
        </Card>
      </div>

    </div>
  );
}

// Root cause family donut + list
const RootCauseBreakdown = ({ monthAgg, prevAgg }: any) => {
  const families: any = {};
  const prevFamilies: any = {};
  
  if (monthAgg?.byRoot) {
    Object.entries(monthAgg.byRoot).forEach(([k, v]: any) => {
      const f = ROOT_CAUSES.find(x => x.key === k);
      if (!f) return;
      families[f.family] = (families[f.family] || 0) + v;
    });
  }
  
  if (prevAgg?.byRoot) {
    Object.entries(prevAgg.byRoot).forEach(([k, v]: any) => {
      const f = ROOT_CAUSES.find(x => x.key === k);
      if (!f) return;
      prevFamilies[f.family] = (prevFamilies[f.family] || 0) + v;
    });
  }
  
  const sorted = Object.entries(families).sort((a: any, b: any) => b[1] - a[1]);
  const total = sorted.reduce((a, [, v]: any) => a + v, 0) || 1;

  const palette: any = {
    'Self-serve': '#00828D', 'UX': '#7158F5', 'Engineering': '#E96A3E',
    'Product': '#3B82F6', 'External': '#94896B', 'Enablement': '#1F8A5B',
  };

  const R = 56, C = 60, stroke = 14;
  const circ = 2 * Math.PI * R;
  let offset = 0;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width={C * 2} height={C * 2} viewBox={`0 0 ${C * 2} ${C * 2}`}>
        <circle cx={C} cy={C} r={R} fill="none" stroke="var(--ss-neutral-100)" strokeWidth={stroke} />
        {sorted.map(([fam, v]: any) => {
          const frac = v / total;
          const seg = (
            <circle key={fam}
              cx={C} cy={C} r={R} fill="none"
              stroke={palette[fam] || '#94896B'} strokeWidth={stroke}
              strokeDasharray={`${frac * circ} ${circ}`}
              strokeDashoffset={-offset * circ}
              transform={`rotate(-90 ${C} ${C})`} />
          );
          offset += frac;
          return seg;
        })}
        <text x={C} y={C - 2} textAnchor="middle" fontSize="11" fill="var(--ss-fg-muted)" fontFamily="DM Sans">tickets</text>
        <text x={C} y={C + 14} textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--ss-fg)" fontFamily="DM Sans" className="tabular">{total.toLocaleString()}</text>
      </svg>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map(([fam, v]: any) => {
          const prevV = prevFamilies[fam] || 0;
          const d = prevV ? (v - prevV) / prevV : (v > 0 ? 1 : 0);
          return (
            <div key={fam} style={{ display: 'grid', gridTemplateColumns: '10px 1fr auto auto', gap: 8, alignItems: 'center', fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 99, background: palette[fam] }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fam}</span>
              <span className="tabular" style={{ fontWeight: 600 }}>{Math.round(v / total * 100)}%</span>
              <Delta size="sm" value={d} fmt="pct" polarity="bad" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
