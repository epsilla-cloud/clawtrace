'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './UsagePage.module.css';

/* ── Types ─────────────────────────────────────────────────────────────── */
type UsageData = {
  total_spent: number;
  categories: Array<{ category: string; total: number }>;
  series: Array<Record<string, number | string>>;
};

type EChartsLike = {
  init: (dom: HTMLDivElement) => {
    setOption: (option: unknown, notMerge?: boolean) => void;
    dispose: () => void;
    resize: () => void;
  };
};

/* ── Constants ─────────────────────────────────────────────────────────── */
const MS_PER_DAY = 86_400_000;
const PRESETS = [
  { label: '1 day', ms: MS_PER_DAY },
  { label: '7 days', ms: 7 * MS_PER_DAY },
  { label: '30 days', ms: 30 * MS_PER_DAY },
];

const CATEGORY_COLORS: Record<string, string> = {
  storage_mb_day: '#d4a030',
  trace_list_query: '#4d9f6e',
  trace_detail_query: '#3a918e',
  tracy_input_token_1k: '#7663ad',
  tracy_output_token_1k: '#a4532b',
};

const CATEGORY_LABELS: Record<string, string> = {
  storage_mb_day: 'Storage',
  trace_list_query: 'List Trajectories',
  trace_detail_query: 'Trajectory Detail',
  tracy_input_token_1k: 'Tracy Agent Input Tokens',
  tracy_output_token_1k: 'Tracy Agent Output Tokens',
};

const PRICING_CARDS = [
  { key: 'storage_mb_day', label: 'Storage', unit: 'credits / MB / day', color: '#d4a030' },
  { key: 'trace_list_query', label: 'List Trajectories', unit: 'credits / query', color: '#4d9f6e' },
  { key: 'trace_detail_query', label: 'Trajectory Detail', unit: 'credits / query', color: '#3a918e' },
  { key: 'tracy_input_token_1k', label: 'Tracy Agent Input Tokens', unit: 'credits / 1k tokens', color: '#7663ad' },
  { key: 'tracy_output_token_1k', label: 'Tracy Agent Output Tokens', unit: 'credits / 1k tokens', color: '#a4532b' },
];

function formatCredits(n: number): string {
  return n < 1 ? n.toFixed(4) : new Intl.NumberFormat('en-US').format(Math.round(n * 100) / 100);
}

