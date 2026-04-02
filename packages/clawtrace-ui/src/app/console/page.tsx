import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { InstancesGrid } from '@/components/console/instances-grid';

export const metadata = { title: 'Instances — ClawTrace' };

export default async function ConsolePage() {
  const session = await getUserSession();
  if (!session) redirect('/login?redirect=/console');
  return <InstancesGrid />;
}
