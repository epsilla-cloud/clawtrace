import { Suspense } from 'react';
import { AccountPage } from '@/components/account/AccountPage';

export const metadata = { title: 'Account', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <Suspense fallback={<div style={{ flex: 1, display: 'grid', placeItems: 'center', color: '#7c6854', fontSize: 14 }}>Loading account...</div>}>
      <AccountPage />
    </Suspense>
  );
}
