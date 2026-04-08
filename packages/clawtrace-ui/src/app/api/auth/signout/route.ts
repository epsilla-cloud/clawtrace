import { NextResponse } from 'next/server';

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const hostname = siteUrl ? new URL(siteUrl).hostname : '';
  const parts = hostname.split('.');
  const rootDomain = parts.length >= 2 ? `.${parts.slice(-2).join('.')}` : undefined;

  const response = NextResponse.json({ ok: true });

  // Clear the httpOnly auth cookie — must match the domain/path used when setting
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    domain: rootDomain,
    maxAge: 0,
  });

  return response;
}
