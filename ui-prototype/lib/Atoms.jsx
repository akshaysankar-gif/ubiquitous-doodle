// Web-app UI kit — shared atoms
// Icons use Lucide (CDN) as a near-match substitute for Twigs icons. See README.

const Icon = ({name, size=18, color='currentColor', stroke=1.75}) => (
  <i data-lucide={name} style={{width:size, height:size, color, strokeWidth:stroke, display:'inline-flex'}} />
);

// ─── Button ─────────────────────────────────────────────────────────
// /Button/Button — full matrix: 3 variants × 6 colors × 7 sizes × 4 states.
// Spec from twigs-claude.fig (node 470:16213). Not every color × variant
// combo exists in the fig; invalid combos fall back to the primary solid.
//
// Variants: solid · ghost · outline
// Colors:   primary · secondary · default · error · bright · light
//   - bright = solid-only, used on white surfaces
//   - light  = for dark surfaces (white text)
// Sizes:    xxs · xs · sm · md · lg · xl · xxl
// States:   regular · hover · active · disabled (via the disabled prop)
const buttonSizes = {
  xxs:{h:16, r:4,  padX:2,  fs:10, lh:12, fw:700, gap:8, icon:14, ring:2, tracking:'0.02em'},
  xs: {h:20, r:4,  padX:4,  fs:12, lh:16, fw:500, gap:8, icon:14, ring:2},
  sm: {h:24, r:4,  padX:6,  fs:14, lh:20, fw:500, gap:8, icon:16, ring:2},
  md: {h:32, r:8,  padX:8,  fs:14, lh:20, fw:700, gap:8, icon:20, ring:2},
  lg: {h:40, r:8,  padX:12, fs:16, lh:24, fw:700, gap:8, icon:20, ring:2},
  xl: {h:48, r:12, padX:16, fs:19, lh:28, fw:700, gap:8, icon:24, ring:2},
  xxl:{h:64, r:16, padX:20, fs:19, lh:28, fw:700, gap:8, icon:24, ring:2},
};
// Per variant × color: {bg, fg, hover, active, border?}
// All values are exact rgb() strings from the fig.
const buttonTokens = {
  solid: {
    primary:   {bg:'rgb(0,130,141)',          fg:'rgb(255,255,255)', hover:'rgb(0,107,116)',     active:'rgb(0,85,92)'},
    secondary: {bg:'rgb(100,116,139)',        fg:'rgb(255,255,255)', hover:'rgb(78,89,108)',     active:'rgb(61,66,77)'},
    default:   {bg:'rgba(100,116,139,0.1)',   fg:'rgb(61,66,77)',    hover:'rgba(100,116,139,0.15)', active:'rgba(100,116,139,0.2)'},
    error:     {bg:'rgb(254,226,218)',        fg:'rgb(169,55,30)',   hover:'rgb(254,218,208)',   active:'rgb(255,218,208)'},
    bright:    {bg:'rgb(255,255,255)',        fg:'rgb(68,75,90)',    hover:'rgba(0,0,0,0.04)',   active:'rgba(0,0,0,0.08)'},
    light:     {bg:'rgba(255,255,255,0.1)',   fg:'rgb(255,255,255)', hover:'rgba(255,255,255,0.15)', active:'rgba(255,255,255,0.2)'},
  },
  ghost: {
    primary:   {bg:'transparent',             fg:'rgb(0,130,141)',   hover:'rgba(0,130,141,0.08)',  active:'rgba(0,130,141,0.15)', activeFg:'rgb(0,85,92)'},
    secondary: {bg:'transparent',             fg:'rgb(78,89,108)',   hover:'rgba(100,116,139,0.08)',active:'rgba(100,116,139,0.15)', activeFg:'rgb(61,66,77)'},
    default:   {bg:'transparent',             fg:'rgb(78,89,108)',   hover:'rgba(100,116,139,0.08)',active:'rgba(100,116,139,0.15)'},
    error:     {bg:'transparent',             fg:'rgb(169,55,30)',   hover:'rgba(254,226,218,0.5)', active:'rgb(254,226,218)'},
    light:     {bg:'transparent',             fg:'rgb(255,255,255)', hover:'rgba(255,255,255,0.08)',active:'rgba(255,255,255,0.15)'},
  },
  outline: {
    primary:   {bg:'rgb(255,255,255)',        fg:'rgb(0,130,141)',   hover:'rgb(255,255,255)', active:'rgb(255,255,255)',
                border:'1.5px solid rgba(0,130,141,0.4)', hoverBorder:'2px solid rgba(0,130,141,0.6)', activeBorder:'2px solid rgba(0,130,141,0.75)', activeFg:'rgb(0,85,92)'},
    secondary: {bg:'rgb(255,255,255)',        fg:'rgb(78,89,108)',   hover:'rgb(255,255,255)', active:'rgb(255,255,255)',
                border:'1.5px solid rgba(100,116,139,0.3)', hoverBorder:'2px solid rgba(100,116,139,0.5)', activeBorder:'2px solid rgba(100,116,139,0.75)'},
    error:     {bg:'rgb(255,255,255)',        fg:'rgb(169,55,30)',   hover:'rgb(255,255,255)', active:'rgb(255,255,255)',
                border:'1.5px solid rgba(169,55,30,0.4)', hoverBorder:'2px solid rgba(169,55,30,0.6)', activeBorder:'2px solid rgba(169,55,30,0.75)'},
    light:     {bg:'transparent',             fg:'rgb(255,255,255)', hover:'rgba(255,255,255,0.08)', active:'rgba(255,255,255,0.15)',
                border:'1.5px solid rgba(255,255,255,0.4)', hoverBorder:'2px solid rgba(255,255,255,0.6)', activeBorder:'2px solid rgba(255,255,255,0.75)'},
  },
};

const Button = ({
  children, variant='solid', color='primary', size='md',
  leftIcon, rightIcon, disabled=false, onClick, style={},
}) => {
  const s = buttonSizes[size] || buttonSizes.md;
  const tokens = (buttonTokens[variant] && buttonTokens[variant][color]) || buttonTokens.solid.primary;

  const [hover,   setHover]   = React.useState(false);
  const [active,  setActive]  = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  let bg = tokens.bg, fg = tokens.fg, border = tokens.border || 'none';
  if (!disabled) {
    if (active)      { bg = tokens.active; fg = tokens.activeFg || tokens.fg; border = tokens.activeBorder || border; }
    else if (hover)  { bg = tokens.hover;  border = tokens.hoverBorder  || border; }
  }
  // Focus ring — 2px primary-200 outline offset -2px per fig
  const focusShadow = (focused && !disabled)
    ? '0 0 0 2px rgb(138,204,210)'
    : 'none';

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>{setHover(false); setActive(false);}}
      onMouseDown={()=>setActive(true)}
      onMouseUp={()=>setActive(false)}
      onFocus={()=>setFocused(true)}
      onBlur={()=>setFocused(false)}
      style={{
        fontFamily:'var(--ss-font-body, "DM Sans", system-ui, sans-serif)',
        border, cursor: disabled ? 'not-allowed' : 'pointer',
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap:s.gap,
        fontWeight:s.fw, fontSize:s.fs, lineHeight:`${s.lh}px`, letterSpacing:s.tracking||'normal',
        height:s.h, padding:`0 ${s.padX + 4}px`, borderRadius:s.r,
        background:bg, color:fg,
        opacity: disabled ? 0.4 : 1,
        transition:'background-color 120ms ease, color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
        boxShadow: focusShadow,
        outline: 'none',
        whiteSpace:'nowrap', flexShrink:0,
        ...style,
      }}>
      {leftIcon && (typeof leftIcon === 'string'
        ? <i data-lucide={leftIcon} style={{width:s.icon, height:s.icon, strokeWidth:1.75, flexShrink:0}}/>
        : <span style={{display:'inline-flex', flexShrink:0}}>{leftIcon}</span>)}
      <span style={{padding:'0 4px'}}>{children}</span>
      {rightIcon && (typeof rightIcon === 'string'
        ? <i data-lucide={rightIcon} style={{width:s.icon, height:s.icon, strokeWidth:1.75, flexShrink:0}}/>
        : <span style={{display:'inline-flex', flexShrink:0}}>{rightIcon}</span>)}
    </button>
  );
};

// ─── IconButton ─────────────────────────────────────────────────────
// /IconButton/Icon-Button — square icon-only affordance.
// Spec from twigs-claude.fig (node 470:21794). Shares the Button color
// system (buttonTokens) but has its own size scale — the button is
// square, icon fills ~50% of the frame, radius grows with size.
//
// Variants: solid · ghost · outline
// Colors:   primary · secondary · default · error · bright · light
// Sizes:    xxs · xs · sm · md · lg · xl · xxl   (icon sizes from fig: 14/16/20/24/24/32/32)
// Shape:    squircle (size-based radius) · round (9999px)
// States:   regular · hover · active · disabled
const iconButtonSizes = {
  xxs:{box:16, r:4,  icon:14, pad:1,  stroke:1.75},
  xs: {box:20, r:4,  icon:16, pad:2,  stroke:1.75},
  sm: {box:24, r:4,  icon:20, pad:2,  stroke:1.75},
  md: {box:32, r:8,  icon:24, pad:4,  stroke:1.75},
  lg: {box:40, r:8,  icon:24, pad:8,  stroke:1.75},
  xl: {box:48, r:12, icon:32, pad:8,  stroke:1.5},
  xxl:{box:64, r:16, icon:32, pad:16, stroke:1.5},
};

const IconButton = ({
  icon='plus', variant='solid', color='default', size='md',
  shape='squircle', disabled=false, onClick, ariaLabel, style={},
  children, // optional custom icon node (overrides `icon` name)
}) => {
  const s = iconButtonSizes[size] || iconButtonSizes.md;
  const tokens = (buttonTokens[variant] && buttonTokens[variant][color]) || buttonTokens.solid.default;

  const [hover,   setHover]   = React.useState(false);
  const [active,  setActive]  = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  let bg = tokens.bg, fg = tokens.fg, border = tokens.border || 'none';
  if (!disabled) {
    if (active)      { bg = tokens.active; fg = tokens.activeFg || tokens.fg; border = tokens.activeBorder || border; }
    else if (hover)  { bg = tokens.hover;  border = tokens.hoverBorder  || border; }
  }
  const focusShadow = (focused && !disabled) ? '0 0 0 2px rgb(138,204,210)' : 'none';
  const radius = shape === 'round' ? 9999 : s.r;

  return (
    <button
      type="button"
      aria-label={ariaLabel || (typeof icon === 'string' ? icon : 'icon button')}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>{setHover(false); setActive(false);}}
      onMouseDown={()=>setActive(true)}
      onMouseUp={()=>setActive(false)}
      onFocus={()=>setFocused(true)}
      onBlur={()=>setFocused(false)}
      style={{
        fontFamily:'inherit',
        border, cursor: disabled ? 'not-allowed' : 'pointer',
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        width:s.box, height:s.box, padding:0, borderRadius:radius,
        background:bg, color:fg,
        opacity: disabled ? 0.4 : 1,
        transition:'background-color 120ms ease, color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
        boxShadow: focusShadow,
        outline: 'none',
        flexShrink:0,
        ...style,
      }}>
      {children
        ? <span style={{display:'inline-flex',width:s.icon,height:s.icon,alignItems:'center',justifyContent:'center'}}>{children}</span>
        : <IconButtonGlyph name={icon} size={s.icon} stroke={s.stroke}/>}
    </button>
  );
};

