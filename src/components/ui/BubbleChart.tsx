"use client";

import React from 'react';

export const ENCODINGS: any = {
  'volume-frustration': {
    x: { key: 'n', label: 'Volume (tickets)', fmt: 'int', min: 0 },
    y: { key: 'frust', label: 'Avg frustration (0–10)', fmt: 'one', min: 0, max: 10 },
    size: { key: 'effort', label: 'Avg effort (hrs)', min: 8, max: 36 },
    color: { key: 'module', label: 'Module', mode: 'category' },
  },
  'volume-automation': {
    x: { key: 'n', label: 'Volume (tickets)', fmt: 'int', min: 0 },
    y: { key: 'automation', label: 'Automation potential', fmt: 'pct', min: 0, max: 1 },
    size: { key: 'effort', label: 'Avg effort (hrs)', min: 8, max: 36 },
    color: { key: 'module', label: 'Module', mode: 'category' },
  },
  'growth-volume': {
    x: { key: 'mom', label: 'MoM growth %', fmt: 'pct', symmetric: true },
    y: { key: 'n', label: 'Volume (tickets)', fmt: 'int', min: 0 },
    size: { key: 'frust', label: 'Avg frustration', min: 8, max: 36, vmin: 0, vmax: 10 },
    color: { key: 'dominantFamily', label: 'Root-cause family', mode: 'category' },
  },
};

const FAMILY_COLORS: any = {
  'Self-serve': '#00828D', 'UX': '#7158F5', 'Engineering': '#E96A3E',
  'Product': '#3B82F6', 'External': '#94896B', 'Enablement': '#1F8A5B',
};
const MODULE_COLORS: any = {
  'Survey Builder': '#00828D', 'Distribution': '#7158F5', 'Audience': '#3B82F6',
  'Reports': '#1F8A5B', 'Integrations': '#E96A3E', 'Account': '#B2401D',
  'ThriveSparrow': '#E1A23B', 'SparrowDesk': '#475569',
};

