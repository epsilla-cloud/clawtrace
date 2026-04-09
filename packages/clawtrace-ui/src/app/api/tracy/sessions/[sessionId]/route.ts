import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const BACKEND = process.env.CLAWTRACE_BACKEND_URL ?? 'https://api.clawtrace.ai';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const store = await cookies();
  const token = store.get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { sessionId } = await params;
  const res = await fetch(`${BACKEND}/v1/tracy/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
