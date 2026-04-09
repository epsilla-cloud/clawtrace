'use client';

import { useEffect, useState } from 'react';
import styles from './DocsLayout.module.css';

type Heading = { id: string; text: string; level: number };

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Read headings from the rendered content
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
  }, []);

  if (!headings.length) return null;

  return (
    <aside className={styles.toc}>
      <span className={styles.tocTitle}>On This Page</span>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`${styles.tocLink} ${h.level === 3 ? styles.tocLinkH3 : ''}`}
        >
          {h.text}
        </a>
      ))}
    </aside>
  );
}
