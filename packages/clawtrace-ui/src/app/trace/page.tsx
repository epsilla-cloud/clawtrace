import { Suspense } from 'react';
import { TraceDetailPage } from '@/components/traces/TraceDetailPage';

export const metadata = { title: 'Trace — ClawTrace' };

export default function TracePage() {
  return (
    <Suspense>
      <TraceDetailPage />
    </Suspense>
  );
}
