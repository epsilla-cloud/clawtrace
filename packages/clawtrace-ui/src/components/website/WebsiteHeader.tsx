'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { UserButton } from '@/components/auth/user-button';
import styles from './WebsiteHeader.module.css';

export function WebsiteHeader() {
  const pathname = usePathname();
  const isDoc = pathname?.startsWith('/docs');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <a href="/" className={styles.brand} aria-label="ClawTrace home">
        <Image
          src="/clawtrace-logo.png"
          alt="ClawTrace"
          height={22}
          width={120}
          style={{ objectFit: 'contain' }}
          priority
        />
      </a>
      <div className={styles.headerRight}>
        <nav className={styles.nav}>
          <a href="/#improvement" className={styles.navLink}>Product</a>
          <a href="/#improvement" className={styles.navLink}>How It Works</a>
          <a href="/docs" className={`${styles.navLink} ${isDoc ? styles.navLinkActive : ''}`}>Documentation</a>
        </nav>
        <UserButton />
      </div>
      <button type="button" className={styles.hamburger} onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu">
        <svg viewBox="0 0 20 14" width="20" height="14" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round">
          {menuOpen
            ? <><line x1="2" y1="2" x2="18" y2="12" /><line x1="2" y1="12" x2="18" y2="2" /></>
            : <><line x1="2" y1="2" x2="18" y2="2" /><line x1="2" y1="7" x2="18" y2="7" /><line x1="2" y1="12" x2="18" y2="12" /></>
          }
        </svg>
      </button>
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <a href="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/#improvement" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Product</a>
          <a href="/docs" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Documentation</a>
          <div className={styles.mobileDivider} />
          <UserButton />
        </div>
      )}
    </header>
  );
}
