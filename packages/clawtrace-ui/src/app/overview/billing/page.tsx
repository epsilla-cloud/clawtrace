import { getUserSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import type Stripe from 'stripe';
import { PlanCards } from '@/components/console/plan-cards';
import styles from './billing.module.css';

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
};

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount / 100);
}

function CardBrandLogo({ brand }: { brand: string }) {
  if (brand === 'visa') {
    return (
      <svg viewBox="0 0 60 36" className={styles.cardLogo} aria-label="Visa">
        <rect width="60" height="36" rx="4" fill="#1A1F71" />
        <text x="50%" y="25" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontStyle="italic" fontFamily="Arial, sans-serif">VISA</text>
      </svg>
    );
  }
  if (brand === 'mastercard') {
    return (
      <svg viewBox="0 0 60 36" className={styles.cardLogo} aria-label="Mastercard">
        <rect width="60" height="36" rx="4" fill="#252525" />
        <circle cx="23" cy="18" r="11" fill="#EB001B" />
        <circle cx="37" cy="18" r="11" fill="#F79E1B" />
        <path d="M30 9.5a11 11 0 0 1 0 17A11 11 0 0 1 30 9.5z" fill="#FF5F00" />
      </svg>
    );
  }
  if (brand === 'amex') {
    return (
      <svg viewBox="0 0 60 36" className={styles.cardLogo} aria-label="Amex">
        <rect width="60" height="36" rx="4" fill="#2E77BC" />
        <text x="50%" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">AMEX</text>
      </svg>
    );
  }
  const labels: Record<string, string> = { discover: 'Discover', unionpay: 'UnionPay', jcb: 'JCB', diners: 'Diners' };
  return <span className={styles.cardBrandText}>{labels[brand] ?? brand.toUpperCase()}</span>;
}

