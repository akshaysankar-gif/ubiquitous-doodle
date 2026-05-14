"use client";

import React from "react";
import useSWR from "swr";
import { dataClient } from "@/lib/dataClient";
import { useSupport } from "@/lib/context";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import KpiCard from "@/components/ui/KpiCard";
import SentimentBar from "@/components/ui/SentimentBar";
import SectionHead from "@/components/ui/SectionHead";
import Bullet from "@/components/ui/Bullet";
import Delta from "@/components/ui/Delta";
import Pill from "@/components/ui/Pill";

export default function DashboardPage() {
  const { month } = useSupport();
  const { data: stats, error, isLoading } = useSWR(
    ["stats", month],
    () => dataClient.getStats({ month })
  );

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-xl w-full" />
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
      </div>
    </div>
  );

  if (error) return (
    <Card className="text-center p-12">
      <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
      <h3 className="text-lg font-bold">Failed to load data</h3>
      <p className="text-[#64748B]">Please try again later or check your connection.</p>
    </Card>
  );

  if (!stats) return null;

  // Sentiment distribution (mocked/mapped from stats)
  const sentimentDist = {
    calm: Math.round(stats.totalTickets * 0.4),
    annoyed: Math.round(stats.totalTickets * 0.3),
    frustrated: Math.round(stats.totalTickets * 0.2),
    furious: Math.round(stats.totalTickets * 0.1),
    total: stats.totalTickets
  };

  return (
    <div className="space-y-4">
      {/* Month Essence Header */}
      <Card 
        className="p-6 border-[#00828D]/20"
        style={{ background: 'linear-gradient(120deg, var(--ss-primary-50) 0%, #fff 60%)' }}
      >
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="max-w-[58ch]">
            <div className="flex items-center gap-2 mb-2">
              <Pill color="mint" size="sm">This month</Pill>
              <span className="text-[11.5px] text-[var(--ss-fg-muted)]">
                May 2024 · Technical Support
              </span>
            </div>
            <div className="text-[22px] font-bold tracking-tight text-[var(--ss-fg)] leading-[1.25]">
              May 2024: "Login Issues" spiked 24% — the dominant blocker for customers this month.
            </div>
            <p className="text-[12.5px] text-[var(--ss-fg-muted)] mt-2 leading-relaxed">
              {stats.totalTickets.toLocaleString()} tickets reached Technical Support. 
              Zoona AI resolved {stats.aiHandledPct.toFixed(0)}%. 
              Frustration averaged 4.2/10, led by technical bugs.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--ss-fg-muted)] uppercase tracking-wider">Sentiment mix</span>
              <span className="text-[11px] text-[var(--ss-fg-muted)] tabular">
                avg <strong className="text-[var(--ss-fg)]">4.2</strong>/10
              </span>
            </div>
            <SentimentBar distribution={sentimentDist} height={14} showLabels />
          </div>
        </div>
      </Card>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard 
          icon="Ticket" 
          label="Tickets analysed" 
          value={stats.totalTickets.toLocaleString()}
          delta={0.12}
          polarity="bad"
          accent="primary"
        />
        <KpiCard 
          icon="Bot" 
          label="Solved by Zoona AI" 
          value={`${stats.aiHandledPct.toFixed(0)}%`}
          delta={0.05}
          polarity="good"
          accent="accent"
        />
        <KpiCard 
          icon="Flame" 
          label="Avg frustration" 
          value="4.2"
          delta={0.2}
          polarity="bad"
          accent="warning"
        />
        <KpiCard 
          icon="Users" 
          label="Multi-team tickets" 
          value={stats.processedTickets.toLocaleString()}
          delta={-0.08}
          polarity="good"
          accent="negative"
        />
        <KpiCard 
          icon="Gauge" 
          label="Avg effort (h)" 
          value="1.8"
          delta={0.15}
          polarity="bad"
          accent="highlight"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Heatmap Placeholder */}
        <Card className="lg:col-span-2 p-4">
          <SectionHead 
            title="Module × Intent heatmap" 
            subtitle="Cell value = ticket count · darker = more tickets"
          />
          <div className="h-[300px] bg-[var(--ss-neutral-50)] rounded-lg flex items-center justify-center border border-dashed border-[var(--ss-border)]">
            <p className="text-[var(--ss-fg-muted)] text-sm">Heatmap restoration in progress...</p>
          </div>
        </Card>

        {/* Right Rail */}
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <SectionHead title="Top blockers" subtitle="Largest contact codes this month" />
            <div className="space-y-2.5">
              {stats.byPrimaryIntent.slice(0, 6).map((item, i) => (
                <div key={i} className="grid grid-cols-[18px_1fr_auto_auto] gap-2 items-center hover:bg-black/5 p-1 rounded transition-colors cursor-pointer">
                  <div className="text-[11px] font-bold text-[var(--ss-fg-muted)]">{i + 1}</div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-[var(--ss-fg)] truncate">{item.intent}</div>
                    <Bullet value={item.count / stats.totalTickets * 2} height={4} />
                  </div>
                  <div className="text-[12px] font-bold text-[var(--ss-fg)] tabular">{item.count}</div>
                  <Delta value={0.1} size="sm" polarity="bad" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <SectionHead title="Intent leaderboard" subtitle="What customers are writing in about" />
            <div className="space-y-2">
              {stats.byPrimaryIntent.slice(0, 5).map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_auto] gap-2 items-center">
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium text-[var(--ss-fg)] truncate">{item.intent}</div>
                    <Bullet value={item.count / stats.totalTickets * 1.5} height={4} color="#7158F5" />
                  </div>
                  <div className="text-[12px] font-semibold text-[var(--ss-fg)] text-right tabular">{item.count}</div>
                  <Delta value={-0.05} size="sm" polarity="good" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
