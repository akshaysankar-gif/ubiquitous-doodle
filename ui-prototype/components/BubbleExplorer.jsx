// Bubble explorer — interactive bubble chart with encoding switcher,
// per-bubble inspector panel, and a quick legend.

const BubbleExplorer = ({monthKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const data = React.useMemo(()=>D.bubbleSet(monthKey), [monthKey]);
  const [encoding, setEncoding] = React.useState('volume-frustration');
  const [hovered, setHovered] = React.useState(null);
  const [selected, setSelected] = React.useState(null);

  const E = window.ENCODINGS[encoding];
  const monthLabel = (D.MONTHS.find(m=>m.key===monthKey)||{}).label;

  // Inspector defaults to "biggest bubble" until something selected
  const inspector = selected || hovered || [...data].sort((a,b)=>b.n-a.n)[0];

  return (
    <div className="scroll-area" style={{flex:1, padding:24, background:'var(--ss-neutral-50)'}}>
      <div style={{display:'flex',alignItems:'flex-end', justifyContent:'space-between', marginBottom:14}}>
        <div>
          <div style={{fontSize:11, fontWeight:600, color:'var(--ss-primary-700)', textTransform:'uppercase', letterSpacing:'0.08em'}}>Bubble explorer</div>
          <h2 style={{fontSize:22, fontWeight:700, color:'var(--ss-fg)', margin:'4px 0 0', letterSpacing:'-0.01em'}}>{monthLabel} contact codes</h2>
          <div style={{fontSize:12.5, color:'var(--ss-fg-muted)', marginTop:4}}>Each bubble = one Module · Area. Switch encodings to see different angles.</div>
        </div>
        <div style={{display:'flex', gap:6, alignItems:'center'}}>
          <span style={{fontSize:11, color:'var(--ss-fg-muted)', marginRight:4}}>Encoding</span>
          {Object.keys(window.ENCODINGS).map(k=>(
            <SelectablePill key={k} size="md" variant={encoding===k?'filled':'outline'} state={encoding===k?'active':'regular'}
              showTick={false} showChevron={false} onClick={()=>setEncoding(k)}>
              {encodingLabel(k)}
            </SelectablePill>
          ))}
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'minmax(0, 2.4fr) minmax(280px, 1fr)', gap:16}}>
        <Card style={{padding:'16px 18px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
            <div style={{fontSize:12, color:'var(--ss-fg-muted)'}}>
              <strong style={{color:'var(--ss-fg)'}}>X</strong> {E.x.label} · <strong style={{color:'var(--ss-fg)'}}>Y</strong> {E.y.label} · <strong style={{color:'var(--ss-fg)'}}>Size</strong> {E.size.label} · <strong style={{color:'var(--ss-fg)'}}>Color</strong> {E.color.label}
            </div>
            <span style={{fontSize:11, color:'var(--ss-fg-muted)'}}>{data.length} groups · {data.reduce((a,d)=>a+d.n,0).toLocaleString()} tickets</span>
          </div>
          <BubbleChart data={data} encoding={encoding} height={480}
            onHover={setHovered} onClick={setSelected}
            highlightKey={(inspector||{}).key}/>
          <div style={{marginTop:6}}><BubbleLegend encoding={encoding}/></div>
        </Card>

        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Inspector" subtitle="Hover or click a bubble"/>
          {inspector ? <BubbleInspector b={inspector} encoding={encoding} monthKey={monthKey} onOpenTicket={onOpenTicket}/> : (
            <div style={{padding:'24px 0', color:'var(--ss-fg-muted)', fontSize:12, textAlign:'center'}}>Nothing selected yet.</div>
          )}
        </Card>
      </div>

      <Card style={{padding:'16px 18px', marginTop:16}}>
        <SectionHead title="Quadrant guide" subtitle="What the regions mean for the current encoding"/>
        <QuadrantGuide encoding={encoding}/>
      </Card>
    </div>
  );
};

function encodingLabel(k){
  return ({
    'volume-frustration':'Volume × Frustration',
    'volume-automation':'Volume × Automation',
    'growth-volume':'Growth × Volume',
  })[k] || k;
}

const BubbleInspector = ({b, encoding, monthKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const items = D.tickets.filter(t=>t.month===monthKey && (t.module+' · '+t.area)===b.key && t.team==='Technical Support' && t.status!=='Archived');
  // Top sub-areas
  const subs = {};
  const intents = {};
  items.forEach(t=>{ subs[t.subarea]=(subs[t.subarea]||0)+1; intents[t.intentLabel]=(intents[t.intentLabel]||0)+1; });
  const topSubs = Object.entries(subs).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const topIntents = Object.entries(intents).sort((a,b)=>b[1]-a[1]).slice(0,3);

  // Sentiment distribution
  const sent = {calm:0,annoyed:0,frustrated:0,furious:0};
  items.forEach(t=>{sent[t.sentiment]++;});

  return (
    <div style={{display:'flex',flexDirection:'column', gap:12}}>
      <div>
        <Tag color="mint">{b.module}</Tag>
        <div style={{fontSize:16, fontWeight:700, marginTop:6, letterSpacing:'-0.005em'}}>{b.area}</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
        <Stat label="Tickets" value={b.n.toLocaleString()}/>
        <Stat label="Avg effort" value={b.effort.toFixed(1) + 'h'}/>
        <Stat label="Avg frustration" value={b.frust.toFixed(1)} accent={frustToColor(b.frust)}/>
        <Stat label="Automation" value={`${Math.round(b.automation*100)}%`}/>
        <Stat label="MoM" value={(b.mom>0?'+':'') + Math.round(b.mom*100)+'%'} accent={b.mom>0?'#B2401D':'#1F5E2A'}/>
        <Stat label="Family" value={b.dominantFamily}/>
      </div>

      <div>
        <div style={{fontSize:11, color:'var(--ss-fg-muted)', marginBottom:4}}>Sentiment mix</div>
        <SentimentBar distribution={sent} height={8}/>
      </div>

      <div>
        <div style={{fontSize:11, color:'var(--ss-fg-muted)', marginBottom:4}}>Top subareas</div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {topSubs.map(([s,n])=>(
            <span key={s} style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 8px',borderRadius:99,background:'var(--ss-neutral-50)', border:'1px solid var(--ss-neutral-100)', fontSize:11, fontWeight:500}}>
              {s} <span style={{color:'var(--ss-fg-muted)'}}>· {n}</span>
            </span>
          ))}
        </div>
      </div>
      <div>
        <div style={{fontSize:11, color:'var(--ss-fg-muted)', marginBottom:4}}>Top intents</div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {topIntents.map(([i,n])=>(
            <Tag key={i} color="purple">{i} · {n}</Tag>
          ))}
        </div>
      </div>

      <Button size="sm" color="primary" rightIcon="arrow-right" onClick={()=>onOpenTicket({type:'code', monthKey, code:b.key})}>Open conversations</Button>
    </div>
  );
};
function frustToColor(f){ if (f<3) return '#1F8A5B'; if (f<5) return '#E1A23B'; if (f<7) return '#E96A3E'; return '#B2401D'; }

const Stat = ({label, value, accent}) => (
  <div style={{padding:'8px 10px', background:'var(--ss-neutral-50)', borderRadius:6}}>
    <div style={{fontSize:10, color:'var(--ss-fg-muted)', textTransform:'uppercase', letterSpacing:'0.04em', fontWeight:600}}>{label}</div>
    <div className="tabular" style={{fontSize:14, fontWeight:700, color: accent || 'var(--ss-fg)', marginTop:2}}>{value}</div>
  </div>
);

const QuadrantGuide = ({encoding}) => {
  const guides = {
    'volume-frustration': [
      {q:'Top-right', label:'High volume + Hot', meaning:'Crisis zones. Fix product or rewrite docs. Visible & painful.', color:'#FDD8CE'},
      {q:'Top-left',  label:'Low volume + Hot',  meaning:'Niche pain. May still need attention if customers churn.', color:'#FDE2B8'},
      {q:'Bottom-right',label:'High volume + Calm',meaning:'Mostly how-to. Best automation candidates.', color:'#D7F0D7'},
      {q:'Bottom-left',label:'Low volume + Calm', meaning:'Steady state. Leave alone.', color:'#E5F4F5'},
    ],
    'volume-automation': [
      {q:'Top-right', label:'High volume + Automatable', meaning:'Biggest deflection opportunities — invest in Zoona AI + docs.', color:'#D7F0D7'},
      {q:'Top-left',  label:'Low volume + Automatable',  meaning:'Easy wins. Quick docs/macros.', color:'#E5F4F5'},
      {q:'Bottom-right',label:'High volume + Manual',    meaning:'Hot product issues, not automatable — engineering work.', color:'#FDD8CE'},
      {q:'Bottom-left',label:'Low volume + Manual',      meaning:'Edge cases. Keep human in loop.', color:'#FDE2B8'},
    ],
    'growth-volume': [
      {q:'Right + Top', label:'Big + Growing', meaning:'Newly trending blockers. Investigate first.', color:'#FDD8CE'},
      {q:'Right + Bottom', label:'Small + Growing', meaning:'Emerging issues — watch them.', color:'#FDE2B8'},
      {q:'Left + Top',  label:'Big + Shrinking', meaning:'Wins — what worked? Repeat the playbook.', color:'#D7F0D7'},
      {q:'Left + Bottom',label:'Small + Shrinking',meaning:'Resolved or seasonal.', color:'#E5F4F5'},
    ],
  };
  const list = guides[encoding] || guides['volume-frustration'];
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10}}>
      {list.map(g=>(
        <div key={g.q} style={{padding:'12px 14px', background:g.color, borderRadius:8}}>
          <div style={{fontSize:10, fontWeight:700, color:'rgba(0,0,0,0.55)', textTransform:'uppercase', letterSpacing:'0.06em'}}>{g.q}</div>
          <div style={{fontSize:13, fontWeight:700, color:'rgba(0,0,0,0.85)', marginTop:4}}>{g.label}</div>
          <div style={{fontSize:11.5, color:'rgba(0,0,0,0.7)', marginTop:6, lineHeight:1.4}}>{g.meaning}</div>
        </div>
      ))}
    </div>
  );
};

Object.assign(window, { BubbleExplorer });
