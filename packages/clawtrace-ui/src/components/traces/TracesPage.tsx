'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppNav } from '../app-nav/AppNav';
import styles from './TracesPage.module.css';

/* ── Types ───────────────────────────────────────────────────────────────── */
interface Agent { id: string; name: string; key_prefix: string; }
interface TraceMetrics { total_traces: number; total_tokens: number; total_cost_usd: number; success_rate: number; }
interface TrendPoint { date: string; run_count: number; cost_usd: number; }
interface TraceRow {
  trace_id: string; started_at_ms: number | null; duration_ms: number | null;
  event_count: number | null; input_tokens: number; output_tokens: number;
  total_tokens: number; cost_usd: number; has_error: number;
}
interface TracesResponse { metrics: TraceMetrics; trends: TrendPoint[]; traces: TraceRow[]; }

const MS_PER_DAY = 86_400_000;
const PRESETS = [
  { label: '1 day',   ms: MS_PER_DAY },
  { label: '7 days',  ms: 7 * MS_PER_DAY },
  { label: '30 days', ms: 30 * MS_PER_DAY },
];

/* ── ECharts chart (WorkflowPortfolio pattern + ResizeObserver) ──────────── */
interface ChartProps {
  title: string; categories: string[]; values: number[];
  lineColor: string; areaTop: string; areaBottom: string;
  valueMode: 'number' | 'currency';
}

