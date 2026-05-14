// Sidebar + Topbar — SurveySparrow web app chrome.
// Uses the latest atoms: Avatar (with shape + initials), IconButton, Pill, Input,
// Tooltip. Anything that used to be hand-rolled (workspace switcher avatar,
// notification bell, search field) now goes through the kit.

const Sidebar = ({active='surveys', onNav}) => {
  const sections = [
    {id:'home',         icon:'layout-dashboard', label:'Home'},
    {id:'surveys',      icon:'clipboard-list',   label:'Surveys',      pill:{color:'mint', text:'6'}},
    {id:'audience',     icon:'users',            label:'Audience'},
    {id:'reports',      icon:'bar-chart-3',      label:'Reports'},
    {id:'integrations', icon:'puzzle',           label:'Integrations', pill:{color:'purple', text:'New'}},
  ];
  const utilities = [
    {id:'settings', icon:'settings',  label:'Settings'},
    {id:'help',     icon:'life-buoy', label:'Help & docs'},
  ];

  const Item = ({it}) => {
    const on = it.id === active;
    const [h,setH] = React.useState(false);
    return (
      <button onClick={()=>onNav&&onNav(it.id)}
        onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
        style={{
          display:'flex',alignItems:'center',gap:10,width:'100%',
          padding:'8px 12px',border:0,borderRadius:8,cursor:'pointer',
          background: on ? 'var(--ss-primary-50)' : (h?'rgba(0,0,0,.03)':'transparent'),
          color: on ? 'var(--ss-primary-700)' : 'var(--ss-secondary-700)',
          fontSize:13, fontWeight: on ? 600 : 500, fontFamily:'inherit',
          textAlign:'left', transition:'all .15s',
        }}>
        <Icon name={it.icon} size={16} />
        <span style={{flex:1}}>{it.label}</span>
        {it.pill && <Pill size="sm" color={it.pill.color} leading={false}>{it.pill.text}</Pill>}
      </button>
    );
  };

  return (
    <aside style={{
      width:240, flexShrink:0, height:'100%',
      background:'#fff', borderRight:'1px solid var(--ss-border)',
      display:'flex', flexDirection:'column', padding:'16px 12px',
    }}>
      {/* Brand */}
      <div style={{display:'flex',alignItems:'center',gap:8,padding:'4px 8px 16px'}}>
        <img src="../../assets/surveysparrow-mark.svg" width={28} height={28} alt="SurveySparrow"/>
        <div style={{fontSize:15,fontWeight:700,color:'var(--ss-fg)',letterSpacing:'-0.01em'}}>SurveySparrow</div>
      </div>

      {/* Workspace switcher */}
      <button style={{
        display:'flex',alignItems:'center',gap:10,padding:'8px 10px',marginBottom:12,
        border:'1px solid var(--ss-border)',borderRadius:8,background:'#fff',cursor:'pointer',
        fontFamily:'inherit',fontSize:13,color:'var(--ss-fg)',
      }}>
        <Avatar size="xs" shape="squircle" mode="initials" initials="AC"/>
        <div style={{flex:1,textAlign:'left',minWidth:0}}>
          <div style={{fontWeight:600,fontSize:12,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Acme Co.</div>
          <div style={{fontSize:10,color:'var(--ss-fg-muted)'}}>Growth plan</div>
        </div>
        <Icon name="chevrons-up-down" size={14} color="var(--ss-fg-muted)"/>
      </button>

      <nav style={{display:'flex',flexDirection:'column',gap:2}}>
        {sections.map(it=><Item key={it.id} it={it}/>)}
      </nav>

      <div style={{marginTop:'auto',borderTop:'1px solid var(--ss-border)',paddingTop:12,display:'flex',flexDirection:'column',gap:2}}>
        {utilities.map(it=><Item key={it.id} it={it}/>)}
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 8px',marginTop:4}}>
          <Avatar size="sm" mode="initials" initials="JS"/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:'var(--ss-fg)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Justin S.</div>
            <div style={{fontSize:10,color:'var(--ss-fg-muted)'}}>Admin</div>
          </div>
          <IconButton icon="more-horizontal" variant="ghost" color="default" size="sm" ariaLabel="Account menu"/>
        </div>
      </div>
    </aside>
  );
};

const Topbar = ({title, subtitle, actions}) => (
  <header style={{
    height:56, borderBottom:'1px solid var(--ss-border)', background:'#fff',
    display:'flex',alignItems:'center',padding:'0 24px',gap:12,flexShrink:0
  }}>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:15,fontWeight:700,color:'var(--ss-fg)',letterSpacing:'-0.005em'}}>{title}</div>
      {subtitle && <div style={{fontSize:11,color:'var(--ss-fg-muted)',marginTop:1}}>{subtitle}</div>}
    </div>
    <Input placeholder="Search" leftIcon="search" size="md" style={{width:260}}/>
    <Tooltip content="What's new" placement="bottom">
      <IconButton icon="sparkles" variant="ghost" color="default" size="md" ariaLabel="What's new"/>
    </Tooltip>
    <Tooltip content="Notifications" placement="bottom">
      <span style={{position:'relative',display:'inline-flex'}}>
        <IconButton icon="bell" variant="ghost" color="default" size="md" ariaLabel="Notifications"/>
        <span style={{
          position:'absolute', top:6, right:6, width:8, height:8, borderRadius:'50%',
          background:'var(--ss-negative-500)', boxShadow:'0 0 0 2px #fff', pointerEvents:'none',
        }}/>
      </span>
    </Tooltip>
    {actions && <div style={{display:'flex',gap:8,marginLeft:4}}>{actions}</div>}
  </header>
);

Object.assign(window, { Sidebar, Topbar });
