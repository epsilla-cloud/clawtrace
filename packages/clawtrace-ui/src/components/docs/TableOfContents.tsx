'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './DocsLayout.module.css';

type Heading = { id: string; text: string; level: number };

export function TableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Re-read headings whenever the route changes
  useEffect(() => {
    // Small delay to let the new page content render
    const timer = setTimeout(() => {
      const article = document.querySelector('article');
      if (!article) return;

      const els = article.querySelectorAll('h2, h3');
      const items: Heading[] = [];
      els.forEach((el) => {
        const id = el.id;
        const text = el.textContent ?? '';
        if (id && text) {
          items.push({ id, text, level: el.tagName === 'H3' ? 3 : 2 });
        }
      });
      setHeadings(items);
      setActiveId(items[0]?.id ?? '');
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Track which section is in viewport using IntersectionObserver
  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first heading that's intersecting (visible)
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        // Trigger when heading enters the top 20% of viewport
        rootMargin: '0px 0px -80% 0px',
        threshold: 0,
      },
    );

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside className={styles.toc}>
      <span className={styles.tocTitle}>On This Page</span>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={[
            styles.tocLink,
            h.level === 3 ? styles.tocLinkH3 : '',
            activeId === h.id ? styles.tocLinkActive : '',
          ].join(' ')}
        >
          {h.text}
        </a>
      ))}
    </aside>
  );
}
