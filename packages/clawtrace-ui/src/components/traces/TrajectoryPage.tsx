'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { TraceDetailContent } from '../clawtrace/trace-detail/TraceDetailWorkbench';
import { buildSnapshot, type BackendMetaData, type BackendSpanData } from '../../lib/trace-builder';
import type { TraceDetailSnapshot } from '../../lib/trace-detail';
import styles from './TrajectoryPage.module.css';

interface TraceDetailResponse {
  meta: BackendMetaData;
  spans: BackendSpanData[];
}

interface Agent {
  id: string;
  name: string;
  key_prefix: string;
}

export function TrajectoryPage({
  paramsPromise,
}: {
  paramsPromise: Promise<{ agentId: string; trajectoryId: string }>;
}) {
  const { agentId, trajectoryId } = use(paramsPromise);
  const [agentName, setAgentName] = useState<string>(agentId);
  const [response, setResponse] = useState<TraceDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/agents', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { agents?: Agent[] }) => {
        const match = d.agents?.find((a) => a.id === agentId);
        if (match) setAgentName(match.name);
      })
      .catch(() => {});
  }, [agentId]);

  const load = useCallback(async () => {
    if (!trajectoryId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/traces/${encodeURIComponent(trajectoryId)}`,
        { cache: 'no-store' },
      );
      if (!res.ok) {
        const e = (await res.json().catch(() => ({}))) as { detail?: string };
        throw new Error(e.detail ?? `HTTP ${res.status}`);
      }
      setResponse((await res.json()) as TraceDetailResponse);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load trace');
    } finally {
      setLoading(false);
    }
  }, [trajectoryId]);

  useEffect(() => { void load(); }, [load]);

  const detail = useMemo<TraceDetailSnapshot | null>(() => {
    if (!response) return null;
    try {
      return buildSnapshot(trajectoryId, response.meta, response.spans);
    } catch {
      return null;
    }
  }, [trajectoryId, response]);

  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <nav className={styles.breadcrumb}>
          <Link href="/trace" className={styles.breadcrumbLink}>OpenClaw Agents</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link href={`/trace/${agentId}`} className={styles.breadcrumbLink}>{agentName}</Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>Trajectory: {trajectoryId}</span>
        </nav>
      </header>

      {loading && (
        <div className={styles.center}>Loading trace...</div>
      )}

      {!loading && error && (
        <div className={styles.center}>
          <p className={styles.error}>{error}</p>
          <Link href={`/trace/${agentId}`} className={styles.backLink}>
            Back to Agent
          </Link>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.body}>
          <TraceDetailContent workflowId={trajectoryId} detail={detail} />
        </div>
      )}
    </section>
  );
}
