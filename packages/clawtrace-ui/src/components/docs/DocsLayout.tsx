'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserButton } from '@/components/auth/user-button';
import { DOC_SECTIONS } from '@/lib/docs-nav';
import styles from './DocsLayout.module.css';

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentSlug = pathname?.replace('/docs/', '') ?? '';

  return (
    <div className={styles.page}>
      {/* Reuse landing page header style */}
      <header className={styles.topNav}>
        <Link href="/" className={styles.logo}>
          <Image src="/clawtrace-logo.png" alt="ClawTrace" height={22} width={120} style={{ objectFit: 'contain' }} />
        </Link>
        <div className={styles.headerRight}>
          <nav className={styles.topLinks}>
            <Link href="/#improvement" className={styles.topLink}>Product</Link>
            <Link href="/#improvement" className={styles.topLink}>How It Works</Link>
            <Link href="/docs" className={`${styles.topLink} ${styles.topLinkActive}`}>Documentation</Link>
          </nav>
          <UserButton />
        </div>
      </header>

      <div className={styles.body}>
        {/* Left sidebar — menu hierarchy */}
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNav}>
            {DOC_SECTIONS.map((section) => (
              <div key={section.title} className={styles.sidebarSection}>
                <span className={styles.sidebarSectionTitle}>{section.title}</span>
                {section.pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/docs/${page.slug}`}
                    className={`${styles.sidebarLink} ${currentSlug === page.slug ? styles.sidebarLinkActive : ''}`}
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
