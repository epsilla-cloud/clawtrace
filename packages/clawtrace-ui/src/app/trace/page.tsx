import { Suspense } from 'react';
import { AgentsListPage } from '@/components/traces/AgentsListPage';

export const metadata = { title: 'OpenClaw Agents — ClawTrace' };

export default function Page() {
  return (
    <Suspense>
      <AgentsListPage />
    </Suspense>
  );
}
