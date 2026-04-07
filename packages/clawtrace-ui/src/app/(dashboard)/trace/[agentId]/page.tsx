import { Suspense } from 'react';
import { AgentDashboardPage } from '@/components/traces/AgentDashboardPage';

export const metadata = { title: 'Agent Dashboard — ClawTrace' };

export default function Page({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  return (
    <Suspense>
      <AgentDashboardPage paramsPromise={params} />
    </Suspense>
  );
}
