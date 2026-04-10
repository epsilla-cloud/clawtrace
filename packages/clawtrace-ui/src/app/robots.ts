import type { MetadataRoute } from 'next';
import { siteConfig } from '../lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/docs', '/docs/'],
        disallow: [
          '/trace',
          '/trace/',
          '/account',
          '/billing',
          '/billing/',
          '/connect',
          '/control-room',
          '/traces',
          '/api/',
        ],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
