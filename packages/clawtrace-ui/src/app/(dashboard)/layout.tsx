'use client';

import { Suspense } from 'react';
import { AppNav } from '@/components/app-nav/AppNav';
import { DeficitModal } from '@/components/billing/DeficitModal';
import { TracyPanel } from '@/components/tracy/TracyPanel';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: '#faf4ec' }}>
      <AppNav />
      {children}
      <DeficitModal />
      <Suspense fallback={null}>
        <TracyPanel />
      </Suspense>
    </div>
  );
}
