'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TraceDetailWorkbench } from '../clawtrace/trace-detail/TraceDetailWorkbench';
import { CLAWTRACE_FLOW_PAGES } from '../../lib/flow-pages';
import { buildSnapshot, type BackendMetaData, type BackendSpanData } from '../../lib/trace-builder';
import type { OpenClawDiscoverySnapshot } from '../../lib/openclaw-discovery';
import type { TraceDetailSnapshot } from '../../lib/trace-detail';

/* ── Wire types from /api/traces/[traceId] ───────────────────────────────── */
interface TraceDetailResponse {
  meta: BackendMetaData;
  spans: BackendSpanData[];
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function extractUuid(eid: string): string {
  const m = eid.match(/\[(.+)\]/);
  return m ? m[1] : eid;
}

// Dummy non-null snapshot satisfies the `!snapshot` guard in TraceDetailWorkbench
// without being used for anything else.
const DUMMY_SNAPSHOT = { id: '__loaded__' } as unknown as OpenClawDiscoverySnapshot;

// The Daily Overview flow is the closest match for the Traces page context
const DETAIL_FLOW = CLAWTRACE_FLOW_PAGES.find((f) => f.id === 'f3-control-room') ?? CLAWTRACE_FLOW_PAGES[0]!;

/* ── Loading / error shells ──────────────────────────────────────────────── */
function LoadingShell() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100dvh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ct-page-bg, #faf4ec)',
        color: '#7c6854',
        fontSize: 14,
      }}
    >
      Loading trace…
    </div>
  );
}

function ErrorShell({ message, traceId }: { message: string; traceId: string }) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100dvh',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        background: 'var(--ct-page-bg, #faf4ec)',
        padding: 32,
      }}
    >
      <p style={{ color: '#b42318', fontSize: 14, textAlign: 'center' }}>
        {message || `Could not load trace ${traceId}`}
      </p>
      <a
        href="/traces"
        style={{
          color: '#a4532b',
          fontSize: 13,
          textDecoration: 'underline',
        }}
      >
        ← Back to Traces
      </a>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export function TraceDetailPage() {
  const searchParams = useSearchParams();
  const rawParam     = searchParams.get('traceId') ?? '';
  // Accept both "Trace[uuid]" and bare "uuid"
  const traceId = extractUuid(rawParam);

  const [response, setResponse] = useState<TraceDetailResponse | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const load = useCallback(async () => {
    if (!traceId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/traces/${encodeURIComponent(traceId)}`,
        { cache: 'no-store' },
      );
      if (!res.ok) {
        const e = await res.json().catch(() => ({})) as { detail?: string };
        throw new Error(e.detail ?? `HTTP ${res.status}`);
      }
      setResponse(await res.json() as TraceDetailResponse);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load trace');
    } finally {
      setLoading(false);
    }
  }, [traceId]);

  useEffect(() => { void load(); }, [load]);

  // Build the TraceDetailSnapshot from raw backend data whenever the
  // response changes.  All computation is pure and runs client-side.
  const detail = useMemo<TraceDetailSnapshot | null>(() => {
    if (!response) return null;
    try {
      return buildSnapshot(traceId, response.meta, response.spans);
    } catch {
      return null;
    }
  }, [traceId, response]);

  if (!traceId) {
    return <ErrorShell message="No trace ID provided." traceId="" />;
  }

  if (loading) {
    return <LoadingShell />;
  }

  if (error) {
    return <ErrorShell message={error} traceId={traceId} />;
  }

  return (
    <TraceDetailWorkbench
      flow={DETAIL_FLOW}
      allFlows={CLAWTRACE_FLOW_PAGES}
      workflowId={traceId}
      snapshot={response ? DUMMY_SNAPSHOT : null}
      detail={detail}
    />
  );
}
