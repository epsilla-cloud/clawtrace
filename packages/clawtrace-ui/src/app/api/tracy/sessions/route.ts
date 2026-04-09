import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const BACKEND = process.env.CLAWTRACE_BACKEND_URL ?? 'https://api.clawtrace.ai';

export async function GET(request: NextRequest) {
  const store = await cookies();
  const token = store.get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const limit = request.nextUrl.searchParams.get('limit') ?? '20';
  const res = await fetch(`${BACKEND}/v1/tracy/sessions?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
