import type { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '../lib/site';
import { InviteCodeCapture } from '@/components/auth/invite-code-capture';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: 'ClawTrace',
    template: '%s | ClawTrace',
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  category: 'technology',
  icons: {
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '192x192',
      },
    ],
    shortcut: ['/favicon.png'],
    apple: [
      {
        url: '/favicon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    title: 'ClawTrace',
    description: siteConfig.description,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'ClawTrace - Make your OpenClaw agents better, cheaper, and faster.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClawTrace',
    description: siteConfig.description,
    images: ['/twitter-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <InviteCodeCapture />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
