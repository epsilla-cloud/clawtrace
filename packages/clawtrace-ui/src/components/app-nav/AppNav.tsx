'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './AppNav.module.css';

const STORAGE_KEY = 'clawtrace:nav-expanded';

const MAIN_NAV = [
  {
    href: '/overview',
    label: 'Overview',
    match: (p: string) => p === '/overview' || p.startsWith('/overview/'),
    icon: (
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

const BOTTOM_NAV = [
  {
    href: '/account',
    label: 'Account',
    match: (p: string) => p === '/account' || p.startsWith('/account/'),
    icon: (
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M4 19c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/overview/billing',
    label: 'Billing',
    match: (p: string) => p.startsWith('/overview/billing'),
    icon: (
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M2 9h18" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M6 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/overview/referrals',
    label: 'Referrals',
    match: (p: string) => p.startsWith('/overview/referrals'),
    icon: (
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 4l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
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

  const cls = expanded ? styles.expanded : styles.collapsed;

  return (
    <aside className={`${styles.nav} ${cls}`}>
      {/* Logo: favicon mark when collapsed, full wordmark when expanded */}
      <div className={styles.logo}>
        {expanded ? (
          <Image
            src="/clawtrace-logo.png"
            alt="ClawTrace"
            height={26}
            width={130}
            style={{ objectFit: 'contain', objectPosition: 'left center' }}
            priority
          />
        ) : (
          <Image
            src="/favicon.png"
            alt="ClawTrace"
            height={30}
            width={30}
            style={{ objectFit: 'contain' }}
            priority
          />
        )}
      </div>

      {/* Main nav */}
      <nav className={styles.items}>
        {MAIN_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.item} ${item.match(pathname ?? '') ? styles.itemActive : ''}`}
            title={!expanded ? item.label : undefined}
          >
            <span className={styles.itemIcon}>{item.icon}</span>
            <span className={styles.itemLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Divider + bottom account nav */}
      <div className={styles.divider} />
      <nav className={styles.bottomItems}>
        {BOTTOM_NAV.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={`${styles.item} ${item.match(pathname ?? '') ? styles.itemActive : ''}`}
            title={!expanded ? item.label : undefined}
          >
            <span className={styles.itemIcon}>{item.icon}</span>
            <span className={styles.itemLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Handle — half-inserted into right border */}
      <button
        type="button"
        className={styles.handle}
        onClick={toggle}
        aria-label={expanded ? 'Collapse' : 'Expand'}
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
