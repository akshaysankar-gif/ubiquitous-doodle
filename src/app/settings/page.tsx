"use client";

import React from "react";
import { Card, Icon } from "@/components/ui/PrototypeKit";
import { PageScaffold } from "@/components/ui/PageScaffold";

export default function SettingsPage() {
  return (
    <PageScaffold title="Settings" subtitle="Workspace, integrations, members — placeholder">
      <Card style={{ padding: '40px', textAlign: 'center', color: 'var(--ss-fg-muted)' }}>
        <Icon name="Settings" size={28} />
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10, color: 'var(--ss-fg)' }}>Settings will live here.</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Workspace · API keys · Integrations · Members</div>
      </Card>
    </PageScaffold>
  );
}
