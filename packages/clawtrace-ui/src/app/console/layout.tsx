import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ConsoleSidebar } from '@/components/console/console-sidebar';
import { ConsoleTopbar } from '@/components/console/console-topbar';
import { OnboardingModal } from '@/components/console/onboarding-modal';
import styles from './console.module.css';

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await getUserSession();
  if (!session) {
    redirect('/login?redirect=/console');
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.dbId));
  const tier = user?.tier ?? 'free';
  const needsPlanSelection = !user?.plan_selected;

  return (
    <div className={styles.shell}>
      <ConsoleSidebar />
      <div className={styles.main}>
        <ConsoleTopbar tier={tier} name={session.name} avatar={session.avatar} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
      {needsPlanSelection && <OnboardingModal />}
    </div>
  );
}
