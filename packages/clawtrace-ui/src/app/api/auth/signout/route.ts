import { NextResponse } from 'next/server';
import { authCookieOptions, COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';

/**
 * GET /api/auth/signout — redirect-based sign-out.
 * Clears all auth cookies and redirects to /login.
 * Using GET+redirect instead of POST+fetch ensures cookies are applied
 * before the browser loads the login page.
 */
export async function GET() {
  const store = await cookies();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const loginUrl = siteUrl ? `${siteUrl}/login` : '/login';

  const response = NextResponse.redirect(loginUrl, { status: 302 });

  // Clear auth cookie
  const opts = authCookieOptions();
  response.cookies.set(COOKIE_NAME, '', { ...opts, maxAge: 0 });

  // Revoke GitHub OAuth token if stored
  const ghToken = store.get('github_access_token')?.value;
  if (ghToken) {
    try {
      const clientId = process.env.GITHUB_CLIENT_ID ?? '';
      const clientSecret = process.env.GITHUB_CLIENT_SECRET ?? '';
      if (clientId && clientSecret) {
        await fetch(`https://api.github.com/applications/${clientId}/token`, {
          method: 'DELETE',
          headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: ghToken }),
        });
      }
    } catch { /* best effort */ }
    response.cookies.set('github_access_token', '', { ...opts, maxAge: 0 });
  }

  return response;
}

// Keep POST for backward compatibility
export async function POST() {
  return GET();
}
