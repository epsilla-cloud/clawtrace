import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { AccountPanel } from '@/components/account/AccountPanel';
import styles from './account.module.css';

export const metadata = { title: 'Account — ClawTrace' };

export default async function AccountPage() {
  const session = await getUserSession();
  if (!session) redirect('/overview');

  const [user] = await db
    .select({ tier: users.tier, points_balance: users.points_balance, email: users.email })
    .from(users)
    .where(eq(users.id, session.dbId));

  return (
    <main className={styles.main}>
      <AccountPanel
        name={session.name}
        email={session.email ?? user?.email ?? ''}
        avatar={session.avatar}
        provider={session.provider}
        tier={user?.tier ?? 'free'}
        points={user?.points_balance ?? 0}
      />
    </main>
  );
}
