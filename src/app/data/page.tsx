"use client";

import React, { useState, useRef } from "react";
import { Card, Icon, Button } from "@/components/ui/PrototypeKit";
import { SectionHead, Tag } from "@/components/ui/PrototypePrimitives";
import { PageScaffold } from "@/components/ui/PageScaffold";
import { dataClient } from "@/lib/dataClient";

const SCHEMA = [
  { col: 'Ticket ID', use: 'Primary key', transform: 'pass-through', target: 'id', kept: true, locked: true },
  { col: 'Status', use: 'Filter', transform: 'Archived = spam → exclude', target: 'status', kept: true },
  { col: 'Assignee', use: 'AI flag', transform: 'Assignee = "Zoona AI" → isAI=true', target: 'assignee + isAI', kept: true },
  { col: 'Requester', use: '(ignored)', transform: 'mixed customer/internal — drop', target: '—', kept: false, note: 'Per PRD' },
  { col: 'Subject', use: 'NLP input', transform: 'pass-through', target: 'subject', kept: true },
  { col: 'Brand', use: 'Split', transform: 'Split into Product + Source', target: 'product + source', kept: true, note: 'See rules ↓' },
  { col: 'Channel', use: 'Channel', transform: '"Mail" → "Ticket"', target: 'channel', kept: true },
  { col: 'Team', use: 'Filter', transform: 'Analysis only on "Technical Support"', target: 'team', kept: true },
  { col: 'Issue type', use: 'Pass-through', transform: 'as-is', target: 'issueType', kept: true },
  { col: 'Category', use: 'Split', transform: 'Split on "::" → Module / Area / Subarea', target: 'module + area + subarea', kept: true },
];

const BRAND_RULES = [
  { match: 'SurveySparrow', product: 'SurveySparrow', source: 'Website' },
  { match: 'ThriveSparrow', product: 'ThriveSparrow', source: 'Website' },
  { match: 'SparrowDesk', product: 'SparrowDesk', source: 'Website' },
  { match: 'SurveySparrow Product', product: 'SurveySparrow', source: 'Product' },
  { match: 'ThriveSparrow Product', product: 'ThriveSparrow', source: 'Product' },
  { match: 'Unknown', product: '—', source: '—', note: 'Discard' },
  { match: 'SparrowGenie', product: '—', source: '—', note: 'Discard' },
];

const Switch = ({ checked, onChange, disabled }: any) => (
  <div onClick={() => !disabled && onChange(!checked)} style={{
    width: 28, height: 16, borderRadius: 99, background: checked ? 'var(--ss-primary-500)' : 'var(--ss-neutral-300)',
    position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background .2s', opacity: disabled ? 0.5 : 1
  }}>
    <div style={{
      width: 12, height: 12, borderRadius: '50%', background: '#fff',
      position: 'absolute', top: 2, left: checked ? 14 : 2, transition: 'left .2s'
    }} />
  </div>
);

