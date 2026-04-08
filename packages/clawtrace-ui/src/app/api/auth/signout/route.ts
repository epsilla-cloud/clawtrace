import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const store = await cookies();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const loginUrl = siteUrl ? `${siteUrl}/login` : '/login';

  // Revoke GitHub OAuth grant so next login shows authorization prompt
  const ghToken = store.get('github_access_token')?.value;
  if (ghToken) {
    const clientId = process.env.GITHUB_CLIENT_ID ?? '';
    const clientSecret = process.env.GITHUB_CLIENT_SECRET ?? '';
    if (clientId && clientSecret) {
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      // 1. Revoke the access token
      try {
        await fetch(`https://api.github.com/applications/${clientId}/token`, {
          method: 'DELETE',
          headers: {
            Authorization: `Basic ${basicAuth}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: ghToken }),
        });
      } catch { /* best effort */ }
      // 2. Delete the app authorization (removes from user's authorized apps)
      try {
        await fetch(`https://api.github.com/applications/${clientId}/grant`, {
          method: 'DELETE',
          headers: {
            Authorization: `Basic ${basicAuth}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: ghToken }),
        });
      } catch { /* best effort */ }
    }
  }

  // Clear cookies with raw Set-Cookie headers
  const response = new NextResponse(null, {
    status: 302,
    headers: { Location: loginUrl },
  });
  const cookieParts = 'Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax';
  response.headers.append('Set-Cookie', `auth_token=; ${cookieParts}; Domain=.clawtrace.ai`);
  response.headers.append('Set-Cookie', `auth_token=; ${cookieParts}`);
  response.headers.append('Set-Cookie', `github_access_token=; ${cookieParts}; Domain=.clawtrace.ai`);
  response.headers.append('Set-Cookie', `github_access_token=; ${cookieParts}`);

  return response;
}

export async function POST() {
  return GET();
}
