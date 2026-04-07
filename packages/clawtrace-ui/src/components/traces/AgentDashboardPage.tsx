'use client';

import { use, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { TracesPage } from './TracesPage';
import styles from './AgentDashboardPage.module.css';

interface Agent {
  id: string;
  name: string;
  key_prefix: string;
}

export function AgentDashboardPage({
  paramsPromise,
}: {
  paramsPromise: Promise<{ agentId: string }>;
}) {
  const { agentId } = use(paramsPromise);
  const [agentName, setAgentName] = useState<string>(agentId);

  useEffect(() => {
    fetch('/api/agents', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { agents?: Agent[] }) => {
        const match = d.agents?.find((a) => a.id === agentId);
        if (match) setAgentName(match.name);
      })
      .catch(() => {});
  }, [agentId]);

  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <nav className={styles.breadcrumb}>
          <Link href="/trace" className={styles.breadcrumbLink}>OpenClaw Agents</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{agentName}</span>
        </nav>
      </header>
      <div className={styles.body}>
        <TracesPage initialAgent={agentId} />
      </div>
    </section>
  );
}
