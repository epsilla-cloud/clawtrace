'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './AppNav.module.css';

const STORAGE_KEY = 'clawtrace:nav-expanded';

const NAV_ITEMS = [
  {
    href: '/overview',
    label: 'Overview',
    match: (p: string) => p === '/overview' || p.startsWith('/overview/'),
    icon: (
      // 2×2 grid of rounded squares — "agents/dashboard overview"
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="12" y="2" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="2" y="12" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="12" y="12" width="8" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    href: '/traces',
    label: 'Traces',
    match: (p: string) => p === '/traces' || p.startsWith('/traces/'),
    icon: (
      // Branching tree — "trace spans / hierarchy"
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="4" r="2" stroke="currentColor" strokeWidth="1.6"/>
        <line x1="11" y1="6" x2="11" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="11" y1="10" x2="5" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <line x1="11" y1="10" x2="17" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="5" cy="16.5" r="2" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="17" cy="16.5" r="2" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
  {
    href: '/trace',
    label: 'Trace',
    match: (p: string) => p === '/trace' || p.startsWith('/trace/'),
    icon: (
      // Horizontal timeline rows with highlight dot — "inspect a single trace"
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.4"/>
        <circle cx="7" cy="6" r="2.5" fill="currentColor"/>
        <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.4"/>
        <circle cx="13" cy="11" r="2.5" fill="currentColor"/>
        <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.4"/>
        <circle cx="9" cy="16" r="2.5" fill="currentColor"/>
      </svg>
    ),
  },
];

export function AppNav() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === '1') setExpanded(true);
  }, []);

  const toggle = () => {
    setExpanded((v) => {
      localStorage.setItem(STORAGE_KEY, v ? '0' : '1');
      return !v;
    });
  };

  return (
    <aside className={`${styles.nav} ${expanded ? styles.expanded : styles.collapsed}`}>
      {/* Logo */}
      <div className={styles.logo}>
        {/* Claw mark — always visible */}
        <svg className={styles.logoMark} viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M14 3C8.48 3 4 7.48 4 13c0 3.31 1.59 6.24 4.07 8.12L9 22.5V25h10v-2.5l.93-1.38A9.96 9.96 0 0 0 24 13c0-5.52-4.48-10-10-10z" fill="url(#ct-grad)" />
          <defs>
            <linearGradient id="ct-grad" x1="4" y1="3" x2="24" y2="25" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c0622a"/>
              <stop offset="100%" stopColor="#7c3a0f"/>
            </linearGradient>
          </defs>
          <path d="M10 14.5c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M10 17.5c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        {/* Wordmark — only when expanded */}
        <span className={styles.logoText}>ClawTrace</span>
      </div>

      {/* Nav items */}
      <nav className={styles.items}>
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname ?? '');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.item} ${active ? styles.itemActive : ''}`}
              title={!expanded ? item.label : undefined}
            >
              <span className={styles.itemIcon}>{item.icon}</span>
              <span className={styles.itemLabel}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Expand/collapse handle on the right border */}
      <button
        type="button"
        className={styles.handle}
        onClick={toggle}
        aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
        title={expanded ? 'Collapse' : 'Expand'}
      >
        <svg viewBox="0 0 8 14" fill="none" aria-hidden="true">
          <path
            d={expanded ? 'M6 1L2 7l4 6' : 'M2 1l4 6-4 6'}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </aside>
  );
}