const INVOICE_STATUS_CLASS: Record<string, string> = {
  paid: styles.statusPaid ?? '',
  open: styles.statusOpen ?? '',
  void: styles.statusVoid ?? '',
  uncollectible: styles.statusFailed ?? '',
  draft: styles.statusVoid ?? '',
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getUserSession();
  if (!session) redirect('/login?redirect=/console/billing');

  const { tab: tabParam } = await searchParams;
  const tab = tabParam === 'history' ? 'history' : tabParam === 'upgrade' ? 'upgrade' : 'payment';

  const [user] = await db.select().from(users).where(eq(users.id, session.dbId));
  const tier = user?.tier ?? 'free';
  const customerId = user?.stripe_customer_id;

  let paymentMethods: Stripe.PaymentMethod[] = [];
  let invoices: Stripe.Invoice[] = [];

  if (customerId) {
    const [pmResult, invResult] = await Promise.allSettled([
      stripe.paymentMethods.list({ customer: customerId, type: 'card' }),
      stripe.invoices.list({ customer: customerId, limit: 24 }),
    ]);
    if (pmResult.status === 'fulfilled') paymentMethods = pmResult.value.data;
    if (invResult.status === 'fulfilled') invoices = invResult.value.data;
  }

  const primaryCard = paymentMethods[0]?.card;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Billing</h1>
          <div className={styles.currentPlanRow}>
            <span className={styles.currentPlanLabel}>Current plan</span>
            <span className={`${styles.tierBadge} ${styles[`tier_${tier}`]}`}>
              {TIER_LABELS[tier] ?? tier}
            </span>
          </div>
        </div>
        {tier !== 'pro' && (
          <a href="/console/billing?tab=upgrade" className={styles.upgradeBtn}>
            Upgrade plan
          </a>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <a href="/console/billing" className={`${styles.tab} ${tab === 'payment' ? styles.tabActive : ''}`}>
          Payment method
        </a>
        <a href="/console/billing?tab=history" className={`${styles.tab} ${tab === 'history' ? styles.tabActive : ''}`}>
          Billing history
          {invoices.length > 0 && (
            <span className={styles.tabBadge}>{invoices.length}</span>
          )}
        </a>
        {tier !== 'pro' && (
          <a href="/console/billing?tab=upgrade" className={`${styles.tab} ${tab === 'upgrade' ? styles.tabActive : ''}`}>
            Upgrade
          </a>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>

        {/* Payment method tab */}
        {tab === 'payment' && (
          <div className={styles.section}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Payment method</h2>
              {primaryCard ? (
                <div className={styles.cardRow}>
                  <div className={styles.cardLogoWrap}>
                    <CardBrandLogo brand={primaryCard.brand} />
                  </div>
                  <div className={styles.cardDetails}>
                    <p className={styles.cardNumber}>•••• •••• •••• {primaryCard.last4}</p>
                    <p className={styles.cardExpiry}>Expires {primaryCard.exp_month}/{primaryCard.exp_year}</p>
                  </div>
                  <span className={styles.activeBadge}>Active</span>
                </div>
              ) : (
                <div className={styles.emptyCard}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <rect x="2" y="6" width="24" height="16" rx="3" stroke="#7c6854" strokeWidth="1.4" />
                    <path d="M2 12h24" stroke="#7c6854" strokeWidth="1.4" />
                    <path d="M6 17h6" stroke="#7c6854" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  <p className={styles.emptyText}>No payment method on file</p>
                  {tier !== 'pro' && (
                    <a href="/console/billing?tab=upgrade" className={styles.addCardLink}>
                      Add payment method →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing history tab */}
        {tab === 'history' && (
          <div className={styles.section}>
            <div className={styles.tableCard}>
              {tier === 'free' ? (
                <div className={styles.emptyState}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <rect x="2" y="6" width="24" height="16" rx="3" stroke="#7c6854" strokeWidth="1.4" />
                    <path d="M2 12h24" stroke="#7c6854" strokeWidth="1.4" />
                  </svg>
                  <p className={styles.emptyStateText}>No billing history</p>
                  <p className={styles.emptyStateSub}>You&apos;re on the Free plan. Upgrade to see invoices here.</p>
                </div>
              ) : invoices.length === 0 ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyStateText}>No invoices yet</p>
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHead}>
                      <th className={styles.th}>Date</th>
                      <th className={styles.th}>Description</th>
                      <th className={`${styles.th} ${styles.thRight}`}>Amount</th>
                      <th className={`${styles.th} ${styles.thCenter}`}>Status</th>
                      <th className={`${styles.th} ${styles.thCenter}`}>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className={styles.tableRow}>
                        <td className={styles.td}>{inv.created ? formatDate(inv.created) : '—'}</td>
                        <td className={`${styles.td} ${styles.tdTruncate}`}>
                          {inv.lines.data[0]?.description ?? inv.description ?? 'Subscription'}
                        </td>
                        <td className={`${styles.td} ${styles.tdRight}`}>
                          {inv.amount_paid != null ? formatAmount(inv.amount_paid, inv.currency) : '—'}
                        </td>
                        <td className={`${styles.td} ${styles.tdCenter}`}>
                          <span className={`${styles.statusBadge} ${INVOICE_STATUS_CLASS[inv.status ?? ''] ?? styles.statusVoid}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className={`${styles.td} ${styles.tdCenter}`}>
                          <div className={styles.invoiceLinks}>
                            {inv.invoice_pdf && (
                              <a href={inv.invoice_pdf} target="_blank" rel="noopener noreferrer" className={styles.invoiceLink} title="Download PDF">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </a>
                            )}
                            {inv.hosted_invoice_url && (
                              <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer" className={styles.invoiceLink} title="View invoice">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M6 2H2v10h10V8M8 2h4v4M8 6l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Upgrade tab */}
        {tab === 'upgrade' && (
          <div className={styles.section}>
            <PlanCards currentTier={tier} />
          </div>
        )}
      </div>
    </div>
  );
}
