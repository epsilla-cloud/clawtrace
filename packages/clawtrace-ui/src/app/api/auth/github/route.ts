import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const redirect = searchParams.get('redirect') ?? (process.env.NEXT_PUBLIC_SITE_URL ?? '/');
  const inviteCode = searchParams.get('invitecode') ?? '';

  const state = Buffer.from(JSON.stringify({ redirect, inviteCode })).toString('base64');

  const callbackUrl = process.env.GITHUB_CALLBACK_URL;
  if (!callbackUrl) {
    return NextResponse.json({ error: 'GITHUB_CALLBACK_URL is not configured' }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: callbackUrl,
    scope: 'read:user user:email',
    state,
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
}
