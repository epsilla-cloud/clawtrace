'use client';

import { usePathname } from 'next/navigation';
import styles from './console-sidebar.module.css';

const NAV_ITEMS = [
  {
    href: '/console',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    href: '/console/billing',
    label: 'Billing',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 10.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/console/referrals',
    label: 'Referrals',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="11" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M1 13c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11 9c1.66 0 3 1.34 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function ConsoleSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/console') return pathname === '/console';
    return pathname.startsWith(href);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <a href="/" className={styles.brandLink}>
          <span className={styles.brandText}>ClawTrace</span>
        </a>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
