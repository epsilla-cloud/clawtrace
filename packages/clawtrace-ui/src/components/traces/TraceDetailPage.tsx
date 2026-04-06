'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppNav } from '../app-nav/AppNav';
import { TraceDetailContent } from '../clawtrace/trace-detail/TraceDetailWorkbench';
import { buildSnapshot, type BackendMetaData, type BackendSpanData } from '../../lib/trace-builder';
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

/* ── Main component ──────────────────────────────────────────────────────── */
export function TraceDetailPage() {
  const searchParams = useSearchParams();
  const rawParam     = searchParams.get('traceId') ?? '';
  const traceId      = extractUuid(rawParam);

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

  const detail = useMemo<TraceDetailSnapshot | null>(() => {
    if (!response) return null;
    try {
      return buildSnapshot(traceId, response.meta, response.spans);
    } catch {
      return null;
    }
  }, [traceId, response]);

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: '#faf4ec' }}>
      <AppNav />

      {loading && (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--ct-page-bg, #faf4ec)', color: '#7c6854', fontSize: 14,
        }}>
          Loading trace…
        </div>
      )}

      {!loading && error && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 16,
          background: 'var(--ct-page-bg, #faf4ec)', padding: 32,
        }}>
          <p style={{ color: '#b42318', fontSize: 14, textAlign: 'center', margin: 0 }}>{error}</p>
          <a href="/traces" style={{ color: '#a4532b', fontSize: 13, textDecoration: 'underline' }}>
            ← Back to Traces
          </a>
        </div>
      )}

      {!loading && !error && (
        <TraceDetailContent workflowId={traceId || 'unknown'} detail={detail} />
      )}
    </div>
  );
}
