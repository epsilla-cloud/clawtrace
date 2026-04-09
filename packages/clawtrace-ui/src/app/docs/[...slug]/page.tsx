import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { findDocBySlug, getAllDocSlugs } from '@/lib/docs-nav';
import styles from './page.module.css';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({
    slug: slug.split('/'),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = findDocBySlug(slug.join('/'));
  if (!page) return { title: 'Documentation' };
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: `${page.title} — ClawTrace Docs`,
      description: page.description,
      type: 'article',
    },
  };
}

async function renderMarkdown(md: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(md);
  return String(result);
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const page = findDocBySlug(slug.join('/'));
  if (!page) notFound();

  const filePath = path.join(process.cwd(), 'src', 'docs-content', page.file);
  let content: string;
  try {
    const md = await fs.readFile(filePath, 'utf-8');
    content = await renderMarkdown(md);
  } catch {
    notFound();
  }

  return (
    <article
      className={styles.markdown}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
