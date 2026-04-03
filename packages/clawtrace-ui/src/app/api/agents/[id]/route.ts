import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

const BACKEND = process.env.CLAWTRACE_BACKEND_URL ?? 'https://api.clawtrace.ai';

async function authHeader(): Promise<Record<string, string>> {
  const store = await cookies();
  const token = store.get('auth_token')?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PATCH /api/agents/[id] — rename agent
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const res = await fetch(`${BACKEND}/v1/agents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...await authHeader() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// DELETE /api/agents/[id] — hard-delete agent
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const res = await fetch(`${BACKEND}/v1/agents/${id}`, {
    method: 'DELETE',
    headers: await authHeader(),
  });
  if (res.status === 204) return new NextResponse(null, { status: 204 });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
