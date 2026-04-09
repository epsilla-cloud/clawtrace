import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { findDocBySlug, getAllDocSlugs } from '@/lib/docs-nav';
import { MarkdownContent } from '@/components/docs/MarkdownContent';

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
  const joined = slug.join('/');
  const page = findDocBySlug(joined);
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

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const joined = slug.join('/');
  const page = findDocBySlug(joined);
  if (!page) notFound();

  const filePath = path.join(process.cwd(), 'public', 'docs', 'content', page.file);
  let content: string;
  try {
    content = await fs.readFile(filePath, 'utf-8');
  } catch {
    notFound();
  }

  return <MarkdownContent content={content} />;
}
