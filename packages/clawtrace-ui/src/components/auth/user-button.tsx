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

  // Logged in — avatar + name links to /trace
  return (
    <a href="/trace" className={styles.trigger}>
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
    </a>
  );
}
