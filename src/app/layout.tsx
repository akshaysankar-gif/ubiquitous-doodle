import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { SupportProvider } from "@/lib/context";
import { Shell } from "@/components/Shell";
import "./globals.css";

import { TicketDrawer } from "@/components/TicketDrawer";

export const metadata: Metadata = {
  title: "Ticket Intelligence",
  description: "Support ticket analysis tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SupportProvider>
            {children}
            <TicketDrawer />
          </SupportProvider>
        </Providers>
      </body>
    </html>
  );
}
