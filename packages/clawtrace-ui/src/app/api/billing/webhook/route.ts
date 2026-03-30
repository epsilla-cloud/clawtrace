import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, planKey } = session.metadata ?? {};

    if (userId && planKey) {
      const updateData: Record<string, unknown> = {
        tier: planKey,
        plan_selected: true,
        card_verified: true,
        updated_at: new Date(),
      };

      if (session.customer && typeof session.customer === 'string') {
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (user && !user.stripe_customer_id) {
          updateData.stripe_customer_id = session.customer;
        }
      }

      await db.update(users).set(updateData).where(eq(users.id, userId));
    }
  }

  return NextResponse.json({ ok: true });
}
