'use client';

import { AppNav } from '@/components/app-nav/AppNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', background: '#faf4ec' }}>
      <AppNav />
      {children}
    </div>
  );
}
