"use client";

import React from "react";
import useSWR from "swr";
import { dataClient } from "@/lib/dataClient";
import { useSupport } from "@/lib/context";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const TicketDrawer = () => {
  const { drawer, closeDrawer } = useSupport();
  const { ticketId, isOpen } = drawer;

  const { data: ticket, isLoading, error } = useSWR(
    ticketId ? `/api/tickets/${ticketId}` : null,
    () => (ticketId ? dataClient.getTicket(ticketId) : null)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={closeDrawer}
      />
      
      <div
        style={{ width: "600px" }}
        className="relative h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#00828D]">
              <Icon name="Ticket" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1E293B]">Ticket #{ticket?.id}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="neutral">{ticket?.status}</Badge>
                <span className="text-xs text-[#94A3B8]">via {ticket?.channel}</span>
              </div>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="rounded-lg p-2 text-[#64748B] hover:bg-[#F8FAFB] hover:text-[#1E293B]"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-3/4 bg-[#F1F5F9] rounded" />
              <div className="h-32 w-full bg-[#F1F5F9] rounded" />
              <div className="h-4 w-1/2 bg-[#F1F5F9] rounded" />
            </div>
          )}

          {ticket && (
            <>
              <section>
                <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider mb-4">Subject & Conversation</h3>
                <div className="p-4 rounded-xl bg-[#F8FAFB] border border-[#E2E8F0]">
                  <h4 className="font-bold text-[#1E293B] mb-3">{ticket.subject}</h4>
                  <div className="whitespace-pre-wrap text-sm text-[#475569] leading-relaxed">
                    {ticket.messagesRaw}
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider mb-4">AI Classification</h3>
                  <div className="space-y-3">
                    <DetailItem label="Primary Intent" value={ticket.primaryIntent} />
                    <DetailItem label="Sub-Intent" value={ticket.subIntent} />
                    <DetailItem label="Severity" value={ticket.severity} />
                    <DetailItem label="Root Cause" value={ticket.rootCauseType} />
                    <DetailItem label="Product Area" value={ticket.productArea} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider mb-4">Quality Scores</h3>
                  <div className="space-y-3">
                    <ScoreItem label="Resolution" score={ticket.scoreResolutionQuality} />
                    <ScoreItem label="Clarity" score={ticket.scoreCommunicationClarity} />
                    <ScoreItem label="Judgment" score={ticket.scoreEscalationJudgment} />
                    <ScoreItem label="Accuracy" score={ticket.scoreCategorizationAccuracy} />
                    <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                      <span className="text-sm font-bold text-[#1E293B]">Total Score</span>
                      <span className="text-lg font-bold text-[#00828D]">{ticket.scoreTotal?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider mb-4">Insights</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InsightCard label="Frustration" value={ticket.frustrationLevel} />
                  <InsightCard label="Automation" value={ticket.automationLevel} />
                  <InsightCard label="Effort" value={ticket.supportEffort} />
                  <InsightCard label="Systemic" value={ticket.systemicSignal} />
                </div>
              </section>
            </>
          )}
        </div>

        <div className="border-t border-[#E2E8F0] p-4 bg-[#F8FAFB] flex justify-end gap-3">
          <Button variant="outline" onClick={closeDrawer}>Close</Button>
          <Button variant="primary">Edit Analysis</Button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-bold text-[#94A3B8] uppercase">{label}</span>
    <span className="text-sm font-medium text-[#1E293B]">{value || "Pending..."}</span>
  </div>
);

const ScoreItem = ({ label, score }: { label: string; score: any }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-[#64748B]">{label}</span>
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 bg-[#F1F5F9] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#00828D]"
          style={{ width: `${(score || 0) * 10}%` }}
        />
      </div>
      <span className="text-xs font-bold text-[#1E293B]">{score?.toFixed(1) || "0.0"}</span>
    </div>
  </div>
);

const InsightCard = ({ label, value }: { label: string; value: any }) => (
  <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white">
    <div className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1">{label}</div>
    <div className="text-sm font-bold text-[#1E293B]">{value || "N/A"}</div>
  </div>
);
