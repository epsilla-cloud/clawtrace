import { Suspense } from 'react';
import { BillingPage } from '@/components/billing/BillingPage';

export const metadata = { title: 'Billing' };

export default function Page() {
  return (
    <Suspense fallback={<div style={{ flex: 1, display: 'grid', placeItems: 'center', color: '#7c6854', fontSize: 14 }}>Loading billing...</div>}>
      <BillingPage />
    </Suspense>
  );
}
