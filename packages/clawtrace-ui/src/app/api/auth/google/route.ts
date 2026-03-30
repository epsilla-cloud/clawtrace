import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const redirect = searchParams.get('redirect') ?? (process.env.NEXT_PUBLIC_SITE_URL ?? '/');
  const inviteCode = searchParams.get('invitecode') ?? '';

  const state = Buffer.from(JSON.stringify({ redirect, inviteCode })).toString('base64');

  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
  if (!callbackUrl) {
    return NextResponse.json({ error: 'GOOGLE_CALLBACK_URL is not configured' }, { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    state,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
