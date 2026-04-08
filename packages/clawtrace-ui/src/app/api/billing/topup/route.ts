import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const PAYMENT = process.env.CLAWTRACE_PAYMENT_URL ?? '';

export async function POST(request: NextRequest) {
  const store = await cookies();
  const token = store.get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  if (!PAYMENT) return NextResponse.json({ error: 'payment service not configured' }, { status: 503 });

  const body = await request.json();
  const res = await fetch(`${PAYMENT}/v1/credits/topup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
