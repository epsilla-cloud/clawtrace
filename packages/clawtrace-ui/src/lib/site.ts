const DEFAULT_SITE_URL = 'https://clawtrace.vercel.app';

function normalizeSiteUrl(rawUrl?: string): string {
  const value = rawUrl?.trim();
  if (!value) {
    return DEFAULT_SITE_URL;
  }

  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const siteConfig = {
  name: 'ClawTrace',
  description:
    'ClawTrace is observability for OpenClaw agents. See failures, cost leaks, and the next fix to improve reliability.',
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: 'en_US',
  keywords: [
    'OpenClaw observability',
    'agent observability',
    'OpenClaw monitoring',
    'AI agent run reliability',
    'agent cost tracking',
    'agent debugging',
  ],
} as const;
