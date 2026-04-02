'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { ClawTraceFlowDefinition, ClawTraceFlowId } from '../../../lib/flow-pages';
import styles from './FlowLeftNav.module.css';

type FlowLeftNavProps = {
  flow?: ClawTraceFlowDefinition;   // optional — not set when on console pages
  allFlows: ClawTraceFlowDefinition[];
};

type NavIcon = 'setup' | 'operations' | 'diagnose' | 'resolve' | 'prevent' | 'automate' | 'feedback';

type FunctionalNavItem = {
  id: string;
  label: string;
  icon: NavIcon;
  flowIds: ClawTraceFlowId[];
};

const STORAGE_KEY = 'clawtrace:left-nav-expanded';

const FUNCTIONAL_NAV_ITEMS: FunctionalNavItem[] = [
  { id: 'setup-baseline',   label: 'Setup & Baseline',   icon: 'setup',      flowIds: ['f0-connect', 'f1-audit', 'f2-handoff'] },
  { id: 'daily-operations', label: 'Daily Operations',   icon: 'operations', flowIds: ['f3-control-room', 'f4-live-run'] },
  { id: 'diagnose-issues',  label: 'Diagnose Issues',    icon: 'diagnose',   flowIds: ['f5-triage', 'f9-time-machine'] },
  { id: 'resolve-verify',   label: 'Resolve & Verify',   icon: 'resolve',    flowIds: ['f6-intervention', 'f7-verification'] },
  { id: 'prevention-eval',  label: 'Prevention & Eval',  icon: 'prevent',    flowIds: ['f8-regression'] },
  { id: 'automation',       label: 'Automation',         icon: 'automate',   flowIds: ['f10-automation'] },
  { id: 'feedback-loop',    label: 'Feedback Loop',      icon: 'feedback',   flowIds: ['f11-feedback'] },
];

const CONSOLE_NAV_ITEMS = [
  {
    id: 'console-overview',
    href: '/console',
    label: 'Account',
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: 'console-billing',
    href: '/console/billing',
    label: 'Billing',
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20M6 15h4" />
      </svg>
    ),
  },
  {
    id: 'console-referrals',
    href: '/console/referrals',
    label: 'Referrals',
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <path d="M2 20c0-3.31 2.69-6 6-6s6 2.69 6 6M16 14c2.21 0 4 1.79 4 4" />
      </svg>
    ),
  },
];

function resolveRoute(flowIds: ClawTraceFlowId[], allFlows: ClawTraceFlowDefinition[]): string {
  const resolved = flowIds.map((id) => allFlows.find((item) => item.id === id)).find(Boolean);
  return resolved?.route ?? '/control-room';
}

function renderIcon(icon: NavIcon) {
  switch (icon) {
    case 'setup':      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2v6m-2 0h4M6 10V8a2 2 0 0 1 2-2h1m9 4V8a2 2 0 0 0-2-2h-1M6 14v2a2 2 0 0 0 2 2h2m8-4v2a2 2 0 0 1-2 2h-2M8 12h8" /></svg>;
    case 'operations': return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" /></svg>;
    case 'diagnose':   return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4a7 7 0 1 0 4.95 11.95L20 20m-6-7h.01" /></svg>;
    case 'resolve':    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 6.5-6.5m0 0L13 11l3 3 4-4m-9.5 3.5L7 10m6-6 2 2m-8 8 2 2" /></svg>;
    case 'prevent':    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6zM9 12l2 2 4-4" /></svg>;
    case 'automate':   return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14v10H8l-3 3zM9 10h6m-6 3h4" /></svg>;
    case 'feedback':   return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5m2-3v6h-6M20 12a8 8 0 0 1-14 5m-2 3v-6h6" /></svg>;
    default:           return null;
  }
}

export function FlowLeftNav({ flow, allFlows }: FlowLeftNavProps) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === '1') setExpanded(true);
  }, []);

  const items = useMemo(
    () => FUNCTIONAL_NAV_ITEMS.map((item) => ({ ...item, route: resolveRoute(item.flowIds, allFlows) })),
    [allFlows],
  );

  const activeFlowGroupId = useMemo(
    () => (flow ? items.find((item) => item.flowIds.includes(flow.id))?.id : null) ?? null,
    [flow, items],
  );

  const onToggle = () => {
    setExpanded((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      return next;
    });
  };

  const isConsole = pathname?.startsWith('/console');
  const currentConsoleItem = CONSOLE_NAV_ITEMS.find((item) =>
    item.exact ? pathname === item.href : pathname?.startsWith(item.href),
  );

  return (
    <aside className={`${styles.nav} ${expanded ? styles.expanded : styles.collapsed}`} aria-label="ClawTrace navigation">
      <button
        type="button"
        className={styles.toggleButton}
        onClick={onToggle}
        aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
        aria-expanded={expanded}
      >
        <span className={styles.toggleGlyph}>{expanded ? '⟨' : '⟩'}</span>
        <span className={styles.toggleText}>{expanded ? 'Collapse' : 'Expand'}</span>
      </button>

      {/* Workflow / flow navigation */}
      <nav className={styles.itemList} aria-label="Functional steps">
        {items.map((item) => {
          const active = item.id === activeFlowGroupId;
          return (
            <Link
              key={item.id}
              href={item.route}
              className={`${styles.item} ${active ? styles.itemActive : ''}`}
              title={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <span className={styles.itemIcon}>{renderIcon(item.icon)}</span>
              <span className={styles.itemText}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Account / console navigation */}
      <nav className={styles.accountList} aria-label="Account">
        {CONSOLE_NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : (pathname?.startsWith(item.href) ?? false);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.item} ${active ? styles.itemActive : ''}`}
              title={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <span className={styles.itemIcon}>{item.icon}</span>
              <span className={styles.itemText}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Current context footer */}
      <div className={styles.currentMeta}>
        <span className={styles.currentFlowTag}>Now</span>
        <span className={styles.currentFlowText}>
          {isConsole
            ? (currentConsoleItem?.label ?? 'Account')
            : (flow?.title ?? 'Control Room')}
        </span>
      </div>
    </aside>
  );
}
