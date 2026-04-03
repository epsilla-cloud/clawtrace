'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppNav } from '../app-nav/AppNav';
import styles from './TraceDetailPage.module.css';

/* ── Types ───────────────────────────────────────────────────────────────── */
interface TraceMeta {
  trace_id: string; agent_id: string | null;
  trace_start_ts_ms: number | null; trace_end_ts_ms: number | null;
  duration_ms: number; event_count: number;
}
interface SpanDetail {
  span_id: string; parent_span_id: string | null;
  actor_type: string; actor_label: string;
  span_start_ts_ms: number | null; span_end_ts_ms: number | null;
  duration_ms: number; input_tokens: number; output_tokens: number;
  total_tokens: number; cost_usd: number; has_error: number;
}
interface TraceDetailResponse { meta: TraceMeta; spans: SpanDetail[]; }

type Tab = 'timeline' | 'spans' | 'cost';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function spanUuid(eid: string) { return eid.replace(/^Span\[/, '').replace(/\]$/, ''); }
function traceUuid(eid: string) { return eid.replace(/^Trace\[/, '').replace(/\]$/, ''); }
function fmtMs(ms: number) {
  if (!ms) return '0ms';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms/1000).toFixed(2)}s`;
  return `${(ms/60000).toFixed(1)}m`;
}
function fmtTs(ms: number | null) {
  if (!ms) return '—';
  return new Date(ms).toLocaleString([], { month:'short', day:'numeric', hour:'numeric', minute:'2-digit', second:'2-digit', timeZoneName:'short' });
}
function fmtCost(usd: number) { return !usd ? '—' : usd < 0.001 ? `$${usd.toFixed(5)}` : `$${usd.toFixed(4)}`; }
function fmtTok(n: number) { return !n ? '—' : n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n); }

const ACTOR_COLORS: Record<string, { bar: string; badge: string; text: string }> = {
  model:   { bar: '#a4532b', badge: '#f5e2d0', text: '#7c3a0f' },
  tool:    { bar: '#5b3db5', badge: '#ede8fb', text: '#3d2080' },
  session: { bar: '#6b7280', badge: '#f3f4f6', text: '#374151' },
};
function actorColor(type: string) { return ACTOR_COLORS[type] ?? ACTOR_COLORS.session; }

/* ── Timeline tab (ECharts horizontal Gantt) ─────────────────────────────── */
function TimelineChart({ spans, traceStartMs }: { spans: SpanDetail[]; traceStartMs: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !spans.length) return;
    let chart: { setOption:(o:unknown,n?:boolean)=>void; resize:()=>void; dispose:()=>void } | null = null;
    let canceled = false;

    const labels  = spans.map((s, i) => `${i+1}. ${s.actor_label || s.actor_type}`);
    const offsets = spans.map(s => (s.span_start_ts_ms ?? traceStartMs) - traceStartMs);
    const durs    = spans.map(s => Math.max(s.duration_ms, 10));
    const colors  = spans.map(s => actorColor(s.actor_type).bar);

    const option = {
      animation: false,
      grid: { left: 180, right: 24, top: 16, bottom: 32 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#2b2522', borderWidth: 0,
        textStyle: { color: '#f7efe9', fontSize: 12 },
        formatter: (params: unknown) => {
          if (!Array.isArray(params)) return '';
          const idx = (params[0] as { dataIndex?: number }).dataIndex ?? 0;
          const s = spans[idx];
          return [
            `<b>${s.actor_label || s.actor_type}</b>`,
            `Type: ${s.actor_type}`,
            `Duration: ${fmtMs(s.duration_ms)}`,
            s.total_tokens ? `Tokens: ${fmtTok(s.total_tokens)}` : '',
            s.cost_usd ? `Cost: ${fmtCost(s.cost_usd)}` : '',
            s.has_error ? '<span style="color:#f87171">⚠ Error</span>' : '',
          ].filter(Boolean).join('<br/>');
        },
      },
      xAxis: {
        type: 'value', min: 0,
        axisLabel: { color: '#786a60', fontSize: 11, formatter: (v: number) => `+${fmtMs(v)}` },
        splitLine: { lineStyle: { color: '#e8ddd5', type: 'dashed' } },
        axisLine: { show: false }, axisTick: { show: false },
      },
      yAxis: {
        type: 'category', data: labels, inverse: false,
        axisLabel: {
          color: '#5a4534', fontSize: 11,
          formatter: (v: string) => v.length > 22 ? v.slice(0, 22) + '…' : v,
        },
        axisLine: { show: false }, axisTick: { show: false },
        splitLine: { show: false },
      },
      series: [
        // transparent offset bar
        { type: 'bar', stack: 'g', data: offsets, itemStyle: { color: 'transparent' }, silent: true },
        // actual duration bar
        {
          type: 'bar', stack: 'g', data: durs, barMaxWidth: 20,
          itemStyle: {
            color: (p: { dataIndex: number }) => colors[p.dataIndex],
            borderRadius: [0, 3, 3, 0],
          },
          label: {
            show: true, position: 'insideRight', color: '#fff', fontSize: 10,
            formatter: (p: { dataIndex: number }) => fmtMs(durs[p.dataIndex]),
          },
        },
      ],
    };

    const onResize = () => chart?.resize();
    void (async () => {
      const echarts = await import('echarts');
      if (canceled || !node) return;
      chart = echarts.init(node);
      chart.setOption(option, true);
      window.addEventListener('resize', onResize);
      const ro = new ResizeObserver(onResize);
      ro.observe(node);
      (chart as unknown as { _ro?: ResizeObserver })._ro = ro;
    })();

    return () => {
      canceled = true;
      window.removeEventListener('resize', onResize);
      (chart as unknown as { _ro?: ResizeObserver })?._ro?.disconnect();
      chart?.dispose();
    };
  }, [spans, traceStartMs]);

  return <div ref={ref} className={styles.gantt} />;
}

/* ── Spans tab (table) ───────────────────────────────────────────────────── */
function SpansTable({ spans, traceStartMs }: { spans: SpanDetail[]; traceStartMs: number }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th><th>Type</th><th>Label</th><th>Start offset</th>
            <th>Duration</th><th>Tokens</th><th>Cost</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {spans.map((s, i) => {
            const offset = (s.span_start_ts_ms ?? traceStartMs) - traceStartMs;
            const c = actorColor(s.actor_type);
            return (
              <tr key={s.span_id} className={s.has_error ? styles.rowError : ''}>
                <td className={styles.idx}>{i + 1}</td>
                <td>
                  <span className={styles.typeBadge}
                    style={{ background: c.badge, color: c.text }}>
                    {s.actor_type}
                  </span>
                </td>
                <td className={styles.label}>{s.actor_label || '—'}</td>
                <td className={styles.mono}>+{fmtMs(offset)}</td>
                <td className={styles.mono}>{fmtMs(s.duration_ms)}</td>
                <td>{fmtTok(s.total_tokens)}</td>
                <td>{fmtCost(s.cost_usd)}</td>
                <td>
                  <span className={`${styles.statusDot} ${s.has_error ? styles.statusErr : styles.statusOk}`} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Cost tab (ECharts pie + per-model table) ────────────────────────────── */
function CostView({ spans }: { spans: SpanDetail[] }) {
  const pieRef  = useRef<HTMLDivElement>(null);
  const tokRef  = useRef<HTMLDivElement>(null);

  // Aggregate by actor_label
  const byLabel: Record<string, { cost: number; tokens: number; count: number; type: string }> = {};
  for (const s of spans) {
    const key = s.actor_label || s.actor_type;
    if (!byLabel[key]) byLabel[key] = { cost: 0, tokens: 0, count: 0, type: s.actor_type };
    byLabel[key].cost   += s.cost_usd;
    byLabel[key].tokens += s.total_tokens;
    byLabel[key].count  += 1;
  }
  const rows = Object.entries(byLabel).sort((a, b) => b[1].cost - a[1].cost);
  const totalCost = rows.reduce((s, [, v]) => s + v.cost, 0);
  const totalTok  = rows.reduce((s, [, v]) => s + v.tokens, 0);

  const initPie = (node: HTMLDivElement | null, data: { name: string; value: number }[], title: string, fmtVal: (v:number)=>string) => {
    if (!node || !data.length) return () => {};
    let chart: { setOption:(o:unknown,n?:boolean)=>void; resize:()=>void; dispose:()=>void } | null = null;
    let canceled = false;
    const onResize = () => chart?.resize();
    void (async () => {
      const echarts = await import('echarts');
      if (canceled || !node) return;
      chart = echarts.init(node);
      chart.setOption({
        animation: false,
        tooltip: {
          trigger: 'item',
          backgroundColor: '#2b2522', borderWidth: 0,
          textStyle: { color: '#f7efe9', fontSize: 12 },
          formatter: (p: { name: string; value: number; percent: number }) =>
            `${p.name}<br/>${fmtVal(p.value)} (${p.percent.toFixed(1)}%)`,
        },
        legend: { orient: 'vertical', right: 8, top: 'center', textStyle: { color: '#5a4534', fontSize: 11 }, itemHeight: 10 },
        series: [{
          type: 'pie', radius: ['38%', '65%'], center: ['36%', '50%'],
          label: { show: false },
          data: data.map((d, i) => ({
            ...d,
            itemStyle: { color: ['#a4532b','#5b3db5','#c47a2f','#6b7280','#2f7a6b','#8b5cf6','#059669'][i % 7] },
          })),
        }],
      }, true);
      window.addEventListener('resize', onResize);
      const ro = new ResizeObserver(onResize);
      ro.observe(node);
      (chart as unknown as { _ro?: ResizeObserver })._ro = ro;
    })();
    return () => {
      canceled = true;
      window.removeEventListener('resize', onResize);
      (chart as unknown as { _ro?: ResizeObserver })?._ro?.disconnect();
      chart?.dispose();
    };
  };

  useEffect(() => {
    const costData = rows.filter(([,v]) => v.cost > 0).map(([k,v]) => ({ name: k, value: v.cost }));
    return initPie(pieRef.current, costData, 'Cost', v => `$${v.toFixed(5)}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spans]);

  useEffect(() => {
    const tokData = rows.filter(([,v]) => v.tokens > 0).map(([k,v]) => ({ name: k, value: v.tokens }));
    return initPie(tokRef.current, tokData, 'Tokens', v => fmtTok(v));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spans]);

  return (
    <div className={styles.costWrap}>
      <div className={styles.costCharts}>
        <div className={styles.costChart}>
          <p className={styles.costChartTitle}>Cost distribution</p>
          <div ref={pieRef} className={styles.pieArea} />
        </div>
        <div className={styles.costChart}>
          <p className={styles.costChartTitle}>Token distribution</p>
          <div ref={tokRef} className={styles.pieArea} />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr><th>Model / Tool</th><th>Type</th><th>Calls</th><th>Tokens</th><th>Cost</th><th>% Cost</th></tr>
        </thead>
        <tbody>
          {rows.map(([label, v]) => {
            const c = actorColor(v.type);
            return (
              <tr key={label}>
                <td className={styles.label}>{label}</td>
                <td><span className={styles.typeBadge} style={{ background: c.badge, color: c.text }}>{v.type}</span></td>
                <td>{v.count}</td>
                <td>{fmtTok(v.tokens)}</td>
                <td>{fmtCost(v.cost)}</td>
                <td>{totalCost ? `${(v.cost / totalCost * 100).toFixed(1)}%` : '—'}</td>
              </tr>
            );
          })}
          <tr className={styles.totalRow}>
            <td colSpan={3}><b>Total</b></td>
            <td><b>{fmtTok(totalTok)}</b></td>
            <td><b>{fmtCost(totalCost)}</b></td>
            <td>100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export function TraceDetailPage() {
  const searchParams = useSearchParams();
  const rawTraceId   = searchParams.get('traceId') ?? '';
  // Accept both "Trace[uuid]" and bare "uuid"
  const traceId = rawTraceId.startsWith('Trace[') ? traceUuid(rawTraceId) : rawTraceId;

  const [tab, setTab]       = useState<Tab>('timeline');
  const [detail, setDetail] = useState<TraceDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const load = useCallback(async () => {
    if (!traceId) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/traces/${encodeURIComponent(traceId)}`, { cache: 'no-store' });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail ?? `HTTP ${res.status}`);
      }
      setDetail(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load trace');
    } finally {
      setLoading(false);
    }
  }, [traceId]);

  useEffect(() => { load(); }, [load]);

  const traceStart = detail?.meta.trace_start_ts_ms ?? 0;

  return (
    <div className={styles.shell}>
      <AppNav />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <a href="/traces" className={styles.back}>← Traces</a>
            <h1 className={styles.title}>
              {traceId ? <><code className={styles.tid}>{traceId.slice(0, 8)}…</code></> : 'Trace'}
            </h1>
          </div>
          {detail?.meta && (
            <div className={styles.metaRow}>
              <span className={styles.metaItem}><span className={styles.metaLabel}>Started</span>{fmtTs(detail.meta.trace_start_ts_ms)}</span>
              <span className={styles.metaItem}><span className={styles.metaLabel}>Duration</span>{fmtMs(detail.meta.duration_ms)}</span>
              <span className={styles.metaItem}><span className={styles.metaLabel}>Spans</span>{detail.spans.length}</span>
              <span className={styles.metaItem}><span className={styles.metaLabel}>Events</span>{detail.meta.event_count}</span>
              {detail.spans.some(s => s.has_error) && (
                <span className={`${styles.metaItem} ${styles.metaError}`}>⚠ Errors</span>
              )}
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {loading && <div className={styles.loading}>Loading trace…</div>}

        {detail && !loading && (
          <>
            {/* Tabs */}
            <div className={styles.tabs}>
              {(['timeline', 'spans', 'cost'] as Tab[]).map(t => (
                <button key={t} type="button"
                  className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                  onClick={() => setTab(t)}>
                  {t === 'timeline' ? '⏱ Timeline' : t === 'spans' ? '📋 Spans' : '💰 Cost'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === 'timeline' && (
              <div className={styles.section}>
                <TimelineChart spans={detail.spans} traceStartMs={traceStart} />
              </div>
            )}
            {tab === 'spans' && (
              <div className={styles.section}>
                <SpansTable spans={detail.spans} traceStartMs={traceStart} />
              </div>
            )}
            {tab === 'cost' && (
              <div className={styles.section}>
                <CostView spans={detail.spans} />
              </div>
            )}
          </>
        )}

        {!traceId && !loading && (
          <div className={styles.empty}>
            No trace selected. Go back to <a href="/traces" className={styles.link}>Traces</a> and click a row.
          </div>
        )}
      </main>
    </div>
  );
}
