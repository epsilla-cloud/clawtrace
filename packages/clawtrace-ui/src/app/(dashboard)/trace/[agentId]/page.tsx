import { Suspense } from 'react';
import { AgentDashboardPage } from '@/components/traces/AgentDashboardPage';

export const metadata = { title: 'Agent Dashboard — ClawTrace' };

function DashboardSkeleton() {
  const bar = { borderRadius: 6, background: '#f0e4d4', animation: 'ct-pulse 1.4s ease-in-out infinite' } as const;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: 20 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ ...bar, width: 100, height: 14 }} />
        <div style={{ ...bar, width: 8, height: 14 }} />
        <div style={{ ...bar, width: 120, height: 14 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ background: '#fffdf8', border: '1px solid #dacbb4', borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ ...bar, width: '60%', height: 10, marginBottom: 6 }} />
            <div style={{ ...bar, width: '40%', height: 20 }} />
          </div>
        ))}
      </div>
      <div style={{ ...bar, flex: 1, borderRadius: 12, minHeight: 200 }} />
    </div>
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AgentDashboardPage paramsPromise={params} />
    </Suspense>
  );
}
