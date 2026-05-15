"use client";

import { SupportProvider } from "@/lib/context";
import { TicketDrawer } from "./TicketDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupportProvider>
      {children}
      <TicketDrawer />
    </SupportProvider>
  );
}
