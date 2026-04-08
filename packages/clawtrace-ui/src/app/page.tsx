import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/auth';
import { LandingPage } from '../components/clawtrace/landing/LandingPage';
import { siteConfig } from '../lib/site';

export const metadata: Metadata = {
  title: {
    absolute: 'Make your OpenClaw agents better, cheaper, and faster | ClawTrace',
  },
  description: 'See what failed, where spend leaked, and what to fix first with ClawTrace observability.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  // Redirect logged-in users straight to the app
  const session = await getUserSession();
  if (session) redirect('/trace');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', name: 'ClawTrace', url: siteConfig.siteUrl },
      { '@type': 'WebSite', name: 'ClawTrace', url: siteConfig.siteUrl, description: siteConfig.description },
      { '@type': 'SoftwareApplication', name: 'ClawTrace', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', description: siteConfig.description, url: siteConfig.siteUrl },
    ],
  };

  return (
    <div className="operator clawtrace">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingPage />
    </div>
  );
}
