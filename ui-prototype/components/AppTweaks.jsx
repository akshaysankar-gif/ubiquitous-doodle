// App-level Tweaks panel — exposes density, accent color, KPI strip
// variants, and whether to show the AI module group.
//
// Components consume tweaks via `window.__tweaks` (a React context-free
// shim) which is read in app.jsx and threaded down via props.

const AppTweaks = ({tweaks, setTweak}) => {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme">
        <TweakRadio label="Density" value={tweaks.density} options={[
          {value:'comfy', label:'Comfy'},
          {value:'compact', label:'Compact'},
        ]} onChange={(v)=>setTweak('density', v)}/>
        <TweakColor label="Accent" value={tweaks.accent} options={['#00828D','#7158F5','#1F8A5B','#E1A23B','#E96A3E']}
          onChange={(v)=>setTweak('accent', v)}/>
      </TweakSection>

      <TweakSection label="Dashboard">
        <TweakRadio label="Heatmap default" value={tweaks.heatmapMode} options={[
          {value:'count', label:'Volume'},
          {value:'frustration', label:'Frustration'},
        ]} onChange={(v)=>setTweak('heatmapMode', v)}/>
        <TweakSelect label="Bubble encoding" value={tweaks.bubbleEncoding} options={[
          {value:'volume-frustration', label:'Volume × Frustration'},
          {value:'volume-automation',  label:'Volume × Automation'},
          {value:'growth-volume',      label:'Growth × Volume'},
        ]} onChange={(v)=>setTweak('bubbleEncoding', v)}/>
        <TweakToggle label="Show AI summary in drawer" value={tweaks.aiSummary}
          onChange={(v)=>setTweak('aiSummary', v)}/>
      </TweakSection>

      <TweakSection label="Navigation">
        <TweakToggle label="Show 'Future modules' nav group" value={tweaks.showFuture}
          onChange={(v)=>setTweak('showFuture', v)}/>
        <TweakToggle label="Collapsed sidebar" value={tweaks.sidebarCollapsed}
          onChange={(v)=>setTweak('sidebarCollapsed', v)}/>
      </TweakSection>
    </TweaksPanel>
  );
};

Object.assign(window, { AppTweaks });
