import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const BACKEND = process.env.CLAWTRACE_BACKEND_URL ?? 'https://api.clawtrace.ai';

async function authHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET() {
  const res = await fetch(`${BACKEND}/v1/keys`, {
    headers: await authHeader(),
    cache: 'no-store',
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch(`${BACKEND}/v1/keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...await authHeader() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
