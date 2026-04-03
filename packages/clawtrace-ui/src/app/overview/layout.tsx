import { getUserSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { AppNav } from '@/components/app-nav/AppNav';
import { OnboardingModal } from '@/components/console/onboarding-modal';
import styles from './overview.module.css';

export default async function OverviewLayout({ children }: { children: React.ReactNode }) {
  const session = await getUserSession();
  let needsPlanSelection = false;
  if (session) {
    const [user] = await db.select().from(users).where(eq(users.id, session.dbId));
    if (user && !user.plan_selected && user.tier === 'free') {
      await db.update(users).set({ plan_selected: true, updated_at: new Date() }).where(eq(users.id, session.dbId));
    }
    needsPlanSelection = !user?.plan_selected && user?.tier !== 'free';
  }
  return (
    <div className={styles.shell}>
      <AppNav />
      <div className={styles.main}>
        <main className={styles.content}>
          {session ? children : (
            <div className={styles.unauthPrompt}>
              <p>Sign in using the panel on the left to access your ClawTrace workspace.</p>
            </div>
          )}
        </main>
      </div>
      {needsPlanSelection && <OnboardingModal />}
    </div>
  );
}
