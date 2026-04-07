'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './AppNav.module.css';

const STORAGE_KEY = 'clawtrace:nav-expanded';

const MAIN_NAV = [
  {
    href: '/trace',
    label: 'Trace',
    match: (p: string) => p === '/trace' || p.startsWith('/trace/'),
    icon: (
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        {/* Branching trace icon */}
        <path d="M4 4v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 7h6c2 0 3 1 3 3v0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 13h4c2 0 3 1 3 3v0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="13" cy="10" r="2" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="11" cy="16" r="2" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="4" cy="4" r="1.5" fill="currentColor"/>
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
