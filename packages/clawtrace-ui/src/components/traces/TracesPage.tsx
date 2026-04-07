'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppNav } from '../app-nav/AppNav';
import styles from './TracesPage.module.css';

/* ── Types ───────────────────────────────────────────────────────────────── */
interface Agent { id: string; name: string; key_prefix: string; }
interface TraceMetrics { total_traces: number; total_tokens: number; total_input_tokens: number; total_output_tokens: number; success_rate: number; }
interface TrendPoint { date: string; run_count: number; input_tokens: number; output_tokens: number; }
interface TraceRow {
  trace_id: string; started_at_ms: number | null; duration_ms: number | null;
  event_count: number | null; input_tokens: number; output_tokens: number;
  total_tokens: number; has_error: number; category: string;
}
interface TracesResponse { metrics: TraceMetrics; trends: TrendPoint[]; traces: TraceRow[]; }

const MS_PER_DAY = 86_400_000;
const PRESETS = [
  { label: '1 day',   ms: MS_PER_DAY },
  { label: '7 days',  ms: 7 * MS_PER_DAY },
  { label: '30 days', ms: 30 * MS_PER_DAY },
];
const PAGE_SIZES = [5, 10, 20, 50, 100];
const FALLBACK_INPUT_RATE = 4.0;
const FALLBACK_OUTPUT_RATE = 12.0;

function estimateCost(inputTokens: number, outputTokens: number): number {
  return (inputTokens * FALLBACK_INPUT_RATE + outputTokens * FALLBACK_OUTPUT_RATE) / 1_000_000;
}

/* ── ECharts bar chart ──────────────────────────────────────────────────── */
interface BarChartProps {
  title: string; categories: string[]; values: number[];
  barColor: string; valueMode: 'number' | 'compact' | 'currency';
}

