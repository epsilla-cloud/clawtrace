import { NextResponse } from 'next/server';
import { authCookieOptions, COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const loginUrl = siteUrl ? `${siteUrl}/login` : '/login';

  const response = NextResponse.redirect(loginUrl, { status: 302 });

  const opts = authCookieOptions();

  // Clear with domain (how it was set)
  response.cookies.set(COOKIE_NAME, '', { ...opts, maxAge: 0 });
  response.cookies.set('github_access_token', '', { ...opts, maxAge: 0 });

  // Debug: log what options we're using
  response.headers.set('x-signout-domain', opts.domain ?? 'undefined');
  response.headers.set('x-signout-secure', String(opts.secure));

  return response;
}

export async function POST() {
  return GET();
}
