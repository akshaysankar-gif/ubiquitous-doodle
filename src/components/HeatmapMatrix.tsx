import React from 'react';

// Ported from ui-prototype/components/Heatmap.jsx

export const HeatmapMatrix = ({ matrix, mode = 'count', onCell, prevMatrix = null }: any) => {
  const { modules, intents, cells } = matrix;
  // global max for shading
  let max = 0;
  modules.forEach((m: string) => intents.forEach((i: any) => { max = Math.max(max, cells[m][i.key].count); }));
  
  // Row + col totals
  const rowTotals: any = {}, colTotals: any = {};
  let grand = 0;
  modules.forEach((m: string) => {
    rowTotals[m] = 0;
    intents.forEach((i: any) => {
      const c = cells[m][i.key].count;
      rowTotals[m] += c;
      colTotals[i.key] = (colTotals[i.key] || 0) + c;
      grand += c;
    });
  });

  const intensity = (v: number, m = max) => m ? v / m : 0;
  
  const frustColor = (f: number) => {
    const stops = [
      [0, '#D7F0D7'], [3, '#E8F0CB'], [5, '#FDE2B8'], [7, '#FDD8CE'], [9, '#F4C2C2'],
    ];
    let lo = stops[0], hi = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) { 
      if (f >= (stops[i][0] as number) && f <= (stops[i + 1][0] as number)) { 
        lo = stops[i]; hi = stops[i + 1]; break; 
      } 
    }
    const t = (f - (lo[0] as number)) / Math.max(0.1, (hi[0] as number) - (lo[0] as number));
    const mix = (a: string, b: string) => {
      const pa = a.replace('#', ''); const pb = b.replace('#', '');
      const ra = parseInt(pa.slice(0, 2), 16), ga = parseInt(pa.slice(2, 4), 16), ba = parseInt(pa.slice(4, 6), 16);
      const rb = parseInt(pb.slice(0, 2), 16), gb = parseInt(pb.slice(2, 4), 16), bb = parseInt(pb.slice(4, 6), 16);
      const r = Math.round(ra + (rb - ra) * t), g = Math.round(ga + (gb - ga) * t), bl = Math.round(ba + (bb - ba) * t);
      return `rgb(${r},${g},${bl})`;
    };
    return mix(lo[1] as string, hi[1] as string);
  };

  const countColor = (v: number) => {
    const t = intensity(v);
    const lerp = (a: number, b: number) => Math.round(a + (b - a) * Math.pow(t, 0.6));
    const r = lerp(229, 0), g = lerp(244, 85), b = lerp(245, 92);
    return `rgb(${r},${g},${b})`;
  };
  const countFg = (v: number) => intensity(v) > 0.45 ? '#fff' : 'var(--ss-fg)';

  const tableWrap: any = {
    overflow: 'auto',
    borderRadius: 8,
    border: '1px solid var(--ss-border)',
  };
  const intentLabelStyle: any = {
    fontSize: 11, fontWeight: 600, color: 'var(--ss-fg-muted)',
    padding: '10px 6px', textAlign: 'center',
    background: 'var(--ss-neutral-50)',
    borderBottom: '1px solid var(--ss-border)',
    whiteSpace: 'nowrap',
    minWidth: 80,
  };
  const moduleLabelStyle: any = {
    fontSize: 12, fontWeight: 600, color: 'var(--ss-fg)',
    padding: '10px 12px', textAlign: 'left',
    borderBottom: '1px solid var(--ss-neutral-100)',
    background: '#fff', position: 'sticky', left: 0, zIndex: 1,
    whiteSpace: 'nowrap',
  };

  return (
    <div style={tableWrap}>
      <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed', fontFamily: 'inherit' }}>
        <colgroup>
          <col style={{ width: 170 }} />
          {intents.map((i: any) => <col key={i.key} />)}
          <col style={{ width: 64 }} />
        </colgroup>
        <thead>
          <tr>
            <th style={{ ...intentLabelStyle, textAlign: 'left', paddingLeft: 12, background: '#fff', position: 'sticky', left: 0, zIndex: 2 }}>
              <span style={{ color: 'var(--ss-fg)' }}>Module</span>
            </th>
            {intents.map((i: any) => (
              <th key={i.key} style={intentLabelStyle} title={i.label}>{i.label}</th>
            ))}
            <th style={{ ...intentLabelStyle, fontWeight: 700, color: 'var(--ss-fg)' }}>Σ</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((m: string) => (
            <tr key={m}>
              <td style={moduleLabelStyle}>
                {m}
                <div style={{ fontSize: 10, color: 'var(--ss-fg-muted)', fontWeight: 500, marginTop: 1 }}>
                  {rowTotals[m].toLocaleString()} tickets
                </div>
              </td>
              {intents.map((i: any) => {
                const c = cells[m][i.key];
                const v = c.count;
                if (v === 0) return (
                  <td key={i.key} style={{ padding: 0, borderBottom: '1px solid var(--ss-neutral-100)' }}>
                    <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ss-neutral-300)', fontSize: 11 }}>·</div>
                  </td>
                );
                const bg = mode === 'frustration' ? frustColor(c.frust) : countColor(v);
                const fg = mode === 'frustration' ? '#3a2a14' : countFg(v);
                const prev = prevMatrix?.cells?.[m]?.[i.key]?.count ?? null;
                const delta = prev != null ? (v - prev) : null;
                return (
                  <td key={i.key} style={{ padding: 2, borderBottom: '1px solid var(--ss-neutral-100)' }}>
                    <div className="heatmap-cell" onClick={() => onCell && onCell({ module: m, intent: i.key, intentLabel: i.label, count: v, frust: c.frust })}
                      style={{
                        height: 48, background: bg, borderRadius: 6,
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                        color: fg, transition: 'filter .15s',
                        position: 'relative', cursor: onCell ? 'pointer' : 'default'
                      }}>
                      <div className="tabular" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>{v}</div>
                      {mode === 'frustration' && (
                        <div className="tabular" style={{ fontSize: 9.5, marginTop: 2, opacity: 0.7 }}>f {c.frust.toFixed(1)}</div>
                      )}
                      {mode === 'count' && delta != null && delta !== 0 && (
                        <div className="tabular" style={{ fontSize: 9.5, marginTop: 2, opacity: 0.75 }}>{delta > 0 ? '▲' : '▼'}{Math.abs(delta)}</div>
                      )}
                    </div>
                  </td>
                );
              })}
              <td style={{ padding: '8px 8px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--ss-fg)', borderBottom: '1px solid var(--ss-neutral-100)', background: 'var(--ss-neutral-50)' }} className="tabular">{rowTotals[m]}</td>
            </tr>
          ))}
          <tr>
            <td style={{ padding: '10px 12px', fontSize: 12, fontWeight: 700, color: 'var(--ss-fg-muted)', background: 'var(--ss-neutral-50)', position: 'sticky', left: 0 }}>Σ Intent</td>
            {intents.map((i: any) => (
              <td key={i.key} className="tabular" style={{ padding: '10px 6px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--ss-fg)', background: 'var(--ss-neutral-50)' }}>
                {colTotals[i.key] || 0}
              </td>
            ))}
            <td className="tabular" style={{ padding: '10px 8px', textAlign: 'center', fontSize: 13, fontWeight: 800, color: 'var(--ss-fg)', background: 'var(--ss-neutral-100)' }}>{grand}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
