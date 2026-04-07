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
    label: 'Trajectories',
    match: (p: string) => p === '/trace' || p.startsWith('/trace/'),
    icon: (
      <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
        {/* Three horizontal bars — timeline trace */}
        <rect x="2" y="4" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.85"/>
        <rect x="5" y="9.5" width="10" height="3" rx="1.5" fill="currentColor" opacity="0.6"/>
        <rect x="3" y="15" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.4"/>
      </svg>
    ),
  },
];


interface UserInfo { name: string; avatar: string; points_balance?: number }

export function AppNav() {
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === '1') setExpanded(true);
    // Fetch user info
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setUser(d); })
      .catch(() => {});
    // Fetch credits
    fetch('/api/referral/info', { cache: 'no-store' })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.points_balance != null) setCredits(d.points_balance); })
      .catch(() => {});
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
            height={22}
            width={120}
            style={{ objectFit: 'contain', objectPosition: 'left center' }}
            priority
          />
        ) : (
          <Image
            src="/favicon.png"
            alt="ClawTrace"
            height={26}
            width={26}
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

      {/* Bottom: credits + account */}
      <div className={styles.divider} />
      <nav className={styles.bottomItems}>
        <Link
          href="/overview/billing"
          className={`${styles.coinItem} ${pathname?.startsWith('/overview/billing') ? styles.itemActive : ''}`}
          title={!expanded ? `${credits} credits` : undefined}
        >
          <span className={styles.coinIcon}>🪙</span>
          <span className={expanded ? styles.itemLabel : styles.coinCount}>{credits}</span>
        </Link>
        <Link
          href="/account"
          className={`${styles.item} ${pathname?.startsWith('/account') ? styles.itemActive : ''}`}
          title={!expanded ? (user?.name ?? 'Account') : undefined}
        >
          <span className={styles.itemIcon}>
            {user?.avatar ? (
              <Image src={user.avatar} alt="" width={20} height={20} className={styles.avatarImg} unoptimized />
            ) : (
              <svg viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M4 19c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            )}
          </span>
          <span className={styles.itemLabel}>{user?.name ?? 'Account'}</span>
        </Link>
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
