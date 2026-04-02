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

  let tier = 'free';
  let needsPlanSelection = false;

  if (session) {
    const [user] = await db.select().from(users).where(eq(users.id, session.dbId));
    tier = user?.tier ?? 'free';

    // Auto-select free plan for users who haven't explicitly chosen one.
    if (user && !user.plan_selected && user.tier === 'free') {
      await db.update(users)
        .set({ plan_selected: true, updated_at: new Date() })
        .where(eq(users.id, session.dbId));
    }

    needsPlanSelection = !user?.plan_selected && user?.tier !== 'free';
  }

  // Pass minimal serialisable session data to the client sidebar
  const sidebarSession = session
    ? { name: session.name, avatar: session.avatar }
    : null;

  return (
    <div className={styles.shell}>
      <ConsoleSidebar session={sidebarSession} />
      <div className={styles.main}>
        {session && (
          <ConsoleTopbar tier={tier} name={session.name} avatar={session.avatar} />
        )}
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
