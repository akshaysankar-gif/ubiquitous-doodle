"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { useSupport } from "@/lib/context";
import { Icon, Button } from "./ui/PrototypeKit";
import { MONTHS } from "@/lib/mockData";
import { usePathname } from "next/navigation";

// Tweak to IconButton
const IconButton = ({ icon, onClick }: any) => (
  <button onClick={onClick} style={{ border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', padding: 4 }}>
    <Icon name={icon} size={18} color="var(--ss-fg-muted)" />
  </button>
);

// Switch Toggle
const Switch = ({ checked, onChange }: any) => (
  <div onClick={() => onChange(!checked)} style={{
    width: 28, height: 16, borderRadius: 99, background: checked ? 'var(--ss-primary-500)' : 'var(--ss-neutral-300)',
    position: 'relative', cursor: 'pointer', transition: 'background .2s'
  }}>
    <div style={{
      width: 12, height: 12, borderRadius: '50%', background: '#fff',
      position: 'absolute', top: 2, left: checked ? 14 : 2, transition: 'left .2s'
    }} />
  </div>
);

const AppTopbar = ({ title, subtitle, onToggleSidebar, actions }: any) => {
  const { month, setMonth, compareMode, setCompareMode, compareWith, setCompareWith, productFilter, setProductFilter } = useSupport();

  // If month is empty string (initial state), set it to default month
  React.useEffect(() => {
    if (!month && MONTHS.length > 0) {
      setMonth(MONTHS[MONTHS.length - 2].key);
      setCompareWith(MONTHS[MONTHS.length - 3].key);
    }
  }, [month, setMonth, setCompareWith]);

  return (
    <header style={{
      height: 60, borderBottom: '1px solid var(--ss-border)', background: '#fff',
      display: 'flex', alignItems: 'center', padding: '0 22px', gap: 12, flexShrink: 0
    }}>
      <IconButton icon="PanelLeft" onClick={onToggleSidebar} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ss-fg)', letterSpacing: '-0.01em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11.5, color: 'var(--ss-fg-muted)', marginTop: 1 }}>{subtitle}</div>}
      </div>

      {/* Product filter */}
      <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} style={{ width: 160, height: 28, borderRadius: 8, border: '1px solid var(--ss-border)', padding: '0 8px', fontSize: 13, background: '#fff' }}>
        <option value="all">All products</option>
        <option value="SurveySparrow">SurveySparrow</option>
        <option value="ThriveSparrow">ThriveSparrow</option>
        <option value="SparrowDesk">SparrowDesk</option>
      </select>

      {/* Month picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderRadius: 8, border: '1px solid var(--ss-border)', background: '#fff' }}>
        <Icon name="Calendar" size={14} color="var(--ss-fg-muted)" />
        <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ border: 0, background: 'transparent', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--ss-fg)', outline: 'none', cursor: 'pointer' }}>
          {MONTHS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>
      </div>

      {/* Compare toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 8px',
        borderRadius: 8, border: '1px solid var(--ss-border)', background: compareMode ? 'var(--ss-primary-50)' : '#fff'
      }}>
        <Switch checked={compareMode} onChange={setCompareMode} />
        <span style={{ fontSize: 12, fontWeight: 600, color: compareMode ? 'var(--ss-primary-700)' : 'var(--ss-fg)' }}>Compare to</span>
        <select disabled={!compareMode} value={compareWith} onChange={(e) => setCompareWith(e.target.value)}
          style={{ border: 0, background: 'transparent', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: 'var(--ss-fg)', outline: 'none', cursor: compareMode ? 'pointer' : 'not-allowed', opacity: compareMode ? 1 : 0.5 }}>
          {MONTHS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
        </select>
      </div>

      {actions && <div style={{ display: 'flex', gap: 8, marginLeft: 4 }}>{actions}</div>}
    </header>
  );
};

export const Shell = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { month } = useSupport();

  // Derive title from pathname
  const titleMap: any = {
    '/dashboard': ['Month dashboard', 'Essence of the month'],
    '/compare': ['Compare months', 'Side-by-side with delta badges'],
    '/bubbles': ['Bubble explorer', 'Contact codes plotted across encodings'],
    '/blockers': ['Customer blockers', 'Where customers are getting stuck'],
    '/intent': ['Intent / Sub-intent', 'What jobs people are trying to do'],
    '/product': ['Product hotspots', 'Where the product creates support load'],
    '/codes': ['Contact codes', 'Trending up / trending down'],
    '/root': ['Root cause', 'Why these tickets exist'],
    '/frustration': ['Frustration', 'Where customers wrote in hot'],
    '/automation': ['Automation potential', 'What Zoona AI could handle'],
    '/effort': ['Support effort', 'Time spent + multi-team work'],
    '/signals': ['Systemic signals', 'The story buried in the data'],
    '/ai-vs-human': ['AI vs Human', 'Zoona AI performance vs human agents'],
    '/coaching': ['Coaching', 'Per-agent insights for 1:1s'],
    '/upsell': ['Upsell signals', 'Cross-sell + expansion leads'],
    '/data': ['Data & schema', 'How the sheet is mapped'],
    '/settings': ['Settings', 'Workspace preferences'],
  };

  const [title, subtitleBase] = titleMap[pathname] || ['Overview', ''];
  const mLabel = MONTHS.find(m => m.key === month)?.label || '';
  const subtitle = `${subtitleBase}${subtitleBase ? ' · ' : ''}${mLabel}`;

  const actions = pathname === '/dashboard' ? (
    <Button size="sm" variant="outline" style={{ color: 'var(--ss-secondary-700)', borderColor: 'var(--ss-border-strong)' }}>
      <Icon name="Download" size={14} /> Export brief
    </Button>
  ) : null;

  return (
    <>
      <Sidebar collapsed={collapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--ss-neutral-50)' }}>
        <AppTopbar title={title} subtitle={subtitle} onToggleSidebar={() => setCollapsed(!collapsed)} actions={actions} />
        <main className="scroll-area" style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </>
  );
};
