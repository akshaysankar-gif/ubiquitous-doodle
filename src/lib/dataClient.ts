import { Ticket, TicketBatch, AnalysisStatus, BatchStatus } from "@prisma/client";

export interface StatsResponse {
  totalTickets: number;
  eligibleTickets: number;
  processedTickets: number;
  aiHandledCount: number;
  aiHandledPct: number;
  avgScoreTotal: number | null;
  automationRate: number;
  highFrustrationRate: number;
  byDayOfWeek: { day: number; count: number }[];
  byHourOfDay: { hour: number; count: number }[];
  byPrimaryIntent: { intent: string | null; count: number }[];
  bySeverity: { severity: string | null; count: number }[];
  byFrustrationLevel: { level: string | null; count: number }[];
  byRootCauseType: { type: string | null; count: number }[];
  bySystemicSignal: { signal: string | null; count: number }[];
  byBrand: { brand: string; count: number }[];
  byChannel: { channel: string; count: number }[];
  byModule: { module: string | null; count: number }[];
  monthOverMonth: { month: string; count: number; avgScore: number | null }[];
}

export interface TicketsResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type NavId =
  | "dashboard"
  | "compare"
  | "bubbles"
  | "blockers"
  | "intent"
  | "product"
  | "codes"
  | "root"
  | "frustration"
  | "automation"
  | "effort"
  | "signals"
  | "aivshuman"
  | "coaching"
  | "upsell"
  | "data"
  | "settings";

export interface Tweaks {
  accentColor: string;
  density: "compact" | "normal" | "spacious";
  sidebarCollapsed: boolean;
}

export interface DrawerState {
  isOpen: boolean;
  ticketId: string | null;
}

export interface MonthOption {
  label: string;
  value: string;
}

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    try {
      (error as any).info = await res.json();
    } catch (e) {
      (error as any).info = { text: await res.text() };
    }
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
}

export const dataClient = {
  getStats: (params: { month?: string; brand?: string; channel?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetcher<StatsResponse>(`/api/stats?${query}`);
  },
  getTickets: (params: {
    page?: number;
    pageSize?: number;
    batchId?: string;
    createdMonth?: string;
    brand?: string;
    team?: string;
    severity?: string;
    frustrationLevel?: string;
    assignee?: string;
    analysisStatus?: string;
    channel?: string;
    isAIHandled?: boolean;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetcher<TicketsResponse>(`/api/tickets?${query}`);
  },
  getTicket: (id: string) => fetcher<Ticket>(`/api/tickets/${id}`),
  updateTicket: (id: string, data: Partial<Ticket>) =>
    fetcher<Ticket>(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  getBatches: () => fetcher<TicketBatch[]>("/api/batches"),
  getBatch: (id: string) => fetcher<TicketBatch & { statusCounts: Record<string, number> }>(`/api/batches/${id}`),
  uploadFile: (formData: FormData) =>
    fetcher<{ batchId: string; rowCount: number; skippedCount: number; eligibleCount: number }>(
      "/api/upload",
      {
        method: "POST",
        body: formData,
      }
    ),
  analyzeBatch: (batchId: string) =>
    fetcher<{ started: boolean; batchId: string }>(`/api/analyze/${batchId}`, {
      method: "POST",
    }),
};
