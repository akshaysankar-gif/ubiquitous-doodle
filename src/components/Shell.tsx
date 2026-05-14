"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useSupport } from "@/lib/context";
import Icon from "@/components/ui/Icon";
import { NavId } from "@/lib/dataClient";

interface NavItem {
  id: NavId;
  label: string;
  icon: any;
  href: string;
  category?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" },
  { id: "compare", label: "Compare", icon: "ArrowLeftRight", href: "/compare" },
  { category: "Exploration", id: "bubbles", label: "Bubbles", icon: "CircleDot", href: "/bubbles" },
  { id: "blockers", label: "Blockers", icon: "Ban", href: "/blockers" },
  { category: "Deep Dives", id: "intent", label: "Intent", icon: "Target", href: "/intent" },
  { id: "product", label: "Product Area", icon: "Box", href: "/product" },
  { id: "codes", label: "Root Cause", icon: "Hash", href: "/codes" },
  { id: "root", label: "Root Explorer", icon: "Search", href: "/root" },
  { category: "Customer", id: "frustration", label: "Frustration", icon: "Frown", href: "/frustration" },
  { id: "automation", label: "Automation", icon: "Zap", href: "/automation" },
  { id: "effort", label: "Effort", icon: "Clock", href: "/effort" },
  { id: "signals", label: "Signals", icon: "Radio", href: "/signals" },
  { category: "Performance", id: "aivshuman", label: "AI vs Human", icon: "Bot", href: "/ai-vs-human" },
  { id: "coaching", label: "Coaching", icon: "UserCheck", href: "/coaching" },
  { id: "upsell", label: "Upsell", icon: "TrendingUp", href: "/upsell" },
  { category: "System", id: "data", label: "Data Admin", icon: "Database", href: "/data" },
  { id: "settings", label: "Settings", icon: "Settings", href: "/settings" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { tweaks, updateTweaks } = useSupport();
  const { data: session } = useSession();
  const collapsed = tweaks.sidebarCollapsed;

  return (
    <aside
      style={{
        width: collapsed ? "64px" : "232px",
        transition: "width 0.2s ease",
        backgroundColor: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border-color)",
      }}
      className="flex h-screen flex-col overflow-hidden"
    >
      <div className="flex h-[60px] items-center px-4">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00828D] text-white"
          style={{ flexShrink: 0 }}
        >
          <Icon name="Activity" size={18} />
        </div>
        {!collapsed && (
          <span className="ml-3 font-bold text-[#1E293B]">Ticket Intelligence</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        {NAV_ITEMS.map((item, idx) => {
          const isActive = pathname.startsWith(item.href);
          const showCategory = item.category && !collapsed;

          return (
            <React.Fragment key={item.id}>
              {showCategory && (
                <div className="mb-1 mt-4 px-3 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  {item.category}
                </div>
              )}
              <Link
                href={item.href}
                className={`group flex items-center rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-[#F1F5F9] text-[#00828D]"
                    : "text-[#64748B] hover:bg-[#F8FAFB] hover:text-[#1E293B]"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  className={isActive ? "text-[#00828D]" : "text-[#94A3B8] group-hover:text-[#64748B]"}
                />
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="border-t border-[#E2E8F0] p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#1E293B] font-bold text-xs">
            {session?.user?.name?.[0] || "U"}
          </div>
          {!collapsed && (
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="truncate text-sm font-bold text-[#1E293B]">{session?.user?.name}</div>
              <button
                onClick={() => signOut()}
                className="text-xs font-medium text-[#EF4444] hover:underline"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

const Topbar = () => {
  const { month, setMonth, tweaks, updateTweaks } = useSupport();
  
  return (
    <header
      className="flex h-[60px] items-center justify-between border-b border-[#E2E8F0] bg-white px-6"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => updateTweaks({ sidebarCollapsed: !tweaks.sidebarCollapsed })}
          className="text-[#64748B] hover:text-[#1E293B]"
        >
          <Icon name={tweaks.sidebarCollapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Month picker placeholder - will be dynamic later */}
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFB] px-3 py-1.5 text-sm font-medium text-[#1E293B] outline-none"
        >
          <option value="">All Months</option>
          {/* This should be populated from batches API */}
        </select>
      </div>
    </header>
  );
};

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFB]">
          {children}
        </main>
      </div>
    </div>
  );
};
