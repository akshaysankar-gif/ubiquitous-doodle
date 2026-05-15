import { AI_AGENT_ASSIGNEE, ELIGIBLE_TEAM, SKIP_BRANDS } from "./constants";

export interface RawTicketData {
  id: string;
  status: string;
  assignee: string;
  subject: string;
  brand: string;
  source: string;
  channel: string;
  team: string;
  issueType: string;
  category?: string;
  createdAt: string;
  previousStatus?: string;
  messagesRaw: string;
}

export function parseTicket(raw: RawTicketData) {
  // Brand splitting & skip brands
  let brand = raw.brand || "Other";
  let source = raw.source || "Other";

  if (brand === "SurveySparrow" || brand === "SurveySparrow Website") {
    brand = "SurveySparrow";
    source = "Website";
  } else if (brand === "ThriveSparrow" || brand === "ThriveSparrow Website") {
    brand = "ThriveSparrow";
    source = "Website";
  } else if (brand === "SparrowDesk") {
    brand = "SparrowDesk";
    source = "Website";
  } else if (brand === "SurveySparrow Product") {
    brand = "SurveySparrow";
    source = "Product";
  } else if (brand === "ThriveSparrow Product") {
    brand = "ThriveSparrow";
    source = "Product";
  }

  if (SKIP_BRANDS.includes(brand)) {
    return null;
  }

  // Channel mapping
  const channel = raw.channel === "Mail" ? "Ticket" : (raw.channel || "Unknown");

  // Archive logic
  const isArchived = raw.status === "Archived" || raw.previousStatus === "Archived";

  // Category split
  let moduleL1 = null;
  let areaL2 = null;
  let subareaL3 = null;
  if (raw.category && raw.category !== "undefined" && raw.category !== "null") {
    const parts = raw.category.split("::");
    moduleL1 = parts[0]?.trim() || null;
    areaL2 = parts[1]?.trim() || null;
    subareaL3 = parts[2]?.trim() || null;
  }

  // Date parsing with safety
  let createdAt: Date;
  try {
    createdAt = new Date(raw.createdAt);
    if (isNaN(createdAt.getTime())) {
      createdAt = new Date();
    }
  } catch (e) {
    createdAt = new Date();
  }

  const createdDate = createdAt.toISOString().split("T")[0];
  const createdMonth = createdDate.substring(0, 7);
  const hourOfDay = createdAt.getUTCHours();
  const dayOfWeek = createdAt.getUTCDay();

  // Flags
  const isAIHandled = raw.assignee === AI_AGENT_ASSIGNEE;
  const channelLower = channel.toLowerCase();
  const isChat = channelLower.includes("chat") || channelLower.includes("messaging");
  const isReopened = (raw.previousStatus === "Resolved" || raw.previousStatus === "Closed") && raw.status === "Open";

  // Analysis eligibility
  const team = (raw.team || "").replace(/'/g, "");
  const messagesRaw = raw.messagesRaw || "";
  const isEligible = team.includes(ELIGIBLE_TEAM) && !isArchived && messagesRaw.trim().length > 0;
  const analysisStatus = isEligible ? "PENDING" : "SKIPPED";

  return {
    id: raw.id,
    status: raw.status || "Unknown",
    assignee: raw.assignee || "Unassigned",
    subject: raw.subject || "(No Subject)",
    brand,
    source,
    channel,
    team,
    issueType: raw.issueType || "Other",
    moduleL1,
    areaL2,
    subareaL3,
    createdAt,
    createdDate,
    createdMonth,
    hourOfDay,
    dayOfWeek,
    previousStatus: raw.previousStatus || null,
    messagesRaw: messagesRaw,
    isArchived,
    isAIHandled,
    isReopened,
    isChat,
    analysisStatus,
  };
}
