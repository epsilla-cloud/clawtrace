'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import styles from './AccountPage.module.css';

/* ── Types ─────────────────────────────────────────────────────────────── */
type UserInfo = { name: string; avatar: string; email?: string };
type ReferralInfo = { inviteCode: string; shareLink: string; referralCount: number };
type Referral = { id: string; referredEmail: string | null; referredAvatar: string; createdAt: string };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function AccountPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [refInfo, setRefInfo] = useState<ReferralInfo | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [meRes, infoRes, listRes] = await Promise.all([
      fetch('/api/auth/me', { cache: 'no-store' }),
      fetch('/api/referral/info', { cache: 'no-store' }),
      fetch(`/api/referral/list?page=${page}&limit=10`, { cache: 'no-store' }),
    ]);
    if (meRes.ok) setUser(await meRes.json());
    if (infoRes.ok) setRefInfo(await infoRes.json());
    if (listRes.ok) {
      const d = await listRes.json();
      setReferrals(d.referrals ?? []);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { void load(); }, [load]);

  const handleCopy = () => {
    if (!refInfo) return;
    navigator.clipboard.writeText(refInfo.shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = () => {
    // GET redirect — server clears cookies then 302s to /login
    window.location.href = '/api/auth/signout';
  };

  return (
    <section className={styles.shell}>
      <div className={styles.content}>
        {/* Breadcrumb */}
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            <span className={styles.breadcrumbCurrent}>Account</span>
          </nav>
        </header>

        {/* Profile card */}
        <div className={styles.card}>
          {loading ? (
            <div className={styles.profileRow}>
              <div className={`${styles.avatarFallback} ${styles.skeleton}`} />
              <div className={styles.profileInfo}>
                <div className={`${styles.skeleton}`} style={{ width: 120, height: 18 }} />
                <div className={`${styles.skeleton}`} style={{ width: 180, height: 14 }} />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.profileRow}>
                {user?.avatar ? (
                  <Image src={user.avatar} alt="" width={52} height={52} className={styles.avatar} unoptimized />
                ) : (
                  <div className={styles.avatarFallback}>
                    {(user?.name ?? '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>{user?.name ?? '...'}</span>
                  <span className={styles.profileEmail}>{user?.email ?? ''}</span>
                </div>
              </div>
              <button className={styles.signOutBtn} onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* Referral invite card */}
        <div className={`${styles.card} ${styles.inviteCard}`}>
          <p className={styles.inviteTitle}>
            Invite a friend and you both get 200 FREE credits!
          </p>
          <div className={styles.inviteLinkRow}>
            <input
              readOnly
              className={styles.inviteInput}
              value={refInfo?.shareLink ?? '...'}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button className={styles.copyBtn} onClick={handleCopy} title="Copy link">
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Referral list */}
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>My Referrals</th>
                  <th>Joined At</th>
                </tr>
              </thead>
              <tbody>
                {referrals.length === 0 && (
                  <tr><td colSpan={2} className={styles.empty}>No referrals yet — share your link!</td></tr>
                )}
                {referrals.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className={styles.referralUser}>
                        {r.referredAvatar ? (
                          <Image src={r.referredAvatar} alt="" width={24} height={24} className={styles.referralAvatar} unoptimized />
                        ) : (
                          <div className={styles.referralAvatarFallback}>?</div>
                        )}
                        <span>{r.referredEmail ?? 'Anonymous'}</span>
                      </div>
                    </td>
                    <td>{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {referrals.length >= 10 && (
          <div className={styles.pagination}>
            <button className={styles.pageArrow} disabled={page <= 1} onClick={() => setPage(page - 1)}>&lt;</button>
            <span className={styles.pageNum}>{page}</span>
            <button className={styles.pageArrow} onClick={() => setPage(page + 1)}>&gt;</button>
          </div>
        )}
      </div>
    </section>
  );
}
