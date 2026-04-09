import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const PAYMENT = process.env.CLAWTRACE_PAYMENT_URL ?? '';

export async function GET() {
  if (!PAYMENT) return NextResponse.json([], { status: 200 });

  const res = await fetch(`${PAYMENT}/v1/credits/packages`, { cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
