import { getUserSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, referrals } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await getUserSession();
  if (!session?.dbId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));
  const offset = (page - 1) * limit;

  const rows = await db
    .select({
      id: referrals.id,
      referredEmail: users.email,
      referredAvatar: users.avatar,
      createdAt: referrals.created_at,
    })
    .from(referrals)
    .innerJoin(users, eq(referrals.referred_id, users.id))
    .where(eq(referrals.referrer_id, session.dbId))
    .orderBy(desc(referrals.created_at))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({ referrals: rows, page, limit });
}
