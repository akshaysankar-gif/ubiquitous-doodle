// Metric pages — one per analytical angle the PRD calls out.
// Each renders a focused chart/table + supporting context.
// All consume the current month + the cmp month for delta rendering.

const PageScaffold = ({title, subtitle, intro, children}) => (
  <div className="scroll-area" style={{flex:1, padding:24, background:'var(--ss-neutral-50)'}}>
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:14, gap:16}}>
      <div>
        <div style={{fontSize:11, fontWeight:600, color:'var(--ss-primary-700)', textTransform:'uppercase', letterSpacing:'0.08em'}}>Metric page</div>
        <h2 style={{fontSize:22, fontWeight:700, color:'var(--ss-fg)', margin:'4px 0 0', letterSpacing:'-0.01em'}}>{title}</h2>
        {subtitle && <div style={{fontSize:12.5, color:'var(--ss-fg-muted)', marginTop:4}}>{subtitle}</div>}
      </div>
      {intro}
    </div>
    {children}
  </div>
);

// ── Customer blockers ────────────────────────────────────────────
const BlockersPage = ({monthKey, cmpKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const cur = D.monthAgg[monthKey], cmp = cmpKey?D.monthAgg[cmpKey]:null;
  const blockers = Object.entries(cur.byContactCode).map(([code,n])=>{
    const prev = cmp?.byContactCode?.[code]||0;
    return {code,n,prev,pct: prev?(n-prev)/prev:(n>0?1:0)};
  }).sort((a,b)=>b.n-a.n);
  const top10 = blockers.slice(0,10);
  const monthLabel = (D.MONTHS.find(m=>m.key===monthKey)||{}).label;

  return (
    <PageScaffold title="Customer blockers" subtitle={`The largest reasons people contacted support in ${monthLabel}`}>
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:16}}>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Top 10 contact codes" subtitle="By volume · with delta vs previous month"/>
          <div style={{display:'flex',flexDirection:'column'}}>
            {top10.map((b,i)=>{
              const max = top10[0].n;
              return (
                <div key={b.code} className="row-hover" onClick={()=>onOpenTicket({type:'code', monthKey, code:b.code})}
                  style={{display:'grid', gridTemplateColumns:'24px 1fr 80px 90px', gap:12, alignItems:'center', padding:'12px 8px', borderTop: i===0?'none':'1px solid var(--ss-neutral-100)', cursor:'pointer'}}>
                  <div style={{fontSize:13, fontWeight:700, color:'var(--ss-fg-muted)'}}>{i+1}</div>
                  <div style={{minWidth:0}}>
                    <div style={{fontSize:13, fontWeight:600, color:'var(--ss-fg)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.code}</div>
                    <div style={{marginTop:6}}><Bullet value={b.n/max} color="var(--ss-primary-500)" width={'100%'} height={6}/></div>
                  </div>
                  <span className="tabular" style={{fontSize:14, fontWeight:700, textAlign:'right'}}>{b.n}</span>
                  <div style={{display:'flex',justifyContent:'flex-end'}}><Delta size="sm" value={b.pct} fmt="pct" polarity="bad"/></div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="What's getting worse" subtitle="Largest % growth (≥10 tickets)"/>
          <div style={{display:'flex',flexDirection:'column', gap:8}}>
            {blockers.filter(b=>b.n>=10).sort((a,b)=>b.pct-a.pct).slice(0,6).map(b=>(
              <div key={b.code} className="row-hover" onClick={()=>onOpenTicket({type:'code', monthKey, code:b.code})}
                style={{padding:'10px 12px', border:'1px solid var(--ss-neutral-100)', borderRadius:8, cursor:'pointer'}}>
                <div style={{display:'flex',justifyContent:'space-between', alignItems:'center', gap:8}}>
                  <span style={{fontSize:12, fontWeight:600, whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.code}</span>
                  <Delta size="sm" value={b.pct} fmt="pct" polarity="bad" emphasize/>
                </div>
                <div className="tabular" style={{fontSize:11, color:'var(--ss-fg-muted)', marginTop:2}}>{b.prev} → {b.n} tickets</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageScaffold>
  );
};

// ── Intent ──────────────────────────────────────────────────────
const IntentPage = ({monthKey, cmpKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const tickets = D.tickets.filter(t=>t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');

  // Intent × sub-intent
  const tree = {};
  tickets.forEach(t=>{
    const i = t.intent;
    if (!tree[i]) tree[i] = {label:t.intentLabel, total:0, subs:{}};
    tree[i].total++;
    tree[i].subs[t.subIntent] = (tree[i].subs[t.subIntent]||0)+1;
  });

  return (
    <PageScaffold title="Intent / Sub-intent" subtitle="What jobs customers were trying to do — and where each job branches">
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
        {Object.entries(tree).sort((a,b)=>b[1].total-a[1].total).map(([k,v])=>{
          const color = intentColor(k);
          const subs = Object.entries(v.subs).sort((a,b)=>b[1]-a[1]);
          const max = subs[0]?.[1]||1;
          return (
            <Card key={k} style={{padding:'14px 16px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{width:10,height:10,borderRadius:99,background:color}}/>
                  <span style={{fontSize:13, fontWeight:700}}>{v.label}</span>
                </div>
                <span className="tabular" style={{fontSize:14, fontWeight:700}}>{v.total}</span>
              </div>
              <div style={{display:'flex',flexDirection:'column', gap:8}}>
                {subs.map(([s,n])=>(
                  <div key={s}>
                    <div style={{display:'flex',justifyContent:'space-between', fontSize:11.5, marginBottom:2}}>
                      <span style={{color:'var(--ss-fg)'}}>{s}</span>
                      <span className="tabular" style={{color:'var(--ss-fg-muted)', fontWeight:600}}>{n}</span>
                    </div>
                    <Bullet value={n/max} color={color} height={5}/>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </PageScaffold>
  );
};

function intentColor(k){
  return ({
    'how-to':'#00828D','bug':'#E96A3E','feature-req':'#7158F5','billing':'#E1A23B',
    'access':'#B2401D','data':'#475569','integration':'#3B82F6','complaint':'#B2401D','cancellation':'#7A1F1F',
  })[k] || '#00828D';
}

// ── Product hotspots ─────────────────────────────────────────────
const ProductPage = ({monthKey, cmpKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const tickets = D.tickets.filter(t=>t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');
  const byModuleArea = {};
  tickets.forEach(t=>{
    if (!byModuleArea[t.module]) byModuleArea[t.module] = {total:0, areas:{}};
    byModuleArea[t.module].total++;
    if (!byModuleArea[t.module].areas[t.area]) byModuleArea[t.module].areas[t.area] = {n:0, frust:0, sum:0, subs:{}};
    const A = byModuleArea[t.module].areas[t.area];
    A.n++; A.sum += t.frustration; A.frust = A.sum/A.n;
    A.subs[t.subarea] = (A.subs[t.subarea]||0)+1;
  });
  const moduleEntries = Object.entries(byModuleArea).sort((a,b)=>b[1].total-a[1].total);

  return (
    <PageScaffold title="Product hotspots" subtitle="Module → Area → Subarea — exactly where the product is generating support load">
      <div style={{display:'flex',flexDirection:'column', gap:14}}>
        {moduleEntries.map(([mod, info])=>{
          const areas = Object.entries(info.areas).sort((a,b)=>b[1].n-a[1].n);
          const max = areas[0]?.[1].n || 1;
          return (
            <Card key={mod} style={{padding:'16px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{width:6,height:24,borderRadius:3, background: window.MODULE_COLORS?.[mod]||'#00828D'}}/>
                  <span style={{fontSize:14, fontWeight:700}}>{mod}</span>
                </div>
                <span className="tabular" style={{fontSize:13, fontWeight:700, color:'var(--ss-fg-muted)'}}>{info.total} tickets</span>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:10}}>
                {areas.map(([area, a])=>{
                  const topSub = Object.entries(a.subs).sort((x,y)=>y[1]-x[1])[0];
                  return (
                    <div key={area} onClick={()=>onOpenTicket({type:'area', monthKey, module:mod, area})}
                      className="row-hover" style={{border:'1px solid var(--ss-neutral-100)', borderRadius:8, padding:'10px 12px', cursor:'pointer'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', marginBottom:4}}>
                        <span style={{fontSize:12, fontWeight:600}}>{area}</span>
                        <span className="tabular" style={{fontSize:12, fontWeight:700}}>{a.n}</span>
                      </div>
                      <Bullet value={a.n/max} color={frustToColor(a.frust)} height={5}/>
                      <div style={{display:'flex',alignItems:'center', justifyContent:'space-between', marginTop:8, fontSize:10.5, color:'var(--ss-fg-muted)'}}>
                        <span>Top: <strong style={{color:'var(--ss-fg)'}}>{topSub?.[0]}</strong></span>
                        <span className="tabular">frust {a.frust.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </PageScaffold>
  );
};

function frustToColor(f){
  if (f<3) return '#1F8A5B';
  if (f<5) return '#E1A23B';
  if (f<7) return '#E96A3E';
  return '#B2401D';
}

// ── Contact codes (trending up / down) ──────────────────────────
const ContactCodesPage = ({monthKey, cmpKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const cur = D.monthAgg[monthKey];
  const cmp = cmpKey ? D.monthAgg[cmpKey] : null;
  const all = new Set([...Object.keys(cur.byContactCode), ...Object.keys(cmp?.byContactCode||{})]);
  const rows = [...all].map(code => {
    const a = cur.byContactCode[code]||0;
    const b = cmp?.byContactCode?.[code]||0;
    return {code, a, b, delta: a-b, pct: b?(a-b)/b:(a>0?1:0)};
  });
  const up = rows.filter(r=>r.delta>0).sort((x,y)=>y.delta-x.delta).slice(0,10);
  const down = rows.filter(r=>r.delta<0).sort((x,y)=>x.delta-y.delta).slice(0,10);

  // 6-month sparkline per code
  function spark(code){ return D.MONTHS.map(m=> D.monthAgg[m.key].byContactCode[code]||0); }

  const Row = ({r}) => (
    <div className="row-hover" onClick={()=>onOpenTicket({type:'code', monthKey, code:r.code})}
      style={{display:'grid', gridTemplateColumns:'1fr 120px 80px 90px', gap:12, alignItems:'center', padding:'10px 12px', borderRadius:8, border:'1px solid var(--ss-neutral-100)', cursor:'pointer'}}>
      <div style={{minWidth:0}}>
        <div style={{fontSize:12.5, fontWeight:600, whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.code}</div>
        <div className="tabular" style={{fontSize:11, color:'var(--ss-fg-muted)'}}>{r.b} → {r.a}</div>
      </div>
      <Sparkline values={spark(r.code)} width={120} height={28}
        stroke={r.delta>=0?'var(--ss-negative-500)':'var(--ss-positive-500)'}
        fill={r.delta>=0?'rgba(233,106,62,0.12)':'rgba(31,138,91,0.12)'}/>
      <span className="tabular" style={{textAlign:'right', fontSize:12.5, fontWeight:700, color: r.delta>=0?'var(--ss-negative-600)':'var(--ss-positive-600)'}}>{r.delta>0?'+':''}{r.delta}</span>
      <div style={{display:'flex',justifyContent:'flex-end'}}><Delta size="sm" value={r.pct} fmt="pct" polarity="bad"/></div>
    </div>
  );

  return (
    <PageScaffold title="Contact codes" subtitle="Which Module · Area buckets are trending — month-over-month">
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Trending up" subtitle="Watch list — these need attention"/>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>{up.map(r=><Row key={r.code} r={r}/>)}</div>
        </Card>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Trending down" subtitle="Wins — fewer customer headaches"/>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>{down.map(r=><Row key={r.code} r={r}/>)}</div>
        </Card>
      </div>
    </PageScaffold>
  );
};

// ── Root cause ──────────────────────────────────────────────────
const RootCausePage = ({monthKey, cmpKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const tickets = D.tickets.filter(t=>t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');
  const byCause = {};
  tickets.forEach(t=>{
    if (!byCause[t.rootCause]) byCause[t.rootCause] = {cause:t.rootCauseLabel, family:t.rootCauseFamily, n:0, modules:{}, examples:[]};
    byCause[t.rootCause].n++;
    byCause[t.rootCause].modules[t.module] = (byCause[t.rootCause].modules[t.module]||0)+1;
    if (byCause[t.rootCause].examples.length<3) byCause[t.rootCause].examples.push(t.subject);
  });
  const sorted = Object.entries(byCause).sort((a,b)=>b[1].n-a[1].n);
  const total = tickets.length||1;

  return (
    <PageScaffold title="Root cause" subtitle="Why this month's tickets were generated, grouped by the underlying cause">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:14}}>
        {sorted.map(([k,c])=>{
          const topModules = Object.entries(c.modules).sort((a,b)=>b[1]-a[1]).slice(0,3);
          return (
            <Card key={k} style={{padding:'14px 16px'}}>
              <div style={{display:'flex',justifyContent:'space-between', alignItems:'flex-start', marginBottom:6}}>
                <div>
                  <Tag color={familyColor(c.family)}>{c.family}</Tag>
                  <div style={{fontSize:14, fontWeight:700, marginTop:6}}>{c.cause}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="tabular" style={{fontSize:20, fontWeight:700}}>{c.n}</div>
                  <div style={{fontSize:11, color:'var(--ss-fg-muted)'}}>{Math.round(c.n/total*100)}% of month</div>
                </div>
              </div>
              <Bullet value={c.n/sorted[0][1].n} color="var(--ss-primary-500)" height={5}/>
              <div style={{marginTop:10, fontSize:11, color:'var(--ss-fg-muted)'}}>Most affected modules</div>
              <div style={{display:'flex',gap:6, flexWrap:'wrap', marginTop:6}}>
                {topModules.map(([m,n])=>(
                  <span key={m} style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 8px', borderRadius:99, background:'var(--ss-neutral-50)', border:'1px solid var(--ss-neutral-100)', fontSize:11, fontWeight:500}}>
                    {m} <span className="tabular" style={{color:'var(--ss-fg-muted)', fontWeight:600}}>· {n}</span>
                  </span>
                ))}
              </div>
              <div style={{marginTop:10, fontSize:11, color:'var(--ss-fg-muted)'}}>Example subjects</div>
              <ul style={{margin:'4px 0 0', padding:0, listStyle:'none'}}>
                {c.examples.map((ex,i)=>(
                  <li key={i} style={{fontSize:11.5, color:'var(--ss-fg)', padding:'3px 0', lineHeight:1.4,
                    borderTop: i?'1px dashed var(--ss-neutral-100)':'none'}}>
                    <Icon name="quote" size={10} color="var(--ss-fg-muted)"/> <span style={{marginLeft:4}}>{ex}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </PageScaffold>
  );
};
function familyColor(fam){
  return ({'Self-serve':'mint','UX':'purple','Engineering':'red','Product':'mint','External':'neutral','Enablement':'green'})[fam] || 'default';
}

// ── Frustration ─────────────────────────────────────────────────
const FrustrationPage = ({monthKey, cmpKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const cur = D.monthAgg[monthKey];
  const cmp = cmpKey?D.monthAgg[cmpKey]:null;
  const tickets = D.tickets.filter(t=>t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');

  // distribution over modules
  const modSent = {};
  tickets.forEach(t=>{
    if (!modSent[t.module]) modSent[t.module] = {calm:0,annoyed:0,frustrated:0,furious:0, total:0, sum:0};
    modSent[t.module][t.sentiment]++;
    modSent[t.module].total++;
    modSent[t.module].sum += t.frustration;
  });
  const mods = Object.entries(modSent).map(([m,v])=>({m,...v, avg: v.sum/v.total})).sort((a,b)=>b.avg-a.avg);

  // furious-only ticket sample
  const furious = tickets.filter(t=>t.sentiment==='furious').slice(0,6);

  return (
    <PageScaffold title="Frustration" subtitle="Where customers wrote in hot — and where the temperature is rising">
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Sentiment band — this month" subtitle={`${cur.total.toLocaleString()} tickets · avg ${cur.avgFrustration.toFixed(1)}/10`}/>
          <SentimentBar distribution={cur.bySentiment} height={20} showLabels/>
          {cmp && (
            <div style={{marginTop:14}}>
              <div style={{fontSize:11, color:'var(--ss-fg-muted)', marginBottom:4}}>Previous: {cmp.total.toLocaleString()} · avg {cmp.avgFrustration.toFixed(1)}/10</div>
              <SentimentBar distribution={cmp.bySentiment} height={10}/>
            </div>
          )}
        </Card>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Hottest modules" subtitle="Ranked by average frustration"/>
          <div style={{display:'flex',flexDirection:'column', gap:8}}>
            {mods.slice(0,6).map(m=>(
              <div key={m.m} style={{display:'grid', gridTemplateColumns:'1fr 110px 80px 56px', gap:10, alignItems:'center'}}>
                <span style={{fontSize:12.5, fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.m}</span>
                <SentimentBar distribution={m} height={8}/>
                <span className="tabular" style={{fontSize:12, textAlign:'right'}}>{m.total}</span>
                <span className="tabular" style={{fontSize:13, fontWeight:700, textAlign:'right', color:frustToColor(m.avg)}}>{m.avg.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{padding:'16px 18px'}}>
        <SectionHead title="Furious tickets — needing immediate attention" subtitle="A sample drawn from the worst-rated conversations"/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:10}}>
          {furious.map(t=>(
            <div key={t.id} className="row-hover" onClick={()=>onOpenTicket({type:'ticket', monthKey, ticket:t})}
              style={{border:'1px solid var(--ss-neutral-100)', borderRadius:8, padding:'12px 14px', cursor:'pointer'}}>
              <div style={{display:'flex',justifyContent:'space-between', marginBottom:4}}>
                <Tag color="red">{t.id}</Tag>
                <SentimentChip band={t.sentiment} size="sm"/>
              </div>
              <div style={{fontSize:12.5, fontWeight:600, marginTop:6, color:'var(--ss-fg)', lineHeight:1.35}}>{t.subject}</div>
              <div style={{fontSize:11, color:'var(--ss-fg-muted)', marginTop:6}}>{t.module} · {t.area} · {t.intentLabel}</div>
            </div>
          ))}
        </div>
      </Card>
    </PageScaffold>
  );
};

// ── Automation ──────────────────────────────────────────────────
const AutomationPage = ({monthKey, cmpKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const tickets = D.tickets.filter(t=>t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');
  // bucket by automation score
  const buckets = {'High (≥0.7)':[], 'Medium (0.4–0.7)':[], 'Low (<0.4)':[]};
  tickets.forEach(t=>{
    const k = t.automation>=0.7 ? 'High (≥0.7)' : t.automation>=0.4 ? 'Medium (0.4–0.7)' : 'Low (<0.4)';
    buckets[k].push(t);
  });

  // Module ranking by avg automation potential
  const modAuto = {};
  tickets.forEach(t=>{
    if (!modAuto[t.module]) modAuto[t.module] = {n:0, sum:0};
    modAuto[t.module].n++; modAuto[t.module].sum += t.automation;
  });
  const ranked = Object.entries(modAuto).map(([m,v])=>({m, n:v.n, avg:v.sum/v.n})).sort((a,b)=>b.avg-a.avg);

  // High-confidence list
  const high = tickets.filter(t=>t.automation>=0.75).slice(0,8);

  return (
    <PageScaffold title="Automation potential" subtitle="Could Zoona AI handle this work? — scored per ticket, rolled up to module & intent">
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16}}>
        {Object.entries(buckets).map(([k,arr])=>{
          const pct = arr.length / (tickets.length||1);
          return (
            <Card key={k} style={{padding:'14px 16px'}}>
              <div style={{fontSize:11, fontWeight:600, color:'var(--ss-fg-muted)', textTransform:'uppercase', letterSpacing:'0.04em'}}>{k}</div>
              <div style={{display:'flex',alignItems:'baseline', gap:6, marginTop:4}}>
                <div className="tabular" style={{fontSize:26, fontWeight:700}}>{arr.length.toLocaleString()}</div>
                <span style={{fontSize:12, color:'var(--ss-fg-muted)'}}>{Math.round(pct*100)}% of tickets</span>
              </div>
              <div style={{marginTop:8}}><Bullet value={pct} color={k.startsWith('High')?'var(--ss-positive-500)':k.startsWith('Medium')?'var(--ss-warning-500)':'var(--ss-neutral-300)'} width="100%" height={6}/></div>
            </Card>
          );
        })}
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:16}}>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Best automation candidates by module" subtitle="High avg potential = self-serve content / Zoona AI win"/>
          <div style={{display:'flex',flexDirection:'column', gap:8}}>
            {ranked.map(r=>(
              <div key={r.m} style={{display:'grid', gridTemplateColumns:'1fr 1fr 60px 60px', gap:10, alignItems:'center'}}>
                <span style={{fontSize:12.5, fontWeight:600}}>{r.m}</span>
                <Bullet value={r.avg} color="var(--ss-positive-500)" width="100%" height={6}/>
                <span className="tabular" style={{textAlign:'right', fontSize:12, color:'var(--ss-fg-muted)'}}>{r.n}</span>
                <span className="tabular" style={{textAlign:'right', fontSize:13, fontWeight:700}}>{Math.round(r.avg*100)}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="High-confidence automation candidates" subtitle="Tickets Zoona AI could likely handle next month"/>
          <div style={{display:'flex',flexDirection:'column', gap:8}}>
            {high.map(t=>(
              <div key={t.id} onClick={()=>onOpenTicket({type:'ticket', monthKey, ticket:t})} className="row-hover"
                style={{border:'1px solid var(--ss-neutral-100)', borderRadius:8, padding:'10px 12px', cursor:'pointer'}}>
                <div style={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                  <Tag color="mint">{Math.round(t.automation*100)}% auto</Tag>
                  <span style={{fontSize:11, color:'var(--ss-fg-muted)'}}>{t.module} · {t.area}</span>
                </div>
                <div style={{fontSize:12.5, fontWeight:600, marginTop:6, lineHeight:1.35}}>{t.subject}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageScaffold>
  );
};

// ── Support effort ──────────────────────────────────────────────
const EffortPage = ({monthKey, cmpKey}) => {
  const D = window.SUPPORT_DATA;
  const tickets = D.tickets.filter(t=>t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');
  const buckets = {'<1h':0, '1–2h':0, '2–4h':0, '4–8h':0, '>8h':0};
  tickets.forEach(t=>{
    const h = t.effortHrs;
    const k = h<1?'<1h': h<2?'1–2h': h<4?'2–4h': h<8?'4–8h':'>8h';
    buckets[k]++;
  });
  const teamHisto = {1:0,2:0,3:0,4:0};
  tickets.forEach(t=>{ teamHisto[t.teamsInvolved] = (teamHisto[t.teamsInvolved]||0)+1; });

  // module average effort
  const modEff = {};
  tickets.forEach(t=>{ if(!modEff[t.module]) modEff[t.module]={n:0,sum:0,multi:0}; modEff[t.module].n++; modEff[t.module].sum+=t.effortHrs; if(t.teamsInvolved>1)modEff[t.module].multi++; });
  const modEffR = Object.entries(modEff).map(([m,v])=>({m,n:v.n,avg:v.sum/v.n,multi:v.multi})).sort((a,b)=>b.avg-a.avg);

  const max = Math.max(...Object.values(buckets));
  return (
    <PageScaffold title="Support effort" subtitle="How much support time these tickets consumed — and where teams had to collaborate">
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Resolution time distribution"/>
          <div style={{display:'flex', alignItems:'flex-end', height:200, gap:10}}>
            {Object.entries(buckets).map(([k,v])=>(
              <div key={k} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, height:'100%'}}>
                <div style={{flex:1, width:'100%', display:'flex', alignItems:'flex-end'}}>
                  <div style={{width:'100%', height: `${(v/max)*100}%`, background:'var(--ss-primary-500)', borderRadius:'6px 6px 0 0', position:'relative'}}>
                    <div className="tabular" style={{position:'absolute', top:-18, left:'50%', transform:'translateX(-50%)', fontSize:11, fontWeight:600, color:'var(--ss-fg)'}}>{v}</div>
                  </div>
                </div>
                <div style={{fontSize:11, color:'var(--ss-fg-muted)'}}>{k}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{padding:'16px 18px'}}>
          <SectionHead title="Teams involved" subtitle="Multi-team tickets are the expensive ones"/>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {Object.entries(teamHisto).map(([k,v])=>(
              <div key={k} style={{display:'grid', gridTemplateColumns:'70px 1fr 60px', gap:10, alignItems:'center'}}>
                <span style={{fontSize:12, fontWeight:600}}>{k} team{k=='1'?'':'s'}</span>
                <Bullet value={v/Math.max(...Object.values(teamHisto))} color={k>1?'var(--ss-warning-500)':'var(--ss-primary-500)'} width="100%" height={8}/>
                <span className="tabular" style={{textAlign:'right', fontSize:13, fontWeight:700}}>{v.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{padding:'16px 18px'}}>
        <SectionHead title="Most expensive modules" subtitle="Highest avg effort + frequent multi-team handoffs"/>
        <div style={{display:'grid', gridTemplateColumns:'2fr 100px 100px 100px', gap:10, padding:'4px 8px', fontSize:10, color:'var(--ss-fg-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em'}}>
          <span>Module</span><span style={{textAlign:'right'}}>Tickets</span><span style={{textAlign:'right'}}>Avg hrs</span><span style={{textAlign:'right'}}>Multi-team</span>
        </div>
        {modEffR.map(r=>(
          <div key={r.m} style={{display:'grid', gridTemplateColumns:'2fr 100px 100px 100px', gap:10, padding:'10px 8px', borderTop:'1px solid var(--ss-neutral-100)', alignItems:'center'}}>
            <span style={{fontSize:12.5, fontWeight:600}}>{r.m}</span>
            <span className="tabular" style={{textAlign:'right', fontSize:12}}>{r.n}</span>
            <span className="tabular" style={{textAlign:'right', fontSize:13, fontWeight:700, color:frustToColor(r.avg*1.5)}}>{r.avg.toFixed(1)}</span>
            <span className="tabular" style={{textAlign:'right', fontSize:12, fontWeight:600}}>{r.multi} <span style={{color:'var(--ss-fg-muted)', fontWeight:400}}>({Math.round(r.multi/r.n*100)}%)</span></span>
          </div>
        ))}
      </Card>
    </PageScaffold>
  );
};

// ── Systemic signals ────────────────────────────────────────────
const SignalsPage = ({monthKey, cmpKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const cur = D.monthAgg[monthKey];
  const cmp = cmpKey?D.monthAgg[cmpKey]:null;

  // Generated systemic signals — opinion mixed from data
  const signals = React.useMemo(()=>{
    const list = [];

    // 1) Biggest mover up
    const movers = cmpKey ? D.topMovers(cmpKey, monthKey, 12) : [];
    const upMover = movers.find(m=>m.pct>0.3 && m.b>=10);
    if (upMover) list.push({
      kind:'spike', severity:'high',
      title:`${upMover.code} spiked +${Math.round(upMover.pct*100)}%`,
      body:`${upMover.a} → ${upMover.b} tickets vs prior month — investigate whether a recent release or doc gap is driving this.`,
      action:'Review release notes & doc coverage for this area',
    });

    // 2) High frustration + low automation = customers stuck
    const tickets = D.tickets.filter(t=>t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');
    const stuck = {};
    tickets.forEach(t=>{
      const k = t.module+' · '+t.area;
      if (!stuck[k]) stuck[k] = {n:0, sumF:0, sumA:0};
      stuck[k].n++; stuck[k].sumF+=t.frustration; stuck[k].sumA+=t.automation;
    });
    const stuckArr = Object.entries(stuck).map(([k,v])=>({k,n:v.n,frust:v.sumF/v.n,auto:v.sumA/v.n}))
      .filter(x=>x.n>=15 && x.frust>6 && x.auto<0.4).sort((a,b)=>b.frust-a.frust);
    if (stuckArr[0]) list.push({
      kind:'frustration', severity:'high',
      title:`Customers stuck on "${stuckArr[0].k}"`,
      body:`Frustration averages ${stuckArr[0].frust.toFixed(1)}/10 and automation potential is only ${Math.round(stuckArr[0].auto*100)}%. ${stuckArr[0].n} tickets this month.`,
      action:'Eng / Product follow-up — likely product fix needed',
    });

    // 3) Multi-team explosion
    if (cmp && cur.multiTeam > cmp.multiTeam*1.2) {
      list.push({
        kind:'effort', severity:'med',
        title:`Multi-team tickets jumped +${Math.round((cur.multiTeam-cmp.multiTeam)/cmp.multiTeam*100)}%`,
        body:`${cmp.multiTeam} → ${cur.multiTeam} tickets required 2+ teams. Likely root-cause: cross-cutting bugs or unclear ownership.`,
        action:'Triage process review · clarify owners',
      });
    }

    // 4) Automation upside
    const autoOpp = Object.entries(cur.byContactCode).filter(([k,n])=>{
      const ticks = tickets.filter(t=>k===t.module+' · '+t.area);
      const auto = ticks.reduce((a,t)=>a+t.automation,0)/ticks.length;
      return n>=20 && auto>=0.7;
    }).sort((a,b)=>b[1]-a[1])[0];
    if (autoOpp) list.push({
      kind:'opportunity', severity:'low',
      title:`Automation opportunity in ${autoOpp[0]}`,
      body:`${autoOpp[1]} tickets, ${'>'}70% deemed automatable — a single help-doc + Zoona AI rule could deflect most of these.`,
      action:'Self-serve content + AI agent rule',
    });

    // 5) Cancellation creeping
    const cancN = (cur.byIntent.cancellation||0);
    if (cancN > 10) list.push({
      kind:'cancellation', severity:'high',
      title:`${cancN} cancellation conversations this month`,
      body:`Mostly tied to billing edge cases and discoverability of the downgrade path. Worth a retention review.`,
      action:'Loop in Customer Success for save-team plays',
    });

    return list;
  }, [monthKey, cmpKey]);

  const sevColor = {high:'red', med:'orange', low:'mint'};

  return (
    <PageScaffold title="Systemic signals" subtitle="The story buried in the data — themes worth raising to product / eng / leadership">
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px, 1fr))', gap:14}}>
        {signals.map((s,i)=>(
          <Card key={i} style={{padding:'16px 18px'}}>
            <div style={{display:'flex',justifyContent:'space-between', alignItems:'flex-start', marginBottom:6}}>
              <Tag color={sevColor[s.severity]}>{s.severity.toUpperCase()}</Tag>
              <Tag color="neutral">{s.kind}</Tag>
            </div>
            <div style={{fontSize:14, fontWeight:700, lineHeight:1.3, marginBottom:6}}>{s.title}</div>
            <div style={{fontSize:12.5, color:'var(--ss-fg-muted)', lineHeight:1.5}}>{s.body}</div>
            <div style={{marginTop:12, padding:'10px 12px', background:'var(--ss-neutral-50)', borderRadius:8, fontSize:12, color:'var(--ss-fg)', display:'flex', alignItems:'center', gap:8}}>
              <Icon name="zap" size={14} color="var(--ss-primary-500)"/>
              <strong>Suggested action:</strong> {s.action}
            </div>
          </Card>
        ))}
      </div>
    </PageScaffold>
  );
};

window.MODULE_COLORS = {
  'Survey Builder':'#00828D','Distribution':'#7158F5','Audience':'#3B82F6',
  'Reports':'#1F8A5B','Integrations':'#E96A3E','Account':'#B2401D',
  'ThriveSparrow':'#E1A23B','SparrowDesk':'#475569',
};

Object.assign(window, { BlockersPage, IntentPage, ProductPage, ContactCodesPage, RootCausePage, FrustrationPage, AutomationPage, EffortPage, SignalsPage, PageScaffold });
