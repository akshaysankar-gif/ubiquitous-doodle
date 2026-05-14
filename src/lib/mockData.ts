// Ported from ui-prototype/data.js
// Mock support-ticket dataset for SurveySparrow / ThriveSparrow / SparrowDesk.

export const PRODUCTS = ['SurveySparrow', 'ThriveSparrow', 'SparrowDesk'];
export const SOURCES = ['Website', 'Product'];
export const CHANNELS = ['Ticket', 'Chat', 'Phone', 'Social'];
export const TEAMS = ['Technical Support', 'Customer Success', 'Billing', 'Onboarding'];
export const STATUSES = ['Resolved', 'Pending', 'Open', 'Archived'];
export const ISSUE_TYPES = ['Question', 'Bug', 'Feature request', 'Incident', 'Complaint'];

export const MONTHS = [
  { key: '2025-11', label: 'Nov 2025', short: 'Nov' },
  { key: '2025-12', label: 'Dec 2025', short: 'Dec' },
  { key: '2026-01', label: 'Jan 2026', short: 'Jan' },
  { key: '2026-02', label: 'Feb 2026', short: 'Feb' },
  { key: '2026-03', label: 'Mar 2026', short: 'Mar' },
  { key: '2026-04', label: 'Apr 2026', short: 'Apr' },
];

export const INTENTS = [
  { key: 'how-to', label: 'How-to / Setup', subs: ['Getting started', 'Best practice', 'Walkthrough'] },
  { key: 'bug', label: 'Bug / Not working', subs: ['Visual glitch', 'Data missing', 'Broken flow', 'Crash'] },
  { key: 'feature-req', label: 'Feature request', subs: ['Missing capability', 'Configurability', 'Customization'] },
  { key: 'billing', label: 'Billing', subs: ['Invoice', 'Refund', 'Plan change', 'Tax'] },
  { key: 'access', label: 'Account access', subs: ['Locked out', 'SSO', 'MFA', 'Password reset'] },
  { key: 'data', label: 'Data / Export', subs: ['Export issue', 'Data accuracy', 'Sync failure'] },
  { key: 'integration', label: 'Integration setup', subs: ['Auth', 'Mapping', 'Webhook retries'] },
  { key: 'complaint', label: 'Complaint', subs: ['Service quality', 'Pricing', 'Outage'] },
  { key: 'cancellation', label: 'Cancellation', subs: ['Downgrade', 'Churn', 'Pause'] },
];

export const ROOT_CAUSES = [
  { key: 'doc-gap', label: 'Documentation gap', family: 'Self-serve' },
  { key: 'discoverability', label: 'Poor discoverability', family: 'UX' },
  { key: 'product-bug', label: 'Product defect', family: 'Engineering' },
  { key: 'edge-case', label: 'Edge-case config', family: 'Product' },
  { key: '3p-failure', label: 'Third-party failure', family: 'External' },
  { key: 'permissions', label: 'Permission model confusion', family: 'UX' },
  { key: 'data-quality', label: 'Customer data quality', family: 'External' },
  { key: 'training', label: 'Customer training needed', family: 'Enablement' },
  { key: 'release-regression', label: 'Release regression', family: 'Engineering' },
];

export const SENTIMENT_BANDS = [
  { key: 'calm', label: 'Calm', swatch: '#1F8A5B' },
  { key: 'annoyed', label: 'Annoyed', swatch: '#E1A23B' },
  { key: 'frustrated', label: 'Frustrated', swatch: '#E96A3E' },
  { key: 'furious', label: 'Furious', swatch: '#B2401D' },
];

// Seeded RNG
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const R = rng(42);
const pick = (arr: any[], r = R) => arr[Math.floor(r() * arr.length)];
const between = (a: number, b: number, r = R) => a + r() * (b - a);

// Generate mock tickets (truncated logic from data.js)
export const generateTickets = () => {
  const tickets: any[] = [];
  let nextId = 100001;

  MONTHS.forEach((m) => {
    const volume = 500; // Simplified volume for mock
    for (let i = 0; i < volume; i++) {
      const intentObj = pick(INTENTS);
      const sentimentVal = R();
      const sentiment = sentimentVal < 0.3 ? 'calm' : sentimentVal < 0.55 ? 'annoyed' : sentimentVal < 0.78 ? 'frustrated' : 'furious';
      
      tickets.push({
        id: 'T-' + (nextId++),
        month: m.key,
        status: pick(STATUSES),
        subject: `Mock ticket for ${intentObj.label}`,
        product: pick(PRODUCTS),
        team: 'Technical Support',
        intent: intentObj.key,
        intentLabel: intentObj.label,
        sentiment,
        frustration: Math.round(sentimentVal * 10),
        automation: R(),
        effortHrs: +(between(0.2, 8)).toFixed(1),
        isAI: R() < 0.3,
        rootCause: pick(ROOT_CAUSES).key,
        rootCauseFamily: pick(ROOT_CAUSES).family,
      });
    }
  });
  return tickets;
};

const allTickets = generateTickets();

export const mockData = {
  tickets: allTickets,
  monthAgg: (monthKey: string) => {
    const ms = allTickets.filter(t => t.month === monthKey && t.team === 'Technical Support');
    const total = ms.length;
    const bySentiment = { calm: 0, annoyed: 0, frustrated: 0, furious: 0 };
    const byIntent: any = {};
    const byRoot: any = {};
    
    ms.forEach(t => {
      (bySentiment as any)[t.sentiment]++;
      byIntent[t.intent] = (byIntent[t.intent] || 0) + 1;
      byRoot[t.rootCauseFamily] = (byRoot[t.rootCauseFamily] || 0) + 1;
    });

    return {
      total,
      avgFrustration: total ? ms.reduce((a, t) => a + t.frustration, 0) / total : 0,
      aiShare: total ? ms.filter(t => t.isAI).length / total : 0,
      multiTeam: ms.filter(t => t.effortHrs > 4).length,
      avgEffort: total ? ms.reduce((a, t) => a + t.effortHrs, 0) / total : 0,
      bySentiment,
      byIntent,
      byRoot,
    };
  },
  topMovers: (monthA: string, monthB: string) => {
    return []; // Placeholder
  },
  moduleIntentMatrix: (monthKey: string) => {
    return { modules: [], intents: INTENTS, cells: {} };
  }
};
