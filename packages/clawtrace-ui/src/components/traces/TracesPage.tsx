'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppNav } from '../app-nav/AppNav';
import styles from './TracesPage.module.css';

/* ── Types (mirror backend response) ──────────────────────────────────────── */
interface Agent { id: string; name: string; key_prefix: string; }
interface TraceMetrics { total_traces: number; total_tokens: number; total_cost_usd: number; success_rate: number; }
interface TrendPoint { date: string; run_count: number; cost_usd: number; }
interface TraceRow {
  trace_id: string; started_at_ms: number | null; duration_ms: number | null;
  event_count: number | null; input_tokens: number; output_tokens: number;
  total_tokens: number; cost_usd: number; has_error: number;
}
interface TracesResponse { metrics: TraceMetrics; trends: TrendPoint[]; traces: TraceRow[]; }

/* ── Time range options ────────────────────────────────────────────────────── */
const TIME_RANGES = [
  { label: '1d',  ms: 86_400_000 },
  { label: '7d',  ms: 7 * 86_400_000 },
  { label: '30d', ms: 30 * 86_400_000 },
];

/* ── Mini bar chart (canvas-based, no dependency) ─────────────────────────── */
function MiniChart({ data, color, label }: {
  data: number[]; color: string; label: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const max = Math.max(...data, 1);
    ctx.clearRect(0, 0, W, H);
    const bw = W / data.length - 2;
    data.forEach((v, i) => {
      const h = (v / max) * (H - 8);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(i * (bw + 2), H - h, bw, h, 2);
      ctx.fill();
    });
  }, [data, color]);
  return (
    <div className={styles.chartWrap}>
      <p className={styles.chartLabel}>{label}</p>
      <canvas ref={ref} width={200} height={60} className={styles.chartCanvas} />
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */
function fmt(ms: number | null): string {
  if (!ms) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
function fmtDate(ms: number | null): string {
  if (!ms) return '—';
  return new Date(ms).toLocaleString([], { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
}
function fmtCost(usd: number): string {
  if (!usd) return '—';
  return `$${usd.toFixed(usd < 0.01 ? 5 : 4)}`;
}
function fmtTokens(n: number): string {
  if (!n) return '—';
  return n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n);
}
function traceUuid(eid: string): string {
  const m = eid.match(/\[(.+)\]/);
  return m ? m[1] : eid;
}

/* ── Main component ────────────────────────────────────────────────────────── */
export function TracesPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentId, setAgentId] = useState('');
  const [rangeIdx, setRangeIdx] = useState(1); // default 7d
  const [data, setData] = useState<TracesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* Load agent list */
  useEffect(() => {
    fetch('/api/agents', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const list: Agent[] = d.agents ?? [];
        setAgents(list);
        if (list.length > 0) setAgentId(list[0].id);
      })
      .catch(() => setError('Failed to load agents'));
  }, []);

  /* Load traces when agent or range changes */
  const loadTraces = useCallback(async () => {
    if (!agentId) return;
    setLoading(true);
    setError('');
    const now = Date.now();
    const fromMs = now - TIME_RANGES[rangeIdx].ms;
    try {
      const res = await fetch(
        `/api/traces?agent_id=${agentId}&from_ms=${fromMs}&to_ms=${now}`,
        { cache: 'no-store' }
      );
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail ?? `HTTP ${res.status}`);
      }
      setData(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load traces');
    } finally {
      setLoading(false);
    }
  }, [agentId, rangeIdx]);

  useEffect(() => { loadTraces(); }, [loadTraces]);

  const runData   = useMemo(() => data?.trends.map(t => t.run_count)   ?? [], [data]);
  const costData  = useMemo(() => data?.trends.map(t => t.cost_usd)    ?? [], [data]);

  return (
    <div className={styles.shell}>
      <AppNav />
      <main className={styles.main}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Traces</h1>
            <select
              className={styles.agentSelect}
              value={agentId}
              onChange={e => setAgentId(e.target.value)}
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.timeRange}>
            {TIME_RANGES.map((r, i) => (
              <button
                key={r.label}
                type="button"
                className={`${styles.rangeBtn} ${i === rangeIdx ? styles.rangeBtnActive : ''}`}
                onClick={() => setRangeIdx(i)}
              >
                {r.label}
              </button>
            ))}
            <button type="button" className={styles.refreshBtn} onClick={loadTraces} title="Refresh">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 8A6 6 0 1 1 8.5 2.1M14 2v4h-4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* ── Metrics row ─────────────────────────────────────────────────── */}
        <div className={styles.metrics}>
          {[
            { label: 'Total Traces',  value: data?.metrics.total_traces.toLocaleString() ?? '—' },
            { label: 'Total Tokens',  value: fmtTokens(data?.metrics.total_tokens ?? 0) },
            { label: 'Total Cost',    value: fmtCost(data?.metrics.total_cost_usd ?? 0) },
            { label: 'Success Rate',  value: data ? `${(data.metrics.success_rate * 100).toFixed(1)}%` : '—' },
          ].map(m => (
            <div key={m.label} className={styles.metricCard}>
              <p className={styles.metricLabel}>{m.label}</p>
              <p className={styles.metricValue}>{loading ? '…' : m.value}</p>
            </div>
          ))}
        </div>

        {/* ── Trend charts ────────────────────────────────────────────────── */}
        {data && (
          <div className={styles.charts}>
            <MiniChart data={runData}  color="#a4532b" label="Agent runs over time" />
            <MiniChart data={costData} color="#5b3db5" label="Token cost over time (USD)" />
          </div>
        )}

        {/* ── Traces table ────────────────────────────────────────────────── */}
        <div className={styles.tableWrap}>
          {loading && <div className={styles.loading}>Loading traces…</div>}
          {!loading && data && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Trace</th>
                  <th>Started</th>
                  <th>Duration</th>
                  <th>Events</th>
                  <th>Input tokens</th>
                  <th>Output tokens</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.traces.length === 0 && (
                  <tr><td colSpan={8} className={styles.empty}>No traces in this time range.</td></tr>
                )}
                {data.traces.map(t => (
                  <tr key={t.trace_id} className={t.has_error ? styles.rowError : ''}>
                    <td className={styles.traceId}>
                      <code>{traceUuid(t.trace_id).slice(0, 8)}…</code>
                    </td>
                    <td>{fmtDate(t.started_at_ms)}</td>
                    <td>{fmt(t.duration_ms)}</td>
                    <td>{t.event_count ?? '—'}</td>
                    <td>{fmtTokens(t.input_tokens)}</td>
                    <td>{fmtTokens(t.output_tokens)}</td>
                    <td>{fmtCost(t.cost_usd)}</td>
                    <td>
                      <span className={`${styles.badge} ${t.has_error ? styles.badgeError : styles.badgeOk}`}>
                        {t.has_error ? 'error' : 'ok'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
