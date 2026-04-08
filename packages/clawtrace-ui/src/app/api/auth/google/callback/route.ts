import { NextRequest, NextResponse } from 'next/server';
import {
  upsertUser,
  signToken,
  authCookieOptions,
  COOKIE_NAME,
  parseRedirectFromState,
  parseInviteCodeFromState,
} from '@/lib/auth';
import { awardSignupBonus, applyReferral } from '@/lib/referral';
import { grantInitialCredits } from '@/lib/billing';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '/';

  const errorUrl = (msg: string) =>
    `${siteUrl}/login?error=${encodeURIComponent(msg)}`;

  if (!code) {
    return NextResponse.redirect(errorUrl('no_code'));
  }

  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
  if (!callbackUrl) {
    return NextResponse.redirect(errorUrl('config_error'));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      console.error('Google token exchange failed', tokenRes.status, await tokenRes.text());
      return NextResponse.redirect(errorUrl('token_exchange_failed'));
    }

    const { access_token } = (await tokenRes.json()) as { access_token: string };

    // Fetch user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!userRes.ok) {
      return NextResponse.redirect(errorUrl('userinfo_failed'));
    }

    const googleUser = (await userRes.json()) as {
      sub: string;
      name: string;
      picture: string;
      email: string;
    };

    const { user, isNew } = await upsertUser('google', googleUser.sub, {
      name: googleUser.name,
      avatar: googleUser.picture,
      email: googleUser.email,
    });

    if (user.banned) {
      return NextResponse.redirect(errorUrl('account_banned'));
    }

    if (isNew) {
      try { await awardSignupBonus(user.id); } catch (e) { console.error('awardSignupBonus error:', e); }
      try { await grantInitialCredits(user.id); } catch (e) { console.error('grantInitialCredits error:', e); }
      const inviteCode = parseInviteCodeFromState(state);
      if (inviteCode) {
        try { await applyReferral(user.id, inviteCode); } catch (e) { console.error('applyReferral error:', e); }
      }
    }

    const token = signToken({
      provider: 'google',
      id: googleUser.sub,
      dbId: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email ?? undefined,
      cardVerified: user.card_verified,
    });

    const redirectTo = parseRedirectFromState(state);
    const response = NextResponse.redirect(redirectTo);
    response.cookies.set(COOKIE_NAME, token, authCookieOptions());
    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(errorUrl('server_error'));
  }
}
