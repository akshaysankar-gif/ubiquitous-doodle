"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupport } from "@/lib/context";
import { Icon, Avatar, Pill, Button } from "./ui/PrototypeKit";

const NAV_SECTIONS = [
  {
    label: 'Analyse',
    items: [
      { id: 'dashboard',  icon: 'LayoutDashboard', label: 'Month dashboard', href: '/dashboard' },
      { id: 'compare',    icon: 'GitCompare',       label: 'Compare months', href: '/compare' },
      { id: 'bubbles',    icon: 'CircleDot',        label: 'Bubble explorer', href: '/bubbles' },
    ],
  },
  {
    label: 'Metric pages',
    items: [
      { id: 'blockers',   icon: 'OctagonAlert',     label: 'Customer blockers', href: '/blockers' },
      { id: 'intent',     icon: 'Tag',               label: 'Intent / Sub-intent', href: '/intent' },
      { id: 'product',    icon: 'Package',           label: 'Product hotspots', href: '/product' },
      { id: 'codes',      icon: 'ListTree',         label: 'Contact codes', href: '/codes' },
      { id: 'root',       icon: 'Sprout',            label: 'Root cause', href: '/root' },
      { id: 'frustration',icon: 'Flame',             label: 'Frustration', href: '/frustration' },
      { id: 'automation', icon: 'Bot',               label: 'Automation potential', href: '/automation' },
      { id: 'effort',     icon: 'Gauge',             label: 'Support effort', href: '/effort' },
      { id: 'signals',    icon: 'Radio',             label: 'Systemic signals', href: '/signals' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { id: 'data',     icon: 'Database',          label: 'Data & schema', href: '/data' },
      { id: 'settings', icon: 'Settings',          label: 'Settings', href: '/settings' },
    ],
  },
];

const AppSidebar = ({ active, collapsed }: any) => {
  return (
    <aside style={{
      width: collapsed ? 56 : 232, flexShrink: 0, height: '100%',
      background: '#fff', borderRight: '1px solid var(--ss-border)',
      display: 'flex', flexDirection: 'column', padding: collapsed ? '14px 6px' : '14px 12px',
      transition: 'width .2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: collapsed ? '4px 0 12px' : '4px 6px 14px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <img src="/assets/surveysparrow-mark.svg" width={26} height={26} alt="SurveySparrow" />
        {!collapsed && (
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ss-fg)', letterSpacing: '-0.01em' }}>Ticket Explorer</div>
            <div style={{ fontSize: 10, color: 'var(--ss-fg-muted)' }}>Support · Post-mortem</div>
          </div>
        )}
      </div>

      <div className="scroll-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, paddingRight: 2 }}>
        {NAV_SECTIONS.map(sec => (
          <div key={sec.label}>
            {!collapsed && (
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ss-fg-muted)', padding: '4px 10px 6px' }}>{sec.label}</div>
            )}
            {collapsed && <div style={{ height: 1, background: 'var(--ss-border)', margin: '8px 6px' }} />}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sec.items.map(it => {
                const on = active === it.href;
                return (
                  <Link key={it.id} href={it.href} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: collapsed ? '8px 0' : '7px 10px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    border: 0, borderRadius: 8, cursor: 'pointer',
                    background: on ? 'var(--ss-primary-50)' : 'transparent',
                    color: on ? 'var(--ss-primary-700)' : 'var(--ss-secondary-700)',
                    fontSize: 12.5, fontWeight: on ? 600 : 500, textDecoration: 'none',
                  }}>
                    <Icon name={it.icon} size={16} />
                    {!collapsed && <span>{it.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--ss-border)', marginTop: 8, paddingTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: collapsed ? '0' : '4px 6px' }}>
          <Avatar initials="AS" size="sm" />
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ss-fg)' }}>Akshay S.</div>
              <div style={{ fontSize: 10, color: 'var(--ss-fg-muted)' }}>Product Owner</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

const AppTopbar = ({ title, onToggleSidebar }: any) => {
  const { month, setMonth } = useSupport();
  return (
    <header style={{
      height: 60, borderBottom: '1px solid var(--ss-border)', background: '#fff',
      display: 'flex', alignItems: 'center', padding: '0 22px', gap: 12, flexShrink: 0
    }}>
      <button onClick={onToggleSidebar} style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>
        <Icon name="PanelLeft" size={18} color="var(--ss-fg-muted)" />
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ss-fg)', letterSpacing: '-0.01em' }}>{title}</div>
      </div>

      {/* Product filter */}
      <select style={{ width: 140, height: 32, borderRadius: 8, border: '1px solid var(--ss-border)', padding: '0 8px', fontSize: 12 }}>
        <option>All products</option>
      </select>

      {/* Month picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--ss-border)' }}>
        <Icon name="Calendar" size={14} color="var(--ss-fg-muted)" />
        <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ border: 0, fontSize: 13, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
          <option value="2026-04">Apr 2026</option>
          <option value="2026-03">Mar 2026</option>
        </select>
      </div>
    </header>
  );
};

export const Shell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  
  // Find title
  let title = "Dashboard";
  NAV_SECTIONS.forEach(s => s.items.forEach(i => { if (i.href === pathname) title = i.label; }));

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }} className="ss-type">
      <AppSidebar active={pathname} collapsed={collapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--ss-neutral-50)' }}>
        <AppTopbar title={title} onToggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="scroll-area" style={{ flex: 1, padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
};