// Renders a Lucide icon and re-processes on every size/name change so the SVG
// actually resizes. Using a ref + key forces React to replace the <i> node,
// which makes lucide.createIcons() rebuild the <svg> at the new dimensions.
const IconButtonGlyph = ({name, size, stroke}) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      // Clear any previously-swapped <svg> so createIcons regenerates at the new size
      ref.current.innerHTML = '';
      const i = document.createElement('i');
      i.setAttribute('data-lucide', name);
      i.style.width  = size + 'px';
      i.style.height = size + 'px';
      i.style.strokeWidth = stroke;
      i.style.flexShrink = '0';
      ref.current.appendChild(i);
      window.lucide.createIcons({nameAttr:'data-lucide', attrs:{width:size, height:size, 'stroke-width':stroke}});
    }
  }, [name, size, stroke]);
  return <span ref={ref} style={{display:'inline-flex',width:size,height:size,alignItems:'center',justifyContent:'center',flexShrink:0}}/>;
};

// Input — matches twigs-claude.fig /Input spec
// sizes sm/md/lg/xl · variants outline/filled · label, helper, error, required, left/right icon, counter
const Input = ({
  placeholder, value, onChange,
  leftIcon, rightIcon, rightSlot,
  size='md', variant='outline',
  label, helper, error, required,
  maxLength, showCount,
  disabled, style={},
}) => {
  const sizeMap = {
    sm: {h:24, fs:12, lh:16, pad:'0 8px',   r:4,  iconGap:4,  iconSize:14, labelFs:12, labelLh:16, helperFs:12},
    md: {h:32, fs:14, lh:20, pad:'0 8px',   r:8,  iconGap:4,  iconSize:16, labelFs:12, labelLh:16, helperFs:12},
    lg: {h:40, fs:14, lh:20, pad:'0 12px',  r:8,  iconGap:4,  iconSize:18, labelFs:14, labelLh:20, helperFs:12},
    xl: {h:48, fs:16, lh:24, pad:'0 12px',  r:12, iconGap:4,  iconSize:20, labelFs:14, labelLh:20, helperFs:12},
  };
  const s = sizeMap[size] || sizeMap.md;
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const len = (value||'').length;

  const bg = variant==='filled' ? 'rgba(100,116,139,0.06)' : '#fff';
  let borderCol = 'rgba(0,0,0,0.15)';
  if (hover && !disabled && !error) borderCol = 'var(--ss-border-hover)';
  if (error) borderCol = 'var(--ss-border-error)';
  if (disabled) borderCol = 'var(--ss-border)';

  const fieldStyle = {
    position:'relative', height:s.h, borderRadius:s.r, background: disabled?'rgba(100,116,139,0.06)':bg,
    border: variant==='outline' ? `1px solid ${borderCol}` : 'none',
    display:'flex', alignItems:'center', gap:s.iconGap,
    padding: s.pad, fontSize:s.fs, color:'var(--ss-fg)',
    transition:'border-color .15s, box-shadow .15s',
    opacity: disabled ? 0.6 : 1,
    boxShadow: focus && !disabled && !error
      ? `0 0 0 2px var(--ss-bg), 0 0 0 3.5px var(--ss-border-focus)`
      : 'none',
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:4, fontFamily:'inherit', ...style}}>
      {(label || showCount) && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,
          fontSize:s.labelFs,lineHeight:`${s.labelLh}px`}}>
          {label && (
            <span style={{color:'var(--ss-neutral-800)',fontWeight:500}}>
              {label}{required && <span style={{color:'var(--ss-negative-600)',marginLeft:2}}>*</span>}
            </span>
          )}
          {showCount && (
            <span style={{color:'var(--ss-neutral-700)',fontWeight:400}}>
              {len}{maxLength?`/${maxLength}`:''}
            </span>
          )}
        </div>
      )}
      <div style={fieldStyle}
        onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
        {leftIcon && <span style={{display:'inline-flex',color:'var(--ss-neutral-800)',flexShrink:0}}>
          <Icon name={leftIcon} size={s.iconSize}/></span>}
        <input
          value={value||''} onChange={onChange} placeholder={placeholder}
          disabled={disabled} maxLength={maxLength}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          style={{
            flex:1, minWidth:0, border:'none', outline:'none', background:'transparent',
            fontFamily:'inherit', fontSize:s.fs, lineHeight:`${s.lh}px`,
            color:'var(--ss-fg)', padding:0,
          }}/>
        {rightSlot}
        {rightIcon && <span style={{display:'inline-flex',color:'var(--ss-neutral-800)',flexShrink:0}}>
          <Icon name={rightIcon} size={s.iconSize}/></span>}
      </div>
      {(helper || error) && (
        <span style={{
          fontSize:s.helperFs, lineHeight:'16px',
          color: error ? 'var(--ss-negative-500)' : 'var(--ss-neutral-700)',
        }}>{error || helper}</span>
      )}
    </div>
  );
};

// Checkbox — /Checkbox spec · on-state uses secondary-500 (Twigs intentional)
// MD: 20·r4 · icon 16  ·  SM: 16·r4 · icon 12  ·  border #9E9E9E (regular) / #757575 (hover) / secondary-500 (on)
const Checkbox = ({checked=false, indeterminate=false, disabled=false, size='md', onChange, label, style={}}) => {
  const sizeMap = {sm:{box:16,icon:12}, md:{box:20,icon:16}};
  const s = sizeMap[size] || sizeMap.md;
  const [hover, setHover] = React.useState(false);
  const on = checked || indeterminate;

  const box = {
    width:s.box, height:s.box, borderRadius:4, flexShrink:0,
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background: on ? 'var(--ss-secondary-500)' : '#fff',
    border: on ? '1px solid var(--ss-secondary-500)'
              : `1px solid ${hover && !disabled ? 'rgb(117,117,117)' : 'rgb(158,158,158)'}`,
    opacity: disabled ? 0.4 : 1,
    transition:'background .15s, border-color .15s',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const inner = !on ? null : indeterminate
    ? <svg width={s.icon} height={s.icon} viewBox="0 0 16 16" fill="none"><path d="M3.5 8h9" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    : <svg width={s.icon} height={s.icon} viewBox="0 0 16 16" fill="none"><path d="M3 8.4 L6.5 12 L13 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

  const el = (
    <span role="checkbox" aria-checked={indeterminate?'mixed':checked}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      onClick={()=>!disabled && onChange && onChange(!checked)}
      style={box}>{inner}</span>
  );

  if (!label) return <span style={style}>{el}</span>;
  return (
    <label style={{display:'inline-flex',alignItems:'center',gap:8,cursor:disabled?'not-allowed':'pointer',
      fontSize:size==='sm'?12:14,color:'var(--ss-fg)',...style}}>
      {el}<span>{label}</span>
    </label>
  );
};

// Radio — /Radio spec · on-state uses secondary-500 (Twigs intentional)
const Radio = ({checked=false, disabled=false, size='md', onChange, label, name, style={}}) => {
  const sizeMap = {sm:{box:16,dot:8}, md:{box:20,dot:12}};
  const s = sizeMap[size] || sizeMap.md;
  const [hover, setHover] = React.useState(false);

  const box = {
    width:s.box, height:s.box, borderRadius:'50%', flexShrink:0,
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background:'#fff',
    border: checked ? '1px solid var(--ss-secondary-500)'
                    : `1px solid ${hover && !disabled ? 'var(--ss-border-hover)' : 'var(--ss-neutral-400)'}`,
    opacity: disabled ? 'var(--ss-disabled-opacity)' : 1,
    transition:'border-color .15s',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const el = (
    <span role="radio" aria-checked={checked}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      onClick={()=>!disabled && onChange && onChange(true)}
      style={box}>
      {checked && <span style={{width:s.dot,height:s.dot,borderRadius:'50%',background:'var(--ss-secondary-500)'}}/>}
    </span>
  );
  if (!label) return <span style={style}>{el}</span>;
  return (
    <label style={{display:'inline-flex',alignItems:'center',gap:8,cursor:disabled?'not-allowed':'pointer',
      fontSize:size==='sm'?12:14,color:'var(--ss-fg)',...style}}>
      {el}<span>{label}</span>
    </label>
  );
};

// Switch / Toggle — /Switch spec · on-state uses primary-500 (brand)
const Switch = ({checked=false, disabled=false, size='md', onChange, label, style={}}) => {
  const sizeMap = {sm:{w:28,h:14,handle:12,travel:14}, md:{w:40,h:20,handle:18,travel:20}};
  const s = sizeMap[size] || sizeMap.md;

  const track = {
    position:'relative', display:'inline-block',
    boxSizing:'border-box',
    width:s.w, height:s.h, minWidth:s.w, minHeight:s.h,
    flexShrink:0,
    borderRadius:100,
    background: checked ? 'var(--ss-primary-500)' : 'var(--ss-neutral-400)',
    opacity: disabled ? 'var(--ss-disabled-opacity)' : 1,
    transition:'background .2s',
    cursor: disabled ? 'not-allowed' : 'pointer',
    verticalAlign:'middle',
  };
  const gap = (s.h - s.handle) / 2; // vertical centering; also horizontal inset when off
  const handle = {
    position:'absolute', top:gap, left: checked ? (s.w - s.handle - gap) : gap,
    boxSizing:'border-box',
    width:s.handle, height:s.handle, borderRadius:'50%', background:'#fff',
    transition:'left .2s',
  };

  const el = (
    <span role="switch" aria-checked={checked}
      onClick={()=>!disabled && onChange && onChange(!checked)}
      style={track}>
      <span style={handle}/>
    </span>
  );
  if (!label) return <span style={style}>{el}</span>;
  return (
    <label style={{display:'inline-flex',alignItems:'center',gap:10,cursor:disabled?'not-allowed':'pointer',
      fontSize:size==='sm'?12:14,color:'var(--ss-fg)',...style}}>
      {el}<span>{label}</span>
    </label>
  );
};

// ─── Badge / Pill ──────────────────────────────────────────────────
// /Badge-pill/Badge-Pill — pill-shaped label with optional leading icon.
// Tokens from Figma: 2 sizes (md 24h / sm 20h) × 8 colors × icon on/off.
// color: default | neutral | mint | slate | green | red | orange | purple
// Legacy `tone` prop is accepted as an alias for back-compat.
const pillColors = {
  default:{bg:'#F1F1F1', fg:'#111111', icon:'#111111'},
  neutral:{bg:'#D1D5DB', fg:'#111111', icon:'#111111'},
  mint:   {bg:'#CFECEE', fg:'#0A4D53', icon:'#0A4D53'},
  slate:  {bg:'#475569', fg:'#FFFFFF', icon:'#FFFFFF'},
  green:  {bg:'#D7F0D7', fg:'#1F5E2A', icon:'#1F5E2A'},
  red:    {bg:'#FDD8CE', fg:'#9B2C0F', icon:'#9B2C0F'},
  orange: {bg:'#FDE2B8', fg:'#7A4A0F', icon:'#7A4A0F'},
  purple: {bg:'#E1D7FB', fg:'#3E2878', icon:'#3E2878'},
  // legacy aliases
  primary:{bg:'var(--ss-primary-50)',   fg:'var(--ss-primary-700)',  icon:'var(--ss-primary-500)'},
  accent: {bg:'var(--ss-accent-50)',    fg:'var(--ss-accent-700)',   icon:'var(--ss-accent-500)'},
  live:   {bg:'var(--ss-positive-100)', fg:'var(--ss-positive-800)', icon:'var(--ss-positive-500)'},
  paused: {bg:'var(--ss-warning-100)',  fg:'var(--ss-warning-800)',  icon:'var(--ss-warning-500)'},
  draft:  {bg:'var(--ss-secondary-100)',fg:'var(--ss-secondary-800)',icon:'var(--ss-secondary-500)'},
  error:  {bg:'var(--ss-negative-100)', fg:'var(--ss-negative-800)', icon:'var(--ss-negative-500)'},
  hl:     {bg:'var(--ss-highlight-100)',fg:'var(--ss-highlight-900)',icon:'var(--ss-highlight-500)'},
};
const Pill = ({children, color='default', tone, size='md', icon='plus', leading, dot=false, style={}}) => {
  const S = { md:{h:24, fs:12, lh:16, iconSize:16, padX:6, gap:4},
              sm:{h:20, fs:11, lh:14, iconSize:14, padX:6, gap:4} }[size] || undefined;
  const s = S || { h:24, fs:12, lh:16, iconSize:16, padX:6, gap:4 };
  const c = pillColors[tone || color] || pillColors.default;
  const showIcon = !!(leading ?? (icon ? true : false));
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:s.gap,
      height:s.h, padding:`0 ${s.padX + 2}px 0 ${s.padX}px`,
      borderRadius:99, background:c.bg, color:c.fg,
      fontFamily:'var(--ss-font-body, "DM Sans", system-ui, sans-serif)',
      fontWeight:500, fontSize:s.fs, lineHeight:`${s.lh}px`,
      whiteSpace:'nowrap', ...style,
    }}>
      {dot && <span style={{width:6,height:6,borderRadius:'50%',background:c.icon,flexShrink:0}}/>}
      {showIcon && !dot && leading !== false && (leading || (
        <i data-lucide={icon} style={{width:s.iconSize,height:s.iconSize,color:c.icon,strokeWidth:1.75,flexShrink:0}}/>
      ))}
      <span style={{padding:'0 2px'}}>{children}</span>
    </span>
  );
};
// Chip — legacy shim: same API as before, renders through Pill.
const Chip = ({children, tone='neutral', dot=false, style={}}) => (
  <Pill tone={tone} dot={dot} leading={false} style={style}>{children}</Pill>
);

