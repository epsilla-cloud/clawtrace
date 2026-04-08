import { NextResponse } from 'next/server';
import { authCookieOptions, COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ ok: true });

  // Use the EXACT same cookie options as login, but with maxAge=0 to delete
  const opts = authCookieOptions();
  response.cookies.set(COOKIE_NAME, '', {
    ...opts,
    maxAge: 0,
  });

  return response;
}
