// Shared visual primitives for the explorer: section headers, deltas,
// sentiment chips, bar bullets, mini sparklines, etc.

const SectionHead = ({title, subtitle, actions, style={}}) => (
  <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:16,marginBottom:12, ...style}}>
    <div>
      <div style={{fontSize:13.5,fontWeight:700,color:'var(--ss-fg)',letterSpacing:'-0.005em'}}>{title}</div>
      {subtitle && <div style={{fontSize:11.5,color:'var(--ss-fg-muted)',marginTop:2}}>{subtitle}</div>}
    </div>
    {actions}
  </div>
);

// Delta badge — "+12.4%" or "-8" with arrow. Polarity tells us whether
// "up" is good (positive metric like resolved) or bad (frustration/effort).
const Delta = ({value, fmt='pct', polarity='good', size='md', emphasize=false}) => {
  const v = value;
  if (v == null || Number.isNaN(v)) {
    return <Pill size={size==='sm'?'sm':'md'} color="default" leading={false}>—</Pill>;
  }
  const up = v > 0;
  const flat = Math.abs(v) < (fmt==='pct'?0.005:0.1);
  const text = flat ? '0' :
    fmt==='pct' ? `${up?'+':''}${(v*100).toFixed(1)}%`
    : fmt==='pt' ? `${up?'+':''}${v.toFixed(1)}pt`
    : `${up?'+':''}${v.toFixed(1)}`;
  let color = 'default';
  if (!flat) {
    const good = polarity==='good' ? up : !up;
    color = good ? 'green' : 'red';
  }
  const ic = flat ? 'minus' : (up ? 'trending-up' : 'trending-down');
  return (
    <Pill size={size==='sm'?'sm':'md'} color={color} leading={false} style={emphasize?{fontWeight:700}:undefined}>
      <span style={{display:'inline-flex',alignItems:'center',gap:3}}>
        <i data-lucide={ic} style={{width: size==='sm'?11:12, height:size==='sm'?11:12, strokeWidth:1.75}}/>
        <span className="tabular">{text}</span>
      </span>
    </Pill>
  );
};

const SentimentChip = ({band, count, total, size='md'}) => {
  const B = (window.SUPPORT_DATA.SENTIMENT_BANDS).find(b=>b.key===band) || {label:band, swatch:'#999'};
  return (
    <span className={'tabular sent-' + band} style={{
      display:'inline-flex',alignItems:'center',gap:6,
      padding: size==='sm'?'2px 8px':'3px 10px', borderRadius:99,
      fontSize: size==='sm'?11:12, fontWeight:600,
      whiteSpace:'nowrap'
    }}>
      <span style={{width:6,height:6,borderRadius:99,background:B.swatch}}/>
      {B.label}{count!=null && <span style={{opacity:0.7}}> · {count.toLocaleString()}</span>}
      {total!=null && total>0 && <span style={{opacity:0.6}}> ({Math.round(count/total*100)}%)</span>}
    </span>
  );
};

// Sentiment band — Calm / Annoyed / Frustrated / Furious as colored stacked bar
const SentimentBar = ({distribution, height=10, showLabels=false}) => {
  const bands = window.SUPPORT_DATA.SENTIMENT_BANDS;
  const total = Object.values(distribution).reduce((a,b)=>a+b,0) || 1;
  return (
    <div>
      <div style={{display:'flex',height, borderRadius:99, overflow:'hidden', background:'var(--ss-neutral-100)'}}>
        {bands.map(b=>{
          const c = distribution[b.key]||0; if (!c) return null;
          return <div key={b.key} title={`${b.label}: ${c}`}
            style={{width:`${(c/total)*100}%`, background:b.swatch}}/>;
        })}
      </div>
      {showLabels && (
        <div style={{display:'flex',gap:10,marginTop:6,flexWrap:'wrap'}}>
          {bands.map(b => (
            <span key={b.key} style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:11,color:'var(--ss-fg-muted)'}}>
              <span style={{width:8,height:8,borderRadius:99,background:b.swatch}}/>
              {b.label} · <span className="tabular" style={{color:'var(--ss-fg)',fontWeight:600}}>{distribution[b.key]||0}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Horizontal bullet bar — value 0..1 (filled), max optional label
const Bullet = ({value, color='var(--ss-primary-500)', width=120, height=6, bg='var(--ss-neutral-100)'}) => (
  <div style={{width, height, background:bg, borderRadius:99, overflow:'hidden'}}>
    <div style={{width:`${Math.max(0,Math.min(1,value))*100}%`, height:'100%', background:color, borderRadius:99}}/>
  </div>
);

// Sparkline — array of numbers → svg path
const Sparkline = ({values, width=120, height=32, stroke='var(--ss-primary-500)', fill='var(--ss-primary-100)', highlight=true}) => {
  if (!values || values.length<2) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max-min || 1;
  const step = width/(values.length-1);
  const pts = values.map((v,i)=>[i*step, height - 4 - ((v-min)/range)*(height-8)]);
  const linePath = pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const areaPath = linePath + ` L ${width} ${height} L 0 ${height} Z`;
  const last = pts[pts.length-1];
  return (
    <svg width={width} height={height} className="kpi-spark">
      <path d={areaPath} fill={fill} opacity={0.5}/>
      <path d={linePath} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {highlight && <circle cx={last[0]} cy={last[1]} r={2.5} fill={stroke}/>}
    </svg>
  );
};

// KPI card with optional sparkline + delta
const KpiCard = ({label, value, delta, deltaFmt='pct', polarity='good', spark, icon, accent='primary'}) => {
  const accentMap = {
    primary:'var(--ss-primary-500)', accent:'var(--ss-accent-500)',
    warning:'var(--ss-warning-500)', negative:'var(--ss-negative-500)',
    positive:'var(--ss-positive-500)', highlight:'var(--ss-highlight-500)'
  };
  const c = accentMap[accent];
  return (
    <Card style={{flex:1, minWidth:0, padding:'14px 16px'}}>
      <div style={{display:'flex',alignItems:'center',gap:6, color:'var(--ss-fg-muted)', fontSize:11, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase'}}>
        {icon && <Icon name={icon} size={12}/>}
        <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{label}</span>
      </div>
      <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:8,marginTop:6}}>
        <div className="tabular" style={{fontSize:26,fontWeight:700,letterSpacing:'-0.01em',color:'var(--ss-fg)'}}>{value}</div>
        {delta != null && <Delta value={delta} fmt={deltaFmt} polarity={polarity}/>}
      </div>
      {spark && <div style={{marginTop:8}}><Sparkline values={spark} stroke={c} fill={c.replace('500','100')} width={220} height={36}/></div>}
    </Card>
  );
};

// Tag chip — small uppercase label-style chip
const Tag = ({children, color='neutral'}) => (
  <Pill size="sm" color={color} leading={false} style={{textTransform:'none'}}>{children}</Pill>
);

Object.assign(window, { SectionHead, Delta, SentimentChip, SentimentBar, Bullet, Sparkline, KpiCard, Tag });