// /Badge-pill/Selectable-Pill — pill with leading tick + trailing chevron.
// variant: filled (teal-tinted) | outline
// size: md (24h) | lg (32h) | xl (40h)
// state: regular | active (deeper tint) | disabled
const SelectablePill = ({
  children='Pill content', size='lg', variant='filled', state='regular',
  showTick=true, showChevron=true, onClick, style={},
}) => {
  const S = {
    md:{h:24, padX:4, fs:12, lh:16, iconSize:16, gap:4},
    lg:{h:32, padX:8, fs:14, lh:20, iconSize:20, gap:6},
    xl:{h:40, padX:10, fs:16, lh:24, iconSize:20, gap:8},
  }[size] || { h:32, padX:8, fs:14, lh:20, iconSize:20, gap:6 };

  const teal = '74,156,166'; // rgb for --ss-primary-500 in fig (4A9CA6)
  const tint = state === 'active' ? 0.2 : 0.1;
  const bg   = variant === 'filled' ? `rgba(${teal},${tint})` : '#FFFFFF';
  const bd   = variant === 'outline'
    ? (state === 'active' ? `1px solid rgb(${teal})` : '1px solid var(--ss-neutral-200)')
    : 'none';
  const fg   = 'rgb(61,66,77)';
  const iconFg = `rgb(${teal})`;

  return (
    <button type="button" onClick={state !== 'disabled' ? onClick : undefined} disabled={state==='disabled'}
      style={{
        display:'inline-flex', alignItems:'center', gap:S.gap,
        height:S.h, padding:`0 ${S.padX}px`, borderRadius:99,
        background:bg, border:bd, color:fg, cursor:state==='disabled' ? 'not-allowed' : 'pointer',
        opacity: state === 'disabled' ? 0.4 : 1,
        fontFamily:'var(--ss-font-body, "DM Sans", system-ui, sans-serif)',
        fontWeight:500, fontSize:S.fs, lineHeight:`${S.lh}px`,
        whiteSpace:'nowrap', flexShrink:0,
        ...style,
      }}>
      {showTick && (
        <i data-lucide="check-circle-2"
          style={{width:S.iconSize,height:S.iconSize,color:iconFg,strokeWidth:1.75,flexShrink:0}}/>
      )}
      <span style={{padding:'0 4px'}}>{children}</span>
      {showChevron && (
        <i data-lucide="chevron-down"
          style={{width:S.iconSize,height:S.iconSize,color:'var(--ss-neutral-600)',strokeWidth:1.75,flexShrink:0}}/>
      )}
    </button>
  );
};

const Card = ({children, style={}, onClick, hover=false}) => {
  const [h,setH] = React.useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{
        background:'#fff', border:'1px solid var(--ss-border)', borderRadius:12,
        padding:'16px 20px',
        boxShadow: (hover&&h) ? 'var(--ss-shadow-md)' : 'var(--ss-shadow-sm)',
        cursor: onClick ? 'pointer' : 'default',
        transition:'box-shadow .2s',
        ...style
      }}>{children}</div>
  );
};

// Avatar — matches twigs-claude.fig /Avatar spec
// sizes: xxs(16) xs(20) sm(24) md(32) lg(40) xl(48) 2xl(56) 3xl(72) 4xl(96) 5xl(120)
// shape: 'rounded' (circle) | 'squircle'
// mode:  'image' (src=...) | 'initials' (initials=...) | 'anonymous' (shows ?)
// border: optional white ring (2/3px depending on size) used in stacks
const Avatar = ({
  size='md', shape='rounded', src, initials, alt='',
  mode, border=false, style={}, title,
}) => {
  const sizeMap = {
    xxs:{px:16, fs:10, lh:12, border:1.5, radius:{rounded:999, squircle:4}},
    xs: {px:20, fs:12, lh:14, border:1.5, radius:{rounded:999, squircle:5}},
    sm: {px:24, fs:12, lh:16, border:2,   radius:{rounded:999, squircle:6}},
    md: {px:32, fs:14, lh:20, border:2,   radius:{rounded:999, squircle:8}},
    lg: {px:40, fs:16, lh:24, border:2,   radius:{rounded:999, squircle:10}},
    xl: {px:48, fs:18, lh:28, border:3,   radius:{rounded:999, squircle:12}},
    '2xl':{px:56, fs:20, lh:28, border:3, radius:{rounded:999, squircle:14}},
    '3xl':{px:72, fs:26, lh:32, border:3, radius:{rounded:999, squircle:18}},
    '4xl':{px:96, fs:32, lh:40, border:3, radius:{rounded:999, squircle:24}},
    '5xl':{px:120, fs:40, lh:48, border:3, radius:{rounded:999, squircle:30}},
  };
  const s = sizeMap[size] || sizeMap.md;
  const radius = s.radius[shape] ?? s.radius.rounded;

  // infer mode if not given
  const m = mode || (src ? 'image' : (initials ? 'initials' : 'anonymous'));

  const base = {
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    width:s.px, height:s.px, borderRadius:radius,
    fontFamily:'var(--ss-font-body, "DM Sans", system-ui, sans-serif)',
    fontWeight:700, fontSize:s.fs, lineHeight:`${s.lh}px`,
    letterSpacing:'0.005em', overflow:'hidden', flexShrink:0,
    boxSizing:'border-box', position:'relative',
    ...(border ? { boxShadow:`0 0 0 ${s.border}px #fff` } : {}),
    ...style,
  };

  if (m === 'image') {
    return (
      <span title={title} aria-label={alt} style={{...base,
        backgroundImage:`url(${src})`, backgroundSize:'cover', backgroundPosition:'center'}} />
    );
  }
  if (m === 'initials') {
    return (
      <span title={title} aria-label={alt || initials} style={{...base,
        background:'rgba(113,86,245,0.2)', color:'rgb(113,88,245)'}}>
        {initials}
      </span>
    );
  }
  // anonymous
  return (
    <span title={title} aria-label={alt || 'Unknown user'} style={{...base,
      background:'rgb(248,248,248)', color:'rgb(132,132,132)',
      border:'2px dashed rgb(145,145,145)'}}>
      ?
    </span>
  );
};

// AvatarGroup — stacked avatars with overlap + optional "+N" indicator
const AvatarGroup = ({children, max, overlap=0.3, size='md'}) => {
  const items = React.Children.toArray(children);
  const shown = max ? items.slice(0, max) : items;
  const hidden = max ? items.length - shown.length : 0;
  const sizePx = {xxs:16,xs:20,sm:24,md:32,lg:40,xl:48,'2xl':56,'3xl':72,'4xl':96,'5xl':120}[size] || 32;
  const step = Math.round(sizePx * (1 - overlap));
  return (
    <div style={{display:'inline-flex', alignItems:'center'}}>
      {shown.map((el, i) => (
        <div key={i} style={{marginLeft: i===0 ? 0 : step - sizePx, position:'relative', zIndex: shown.length - i}}>
          {React.cloneElement(el, {border:true, size})}
        </div>
      ))}
      {hidden > 0 && (
        <div style={{marginLeft: step - sizePx, position:'relative'}}>
          <Avatar size={size} mode="initials" initials={`+${hidden}`} border/>
        </div>
      )}
    </div>
  );
};

