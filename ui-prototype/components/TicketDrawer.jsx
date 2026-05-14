// Ticket Drawer — right-side panel that surfaces the underlying tickets
// for whatever cell / bubble / code the user clicked.

const TicketDrawer = ({open, payload, monthKey, onClose}) => {
  const D = window.SUPPORT_DATA;
  if (!open || !payload) return null;

  // Resolve the filter
  let tickets = D.tickets.filter(t => t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');
  let title = 'Tickets', subtitle = '';

  if (payload.type==='cell') {
    tickets = tickets.filter(t => t.module===payload.module && t.intent===payload.intent);
    title = `${payload.module} · ${payload.intentLabel}`;
    subtitle = `${tickets.length} tickets · avg frustration ${(tickets.reduce((a,t)=>a+t.frustration,0)/(tickets.length||1)).toFixed(1)}/10`;
  } else if (payload.type==='code' || payload.type==='bubble' || payload.type==='area') {
    const code = payload.code || (payload.module+' · '+payload.area);
    tickets = tickets.filter(t => (t.module+' · '+t.area)===code);
    title = code;
    subtitle = `${tickets.length} tickets`;
  } else if (payload.type==='ticket') {
    tickets = [payload.ticket];
    title = payload.ticket.subject;
    subtitle = `${payload.ticket.id} · ${payload.ticket.module} · ${payload.ticket.area}`;
  }

  const top = tickets.slice(0, 30);

  // Theme summary
  const subareas = {};
  const intents = {};
  const sent = {calm:0,annoyed:0,frustrated:0,furious:0};
  let aiN = 0;
  tickets.forEach(t=>{
    subareas[t.subarea]=(subareas[t.subarea]||0)+1;
    intents[t.intentLabel]=(intents[t.intentLabel]||0)+1;
    sent[t.sentiment]++;
    if (t.isAI) aiN++;
  });

  return (
    <>
      <div onClick={onClose} style={{position:'fixed', inset:0, background:'rgba(17,17,17,0.32)', zIndex:50}}/>
      <aside style={{
        position:'fixed', right:0, top:0, bottom:0, width: 560, maxWidth:'100vw',
        background:'#fff', zIndex:51, display:'flex', flexDirection:'column',
        boxShadow:'-12px 0 28px rgba(0,0,0,0.06)',
        borderLeft:'1px solid var(--ss-border)',
      }}>
        <div style={{padding:'18px 22px', borderBottom:'1px solid var(--ss-border)', display:'flex', alignItems:'flex-start', gap:12}}>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:10.5, fontWeight:700, color:'var(--ss-primary-700)', textTransform:'uppercase', letterSpacing:'0.08em'}}>Tickets · drill-in</div>
            <div style={{fontSize:16, fontWeight:700, color:'var(--ss-fg)', marginTop:2, letterSpacing:'-0.005em'}}>{title}</div>
            <div style={{fontSize:11.5, color:'var(--ss-fg-muted)', marginTop:2}}>{subtitle}</div>
          </div>
          <IconButton icon="x" variant="ghost" color="default" size="sm" ariaLabel="Close" onClick={onClose}/>
        </div>

        <div className="scroll-area" style={{flex:1, overflow:'auto'}}>
          {/* AI summary */}
          <div style={{padding:'14px 22px', background:'var(--ss-primary-50)', borderBottom:'1px solid var(--ss-neutral-100)'}}>
            <div style={{display:'flex',alignItems:'center', gap:8, marginBottom:6}}>
              <Icon name="sparkles" size={14} color="var(--ss-primary-600)"/>
              <span style={{fontSize:11.5, fontWeight:700, color:'var(--ss-primary-700)', textTransform:'uppercase', letterSpacing:'0.06em'}}>AI summary</span>
            </div>
            <div style={{fontSize:12.5, color:'var(--ss-fg)', lineHeight:1.55}}>
              {summarize(tickets, intents, subareas)}
            </div>
            <div style={{marginTop:10}}>
              <SentimentBar distribution={sent} height={8}/>
              <div style={{marginTop:6, display:'flex', gap:10, flexWrap:'wrap'}}>
                {D.SENTIMENT_BANDS.map(b=>(
                  <span key={b.key} style={{fontSize:10.5, color:'var(--ss-fg-muted)'}}>
                    <span style={{display:'inline-block',width:7,height:7,borderRadius:99,background:b.swatch, marginRight:4}}/>{b.label}: <strong style={{color:'var(--ss-fg)'}}>{sent[b.key]}</strong>
                  </span>
                ))}
                <span style={{fontSize:10.5, color:'var(--ss-fg-muted)'}}>· <Icon name="bot" size={10}/> Zoona AI handled <strong style={{color:'var(--ss-fg)'}}>{Math.round(aiN/(tickets.length||1)*100)}%</strong></span>
              </div>
            </div>
          </div>

          {/* Themes */}
          <div style={{padding:'14px 22px', borderBottom:'1px solid var(--ss-neutral-100)'}}>
            <div style={{fontSize:11, fontWeight:700, color:'var(--ss-fg-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8}}>Themes</div>
            <div style={{display:'flex', flexDirection:'column', gap:6}}>
              {Object.entries(subareas).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([s,n])=>(
                <div key={s} style={{display:'grid', gridTemplateColumns:'1fr 40px', gap:8, alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:12, fontWeight:500}}>{s}</div>
                    <Bullet value={n/Math.max(...Object.values(subareas))} color="var(--ss-primary-500)" height={4}/>
                  </div>
                  <span className="tabular" style={{fontSize:12, fontWeight:600, textAlign:'right'}}>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket list */}
          <div style={{padding:'14px 22px'}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
              <div style={{fontSize:11, fontWeight:700, color:'var(--ss-fg-muted)', textTransform:'uppercase', letterSpacing:'0.06em'}}>Conversations ({tickets.length})</div>
              <Button size="sm" variant="ghost" color="secondary" rightIcon="external-link">Open in Zendesk</Button>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              {top.map(t=>(
                <div key={t.id} style={{border:'1px solid var(--ss-neutral-100)', borderRadius:8, padding:'10px 12px'}}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:4}}>
                    <Tag color={t.isAI?'purple':'mint'}>{t.id}</Tag>
                    <div style={{display:'flex',gap:6, alignItems:'center'}}>
                      <SentimentChip band={t.sentiment} size="sm"/>
                      <Tag color="neutral">{t.assignee}</Tag>
                    </div>
                  </div>
                  <div style={{fontSize:12.5, fontWeight:600, color:'var(--ss-fg)', lineHeight:1.4}}>{t.subject}</div>
                  <div style={{display:'flex', gap:8, alignItems:'center', marginTop:6, fontSize:11, color:'var(--ss-fg-muted)'}}>
                    <span>{t.channel}</span>·
                    <span>{t.intentLabel}</span>·
                    <span>{t.rootCauseLabel}</span>·
                    <span className="tabular">{t.effortHrs}h</span>·
                    <span className="tabular">automation {Math.round(t.automation*100)}%</span>
                  </div>
                </div>
              ))}
              {tickets.length>top.length && (
                <div style={{textAlign:'center', padding:'10px 0', fontSize:11.5, color:'var(--ss-fg-muted)'}}>
                  Showing {top.length} of {tickets.length} — scroll source list for the rest.
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

function summarize(tickets, intents, subareas){
  const n = tickets.length;
  if (!n) return 'No tickets matched this slice.';
  const top = Object.entries(intents).sort((a,b)=>b[1]-a[1])[0];
  const sub = Object.entries(subareas).sort((a,b)=>b[1]-a[1])[0];
  const furious = tickets.filter(t=>t.sentiment==='furious').length;
  return `${n} ticket${n>1?'s':''} in this slice. The dominant intent is "${top[0]}" (${top[1]}); the most common subarea is "${sub[0]}" (${sub[1]}). ${furious>0 ? `${furious} conversation${furious>1?'s':''} ran hot (furious sentiment).` : 'Sentiment skews calm — mostly how-to and follow-up.'} Effort averages ${(tickets.reduce((a,t)=>a+t.effortHrs,0)/n).toFixed(1)}h per ticket.`;
}

Object.assign(window, { TicketDrawer });
