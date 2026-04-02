import { getUserSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { FlowLeftNav } from '@/components/clawtrace/flow/FlowLeftNav';
import { OnboardingModal } from '@/components/console/onboarding-modal';
import { CLAWTRACE_FLOW_PAGES } from '@/lib/flow-pages';
import styles from './console.module.css';

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await getUserSession();

  let needsPlanSelection = false;

  if (session) {
    const [user] = await db.select().from(users).where(eq(users.id, session.dbId));

    // Auto-select free plan for users who haven't explicitly chosen one.
    if (user && !user.plan_selected && user.tier === 'free') {
      await db.update(users)
        .set({ plan_selected: true, updated_at: new Date() })
        .where(eq(users.id, session.dbId));
    }

    needsPlanSelection = !user?.plan_selected && user?.tier !== 'free';
  }

  return (
    <div className={styles.shell}>
      {/* Unified left nav — shared with control-room design */}
      <FlowLeftNav allFlows={CLAWTRACE_FLOW_PAGES} />

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
