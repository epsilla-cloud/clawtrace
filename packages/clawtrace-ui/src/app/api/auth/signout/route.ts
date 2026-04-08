import { NextResponse } from 'next/server';

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const hostname = siteUrl ? new URL(siteUrl).hostname : '';
  const parts = hostname.split('.');
  const rootDomain = parts.length >= 2 ? `.${parts.slice(-2).join('.')}` : undefined;

  const response = NextResponse.json({ ok: true });

  // Clear auth cookie with every possible domain variant to ensure deletion
  const cookieBase = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  // With root domain (.clawtrace.ai)
  if (rootDomain) {
    response.cookies.set('auth_token', '', { ...cookieBase, domain: rootDomain });
  }
  // With exact hostname (clawtrace.ai or www.clawtrace.ai)
  if (hostname) {
    response.cookies.set('auth_token', '', { ...cookieBase, domain: hostname });
  }
  // Without domain (browser default)
  response.cookies.set('auth_token', '', cookieBase);

  return response;
}
