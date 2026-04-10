import type { MetadataRoute } from 'next';
import { siteConfig } from '../lib/site';
import { getAllDocSlugs } from '../lib/docs-nav';

const BASE = siteConfig.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const docPages = getAllDocSlugs().map((slug) => ({
    url: `${BASE}/docs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/docs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...docPages,
    {
      url: `${BASE}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
