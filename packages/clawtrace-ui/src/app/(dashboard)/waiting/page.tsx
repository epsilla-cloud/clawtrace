import { Suspense } from 'react';
import { WaitingContent } from './WaitingContent';

export const metadata = { title: 'Getting Ready', robots: { index: false, follow: false } };

export default function WaitingPage() {
  return (
    <Suspense fallback={null}>
      <WaitingContent />
    </Suspense>
  );
}
