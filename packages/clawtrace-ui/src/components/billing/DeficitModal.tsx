'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './DeficitModal.module.css';

/**
 * Global 402 Payment Required interceptor.
 * Monkey-patches window.fetch to detect 402 responses.
 * Shows a modal prompting the user to top up — unless already on /billing.
 */
export function DeficitModal() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const res = await originalFetch(...args);
      if (res.status === 402 && pathname !== '/billing') {
        setShow(true);
      }
      return res;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [pathname]);

  if (!show || pathname === '/billing') return null;

  return (
    <div className={styles.overlay} onClick={() => setShow(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrap}>
          <svg viewBox="0 0 48 48" fill="none" className={styles.icon}>
            <circle cx="24" cy="24" r="22" fill="#fff3e0" stroke="#e8a040" strokeWidth="2" />
            <text x="24" y="30" textAnchor="middle" fill="#c87820" fontSize="24" fontWeight="700">!</text>
          </svg>
        </div>
        <h2 className={styles.title}>Credits Exhausted</h2>
        <p className={styles.body}>
          Your ClawTrace credits have run out. Top up to continue using
          trace analysis, agent monitoring, and Tracy assistant.
        </p>
        <div className={styles.actions}>
          <a href="/billing" className={styles.primaryBtn}>
            Top Up Credits
          </a>
          <button className={styles.secondaryBtn} onClick={() => setShow(false)}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
