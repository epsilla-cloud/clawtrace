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

  // Auto-select free plan for users who haven't explicitly chosen one.
  // Default tier is 'free' so new users should never be blocked — silently
  // mark plan_selected=true so the onboarding modal doesn't appear.
  if (user && !user.plan_selected && user.tier === 'free') {
    await db.update(users)
      .set({ plan_selected: true, updated_at: new Date() })
      .where(eq(users.id, session.dbId));
  }

  const needsPlanSelection = !user?.plan_selected && user?.tier !== 'free';

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
