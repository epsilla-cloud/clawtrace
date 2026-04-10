import { Suspense } from 'react';
import { UsagePage } from '@/components/billing/UsagePage';

export const metadata = { title: 'Usage', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <Suspense fallback={<div style={{ flex: 1, display: 'grid', placeItems: 'center', color: '#7c6854', fontSize: 14 }}>Loading usage...</div>}>
      <UsagePage />
    </Suspense>
  );
}
