import { NextResponse } from 'next/server';
import { authCookieOptions, COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
  const store = await cookies();
  const response = NextResponse.json({ ok: true });

  // Clear the auth cookie using exact same options as login
  const opts = authCookieOptions();
  response.cookies.set(COOKIE_NAME, '', { ...opts, maxAge: 0 });

  // Also clear the GitHub OAuth token cookie if it exists
  const ghToken = store.get('github_access_token')?.value;
  if (ghToken) {
    // Revoke the GitHub OAuth token so next login shows consent/account chooser
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
