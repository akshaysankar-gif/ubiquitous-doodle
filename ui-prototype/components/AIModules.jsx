// AI modules — stub pages for the future open-ended areas the PRD calls out.
// Each is functional enough to read like a roadmap not a stub.

const AIvsHumanPage = ({monthKey, cmpKey, onOpenTicket}) => {
  const D = window.SUPPORT_DATA;
  const tickets = D.tickets.filter(t=>t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');
  const ai = tickets.filter(t=>t.isAI);
  const human = tickets.filter(t=>!t.isAI);

  const stats = (arr) => {
    const n = arr.length;
    if (!n) return {n:0, avgFrust:0, avgEffort:0, resolvedPct:0};
    return {
      n,
      avgFrust: arr.reduce((a,t)=>a+t.frustration,0)/n,
      avgEffort: arr.reduce((a,t)=>a+t.effortHrs,0)/n,
      resolvedPct: arr.filter(t=>t.status==='Resolved').length/n,
    };
  };
  const aS = stats(ai), hS = stats(human);

  // Intent-by-intent split
  const intentSplit = D.INTENTS.map(i=>{
    const aiN = ai.filter(t=>t.intent===i.key).length;
    const huN = human.filter(t=>t.intent===i.key).length;
    return {i, aiN, huN, total: aiN+huN};
  }).filter(x=>x.total>0).sort((a,b)=>b.total-a.total);

  return (
    <PageScaffold title="AI vs Human" subtitle="How Zoona AI is performing relative to human agents — preview module"
      intro={<Tag color="purple">Preview module</Tag>}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16}}>
        <AIvsHumanCard label="Zoona AI" icon="bot" color="var(--ss-accent-500)" stats={aS}/>
        <AIvsHumanCard label="Human agents" icon="user" color="var(--ss-primary-500)" stats={hS}/>
      </div>

      <Card style={{padding:'16px 18px', marginBottom:16}}>
        <SectionHead title="Workload split by intent" subtitle="Who is currently handling what kind of ticket"/>
        <div style={{display:'flex',flexDirection:'column', gap:10}}>
          {intentSplit.map(({i,aiN,huN,total})=>{
            const aiPct = aiN/total, huPct=huN/total;
            return (
              <div key={i.key} style={{display:'grid', gridTemplateColumns:'160px 1fr 100px', gap:14, alignItems:'center'}}>
                <div style={{fontSize:12.5, fontWeight:600}}>{i.label}</div>
                <div style={{display:'flex', height:14, borderRadius:99, overflow:'hidden', background:'var(--ss-neutral-100)'}}>
                  <div style={{width:`${aiPct*100}%`, background:'var(--ss-accent-500)'}}/>
                  <div style={{width:`${huPct*100}%`, background:'var(--ss-primary-500)'}}/>
                </div>
                <div className="tabular" style={{fontSize:11.5, color:'var(--ss-fg-muted)', textAlign:'right'}}>
                  <span style={{color:'var(--ss-accent-700)', fontWeight:600}}>{Math.round(aiPct*100)}% AI</span>
                  <span> · </span>
                  <span style={{color:'var(--ss-primary-700)', fontWeight:600}}>{Math.round(huPct*100)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card style={{padding:'16px 18px'}}>
        <SectionHead title="Roadmap for this module" subtitle="What we'll build out next"/>
        <RoadmapList items={[
          {done:true,  title:'Tag AI-resolved tickets by assignee = "Zoona AI"'},
          {done:false, title:'Side-by-side trace viewer — AI conversation vs human conversation on similar tickets'},
          {done:false, title:'Quality scorecard — accuracy, escalation rate, handoff cleanness'},
          {done:false, title:'Per-intent coverage map — which categories AI should/shouldn\'t take'},
          {done:false, title:'A/B replay — see how Zoona AI would have handled a human-resolved ticket'},
        ]}/>
      </Card>
    </PageScaffold>
  );
};

const AIvsHumanCard = ({label, icon, color, stats}) => (
  <Card style={{padding:'18px 20px', borderColor: color, borderWidth:1}}>
    <div style={{display:'flex',alignItems:'center', gap:10, marginBottom:10}}>
      <div style={{width:34, height:34, borderRadius:8, background:color+'18', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <i data-lucide={icon} style={{width:18, height:18, color, strokeWidth:1.75}}/>
      </div>
      <div>
        <div style={{fontSize:14, fontWeight:700}}>{label}</div>
        <div style={{fontSize:11, color:'var(--ss-fg-muted)'}}>This month · Technical Support</div>
      </div>
    </div>
    <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8}}>
      <Stat label="Tickets" value={stats.n.toLocaleString()}/>
      <Stat label="Resolved" value={`${Math.round(stats.resolvedPct*100)}%`}/>
      <Stat label="Avg effort" value={`${stats.avgEffort.toFixed(1)}h`}/>
      <Stat label="Avg frustration" value={stats.avgFrust.toFixed(1)}/>
    </div>
  </Card>
);

// ── Coaching ──────────────────────────────────────────────────
const CoachingPage = () => {
  const agents = [
    {name:'Akshay K.',  handled:48,  avgFrust:4.2, resolution:'94%', strengths:['Clear writing','Fast first response'], coaching:['Push for root-cause earlier']},
    {name:'Meena S.',   handled:39,  avgFrust:5.1, resolution:'91%', strengths:['Empathy','Edge cases'],   coaching:['Tighter macros for billing']},
    {name:'Oliver P.',  handled:33,  avgFrust:6.4, resolution:'82%', strengths:['Technical depth'], coaching:['De-escalation language','Faster handoffs']},
    {name:'Priya V.',   handled:51,  avgFrust:3.8, resolution:'96%', strengths:['Volume + quality','Macros'], coaching:['Mentor other agents']},
    {name:'Daniel R.',  handled:28,  avgFrust:5.8, resolution:'85%', strengths:['Long-form clarity'],   coaching:['Set expectations earlier']},
  ];
  return (
    <PageScaffold title="Coaching" subtitle="Per-agent insights to surface in 1:1s — preview module"
      intro={<Tag color="purple">Preview module</Tag>}>
      <Card style={{padding:'16px 18px', marginBottom:16}}>
        <SectionHead title="Agent leaderboard" subtitle="Sortable by tickets handled, resolution rate, customer frustration"/>
        <div style={{display:'grid', gridTemplateColumns:'1fr 100px 100px 100px 1fr 1fr', gap:10, padding:'4px 8px', fontSize:10, color:'var(--ss-fg-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em'}}>
          <span>Agent</span><span style={{textAlign:'right'}}>Handled</span><span style={{textAlign:'right'}}>Avg frust</span><span style={{textAlign:'right'}}>Resolution</span><span>Strengths</span><span>Coaching</span>
        </div>
        {agents.map(a=>(
          <div key={a.name} style={{display:'grid', gridTemplateColumns:'1fr 100px 100px 100px 1fr 1fr', gap:10, padding:'12px 8px', borderTop:'1px solid var(--ss-neutral-100)', alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center', gap:8, minWidth:0}}>
              <Avatar size="sm" mode="initials" initials={a.name.split(' ').map(x=>x[0]).join('')}/>
              <span style={{fontSize:13, fontWeight:600}}>{a.name}</span>
            </div>
            <span className="tabular" style={{textAlign:'right', fontSize:13, fontWeight:700}}>{a.handled}</span>
            <span className="tabular" style={{textAlign:'right', fontSize:13, fontWeight:700, color:'#E1A23B'}}>{a.avgFrust.toFixed(1)}</span>
            <span className="tabular" style={{textAlign:'right', fontSize:13, fontWeight:700, color:'#1F8A5B'}}>{a.resolution}</span>
            <div style={{display:'flex',gap:4, flexWrap:'wrap'}}>{a.strengths.map(s=><Tag key={s} color="green">{s}</Tag>)}</div>
            <div style={{display:'flex',gap:4, flexWrap:'wrap'}}>{a.coaching.map(s=><Tag key={s} color="orange">{s}</Tag>)}</div>
          </div>
        ))}
      </Card>

      <Card style={{padding:'16px 18px'}}>
        <SectionHead title="Roadmap for this module" subtitle="What we'll build out next"/>
        <RoadmapList items={[
          {done:false, title:'Per-agent quality rubric — tone, accuracy, completeness, empathy'},
          {done:false, title:'Auto-coaching prompts — "you handled X this way; consider Y"'},
          {done:false, title:'Highlight reels — best/worst conversations of the week with rationale'},
          {done:false, title:'1:1 export — auto-prepped weekly review doc'},
        ]}/>
      </Card>
    </PageScaffold>
  );
};

// ── Upsell ────────────────────────────────────────────────────
const UpsellPage = () => {
  const leads = [
    {ticket:'T-104223', signal:'asked for SAML SSO', plan:'Growth → Enterprise', product:'SurveySparrow', confidence:0.92},
    {ticket:'T-103992', signal:'wants Salesforce sync',plan:'Add-on', product:'SurveySparrow', confidence:0.88},
    {ticket:'T-104112', signal:'10k+ contacts/month', plan:'Growth → Business', product:'SurveySparrow', confidence:0.85},
    {ticket:'T-104351', signal:'asked about ThriveSparrow OKRs', plan:'Cross-sell', product:'ThriveSparrow', confidence:0.78},
    {ticket:'T-104287', signal:'multi-workspace setup', plan:'Business', product:'SurveySparrow', confidence:0.74},
    {ticket:'T-104004', signal:'GDPR / data residency', plan:'Enterprise', product:'SurveySparrow', confidence:0.71},
  ];
  return (
    <PageScaffold title="Upsell / Cross-sell signals" subtitle="Conversations where the customer asked for something we already sell — preview module"
      intro={<Tag color="purple">Preview module</Tag>}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16}}>
        <KpiCard icon="sparkles" label="Qualified leads" value="42" accent="accent"/>
        <KpiCard icon="dollar-sign" label="Est. ARR opportunity" value="$184k" accent="positive"/>
        <KpiCard icon="git-pull-request" label="Cross-sells (ThriveSparrow)" value="11" accent="highlight"/>
      </div>

      <Card style={{padding:'16px 18px', marginBottom:16}}>
        <SectionHead title="High-confidence lead list" subtitle="Tickets matched against feature catalog — confidence ≥ 0.7"/>
        <div style={{display:'grid', gridTemplateColumns:'90px 1fr 1fr 1fr 80px', gap:10, padding:'4px 8px', fontSize:10, color:'var(--ss-fg-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em'}}>
          <span>Ticket</span><span>Signal</span><span>Suggested plan</span><span>Product</span><span style={{textAlign:'right'}}>Confidence</span>
        </div>
        {leads.map(l=>(
          <div key={l.ticket} style={{display:'grid', gridTemplateColumns:'90px 1fr 1fr 1fr 80px', gap:10, padding:'10px 8px', borderTop:'1px solid var(--ss-neutral-100)', alignItems:'center'}}>
            <Tag color="default">{l.ticket}</Tag>
            <span style={{fontSize:12.5}}>{l.signal}</span>
            <Tag color="purple">{l.plan}</Tag>
            <Tag color="mint">{l.product}</Tag>
            <span className="tabular" style={{textAlign:'right', fontSize:13, fontWeight:700, color:'#1F8A5B'}}>{Math.round(l.confidence*100)}%</span>
          </div>
        ))}
      </Card>

      <Card style={{padding:'16px 18px'}}>
        <SectionHead title="Roadmap for this module"/>
        <RoadmapList items={[
          {done:true,  title:'Match ticket text against product feature catalog'},
          {done:false, title:'Sync leads to Salesforce / HubSpot pipeline'},
          {done:false, title:'Per-CSM weekly digest of leads from their accounts'},
          {done:false, title:'Cross-sell scorecard — SurveySparrow → ThriveSparrow → SparrowDesk'},
        ]}/>
      </Card>
    </PageScaffold>
  );
};

const RoadmapList = ({items}) => (
  <div style={{display:'flex', flexDirection:'column'}}>
    {items.map((it,i)=>(
      <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 4px', borderTop: i?'1px solid var(--ss-neutral-100)':'none'}}>
        <div style={{width:20, height:20, borderRadius:99, background: it.done?'var(--ss-positive-500)':'var(--ss-neutral-100)',
          color: it.done?'#fff':'var(--ss-fg-muted)', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <i data-lucide={it.done?'check':'clock'} style={{width:11, height:11, strokeWidth:2.25}}/>
        </div>
        <span style={{fontSize:13, color:'var(--ss-fg)', textDecoration: it.done?'line-through':'none', opacity: it.done?0.7:1}}>{it.title}</span>
        {!it.done && <span style={{marginLeft:'auto', fontSize:10, color:'var(--ss-fg-muted)'}}>planned</span>}
      </div>
    ))}
  </div>
);

const Stat = ({label, value, accent}) => (
  <div style={{padding:'8px 10px', background:'var(--ss-neutral-50)', borderRadius:6}}>
    <div style={{fontSize:10, color:'var(--ss-fg-muted)', textTransform:'uppercase', letterSpacing:'0.04em', fontWeight:600}}>{label}</div>
    <div className="tabular" style={{fontSize:14, fontWeight:700, color: accent || 'var(--ss-fg)', marginTop:2}}>{value}</div>
  </div>
);

Object.assign(window, { AIvsHumanPage, CoachingPage, UpsellPage });