// Tooltip — matches twigs-claude.fig /Tooltip spec
// sizes sm/md/lg · 12 alignments (top/bottom/left/right × start/center/end)
// Controlled `open` prop for demos; omit to enable hover behavior.
const Tooltip = ({
  children, content, size='md', placement='top', open, style={},
  offset = 4, // gap between trigger and tooltip (visual; in addition to arrow)
}) => {
  const [hover, setHover] = React.useState(false);
  const isOpen = open !== undefined ? open : hover;

  // size tokens from Figma
  const S = {
    sm:{ fs:12, lh:16, fw:500, r:4, padY:4,  padX:8,  arrowW:10, arrowH:6,  gap:6 },
    md:{ fs:14, lh:20, fw:400, r:8, padY:6,  padX:12, arrowW:14, arrowH:8,  gap:8 },
    lg:{ fs:14, lh:20, fw:500, r:8, padY:12, padX:16, arrowW:20, arrowH:12, gap:12 },
  }[size];

  const [side, align] = placement.split('-'); // 'top' | 'top-start' etc.

  // Bubble (body)
  const bubble = {
    position:'absolute', zIndex:50, pointerEvents:'none',
    background:'rgb(17,17,17)', color:'#fff',
    fontFamily:'var(--ss-font-body, "DM Sans", system-ui, sans-serif)',
    fontSize:S.fs, lineHeight:`${S.lh}px`, fontWeight:S.fw,
    borderRadius:S.r, padding:`${S.padY}px ${S.padX}px`,
    boxShadow:'0 2px 4px rgba(0,0,0,0.15)',
    whiteSpace:'nowrap', opacity: isOpen ? 1 : 0,
    transform: `translate(var(--tt-tx,0), var(--tt-ty,0))`,
    transition:'opacity .12s ease',
  };

  // placement positioning relative to trigger wrapper
  // Bubble sits `offset` away from the trigger; arrow sticks out from bubble
  // toward trigger and closes the remaining gap.
  const pos = {};
  if (side==='top')    { pos.bottom = `calc(100% + ${offset + S.arrowH}px)`; }
  if (side==='bottom') { pos.top    = `calc(100% + ${offset + S.arrowH}px)`; }
  if (side==='left')   { pos.right  = `calc(100% + ${offset + S.arrowH}px)`; pos.top='50%'; pos['--tt-ty']='-50%'; }
  if (side==='right')  { pos.left   = `calc(100% + ${offset + S.arrowH}px)`; pos.top='50%'; pos['--tt-ty']='-50%'; }
  if (side==='top' || side==='bottom') {
    if (!align)            { pos.left = '50%'; pos['--tt-tx']='-50%'; }
    if (align==='start')   { pos.left = 0; }
    if (align==='end')     { pos.right = 0; }
  }
  if (side==='left' || side==='right') {
    if (align==='start')   { pos.top = 0; pos['--tt-ty']='0'; }
    if (align==='end')     { pos.top = 'auto'; pos.bottom = 0; pos['--tt-ty']='0'; }
  }

  // Arrow — orientation per side, pre-drawn (no CSS rotation).
  // Triangle points AWAY from the bubble, toward the trigger.
  const arrow = { position:'absolute', display:'block', pointerEvents:'none' };
  let arrowW, arrowH, arrowPath;
  if (side==='top') {
    // bubble above trigger -> arrow on bubble's bottom edge, pointing DOWN
    arrowW = S.arrowW; arrowH = S.arrowH;
    arrowPath = `M 0 0 L ${arrowW} 0 L ${arrowW/2} ${arrowH} Z`;
    arrow.top = '100%';
  } else if (side==='bottom') {
    // bubble below trigger -> arrow on bubble's top edge, pointing UP
    arrowW = S.arrowW; arrowH = S.arrowH;
    arrowPath = `M ${arrowW/2} 0 L ${arrowW} ${arrowH} L 0 ${arrowH} Z`;
    arrow.bottom = '100%';
  } else if (side==='left') {
    // bubble left of trigger -> arrow on bubble's right edge, pointing RIGHT
    arrowW = S.arrowH; arrowH = S.arrowW;
    arrowPath = `M 0 0 L ${arrowW} ${arrowH/2} L 0 ${arrowH} Z`;
    arrow.left = '100%';
  } else { // right
    // bubble right of trigger -> arrow on bubble's left edge, pointing LEFT
    arrowW = S.arrowH; arrowH = S.arrowW;
    arrowPath = `M ${arrowW} 0 L ${arrowW} ${arrowH} L 0 ${arrowH/2} Z`;
    arrow.right = '100%';
  }
  // Along-edge positioning
  if (side==='top' || side==='bottom') {
    if (!align)          { arrow.left = '50%'; arrow.marginLeft = -arrowW/2; }
    if (align==='start') { arrow.left = `${Math.max(S.padX, 8)}px`; }
    if (align==='end')   { arrow.right = `${Math.max(S.padX, 8)}px`; }
  } else {
    if (!align)          { arrow.top = '50%'; arrow.marginTop = -arrowH/2; }
    if (align==='start') { arrow.top = `${Math.max(S.padY, 6)}px`; }
    if (align==='end')   { arrow.bottom = `${Math.max(S.padY, 6)}px`; }
  }

  return (
    <span
      style={{position:'relative', display:'inline-flex', ...style}}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      {children}
      <span style={{...bubble, ...pos}}>
        {content}
        <svg width={arrowW} height={arrowH} viewBox={`0 0 ${arrowW} ${arrowH}`} style={arrow}>
          <path d={arrowPath} fill="rgb(17,17,17)"/>
        </svg>
      </span>
    </span>
  );
};

