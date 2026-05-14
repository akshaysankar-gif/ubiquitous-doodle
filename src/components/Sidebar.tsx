"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Pill, Avatar } from "./ui/PrototypeKit";

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
    label: 'Future modules',
    items: [
      { id: 'aivshuman', icon: 'Split',             label: 'AI vs Human', href: '/ai-vs-human', pill: { color: 'purple', text: 'Preview' } },
      { id: 'coaching',  icon: 'GraduationCap',    label: 'Coaching', href: '/coaching', pill: { color: 'purple', text: 'Preview' } },
      { id: 'upsell',    icon: 'Sparkles',          label: 'Upsell signals', href: '/upsell', pill: { color: 'purple', text: 'Preview' } },
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

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const pathname = usePathname();

  const Item = ({ it }: any) => {
    const on = pathname === it.href;
    const [h, setH] = React.useState(false);
    return (
      <Link href={it.href}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        title={collapsed ? it.label : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          padding: collapsed ? '8px 0' : '7px 10px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          border: 0, borderRadius: 8, cursor: 'pointer',
          background: on ? 'var(--ss-primary-50)' : (h ? 'rgba(0,0,0,.03)' : 'transparent'),
          color: on ? 'var(--ss-primary-700)' : 'var(--ss-secondary-700)',
          fontSize: 12.5, fontWeight: on ? 600 : 500,
          textDecoration: 'none',
          textAlign: 'left', transition: 'all .15s',
        }}>
        <Icon name={it.icon} size={16} />
        {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>}
        {!collapsed && it.pill && <Pill size="sm" color={it.pill.color} leading={false}>{it.pill.text}</Pill>}
      </Link>
    );
  };

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
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--ss-fg-muted)', padding: '4px 10px 6px'
              }}>{sec.label}</div>
            )}
            {collapsed && <div style={{ height: 1, background: 'var(--ss-border)', margin: '8px 6px' }} />}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sec.items.map(it => <Item key={it.id} it={it} />)}
            </nav>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--ss-border)', marginTop: 8, paddingTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: collapsed ? '0' : '4px 6px' }}>
          <Avatar size="sm" initials="JS" />
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ss-fg)' }}>Justin S.</div>
              <div style={{ fontSize: 10, color: 'var(--ss-fg-muted)' }}>Support analyst</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
