// Compare months — single view with delta badges on every metric.
// Pick A and B (defaults: previous month vs current).

const ComparisonPage = ({monthA, monthB, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const a = D.monthAgg[monthA];
  const b = D.monthAgg[monthB];
  const [aKey, setA] = React.useState(monthA);
  const [bKey, setB] = React.useState(monthB);
  const A = D.monthAgg[aKey];
  const B = D.monthAgg[bKey];

  const delta = (x, y) => y ? (x-y)/y : (x>0?1:0);
  const deltaAbs = (x,y) => x - (y||0);

  const kpis = [
    {k:'total', label:'Tickets', a:A.total, b:B.total, polarity:'bad', fmt:'pct'},
    {k:'ai',    label:'Zoona AI share', a:A.aiShare, b:B.aiShare, format:v=>`${Math.round(v*100)}%`, polarity:'good', fmt:'pt', absDelta:true},
    {k:'frust', label:'Avg frustration', a:A.avgFrustration, b:B.avgFrustration, format:v=>v.toFixed(1), polarity:'bad', fmt:'pt', absDelta:true},
    {k:'effort',label:'Avg effort (h)', a:A.avgEffort, b:B.avgEffort, format:v=>v.toFixed(1), polarity:'bad', fmt:'pt', absDelta:true},
    {k:'multi', label:'Multi-team', a:A.multiTeam, b:B.multiTeam, polarity:'bad', fmt:'pct'},
  ];

  // Module deltas
  const moduleRows = React.useMemo(()=>{
    const allMods = new Set([...Object.keys(A.byModule), ...Object.keys(B.byModule)]);
    return [...allMods].map(m=>{
      const av = A.byModule[m]||0, bv = B.byModule[m]||0;
      return {m, a:av, b:bv, delta:bv?((bv-av)/0||0):0, pct: av?(bv-av)/av:(bv>0?1:0), diff: bv-av};
    }).sort((x,y)=>Math.abs(y.diff) - Math.abs(x.diff));
  }, [aKey, bKey]);

  // Intent deltas
  const intentRows = React.useMemo(()=>{
    return D.INTENTS.map(i=>{
      const av = A.byIntent[i.key]||0, bv = B.byIntent[i.key]||0;
      return {i, a:av, b:bv, pct: av?(bv-av)/av:(bv>0?1:0), diff:bv-av};
    }).sort((x,y)=>Math.abs(y.diff)-Math.abs(x.diff));
  }, [aKey, bKey]);

  // Sentiment deltas
  const sentRows = D.SENTIMENT_BANDS.map(s => {
    const av = A.bySentiment[s.key]||0, bv = B.bySentiment[s.key]||0;
    return {s, a:av, b:bv, pct: av?(bv-av)/av:(bv>0?1:0)};
  });

  const monthLabel = (k) => (D.MONTHS.find(m=>m.key===k)||{}).label;

  return (
    <div className="scroll-area" style={{flex:1, padding:24, background:'var(--ss-neutral-50)'}}>
      {/* Picker bar */}
      <Card style={{padding:'14px 18px', marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center', gap:18, flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:12, fontWeight:600, color:'var(--ss-fg-muted)'}}>BASE</span>
            <select value={aKey} onChange={e=>setA(e.target.value)}
              style={pickerSelect}>{D.MONTHS.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}</select>
          </div>
          <div style={{display:'flex',alignItems:'center', gap:6, color:'var(--ss-fg-muted)'}}>
            <Icon name="arrow-right" size={16}/>
            <span style={{fontSize:11}}>compared with</span>
            <Icon name="arrow-right" size={16}/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:12, fontWeight:600, color:'var(--ss-primary-700)'}}>FOCUS</span>
            <select value={bKey} onChange={e=>setB(e.target.value)}
              style={{...pickerSelect, borderColor:'var(--ss-primary-300)', color:'var(--ss-primary-700)'}}>{D.MONTHS.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}</select>
          </div>
          <div style={{flex:1}}/>
          <span style={{fontSize:11.5, color:'var(--ss-fg-muted)'}}>
            Deltas show <strong style={{color:'var(--ss-fg)'}}>{monthLabel(bKey)}</strong> vs <strong style={{color:'var(--ss-fg)'}}>{monthLabel(aKey)}</strong>
          </span>
        </div>
      </Card>

      {/* KPI strip with deltas */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:16}}>
        {kpis.map(k=>(
          <Card key={k.k} style={{padding:'14px 16px'}}>
            <div style={{fontSize:11, fontWeight:600, color:'var(--ss-fg-muted)', textTransform:'uppercase', letterSpacing:'0.04em'}}>{k.label}</div>
            <div style={{display:'flex',justifyContent:'space-between', alignItems:'baseline', marginTop:6, gap:6}}>
              <div className="tabular" style={{fontSize:13, color:'var(--ss-fg-muted)'}}>{k.format?k.format(k.a):k.a.toLocaleString()}</div>
              <Icon name="arrow-right" size={12} color="var(--ss-fg-muted)"/>
              <div className="tabular" style={{fontSize:22, fontWeight:700, color:'var(--ss-fg)'}}>{k.format?k.format(k.b):k.b.toLocaleString()}</div>
            </div>
            <div style={{marginTop:8}}>
              <Delta value={k.absDelta?deltaAbs(k.b,k.a):delta(k.b,k.a)} fmt={k.fmt} polarity={k.polarity}/>
            </div>
          </Card>
        ))}
      </div>

      {/* Movement tables */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Module movement" subtitle="Top changes by absolute ticket count"/>
          <DeltaTable rows={moduleRows.slice(0,8)} aLabel={monthLabel(aKey)} bLabel={monthLabel(bKey)} keyOf={r=>r.m} label={r=>r.m}/>
        </Card>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Intent movement" subtitle="What customers wrote in about"/>
          <DeltaTable rows={intentRows} aLabel={monthLabel(aKey)} bLabel={monthLabel(bKey)} keyOf={r=>r.i.key} label={r=>r.i.label} accent="accent"/>
        </Card>
      </div>

      {/* Sentiment shift + contact-code top movers */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Sentiment shift" subtitle="Customer-emotion distribution by month"/>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <SentimentBlock label={monthLabel(aKey)} agg={A}/>
            <SentimentBlock label={monthLabel(bKey)} agg={B} emphasize/>
          </div>
          <div style={{marginTop:14, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8}}>
            {sentRows.map(r => (
              <div key={r.s.key} style={{padding:'10px 12px', border:'1px solid var(--ss-neutral-100)', borderRadius:8}}>
                <div style={{display:'flex',alignItems:'center',gap:6, marginBottom:6}}>
                  <span style={{width:8,height:8,borderRadius:99,background:r.s.swatch}}/>
                  <span style={{fontSize:11.5, fontWeight:600}}>{r.s.label}</span>
                </div>
                <div className="tabular" style={{fontSize:15, fontWeight:700}}>{r.b}</div>
                <div style={{marginTop:4}}><Delta size="sm" value={r.pct} fmt="pct" polarity={r.s.key==='calm'?'good':'bad'}/></div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Top contact-code movers" subtitle="Biggest absolute shifts"/>
          <ContactMovers monthA={aKey} monthB={bKey} onOpenTicket={onOpenTicket}/>
        </Card>
      </div>

      {/* Side-by-side bubble */}
      <Card style={{padding:'16px 18px', marginBottom:16}}>
        <SectionHead title="Bubble side-by-side" subtitle="Same encoding, two months — spot what grew, what shrank"/>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          <div>
            <div style={{fontSize:12, fontWeight:600, color:'var(--ss-fg-muted)', marginBottom:8}}>{monthLabel(aKey)}</div>
            <BubbleChart data={D.bubbleSet(aKey)} encoding="volume-frustration" height={300}/>
          </div>
          <div>
            <div style={{fontSize:12, fontWeight:600, color:'var(--ss-primary-700)', marginBottom:8}}>{monthLabel(bKey)}</div>
            <BubbleChart data={D.bubbleSet(bKey)} encoding="volume-frustration" height={300}/>
          </div>
        </div>
        <div style={{marginTop:8}}><BubbleLegend encoding="volume-frustration"/></div>
      </Card>
    </div>
  );
};

const pickerSelect = {
  border:'1px solid var(--ss-border)', borderRadius:6,
  padding:'6px 10px', fontFamily:'inherit', fontSize:13, fontWeight:600,
  color:'var(--ss-fg)', background:'#fff', cursor:'pointer',
};

const DeltaTable = ({rows, aLabel, bLabel, keyOf, label, accent='primary'}) => {
  return (
    <div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 80px 80px 80px 90px', gap:8, fontSize:10, color:'var(--ss-fg-muted)', fontWeight:600, padding:'4px 8px', textTransform:'uppercase', letterSpacing:'0.04em'}}>
        <span>Item</span><span style={{textAlign:'right'}}>{aLabel}</span><span style={{textAlign:'right'}}>{bLabel}</span><span style={{textAlign:'right'}}>Δ</span><span style={{textAlign:'right'}}>Δ%</span>
      </div>
      {rows.map(r=>{
        const k = keyOf(r);
        const ratio = Math.max(r.a, r.b, 1);
        return (
          <div key={k} style={{display:'grid', gridTemplateColumns:'1fr 80px 80px 80px 90px', gap:8, alignItems:'center', padding:'6px 8px', borderRadius:6, borderTop:'1px solid var(--ss-neutral-100)'}}>
            <div style={{minWidth:0}}>
              <div style={{fontSize:12.5, fontWeight:600, whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{label(r)}</div>
              <div style={{display:'flex', gap:4, height:5, marginTop:4}}>
                <Bullet value={r.a/ratio} color="var(--ss-neutral-400)" width={'50%'} height={5}/>
                <Bullet value={r.b/ratio} color={`var(--ss-${accent}-500)`} width={'50%'} height={5}/>
              </div>
            </div>
            <span className="tabular" style={{textAlign:'right', fontSize:12, color:'var(--ss-fg-muted)'}}>{r.a.toLocaleString()}</span>
            <span className="tabular" style={{textAlign:'right', fontSize:13, fontWeight:700, color:'var(--ss-fg)'}}>{r.b.toLocaleString()}</span>
            <span className="tabular" style={{textAlign:'right', fontSize:12, color: r.diff>0?'var(--ss-negative-600)':r.diff<0?'var(--ss-positive-600)':'var(--ss-fg-muted)', fontWeight:600}}>{r.diff>0?'+':''}{r.diff}</span>
            <div style={{display:'flex',justifyContent:'flex-end'}}><Delta size="sm" value={r.pct} fmt="pct" polarity="bad"/></div>
          </div>
        );
      })}
    </div>
  );
};

const SentimentBlock = ({label, agg, emphasize}) => (
  <div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
      <span style={{fontSize:11.5, fontWeight: emphasize?700:600, color: emphasize?'var(--ss-primary-700)':'var(--ss-fg-muted)'}}>{label}</span>
      <span className="tabular" style={{fontSize:11, color:'var(--ss-fg-muted)'}}>avg <strong style={{color:'var(--ss-fg)'}}>{agg.avgFrustration.toFixed(1)}</strong>/10</span>
    </div>
    <SentimentBar distribution={agg.bySentiment} height={emphasize?14:12}/>
  </div>
);

const ContactMovers = ({monthA, monthB, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const movers = D.topMovers(monthA, monthB, 8);
  return (
    <div style={{display:'flex',flexDirection:'column', gap:8}}>
      {movers.map(m=>{
        const dir = m.delta>=0 ? 'up' : 'down';
        return (
          <div key={m.code} className="row-hover" onClick={()=>onOpenTicket({type:'code', monthKey:monthB, code:m.code})}
            style={{display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:10, alignItems:'center', padding:'8px 10px', borderRadius:8, border:'1px solid var(--ss-neutral-100)', cursor:'pointer'}}>
            <div style={{width:24,height:24,borderRadius:6,background: dir==='up'?'#FDD8CE':'#D7F0D7',
              display:'flex',alignItems:'center',justifyContent:'center'}}>
              <i data-lucide={dir==='up'?'trending-up':'trending-down'} style={{width:13, height:13, strokeWidth:2, color: dir==='up'?'#9B2C0F':'#1F5E2A'}}/>
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:12, fontWeight:600, whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.code}</div>
              <div className="tabular" style={{fontSize:11, color:'var(--ss-fg-muted)'}}>{m.a} → {m.b}</div>
            </div>
            <span className="tabular" style={{fontSize:12, fontWeight:700, color: dir==='up'?'var(--ss-negative-600)':'var(--ss-positive-600)'}}>
              {m.delta>0?'+':''}{m.delta}
            </span>
            <Delta size="sm" value={m.pct} fmt="pct" polarity="bad"/>
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, { ComparisonPage });
