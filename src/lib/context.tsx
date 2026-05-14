"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { NavId, Tweaks, DrawerState, MonthOption } from "./dataClient";

interface SupportContextType {
  nav: NavId;
  setNav: (nav: NavId) => void;
  month: string;
  setMonth: (month: string) => void;
  compareMode: boolean;
  setCompareMode: (mode: boolean) => void;
  compareWith: string;
  setCompareWith: (month: string) => void;
  productFilter: string;
  setProductFilter: (filter: string) => void;
  tweaks: Tweaks;
  updateTweaks: (tweaks: Partial<Tweaks>) => void;
  drawer: DrawerState;
  openDrawer: (ticketId: string) => void;
  closeDrawer: () => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nav, setNav] = useState<NavId>("dashboard");
  const [month, setMonth] = useState<string>("");
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareWith, setCompareWith] = useState<string>("");
  const [productFilter, setProductFilter] = useState<string>("All Products");
  const [tweaks, setTweaks] = useState<Tweaks>({
    accentColor: "#00828D",
    density: "normal",
    sidebarCollapsed: false,
  });
  const [drawer, setDrawer] = useState<DrawerState>({
    isOpen: false,
    ticketId: null,
  });

  const updateTweaks = (newTweaks: Partial<Tweaks>) => {
    setTweaks((prev) => ({ ...prev, ...newTweaks }));
  };

  const openDrawer = (ticketId: string) => {
    setDrawer({ isOpen: true, ticketId });
  };

  const closeDrawer = () => {
    setDrawer({ isOpen: false, ticketId: null });
  };

  return (
    <SupportContext.Provider
      value={{
        nav,
        setNav,
        month,
        setMonth,
        compareMode,
        setCompareMode,
        compareWith,
        setCompareWith,
        productFilter,
        setProductFilter,
        tweaks,
        updateTweaks,
        drawer,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error("useSupport must be used within a SupportProvider");
  }
  return context;
};
