'use client';

import { useEffect, useState } from 'react';
import styles from './referrals.module.css';

interface ReferralInfo {
  inviteCode: string;
  shareLink: string;
  referralCount: number;
  pointsBalance: number;
}

interface ReferralEntry {
  id: string;
  referredName: string;
  referredAvatar: string;
  referrerPointsAwarded: number;
  createdAt: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" onClick={handleCopy} className={styles.copyBtn}>
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M2 7l3 3 6-6" stroke="#2f6b3b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ color: '#2f6b3b' }}>Copied</span>
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <rect x="4.5" y="1.5" width="7" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M1.5 4.5h1.5v6.5h6.5v1.5H2a.5.5 0 0 1-.5-.5V4.5z" fill="currentColor" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function ReferralsPage() {
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'invite' | 'history'>('invite');

  useEffect(() => {
    Promise.all([
      fetch('/api/referral/info').then((r) => r.json()),
      fetch('/api/referral/list?limit=20').then((r) => r.json()),
    ]).then(([infoData, listData]: [ReferralInfo, { referrals?: ReferralEntry[] }]) => {
      setInfo(infoData);
      setReferrals(listData.referrals ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Referrals</h1>
        <p className={styles.pageSub}>Invite friends and both of you earn points</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'invite' ? styles.tabActive : ''}`}
          onClick={() => setTab('invite')}
        >
          Invite code
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'history' ? styles.tabActive : ''}`}
          onClick={() => setTab('history')}
        >
          Referral history
          {!loading && referrals.length > 0 && (
            <span className={styles.tabBadge}>{referrals.length}</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* ── Invite code tab ── */}
        {tab === 'invite' && (
          <div className={styles.section}>
            {/* Stats grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <p className={styles.statLabel}>My points</p>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.5" stroke="#e6a318" strokeWidth="1.3" />
                    <path d="M8 4v4l2.5 2.5" stroke="#e6a318" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>
                {loading ? (
                  <div className={styles.skeleton} style={{ width: 56, height: 32 }} />
                ) : (
                  <p className={styles.statValue}>{info?.pointsBalance ?? 0}</p>
                )}
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <p className={styles.statLabel}>Referrals</p>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="5" cy="5" r="2.5" stroke="#4f6bcd" strokeWidth="1.3" />
                    <circle cx="11" cy="5" r="2.5" stroke="#4f6bcd" strokeWidth="1.3" />
                    <path d="M1 13c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="#4f6bcd" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M11 9c1.66 0 3 1.34 3 3" stroke="#4f6bcd" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>
                {loading ? (
                  <div className={styles.skeleton} style={{ width: 40, height: 32 }} />
                ) : (
                  <p className={styles.statValue}>{info?.referralCount ?? 0}</p>
                )}
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <p className={styles.statLabel}>Reward per referral</p>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z" stroke="#2f6b3b" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className={styles.statValue}>30 pts</p>
              </div>
            </div>

            {/* Invite code + share link */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>My invite code</h2>

              {loading ? (
                <div className={styles.loadingRows}>
                  <div className={styles.skeleton} style={{ height: 40 }} />
                  <div className={styles.skeleton} style={{ height: 40 }} />
                </div>
              ) : (
                <div className={styles.codeRows}>
                  <div className={styles.codeRow}>
                    <p className={styles.codeLabel}>Invite code</p>
                    <div className={styles.codeField}>
                      <code className={styles.code}>{info?.inviteCode}</code>
                      <CopyButton text={info?.inviteCode ?? ''} />
                    </div>
                  </div>
                  <div className={styles.codeRow}>
                    <p className={styles.codeLabel}>Share link</p>
                    <div className={styles.codeField}>
                      <span className={styles.shareLink}>{info?.shareLink}</span>
                      <CopyButton text={info?.shareLink ?? ''} />
                      {info?.shareLink && (
                        <a
                          href={info.shareLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.externalLink}
                          title="Open share link"
                        >
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                            <path d="M5.5 2H2v9h9V7.5M7.5 1.5H11v3.5M7 6l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* How it works */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>How it works</h2>
              <div className={styles.rulesList}>
                <p className={styles.rule}>
                  <span className={styles.ruleDot} />
                  Every new user receives <strong>20 points</strong> upon signing up
                </p>
                <p className={styles.rule}>
                  <span className={styles.ruleDot} />
                  When a friend registers through your link, you earn <strong>30 points</strong>
                </p>
                <p className={styles.rule}>
                  <span className={styles.ruleDot} />
                  Your friend also gets an extra <strong>10 points</strong> on top of their signup bonus
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── History tab ── */}
        {tab === 'history' && (
          <div className={styles.section}>
            <div className={styles.tableCard}>
              {loading ? (
                <div className={styles.loadingRows}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={styles.skeleton} style={{ height: 40 }} />
                  ))}
                </div>
              ) : referrals.length === 0 ? (
                <div className={styles.emptyState}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="5.5" stroke="#dacbb4" strokeWidth="1.4" />
                    <circle cx="24" cy="12" r="5.5" stroke="#dacbb4" strokeWidth="1.4" />
                    <path d="M3 30c0-5 4-9 9-9s9 4 9 9" stroke="#dacbb4" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M24 21c3.87 0 7 3.13 7 7" stroke="#dacbb4" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <p className={styles.emptyText}>No referrals yet</p>
                  <p className={styles.emptySub}>Share your invite link to start earning points!</p>
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHead}>
                      <th className={styles.th}>User</th>
                      <th className={styles.th}>Points earned</th>
                      <th className={styles.th}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((r) => (
                      <tr key={r.id} className={styles.tableRow}>
                        <td className={styles.td}>{r.referredName}</td>
                        <td className={styles.td}>
                          <span className={styles.pointsBadge}>+{r.referrerPointsAwarded} pts</span>
                        </td>
                        <td className={styles.tdMuted}>
                          {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
