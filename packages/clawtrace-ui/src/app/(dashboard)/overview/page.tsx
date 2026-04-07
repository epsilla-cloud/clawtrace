import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { InstancesGrid } from '@/components/console/instances-grid';

export const metadata = { title: 'Overview — ClawTrace' };

export default async function OverviewPage() {
  const session = await getUserSession();
  if (!session) redirect('/overview');
  return <InstancesGrid />;
}
