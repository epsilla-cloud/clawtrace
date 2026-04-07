import { Suspense } from 'react';
import { TrajectoryPage } from '@/components/traces/TrajectoryPage';

export const metadata = { title: 'Trajectory — ClawTrace' };

function TrajectorySkeleton() {
  const bar = { borderRadius: 8, background: '#f0e4d4', animation: 'ct-pulse 1.4s ease-in-out infinite' } as const;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 20px 20px' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ ...bar, width: 100, height: 14 }} />
        <div style={{ ...bar, width: 8, height: 14 }} />
        <div style={{ ...bar, width: 90, height: 14 }} />
        <div style={{ ...bar, width: 8, height: 14 }} />
        <div style={{ ...bar, width: 140, height: 14 }} />
      </div>
      <div style={{ display: 'flex', gap: 12, flex: 1 }}>
        <div style={{ ...bar, flex: '0 0 260px' }} />
        <div style={{ ...bar, flex: 1 }} />
      </div>
    </div>
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ agentId: string; trajectoryId: string }>;
}) {
  return (
    <Suspense fallback={<TrajectorySkeleton />}>
      <TrajectoryPage paramsPromise={params} />
    </Suspense>
  );
}
