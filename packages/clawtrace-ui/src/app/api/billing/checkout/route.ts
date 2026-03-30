import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';
import { STRIPE_PRODUCTS } from '@/lib/stripe-products';

export const runtime = 'nodejs';

async function getOrCreateCustomer(user: {
  id: string;
  email: string | null;
  name: string;
  stripe_customer_id: string | null;
}) {
  if (user.stripe_customer_id) return user.stripe_customer_id;
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.name,
    metadata: { userId: user.id },
  });
  await db
    .update(users)
    .set({ stripe_customer_id: customer.id, updated_at: new Date() })
    .where(eq(users.id, user.id));
  return customer.id;
}

export async function POST(request: NextRequest) {
  const session = await getUserSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { planKey, billing } = (await request.json()) as {
    planKey: string;
    billing: 'monthly' | 'annual';
  };

  const [user] = await db.select().from(users).where(eq(users.id, session.dbId));
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const customerId = await getOrCreateCustomer(user);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  // ── Free plan: require 300 points ──
  if (planKey === 'free') {
    if ((user.points_balance ?? 0) < 300) {
      return NextResponse.json({ error: 'insufficient_points' }, { status: 403 });
    }
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'setup',
      currency: 'usd',
      customer: customerId,
      success_url: `${siteUrl}/console`,
      cancel_url: `${siteUrl}/console/billing`,
      metadata: { userId: user.id, planKey: 'free', billing: 'monthly' },
    });
    return NextResponse.json({ url: checkoutSession.url });
  }

  // ── Paid plan: subscription ──
  if (!STRIPE_PRODUCTS[planKey]?.[billing]) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const productId = STRIPE_PRODUCTS[planKey][billing];
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });
  if (!prices.data.length) {
    return NextResponse.json({ error: 'No active price found for this plan' }, { status: 500 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: prices.data[0].id, quantity: 1 }],
    success_url: `${siteUrl}/console/billing?upgraded=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/console/billing`,
    metadata: { userId: user.id, planKey, billing },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
