import React from 'react';

export const PageScaffold = ({ title, subtitle, intro, children }: any) => (
  <div style={{ flex: 1, padding: 24, background: 'var(--ss-neutral-50)' }}>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, gap: 16 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ss-primary-700)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Metric page</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ss-fg)', margin: '4px 0 0', letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 12.5, color: 'var(--ss-fg-muted)', marginTop: 4 }}>{subtitle}</div>}
      </div>
      {intro}
    </div>
    {children}
  </div>
);
