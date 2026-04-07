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
  const [loading, setLoading]   = useState(true);
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
      if (res.status === 401) { window.location.href = '/login'; return; }
      if (res.status === 404) throw new Error('Trajectory not found. It may have expired or the ID may be incorrect.');
      if (res.status >= 500) { window.location.href = '/trace'; return; }
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: 20, background: '#faf4ec' }}>
          {/* Skeleton breadcrumb */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 80, height: 14, borderRadius: 6, background: '#f0e4d4', animation: 'ct-pulse 1.4s ease-in-out infinite' }} />
            <div style={{ width: 12, height: 14, borderRadius: 4, background: '#f0e4d4', animation: 'ct-pulse 1.4s ease-in-out infinite' }} />
            <div style={{ width: 120, height: 14, borderRadius: 6, background: '#f0e4d4', animation: 'ct-pulse 1.4s ease-in-out infinite' }} />
          </div>
          {/* Skeleton panels */}
          <div style={{ display: 'flex', gap: 12, flex: 1 }}>
            <div style={{ flex: '0 0 260px', borderRadius: 12, background: '#f0e4d4', animation: 'ct-pulse 1.4s ease-in-out infinite' }} />
            <div style={{ flex: 1, borderRadius: 12, background: '#f0e4d4', animation: 'ct-pulse 1.4s ease-in-out infinite' }} />
          </div>
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