// Select — twigs-claude.fig /Select spec
// sizes sm/md/lg/xl · variants outline/filled · states handled automatically
//   (Regular, Hover, Active/Focus when open, Typed when value chosen, Error, Disabled)
// Options: array of {value, label} or plain strings. Controlled via value/onChange.
// Extras: label, required, helper, error, leftIcon, counter (0/max), clearable, placeholder.
const Select = ({
  options=[], value, onChange, placeholder='Placeholder Text',
  size='md', variant='outline',
  label, helper, error, required,
  leftIcon, clearable=false,
  maxLength, showCount,
  disabled=false,
  open: openProp, onOpenChange,
  style={},
}) => {
  // Per-size tokens — straight from Figma
  //   sm:  h=28, r=4,  pad 6/8,  fs=12, lh=16, chev=14
  //   md:  h=32, r=8,  pad 6/8,  fs=14, lh=20, chev=16
  //   lg:  h=40, r=8,  pad 10/12,fs=14, lh=20, chev=24
  //   xl:  h=48, r=12, pad 12,   fs=16, lh=24, chev=24
  const sizeMap = {
    sm: {h:28, r:4,  px:8,  fs:12, lh:16, chev:14, iconSize:14, labelFs:12, helperFs:12, menuFs:13},
    md: {h:32, r:8,  px:8,  fs:14, lh:20, chev:16, iconSize:16, labelFs:12, helperFs:12, menuFs:14},
    lg: {h:40, r:8,  px:12, fs:14, lh:20, chev:24, iconSize:18, labelFs:12, helperFs:12, menuFs:14},
    xl: {h:48, r:12, px:12, fs:16, lh:24, chev:24, iconSize:20, labelFs:14, helperFs:12, menuFs:15},
  };
  const s = sizeMap[size] || sizeMap.md;

  const [internalOpen, setInternalOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const open = openProp !== undefined ? openProp : internalOpen;
  const setOpen = (next) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange && onOpenChange(next);
  };
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const opts = options.map(o => typeof o === 'string' ? {value:o, label:o} : o);
  const selected = opts.find(o => o.value === value);
  const typed = !!selected;

  // Derive border color per state (outline)
  //   Regular rgba(0,0,0,0.15) · Hover/Focus rgb(158,158,158) · Error rgb(246,86,51) · Disabled rgb(226,226,226)
  let borderCol = 'rgba(0,0,0,0.15)';
  if (disabled) borderCol = 'rgb(226,226,226)';
  else if (error) borderCol = 'rgb(246,86,51)';
  else if (open || hover) borderCol = 'rgb(158,158,158)';

  // Background: outline=white, filled=#6474...0.06; both get a slightly opaque fill when disabled
  const bg = variant === 'filled' || disabled ? 'rgba(100,116,139,0.06)' : '#fff';

  const fieldStyle = {
    position:'relative',
    height:s.h, borderRadius:s.r, background:bg,
    border: variant==='outline' ? `1px solid ${borderCol}` : 'none',
    display:'flex', alignItems:'center', gap:4,
    padding: `0 ${s.px}px`, fontSize:s.fs, lineHeight:`${s.lh}px`,
    color:'var(--ss-fg)',
    transition:'border-color .15s',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect:'none',
  };

  // Active/Focus ring — 1.5px solid primary-200 (rgb(138,204,210)) at -2/-2 with radius+2
  const focusRing = (open && !disabled && !error) && (
    <span aria-hidden style={{
      position:'absolute', left:-2, top:-2, right:-2, bottom:-2,
      borderRadius: s.r + 2, border: '1.5px solid rgb(138,204,210)',
      pointerEvents:'none',
    }}/>
  );

  // Placeholder uses rgb(145,145,145); typed uses rgb(17,17,17)
  const valueColor = typed ? 'rgb(17,17,17)' : 'rgb(145,145,145)';

  return (
    <div ref={rootRef}
      style={{display:'flex',flexDirection:'column',gap:4,fontFamily:'inherit',position:'relative',...style}}>
      {(label || showCount) && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,
          fontSize:s.labelFs, lineHeight:'16px'}}>
          {label && (
            <span style={{color:'rgb(87,87,87)', fontWeight:500}}>
              {label}{required && <span style={{color:'rgb(231,80,48)',marginLeft:2}}>*</span>}
            </span>
          )}
          {showCount && (
            <span style={{color:'rgb(117,117,117)', fontWeight:400}}>
              {(selected?.label?.length || 0)}{maxLength?`/${maxLength}`:''}
            </span>
          )}
        </div>
      )}

      <div
        role="combobox" aria-expanded={open} aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
        onClick={()=>!disabled && setOpen(!open)}
        onKeyDown={(e)=>{
          if (disabled) return;
          if (e.key===' '||e.key==='Enter') { e.preventDefault(); setOpen(!open); }
          if (e.key==='Escape') setOpen(false);
        }}
        style={fieldStyle}>
        {leftIcon && (
          <span style={{display:'inline-flex',color:'rgb(87,87,87)',flexShrink:0}}>
            <Icon name={leftIcon} size={s.iconSize}/>
          </span>
        )}
        <span style={{flex:1, minWidth:0, color:valueColor, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
          {selected?.label ?? placeholder}
        </span>
        {clearable && typed && !disabled && (
          <span onClick={(e)=>{e.stopPropagation(); onChange && onChange(null);}}
            style={{display:'inline-flex',color:'rgb(87,87,87)',cursor:'pointer',flexShrink:0}}>
            <Icon name="x" size={s.iconSize}/>
          </span>
        )}
        <span style={{display:'inline-flex',color:'rgb(87,87,87)',flexShrink:0,transition:'transform .2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0)'}}>
          <Icon name="chevron-down" size={s.iconSize}/>
        </span>
        {focusRing}
      </div>

      {(helper || error) && (
        <span style={{fontSize:s.helperFs, lineHeight:'16px',
          color: error ? 'rgb(246,86,51)' : 'rgb(117,117,117)'}}>{error || helper}</span>
      )}

      {open && !disabled && opts.length > 0 && (
        <div role="listbox"
          style={{
            position:'absolute',
            left:0, right:0,
            top: `calc(${label ? '20px + ' : ''}${s.h}px + 6px)`,
            background:'#fff',
            border:'1px solid rgb(226,226,226)',
            borderRadius: s.r,
            boxShadow:'0 8px 24px rgba(17,17,17,.08), 0 2px 6px rgba(17,17,17,.04)',
            padding:4,
            zIndex:20,
            maxHeight: 260, overflowY:'auto',
            fontSize: s.menuFs,
          }}>
          {opts.map(o => {
            const active = o.value === value;
            return (
              <SelectOption key={o.value} active={active}
                onPick={()=>{ onChange && onChange(o.value); setOpen(false); }}>
                {o.label}
              </SelectOption>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SelectOption = ({children, active, onPick}) => {
  const [h, setH] = React.useState(false);
  return (
    <div role="option" aria-selected={active}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      onClick={onPick}
      style={{
        padding:'8px 10px', borderRadius:4, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:8,
        background: active ? 'var(--ss-primary-50)' : (h ? 'var(--ss-neutral-50)' : 'transparent'),
        color: active ? 'var(--ss-primary-700)' : 'var(--ss-fg)',
        fontWeight: active ? 600 : 400,
        transition:'background .1s',
      }}>
      <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{children}</span>
      {active && <Icon name="check" size={14}/>}
    </div>
  );
};

// Tabs — matches twigs-claude.fig /Tabs spec
// type   : 'primary'       → underline indicator on active (no bg)
//          'primary-fill'  → filled teal pill on active + stronger hover
//          'secondary-fill'→ neutral tint pill on active
// size   : sm (h24, fs14/20, r4/r6) · lg (h44, fs14/20, r10) · xl (h40, fs16/24, r12)
// Each <Tab> takes: value, label, icon, count, disabled
//
// Primary color tokens (from Figma):
//   default text  #111111
//   hover text    #000 (brand uses teal hover #00555C for fill)
//   active text   #00828D (primary-500)  · indicator bar  #00828D · 3px
//   fill active bg rgba(0,130,141,0.15) + text #003E43
//   secondary active bg rgba(100,116,139,0.15) + text #444B5A
//   focus ring    2px #5CB5BD, 4px offset (primary-fill), 1.5px on sm
//   disabled      opacity 0.4
const Tabs = ({
  value, onChange, type='primary', size='xl', children, style={},
}) => {
  const tabs = React.Children.toArray(children).filter(Boolean);
  // the primary (underline) variant has a single moving indicator; for
  // primary-fill/secondary-fill each tab carries its own active bg, so no
  // shared indicator bar is needed.
  const isUnderline = type === 'primary';
  return (
    <div role="tablist" style={{
      display:'flex', alignItems:'center', flexWrap:'wrap',
      gap: size==='sm' ? 4 : 8,
      position:'relative',
      borderBottom: isUnderline ? '1px solid var(--ss-neutral-100)' : 'none',
      ...style,
    }}>
      {tabs.map((child) => React.cloneElement(child, {
        selected: child.props.value === value,
        onSelect: () => !child.props.disabled && onChange && onChange(child.props.value),
        _type: type, _size: size,
      }))}
    </div>
  );
};

const Tab = ({
  value, label, icon, count, disabled=false,
  selected=false, onSelect, _type='primary', _size='xl',
}) => {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const sz = {
    sm:{h:24, fs:14, lh:20, fw:500, padY:2, padX:8,  gap:4, radius:4,  iconSize:16, pillSize:18, underH:2},
    lg:{h:44, fs:14, lh:20, fw:700, padY:12,padX:8,  gap:4, radius:10, iconSize:20, pillSize:20, underH:3},
    xl:{h:40, fs:16, lh:24, fw:700, padY:8, padX:12, gap:4, radius:12, iconSize:24, pillSize:20, underH:3},
  }[_size] || {h:40, fs:16, lh:24, fw:700, padY:8, padX:12, gap:4, radius:12, iconSize:24, pillSize:20, underH:3};

  // color + bg per type × state
  let fg, bg, pillFg;
  if (_type === 'primary') {
    // underline variant — text color shifts, bg always transparent
    bg = 'transparent';
    if (disabled)       fg = 'rgb(117,117,117)';
    else if (selected)  fg = 'var(--ss-primary-500)';
    else if (hover)     fg = 'rgb(17,17,17)';
    else                fg = 'rgb(17,17,17)';
    pillFg = 'var(--ss-neutral-700)';
  } else if (_type === 'primary-fill') {
    if (disabled)      { fg = 'rgb(184,225,229)'; bg = 'transparent'; }
    else if (selected) { fg = 'rgb(0,62,67)';     bg = 'rgba(0,130,141,0.15)'; }
    else if (hover)    { fg = 'rgb(0,85,92)';     bg = 'rgba(0,130,141,0.06)'; }
    else               { fg = 'var(--ss-primary-500)'; bg = 'transparent'; }
    pillFg = fg;
  } else { // secondary-fill
    if (disabled)      { fg = 'rgba(100,116,139,0.5)'; bg = 'transparent'; }
    else if (selected) { fg = 'rgb(68,75,90)';  bg = 'rgba(100,116,139,0.15)'; }
    else if (hover)    { fg = 'rgb(78,89,108)'; bg = 'rgba(100,116,139,0.08)'; }
    else               { fg = 'rgb(100,116,139)'; bg = 'transparent'; }
    pillFg = fg;
  }

  const ring = focus && !disabled ? `0 0 0 ${_size==='sm'?1.5:2}px var(--ss-primary-300, #5CB5BD)` : 'none';

  return (
    <button role="tab" aria-selected={selected} disabled={disabled}
      onClick={onSelect}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
      style={{
        position:'relative', boxSizing:'border-box',
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        gap:sz.gap, height:sz.h, padding:`${sz.padY}px ${sz.padX}px`,
        borderRadius: _type==='primary' ? 0 : sz.radius,
        background:bg, color:fg, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontFamily:'var(--ss-font-body, "DM Sans", system-ui, sans-serif)',
        fontWeight:sz.fw, fontSize:sz.fs, lineHeight:`${sz.lh}px`,
        border:'none', outline:'none',
        boxShadow: ring,
        transition:'background .15s, color .15s, box-shadow .15s',
        marginBottom: _type==='primary' ? -1 /* overlap bottom border of Tabs */ : 0,
      }}>
      {icon && <i data-lucide={icon} style={{width:sz.iconSize,height:sz.iconSize,strokeWidth:1.75}}/>}
      <span>{label}</span>
      {count != null && (
        <span style={{
          display:'inline-flex', alignItems:'center', justifyContent:'center',
          minWidth:sz.pillSize, height:sz.pillSize, padding:'0 6px',
          borderRadius:4, border:'1px solid var(--ss-neutral-200)',
          color:pillFg, background:'transparent',
          fontSize: _size==='sm'?11:12, fontWeight:500, lineHeight:1,
          marginLeft:2,
        }}>{count}</span>
      )}
      {_type==='primary' && selected && (
        <span style={{
          position:'absolute', left:0, right:0,
          bottom:-1, height:sz.underH,
          background:'var(--ss-primary-500)',
        }}/>
      )}
    </button>
  );
};

// ─── Pagination ──────────────────────────────────────────────────────
// /Pagination/Pagination — two types: numbered and compact.
// Numbered:  32×32 page buttons + 32×32 chevron icon buttons, 4px gap.
//   - Inactive pages: white bg ("Bright"), text rgb(100,116,139), DM Sans 700 14/20
//   - Active page:    rgba(100,116,139,0.08) bg, same text color
//   - Disabled chevron: 0.4 opacity
// Compact: 24×24 chevron icon buttons + "n/total" summary (14/20, rgb(87,87,87)), 4px gap.
const PaginationPageBtn = ({children, active, disabled, onClick, size=32}) => (
  <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled}
    style={{
      width:size, height:size, borderRadius:8, border:'none',
      background: active ? 'rgba(100,116,139,0.08)' : 'rgb(255,255,255)',
      color:'rgb(100,116,139)',
      fontFamily:'var(--ss-font-body, "DM Sans", system-ui, sans-serif)',
      fontWeight:700, fontSize:14, lineHeight:'20px',
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      cursor: disabled ? 'not-allowed' : (active ? 'default' : 'pointer'),
      opacity: disabled ? 0.4 : 1,
      transition:'background 120ms ease',
      padding:0,
    }}
    onMouseEnter={(e)=>{ if(!disabled && !active) e.currentTarget.style.background='rgba(100,116,139,0.04)'; }}
    onMouseLeave={(e)=>{ if(!disabled && !active) e.currentTarget.style.background='rgb(255,255,255)'; }}>
    {children}
  </button>
);

const PaginationEllipsis = ({size=32}) => (
  <span style={{
    width:size, height:size, display:'inline-flex', alignItems:'center', justifyContent:'center',
    color:'rgb(100,116,139)', fontFamily:'var(--ss-font-body, "DM Sans", system-ui, sans-serif)',
    fontWeight:700, fontSize:14, lineHeight:'20px',
  }}>…</span>
);

// Build the page-number sequence for a numbered pagination, following the fig's
// "1 2 3 … N" shape: first page, neighbours of current, last page, '…' between gaps.
function paginate(current, total, siblings=1){
  const out = [];
  const add = v => out.push(v);
  const start = Math.max(2, current - siblings);
  const end   = Math.min(total - 1, current + siblings);
  add(1);
  if (start > 2) add('…');
  for (let i = start; i <= end; i++) add(i);
  if (end < total - 1) add('…');
  if (total > 1) add(total);
  return out;
}

const Pagination = ({
  type='numbered',           // 'numbered' | 'compact'
  page=1, total=17, siblings=1,
  onChange=()=>{}, style={},
}) => {
  const go = (p) => { if (p < 1 || p > total || p === page) return; onChange(p); };
  const prevDisabled = page <= 1;
  const nextDisabled = page >= total;

  if (type === 'compact') {
    return (
      <div style={{display:'inline-flex',alignItems:'center',gap:4,...style}}>
        <PaginationPageBtn size={24} disabled={prevDisabled} onClick={()=>go(page-1)}>
          <i data-lucide="chevron-left"  style={{width:16,height:16,strokeWidth:1.75}}/>
        </PaginationPageBtn>
        <span style={{
          minWidth:30, height:24, padding:'2px 6px', borderRadius:5,
          display:'inline-flex', alignItems:'center', justifyContent:'center',
          fontFamily:'var(--ss-font-body, "DM Sans", system-ui, sans-serif)',
          fontSize:14, lineHeight:'20px', color:'rgb(87,87,87)',
        }}>{page}/{total}</span>
        <PaginationPageBtn size={24} disabled={nextDisabled} onClick={()=>go(page+1)}>
          <i data-lucide="chevron-right" style={{width:16,height:16,strokeWidth:1.75}}/>
        </PaginationPageBtn>
      </div>
    );
  }

  const items = paginate(page, total, siblings);
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:4,...style}}>
      <PaginationPageBtn disabled={prevDisabled} onClick={()=>go(page-1)}>
        <i data-lucide="chevron-left"  style={{width:18,height:18,strokeWidth:1.75}}/>
      </PaginationPageBtn>
      {items.map((it,i) => it === '…'
        ? <PaginationEllipsis key={`e${i}`} />
        : <PaginationPageBtn key={it} active={it === page} onClick={()=>go(it)}>{it}</PaginationPageBtn>
      )}
      <PaginationPageBtn disabled={nextDisabled} onClick={()=>go(page+1)}>
        <i data-lucide="chevron-right" style={{width:18,height:18,strokeWidth:1.75}}/>
      </PaginationPageBtn>
    </div>
  );
};

// ─── Loader ──────────────────────────────────────────────────────────
// /Loader/Loader-Line and /Loader/Loader-Radial
// Line: horizontal track with a sliding head that fills ~42% of the track.
//   Spec (from fig Size=LG): track 24×6 radius 100, track bg rgba(255,255,255,0.5),
//   head 10×6 rgb(255,255,255). Extrapolated to 4 sizes on a matching scale.
// Radial: classic spinning arc. Track rgba(white,0.15), head in the "on" color.
const loaderLineSizes = {
  sm: {w:16, h:4, head:7,  r:100},
  md: {w:20, h:5, head:8,  r:100},
  lg: {w:24, h:6, head:10, r:100},
  xl: {w:32, h:8, head:14, r:100},
};
const LoaderLine = ({size='lg', tone='onLight', style={}}) => {
  const s = loaderLineSizes[size] || loaderLineSizes.lg;
  const isDark = tone === 'onDark';
  const track  = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(100,116,139,0.2)';
  const head   = isDark ? 'rgb(255,255,255)'      : 'var(--ss-primary-500)';
  return (
    <span style={{position:'relative', width:s.w, height:s.h, borderRadius:s.r,
      background:track, overflow:'hidden', display:'inline-block', ...style}}>
      <span style={{
        position:'absolute', top:0, left:0, width:s.head, height:s.h,
        borderRadius:s.r, background:head,
        animation:`ss-loader-line ${1.2}s cubic-bezier(.65,.05,.35,1) infinite`,
        '--ss-loader-line-travel': `${s.w - s.head}px`,
      }}/>
      <style>{`
        @keyframes ss-loader-line {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(var(--ss-loader-line-travel)); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </span>
  );
};

const loaderRadialSizes = {
  xs: {d:10, sw:1.5},
  sm: {d:16, sw:2},
  md: {d:24, sw:2.5},
  lg: {d:32, sw:3},
  xl: {d:48, sw:4},
};
const LoaderRadial = ({size='md', tone='onLight', style={}}) => {
  const s = loaderRadialSizes[size] || loaderRadialSizes.md;
  const isDark = tone === 'onDark';
  const track  = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(100,116,139,0.2)';
  const head   = isDark ? 'rgb(255,255,255)'      : 'var(--ss-primary-500)';
  const r = (s.d - s.sw) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span style={{display:'inline-flex', width:s.d, height:s.d, ...style}}>
      <svg width={s.d} height={s.d} viewBox={`0 0 ${s.d} ${s.d}`} role="status" aria-label="Loading"
        style={{animation:'ss-loader-spin 1s linear infinite'}}>
        <circle cx={s.d/2} cy={s.d/2} r={r} fill="none" stroke={track} strokeWidth={s.sw}/>
        <circle cx={s.d/2} cy={s.d/2} r={r} fill="none" stroke={head} strokeWidth={s.sw}
          strokeLinecap="round" strokeDasharray={`${c * 0.25} ${c * 0.75}`} strokeDashoffset={0}/>
      </svg>
      <style>{`@keyframes ss-loader-spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
};

// ─── Alert (inline) ────────────────────────────────────────────────
// /Alert/Inline-alert — 6 variants × 2 sizes × dismissable? (24 combos)
// Spec from twigs-claude.fig (node 471:506).
//
// Variants: info · success · caution · fyi · stark · bright
//   - info    → primary-tinted (rgba(113,88,245,0.04) bg, 0.2 border) · info-circle
//   - success → positive-50 bg · tick-round
//   - caution → warning-tinted bg · warning triangle
//   - fyi     → neutral-50 bg · info-circle
//   - stark   → secondary-700 bg (dark), white text · alert-fill
//   - bright  → white bg with 8% black border · info-circle
// Sizes: md (h32, r8, 14/20 type, 20px icon) · lg (h56, r12, 16/24 type, 24px icon)

const alertTokens = {
  info:    {bg:'rgba(113,88,245,0.04)', border:'rgba(113,88,245,0.2)', fg:'rgb(17,17,17)', icon:'info'},
  success: {bg:'rgb(244,250,241)',      border:'rgb(212,232,202)',     fg:'rgb(17,17,17)', icon:'success'},
  caution: {bg:'rgb(254,234,199)',      border:'rgb(253,210,138)',     fg:'rgb(17,17,17)', icon:'warning'},
  fyi:     {bg:'rgb(248,248,248)',      border:'rgb(226,226,226)',     fg:'rgb(17,17,17)', icon:'info'},
  stark:   {bg:'rgb(78,89,108)',        border:'rgba(0,0,0,0.15)',     fg:'rgb(255,255,255)', icon:'alertFill'},
  bright:  {bg:'rgb(255,255,255)',      border:'rgba(0,0,0,0.08)',     fg:'rgb(17,17,17)', icon:'info'},
};
const alertSizes = {
  md: {h:32, r:8,  padY:6,  padX:8,  gap:4, icon:20, fs:14, lh:20, closeSize:20},
  lg: {h:56, r:12, padY:16, padX:16, gap:8, icon:24, fs:16, lh:24, closeSize:24},
};
// Inline icons — single-colour, currentColor, match the fig silhouettes.
// InfoCircle: outline circle, filled exclamation below a dot.
const AlertIcon = ({kind, size=20, color='currentColor'}) => {
  const common = {width:size, height:size, viewBox:'0 0 24 24', fill:'none',
    stroke:color, strokeWidth:1.75, strokeLinecap:'round', strokeLinejoin:'round',
    style:{flexShrink:0, display:'block'}};
  if (kind === 'info') return (
    <svg {...common}><circle cx="12" cy="12" r="10"/><path d="M12 11v5.5"/><path d="M11 16.5h2.5" strokeLinecap="round"/><circle cx="12" cy="8" r="0.6" fill={color} stroke="none"/></svg>
  );
  if (kind === 'success') return (
    // positive-500 filled circle, white tick
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{flexShrink:0, display:'block'}}>
      <circle cx="12" cy="12" r="10" fill="var(--ss-positive-500)"/>
      <path d="M7.5 12.4l3 3 6-6.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
  if (kind === 'warning') return (
    // warning-500 filled triangle with white !
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{flexShrink:0, display:'block'}}>
      <path d="M12 3.2 22 20.4a1.4 1.4 0 0 1-1.2 2.1H3.2A1.4 1.4 0 0 1 2 20.4L12 3.2Z" fill="var(--ss-warning-500)"/>
      <path d="M12 9.5v5" stroke="#fff" strokeWidth="1.75" strokeLinecap="round"/>
      <circle cx="12" cy="18" r="1.1" fill="#fff"/>
    </svg>
  );
  if (kind === 'alertFill') return (
    // stark: filled triangle, currentColor = white on dark bg
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{flexShrink:0, display:'block'}}>
      <path d="M12 3.2 22 20.4a1.4 1.4 0 0 1-1.2 2.1H3.2A1.4 1.4 0 0 1 2 20.4L12 3.2Z" fill={color}/>
      <path d="M12 9.5v5" stroke="rgb(78,89,108)" strokeWidth="1.75" strokeLinecap="round"/>
      <circle cx="12" cy="18" r="1.1" fill="rgb(78,89,108)"/>
    </svg>
  );
  return null;
};

const Alert = ({
  variant = 'info',
  size = 'md',
  children,
  dismissable = false,
  onDismiss,
  style = {},
}) => {
  const t = alertTokens[variant] || alertTokens.info;
  const s = alertSizes[size] || alertSizes.md;
  const [hoverClose, setHoverClose] = React.useState(false);

  // Icon colour per variant. Most icons are currentColor-stroked.
  const iconColor = {
    info:    'var(--ss-accent-500)',
    fyi:     'var(--ss-neutral-700)',
    bright:  'var(--ss-secondary-700)',
    stark:   'rgb(255,255,255)',
  }[variant] || 'currentColor';

  const closeColor = variant === 'stark' ? 'rgba(255,255,255,0.7)' : 'rgba(100,116,139,0.7)';
  const closeHover = variant === 'stark' ? 'rgba(255,255,255,0.15)' : 'rgba(100,116,139,0.12)';

  return (
    <div role="alert" style={{
      display:'flex', alignItems:'center',
      gap:s.gap,
      padding:`${s.padY}px ${s.padX}px`,
      minHeight:s.h,
      borderRadius:s.r,
      background:t.bg,
      border:`1px solid ${t.border}`,
      color:t.fg,
      fontFamily:'var(--ss-font-body)',
      fontSize:s.fs,
      lineHeight:`${s.lh}px`,
      ...style,
    }}>
      <AlertIcon kind={t.icon} size={s.icon} color={iconColor}/>
      <span style={{flex:1, minWidth:0}}>{children}</span>
      {dismissable && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          onMouseEnter={()=>setHoverClose(true)}
          onMouseLeave={()=>setHoverClose(false)}
          style={{
            flexShrink:0,
            width:s.closeSize, height:s.closeSize,
            border:'none', background:hoverClose ? closeHover : 'transparent',
            borderRadius:4, cursor:'pointer', display:'inline-flex',
            alignItems:'center', justifyContent:'center', padding:0,
            color:closeColor, transition:'background 120ms ease',
          }}>
          <svg width={s.closeSize === 24 ? 16 : 12} height={s.closeSize === 24 ? 16 : 12} viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

// ─── Toast ─────────────────────────────────────────────────────────
// /Toast/Toasts + /Toast/Toaster-with-close-button
// Spec from twigs-claude.fig (nodes 471:980, 471:879).
//
// 4 styles × 2 sizes × optional close × optional actions (celebrate only).
//   - default   → accent-100 bg · Tick icon · 1px border rgba(0,0,0,.15)   · black text
//   - celebrate → accent-500 bg · Tick icon · .5px border rgba(255,255,255,.3) · white text · actions
//   - alert     → negative-600 bg · AlertFill icon · 1px border rgba(0,0,0,.15) · white text
//   - info      → warning-200 bg · Info icon · 1px border rgba(0,0,0,.15) · black text
//
// Sizes:
//   - md (72h): title + subtitle (2 lines)
//   - sm (52h/56h): title only
// Radius 10. Icon 24px, flush-left in a 48px well. Optional 24px close button
// on the right. Celebrate may carry up to 3 action buttons in its trailing slot.

const toastTokens = {
  default:   {bg:'var(--ss-accent-100)',    border:'1px solid rgba(0,0,0,0.15)',      fg:'rgb(0,0,0)',       sub:'rgba(0,0,0,0.8)',       icon:'tick',  iconBg:'var(--ss-accent-500)',  iconFg:'#fff'},
  celebrate: {bg:'var(--ss-accent-500)',    border:'0.5px solid rgba(255,255,255,0.3)', fg:'rgb(255,255,255)', sub:'rgba(255,255,255,0.8)', icon:'tick',  iconBg:'rgba(255,255,255,0.2)', iconFg:'#fff'},
  alert:     {bg:'var(--ss-negative-600)',  border:'1px solid rgba(0,0,0,0.15)',      fg:'rgb(255,255,255)', sub:'rgba(255,255,255,0.8)', icon:'alert', iconBg:null,                   iconFg:'#fff'},
  info:      {bg:'var(--ss-warning-200)',   border:'1px solid rgba(0,0,0,0.15)',      fg:'rgb(0,0,0)',       sub:'rgba(0,0,0,0.8)',       icon:'info',  iconBg:null,                   iconFg:'rgb(0,0,0)'},
};

// Inline icons — match fig silhouettes.
const ToastIcon = ({kind, token}) => {
  if (kind === 'tick') return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{flexShrink:0, display:'block'}}>
      <circle cx="12" cy="12" r="10" fill={token.iconBg || 'currentColor'}/>
      <path d="M7.5 12.4l3 3 6-6.5" stroke={token.iconFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
  if (kind === 'alert') return (
    // filled white triangle on red bg (fig: AlertFill)
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{flexShrink:0, display:'block'}}>
      <path d="M12 3.2 22 20.4a1.4 1.4 0 0 1-1.2 2.1H3.2A1.4 1.4 0 0 1 2 20.4L12 3.2Z" fill="#fff"/>
      <path d="M12 9.5v5" stroke="var(--ss-negative-600)" strokeWidth="1.75" strokeLinecap="round"/>
      <circle cx="12" cy="18" r="1.1" fill="var(--ss-negative-600)"/>
    </svg>
  );
  if (kind === 'info') return (
    // info circle, black
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{flexShrink:0, display:'block'}}>
      <circle cx="12" cy="12" r="10" stroke="rgb(0,0,0)" strokeWidth="1.75" fill="none"/>
      <path d="M12 11v5.5" stroke="rgb(0,0,0)" strokeWidth="1.75" strokeLinecap="round"/>
      <circle cx="12" cy="8" r="0.9" fill="rgb(0,0,0)"/>
    </svg>
  );
  return null;
};

const Toast = ({
  variant = 'default',
  size = 'md',             // 'md' (title + subtitle) | 'sm' (title only)
  title,
  description,
  actions,                 // React node; celebrate-only trailing slot
  dismissable = false,
  onDismiss,
  style = {},
}) => {
  const t = toastTokens[variant] || toastTokens.default;
  const [hoverClose, setHoverClose] = React.useState(false);
  const showDesc = size === 'md' && description;

  const closeColor = (variant === 'default' || variant === 'info')
    ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.8)';
  const closeHover = (variant === 'default' || variant === 'info')
    ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.18)';

  return (
    <div role="status" style={{
      display:'flex', alignItems:'center',
      gap:8,
      minHeight: size === 'md' ? 72 : 52,
      padding:'16px 16px 16px 48px',
      paddingRight: dismissable || actions ? 16 : 48,
      borderRadius:10,
      background:t.bg,
      border:t.border,
      color:t.fg,
      fontFamily:'var(--ss-font-body)',
      position:'relative',
      overflow:'hidden',
      ...style,
    }}>
      {/* Leading icon — flush-left 16px from edge, vertically centred in the well */}
      <div style={{
        position:'absolute',
        left:16,
        top:'50%',
        transform:'translateY(-50%)',
        width:24, height:24,
      }}>
        <ToastIcon kind={t.icon} token={t}/>
      </div>

      {/* Copy */}
      <div style={{flex:1, minWidth:0, display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <div style={{fontWeight:700, fontSize:14, lineHeight:'20px', color:t.fg}}>
          {title}
        </div>
        {showDesc && (
          <div style={{fontWeight:400, fontSize:14, lineHeight:'20px', color:t.sub}}>
            {description}
          </div>
        )}
      </div>

      {/* Trailing — actions or close */}
      {actions && (
        <div style={{display:'flex', gap:4, alignItems:'center', flexShrink:0}}>
          {actions}
        </div>
      )}
      {dismissable && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          onMouseEnter={()=>setHoverClose(true)}
          onMouseLeave={()=>setHoverClose(false)}
          style={{
            flexShrink:0,
            width:24, height:24,
            border:'none', background:hoverClose ? closeHover : 'transparent',
            borderRadius:4, cursor:'pointer', display:'inline-flex',
            alignItems:'center', justifyContent:'center', padding:0,
            color:closeColor, transition:'background 120ms ease',
          }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
};

// ─── Date Picker ──────────────────────────────────────────────────
// /Date-picker/Date-Range-Date-picker — single or range, with optional
// time + timezone. Spec from twigs-claude.fig (node 470:24871).
//
// Panel geometry:
//   - single month:   272w, r16, shadow, 1px rgba(0,0,0,.15) border
//   - dual month:     544w, r16, shadow
//   - header:         56h, 12·16 pad · 32×32 ghost icon buttons · 62×32 month/year solid buttons
//   - day row:        32h, 1px rgb(241,241,241) horizontal rule · Su/Mo/Tu/... 12/16 500, #575757
//   - date cell:      32×32, 14/20 500. default #848484. muted (outside-month) same.
//                     in-range: rgba(0,130,141,0.08) · selected: primary-500 bg, white
//                     today (no selection): 1px rgba(100,116,139,.4) outline
//   - month/year grid: 3-col, 77×56 ghost buttons · selected gets rgba(100,116,139,.08) fill
//   - time row:       24h, two 00:00 buttons separated by center
//   - footer:         56h, "Select" primary solid button right-aligned
//
// Simple controlled component — consumer owns value + onChange.

const DatePicker = ({
  mode = 'range',           // 'single' | 'range'
  value,                    // Date (single) | {from:Date, to:Date} (range)
  onChange,
  month,                    // uncontrolled initial visible month (Date); defaults to today
  showTime = false,
  showTimezone = false,
  showPresets = false,      // range-only — left-side preset column
  style = {},
}) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const initialMonth = month || (value && (value.from || value)) || today;

  const [view, setView] = React.useState('day'); // 'day' | 'month' | 'year'
  const [cursor, setCursor] = React.useState(() => {
    const d = initialMonth instanceof Date ? initialMonth : new Date(initialMonth);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [internalValue, setInternalValue] = React.useState(value ?? (mode === 'range' ? {from:null, to:null} : null));
  const [hoverDate, setHoverDate] = React.useState(null);

  // Keep local in sync if controlled
  React.useEffect(() => { if (value !== undefined) setInternalValue(value); }, [value]);

  const v = value !== undefined ? value : internalValue;
  const commit = (next) => {
    if (value === undefined) setInternalValue(next);
    onChange && onChange(next);
  };

  const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS_SHORT   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const sameDay = (a, b) => a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  const startOf = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };

  // Build 6-row × 7-col grid of Date objects starting from Sunday of the first-week-containing-day-1
  const buildGrid = (m) => {
    const first = new Date(m.getFullYear(), m.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      cells.push(d);
    }
    return cells;
  };

  const rangeInfo = (d) => {
    if (mode !== 'range') return {};
    const from = v && v.from;
    const to   = v && v.to;
    const hover = hoverDate;
    let start = from, end = to;
    if (from && !to && hover) {
      if (hover < from) { start = hover; end = from; } else { start = from; end = hover; }
    }
    if (!start) return {};
    const inRange = end && d > startOf(start) && d < startOf(end);
    const isStart = sameDay(d, start);
    const isEnd   = end && sameDay(d, end);
    return {inRange, isStart, isEnd};
  };

  const onPickDay = (d) => {
    if (mode === 'single') return commit(d);
    // range
    const from = v && v.from, to = v && v.to;
    if (!from || (from && to)) return commit({from:d, to:null});
    // second pick
    if (d < from) commit({from:d, to:from});
    else commit({from, to:d});
  };

  const presets = [
    {label:'Today',        range:()=>{const t=startOf(new Date()); return {from:t, to:t};}},
    {label:'Yesterday',    range:()=>{const t=startOf(new Date()); const y=new Date(t); y.setDate(y.getDate()-1); return {from:y, to:y};}},
    {label:'Last 7 days',  range:()=>{const t=startOf(new Date()); const y=new Date(t); y.setDate(y.getDate()-6); return {from:y, to:t};}},
    {label:'Last 30 days', range:()=>{const t=startOf(new Date()); const y=new Date(t); y.setDate(y.getDate()-29); return {from:y, to:t};}},
    {label:'This month',   range:()=>{const t=new Date(); const s=new Date(t.getFullYear(),t.getMonth(),1); return {from:s, to:startOf(t)};}},
    {label:'Last month',   range:()=>{const t=new Date(); const s=new Date(t.getFullYear(),t.getMonth()-1,1); const e=new Date(t.getFullYear(),t.getMonth(),0); return {from:s, to:e};}},
  ];

  // ── Sub-components ──
  const headerRow = (
    <div style={{display:'flex', alignItems:'center', padding:'12px 16px', height:56, borderBottom:'1px solid rgb(226,226,226)'}}>
      <button type="button" aria-label="Previous" onClick={()=>{
        if (view === 'day')   setCursor(new Date(cursor.getFullYear(), cursor.getMonth()-1, 1));
        if (view === 'month') setCursor(new Date(cursor.getFullYear()-1, cursor.getMonth(), 1));
        if (view === 'year')  setCursor(new Date(cursor.getFullYear()-10, cursor.getMonth(), 1));
      }} style={dpChevronStyle}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3l-5 5 5 5" stroke="rgb(87,87,87)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div style={{flex:1, display:'flex', gap:4, justifyContent:'center', alignItems:'center'}}>
        {view === 'day' && (
          <>
            <button type="button" onClick={()=>setView('month')} style={dpHeaderBtnStyle}>{MONTHS_SHORT[cursor.getMonth()]}</button>
            <button type="button" onClick={()=>setView('year')}  style={dpHeaderBtnStyle}>{cursor.getFullYear()}</button>
          </>
        )}
        {view === 'month' && (
          <button type="button" onClick={()=>setView('year')} style={dpHeaderBtnStyle}>{cursor.getFullYear()}</button>
        )}
        {view === 'year' && (
          <span style={{fontSize:14, fontWeight:700, lineHeight:'20px', color:'rgb(87,87,87)'}}>
            {Math.floor(cursor.getFullYear()/10)*10} – {Math.floor(cursor.getFullYear()/10)*10+9}
          </span>
        )}
      </div>
      <button type="button" aria-label="Next" onClick={()=>{
        if (view === 'day')   setCursor(new Date(cursor.getFullYear(), cursor.getMonth()+1, 1));
        if (view === 'month') setCursor(new Date(cursor.getFullYear()+1, cursor.getMonth(), 1));
        if (view === 'year')  setCursor(new Date(cursor.getFullYear()+10, cursor.getMonth(), 1));
      }} style={dpChevronStyle}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="rgb(87,87,87)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );

  const dayView = (
    <div style={{padding:'12px'}}>
      {/* weekday header */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(7, 32px)', gap:2, padding:'8px', justifyContent:'center',
        borderTop:'1px solid rgb(241,241,241)', borderBottom:'1px solid rgb(241,241,241)', height:32, alignItems:'center'}}>
        {DAYS_SHORT.map(d => (
          <div key={d} style={{fontFamily:'DM Sans', fontWeight:500, fontSize:12, lineHeight:'16px', color:'rgb(87,87,87)', textAlign:'center'}}>{d}</div>
        ))}
      </div>
      {/* 6 rows × 7 cols of days, 44px row height (32 cell + 12 gap) */}
      <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:12}}>
        {Array.from({length:6}).map((_, row) => (
          <div key={row} style={{display:'grid', gridTemplateColumns:'repeat(7, 32px)', gap:2, justifyContent:'center'}}>
            {buildGrid(cursor).slice(row*7, row*7+7).map((d, i) => {
              const inMonth = d.getMonth() === cursor.getMonth();
              const isToday = sameDay(d, today);
              const single  = mode === 'single' && sameDay(d, v);
              const {inRange, isStart, isEnd} = rangeInfo(d);
              const selected = single || isStart || isEnd;
              const rangeRadius = isStart ? '4px 0 0 4px' : isEnd ? '0 4px 4px 0' : 0;
              return (
                <button key={i} type="button"
                  onClick={()=>onPickDay(d)}
                  onMouseEnter={()=>setHoverDate(d)}
                  onMouseLeave={()=>setHoverDate(null)}
                  style={{
                    width:32, height:32,
                    border: isToday && !selected ? '1px solid rgba(100,116,139,0.4)' : 'none',
                    background: selected ? 'var(--ss-primary-500)'
                              : inRange  ? 'rgba(0,130,141,0.08)'
                              : 'transparent',
                    color: selected ? '#fff'
                         : inMonth   ? 'rgb(132,132,132)'
                         : 'rgba(132,132,132,0.5)',
                    fontFamily:'DM Sans', fontWeight:500, fontSize:14, lineHeight:'20px',
                    borderRadius: selected ? 4 : inRange ? rangeRadius : 4,
                    cursor:'pointer', padding:0,
                    transition:'background 120ms',
                  }}>
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const monthView = (
    <div style={{padding:'12px'}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8}}>
        {MONTHS_SHORT.map((m, i) => {
          const active = i === cursor.getMonth();
          return (
            <button key={m} type="button"
              onClick={()=>{ setCursor(new Date(cursor.getFullYear(), i, 1)); setView('day'); }}
              style={{
                height:56,
                background: active ? 'rgba(100,116,139,0.08)' : 'transparent',
                border:'none', borderRadius:8, cursor:'pointer',
                fontFamily:'DM Sans', fontWeight:500, fontSize:14, color:'rgb(78,89,108)',
              }}>{m}</button>
          );
        })}
      </div>
    </div>
  );

  const yearView = (
    <div style={{padding:'12px'}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8}}>
        {Array.from({length:12}).map((_, i) => {
          const base = Math.floor(cursor.getFullYear()/10)*10 - 1;
          const y = base + i;
          const active = y === cursor.getFullYear();
          const outside = i === 0 || i === 11;
          return (
            <button key={y} type="button"
              onClick={()=>{ setCursor(new Date(y, cursor.getMonth(), 1)); setView('month'); }}
              style={{
                height:56,
                background: active ? 'rgba(100,116,139,0.08)' : 'transparent',
                border:'none', borderRadius:8, cursor:'pointer',
                fontFamily:'DM Sans', fontWeight:500, fontSize:14,
                color: outside ? 'rgba(78,89,108,0.5)' : 'rgb(78,89,108)',
              }}>{y}</button>
          );
        })}
      </div>
    </div>
  );

  const fmt = (d) => d ? `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` : '—';
  const summary = mode === 'range'
    ? (v && v.from ? `${fmt(v.from)}${v.to ? ' – ' + fmt(v.to) : ''}` : '')
    : (v ? fmt(v) : '');

  const hasValue = mode === 'range' ? (v && v.from && v.to) : !!v;

  return (
    <div style={{display:'flex', alignItems:'flex-start', gap:0, ...style}}>
      {showPresets && mode === 'range' && (
        <div style={{
          width:140, minHeight:424, background:'rgb(255,255,255)',
          borderRadius:'16px 0 0 16px', border:'0.5px solid rgba(0,0,0,0.15)', borderRight:'none',
          boxShadow:'0px 8px 12px 0px rgba(0,0,0,0.06), 0px 2px 5px 0px rgba(0,0,0,0.06), 0px 1px 1px 0px rgba(0,0,0,0.06)',
          padding:'12px 8px', display:'flex', flexDirection:'column', gap:2,
        }}>
          {presets.map(p => (
            <button key={p.label} type="button"
              onClick={()=>{ const r = p.range(); commit(r); setCursor(new Date(r.from.getFullYear(), r.from.getMonth(), 1)); }}
              style={{
                textAlign:'left', border:'none', background:'transparent',
                padding:'8px 10px', borderRadius:6, cursor:'pointer',
                fontFamily:'DM Sans', fontSize:13, lineHeight:'20px', color:'rgb(78,89,108)',
              }}>{p.label}</button>
          ))}
        </div>
      )}

      <div style={{
        width:272, overflow:'hidden', background:'rgb(255,255,255)',
        borderRadius: showPresets ? '0 16px 16px 0' : 16,
        border:'0.5px solid rgba(0,0,0,0.15)',
        boxShadow:'0px 8px 12px 0px rgba(0,0,0,0.06), 0px 2px 5px 0px rgba(0,0,0,0.06), 0px 1px 1px 0px rgba(0,0,0,0.06)',
        display:'flex', flexDirection:'column',
      }}>
        {headerRow}

        <div style={{flex:1}}>
          {view === 'day'   && dayView}
          {view === 'month' && monthView}
          {view === 'year'  && yearView}
        </div>

        {showTime && view === 'day' && (
          <div style={{
            display:'flex', justifyContent:'center', alignItems:'center', gap:8,
            padding:'8px 12px', height:40,
          }}>
            {mode === 'range' ? (
              <>
                <span style={dpTimeBtnStyle}>00 : 00</span>
                <span style={{fontSize:12, color:'rgb(132,132,132)'}}>→</span>
                <span style={dpTimeBtnStyle}>00 : 00</span>
                {showTimezone && <span style={{...dpTimeBtnStyle, width:'auto', padding:'0 8px'}}>UTC ▾</span>}
              </>
            ) : (
              <>
                <span style={dpTimeBtnStyle}>00 : 00</span>
                {showTimezone && <span style={{...dpTimeBtnStyle, width:'auto', padding:'0 8px'}}>UTC ▾</span>}
              </>
            )}
          </div>
        )}

        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'12px 16px', height:56, borderTop:'1px solid rgb(226,226,226)',
          gap:8,
        }}>
          <span style={{fontFamily:'DM Sans', fontWeight:500, fontSize:13, lineHeight:'20px', color:'rgb(87,87,87)',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{summary}</span>
          <button type="button" disabled={!hasValue}
            style={{
              height:32, padding:'0 12px', borderRadius:8, border:'none',
              background: hasValue ? 'var(--ss-primary-500)' : 'rgba(0,130,141,0.4)',
              color:'#fff', fontFamily:'DM Sans', fontWeight:700, fontSize:14,
              cursor: hasValue ? 'pointer' : 'not-allowed', flexShrink:0,
            }}>Select</button>
        </div>
      </div>
    </div>
  );
};

const dpChevronStyle = {
  width:32, height:32, borderRadius:8, border:'none', background:'transparent',
  cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center',
  padding:0,
};
const dpHeaderBtnStyle = {
  height:32, minWidth:62, padding:'0 8px', borderRadius:8,
  background:'rgba(100,116,139,0.08)', border:'none', cursor:'pointer',
  fontFamily:'DM Sans', fontWeight:700, fontSize:14, lineHeight:'20px', color:'rgb(87,87,87)',
};
const dpTimeBtnStyle = {
  display:'inline-flex', alignItems:'center', justifyContent:'center',
  width:81, height:24, borderRadius:4, padding:'0 6px',
  background:'rgba(100,116,139,0.08)',
  fontFamily:'DM Sans', fontWeight:500, fontSize:14, lineHeight:'20px', color:'rgb(78,89,108)',
  cursor:'pointer', userSelect:'none',
};

// ─── Dialog ──────────────────────────────────────────────────────
// /Dialog — modal surface with a fixed header and scrollable body.
// Spec from twigs-claude.fig (node 479:2694 et al.)
//
// Panel sizes (w × default-h):
//   - SM: 464 × 240
//   - MD: 600 × 580
//   - LG: 980 × 800
//   - XL: 1346 × 800
// All share:
//   border-radius: 16
//   background: #fff
//   shadow: 0px -16px 24px 0px rgba(0,0,0,.08), 0px 72px 104px 0px rgba(0,0,0,.4)
//
// Header (72h):
//   padding 16·24, border-bottom 1px #E2E2E2
//   variants:
//     'heading'    : heading only (19/28 700 #2B2B2B)
//     'section'    : sub-heading (11.11/12 700 +4% #767676) + main heading (16/24 700 #2B2B2B)
//     'back'       : back-button + heading
//     'back-section': back-button + sub-heading + main heading
//   trailing close (40×40 ghost secondary) unless onClose=null
//
// Confirmation preset:
//   width 464, padding 24, heading 19/28 700 #111, body 14/20 #6A6A6A,
//   two 40h buttons (202w each, gap 12)

const Dialog = ({
  open = true,
  size = 'md',                  // 'sm' | 'md' | 'lg' | 'xl'
  headerVariant = 'heading',    // 'heading' | 'section' | 'back' | 'back-section' | 'none'
  heading,
  subHeading,
  onClose,
  onBack,
  children,
  footer,
  bodyPadding = '24px',
  overlay = true,
  onOverlayClick,
  style = {},
  bodyStyle = {},
  maxHeight,                    // override inner body max-height (for scroll)
}) => {
  if (!open) return null;

  const SIZES = { sm: 464, md: 600, lg: 980, xl: 1346 };
  const width = SIZES[size] ?? SIZES.md;

  const panel = (
    <div role="dialog" aria-modal="true"
      style={{
        width,
        maxWidth: 'calc(100vw - 32px)',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0px -16px 24px 0px rgba(0,0,0,0.08), 0px 72px 104px 0px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        ...style,
      }}>

      {headerVariant !== 'none' && (
        <div style={{
          height: 72, flexShrink: 0,
          padding: '16px 24px',
          borderBottom: '1px solid rgb(226,226,226)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {(headerVariant === 'back' || headerVariant === 'back-section') && (
            <button type="button" onClick={onBack}
              aria-label="Back"
              style={{
                width: 40, height: 40, flexShrink: 0,
                border: 'none', background: 'transparent', borderRadius: 8,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: 0, marginRight: 8,
              }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(100,116,139,.08)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 4L6.5 10L12.5 16" stroke="rgb(43,43,43)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', gap: 2}}>
            {(headerVariant === 'section' || headerVariant === 'back-section') && subHeading && (
              <div style={{
                fontFamily: 'DM Sans', fontWeight: 700, fontSize: 11.11,
                lineHeight: '12px', letterSpacing: '0.04em',
                color: 'rgb(118,118,118)', textTransform: 'uppercase',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{subHeading}</div>
            )}
            {(headerVariant === 'section' || headerVariant === 'back-section') ? (
              <div style={{
                fontFamily: 'DM Sans', fontWeight: 700, fontSize: 16, lineHeight: '24px',
                color: 'rgb(43,43,43)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{heading}</div>
            ) : (
              <div style={{
                fontFamily: 'DM Sans', fontWeight: 700, fontSize: 19, lineHeight: '28px',
                color: 'rgb(43,43,43)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{heading}</div>
            )}
          </div>

          {onClose !== null && (
            <button type="button" onClick={onClose}
              aria-label="Close"
              style={{
                width: 40, height: 40, flexShrink: 0,
                border: 'none', background: 'transparent', borderRadius: 8,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: 0,
              }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(100,116,139,.08)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="rgb(43,43,43)" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      )}

      <div style={{
        flex: 1, minHeight: 0, overflow: 'auto',
        padding: bodyPadding,
        ...bodyStyle,
        ...(maxHeight ? {maxHeight} : null),
      }}>
        {children}
      </div>

      {footer && (
        <div style={{
          flexShrink: 0, padding: '16px 24px',
          borderTop: '1px solid rgb(226,226,226)',
          display: 'flex', justifyContent: 'flex-end', gap: 12,
        }}>{footer}</div>
      )}
    </div>
  );

  if (!overlay) return panel;

  return (
    <div onClick={onOverlayClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(17,17,17,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}>
      <div onClick={e => e.stopPropagation()} style={{display: 'contents'}}>
        {panel}
      </div>
    </div>
  );
};

// ─── Confirmation Dialog (preset) ────────────────────────────────
// /Dialog/New-Conformation-Modals — compact 464w dialog with title,
// body copy, and a two-button action row.

const ConfirmDialog = ({
  open = true,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  tone = 'neutral',       // 'neutral' | 'primary' | 'danger'
  onCancel,
  onConfirm,
  overlay = true,
  style = {},
}) => {
  if (!open) return null;

  const confirmColors = {
    neutral: {bg: '#fff', color: 'rgb(43,43,43)', border: '1px solid rgb(226,226,226)', hover: 'rgb(248,248,248)'},
    primary: {bg: 'var(--ss-primary-500)', color: '#fff', border: 'none', hover: 'var(--ss-primary-600)'},
    danger:  {bg: 'var(--ss-negative-500)', color: '#fff', border: 'none', hover: 'var(--ss-negative-600)'},
  }[tone];

  const panel = (
    <div role="alertdialog" aria-modal="true"
      style={{
        width: 464,
        maxWidth: 'calc(100vw - 32px)',
        background: '#fff', borderRadius: 16,
        boxShadow: '0px -16px 24px 0px rgba(0,0,0,0.08), 0px 72px 104px 0px rgba(0,0,0,0.4)',
        padding: 24,
        display: 'flex', flexDirection: 'column', gap: 8,
        ...style,
      }}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        <div style={{
          fontFamily: 'DM Sans', fontWeight: 700, fontSize: 19, lineHeight: '28px',
          color: 'rgb(17,17,17)',
        }}>{title}</div>
        {description && (
          <div style={{
            fontFamily: 'DM Sans', fontSize: 14, lineHeight: '20px',
            color: 'rgb(106,106,106)',
          }}>{description}</div>
        )}
      </div>
      <div style={{
        marginTop: 16,
        display: 'flex', gap: 12, justifyContent: 'flex-end',
      }}>
        <button type="button" onClick={onCancel}
          style={{
            height: 40, padding: '0 16px', borderRadius: 8,
            border: '1px solid rgb(226,226,226)', background: '#fff', color: 'rgb(43,43,43)',
            fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            minWidth: 100,
          }}>{cancelLabel}</button>
        <button type="button" onClick={onConfirm}
          style={{
            height: 40, padding: '0 16px', borderRadius: 8,
            border: confirmColors.border, background: confirmColors.bg, color: confirmColors.color,
            fontFamily: 'DM Sans', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            minWidth: 100,
          }}>{confirmLabel}</button>
      </div>
    </div>
  );

  if (!overlay) return panel;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(17,17,17,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>{panel}</div>
  );
};

Object.assign(window, { Icon, Button, IconButton, Input, Checkbox, Radio, Switch, Select, Tooltip, Chip, Pill, SelectablePill, Card, Avatar, AvatarGroup, Tabs, Tab, Pagination, LoaderLine, LoaderRadial, Alert, Toast, DatePicker, Dialog, ConfirmDialog });