function BarChart({ title, categories, values, barColor, valueMode }: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = chartRef.current;
    if (!node) return;
    let chart: { setOption:(o:unknown,n?:boolean)=>void; resize:()=>void; dispose:()=>void } | null = null;
    let canceled = false;
    let ro: ResizeObserver | null = null;
    const yMax = values.length ? Math.max(...values) * 1.3 || 1 : 1;
    const onResize = () => chart?.resize();

    const fmtVal = (v: number) => {
      if (valueMode === 'currency') return v < 0.01 ? `$${v.toFixed(4)}` : `$${v.toFixed(2)}`;
      if (valueMode === 'compact') return v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : String(Math.round(v));
      return String(Math.round(v));
    };

    const option = {
      animation: false,
      grid: { left: 42, right: 8, top: 6, bottom: 22 },
      tooltip: {
        trigger: 'axis', backgroundColor: '#2b2522', borderWidth: 0,
        textStyle: { color: '#f7efe9', fontSize: 11 },
        formatter: (params: unknown) => {
          const d = Array.isArray(params) && params.length ? params[0] as { axisValueLabel?: string; value?: number } : null;
          if (!d) return '';
          return `${d.axisValueLabel ?? ''}<br/>${fmtVal(typeof d.value === 'number' ? d.value : 0)}`;
        },
      },
      xAxis: {
        type: 'category', data: categories,
        axisTick: { show: false }, axisLine: { lineStyle: { color: '#e0d4c6' } },
        axisLabel: { color: '#a09080', fontSize: 9, interval: 'auto', rotate: categories.length > 14 ? 30 : 0 },
      },
      yAxis: {
        type: 'value', min: 0, max: yMax, splitNumber: 2,
        axisLine: { show: false }, axisTick: { show: false },
        splitLine: { lineStyle: { color: '#ede3d8', type: 'dashed' } },
        axisLabel: { color: '#a09080', fontSize: 9, formatter: (v: number) => fmtVal(v) },
      },
      series: [{
        type: 'bar', data: values, barWidth: '55%',
        itemStyle: { color: barColor, borderRadius: [2, 2, 0, 0] },
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

    return () => { canceled = true; window.removeEventListener('resize', onResize); ro?.disconnect(); chart?.dispose(); };
  }, [categories, values, barColor, valueMode]);

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
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const totalSec = Math.round(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}
function fmtTs(ms: number | null) {
  if (!ms) return '—';
  return new Date(ms).toLocaleString([], {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    timeZoneName: 'short',
  });
}
function fmtTokens(n: number) {
  if (!n) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
function fmtCost(usd: number) {
  if (!usd) return '$0';
  return usd < 0.01 ? `$${usd.toFixed(4)}` : `$${usd.toFixed(2)}`;
}
function traceUuid(eid: string) {
  const m = eid.match(/\[(.+)\]/);
  return m ? m[1] : eid;
}
function dateToMs(s: string, endOfDay = false): number {
  const d = new Date(s);
  if (endOfDay) { d.setHours(23, 59, 59, 999); } else { d.setHours(0, 0, 0, 0); }
  return d.getTime();
}
function msToDateInput(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Bucket trends by adaptive time range */
function bucketTrends(trends: TrendPoint[], rangeDays: number, traces: TraceRow[]): TrendPoint[] {
  // 1 day: bucket by hour from the traces list (backend only has daily granularity)
  if (rangeDays <= 1) {
    const hourBuckets = new Map<string, TrendPoint>();
    for (const t of traces) {
      if (!t.started_at_ms) continue;
      const d = new Date(t.started_at_ms);
      const key = `${String(d.getHours()).padStart(2, '0')}:00`;
      const existing = hourBuckets.get(key);
      if (existing) {
        existing.run_count += 1;
        existing.input_tokens += t.input_tokens;
        existing.output_tokens += t.output_tokens;
      } else {
        hourBuckets.set(key, { date: key, run_count: 1, input_tokens: t.input_tokens, output_tokens: t.output_tokens });
      }
    }
    return [...hourBuckets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }

  // 2-15 days: daily (already bucketed by backend)
  if (rangeDays <= 15) return trends;

  // 16+ days: group by week or month
  const buckets = new Map<string, TrendPoint>();
  for (const t of trends) {
    let key: string;
    if (rangeDays <= 90) {
      const d = new Date(t.date);
      d.setDate(d.getDate() - d.getDay());
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    } else {
      key = t.date.slice(0, 7);
    }
    const existing = buckets.get(key);
    if (existing) {
      existing.run_count += t.run_count;
      existing.input_tokens += t.input_tokens;
      existing.output_tokens += t.output_tokens;
    } else {
      buckets.set(key, { date: key, run_count: t.run_count, input_tokens: t.input_tokens, output_tokens: t.output_tokens });
    }
  }
  return [...buckets.values()].sort((a, b) => a.date.localeCompare(b.date));
}

const DEBOUNCE_MS = 400;

/* ── Main component ──────────────────────────────────────────────────────── */
export function TracesPage({ initialAgent }: { initialAgent?: string } = {}) {
  const searchParams   = useSearchParams();
  const initialAgentId = initialAgent || searchParams.get('agentId') || '';

  const [agents, setAgents]     = useState<Agent[]>([]);
  const [agentId, setAgentId]   = useState(initialAgentId);
  const [presetIdx, setPresetIdx] = useState<number | null>(0); // default 1 day
  const [customFrom, setCustomFrom] = useState(msToDateInput(Date.now() - 7 * MS_PER_DAY));
  const [customTo,   setCustomTo]   = useState(msToDateInput(Date.now()));
  const [data, setData]   = useState<TracesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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

  const fetchTraces = useCallback(async (aid: string, pidx: number | null, cfrom: string, cto: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const now = Date.now();
    const fromMs = pidx !== null ? now - PRESETS[pidx].ms : dateToMs(cfrom);
    const toMs   = pidx !== null ? now : dateToMs(cto, true);
    setLoading(true); setError('');
    try {
      const res = await fetch(
        `/api/traces?agent_id=${aid}&from_ms=${fromMs}&to_ms=${toMs}&limit=500`,
        { cache: 'no-store', signal: controller.signal }
      );
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail ?? `HTTP ${res.status}`);
      }
      setData(await res.json());
      setPage(0);
    } catch (e: unknown) {
      if ((e as Error).name === 'AbortError') return;
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally { setLoading(false); }
  }, []);

  const scheduleLoad = useCallback((aid: string, pidx: number | null, cfrom: string, cto: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { if (aid) fetchTraces(aid, pidx, cfrom, cto); }, DEBOUNCE_MS);
  }, [fetchTraces]);

  useEffect(() => {
    scheduleLoad(agentId, presetIdx, customFrom, customTo);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [agentId, presetIdx, customFrom, customTo, scheduleLoad]);

  const loadTraces = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (agentId) fetchTraces(agentId, presetIdx, customFrom, customTo);
  }, [agentId, presetIdx, customFrom, customTo, fetchTraces]);

  // Compute chart data
  const rangeDays = presetIdx !== null ? PRESETS[presetIdx].ms / MS_PER_DAY : Math.max(1, (dateToMs(customTo, true) - dateToMs(customFrom)) / MS_PER_DAY);
  const bucketed = bucketTrends(data?.trends ?? [], rangeDays, data?.traces ?? []);
  const chartLabels = bucketed.map(t => t.date);
  const trajValues = bucketed.map(t => t.run_count);
  const inputValues = bucketed.map(t => t.input_tokens);
  const outputValues = bucketed.map(t => t.output_tokens);
  const costValues = bucketed.map(t => estimateCost(t.input_tokens, t.output_tokens));

  // Metric totals
  const totalInputTokens = data?.metrics.total_input_tokens ?? 0;
  const totalOutputTokens = data?.metrics.total_output_tokens ?? 0;
  const totalCost = estimateCost(totalInputTokens, totalOutputTokens);

  // Pagination
  const traces = data?.traces ?? [];
  const totalPages = Math.max(1, Math.ceil(traces.length / pageSize));
  const pagedTraces = traces.slice(page * pageSize, (page + 1) * pageSize);

  const catClass = (cat: string) => {
    if (cat === 'Heartbeat') return styles.catHeartbeat;
    if (cat === 'Compact Memory') return styles.catCompact;
    return styles.catWork;
  };

  const embedded = !!initialAgent;

  return (
    <div className={embedded ? styles.main : styles.shell}>
      {!embedded && <AppNav />}
      <main className={styles.main}>

        {!embedded && <h1 className={styles.title}>Agent Trajectories Dashboard</h1>}

        <div className={styles.controls}>
          {!embedded && (
            <select className={styles.agentSelect} value={agentId}
              onChange={e => setAgentId(e.target.value)}>
              {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          )}

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

        {error && <div className={styles.error}>{error}</div>}

        {/* Row 3: 4 metric cards */}
        <div className={styles.metrics}>
          {[
            { label: 'Total Trajectories', value: data?.metrics.total_traces.toLocaleString() ?? '—' },
            { label: 'Total Input Tokens', value: fmtTokens(totalInputTokens) },
            { label: 'Total Output Tokens', value: fmtTokens(totalOutputTokens) },
            { label: 'Estimated Token Cost', value: fmtCost(totalCost) },
          ].map(m => (
            <div key={m.label} className={styles.metricCard}>
              <p className={styles.metricLabel}>{m.label}</p>
              <p className={styles.metricValue}>{loading ? '…' : m.value}</p>
            </div>
          ))}
        </div>

        {/* Row 4: 4 bar charts */}
        <div className={styles.charts}>
          <BarChart title="Trajectories Over Time" categories={chartLabels} values={trajValues}
            barColor="#a4532b" valueMode="number" />
          <BarChart title="Input Token Usage Over Time" categories={chartLabels} values={inputValues}
            barColor="#5b3db5" valueMode="compact" />
          <BarChart title="Output Token Usage Over Time" categories={chartLabels} values={outputValues}
            barColor="#2f7a6b" valueMode="compact" />
          <BarChart title="Estimated Cost Over Time" categories={chartLabels} values={costValues}
            barColor="#c47a2f" valueMode="currency" />
        </div>

        {/* Table with pagination */}
        <div className={styles.tableSection}>
          <div className={styles.tableWrap}>
            {loading && <div className={styles.loading}>Loading…</div>}
            {!loading && data && (
              <>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Trajectory ID</th><th>Category</th><th>Started At</th>
                      <th>Duration</th><th>Total Events Observed</th>
                      <th>Input Tokens</th><th>Output Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedTraces.length === 0 && (
                      <tr><td colSpan={7} className={styles.empty}>No trajectories in this time range.</td></tr>
                    )}
                    {pagedTraces.map(t => (
                      <tr key={t.trace_id} className={styles.traceRow}
                        onClick={() => { window.location.href = `/trace/${agentId}/${traceUuid(t.trace_id)}`; }}
                        title="Click to drill into trace">
                        <td className={styles.traceId}>
                          <a href={`/trace/${agentId}/${traceUuid(t.trace_id)}`} className={styles.traceLink}
                            onClick={e => e.stopPropagation()}>
                            <code>{traceUuid(t.trace_id).slice(0, 8)}…</code>
                          </a>
                        </td>
                        <td><span className={`${styles.catBadge} ${catClass(t.category)}`}>{t.category}</span></td>
                        <td>{fmtTs(t.started_at_ms)}</td>
                        <td>{fmtDuration(t.duration_ms)}</td>
                        <td>{t.event_count ?? '—'}</td>
                        <td>{fmtTokens(t.input_tokens)}</td>
                        <td>{fmtTokens(t.output_tokens)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className={styles.pagination}>
                  <div className={styles.pageNumbers}>
                    <button type="button" className={styles.pageArrow} disabled={page === 0}
                      onClick={() => setPage(p => p - 1)}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} type="button"
                        className={`${styles.pageNumBtn} ${page === i ? styles.pageNumBtnActive : ''}`}
                        onClick={() => setPage(i)}>{i + 1}</button>
                    ))}
                    <button type="button" className={styles.pageArrow} disabled={page >= totalPages - 1}
                      onClick={() => setPage(p => p + 1)}>›</button>
                  </div>
                  <div className={styles.pageSizeWrap}>
                    <span className={styles.pageSizeLabel}>Per page</span>
                    <select className={styles.pageSizeSelect} value={pageSize}
                      onChange={e => { setPageSize(Number(e.target.value)); setPage(0); }}>
                      {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
