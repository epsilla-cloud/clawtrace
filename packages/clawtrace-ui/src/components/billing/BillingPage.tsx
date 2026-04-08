'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import styles from './BillingPage.module.css';

/* ── Types ─────────────────────────────────────────────────────────────── */
type CreditPurchase = {
  id: string;
  credits: number;
  credits_initial: number;
  source: string;
  stripe_payment_intent_id: string | null;
  receipt_url: string | null;
  invoice_url: string | null;
  amount_paid_cents: number | null;
  expires_at: string;
  created_at: string;
  status: 'active' | 'expired' | 'exhausted';
};

type CreditStatus = {
  total_remaining: number;
  purchases: CreditPurchase[];
  is_deficit: boolean;
};

type CreditPackage = {
  id: string;
  label: string;
  price_usd: number;
  credits: number;
  badge: string | null;
};

/* ── Helpers ───────────────────────────────────────────────────────────── */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatCredits(n: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(n));
}

function sourceLabel(source: string): string {
  switch (source) {
    case 'signup_bonus': return 'Sign Up';
    case 'referrer_bonus': return 'Referral Reward';
    case 'referee_bonus': return 'Invited Bonus';
    case 'referral_bonus': return 'Referral Bonus';
    case 'topup': return 'Purchase';
    case 'admin_grant': return 'Admin Grant';
    case 'launch_bonus': return 'Launch Bonus';
    default: return source;
  }
}

/* ── Gift icon SVG ─────────────────────────────────────────────────────── */
function GiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="14" width="26" height="14" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="3" y="14" width="26" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5" y="8" width="22" height="6" rx="2" fill="currentColor" opacity="0.25" />
      <rect x="5" y="8" width="22" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="8" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 8C16 8 13 4 10 4C8 4 7 5.5 7 7C7 8.5 8.5 8 16 8Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M16 8C16 8 19 4 22 4C24 4 25 5.5 25 7C25 8.5 23.5 8 16 8Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

/* CoinIcon removed — using /icons/coin.png directly via Image */

/* ── Main component ────────────────────────────────────────────────────── */
export function BillingPage() {
  const [status, setStatus] = useState<CreditStatus | null>(null);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [creditsRes, pkgRes] = await Promise.all([
        fetch('/api/billing/credits', { cache: 'no-store' }),
        fetch('/api/billing/credits/packages', { cache: 'no-store' }),
      ]);
      if (creditsRes.ok) setStatus(await creditsRes.json());
      if (pkgRes.ok) setPackages(await pkgRes.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handlePurchase = async (packageId: string) => {
    setPurchasing(packageId);
    try {
      const res = await fetch('/api/billing/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package_id: packageId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      }
    } catch { /* ignore */ }
    setPurchasing(null);
  };

  /* ── Pagination ──────────────────────────────────────────────────────── */
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const purchases = status?.purchases ?? [];
  const totalPages = Math.max(1, Math.ceil(purchases.length / pageSize));
  const pagedPurchases = purchases.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <section className={styles.shell}>
      <div className={styles.content}>
        {/* Header — matches trace page breadcrumb style */}
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            <span className={styles.breadcrumbCurrent}>Billing</span>
          </nav>
        </header>

        {/* Credit Balance Card */}
        <div className={styles.balanceCard}>
          <span className={styles.balanceLabel}>Credit Balance</span>
          <div className={styles.balanceValue}>
            <Image src="/icons/coin.png" alt="" width={36} height={36} className={styles.balanceCoin} unoptimized />
            <span>{loading ? '...' : formatCredits(status?.total_remaining ?? 0)}</span>
          </div>
        </div>

        {/* Credit Packages */}
        <div className={styles.packagesGrid}>
          {packages.map((pkg) => (
            <div key={pkg.id} className={styles.packageWrap}>
              {pkg.badge && <span className={styles.packageBadge}>{pkg.badge}</span>}
              <button
                className={styles.packageCard}
                onClick={() => handlePurchase(pkg.id)}
                disabled={purchasing !== null}
              >
              <GiftIcon className={styles.packageIcon} />
              <span className={styles.packageBuy}>Buy</span>
              <span className={styles.packageCredits}>
                {formatCredits(pkg.credits)} Credits
              </span>
              <div className={styles.packageFooter}>
                <span className={styles.packagePrice}>For ${pkg.price_usd}</span>
                <span className={styles.packageExpiry}>Expires in 1 year</span>
              </div>
              {purchasing === pkg.id && <span className={styles.packageLoading}>Redirecting...</span>}
            </button>
            </div>
          ))}
        </div>

        {/* Credit History Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Credit Balance</th>
                <th>Granted At</th>
                <th>Expires At</th>
                <th>Status</th>
                <th>Amount Paid</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className={styles.empty}>Loading...</td></tr>
              )}
              {!loading && pagedPurchases.length === 0 && (
                <tr><td colSpan={7} className={styles.empty}>No credit history yet</td></tr>
              )}
              {pagedPurchases.map((p) => {
                const isPurchase = p.source === 'topup';
                const amountPaid = p.amount_paid_cents
                  ? `$${(p.amount_paid_cents / 100).toFixed(2)}`
                  : null;

                return (
                  <tr key={p.id}>
                    <td>{sourceLabel(p.source)}</td>
                    <td>{formatCredits(p.credits)}/{formatCredits(p.credits_initial)}</td>
                    <td>{formatDate(p.created_at)}</td>
                    <td>{formatDate(p.expires_at)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status_${p.status}`]}`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td>{amountPaid ?? 'N/A'}</td>
                    <td>
                      {p.invoice_url ? (
                        <a href={p.invoice_url} target="_blank" rel="noopener noreferrer" className={styles.invoiceLink}>
                          Download
                        </a>
                      ) : isPurchase && p.receipt_url ? (
                        <a href={p.receipt_url} target="_blank" rel="noopener noreferrer" className={styles.invoiceLink}>
                          Receipt
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageArrow}
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`${styles.pageBtn} ${page === i ? styles.pageBtnActive : ''}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={styles.pageArrow}
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
