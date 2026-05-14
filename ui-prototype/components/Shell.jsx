// Side-nav + top bar tailored to the Support Ticket Explorer.
// Built on Twigs atoms (Icon, Pill, Avatar, IconButton, Tooltip).

const NAV_SECTIONS = [
  {
    label: 'Analyse',
    items: [
      { id: 'dashboard',  icon: 'layout-dashboard', label: 'Month dashboard' },
      { id: 'compare',    icon: 'git-compare',       label: 'Compare months' },
      { id: 'bubbles',    icon: 'circle-dot',        label: 'Bubble explorer' },
    ],
  },
  {
    label: 'Metric pages',
    items: [
      { id: 'blockers',   icon: 'octagon-alert',     label: 'Customer blockers' },
      { id: 'intent',     icon: 'tag',               label: 'Intent / Sub-intent' },
      { id: 'product',    icon: 'package',           label: 'Product hotspots' },
      { id: 'codes',      icon: 'list-tree',         label: 'Contact codes' },
      { id: 'root',       icon: 'sprout',            label: 'Root cause' },
      { id: 'frustration',icon: 'flame',             label: 'Frustration' },
      { id: 'automation', icon: 'bot',               label: 'Automation potential' },
      { id: 'effort',     icon: 'gauge',             label: 'Support effort' },
      { id: 'signals',    icon: 'radio',             label: 'Systemic signals' },
    ],
  },
  {
    label: 'Future modules',
    items: [
      { id: 'aivshuman', icon: 'split',             label: 'AI vs Human', pill:{color:'purple', text:'Preview'} },
      { id: 'coaching',  icon: 'graduation-cap',    label: 'Coaching',    pill:{color:'purple', text:'Preview'} },
      { id: 'upsell',    icon: 'sparkles',          label: 'Upsell signals', pill:{color:'purple', text:'Preview'} },
    ],
  },
  {
    label: 'Admin',
    items: [
      { id: 'data',     icon: 'database',          label: 'Data & schema' },
      { id: 'settings', icon: 'settings',          label: 'Settings' },
    ],
  },
];