const IconButton = ({ icon, onClick, disabled }: any) => (
  <button onClick={onClick} disabled={disabled} style={{ border: 0, background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', padding: 4, opacity: disabled ? 0.5 : 1 }}>
    <Icon name={icon} size={16} color="var(--ss-fg-muted)" />
  </button>
);

export default function DataAdmin() {
  const [tab, setTab] = useState('schema');
  const [schema, setSchema] = useState(SCHEMA);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleKeep = (i: number) => setSchema(s => s.map((r, idx) => idx === i ? { ...r, kept: !r.kept } : r));

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("batchName", file.name);
      await dataClient.uploadFile(formData);
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PageScaffold title="Data & schema" subtitle="What the uploaded sheet contains, how each column is transformed, and what gets filtered out"
      intro={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" color="secondary" leftIcon="Download">Export schema</Button>
          <input
            type="file"
            accept=".csv,.xlsx"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleUpload}
          />
          <Button size="sm" color="primary" leftIcon="Upload" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload sheet"}
          </Button>
        </div>
      }>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--ss-neutral-100)', paddingBottom: 8 }}>
          {[
            { id: 'schema', label: 'Schema', icon: 'Table' },
            { id: 'rules', label: 'Brand split rules', icon: 'GitMerge' },
            { id: 'filters', label: 'Filters', icon: 'Filter' },
            { id: 'migration', label: 'Migration plan', icon: 'CloudUpload' }
          ].map(t => (
            <div key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
              background: tab === t.id ? 'var(--ss-primary-50)' : 'transparent',
              color: tab === t.id ? 'var(--ss-primary-700)' : 'var(--ss-fg-muted)',
              fontSize: 13, fontWeight: tab === t.id ? 700 : 600, transition: 'all .1s'
            }}>
              <Icon name={t.icon} size={14} />
              {t.label}
            </div>
          ))}
        </div>
      </div>

      {tab === 'schema' && (
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Column-by-column" subtitle="Click a row to expand transformation details" />
          <div style={{ display: 'grid', gridTemplateColumns: '180px 100px 1fr 160px 60px 60px', gap: 10, padding: '4px 8px', fontSize: 10, color: 'var(--ss-fg-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Source column</span><span>Use</span><span>Transformation</span><span>Target field(s)</span><span>Edit</span><span style={{ textAlign: 'right' }}>Keep</span>
          </div>
          {schema.map((r, i) => (
            <div key={r.col} style={{ display: 'grid', gridTemplateColumns: '180px 100px 1fr 160px 60px 60px', gap: 10, padding: '12px 8px', borderTop: '1px solid var(--ss-neutral-100)', alignItems: 'center', opacity: r.kept ? 1 : 0.55 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{r.col}</div>
                {r.locked && <span style={{ fontSize: 10, color: 'var(--ss-fg-muted)' }}><Icon name="Lock" size={9} /> primary key</span>}
              </div>
              <Tag color={r.use === 'Filter' ? 'orange' : r.use === 'Split' ? 'purple' : r.use === '(ignored)' ? 'neutral' : 'mint'}>{r.use}</Tag>
              <div style={{ fontSize: 12, color: 'var(--ss-fg)', lineHeight: 1.4 }}>
                {r.transform}
                {r.note && <div style={{ fontSize: 10.5, color: 'var(--ss-fg-muted)', marginTop: 2 }}>{r.note}</div>}
              </div>
              <span style={{ fontSize: 11.5, fontFamily: 'var(--ss-font-mono, "DM Mono", monospace)', color: 'var(--ss-fg-muted)' }}>{r.target}</span>
              <IconButton icon="Pencil" disabled={r.locked} />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Switch checked={r.kept} disabled={r.locked} onChange={() => toggleKeep(i)} />
              </div>
            </div>
          ))}

          <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--ss-primary-50)', borderRadius: 8, border: '1px solid rgba(0,130,141,0.18)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="Info" size={14} color="var(--ss-primary-600)" />
            <div style={{ fontSize: 12, color: 'var(--ss-fg)', lineHeight: 1.5 }}>
              <strong>Add / remove columns later:</strong> all derived fields (root cause, frustration, automation, intent) are stored in a separate <em>enrichment table</em> that joins on Ticket ID. Source columns can be added or dropped without breaking the explorer.
            </div>
          </div>
        </Card>
      )}

      {tab === 'rules' && (
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Brand split rules" subtitle="How the 'Brand' column resolves into Product + Source" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, padding: '4px 8px', fontSize: 10, color: 'var(--ss-fg-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Brand value</span><span>→ Product</span><span>→ Source</span><span>Notes</span>
          </div>
          {BRAND_RULES.map(r => {
            const discard = r.note === 'Discard';
            return (
              <div key={r.match} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, padding: '10px 8px', borderTop: '1px solid var(--ss-neutral-100)', alignItems: 'center', opacity: discard ? 0.65 : 1 }}>
                <span style={{ fontSize: 12.5, fontFamily: 'var(--ss-font-mono, monospace)', fontWeight: 600 }}>{r.match}</span>
                <Tag color={discard ? 'neutral' : 'mint'}>{r.product}</Tag>
                <Tag color={discard ? 'neutral' : 'purple'}>{r.source}</Tag>
                <span style={{ fontSize: 11.5, color: discard ? 'var(--ss-negative-600)' : 'var(--ss-fg-muted)' }}>{r.note || '—'}</span>
              </div>
            );
          })}
          <div style={{ marginTop: 12 }}>
            <Button size="sm" variant="outline" color="secondary" leftIcon="Plus">Add custom rule</Button>
          </div>
        </Card>
      )}

      {tab === 'filters' && (
        <Card style={{ padding: '16px 18px' }}>
          <SectionHead title="Filters in effect" subtitle="What's excluded before analysis runs" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Archived tickets (treated as spam)', detail: 'Status = "Archived" → excluded from all analytics', kept: true, fixed: true },
              { label: 'Team filter — Technical Support only', detail: 'Other teams\' tickets appear in counts/visualizations but are not analysed', kept: true, fixed: true },
              { label: 'Unknown / SparrowGenie brand values', detail: 'Discarded entirely (per brand-split rules)', kept: true, fixed: true },
              { label: 'Requester field', detail: 'Ignored — cannot reliably tell customer vs internal', kept: true, fixed: true },
              { label: 'Minimum ticket length', detail: 'Require ≥1 conversation message before NLP scoring', kept: true, fixed: false },
            ].map((f, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 10, padding: '12px 14px', border: '1px solid var(--ss-neutral-100)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{f.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ss-fg-muted)', marginTop: 2 }}>{f.detail}</div>
                </div>
                <Switch checked={f.kept} disabled={f.fixed} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'migration' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <MigrationCard icon="Database" name="Supabase" status="Planned"
            steps={['Table: tickets (source)', 'Table: ticket_enrichment (derived)', 'Auth: row-level by team', 'Edge function: enrichment pipeline', 'Realtime: dashboard subscriptions']} />
          <MigrationCard icon="Triangle" name="Vercel" status="Planned"
            steps={['Frontend deploy from main', 'Preview deploys on PRs', 'Env secrets for OpenAI + Supabase', 'Vercel KV for caching aggregates', 'Cron: nightly re-enrichment']} />
          <MigrationCard icon="Github" name="GitHub" status="Planned"
            steps={['Single repo, mono-package', 'Branch protection on main', 'Actions: lint + type-check on PR', 'Conventional commits', 'Issue templates per metric module']} />
        </div>
      )}
    </PageScaffold>
  );
}

const MigrationCard = ({ icon, name, status, steps }: any) => (
  <Card style={{ padding: '16px 18px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--ss-neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={16} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
      </div>
      <Tag color="orange">{status}</Tag>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {steps.map((s: string, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--ss-fg)', lineHeight: 1.4 }}>
          <Icon name="CheckCircle2" size={13} color="var(--ss-neutral-300)" />
          <span>{s}</span>
        </div>
      ))}
    </div>
  </Card>
);
