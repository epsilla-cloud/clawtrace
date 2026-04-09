'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import styles from './MarkdownContent.module.css';

export function MarkdownContent({ content }: { content: string }) {
  return (
    <article className={styles.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => {
            if (!src || typeof src !== 'string') return null;
            return (
              <span className={styles.imageWrap}>
                <Image
                  src={src}
                  alt={alt ?? ''}
                  width={900}
                  height={500}
                  className={styles.image}
                  unoptimized
                />
              </span>
            );
          },
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            );
          },
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return <code className={styles.inlineCode} {...props}>{children}</code>;
          },
        }}
      />
    </article>
  );
}