export const BubbleChart = ({ data, encoding = 'volume-frustration', height = 420, onHover, onClick, highlightKey = null }: any) => {
  const E = ENCODINGS[encoding] || ENCODINGS['volume-frustration'];
  const W = 920;
  const H = height;
  const margin = { l: 64, r: 24, t: 16, b: 48 };
  const innerW = W - margin.l - margin.r;
  const innerH = H - margin.t - margin.b;

  let xs = data.map((d: any) => d[E.x.key]);
  let ys = data.map((d: any) => d[E.y.key]);
  let xMin = E.x.min != null ? E.x.min : Math.min(...xs);
  let xMax = E.x.max != null ? E.x.max : Math.max(...xs);
  let yMin = E.y.min != null ? E.y.min : Math.min(...ys);
  let yMax = E.y.max != null ? E.y.max : Math.max(...ys);

  if (E.x.symmetric) {
    const a = Math.max(Math.abs(xMin), Math.abs(xMax), 0.2);
    xMin = -a; xMax = a;
  } else {
    xMax = xMax + (xMax - xMin) * 0.08 + 1;
  }
  if (!E.y.max) yMax = yMax + (yMax - yMin) * 0.08 + 1;

  const sx = (v: number) => margin.l + ((v - xMin) / (xMax - xMin || 1)) * innerW;
  const sy = (v: number) => margin.t + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;

  const sizes = data.map((d: any) => d[E.size.key]);
  const sMin = E.size.vmin != null ? E.size.vmin : Math.min(...sizes);
  const sMax = E.size.vmax != null ? E.size.vmax : Math.max(...sizes);
  const sr = (v: number) => {
    const t = (v - sMin) / Math.max(0.001, sMax - sMin);
    const tt = Math.sqrt(Math.max(0, Math.min(1, t)));
    return E.size.min + tt * (E.size.max - E.size.min);
  };

  const colorFor = (d: any) => {
    const k = d[E.color.key];
    if (E.color.key === 'dominantFamily') return FAMILY_COLORS[k] || '#94896B';
    if (E.color.key === 'module') return MODULE_COLORS[k] || '#94896B';
    return '#00828D';
  };

  const xTicks = niceTicks(xMin, xMax, 6);
  const yTicks = niceTicks(yMin, yMax, 5);
  const fmt = (v: number, kind: string) => {
    if (kind === 'int') return Math.round(v).toLocaleString();
    if (kind === 'pct') return `${Math.round(v * 100)}%`;
    if (kind === 'one') return v.toFixed(1);
    return v;
  };

  const sorted = [...data].sort((a: any, b: any) => b[E.size.key] - a[E.size.key]);

  return (
    <div style={{ width: '100%', overflow: 'auto' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {yTicks.map((t, i) => (
          <g key={'y' + i}>
            <line x1={margin.l} x2={margin.l + innerW} y1={sy(t)} y2={sy(t)} stroke="var(--ss-neutral-100)" />
            <text x={margin.l - 8} y={sy(t) + 3} textAnchor="end" fontSize="10" fill="var(--ss-fg-muted)" fontFamily="DM Sans">{fmt(t, E.y.fmt)}</text>
          </g>
        ))}
        {xTicks.map((t, i) => (
          <g key={'x' + i}>
            <line y1={margin.t} y2={margin.t + innerH} x1={sx(t)} x2={sx(t)} stroke="var(--ss-neutral-100)" />
            <text y={margin.t + innerH + 16} x={sx(t)} textAnchor="middle" fontSize="10" fill="var(--ss-fg-muted)" fontFamily="DM Sans">{fmt(t, E.x.fmt)}</text>
          </g>
        ))}
        {E.x.symmetric && (
          <line x1={sx(0)} x2={sx(0)} y1={margin.t} y2={margin.t + innerH} stroke="var(--ss-neutral-300)" strokeDasharray="3 3" />
        )}
        <text x={margin.l + innerW / 2} y={H - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--ss-fg)" fontFamily="DM Sans">{E.x.label}</text>
        <text x={-margin.t - innerH / 2} y={14} transform="rotate(-90)" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--ss-fg)" fontFamily="DM Sans">{E.y.label}</text>

        {sorted.map(d => {
          const r = sr(d[E.size.key]);
          const c = colorFor(d);
          const isHi = highlightKey && d.key === highlightKey;
          return (
            <g key={d.key} className="bubble" style={{ cursor: 'pointer' }}
              onMouseEnter={() => onHover && onHover(d)} onMouseLeave={() => onHover && onHover(null)}
              onClick={() => onClick && onClick(d)}>
              <circle cx={sx(d[E.x.key])} cy={sy(d[E.y.key])} r={r}
                fill={c} fillOpacity={isHi ? 0.85 : 0.55} stroke={c} strokeOpacity={0.9} strokeWidth={isHi ? 2 : 1} />
              {r >= 18 && (
                <text x={sx(d[E.x.key])} y={sy(d[E.y.key]) + 3} textAnchor="middle"
                  fontSize="10" fontWeight="700" fill="#fff" fontFamily="DM Sans" style={{ pointerEvents: 'none' }}>
                  {d.n}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

function niceTicks(min: number, max: number, n = 5) {
  if (max - min === 0) { max = min + 1; }
  const span = max - min;
  const step0 = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const norm = step0 / mag;
  let step;
  if (norm < 1.5) step = 1 * mag;
  else if (norm < 3) step = 2 * mag;
  else if (norm < 7) step = 5 * mag;
  else step = 10 * mag;
  const start = Math.ceil(min / step) * step;
  const out = [];
  for (let v = start; v <= max + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}

export const BubbleLegend = ({ encoding }: any) => {
  const E = ENCODINGS[encoding];
  if (!E) return null;
  const entries = E.color.key === 'dominantFamily'
    ? Object.entries(FAMILY_COLORS)
    : Object.entries(MODULE_COLORS);
  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
      {entries.map(([k, c]) => (
        <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--ss-fg)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 99, background: c as string }} />{k}
        </span>
      ))}
    </div>
  );
};
