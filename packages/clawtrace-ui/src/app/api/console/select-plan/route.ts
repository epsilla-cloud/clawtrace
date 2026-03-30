import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { plan } = (await request.json()) as { plan: string };
  if (plan !== 'free') {
    return NextResponse.json({ error: 'Invalid plan for direct selection' }, { status: 400 });
  }

  await db
    .update(users)
    .set({ plan_selected: true, tier: 'free', updated_at: new Date() })
    .where(eq(users.id, session.dbId));

  return NextResponse.json({ ok: true });
}
