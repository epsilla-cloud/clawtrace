import type { Metadata } from 'next';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { EpsillaChatWidget } from '@/components/EpsillaChatWidget';

export const metadata: Metadata = {
  title: {
    default: 'Documentation — ClawTrace',
    template: '%s — ClawTrace Docs',
  },
  description: 'Learn how to set up ClawTrace, analyze agent trajectories, use Tracy, and manage billing.',
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DocsLayout>{children}</DocsLayout>
      <EpsillaChatWidget />
    </>
  );
}