/* ── Main component ────────────────────────────────────────────────────── */
export function UsagePage() {
  const [presetIdx, setPresetIdx] = useState(1); // default 7 days
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState<Record<string, number>>({});
  const [rangeMs, setRangeMs] = useState(7 * MS_PER_DAY);
  const chartRef = useRef<HTMLDivElement>(null);

  // Fetch pricing table
  useEffect(() => {
    fetch('/api/billing/credits/packages', { cache: 'no-store' }).catch(() => {});
    // Pricing comes from the payment service config — for now hardcode from .env defaults
    // In a real scenario this would be an API endpoint
    setPricing({
      storage_mb_day: 1.35,
      trace_list_query: 0.5,
      trace_detail_query: 0.2,
      tracy_input_token_1k: 0.5,
      tracy_output_token_1k: 2.5,
    });
  }, []);

  const fetchUsage = useCallback(async () => {
    setLoading(true);
    const now = Date.now();
    let fromMs: number;
    let toMs: number;

    if (presetIdx >= 0 && presetIdx < PRESETS.length) {
      fromMs = now - PRESETS[presetIdx].ms;
      toMs = now;
    } else if (customFrom && customTo) {
      fromMs = new Date(customFrom).getTime();
      toMs = new Date(customTo).getTime() + MS_PER_DAY - 1;
    } else {
      fromMs = now - 7 * MS_PER_DAY;
      toMs = now;
    }

    setRangeMs(toMs - fromMs);
    try {
      const res = await fetch(`/api/billing/usage?from_ms=${fromMs}&to_ms=${toMs}`, { cache: 'no-store' });
      if (res.ok) setData(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, [presetIdx, customFrom, customTo]);

  useEffect(() => { void fetchUsage(); }, [fetchUsage]);

  // Chart
  const allCategories = useMemo(() => {
    if (!data?.series?.length) return [];
    const cats = new Set<string>();
    for (const row of data.series) {
      for (const key of Object.keys(row)) {
        if (key !== 'date') cats.add(key);
      }
    }
    return Array.from(cats);
  }, [data]);

  useEffect(() => {
    const dom = chartRef.current;
    if (!dom || !data?.series?.length) return;

    let disposed = false;
    let chart: ReturnType<EChartsLike['init']> | null = null;

    void (async () => {
      const echarts = (await import('echarts')) as unknown as EChartsLike;
      if (disposed) return;

      chart = echarts.init(dom);
      // Parse dates as local date labels (not UTC timestamps)
      const dates = data.series.map((r) => {
        const raw = String(r.date);
        // For daily data: "2026-04-09T00:00" — treat as a date label, not a UTC instant
        // Extract YYYY-MM-DD and create local date to avoid timezone shift
        const dateMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          const [, y, m, d] = dateMatch;
          const local = new Date(Number(y), Number(m) - 1, Number(d));
          if (rangeMs <= 2 * 86_400_000) {
            // Hourly: also parse the hour if present
            const hourMatch = raw.match(/T(\d{2})/);
            if (hourMatch) {
              local.setHours(Number(hourMatch[1]));
              return local.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric' });
            }
          }
          return local.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
        return raw;
      });

      chart.setOption({
        animation: false,
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#2b2522',
          borderWidth: 0,
          textStyle: { color: '#f7efe9', fontSize: 12 },
        },
        legend: {
          top: 8,
          right: 12,
          textStyle: { color: '#7c6854', fontSize: 11 },
          itemWidth: 10,
          itemHeight: 10,
        },
        grid: { top: 40, left: 50, right: 16, bottom: 32 },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: { color: '#7c6854', fontSize: 11 },
          axisLine: { lineStyle: { color: '#dacbb4' } },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#7c6854', fontSize: 11 },
          splitLine: { lineStyle: { color: '#f0e4d4' } },
        },
        series: allCategories.map((cat) => ({
          name: CATEGORY_LABELS[cat] ?? cat,
          type: 'bar',
          stack: 'usage',
          data: data.series.map((r) => (r[cat] as number) ?? 0),
          itemStyle: { color: CATEGORY_COLORS[cat] ?? '#b89c84' },
          barWidth: '60%',
        })),
      }, true);

      // Use ResizeObserver to handle container resize (e.g. Tracy panel open/close)
      const ro = new ResizeObserver(() => chart?.resize());
      ro.observe(dom);
      window.addEventListener('resize', () => chart?.resize());

      return () => {
        ro.disconnect();
      };
    })();

    return () => {
      disposed = true;
      chart?.dispose();
    };
  }, [data, allCategories, rangeMs]);

  return (
    <section className={styles.shell}>
      <div className={styles.content}>
        {/* Breadcrumb */}
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Link href="/billing" className={styles.breadcrumbLink}>Billing</Link>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>Usage</span>
          </nav>
        </header>

        {/* Time range selector */}
        <div className={styles.timeRange}>
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              className={`${styles.rangeBtn} ${presetIdx === i ? styles.rangeBtnActive : ''}`}
              onClick={() => { setPresetIdx(i); setCustomFrom(''); setCustomTo(''); }}
            >
              {p.label}
            </button>
          ))}
          <button
            className={`${styles.rangeBtn} ${presetIdx === -1 ? styles.rangeBtnActive : ''}`}
            onClick={() => setPresetIdx(-1)}
          >
            Custom
          </button>
          {presetIdx === -1 && (
            <div className={styles.customRange}>
              <input type="date" className={styles.dateInput} value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
              <span>→</span>
              <input type="date" className={styles.dateInput} value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
            </div>
          )}
        </div>

        {/* Spent Credits Card */}
        <div className={styles.spentCard}>
          <span className={styles.spentLabel}>Spent Credits</span>
          <div className={styles.spentValue}>
            <Image src="/icons/coin.png" alt="" width={28} height={28} className={styles.spentCoin} unoptimized />
            {loading ? (
              <div className={styles.skeleton} style={{ width: 80, height: 28 }} />
            ) : (
              <span>{formatCredits(data?.total_spent ?? 0)}</span>
            )}
          </div>
        </div>

        {/* Stacked bar chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Credits Spent Over Time</h3>
          {loading ? (
            <div className={styles.skeleton} style={{ width: '100%', height: 260 }} />
          ) : data?.series?.length ? (
            <div ref={chartRef} className={styles.chartCanvas} />
          ) : (
            <div className={styles.chartEmpty}>No usage data in this time range</div>
          )}
        </div>

        {/* Pricing cards */}
        <div className={styles.pricingGrid}>
          {PRICING_CARDS.map((card) => (
            <div key={card.key} className={styles.pricingCard}>
              <span className={styles.pricingLabel}>{card.label}</span>
              <div className={styles.pricingValue}>
                <span className={styles.pricingDot} style={{ background: card.color }} />
                <span>{pricing[card.key] ?? '—'} {card.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
