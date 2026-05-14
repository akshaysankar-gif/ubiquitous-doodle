"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    redirect("/auth/signin");
  }

  return <Shell>{children}</Shell>;
}
