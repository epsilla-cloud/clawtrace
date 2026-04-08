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

  const callbackUrl = process.env.GITHUB_CALLBACK_URL;
  if (!callbackUrl) {
    return NextResponse.redirect(errorUrl('config_error'));
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
        redirect_uri: callbackUrl,
      }),
    });

    if (!tokenRes.ok) {
      console.error('GitHub token exchange failed', tokenRes.status);
      return NextResponse.redirect(errorUrl('token_exchange_failed'));
    }

    const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string };
    if (!tokenData.access_token) {
      console.error('GitHub token missing:', tokenData);
      return NextResponse.redirect(errorUrl('token_missing'));
    }

    const { access_token } = tokenData;

    // Fetch user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'User-Agent': 'clawtrace',
        Accept: 'application/vnd.github+json',
      },
    });
    if (!userRes.ok) {
      return NextResponse.redirect(errorUrl('userinfo_failed'));
    }

    const githubUser = (await userRes.json()) as {
      id: number;
      login: string;
      name: string | null;
      avatar_url: string;
      email: string | null;
    };

    // Fetch primary verified email if profile email is null
    let email = githubUser.email;
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'User-Agent': 'clawtrace',
          Accept: 'application/vnd.github+json',
        },
      });
      if (emailsRes.ok) {
        const emails = (await emailsRes.json()) as Array<{
          email: string;
          primary: boolean;
          verified: boolean;
        }>;
        email =
          emails.find((e) => e.primary && e.verified)?.email ??
          emails[0]?.email ??
          null;
      }
    }

    const { user, isNew } = await upsertUser('github', String(githubUser.id), {
      name: githubUser.name ?? githubUser.login,
      avatar: githubUser.avatar_url,
      email: email ?? undefined,
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
      provider: 'github',
      id: String(githubUser.id),
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
    console.error('GitHub OAuth callback error:', err);
    return NextResponse.redirect(errorUrl('server_error'));
  }
}
