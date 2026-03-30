import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { users, referrals, point_transactions } from '@/lib/db/schema';
import { eq, and, sql, gte } from 'drizzle-orm';

export const REFERRER_SIGNUP_BONUS = 30;
export const REFERRED_SIGNUP_BONUS = 10;
export const NEW_USER_SIGNUP_BONUS = 20;

export const REDEMPTION_OPTIONS = {
  free_month: { cost: 100, label: '1 Month Free' },
  permanent_access: { cost: 1000, label: 'Permanent Access' },
} as const;

export type RewardType = keyof typeof REDEMPTION_OPTIONS;

const MAX_REFERRALS_PER_MONTH = 50;

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** Generate a random 8-char base62 code. Uniqueness is enforced by the DB unique constraint. */
export function generateInviteCode(): string {
  const bytes = randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += CHARS[bytes[i] % 62];
  }
  return code;
}

export async function awardSignupBonus(userId: string): Promise<void> {
  const [updated] = await db
    .update(users)
    .set({ points_balance: sql`${users.points_balance} + ${NEW_USER_SIGNUP_BONUS}` })
    .where(eq(users.id, userId))
    .returning({ points_balance: users.points_balance });

  await db.insert(point_transactions).values({
    user_id: userId,
    amount: NEW_USER_SIGNUP_BONUS,
    balance_after: updated.points_balance,
    type: 'signup_bonus',
    description: 'Welcome bonus',
  });
}

export async function applyReferral(newUserId: string, inviteCode: string): Promise<boolean> {
  // Find referrer by invite code
  const [referrer] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.invite_code, inviteCode));

  if (!referrer) return false;

  // Self-referral check
  if (referrer.id === newUserId) return false;

  // Check if new user already has a referrer
  const [newUser] = await db
    .select({ referred_by: users.referred_by })
    .from(users)
    .where(eq(users.id, newUserId));

  if (!newUser || newUser.referred_by) return false;

  // Cap: max 50 referrals per user per month
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(referrals)
    .where(
      and(
        eq(referrals.referrer_id, referrer.id),
        gte(referrals.created_at, monthAgo)
      )
    );

  if (countResult && countResult.count >= MAX_REFERRALS_PER_MONTH) return false;

  // Set referred_by on new user (only if null)
  const [updated] = await db
    .update(users)
    .set({ referred_by: referrer.id })
    .where(and(eq(users.id, newUserId), sql`${users.referred_by} IS NULL`))
    .returning({ id: users.id });

  if (!updated) return false;

  // Create referral record
  const [referral] = await db
    .insert(referrals)
    .values({
      referrer_id: referrer.id,
      referred_id: newUserId,
      referrer_points_awarded: REFERRER_SIGNUP_BONUS,
      referred_points_awarded: REFERRED_SIGNUP_BONUS,
    })
    .returning();

  // Award points to referrer
  const [updatedReferrer] = await db
    .update(users)
    .set({
      points_balance: sql`${users.points_balance} + ${REFERRER_SIGNUP_BONUS}`,
    })
    .where(eq(users.id, referrer.id))
    .returning({ points_balance: users.points_balance });

  await db.insert(point_transactions).values({
    user_id: referrer.id,
    amount: REFERRER_SIGNUP_BONUS,
    balance_after: updatedReferrer.points_balance,
    type: 'referral_bonus',
    description: 'Referral signup bonus',
    reference_id: referral.id,
  });

  // Award points to referred user
  const [updatedReferred] = await db
    .update(users)
    .set({
      points_balance: sql`${users.points_balance} + ${REFERRED_SIGNUP_BONUS}`,
    })
    .where(eq(users.id, newUserId))
    .returning({ points_balance: users.points_balance });

  await db.insert(point_transactions).values({
    user_id: newUserId,
    amount: REFERRED_SIGNUP_BONUS,
    balance_after: updatedReferred.points_balance,
    type: 'referred_bonus',
    description: 'Welcome bonus from referral',
    reference_id: referral.id,
  });

  return true;
}
