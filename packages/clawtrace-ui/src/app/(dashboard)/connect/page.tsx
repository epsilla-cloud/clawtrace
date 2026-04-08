import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/auth';
import { ConnectWizard } from '@/components/console/connect-wizard';

export const metadata = { title: 'Connect OpenClaw' };

export default async function ConnectPage() {
  const session = await getUserSession();
  if (!session) redirect('/login');
  return <ConnectWizard />;
}
