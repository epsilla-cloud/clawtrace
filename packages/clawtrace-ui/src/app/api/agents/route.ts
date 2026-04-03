import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const BACKEND = process.env.CLAWTRACE_BACKEND_URL ?? 'https://api.clawtrace.ai';

async function authHeader(): Promise<Record<string, string>> {
  const store = await cookies();
  const token = store.get('auth_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET() {
  const res = await fetch(`${BACKEND}/v1/agents`, {
    headers: await authHeader(),
    cache: 'no-store',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
