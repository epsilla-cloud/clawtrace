'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserButton } from '@/components/auth/user-button';
import styles from './WebsiteHeader.module.css';

export function WebsiteHeader() {
  const pathname = usePathname();
  const isDoc = pathname?.startsWith('/docs');

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
    </header>
  );
}
