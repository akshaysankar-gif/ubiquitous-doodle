import React from 'react';
import { Card, Icon, Pill } from './PrototypeKit';
import { SENTIMENT_BANDS } from '@/lib/mockData';

export const SectionHead = ({ title, subtitle, actions, style = {} }: any) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 12, ...style }}>
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ss-fg)', letterSpacing: '-0.005em' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11.5, color: 'var(--ss-fg-muted)', marginTop: 2 }}>{subtitle}</div>}
    </div>
    {actions}
  </div>
);

export const Delta = ({ value, fmt = 'pct', polarity = 'good', size = 'md', emphasize = false }: any) => {
  const v = value;
  if (v == null || Number.isNaN(v)) {
    return <Pill size={size === 'sm' ? 'sm' : 'md'} color="default" leading={false}>—</Pill>;
  }
  const up = v > 0;
  const flat = Math.abs(v) < (fmt === 'pct' ? 0.005 : 0.1);
  const text = flat ? '0' :
    fmt === 'pct' ? `${up ? '+' : ''}${(v * 100).toFixed(1)}%`
    : fmt === 'pt' ? `${up ? '+' : ''}${v.toFixed(1)}pt`
    : `${up ? '+' : ''}${v.toFixed(1)}`;
  let color = 'default';
  if (!flat) {
    const good = polarity === 'good' ? up : !up;
    color = good ? 'green' : 'red';
  }
  const ic = flat ? 'Minus' : (up ? 'TrendingUp' : 'TrendingDown');
  return (
    <Pill size={size === 'sm' ? 'sm' : 'md'} color={color} leading={false} style={emphasize ? { fontWeight: 700 } : undefined}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        <Icon name={ic} size={size === 'sm' ? 11 : 12} />
        <span className="tabular">{text}</span>
      </span>
    </Pill>
  );
};

export const SentimentChip = ({ band, count, total, size = 'md' }: any) => {
  const B = SENTIMENT_BANDS.find(b => b.key === band) || { label: band, swatch: '#999' };
  return (
    <span className={`tabular sent-${band}`} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'sm' ? '2px 8px' : '3px 10px', borderRadius: 99,
      fontSize: size === 'sm' ? 11 : 12, fontWeight: 600,
      whiteSpace: 'nowrap'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: B.swatch }} />
      {B.label}{count != null && <span style={{ opacity: 0.7 }}> · {count.toLocaleString()}</span>}
      {total != null && total > 0 && <span style={{ opacity: 0.6 }}> ({Math.round(count / total * 100)}%)</span>}
    </span>
  );
};

export const SentimentBar = ({ distribution, height = 10, showLabels = false }: any) => {
  const total = (Object.values(distribution).reduce((a: any, b: any) => a + b, 0) as number) || 1;
  return (
    <div>
      <div style={{ display: 'flex', height, borderRadius: 99, overflow: 'hidden', background: 'var(--ss-neutral-100)' }}>
        {SENTIMENT_BANDS.map(b => {
          const c = ((distribution as any)[b.key] || 0) as number;
          if (!c) return null;
          return <div key={b.key} title={`${b.label}: ${c}`}
            style={{ width: `${(c / total) * 100}%`, background: b.swatch }} />;
        })}
      </div>
      {showLabels && (
        <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
          {SENTIMENT_BANDS.map(b => (
            <span key={b.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--ss-fg-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: b.swatch }} />
              {b.label} · <span className="tabular" style={{ color: 'var(--ss-fg)', fontWeight: 600 }}>{((distribution as any)[b.key] || 0) as number}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const Bullet = ({ value, color = 'var(--ss-primary-500)', width = 120, height = 6, bg = 'var(--ss-neutral-100)' }: any) => (
  <div style={{ width, height, background: bg, borderRadius: 99, overflow: 'hidden' }}>
    <div style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', background: color, borderRadius: 99 }} />
  </div>
);

export const Sparkline = ({ values, width = 120, height = 32, stroke = 'var(--ss-primary-500)', fill = 'var(--ss-primary-100)', highlight = true }: any) => {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values.map((v: number, i: number) => [i * step, height - 4 - ((v - min) / range) * (height - 8)]);
  const linePath = pts.map((p: any, i: number) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const areaPath = linePath + ` L ${width} ${height} L 0 ${height} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} className="kpi-spark">
      <path d={areaPath} fill={fill} opacity={0.5} />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {highlight && <circle cx={last[0]} cy={last[1]} r={2.5} fill={stroke} />}
    </svg>
  );
};

export const KpiCard = ({ label, value, delta, deltaFmt = 'pct', polarity = 'good', spark, icon, accent = 'primary' }: any) => {
  const accentMap: any = {
    primary: 'var(--ss-primary-500)', accent: 'var(--ss-accent-500)',
    warning: 'var(--ss-warning-500)', negative: 'var(--ss-negative-500)',
    positive: 'var(--ss-positive-500)', highlight: 'var(--ss-highlight-500)'
  };
  const c = accentMap[accent] || accentMap.primary;
  return (
    <Card style={{ flex: 1, minWidth: 0, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ss-fg-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {icon && <Icon name={icon} size={12} />}
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginTop: 6 }}>
        <div className="tabular" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ss-fg)' }}>{value}</div>
        {delta != null && <Delta value={delta} fmt={deltaFmt} polarity={polarity} />}
      </div>
      {spark && <div style={{ marginTop: 8 }}><Sparkline values={spark} stroke={c} fill={c.replace('500', '100')} width={220} height={36} /></div>}
    </Card>
  );
};

export const Tag = ({ children, color = 'neutral' }: any) => (
  <Pill size="sm" color={color} leading={false} style={{ textTransform: 'none' }}>{children}</Pill>
);
