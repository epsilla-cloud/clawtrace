'use client';

import { useState } from 'react';
import styles from './console-topbar.module.css';
import { PlanCards } from './plan-cards';

interface Props {
  tier: string;
  name: string;
  avatar?: string;
}

export function ConsoleTopbar({ tier, name, avatar }: Props) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <>
      <header className={styles.topbar}>
        <div />
        <div className={styles.right}>
          {tier !== 'pro' && tier !== 'enterprise' && (
            <button
              type="button"
              className={styles.upgradeBtn}
              onClick={() => setShowUpgrade(true)}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M6.5 1.5l1.2 2.8 3 .4-2.2 2.1.5 3-2.5-1.3-2.5 1.3.5-3L2.3 4.7l3-.4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15" />
              </svg>
              Upgrade
            </button>
          )}

          <a href="/console/referrals" className={styles.topbarLink}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="4.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="9.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1 11.5c0-1.93 1.57-3.5 3.5-3.5S8 9.57 8 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9.5 8c1.66 0 3 1.34 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span>Invite friends</span>
          </a>

          <a href="/" className={styles.topbarLink}>← Home</a>

          <span className={styles.topbarName}>{name}</span>

          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={name} width={28} height={28} className={styles.topbarAvatar} />
          ) : (
            <span className={styles.topbarAvatarFallback}>
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </header>

      {showUpgrade && (
        <div className={styles.upgradeOverlay} onClick={() => setShowUpgrade(false)}>
          <div className={styles.upgradePanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.upgradePanelHeader}>
              <span className={styles.upgradePanelTitle}>Upgrade your plan</span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowUpgrade(false)}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className={styles.upgradePanelBody}>
              <PlanCards currentTier={tier} onClose={() => setShowUpgrade(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
