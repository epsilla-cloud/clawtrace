import { getUserSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getUserSession();
  return NextResponse.json(session ?? null);
}
