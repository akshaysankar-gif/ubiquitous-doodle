// MonthDashboard — the "essence of the month" view.
// Hero is the Module × Intent heatmap. Surrounded by KPI strip, top blockers,
// sentiment distribution, top movers (when comparing), bubble preview.

const MonthDashboard = ({
  monthKey, prevMonthKey, compareMode, compareKey,
  productFilter,
  onOpenTicket, onChangeMode,
}) => {
  const D = window.SUPPORT_DATA;
  const cur = D.monthAgg[monthKey];
  const prev = D.monthAgg[prevMonthKey];
  const cmp = compareMode && compareKey ? D.monthAgg[compareKey] : prev;

  const [hmMode, setHmMode] = React.useState('count'); // count | frustration

  // Matrix
  const matrix = React.useMemo(()=>D.moduleIntentMatrix(monthKey), [monthKey]);
  const prevMatrix = React.useMemo(()=>prevMonthKey?D.moduleIntentMatrix(prevMonthKey):null, [prevMonthKey]);

  // KPI helpers
  const delta = (a, b) => b ? (a-b)/b : (a>0?1:0);
  const deltaAbs = (a,b) => a - (b||0);

  // Top blockers — biggest contact codes
  const topBlockers = React.useMemo(()=>{
    return Object.entries(cur.byContactCode).map(([code,n])=>{
      const prevN = (cmp?.byContactCode?.[code])||0;
      return {code, n, prevN, delta: prevN?(n-prevN)/prevN:(n>0?1:0)};
    }).sort((a,b)=>b.n-a.n).slice(0,6);
  }, [cur, cmp]);

  // Top movers (compare mode)
  const movers = React.useMemo(()=>cmp?D.topMovers(cmp.monthKey, monthKey, 6):[], [monthKey, cmp]);

  // Intent leaderboard
  const intentRanked = React.useMemo(()=>{
    return D.INTENTS.map(i => ({
      ...i,
      n: cur.byIntent[i.key]||0,
      prev: cmp?.byIntent?.[i.key]||0,
    })).sort((a,b)=>b.n-a.n);
  }, [cur, cmp]);

  // Bubble dataset preview
  const bubbleData = React.useMemo(()=>D.bubbleSet(monthKey), [monthKey]);

  // Spark line history per KPI
  const sparkHistory = React.useMemo(()=>{
    const months = D.MONTHS.map(m=>m.key);
    return {
      total:    months.map(k => D.monthAgg[k].total),
      autoShare:months.map(k => D.monthAgg[k].aiShare),
      frust:    months.map(k => D.monthAgg[k].avgFrustration),
      multi:    months.map(k => D.monthAgg[k].multiTeam),
      effort:   months.map(k => D.monthAgg[k].avgEffort),
    };
  },[]);

  // Find biggest contact code with high frustration → headline insight
  const headline = React.useMemo(()=>{
    const candidates = topBlockers.filter(b=>b.delta>0.15);
    return candidates[0] || topBlockers[0];
  }, [topBlockers]);

  return (
    <div className="scroll-area" style={{flex:1, padding:24, background:'var(--ss-neutral-50)'}}>
      {/* Month essence header */}
      <Card style={{padding:'20px 24px', marginBottom:16,
        background: 'linear-gradient(120deg, var(--ss-primary-50) 0%, #fff 60%)',
        borderColor: 'rgba(0,130,141,0.18)'}}>
        <div style={{display:'flex',alignItems:'flex-start', justifyContent:'space-between', gap:24}}>
          <div style={{maxWidth:'58ch'}}>
            <div style={{display:'flex',alignItems:'center',gap:8, marginBottom:6}}>
              <Pill size="sm" color="mint" leading={false} dot>This month</Pill>
              <span style={{fontSize:11.5, color:'var(--ss-fg-muted)'}}>
                {(D.MONTHS.find(m=>m.key===monthKey)||{}).label} · Technical Support
              </span>
            </div>
            <div style={{fontSize:22, fontWeight:700, letterSpacing:'-0.015em', lineHeight:1.25, color:'var(--ss-fg)'}}>
              {headlineSentence(monthKey, prevMonthKey, headline, cur, cmp)}
            </div>
            <div style={{fontSize:12.5, color:'var(--ss-fg-muted)', marginTop:8, lineHeight:1.55}}>
              {bodySentence(cur, cmp, intentRanked)}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8, minWidth:240}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontSize:11, fontWeight:600, color:'var(--ss-fg-muted)', textTransform:'uppercase', letterSpacing:'0.04em'}}>Sentiment mix</span>
              <span className="tabular" style={{fontSize:11, color:'var(--ss-fg-muted)'}}>avg <strong style={{color:'var(--ss-fg)'}}>{cur.avgFrustration.toFixed(1)}</strong>/10</span>
            </div>
            <SentimentBar distribution={cur.bySentiment} height={14}/>
            <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:6}}>
              {D.SENTIMENT_BANDS.map(b=>(
                <SentimentChip key={b.key} band={b.key} count={cur.bySentiment[b.key]} total={cur.total} size="sm"/>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* KPI strip */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12, marginBottom:16}}>
        <KpiCard icon="ticket" label="Tickets analysed" value={cur.total.toLocaleString()}
          delta={delta(cur.total, cmp?.total)} polarity="bad" spark={sparkHistory.total} accent="primary"/>
        <KpiCard icon="bot" label="Solved by Zoona AI" value={`${Math.round(cur.aiShare*100)}%`}
          delta={delta(cur.aiShare, cmp?.aiShare)} deltaFmt="pt" polarity="good" spark={sparkHistory.autoShare} accent="accent"/>
        <KpiCard icon="flame" label="Avg frustration" value={cur.avgFrustration.toFixed(1)}
          delta={deltaAbs(cur.avgFrustration, cmp?.avgFrustration)} deltaFmt="pt" polarity="bad" spark={sparkHistory.frust} accent="warning"/>
        <KpiCard icon="users" label="Multi-team tickets" value={cur.multiTeam.toLocaleString()}
          delta={delta(cur.multiTeam, cmp?.multiTeam)} polarity="bad" spark={sparkHistory.multi} accent="negative"/>
        <KpiCard icon="gauge" label="Avg effort (h)" value={cur.avgEffort.toFixed(1)}
          delta={deltaAbs(cur.avgEffort, cmp?.avgEffort)} deltaFmt="pt" polarity="bad" spark={sparkHistory.effort} accent="highlight"/>
      </div>

      {/* Hero — Heatmap + Right rail */}
      <div style={{display:'grid', gridTemplateColumns:'minmax(0, 2.1fr) minmax(280px, 1fr)', gap:16, marginBottom:16}}>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead
            title="Module × Intent heatmap"
            subtitle={hmMode==='count' ? 'Cell value = ticket count · darker = more tickets · Δ vs previous month inline' : 'Cell shade = avg frustration (calm → furious) · number = ticket count'}
            actions={
              <div style={{display:'flex',gap:6}}>
                {[
                  {k:'count',l:'Volume'},
                  {k:'frustration',l:'Frustration'},
                ].map(o=>(
                  <SelectablePill key={o.k} size="md" variant={hmMode===o.k?'filled':'outline'}
                    state={hmMode===o.k?'active':'regular'} showTick={false} showChevron={false}
                    onClick={()=>setHmMode(o.k)}>{o.l}</SelectablePill>
                ))}
              </div>
            }/>
          <HeatmapMatrix matrix={matrix} mode={hmMode} prevMatrix={prevMatrix}
            onCell={(c)=>onOpenTicket({type:'cell', monthKey, ...c})}/>
          <div style={{display:'flex',gap:14, alignItems:'center', marginTop:14, color:'var(--ss-fg-muted)', fontSize:11}}>
            <Icon name="info" size={12}/>
            <span>Click any cell to drill into the underlying conversations. Only Technical Support team tickets, excluding Archived.</span>
          </div>
        </Card>

        {/* Right rail */}
        <div style={{display:'flex', flexDirection:'column', gap:16, minWidth:0}}>
          <Card style={{padding:'14px 16px'}}>
            <SectionHead title="Top blockers" subtitle="Largest contact codes this month"/>
            <div style={{display:'flex',flexDirection:'column', gap:10}}>
              {topBlockers.map((b,i)=>{
                const max = topBlockers[0].n;
                return (
                  <div key={b.code} className="row-hover" onClick={()=>onOpenTicket({type:'code', monthKey, code:b.code})}
                    style={{display:'grid', gridTemplateColumns:'18px 1fr auto auto', gap:8, alignItems:'center', cursor:'pointer', padding:'4px 6px', borderRadius:6}}>
                    <div style={{fontSize:11, fontWeight:700, color:'var(--ss-fg-muted)'}}>{i+1}</div>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:12, fontWeight:600, color:'var(--ss-fg)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.code}</div>
                      <Bullet value={b.n/max} color="var(--ss-primary-500)" width={'100%'} height={4}/>
                    </div>
                    <div className="tabular" style={{fontSize:12, fontWeight:700, color:'var(--ss-fg)'}}>{b.n}</div>
                    <Delta size="sm" value={b.delta} fmt="pct" polarity="bad"/>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card style={{padding:'14px 16px'}}>
            <SectionHead title="Intent leaderboard" subtitle="What customers are writing in about"/>
            <div style={{display:'flex',flexDirection:'column', gap:8}}>
              {intentRanked.slice(0,7).map((it,i)=>{
                const max = intentRanked[0].n||1;
                const d = it.prev ? (it.n-it.prev)/it.prev : (it.n>0?1:0);
                return (
                  <div key={it.key} style={{display:'grid', gridTemplateColumns:'1fr 80px auto', gap:10, alignItems:'center'}}>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:12, fontWeight:500, color:'var(--ss-fg)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.label}</div>
                      <Bullet value={it.n/max} color={iconColorForIntent(it.key)} width="100%" height={4}/>
                    </div>
                    <span className="tabular" style={{fontSize:12, fontWeight:600, color:'var(--ss-fg)', textAlign:'right'}}>{it.n.toLocaleString()}</span>
                    <Delta size="sm" value={d} fmt="pct" polarity="bad"/>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Movers strip — only meaningful when compareMode is on, but always render for hover signal */}
      <div style={{display:'grid', gridTemplateColumns:'minmax(0, 2.1fr) minmax(280px, 1fr)', gap:16, marginBottom:16}}>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead
            title="Trending contact codes"
            subtitle={compareMode && compareKey ? `Movement from ${D.MONTHS.find(m=>m.key===compareKey)?.label} → ${D.MONTHS.find(m=>m.key===monthKey)?.label}` : `Movement from ${D.MONTHS.find(m=>m.key===prevMonthKey)?.label||'previous'} → ${D.MONTHS.find(m=>m.key===monthKey)?.label}`}/>
          <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
            {movers.map(m => {
              const dir = m.delta>=0 ? 'up' : 'down';
              return (
                <div key={m.code} className="row-hover" onClick={()=>onOpenTicket({type:'code', monthKey, code:m.code})}
                  style={{display:'flex',alignItems:'center', gap:10, padding:'8px 10px',
                    borderRadius:8, border:'1px solid var(--ss-neutral-100)', cursor:'pointer'}}>
                  <div style={{width:28,height:28,borderRadius:6,background: dir==='up'?'#FDD8CE':'#D7F0D7',
                    display:'flex',alignItems:'center',justifyContent:'center', flexShrink:0}}>
                    <i data-lucide={dir==='up'?'trending-up':'trending-down'} style={{width:14, height:14, strokeWidth:2, color: dir==='up'?'#9B2C0F':'#1F5E2A'}}/>
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:12, fontWeight:600, color:'var(--ss-fg)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.code}</div>
                    <div className="tabular" style={{fontSize:11, color:'var(--ss-fg-muted)'}}>{m.a} → {m.b}</div>
                  </div>
                  <Delta size="sm" value={m.pct} fmt="pct" polarity={dir==='up'?'bad':'good'} emphasize/>
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{padding:'14px 16px'}}>
          <SectionHead title="Root-cause families" subtitle="Where the work really lives"/>
          <RootCauseBreakdown monthAgg={cur} prevAgg={cmp}/>
        </Card>
      </div>

      {/* Bubble preview */}
      <Card style={{padding:'16px 18px', marginBottom:16}}>
        <SectionHead
          title="Bubble explorer · preview"
          subtitle="Each bubble = one Module · Area. X=volume · Y=avg frustration · size=avg effort · color=module"
          actions={<Button size="sm" variant="ghost" color="primary" rightIcon="arrow-right" onClick={()=>onChangeMode('bubbles')}>Open full explorer</Button>}/>
        <BubbleChart data={bubbleData} encoding="volume-frustration" height={340} onClick={(d)=>onOpenTicket({type:'bubble', monthKey, code:d.key})}/>
        <div style={{marginTop:6}}><BubbleLegend encoding="volume-frustration"/></div>
      </Card>
    </div>
  );
};

function headlineSentence(monthKey, prevMonthKey, headline, cur, cmp){
  const D = window.SUPPORT_DATA;
  const monthLabel = (D.MONTHS.find(m=>m.key===monthKey)||{}).label;
  if (!headline) return `${monthLabel} — ${cur.total.toLocaleString()} support tickets analysed.`;
  const change = headline.delta;
  const pct = Math.round(Math.abs(change)*100);
  const direction = change>0 ? 'spiked' : (change<-0.05 ? 'cooled' : 'held steady');
  return `${monthLabel}: "${headline.code}" ${direction} ${pct}% — the dominant blocker for customers this month.`;
}

function bodySentence(cur, cmp, intents){
  const top = intents[0];
  const total = cur.total;
  const aiShare = Math.round(cur.aiShare*100);
  const frust = cur.avgFrustration.toFixed(1);
  const movement = cmp ? (cur.total - cmp.total) : 0;
  const movementText = cmp
    ? `${movement>=0?'+':'−'}${Math.abs(movement).toLocaleString()} vs comparison month`
    : '';
  return `${total.toLocaleString()} tickets reached Technical Support${movementText?', '+movementText:''}. Zoona AI resolved ${aiShare}%. Frustration averaged ${frust}/10, led by ${top.label.toLowerCase()} (${top.n.toLocaleString()} tickets).`;
}

function iconColorForIntent(k){
  return ({
    'how-to':'var(--ss-primary-500)',
    'bug':'var(--ss-negative-500)',
    'feature-req':'var(--ss-accent-500)',
    'billing':'var(--ss-warning-500)',
    'access':'var(--ss-warning-600)',
    'data':'var(--ss-secondary-500)',
    'integration':'#3B82F6',
    'complaint':'#B2401D',
    'cancellation':'#7A1F1F',
  })[k] || 'var(--ss-primary-500)';
}

// Root cause family donut + list
const RootCauseBreakdown = ({monthAgg, prevAgg}) => {
  const D = window.SUPPORT_DATA;
  const families = {};
  const prevFamilies = {};
  Object.entries(monthAgg.byRoot).forEach(([k,v])=>{
    const f = D.ROOT_CAUSES.find(x=>x.key===k);
    if (!f) return;
    families[f.family] = (families[f.family]||0)+v;
  });
  if (prevAgg) Object.entries(prevAgg.byRoot).forEach(([k,v])=>{
    const f = D.ROOT_CAUSES.find(x=>x.key===k); if (!f) return;
    prevFamilies[f.family] = (prevFamilies[f.family]||0)+v;
  });
  const sorted = Object.entries(families).sort((a,b)=>b[1]-a[1]);
  const total = sorted.reduce((a,[,v])=>a+v,0)||1;

  const palette = {
    'Self-serve':'#00828D','UX':'#7158F5','Engineering':'#E96A3E',
    'Product':'#3B82F6','External':'#94896B','Enablement':'#1F8A5B',
  };

  // Donut
  const R = 56, C = 60, stroke = 14;
  const circ = 2*Math.PI*R;
  let offset = 0;
  return (
    <div style={{display:'flex',alignItems:'center', gap:14}}>
      <svg width={C*2} height={C*2} viewBox={`0 0 ${C*2} ${C*2}`}>
        <circle cx={C} cy={C} r={R} fill="none" stroke="var(--ss-neutral-100)" strokeWidth={stroke}/>
        {sorted.map(([fam,v])=>{
          const frac = v/total;
          const seg = (
            <circle key={fam}
              cx={C} cy={C} r={R} fill="none"
              stroke={palette[fam]||'#94896B'} strokeWidth={stroke}
              strokeDasharray={`${frac*circ} ${circ}`}
              strokeDashoffset={-offset*circ}
              transform={`rotate(-90 ${C} ${C})`}/>
          );
          offset += frac;
          return seg;
        })}
        <text x={C} y={C-2} textAnchor="middle" fontSize="11" fill="var(--ss-fg-muted)" fontFamily="DM Sans">tickets</text>
        <text x={C} y={C+14} textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--ss-fg)" fontFamily="DM Sans" className="tabular">{total.toLocaleString()}</text>
      </svg>
      <div style={{flex:1, minWidth:0, display:'flex',flexDirection:'column',gap:6}}>
        {sorted.map(([fam,v])=>{
          const prev = prevFamilies[fam]||0;
          const d = prev ? (v-prev)/prev : (v>0?1:0);
          return (
            <div key={fam} style={{display:'grid', gridTemplateColumns:'10px 1fr auto auto', gap:8, alignItems:'center', fontSize:12}}>
              <span style={{width:10,height:10,borderRadius:99,background:palette[fam]}}/>
              <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{fam}</span>
              <span className="tabular" style={{fontWeight:600}}>{Math.round(v/total*100)}%</span>
              <Delta size="sm" value={d} fmt="pct" polarity="bad"/>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { MonthDashboard });