function TraceChart({ title, categories, values, lineColor, areaTop, areaBottom, valueMode }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = chartRef.current;
    if (!node) return;
    let chart: { setOption:(o:unknown,n?:boolean)=>void; resize:()=>void; dispose:()=>void } | null = null;
    let canceled = false;
    let ro: ResizeObserver | null = null;

    const yMax = values.length ? Math.max(...values) * 1.25 || 1 : 1;
    const onResize = () => chart?.resize();

    const option = {
      animation: false,
      grid: { left: 50, right: 14, top: 12, bottom: 32 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line', lineStyle: { color: '#bca89a', width: 1 } },
        backgroundColor: '#2b2522', borderWidth: 0,
        textStyle: { color: '#f7efe9', fontSize: 12 },
        formatter: (params: unknown) => {
          const d = Array.isArray(params) && params.length
            ? params[0] as { axisValueLabel?: string; value?: number } : null;
          if (!d) return '';
          const v = typeof d.value === 'number' ? d.value : 0;
          const fmt = valueMode === 'currency'
            ? (v < 0.001 ? `$${v.toFixed(5)}` : `$${v.toFixed(4)}`)
            : String(Math.round(v));
          return `${d.axisValueLabel ?? ''}<br/>${fmt}`;
        },
      },
      xAxis: {
        type: 'category', data: categories, boundaryGap: false,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: '#d2c2b7', width: 1.2 } },
        axisLabel: { color: '#786a60', fontSize: 11, margin: 12 },
      },
      yAxis: {
        type: 'value', min: 0, max: yMax, splitNumber: 3,
        axisLine: { show: false }, axisTick: { show: false },
        splitLine: { lineStyle: { color: '#e8ddd5', type: 'dashed' } },
        axisLabel: {
          color: '#7a6a5e', fontSize: 11, margin: 10,
          formatter: (v: number) => valueMode === 'currency'
            ? (v >= 1 ? `$${v.toFixed(2)}` : `$${v.toFixed(3)}`)
            : `${Math.round(v)}`,
        },
      },
      series: [{
        type: 'line', data: values, smooth: 0.32, symbol: 'circle', symbolSize: 6,
        lineStyle: { color: lineColor, width: 2.8 },
        itemStyle: { color: '#fff', borderColor: lineColor, borderWidth: 2 },
        areaStyle: {
          color: { type: 'linear', x:0, y:0, x2:0, y2:1,
            colorStops: [{ offset:0, color:areaTop }, { offset:1, color:areaBottom }] },
        },
      }],
    };

    void (async () => {
      const echarts = await import('echarts');
      if (canceled || !node) return;
      chart = echarts.init(node);
      chart.setOption(option, true);
      window.addEventListener('resize', onResize);
      ro = new ResizeObserver(onResize);
      ro.observe(node);
    })();

    return () => {
      canceled = true;
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
      chart?.dispose();
    };
  }, [categories, values, lineColor, areaTop, areaBottom, valueMode]);

  return (
    <div className={styles.chartCard}>
      <p className={styles.chartTitle}>{title}</p>
      <div ref={chartRef} className={styles.chartArea} />
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function fmtDuration(ms: number | null) {
  if (!ms) return '—';
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}
// Browser local timezone
function fmtTs(ms: number | null) {
  if (!ms) return '—';
  return new Date(ms).toLocaleString([], {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    timeZoneName: 'short',
  });
}
function fmtCost(usd: number) {
  if (!usd) return '—';
  return usd < 0.001 ? `$${usd.toFixed(5)}` : `$${usd.toFixed(4)}`;
}
function fmtTokens(n: number) {
  if (!n) return '—';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
function traceUuid(eid: string) {
  const m = eid.match(/\[(.+)\]/);
  return m ? m[1] : eid;
}
// Convert local date input "YYYY-MM-DD" to start-of-day ms
function dateToMs(s: string, endOfDay = false): number {
  const d = new Date(s);
  if (endOfDay) { d.setHours(23, 59, 59, 999); } else { d.setHours(0,0,0,0); }
  return d.getTime();
}
function msToDateInput(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

const DEBOUNCE_MS = 400;

/* ── Main component ──────────────────────────────────────────────────────── */
export function TracesPage() {
  const searchParams   = useSearchParams();
  const initialAgentId = searchParams.get('agentId') ?? '';

  const [agents, setAgents]     = useState<Agent[]>([]);
  const [agentId, setAgentId]   = useState(initialAgentId);
  const [presetIdx, setPresetIdx] = useState<number | null>(1);
  const [customFrom, setCustomFrom] = useState(msToDateInput(Date.now() - 7 * MS_PER_DAY));
  const [customTo,   setCustomTo]   = useState(msToDateInput(Date.now()));
  const [data, setData]   = useState<TracesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Refs for debounce timer and in-flight request cancellation
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef    = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch('/api/agents', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const list: Agent[] = d.agents ?? [];
        setAgents(list);
        if (!agentId && list.length > 0) setAgentId(list[0].id);
      })
      .catch(() => setError('Failed to load agents'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Core fetch — called after debounce, with fresh AbortController
  const fetchTraces = useCallback(async (aid: string, pidx: number | null, cfrom: string, cto: string) => {
    // Cancel any previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Compute range at fetch time (avoids Date.now() in render loop)
    const now = Date.now();
    const fromMs = pidx !== null ? now - PRESETS[pidx].ms : dateToMs(cfrom);
    const toMs   = pidx !== null ? now : dateToMs(cto, true);

    setLoading(true); setError('');
    try {
      const res = await fetch(
        `/api/traces?agent_id=${aid}&from_ms=${fromMs}&to_ms=${toMs}`,
        { cache: 'no-store', signal: controller.signal }
      );
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail ?? `HTTP ${res.status}`);
      }
      setData(await res.json());
    } catch (e: unknown) {
      if ((e as Error).name === 'AbortError') return; // cancelled — ignore
      setError(e instanceof Error ? e.message : 'Failed to load traces');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced trigger — runs whenever query params change
  const scheduleLoad = useCallback((aid: string, pidx: number | null, cfrom: string, cto: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (aid) fetchTraces(aid, pidx, cfrom, cto);
    }, DEBOUNCE_MS);
  }, [fetchTraces]);

  // Fire on first mount and whenever inputs change
  useEffect(() => {
    scheduleLoad(agentId, presetIdx, customFrom, customTo);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [agentId, presetIdx, customFrom, customTo, scheduleLoad]);

  // Manual refresh (bypasses debounce, cancels previous immediately)
  const loadTraces = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (agentId) fetchTraces(agentId, presetIdx, customFrom, customTo);
  }, [agentId, presetIdx, customFrom, customTo, fetchTraces]);

  const categories = data?.trends.map(t => t.date) ?? [];
  const runValues  = data?.trends.map(t => t.run_count) ?? [];
  const costValues = data?.trends.map(t => t.cost_usd) ?? [];

  return (
    <div className={styles.shell}>
      <AppNav />
      <main className={styles.main}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <h1 className={styles.title}>Traces</h1>

          {/* Controls: agent + time range on the right */}
          <div className={styles.controls}>
            <select className={styles.agentSelect} value={agentId}
              onChange={e => setAgentId(e.target.value)}>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>

            <div className={styles.timeRange}>
              {PRESETS.map((p, i) => (
                <button key={p.label} type="button"
                  className={`${styles.rangeBtn} ${presetIdx === i ? styles.rangeBtnActive : ''}`}
                  onClick={() => setPresetIdx(i)}>{p.label}</button>
              ))}
              <button type="button"
                className={`${styles.rangeBtn} ${presetIdx === null ? styles.rangeBtnActive : ''}`}
                onClick={() => setPresetIdx(null)}>Custom</button>
            </div>

            {presetIdx === null && (
              <div className={styles.customRange}>
                <input type="date" className={styles.dateInput}
                  value={customFrom} max={customTo}
                  onChange={e => setCustomFrom(e.target.value)} />
                <span className={styles.dateSep}>→</span>
                <input type="date" className={styles.dateInput}
                  value={customTo} min={customFrom}
                  onChange={e => setCustomTo(e.target.value)} />
              </div>
            )}

            <button type="button" className={styles.refreshBtn} onClick={loadTraces} title="Refresh">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 8A6 6 0 1 1 8.5 2.1M14 2v4h-4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* ── Metrics ────────────────────────────────────────────────────── */}
        <div className={styles.metrics}>
          {[
            { label: 'Total Traces', value: data?.metrics.total_traces.toLocaleString() ?? '—' },
            { label: 'Total Tokens', value: fmtTokens(data?.metrics.total_tokens ?? 0) },
            { label: 'Total Cost',   value: fmtCost(data?.metrics.total_cost_usd ?? 0) },
            { label: 'Success Rate', value: data ? `${(data.metrics.success_rate * 100).toFixed(1)}%` : '—' },
          ].map(m => (
            <div key={m.label} className={styles.metricCard}>
              <p className={styles.metricLabel}>{m.label}</p>
              <p className={styles.metricValue}>{loading ? '…' : m.value}</p>
            </div>
          ))}
        </div>

        {/* ── ECharts charts ─────────────────────────────────────────────── */}
        <div className={styles.charts}>
          <TraceChart title="Agent runs over time"
            categories={categories} values={runValues}
            lineColor="#a4532b" areaTop="rgba(164,83,43,0.18)" areaBottom="rgba(164,83,43,0.02)"
            valueMode="number" />
          <TraceChart title="Token cost over time (USD)"
            categories={categories} values={costValues}
            lineColor="#5b3db5" areaTop="rgba(91,61,181,0.14)" areaBottom="rgba(91,61,181,0.02)"
            valueMode="currency" />
        </div>

        {/* ── Traces table ────────────────────────────────────────────────── */}
        <div className={styles.tableWrap}>
          {loading && <div className={styles.loading}>Loading traces…</div>}
          {!loading && data && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Trace</th><th>Started</th><th>Duration</th><th>Events</th>
                  <th>Input tokens</th><th>Output tokens</th><th>Cost</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.traces.length === 0 && (
                  <tr><td colSpan={8} className={styles.empty}>No traces in this time range.</td></tr>
                )}
                {data.traces.map(t => (
                  <tr key={t.trace_id} className={`${styles.traceRow} ${t.has_error ? styles.rowError : ''}`}
                    onClick={() => { window.location.href = `/trace?traceId=${traceUuid(t.trace_id)}`; }}
                    title="Click to drill into trace">
                    <td className={styles.traceId}>
                      <a href={`/trace?traceId=${traceUuid(t.trace_id)}`} className={styles.traceLink}
                        onClick={e => e.stopPropagation()}>
                        <code>{traceUuid(t.trace_id).slice(0, 8)}…</code>
                      </a>
                    </td>
                    <td>{fmtTs(t.started_at_ms)}</td>
                    <td>{fmtDuration(t.duration_ms)}</td>
                    <td>{t.event_count ?? '—'}</td>
                    <td>{fmtTokens(t.input_tokens)}</td>
                    <td>{fmtTokens(t.output_tokens)}</td>
                    <td>{fmtCost(t.cost_usd)}</td>
                    <td><span className={`${styles.badge} ${t.has_error ? styles.badgeError : styles.badgeOk}`}>
                      {t.has_error ? 'error' : 'ok'}
                    </span></td>
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
