'use client';

import { useState } from 'react';
import { PLANS } from '@/lib/plans';
import styles from './plan-cards.module.css';

interface Props {
  currentTier?: string;
  pointsBalance?: number;
  onPlanSelected?: () => void;
  onClose?: () => void;
}

export function PlanCards({ currentTier = 'free', pointsBalance = 0, onPlanSelected, onClose }: Props) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleSelect(planKey: string) {
    if (planKey === currentTier) return;
    setLoadingPlan(planKey);

    try {
      if (planKey === 'free') {
        const res = await fetch('/api/console/select-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'free' }),
        });
        if (res.ok) {
          onPlanSelected?.();
          window.location.reload();
        } else {
          alert('Failed to select free plan');
          setLoadingPlan(null);
        }
        return;
      }

      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey, billing }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Failed to start checkout');
        setLoadingPlan(null);
      }
    } catch {
      alert('Network error, please try again.');
      setLoadingPlan(null);
    }
  }

  return (
    <div className={styles.root}>
      {/* Billing toggle */}
      <div className={styles.toggleRow}>
        <button
          type="button"
          className={`${styles.toggleBtn} ${billing === 'monthly' ? styles.toggleBtnActive : ''}`}
          onClick={() => setBilling('monthly')}
        >
          Monthly
        </button>
        <button
          type="button"
          className={`${styles.toggleBtn} ${billing === 'annual' ? styles.toggleBtnActive : ''}`}
          onClick={() => setBilling('annual')}
        >
          Annual
          <span className={styles.saveBadge}>Save 20%</span>
        </button>
      </div>

      {/* Plan cards */}
      <div className={styles.grid}>
        {PLANS.map((plan) => {
          const isCurrent = plan.key === currentTier;
          const price = billing === 'annual' ? plan.priceAnnual : plan.priceMonthly;
          const originalPrice = billing === 'annual' ? plan.originalPriceAnnual : plan.originalPriceMonthly;
          const isLoading = loadingPlan === plan.key;
          const freeEligible = plan.key === 'free' && pointsBalance >= 300;

          return (
            <div
              key={plan.key}
              className={`${styles.card} ${plan.highlight ? styles.cardHighlight : ''} ${isCurrent ? styles.cardCurrent : ''}`}
            >
              {plan.highlight && <div className={styles.popularBadge}>Most popular</div>}
              {isCurrent && <div className={styles.currentBadge}>Current plan</div>}

              <div className={styles.planName}>{plan.name}</div>

              <div className={styles.price}>
                {plan.paid ? (
                  <>
                    {originalPrice && (
                      <span className={styles.originalPrice}>{originalPrice}</span>
                    )}
                    <span className={styles.priceAmount}>{price}</span>
                    <span className={styles.pricePeriod}>/mo</span>
                  </>
                ) : (
                  <span className={styles.priceAmount}>$0</span>
                )}
              </div>

              {billing === 'annual' && plan.annualBilledNote && (
                <p className={styles.annualNote}>{plan.annualBilledNote}</p>
              )}

              <p className={styles.specs}>{plan.specs}</p>

              <ul className={styles.features}>
                {plan.features.map((f) => (
                  <li key={f} className={styles.featureItem}>
                    <svg className={styles.checkIcon} viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`${styles.ctaBtn} ${isCurrent ? styles.ctaBtnCurrent : ''} ${plan.highlight && !isCurrent ? styles.ctaBtnPrimary : ''}`}
                disabled={isCurrent || isLoading || (plan.key === 'free' && !freeEligible && currentTier !== 'free')}
                onClick={() => handleSelect(plan.key)}
              >
                {isLoading ? 'Redirecting…' : isCurrent ? 'Current plan' : plan.cta}
              </button>

              {plan.key === 'free' && !isCurrent && (
                <p className={styles.freeNote}>
                  {pointsBalance >= 300
                    ? `${pointsBalance} pts available — eligible`
                    : `Requires 300 pts (you have ${pointsBalance})`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
