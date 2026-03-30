import { authCookieOptions, COOKIE_NAME } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, '', { ...authCookieOptions(), maxAge: 0 });
  return response;
}
