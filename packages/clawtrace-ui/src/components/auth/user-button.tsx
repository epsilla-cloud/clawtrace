'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './user-button.module.css';

interface UserSession {
  provider: 'google' | 'github';
  id: string;
  dbId: string;
  name: string;
  avatar: string;
  email?: string;
  cardVerified: boolean;
}

export function UserButton() {
  const [session, setSession] = useState<UserSession | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data: UserSession | null) => setSession(data))
      .catch(() => setSession(null));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  // Still loading
  if (session === undefined) {
    return <div className={styles.skeleton} aria-hidden="true" />;
  }

  // Not logged in
  if (session === null) {
    return (
      <a href="/login" className={styles.signInLink}>
        Sign in
      </a>
    );
  }

  // Logged in
  return (
    <div className={styles.root} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {session.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.avatar}
            alt={session.name}
            width={26}
            height={26}
            className={styles.avatar}
          />
        ) : (
          <span className={styles.avatarFallback}>
            {session.name.charAt(0).toUpperCase()}
          </span>
        )}
        <span className={styles.name}>{session.name}</span>
        <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.userInfo}>
            <span className={styles.userName}>{session.name}</span>
            {session.email && <span className={styles.userEmail}>{session.email}</span>}
          </div>
          <div className={styles.divider} />
          <a href="/console" role="menuitem" className={styles.menuItem}>
            Console
          </a>
          <div className={styles.divider} />
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
