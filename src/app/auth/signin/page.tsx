"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFB] p-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00828D] text-white">
            <Icon name="Activity" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Ticket Intelligence</h1>
          <p className="mt-2 text-[#64748B]">Sign in to your account to continue</p>
        </div>

        <Card className="shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@surveysparrow.com"
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#00828D]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-[#00828D]"
                required
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
        </Card>

        <p className="mt-8 text-center text-xs text-[#94A3B8]">
          &copy; 2026 Ticket Intelligence. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
