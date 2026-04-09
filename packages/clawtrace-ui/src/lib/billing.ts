/**
 * billing.ts — Calls the payment service to grant credits on signup and referral.
 */

const PAYMENT_URL = process.env.CLAWTRACE_PAYMENT_URL ?? '';
const INTERNAL_SECRET = process.env.CLAWTRACE_PAYMENT_INTERNAL_SECRET ?? '';

async function grantCredits(userId: string, credits: number, source: string): Promise<boolean> {
  if (!PAYMENT_URL) {
    console.warn('CLAWTRACE_PAYMENT_URL not set, skipping credit grant');
    return false;
  }
  try {
    const res = await fetch(`${PAYMENT_URL}/v1/credits/admin/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': INTERNAL_SECRET,
      },
      body: JSON.stringify({ credits, source, user_id: userId }),
    });
    if (!res.ok) {
      console.error(`Credit grant failed (${res.status}):`, await res.text());
      return false;
    }
    console.log(`Granted ${credits} ${source} credits to ${userId}`);
    return true;
  } catch (err) {
    console.error('Failed to call payment service:', err);
    return false;
  }
}

/** Grant 100 signup credits to a newly registered user. */
export async function grantInitialCredits(userId: string): Promise<void> {
  await grantCredits(userId, 100, 'signup_bonus');
}

/** Grant 200 referral credits to both the new user and the referrer. */
export async function grantReferralCredits(newUserId: string, referrerId: string): Promise<void> {
  await Promise.all([
    grantCredits(newUserId, 200, 'referee_bonus'),
    grantCredits(referrerId, 200, 'referrer_bonus'),
  ]);
}
