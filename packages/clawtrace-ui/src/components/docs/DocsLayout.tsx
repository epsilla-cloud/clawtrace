'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WebsiteHeader } from '@/components/website/WebsiteHeader';
import { DOC_SECTIONS } from '@/lib/docs-nav';
import styles from './DocsLayout.module.css';

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentSlug = pathname?.replace('/docs/', '') ?? '';

  return (
    <div className={styles.page}>
      <WebsiteHeader />

      <div className={styles.body}>
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

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
