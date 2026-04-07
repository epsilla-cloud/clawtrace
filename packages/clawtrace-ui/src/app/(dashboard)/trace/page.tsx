import { Suspense } from 'react';
import { AgentsListPage } from '@/components/traces/AgentsListPage';

export const metadata = { title: 'OpenClaw Agents — ClawTrace' };

function PageSkeleton() {
  const bar = { borderRadius: 6, background: '#f0e4d4', animation: 'ct-pulse 1.4s ease-in-out infinite' } as const;
  return (
    <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ ...bar, width: 180, height: 18 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ background: '#fffdf8', border: '1px solid #dacbb4', borderRadius: 14, padding: 16, minHeight: 120, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ ...bar, width: 44, height: 44, borderRadius: 10 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ ...bar, width: '70%', height: 14 }} />
                <div style={{ ...bar, width: '50%', height: 10 }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
              <div style={{ ...bar, width: 80, height: 10 }} />
              <div style={{ ...bar, width: 100, height: 28, borderRadius: 7 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AgentsListPage />
    </Suspense>
  );
}
