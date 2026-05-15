import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

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
      <body style={{ 
        margin: 0, 
        height: '100vh', 
        fontFamily: 'var(--ss-font-body)', 
        background: 'var(--ss-neutral-50)',
        color: 'var(--ss-fg)',
        overflow: 'hidden'
      }}>
        <Providers>
          <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
