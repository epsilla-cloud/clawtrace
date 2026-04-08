import { createHmac } from 'crypto';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { generateInviteCode } from '@/lib/referral';

export interface UserSession {
  provider: 'google' | 'github';
  id: string; // provider_id
  dbId: string; // users.id (UUID)
  name: string;
  avatar: string;
  email?: string;
  cardVerified: boolean;
}

export async function upsertUser(
  provider: 'google' | 'github',
  providerId: string,
  data: { name: string; avatar: string; email?: string }
): Promise<{ user: typeof users.$inferSelect; isNew: boolean }> {
  const existing = await db
    .select()
    .from(users)
    .where(and(eq(users.provider, provider), eq(users.provider_id, providerId)));

  if (existing.length > 0) {
    const [updated] = await db
      .update(users)
      .set({ name: data.name, avatar: data.avatar, email: data.email, updated_at: new Date() })
      .where(and(eq(users.provider, provider), eq(users.provider_id, providerId)))
      .returning();
    return { user: updated, isNew: false };
  }

  // Insert first (no invite_code yet), then assign a unique code via retry loop.
  // The DB unique constraint is the true uniqueness guarantee; retry handles the
  // astronomically rare collision (62^8 ≈ 218 trillion possible codes).
  const [inserted] = await db
    .insert(users)
    .values({ provider, provider_id: providerId, ...data })
    .returning();

  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const [withCode] = await db
        .update(users)
        .set({ invite_code: generateInviteCode() })
        .where(eq(users.id, inserted.id))
        .returning();
      return { user: withCode, isNew: true };
    } catch {
      if (attempt === 9) throw new Error('Failed to assign unique invite_code after 10 attempts');
    }
  }

  // Unreachable but satisfies TypeScript
  return { user: inserted, isNew: true };
}

const COOKIE_NAME = 'auth_token';
const TOKEN_TTL = 60 * 60 * 24; // 1 day in seconds

function getSecret(): string {
  const secret = process.env.CLAWTRACE_JWT_SECRET;
  if (!secret) throw new Error('CLAWTRACE_JWT_SECRET is not configured');
  return secret;
}

export function signToken(payload: UserSession): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + TOKEN_TTL,
    })
  ).toString('base64url');
  const sig = createHmac('sha256', getSecret()).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string): UserSession | null {
  try {
    const [header, body, sig] = token.split('.');
    const expected = createHmac('sha256', getSecret())
      .update(`${header}.${body}`)
      .digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    const { provider, id, dbId, name, avatar, email, cardVerified } = payload;
    return { provider, id, dbId: dbId ?? '', name, avatar, email, cardVerified: cardVerified ?? false };
  } catch {
    return null;
  }
}

export async function getUserSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Cookie domain: always use root domain with leading dot so all subdomains share the cookie */
function cookieDomain(): string | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return undefined;
  const { hostname } = new URL(siteUrl);
  const parts = hostname.split('.');
  // Extract root domain (last two segments) and add leading dot for cross-subdomain sharing
  // e.g. dev.clawtrace.ai → .clawtrace.ai
  const rootDomain = parts.slice(-2).join('.');
  return `.${rootDomain}`;
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: TOKEN_TTL,
    path: '/',
    domain: cookieDomain(),
  };
}

/** Parse the OAuth state param and return a safe redirect URL */
export function parseRedirectFromState(state: string | null): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const fallback = siteUrl ? `${siteUrl}/trace` : '/trace';
  if (!state) return fallback;
  try {
    const { redirect } = JSON.parse(Buffer.from(state, 'base64').toString()) as {
      redirect: string;
    };
    const url = new URL(redirect);
    const siteHostname = new URL(fallback).hostname;
    const rootDomain = siteHostname.split('.').slice(-2).join('.');
    if (!url.hostname.endsWith(rootDomain)) return fallback;
    return redirect;
  } catch {
    return fallback;
  }
}

export function parseInviteCodeFromState(state: string | null): string | null {
  if (!state) return null;
  try {
    const { inviteCode } = JSON.parse(Buffer.from(state, 'base64').toString()) as {
      inviteCode?: string;
    };
    return inviteCode && inviteCode.length > 0 ? inviteCode : null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
