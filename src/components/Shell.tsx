"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSupport } from "@/lib/context";
import Icon from "@/components/ui/Icon";
import Pill from "@/components/ui/Pill";

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

const SidebarItem = ({ item, collapsed }: { item: any; collapsed: boolean }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-[10px] w-full transition-all duration-150 rounded-lg ${
        collapsed ? 'justify-center py-2' : 'px-[10px] py-[7px] justify-start'
      } ${
        isActive 
          ? 'bg-[var(--ss-primary-50)] text-[var(--ss-primary-700)] font-semibold' 
          : 'text-[var(--ss-secondary-700)] font-medium hover:bg-black/5'
      }`}
      style={{ fontSize: '12.5px' }}
    >
      <Icon name={item.icon} size={16} />
      {!collapsed && (
        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
          {item.label}
        </span>
      )}
      {!collapsed && item.pill && (
        <Pill color={item.pill.color as any} size="sm">{item.pill.text}</Pill>
      )}
    </Link>
  );
};

const AppSidebar = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <aside 
      className="flex flex-col h-full bg-white border-r border-[var(--ss-border)] transition-[width] duration-200"
      style={{ width: collapsed ? '56px' : '232px', flexShrink: 0 }}
    >
      <div className={`flex items-center gap-2 ${collapsed ? 'justify-center py-4 px-0' : 'px-[18px] py-4'}`}>
        <div className="w-7 h-7 bg-[var(--ss-primary-500)] rounded-lg flex items-center justify-center text-white flex-shrink-0">
          <Icon name="Activity" size={16} />
        </div>
        {!collapsed && (
          <div className="leading-[1.1]">
            <div className="text-[13px] font-bold text-[var(--ss-fg)] tracking-[-0.01em]">Ticket Explorer</div>
            <div className="text-[10px] text-[var(--ss-fg-muted)]">Support · Post-mortem</div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scroll-area px-[6px] py-2 space-y-4">
        {NAV_SECTIONS.map((sec) => (
          <div key={sec.label} className="space-y-1">
            {!collapsed && (sec.label !== 'Analyse') && (
              <div className="text-[9px] font-bold tracking-[0.08em] uppercase text-[var(--ss-fg-muted)] px-[10px] py-[4px]">
                {sec.label}
              </div>
            )}
            {collapsed && (sec.label !== 'Analyse') && (
              <div className="h-px bg-[var(--ss-border)] mx-1.5 my-2" />
            )}
            <nav className="flex flex-col gap-[2px]">
              {sec.items.map((it) => (
                <SidebarItem key={it.id} item={it} collapsed={collapsed} />
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--ss-border)] mt-2 p-[10px]">
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : 'px-1.5'}`}>
          <div className="w-8 h-8 rounded-full bg-[var(--ss-secondary-100)] flex items-center justify-center text-[var(--ss-fg)] font-bold text-xs">
            AS
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-[var(--ss-fg)] truncate">Akshay S.</div>
              <div className="text-[10px] text-[var(--ss-fg-muted)] truncate">Product Owner</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

const AppTopbar = ({ onToggleSidebar, collapsed }: { onToggleSidebar: () => void; collapsed: boolean }) => {
  const { month, setMonth } = useSupport();
  const pathname = usePathname();
  
  // Find current page label
  let title = "Dashboard";
  NAV_SECTIONS.forEach(sec => {
    const it = sec.items.find(i => i.href === pathname);
    if (it) title = it.label;
  });

  return (
    <header className="h-[60px] border-b border-[var(--ss-border)] bg-white flex items-center px-[22px] gap-3 flex-shrink-0">
      <button 
        onClick={onToggleSidebar}
        className="p-1.5 rounded-md hover:bg-black/5 text-[var(--ss-secondary-700)] transition-colors"
      >
        <Icon name={collapsed ? "PanelLeftOpen" : "PanelLeft"} size={18} />
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="text-[15.5px] font-bold text-[var(--ss-fg)] tracking-[-0.01em]">{title}</div>
      </div>

      {/* Product Filter */}
      <div className="w-40 h-8 px-2 border border-[var(--ss-border)] rounded-lg bg-white flex items-center">
        <select className="w-full text-xs font-semibold text-[var(--ss-fg)] outline-none bg-transparent cursor-pointer">
          <option>All products</option>
          <option>SurveySparrow</option>
          <option>ThriveSparrow</option>
          <option>SparrowDesk</option>
        </select>
      </div>

      {/* Month Picker */}
      <div className="flex items-center gap-1.5 px-2 h-8 border border-[var(--ss-border)] rounded-lg bg-white">
        <Icon name="Calendar" size={14} className="text-[var(--ss-fg-muted)]" />
        <select 
          value={month} 
          onChange={(e) => setMonth(e.target.value)}
          className="text-xs font-semibold text-[var(--ss-fg)] outline-none bg-transparent cursor-pointer"
        >
          <option value="2024-05">May 2024</option>
          <option value="2024-04">Apr 2024</option>
          <option value="2024-03">Mar 2024</option>
        </select>
      </div>
    </header>
  );
};

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tweaks, updateTweaks } = useSupport();
  const collapsed = tweaks.sidebarCollapsed;

  const toggleSidebar = () => {
    updateTweaks({ sidebarCollapsed: !collapsed });
  };

  return (
    <div className="flex h-screen overflow-hidden ss-type">
      <AppSidebar collapsed={collapsed} />
      <div className="flex flex-1 flex-col overflow-hidden bg-[var(--ss-bg-subtle)]">
        <AppTopbar onToggleSidebar={toggleSidebar} collapsed={collapsed} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
