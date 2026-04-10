import { DocsLayout } from '@/components/docs/DocsLayout';
import { EpsillaChatWidget } from '@/components/EpsillaChatWidget';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DocsLayout>{children}</DocsLayout>
      <EpsillaChatWidget />
    </>
  );
}
