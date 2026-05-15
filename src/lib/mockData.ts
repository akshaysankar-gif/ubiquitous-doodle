// Mock support-ticket dataset for SurveySparrow / ThriveSparrow / SparrowDesk.
// Ported from ui-prototype/data.js

// ── Seeded RNG ──────────────────────────────────────────────────
function rng(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const R = rng(42);
const pick = (arr: any[], r = R) => arr[Math.floor(r() * arr.length)];
const between = (a: number, b: number, r = R) => a + r() * (b - a);

// ── Dimensions ──────────────────────────────────────────────────
export const MONTHS = [
  { key: '2025-11', label: 'Nov 2025', short: 'Nov' },
  { key: '2025-12', label: 'Dec 2025', short: 'Dec' },
  { key: '2026-01', label: 'Jan 2026', short: 'Jan' },
  { key: '2026-02', label: 'Feb 2026', short: 'Feb' },
  { key: '2026-03', label: 'Mar 2026', short: 'Mar' },
  { key: '2026-04', label: 'Apr 2026', short: 'Apr' },
];

export const PRODUCTS = ['SurveySparrow', 'ThriveSparrow', 'SparrowDesk'];
export const SOURCES = ['Website', 'Product'];
export const CHANNELS = ['Ticket', 'Chat', 'Phone', 'Social'];
export const TEAMS = ['Technical Support', 'Customer Success', 'Billing', 'Onboarding'];
export const STATUSES = ['Resolved', 'Pending', 'Open', 'Archived'];
export const ISSUE_TYPES = ['Question', 'Bug', 'Feature request', 'Incident', 'Complaint'];

export const CATEGORY_TREE: any = {
  'Survey Builder': {
    'Question Types': ['NPS', 'Matrix', 'File upload', 'Picture choice', 'Form question'],
    'Logic & Branching': ['Skip logic', 'Display logic', 'Variables', 'Calculator'],
    'Themes & Design': ['Custom CSS', 'Fonts', 'Background', 'Mobile preview'],
    'Translations': ['RTL', 'Auto-translate', 'Variable substitution']
  },
  'Distribution': {
    'Email Share': ['Bounce', 'Throttling', 'Custom domain', 'Unsubscribe'],
    'SMS Share': ['DLT', 'Delivery rate', 'Sender ID', 'Country block'],
    'Embed': ['Inline', 'Popup', 'Slide-in', 'Iframe sizing'],
    'Mobile SDK': ['iOS', 'Android', 'React Native', 'Flutter']
  },
  'Audience': {
    'Contact Lists': ['Import CSV', 'Dedupe', 'Custom fields', 'Tags'],
    'Segments': ['Filter logic', 'Auto-update', 'Export'],
    'Imports & Sync': ['Salesforce sync', 'HubSpot sync', 'API push']
  },
  'Reports': {
    'Dashboards': ['NPS dashboard', 'CSAT dashboard', 'Custom widgets', 'Cross-tab'],
    'Exports': ['PDF', 'XLSX', 'PowerPoint', 'Scheduled email'],
    'Sentiment': ['AI tagging', 'Theme detection', 'Topic accuracy']
  },
  'Integrations': {
    'CRM': ['Salesforce', 'HubSpot', 'Zoho'],
    'Productivity': ['Slack', 'Teams', 'Google Sheets'],
    'Webhooks': ['Retries', 'Auth', 'Payload schema'],
    'Zapier': ['Triggers', 'Actions', 'Auth refresh']
  },
  'Account': {
    'Billing': ['Invoice', 'Plan change', 'Tax', 'Refund'],
    'Users & Roles': ['SSO', 'SAML', 'Workspace move', 'Permissions'],
    'API Keys': ['Rotation', 'Rate limit', 'Scopes']
  },
  'ThriveSparrow': {
    'Engagement Surveys': ['Anonymity', 'Pulse', 'eNPS'],
    'Recognition': ['Points', 'Catalog', 'Approval'],
    'OKRs': ['Cycle setup', 'Cascading', 'Check-in']
  },
  'SparrowDesk': {
    'Ticketing': ['SLA', 'Assignment', 'Macros', 'Triggers'],
    'Knowledge Base': ['Articles', 'Search', 'Permissions'],
    'AI Agent': ['Routing', 'Confidence', 'Handoff']
  }
};

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

export const ZOONA_AI = 'Zoona AI';
export const AGENTS = [
  'Akshay K.', 'Meena S.', 'Oliver P.', 'Priya V.', 'Justin S.',
  'Rohit N.', 'Lakshmi T.', 'Daniel R.', 'Sarah M.', 'Ben H.',
  ZOONA_AI, ZOONA_AI, ZOONA_AI,
];

export const SENTIMENT_BANDS = [
  { key: 'calm', label: 'Calm', color: 'var(--ss-positive-500)', swatch: '#1F8A5B' },
  { key: 'annoyed', label: 'Annoyed', color: 'var(--ss-warning-500)', swatch: '#E1A23B' },
  { key: 'frustrated', label: 'Frustrated', color: '#E96A3E', swatch: '#E96A3E' },
  { key: 'furious', label: 'Furious', color: 'var(--ss-negative-600)', swatch: '#B2401D' },
];

const SUBJECT_TEMPLATES: any = {
  'Survey Builder/Question Types': [
    'NPS scale shows wrong colors in dark mode',
    'Matrix question collapses on mobile preview',
    'File upload fails for PDFs above 10MB',
    'Picture choice — image quality is bad after upload',
  ],
  'Survey Builder/Logic & Branching': [
    'Skip logic not triggering when variable equals zero',
    'Display logic doubles up after duplicating page',
    'Calculator outputs NaN for empty fields',
  ],
  'Survey Builder/Themes & Design': [
    'Custom font not loading on shared link',
    'Background image stretches on iPad',
    'Theme reverts after duplicating survey',
  ],
  'Distribution/Email Share': [
    'High bounce rate from custom domain',
    'Throttling unclear — only 20% of contacts received survey',
    'Unsubscribe link broken for French locale',
  ],
  'Distribution/SMS Share': [
    'DLT template approval stuck',
    'Sender ID showing as random string',
    'India SMS delivery dropped to 40%',
  ],
  'Distribution/Embed': [
    'Inline embed cuts off on small screens',
    'Popup not firing on Shopify checkout',
    'Iframe scrolling jumps on iOS Safari',
  ],
  'Distribution/Mobile SDK': [
    'iOS SDK crash on cold start (v3.2.1)',
    'React Native build fails after upgrade',
    'Flutter SDK ignores tenant ID config',
  ],
  'Audience/Contact Lists': [
    'CSV import dedupes wrong column',
    'Custom fields not mapping during import',
    'Tags removed after bulk update',
  ],
  'Audience/Segments': [
    'Segment filter ignores "is empty" rule',
    'Auto-update segments lag by 6+ hours',
  ],
  'Audience/Imports & Sync': [
    'Salesforce sync deletes existing tags',
    'HubSpot bidirectional sync stuck in loop',
  ],
  'Reports/Dashboards': [
    'NPS dashboard shows null for last 7 days',
    'Cross-tab loses filter after refresh',
    'Custom widget can\'t group by region',
  ],
  'Reports/Exports': [
    'PDF export missing matrix data',
    'Scheduled email export not sending',
    'XLSX export truncates long text responses',
  ],
  'Reports/Sentiment': [
    'AI theme detection over-tagging "pricing"',
    'Sentiment marked positive for clearly negative response',
  ],
  'Integrations/CRM': [
    'Salesforce push failing — auth expired',
    'HubSpot field mapping resets after save',
  ],
  'Integrations/Productivity': [
    'Slack notification missing response link',
    'Google Sheets append duplicates rows',
  ],
  'Integrations/Webhooks': [
    'Webhook retries flooding our endpoint',
    'Auth header not included on retry',
  ],
  'Integrations/Zapier': [
    'Zapier trigger fires twice per response',
  ],
  'Account/Billing': [
    'Invoice missing GST line item',
    'Refund not issued after plan downgrade',
    'Annual plan still charging monthly',
  ],
  'Account/Users & Roles': [
    'SSO redirect loop after Okta change',
    'SAML metadata URL returns 500',
    'Can\'t move user between workspaces',
  ],
  'Account/API Keys': [
    'API key rotation breaks existing integrations',
    'Rate limit hit at 50 req/min — docs say 100',
  ],
  'ThriveSparrow/Engagement Surveys': [
    'Anonymity prompt confusing — staff worried',
    'eNPS pulse not respecting frequency',
  ],
  'ThriveSparrow/Recognition': [
    'Points balance off after catalog refund',
    'Approval workflow skipped manager',
  ],
  'ThriveSparrow/OKRs': [
    'Cascading OKRs lose owner on edit',
    'Check-in reminders not sent',
  ],
  'SparrowDesk/Ticketing': [
    'SLA timer not pausing on customer reply',
    'Macro variable {{customer.name}} blank',
  ],
  'SparrowDesk/Knowledge Base': [
    'Search returns 0 results for known article',
  ],
  'SparrowDesk/AI Agent': [
    'AI agent handoff missing context',
    'Confidence score always 0.99',
  ],
};

const MONTH_VOL: any = { '2025-11': 620, '2025-12': 540, '2026-01': 780, '2026-02': 720, '2026-03': 940, '2026-04': 860 };
const TREND_BIAS: any = {
  'Survey Builder': [-0.1, -0.05, 0.05, 0.1, 0.2, 0.25],
  'Distribution': [0.1, 0.05, 0.0, -0.05, -0.05, -0.1],
  'Audience': [0, 0, 0, 0.05, 0.05, 0],
  'Reports': [0.05, 0.05, 0, 0, -0.05, -0.05],
  'Integrations': [0.2, 0.15, 0.1, 0.0, -0.1, -0.15],
  'Account': [0, 0, 0.05, 0.05, 0, 0],
  'ThriveSparrow': [-0.05, -0.05, 0.05, 0.1, 0.2, 0.25],
  'SparrowDesk': [-0.05, 0, 0, 0.05, 0.1, 0.1],
};

const moduleList = Object.keys(CATEGORY_TREE);

export const generateTickets = () => {
  return [];
};

const allTickets = generateTickets();

function aggregateMonth(monthKey: string, filterFn?: any) {
  const ms = allTickets.filter(t => t.month === monthKey && (!filterFn || filterFn(t)));
  const supportable = ms.filter(t => t.team === 'Technical Support' && t.status !== 'Archived');
  const byModule: any = {}, byIntent: any = {}, byContactCode: any = {}, byRoot: any = {}, bySentiment: any = { calm: 0, annoyed: 0, frustrated: 0, furious: 0 };
  
  supportable.forEach(t => {
    byModule[t.module] = (byModule[t.module] || 0) + 1;
    byIntent[t.intent] = (byIntent[t.intent] || 0) + 1;
    const code = `${t.module} · ${t.area}`;
    byContactCode[code] = (byContactCode[code] || 0) + 1;
    byRoot[t.rootCause] = (byRoot[t.rootCause] || 0) + 1;
    bySentiment[t.sentiment]++;
  });
  
  const total = supportable.length;
  const avgFrustration = total ? supportable.reduce((a, t) => a + t.frustration, 0) / total : 0;
  const avgAutomation = total ? supportable.reduce((a, t) => a + t.automation, 0) / total : 0;
  const avgEffort = total ? supportable.reduce((a, t) => a + t.effortHrs, 0) / total : 0;
  const aiCount = supportable.filter(t => t.isAI).length;
  const multiTeam = supportable.filter(t => t.teamsInvolved > 1).length;
  
  return {
    monthKey, total, raw: ms.length, supportable,
    byModule, byIntent, byContactCode, byRoot, bySentiment,
    avgFrustration, avgAutomation, avgEffort, aiCount, multiTeam,
    aiShare: total ? aiCount / total : 0,
  };
}

const monthAggCache: any = {};
MONTHS.forEach(m => { monthAggCache[m.key] = aggregateMonth(m.key); });

export const mockData = {
  tickets: allTickets,
  monthAgg: (monthKey: string) => {
    return monthAggCache[monthKey] || aggregateMonth(monthKey);
  },
  topMovers: (monthA: string, monthB: string, n = 8) => {
    if (!monthAggCache[monthA] || !monthAggCache[monthB]) return [];
    const a = monthAggCache[monthA].byContactCode;
    const b = monthAggCache[monthB].byContactCode;
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const arr = [...keys].map(k => {
      const av = a[k] || 0, bv = b[k] || 0;
      const delta = bv - av;
      const pct = av ? (bv - av) / av : (bv > 0 ? 1 : 0);
      return { code: k, a: av, b: bv, delta, pct };
    });
    arr.sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
    return arr.slice(0, n);
  },
  moduleIntentMatrix: (monthKey: string) => {
    const ms = allTickets.filter(t => t.month === monthKey && t.team === 'Technical Support' && t.status !== 'Archived');
    const modules = moduleList;
    const intents = INTENTS.map(i => i.key);
    const cells: any = {};
    modules.forEach(m => { cells[m] = {}; intents.forEach(i => { cells[m][i] = { count: 0, frust: 0, sum: 0 }; }); });
    ms.forEach(t => {
      const c = cells[t.module][t.intent];
      c.count++; c.sum += t.frustration;
    });
    modules.forEach(m => intents.forEach(i => {
      const c = cells[m][i];
      c.frust = c.count ? c.sum / c.count : 0;
    }));
    return { modules, intents: INTENTS, cells };
  },
  bubbleSet: (monthKey: string) => {
    const ms = allTickets.filter(t => t.month === monthKey && t.team === 'Technical Support' && t.status !== 'Archived');
    const groups: any = {};
    ms.forEach(t => {
      const k = t.module + ' · ' + t.area;
      if (!groups[k]) groups[k] = { key: k, module: t.module, area: t.area, items: [] };
      groups[k].items.push(t);
    });
    const prev = MONTHS[MONTHS.findIndex(m => m.key === monthKey) - 1];
    
    function bubbleSetRaw(mk: string){
      const ms2 = allTickets.filter(t => t.month === mk && t.team === 'Technical Support' && t.status !== 'Archived');
      const m2: any = {};
      ms2.forEach(t => { const k = t.module + ' · ' + t.area; m2[k] = (m2[k] || 0) + 1; });
      return m2;
    }
    const prevMap = prev ? bubbleSetRaw(prev.key) : {};
    
    return Object.values(groups).map((g: any) => {
      const n = g.items.length;
      const frust = n ? g.items.reduce((a: any, t: any) => a + t.frustration, 0) / n : 0;
      const automation = n ? g.items.reduce((a: any, t: any) => a + t.automation, 0) / n : 0;
      const effort = n ? g.items.reduce((a: any, t: any) => a + t.effortHrs, 0) / n : 0;
      const prevN = (prevMap[g.key] || 0);
      const mom = prevN ? (n - prevN) / prevN : (n > 0 ? 1 : 0);
      const families: any = {};
      g.items.forEach((t: any) => { families[t.rootCauseFamily] = (families[t.rootCauseFamily] || 0) + 1; });
      const dominantFamily = Object.entries(families).sort((a: any, b: any) => b[1] - a[1])[0][0];
      return { ...g, n, frust, automation, effort, mom, dominantFamily };
    });
  }
};
