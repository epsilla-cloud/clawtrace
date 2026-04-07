import { Suspense } from 'react';
import { TrajectoryPage } from '@/components/traces/TrajectoryPage';

export const metadata = { title: 'Trajectory — ClawTrace' };

export default function Page({
  params,
}: {
  params: Promise<{ agentId: string; trajectoryId: string }>;
}) {
  return (
    <Suspense>
      <TrajectoryPage paramsPromise={params} />
    </Suspense>
  );
}
