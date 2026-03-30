'use client';

import { useEffect, useState } from 'react';
import { PlanCards } from './plan-cards';
import styles from './onboarding-modal.module.css';

interface ReferralInfo {
  inviteCode: string;
  shareLink: string;
  pointsBalance: number;
  referralCount: number;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={styles.copyBtn}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6.5l2.5 2.5 5.5-5.5" stroke="#2f6b3b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ color: '#2f6b3b' }}>Copied!</span>
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <rect x="4" y="1.5" width="6.5" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1.5 4h1.5v6h6v1.5H2a.5.5 0 0 1-.5-.5V4z" fill="currentColor" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export function OnboardingModal() {
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);

  useEffect(() => {
    fetch('/api/referral/info')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setReferralInfo(data); })
      .catch(() => {});
  }, []);

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.png" alt="ClawTrace" width={26} height={26} className={styles.logo} />
            <span className={styles.headerTitle}>Get started with ClawTrace</span>
          </div>
          <button type="button" className={styles.signOutBtn} onClick={handleSignOut}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5 2H2v10h3M9 10l3-3-3-3M5 7h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign out
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <PlanCards pointsBalance={referralInfo?.pointsBalance ?? 0} />

          {/* Referral banner */}
          {referralInfo && (
            <div className={styles.referralBanner}>
              <div className={styles.referralTop}>
                <div className={styles.referralLabel}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                    <path d="M7.5 1.5l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5z" stroke="#e6a318" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  My Points
                </div>
                <span className={styles.referralPoints}>{referralInfo.pointsBalance} pts</span>
              </div>
              <p className={styles.referralDesc}>
                New users get <strong>20 pts</strong> free · Invite friends — you earn <strong>30 pts</strong>, they get <strong>10 extra pts</strong>
              </p>
              <div className={styles.referralLink}>
                <span className={styles.referralLinkText}>{referralInfo.shareLink}</span>
                <CopyButton text={referralInfo.shareLink} />
              </div>
            </div>
          )}

          <p className={styles.footer}>Cancel anytime · No hidden fees</p>
        </div>
      </div>
    </div>
  );
}