const AppSidebar = ({active, onNav, collapsed}) => {
  const Item = ({it}) => {
    const on = it.id === active;
    const [h,setH] = React.useState(false);
    return (
      <button onClick={()=>onNav&&onNav(it.id)}
        title={collapsed ? it.label : undefined}
        onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{
          display:'flex',alignItems:'center', gap:10, width:'100%',
          padding: collapsed ? '8px 0' : '7px 10px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          border:0,borderRadius:8,cursor:'pointer',
          background: on ? 'var(--ss-primary-50)' : (h?'rgba(0,0,0,.03)':'transparent'),
          color: on ? 'var(--ss-primary-700)' : 'var(--ss-secondary-700)',
          fontSize:12.5, fontWeight: on ? 600 : 500, fontFamily:'inherit',
          textAlign:'left', transition:'all .15s',
        }}>
        <Icon name={it.icon} size={16}/>
        {!collapsed && <span style={{flex:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{it.label}</span>}
        {!collapsed && it.pill && <Pill size="sm" color={it.pill.color} leading={false}>{it.pill.text}</Pill>}
      </button>
    );
  };

  return (
    <aside style={{
      width: collapsed ? 56 : 232, flexShrink:0, height:'100%',
      background:'#fff', borderRight:'1px solid var(--ss-border)',
      display:'flex', flexDirection:'column', padding: collapsed ? '14px 6px' : '14px 12px',
      transition:'width .2s',
    }}>
      <div style={{display:'flex',alignItems:'center',gap:8,padding: collapsed ? '4px 0 12px':'4px 6px 14px', justifyContent: collapsed?'center':'flex-start'}}>
        <img src="assets/surveysparrow-mark.svg" width={26} height={26} alt="SurveySparrow"/>
        {!collapsed && (
          <div style={{lineHeight:1.1}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--ss-fg)',letterSpacing:'-0.01em'}}>Ticket Explorer</div>
            <div style={{fontSize:10,color:'var(--ss-fg-muted)'}}>Support · Post-mortem</div>
          </div>
        )}
      </div>

      <div className="scroll-area" style={{flex:1, display:'flex', flexDirection:'column', gap: 14, paddingRight:2}}>
        {NAV_SECTIONS.map(sec => (
          <div key={sec.label}>
            {!collapsed && (
              <div style={{fontSize:9, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
                color:'var(--ss-fg-muted)', padding:'4px 10px 6px'}}>{sec.label}</div>
            )}
            {collapsed && <div style={{height:1,background:'var(--ss-border)',margin:'8px 6px'}}/>}
            <nav style={{display:'flex',flexDirection:'column',gap:2}}>
              {sec.items.map(it=><Item key={it.id} it={it}/>)}
            </nav>
          </div>
        ))}
      </div>

      <div style={{borderTop:'1px solid var(--ss-border)', marginTop:8, paddingTop:10}}>
        <div style={{display:'flex',alignItems:'center',gap:8,padding: collapsed?'0':'4px 6px'}}>
          <Avatar size="sm" mode="initials" initials="JS"/>
          {!collapsed && (
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:'var(--ss-fg)'}}>Justin S.</div>
              <div style={{fontSize:10,color:'var(--ss-fg-muted)'}}>Support analyst</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

// ── Top bar with the global month picker + compare toggle ────────
const MONTH_PICKER_OPTIONS = (window.SUPPORT_DATA?.MONTHS||[]).map(m=>({value:m.key, label:m.label}));

const AppTopbar = ({
  title, subtitle,
  month, onMonth,
  compareMode, onToggleCompare, compareWith, onCompareWith,
  productFilter, onProductFilter,
  actions,
  onToggleSidebar,
}) => {
  return (
    <header style={{
      height:60, borderBottom:'1px solid var(--ss-border)', background:'#fff',
      display:'flex',alignItems:'center',padding:'0 22px',gap:12,flexShrink:0
    }}>
      <IconButton icon="panel-left" variant="ghost" color="default" size="sm" ariaLabel="Toggle sidebar" onClick={onToggleSidebar}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:15.5,fontWeight:700,color:'var(--ss-fg)',letterSpacing:'-0.01em'}}>{title}</div>
        {subtitle && <div style={{fontSize:11.5,color:'var(--ss-fg-muted)',marginTop:1}}>{subtitle}</div>}
      </div>

      {/* Product filter */}
      <Select size="sm" style={{width:160}} value={productFilter} onChange={onProductFilter}
        options={[{value:'all',label:'All products'},
          {value:'SurveySparrow',label:'SurveySparrow'},
          {value:'ThriveSparrow',label:'ThriveSparrow'},
          {value:'SparrowDesk',label:'SparrowDesk'}]} />

      {/* Month picker */}
      <div style={{display:'flex',alignItems:'center',gap:6, padding:'4px 6px', borderRadius:8,
        border:'1px solid var(--ss-border)', background:'#fff'}}>
        <Icon name="calendar" size={14} color="var(--ss-fg-muted)"/>
        <select value={month} onChange={(e)=>onMonth(e.target.value)}
          style={{border:0, background:'transparent', fontFamily:'inherit', fontSize:13, fontWeight:600, color:'var(--ss-fg)', outline:'none', cursor:'pointer'}}>
          {MONTH_PICKER_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Compare toggle */}
      <div style={{display:'flex',alignItems:'center',gap:8, padding:'4px 10px 4px 8px',
        borderRadius:8, border:'1px solid var(--ss-border)', background: compareMode?'var(--ss-primary-50)':'#fff'}}>
        <Switch size="sm" checked={compareMode} onChange={onToggleCompare}/>
        <span style={{fontSize:12,fontWeight:600, color: compareMode?'var(--ss-primary-700)':'var(--ss-fg)'}}>Compare to</span>
        <select disabled={!compareMode} value={compareWith||''} onChange={(e)=>onCompareWith(e.target.value)}
          style={{border:0, background:'transparent', fontFamily:'inherit', fontSize:12, fontWeight:600, color:'var(--ss-fg)', outline:'none', cursor: compareMode?'pointer':'not-allowed', opacity: compareMode?1:.5}}>
          {MONTH_PICKER_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {actions && <div style={{display:'flex',gap:8,marginLeft:4}}>{actions}</div>}
    </header>
  );
};

Object.assign(window, { AppSidebar, AppTopbar });
