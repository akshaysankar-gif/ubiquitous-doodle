import React from 'react';
import { Card, Icon, Pill } from './PrototypeKit';
import { SENTIMENT_BANDS } from '@/lib/mockData';

// Ported from ui-prototype/components/Primitives.jsx

export const SectionHead = ({ title, subtitle, actions, style = {} }: any) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 12, ...style }}>
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ss-fg)', letterSpacing: '-0.005em' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11.5, color: 'var(--ss-fg-muted)', marginTop: 2 }}>{subtitle}</div>}
    </div>
    {actions}
  </div>
);

export const Delta = ({ value, fmt = 'pct', polarity = 'good', size = 'md' }: any) => {
  if (value == null) return null;
  const up = value > 0;
  const text = fmt === 'pct' ? `${up ? '+' : ''}${(value * 100).toFixed(1)}%` : value.toFixed(1);
  const color = (polarity === 'good' ? up : !up) ? 'green' : 'red';
  
  return (
    <Pill color={color} size={size}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Icon name={up ? 'TrendingUp' : 'TrendingDown'} size={size === 'sm' ? 11 : 12} />
        <span className="tabular">{text}</span>
      </div>
    </Pill>
  );
};

export const SentimentBar = ({ distribution, height = 10 }: any) => {
  const total = Object.values(distribution).reduce((a: any, b: any) => a + b, 0) || 1;
  return (
    <div style={{ display: 'flex', height, borderRadius: 99, overflow: 'hidden', background: 'var(--ss-neutral-100)' }}>
      {SENTIMENT_BANDS.map(b => {
        const c = (distribution as any)[b.key] || 0;
        if (!c) return null;
        return <div key={b.key} style={{ width: `${(c / total) * 100}%`, background: b.swatch }} />;
      })}
    </div>
  );
};

export const Bullet = ({ value, color = 'var(--ss-primary-500)', width = '100%', height = 4 }: any) => (
  <div style={{ width, height, background: 'var(--ss-neutral-100)', borderRadius: 99, overflow: 'hidden' }}>
    <div style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', background: color }} />
  </div>
);

export const KpiCard = ({ label, value, delta, icon, accent = 'primary' }: any) => {
  const accentMap: any = {
    primary: 'var(--ss-primary-500)',
    accent: 'var(--ss-accent-500)',
    warning: 'var(--ss-warning-500)',
    negative: 'var(--ss-negative-500)',
  };
  return (
    <Card style={{ flex: 1, minWidth: 0, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ss-fg-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {icon && <Icon name={icon} size={12} />}
        <span className="truncate">{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginTop: 6 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ss-fg)' }}>{value}</div>
        {delta != null && <Delta value={delta} size="sm" />}
      </div>
    </Card>
  );
};
