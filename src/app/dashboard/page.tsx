"use client";

import React from "react";
import useSWR from "swr";
import { dataClient } from "@/lib/dataClient";
import { useSupport } from "@/lib/context";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";

const MetricCard = ({ title, value, subValue, icon, trend }: any) => (
  <Card className="flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 rounded-lg bg-[#F8FAFB]">
        <Icon name={icon} size={20} className="text-[#00828D]" />
      </div>
      {trend && (
        <Badge variant={trend > 0 ? "success" : "danger"}>
          {trend > 0 ? "+" : ""}{trend}%
        </Badge>
      )}
    </div>
    <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">{title}</div>
    <div className="mt-1 flex items-baseline gap-2">
      <div className="text-2xl font-bold text-[#1E293B]">{value}</div>
      {subValue && <div className="text-sm font-medium text-[#94A3B8]">{subValue}</div>}
    </div>
  </Card>
);

export default function DashboardPage() {
  const { month } = useSupport();
  const { data: stats, error, isLoading } = useSWR(
    ["stats", month],
    () => dataClient.getStats({ month })
  );

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
    {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
  </div>;

  if (error) return <Card className="text-center p-12">
    <Icon name="AlertCircle" size={48} className="mx-auto text-red-500 mb-4" />
    <h3 className="text-lg font-bold">Failed to load data</h3>
    <p className="text-[#64748B]">Please try again later or check your connection.</p>
  </Card>;

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Tickets"
          value={stats.totalTickets.toLocaleString()}
          subValue={`${stats.eligibleTickets.toLocaleString()} eligible`}
          icon="Ticket"
        />
        <MetricCard
          title="Analysis Score"
          value={stats.avgScoreTotal?.toFixed(1) || "N/A"}
          subValue="/ 10.0"
          icon="Star"
          trend={5.2} // Mock trend for now
        />
        <MetricCard
          title="AI Handling"
          value={`${stats.aiHandledPct.toFixed(1)}%`}
          subValue={`${stats.aiHandledCount} tickets`}
          icon="Bot"
        />
        <MetricCard
          title="Automation Rate"
          value={`${stats.automationRate.toFixed(1)}%`}
          subValue="Fully automatable"
          icon="Zap"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Primary Intent Breakdown">
          <div className="space-y-4 mt-2">
            {stats.byPrimaryIntent.slice(0, 5).map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-[#1E293B] truncate">{item.intent || "Unknown"}</span>
                  <span className="text-[#64748B]">{item.count}</span>
                </div>
                <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00828D]"
                    style={{ width: `${(item.count / stats.totalTickets) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Severity Distribution">
          <div className="flex items-center justify-center h-[200px]">
            <div className="space-y-4 w-full">
              {stats.bySeverity.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-20 text-xs font-bold text-[#64748B] uppercase">{item.severity || "N/A"}</div>
                  <div className="flex-1 h-8 bg-[#F8FAFB] rounded-lg overflow-hidden relative">
                    <div
                      className="h-full bg-[#00828D] opacity-20"
                      style={{ width: `${(item.count / stats.totalTickets) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-3 text-sm font-bold text-[#1E293B]">
                      {item.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
