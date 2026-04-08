import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const PAYMENT = process.env.CLAWTRACE_PAYMENT_URL ?? '';

export async function GET(request: NextRequest) {
  const store = await cookies();
  const token = store.get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!PAYMENT) return NextResponse.json({ error: 'not configured' }, { status: 503 });

  const qs = request.nextUrl.searchParams.toString();
  const res = await fetch(`${PAYMENT}/v1/credits/usage?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
