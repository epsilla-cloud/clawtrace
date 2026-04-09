import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const loginUrl = 'https://www.clawtrace.ai/login';

  // Read github token from cookie header directly (no next/headers import)
  const cookieHeader = request.headers.get('cookie') ?? '';
  const ghMatch = cookieHeader.match(/github_access_token=([^;]+)/);
  const ghToken = ghMatch ? ghMatch[1] : null;

  // Revoke GitHub OAuth grant
  if (ghToken) {
    const clientId = process.env.GITHUB_CLIENT_ID ?? '';
    const clientSecret = process.env.GITHUB_CLIENT_SECRET ?? '';
    if (clientId && clientSecret) {
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
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

  // Clear cookies via raw Set-Cookie headers
  const response = new NextResponse(null, {
    status: 302,
    headers: { Location: loginUrl },
  });
  const clear = 'Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax';
  response.headers.append('Set-Cookie', `auth_token=; ${clear}; Domain=.clawtrace.ai`);
  response.headers.append('Set-Cookie', `auth_token=; ${clear}`);
  response.headers.append('Set-Cookie', `github_access_token=; ${clear}; Domain=.clawtrace.ai`);
  response.headers.append('Set-Cookie', `github_access_token=; ${clear}`);

  return response;
}

export async function POST(request: NextRequest) {
  return GET(request);
}
