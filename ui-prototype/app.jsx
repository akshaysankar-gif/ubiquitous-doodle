// Main app — routes between dashboard / metric pages / comparison / explorer / AI modules.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfy",
  "accent": "#00828D",
  "heatmapMode": "count",
  "bubbleEncoding": "volume-frustration",
  "aiSummary": true,
  "showFuture": true,
  "sidebarCollapsed": false
}/*EDITMODE-END*/;

const App = () => {
  const D = window.SUPPORT_DATA;
  const months = D.MONTHS.map(m=>m.key);
  const defaultMonth = months[months.length-2]; // Mar 2026
  const prevMonth    = months[months.length-3];

  const [nav, setNav]     = React.useState('dashboard');
  const [month, setMonth] = React.useState(defaultMonth);
  const [compareMode, setCompareMode] = React.useState(false);
  const [compareWith, setCompareWith] = React.useState(prevMonth);
  const [productFilter, setProductFilter] = React.useState('all');
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);
  const setTweak = (k,v) => {
    const next = typeof k === 'object' ? {...tweaks, ...k} : {...tweaks, [k]:v};
    setTweaks(next);
  };

  // Drawer
  const [drawer, setDrawer] = React.useState({open:false, payload:null});
  const openTicket = (payload) => setDrawer({open:true, payload});
  const closeDrawer = () => setDrawer({open:false, payload:null});

  // Lucide re-init on view change
  React.useEffect(()=>{ if (window.lucide) window.lucide.createIcons(); });
  React.useEffect(()=>{ if (window.lucide) setTimeout(()=>window.lucide.createIcons(), 60); }, [nav, month, compareMode, drawer.open, tweaks]);

  const titleMap = {
    dashboard:  ['Month dashboard', 'Essence of the month'],
    compare:    ['Compare months', 'Side-by-side with delta badges'],
    bubbles:    ['Bubble explorer', 'Contact codes plotted across encodings'],
    blockers:   ['Customer blockers', 'Where customers are getting stuck'],
    intent:     ['Intent / Sub-intent', 'What jobs people are trying to do'],
    product:    ['Product hotspots', 'Where the product creates support load'],
    codes:      ['Contact codes', 'Trending up / trending down'],
    root:       ['Root cause', 'Why these tickets exist'],
    frustration:['Frustration', 'Where customers wrote in hot'],
    automation: ['Automation potential', 'What Zoona AI could handle'],
    effort:     ['Support effort', 'Time spent + multi-team work'],
    signals:    ['Systemic signals', 'The story buried in the data'],
    aivshuman:  ['AI vs Human', 'Zoona AI performance vs human agents'],
    coaching:   ['Coaching', 'Per-agent insights for 1:1s'],
    upsell:     ['Upsell signals', 'Cross-sell + expansion leads'],
    data:       ['Data & schema', 'How the sheet is mapped'],
    settings:   ['Settings', 'Workspace preferences'],
  };

  // Effective compare key — when compare mode is off, use previous month for inline delta info
  const effectiveCmp = compareMode ? compareWith : monthBefore(month);

  // Effective month index helper
  function monthBefore(k){
    const i = months.indexOf(k);
    return i>0 ? months[i-1] : null;
  }

  // Body
  let body;
  const args = { monthKey:month, prevMonthKey:monthBefore(month), compareMode, compareKey:compareWith,
                 cmpKey: effectiveCmp, productFilter, onOpenTicket:openTicket, onChangeMode:setNav };
  if (nav==='dashboard') body = <MonthDashboard {...args}/>;
  else if (nav==='compare') body = <ComparisonPage monthA={effectiveCmp} monthB={month} onOpenTicket={openTicket}/>;
  else if (nav==='bubbles') body = <BubbleExplorer monthKey={month} onOpenTicket={openTicket}/>;
  else if (nav==='blockers') body = <BlockersPage {...args}/>;
  else if (nav==='intent')   body = <IntentPage   {...args}/>;
  else if (nav==='product')  body = <ProductPage  {...args}/>;
  else if (nav==='codes')    body = <ContactCodesPage {...args}/>;
  else if (nav==='root')     body = <RootCausePage {...args}/>;
  else if (nav==='frustration') body = <FrustrationPage {...args}/>;
  else if (nav==='automation')  body = <AutomationPage {...args}/>;
  else if (nav==='effort')      body = <EffortPage {...args}/>;
  else if (nav==='signals')     body = <SignalsPage {...args}/>;
  else if (nav==='aivshuman')   body = <AIvsHumanPage {...args}/>;
  else if (nav==='coaching')    body = <CoachingPage/>;
  else if (nav==='upsell')      body = <UpsellPage/>;
  else if (nav==='data')        body = <DataAdmin/>;
  else if (nav==='settings')    body = <SettingsPage/>;

  const [title, subtitle] = titleMap[nav] || ['', ''];

  // Accent override
  React.useEffect(()=>{
    document.documentElement.style.setProperty('--ss-primary-500', tweaks.accent);
  }, [tweaks.accent]);

  return (
    <>
      <AppSidebar active={nav} onNav={setNav} collapsed={tweaks.sidebarCollapsed}/>
      <div style={{flex:1, display:'flex', flexDirection:'column', minWidth:0}}>
        <AppTopbar
          title={title}
          subtitle={subtitle + ' · ' + (D.MONTHS.find(m=>m.key===month)||{}).label}
          month={month} onMonth={setMonth}
          compareMode={compareMode} onToggleCompare={setCompareMode}
          compareWith={compareWith} onCompareWith={setCompareWith}
          productFilter={productFilter} onProductFilter={setProductFilter}
          onToggleSidebar={()=>setTweak('sidebarCollapsed', !tweaks.sidebarCollapsed)}
          actions={
            nav==='dashboard' ? <Button size="sm" variant="outline" color="secondary" leftIcon="download">Export brief</Button> : null
          }/>
        {body}
      </div>
      <TicketDrawer open={drawer.open} payload={drawer.payload} monthKey={month} onClose={closeDrawer}/>
      <AppTweaks tweaks={tweaks} setTweak={setTweak}/>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
