/**
 * billing.ts — Calls the payment service to grant initial credits on signup.
 *
 * The payment service's ensure_signup_bonus (called on GET /v1/credits) is
 * idempotent and handles referral bonuses too, but we also fire an explicit
 * grant here so credits are available immediately — before the user ever
 * visits the billing page.
 */

const PAYMENT_URL = process.env.CLAWTRACE_PAYMENT_URL ?? '';
const INTERNAL_SECRET = process.env.CLAWTRACE_PAYMENT_INTERNAL_SECRET ?? '';

/**
 * Grant initial credits to a newly registered user.
 * Calls POST /v1/credits/admin/grant on the payment service.
 * Fire-and-forget — errors are logged but don't block registration.
 */
export async function grantInitialCredits(userId: string): Promise<void> {
  if (!PAYMENT_URL) {
    console.warn('CLAWTRACE_PAYMENT_URL not set, skipping initial credit grant');
    return;
  }

  try {
    const res = await fetch(`${PAYMENT_URL}/v1/credits/admin/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': INTERNAL_SECRET,
      },
      body: JSON.stringify({
        credits: 200,
        source: 'signup_bonus',
        user_id: userId,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Initial credit grant failed (${res.status}):`, body);
      return;
    }

    console.log(`Granted initial credits to new user ${userId}`);
  } catch (err) {
    console.error('Failed to call payment service for initial credits:', err);
  }
}
