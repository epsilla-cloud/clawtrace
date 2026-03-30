import { getUserSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, referrals } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { generateInviteCode } from '@/lib/referral';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getUserSession();
  if (!session?.dbId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const [user] = await db
    .select({ invite_code: users.invite_code, points_balance: users.points_balance })
    .from(users)
    .where(eq(users.id, session.dbId));

  if (!user) {
    return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
  }

  // Lazily assign invite code for existing users who predate this feature
  let inviteCode = user.invite_code;
  if (!inviteCode) {
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        const code = generateInviteCode();
        await db.update(users).set({ invite_code: code }).where(eq(users.id, session.dbId));
        inviteCode = code;
        break;
      } catch { /* unique constraint collision, retry */ }
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const shareLink = `${siteUrl}/?invitecode=${inviteCode}`;

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(referrals)
    .where(eq(referrals.referrer_id, session.dbId));

  return NextResponse.json({
    inviteCode,
    shareLink,
    referralCount: countResult?.count ?? 0,
    pointsBalance: user.points_balance,
  });
}
