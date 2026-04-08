'use client';

import styles from './AccountPanel.module.css';

const TIER_LABELS: Record<string, string> = { free: 'Free', starter: 'Starter', pro: 'Pro' };
const PROVIDER_LABELS: Record<string, string> = { google: 'Google', github: 'GitHub' };

interface Props {
  name: string;
  email: string;
  avatar: string;
  provider: string;
  tier: string;
  points: number;
}

export function AccountPanel({ name, email, avatar, provider, tier, points }: Props) {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>Account</h1>

      {/* Profile card */}
      <div className={styles.card}>
        <div className={styles.profile}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={name} className={styles.avatar} />
          ) : (
            <span className={styles.avatarFallback}>{name.charAt(0).toUpperCase()}</span>
          )}
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>{name}</p>
            {email && <p className={styles.profileEmail}>{email}</p>}
            <span className={styles.providerBadge}>
              {PROVIDER_LABELS[provider] ?? provider}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
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
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <a href="/billing" className={styles.actionLink}>Billing &amp; Plans →</a>
        <a href="/overview/referrals" className={styles.actionLink}>Referrals →</a>
      </div>

      {/* Logout */}
      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M7 3H3v12h4M12 6l3 3-3 3M15 9H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Sign out
      </button>
    </div>
  );
}
