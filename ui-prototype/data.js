// Mock support-ticket dataset for SurveySparrow / ThriveSparrow / SparrowDesk.
// Shaped to mirror the real CSV the analyst will upload (per the PRD).
// Numbers are deterministic — seeded so the prototype is stable across reloads.

(function(){
  // ── Seeded RNG ──────────────────────────────────────────────────
  function rng(seed){let s=seed>>>0; return ()=>{s=(s*1664525+1013904223)>>>0; return s/4294967296;}; }
  const R = rng(42);
  const pick = (arr,r=R) => arr[Math.floor(r()*arr.length)];
  const between = (a,b,r=R) => a + r()*(b-a);

  // ── Dimensions ──────────────────────────────────────────────────
  const MONTHS = [
    {key:'2025-11', label:'Nov 2025',  short:'Nov'},
    {key:'2025-12', label:'Dec 2025',  short:'Dec'},
    {key:'2026-01', label:'Jan 2026',  short:'Jan'},
    {key:'2026-02', label:'Feb 2026',  short:'Feb'},
    {key:'2026-03', label:'Mar 2026',  short:'Mar'},
    {key:'2026-04', label:'Apr 2026',  short:'Apr'},
  ];

  const PRODUCTS  = ['SurveySparrow','ThriveSparrow','SparrowDesk'];
  const SOURCES   = ['Website','Product'];
  const CHANNELS  = ['Ticket','Chat','Phone','Social'];
  const TEAMS     = ['Technical Support','Customer Success','Billing','Onboarding'];
  const STATUSES  = ['Resolved','Pending','Open','Archived'];
  const ISSUE_TYPES = ['Question','Bug','Feature request','Incident','Complaint'];

  // Modules / Areas / Subareas — fed by Category column "Module::Area::Subarea"
  const CATEGORY_TREE = {
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

  const INTENTS = [
    {key:'how-to',         label:'How-to / Setup',     subs:['Getting started','Best practice','Walkthrough']},
    {key:'bug',            label:'Bug / Not working',   subs:['Visual glitch','Data missing','Broken flow','Crash']},
    {key:'feature-req',    label:'Feature request',     subs:['Missing capability','Configurability','Customization']},
    {key:'billing',        label:'Billing',             subs:['Invoice','Refund','Plan change','Tax']},
    {key:'access',         label:'Account access',      subs:['Locked out','SSO','MFA','Password reset']},
    {key:'data',           label:'Data / Export',       subs:['Export issue','Data accuracy','Sync failure']},
    {key:'integration',    label:'Integration setup',   subs:['Auth','Mapping','Webhook retries']},
    {key:'complaint',      label:'Complaint',           subs:['Service quality','Pricing','Outage']},
    {key:'cancellation',   label:'Cancellation',        subs:['Downgrade','Churn','Pause']},
  ];

  const ROOT_CAUSES = [
    {key:'doc-gap',        label:'Documentation gap',          family:'Self-serve'},
    {key:'discoverability',label:'Poor discoverability',       family:'UX'},
    {key:'product-bug',    label:'Product defect',             family:'Engineering'},
    {key:'edge-case',      label:'Edge-case config',           family:'Product'},
    {key:'3p-failure',     label:'Third-party failure',        family:'External'},
    {key:'permissions',    label:'Permission model confusion', family:'UX'},
    {key:'data-quality',   label:'Customer data quality',      family:'External'},
    {key:'training',       label:'Customer training needed',   family:'Enablement'},
    {key:'release-regression', label:'Release regression',     family:'Engineering'},
  ];

  const ZOONA_AI = 'Zoona AI';
  const AGENTS = [
    'Akshay K.', 'Meena S.', 'Oliver P.', 'Priya V.', 'Justin S.',
    'Rohit N.', 'Lakshmi T.', 'Daniel R.', 'Sarah M.', 'Ben H.',
    ZOONA_AI, ZOONA_AI, ZOONA_AI, // weighted up — AI handles a chunk
  ];

  const SENTIMENT_BANDS = [
    {key:'calm',       label:'Calm',       color:'var(--ss-positive-500)',  swatch:'#1F8A5B'},
    {key:'annoyed',    label:'Annoyed',    color:'var(--ss-warning-500)',   swatch:'#E1A23B'},
    {key:'frustrated', label:'Frustrated', color:'#E96A3E',                 swatch:'#E96A3E'},
    {key:'furious',    label:'Furious',    color:'var(--ss-negative-600)',  swatch:'#B2401D'},
  ];

  // ── Realistic subject-line phrases per module ──────────────────
  const SUBJECT_TEMPLATES = {
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

  // ── Generate tickets ────────────────────────────────────────────
  // Volume ramps over time + has a seasonal bump in Mar (release week).
  const MONTH_VOL = {'2025-11':620, '2025-12':540, '2026-01':780, '2026-02':720, '2026-03':940, '2026-04':860};
  // Trends — Survey Builder going up; Integrations going down; ThriveSparrow trending up.
  const TREND_BIAS = {
    'Survey Builder': [-0.1,-0.05,0.05,0.1,0.2,0.25],
    'Distribution':   [0.1, 0.05, 0.0, -0.05, -0.05, -0.1],
    'Audience':       [0,0,0,0.05,0.05,0],
    'Reports':        [0.05,0.05,0,0,-0.05,-0.05],
    'Integrations':   [0.2,0.15,0.1,0.0,-0.1,-0.15],
    'Account':        [0,0,0.05,0.05,0,0],
    'ThriveSparrow':  [-0.05,-0.05,0.05,0.1,0.2,0.25],
    'SparrowDesk':    [-0.05,0,0,0.05,0.1,0.1],
  };

  const moduleList = Object.keys(CATEGORY_TREE);
  const tickets = [];
  let nextId = 100001;

  MONTHS.forEach((m, mIdx) => {
    const volume = MONTH_VOL[m.key];
    for (let i=0;i<volume;i++){
      // weighted module pick using trend bias
      const weights = moduleList.map(mod => {
        const base = 1;
        const bias = (TREND_BIAS[mod] && TREND_BIAS[mod][mIdx]) || 0;
        return Math.max(0.1, base + bias);
      });
      const wsum = weights.reduce((a,b)=>a+b,0);
      let r = R()*wsum, idx=0;
      for (; idx<weights.length; idx++){ r -= weights[idx]; if (r<=0) break; }
      const module = moduleList[idx] || moduleList[0];
      const areas = Object.keys(CATEGORY_TREE[module]);
      const area = pick(areas);
      const sub  = pick(CATEGORY_TREE[module][area]);

      const product = (module==='ThriveSparrow') ? 'ThriveSparrow'
                    : (module==='SparrowDesk')  ? 'SparrowDesk'
                    : (R()<0.85 ? 'SurveySparrow' : pick(PRODUCTS));
      const source = R()<0.7 ? 'Product' : 'Website';

      // intent skew per module
      const moduleIntent = {
        'Survey Builder': ['how-to','bug','feature-req','how-to'],
        'Distribution':   ['bug','how-to','integration','complaint'],
        'Audience':       ['data','how-to','bug'],
        'Reports':        ['data','bug','how-to','feature-req'],
        'Integrations':   ['integration','bug','how-to'],
        'Account':        ['billing','access','complaint','how-to'],
        'ThriveSparrow':  ['how-to','feature-req','bug'],
        'SparrowDesk':    ['how-to','bug','feature-req'],
      };
      const intentKey = pick(moduleIntent[module] || ['how-to']);
      const intent = INTENTS.find(x=>x.key===intentKey);
      const subIntent = pick(intent.subs);

      const issueType = intentKey==='bug' ? 'Bug'
                      : intentKey==='feature-req' ? 'Feature request'
                      : intentKey==='complaint' ? 'Complaint'
                      : R()<0.85 ? 'Question' : pick(ISSUE_TYPES);

      // Sentiment skew — bugs / billing / access get more heat
      const baseHeat = ({bug:.55, billing:.65, access:.7, complaint:.8, cancellation:.85}[intentKey]) || .25;
      const heatRaw = Math.min(1, baseHeat + (R()-.5)*.3);
      const sentiment = heatRaw < 0.3 ? 'calm' : heatRaw < 0.55 ? 'annoyed' : heatRaw < 0.78 ? 'frustrated' : 'furious';
      const frustration = Math.round(heatRaw*10);

      const assignee = R()<0.32 ? ZOONA_AI : pick(AGENTS.filter(x=>x!==ZOONA_AI));
      const team = assignee===ZOONA_AI ? 'Technical Support'
                  : intentKey==='billing' ? (R()<.8?'Billing':'Technical Support')
                  : intentKey==='access'  ? 'Technical Support'
                  : pick([...Array(7).fill('Technical Support'),'Customer Success','Onboarding']);

      const channel = R()<.6 ? 'Ticket' : (R()<.6 ? 'Chat' : pick(CHANNELS));
      const status = R()<.92 ? (R()<.92?'Resolved':'Pending') : (R()<.5?'Open':'Archived');

      // Automation potential — high for how-to & doc gap, low for complaints
      const automation = intentKey==='how-to' ? between(0.6,0.95)
                      : intentKey==='bug' ? between(0.1,0.4)
                      : intentKey==='complaint' ? between(0.0,0.2)
                      : between(0.2, 0.7);

      // Effort
      const effortHrs = +(between(0.2, 6) + (intentKey==='bug' || intentKey==='integration' ? 2 : 0)).toFixed(1);
      const teamsInvolved = effortHrs > 4 ? Math.ceil(R()*3)+1 : (R()<0.15 ? 2 : 1);

      // Root cause skew
      const rcWeights = {
        'how-to':       {'doc-gap':3,'discoverability':2,'training':2},
        'bug':          {'product-bug':4,'release-regression':2,'edge-case':1},
        'feature-req':  {'edge-case':2,'discoverability':1},
        'billing':      {'edge-case':1,'product-bug':1,'training':1},
        'access':       {'permissions':3,'edge-case':1},
        'data':         {'data-quality':3,'product-bug':1,'edge-case':1},
        'integration':  {'3p-failure':3,'product-bug':1,'doc-gap':1},
        'complaint':    {'product-bug':1,'edge-case':1,'discoverability':1},
        'cancellation': {'discoverability':1,'product-bug':1},
      };
      const rcW = rcWeights[intentKey] || {'doc-gap':1};
      const rcEntries = Object.entries(rcW);
      const rcSum = rcEntries.reduce((a,[,w])=>a+w,0);
      let rr=R()*rcSum, rcKey=rcEntries[0][0];
      for (const [k,w] of rcEntries){ rr -= w; if (rr<=0){ rcKey=k; break; } }
      const rootCause = ROOT_CAUSES.find(x=>x.key===rcKey);

      // Subject
      const tmplKey = module + '/' + area;
      const subjects = SUBJECT_TEMPLATES[tmplKey];
      const subject = subjects ? pick(subjects) : `${sub} — ${intent.label.toLowerCase()}`;

      tickets.push({
        id: 'T-' + (nextId++),
        month: m.key,
        status,
        assignee,
        subject,
        product, source,
        channel: channel==='Mail'?'Ticket':channel,
        team,
        issueType,
        module, area, subarea: sub,
        intent: intent.key, intentLabel: intent.label, subIntent,
        rootCause: rootCause.key, rootCauseLabel: rootCause.label, rootCauseFamily: rootCause.family,
        sentiment, frustration,
        automation,
        effortHrs, teamsInvolved,
        isAI: assignee === ZOONA_AI,
      });
    }
  });

  // ── Derived aggregates per month ────────────────────────────────
  function aggregateMonth(monthKey, filterFn){
    const ms = tickets.filter(t => t.month===monthKey && (!filterFn || filterFn(t)));
    const supportable = ms.filter(t => t.team==='Technical Support' && t.status!=='Archived');
    const byModule = {}, byIntent = {}, byContactCode = {}, byRoot = {}, bySentiment = {calm:0,annoyed:0,frustrated:0,furious:0};
    supportable.forEach(t=>{
      byModule[t.module] = (byModule[t.module]||0)+1;
      byIntent[t.intent] = (byIntent[t.intent]||0)+1;
      const code = `${t.module} · ${t.area}`;
      byContactCode[code] = (byContactCode[code]||0)+1;
      byRoot[t.rootCause] = (byRoot[t.rootCause]||0)+1;
      bySentiment[t.sentiment]++;
    });
    const total = supportable.length;
    const avgFrustration = total ? supportable.reduce((a,t)=>a+t.frustration,0)/total : 0;
    const avgAutomation  = total ? supportable.reduce((a,t)=>a+t.automation,0)/total : 0;
    const avgEffort      = total ? supportable.reduce((a,t)=>a+t.effortHrs,0)/total : 0;
    const aiCount = supportable.filter(t=>t.isAI).length;
    const multiTeam = supportable.filter(t=>t.teamsInvolved>1).length;
    return {
      monthKey, total, raw: ms.length, supportable,
      byModule, byIntent, byContactCode, byRoot, bySentiment,
      avgFrustration, avgAutomation, avgEffort, aiCount, multiTeam,
      aiShare: total?aiCount/total:0,
    };
  }

  // Heatmap: module × intent for a month → counts + avg frustration
  function moduleIntentMatrix(monthKey){
    const ms = tickets.filter(t => t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');
    const modules = moduleList;
    const intents = INTENTS.map(i=>i.key);
    const cells = {};
    modules.forEach(m=>{ cells[m]={}; intents.forEach(i=>{ cells[m][i]={count:0,frust:0,sum:0}; }); });
    ms.forEach(t=>{
      const c = cells[t.module][t.intent];
      c.count++; c.sum += t.frustration;
    });
    modules.forEach(m=>intents.forEach(i=>{
      const c = cells[m][i];
      c.frust = c.count ? c.sum/c.count : 0;
    }));
    return {modules, intents:INTENTS, cells};
  }

  // ── Compute month aggregates upfront ────────────────────────────
  const monthAgg = {};
  MONTHS.forEach(m=>{ monthAgg[m.key] = aggregateMonth(m.key); });

  // Top movers between two months (by contact code)
  function topMovers(monthA, monthB, n=8){
    const a = monthAgg[monthA].byContactCode;
    const b = monthAgg[monthB].byContactCode;
    const keys = new Set([...Object.keys(a),...Object.keys(b)]);
    const arr = [...keys].map(k => {
      const av = a[k]||0, bv = b[k]||0;
      const delta = bv - av;
      const pct = av ? (bv-av)/av : (bv>0?1:0);
      return {code:k, a:av, b:bv, delta, pct};
    });
    arr.sort((x,y)=>Math.abs(y.delta)-Math.abs(x.delta));
    return arr.slice(0,n);
  }

  // Bubble dataset: one bubble per (module,area) for a month
  function bubbleSet(monthKey){
    const ms = tickets.filter(t => t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');
    const groups = {};
    ms.forEach(t=>{
      const k = t.module + ' · ' + t.area;
      if (!groups[k]) groups[k] = {key:k, module:t.module, area:t.area, items:[]};
      groups[k].items.push(t);
    });
    const prev = MONTHS[MONTHS.findIndex(m=>m.key===monthKey)-1];
    const prevMap = prev ? bubbleSetRaw(prev.key) : {};
    return Object.values(groups).map(g => {
      const n = g.items.length;
      const frust = n ? g.items.reduce((a,t)=>a+t.frustration,0)/n : 0;
      const automation = n ? g.items.reduce((a,t)=>a+t.automation,0)/n : 0;
      const effort = n ? g.items.reduce((a,t)=>a+t.effortHrs,0)/n : 0;
      const prevN = (prevMap[g.key]||0);
      const mom = prevN ? (n-prevN)/prevN : (n>0?1:0);
      const families = {};
      g.items.forEach(t=>{ families[t.rootCauseFamily]=(families[t.rootCauseFamily]||0)+1; });
      const dominantFamily = Object.entries(families).sort((a,b)=>b[1]-a[1])[0][0];
      return {...g, n, frust, automation, effort, mom, dominantFamily};
    });
  }
  function bubbleSetRaw(monthKey){
    const ms = tickets.filter(t=> t.month===monthKey && t.team==='Technical Support' && t.status!=='Archived');
    const m = {};
    ms.forEach(t=>{ const k=t.module+' · '+t.area; m[k]=(m[k]||0)+1; });
    return m;
  }

  // ── Expose ──────────────────────────────────────────────────────
  window.SUPPORT_DATA = {
    MONTHS, PRODUCTS, SOURCES, CHANNELS, TEAMS, STATUSES, ISSUE_TYPES,
    CATEGORY_TREE, INTENTS, ROOT_CAUSES, SENTIMENT_BANDS, ZOONA_AI,
    tickets, monthAgg, aggregateMonth, moduleIntentMatrix, topMovers, bubbleSet,
  };
})();
