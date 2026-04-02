import { getUserSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { PlanCards } from '@/components/console/plan-cards';
import { ObserveKeys } from '@/components/console/observe-keys';
import styles from './dashboard.module.css';

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
};

const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
  github: 'GitHub',
};

export default async function ConsolePage() {
  const session = await getUserSession();
  if (!session) redirect('/login?redirect=/console');

  const [user] = await db
    .select({
      tier: users.tier,
      points_balance: users.points_balance,
      invite_code: users.invite_code,
      email: users.email,
      card_verified: users.card_verified,
    })
    .from(users)
    .where(eq(users.id, session.dbId));

  const tier = user?.tier ?? 'free';
  const points = user?.points_balance ?? 0;
  const inviteCode = user?.invite_code ?? '—';

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Overview</h1>
        <p className={styles.pageSub}>Your account and subscription details</p>
      </div>

      {/* Profile + stats row */}
      <div className={styles.topRow}>
        {/* Profile card */}
        <div className={styles.card}>
          <div className={styles.profileRow}>
            {session.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.avatar}
                alt={session.name}
                width={52}
                height={52}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarFallback}>
                {session.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={styles.profileInfo}>
              <p className={styles.profileName}>{session.name}</p>
              {session.email && <p className={styles.profileEmail}>{session.email}</p>}
              <span className={styles.providerBadge}>
                {PROVIDER_LABELS[session.provider] ?? session.provider}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Plan</p>
            <p className={`${styles.statValue} ${styles[`tier_${tier}`]}`}>
              {TIER_LABELS[tier] ?? tier}
            </p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Points</p>
            <p className={styles.statValue}>{points}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Invite code</p>
            <div className={styles.inviteRow}>
              <code className={styles.inviteCode}>{inviteCode}</code>
              <a href="/console/referrals" className={styles.inviteLink}>Share →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade section (only for non-pro users) */}
      {tier !== 'pro' && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {tier === 'free' ? 'Choose a plan' : 'Upgrade your plan'}
            </h2>
            <p className={styles.sectionSub}>
              Unlock more capacity and features for your ClawTrace workspace
            </p>
          </div>
          <PlanCards currentTier={tier} />
        </div>
      )}

      {/* Observe Keys — connect OpenClaw agents */}
      <div className={styles.section}>
        <ObserveKeys />
      </div>

      {/* Pro user — all good */}
      {tier === 'pro' && (
        <div className={styles.card} style={{ marginTop: 0 }}>
          <div className={styles.proMessage}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="9" stroke="#2f6b3b" strokeWidth="1.5" />
              <path d="M6 10l3 3 5-5" stroke="#2f6b3b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p>You&apos;re on the <strong>Pro plan</strong> — enjoy all features!</p>
          </div>
        </div>
      )}
    </div>
  );
}
