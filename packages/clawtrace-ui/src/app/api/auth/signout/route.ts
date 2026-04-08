import { NextResponse } from 'next/server';
import { authCookieOptions, COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const loginUrl = siteUrl ? `${siteUrl}/login` : '/login';
  const response = NextResponse.redirect(loginUrl, { status: 302 });
  const opts = authCookieOptions();
  response.cookies.set(COOKIE_NAME, '', { ...opts, maxAge: 0 });
  response.cookies.set('github_access_token', '', { ...opts, maxAge: 0 });
  return response;
}

export async function POST() {
  return GET();
}
