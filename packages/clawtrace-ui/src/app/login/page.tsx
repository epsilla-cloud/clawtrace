import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginButtons } from '@/components/auth/login-buttons';
import styles from './login.module.css';

export const metadata: Metadata = {
  title: 'Sign in — ClawTrace',
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  no_code: 'Authorization was cancelled. Please try again.',
  token_exchange_failed: 'Authentication failed. Please try again.',
  token_missing: 'Authentication failed. Please try again.',
  userinfo_failed: 'Could not retrieve your profile. Please try again.',
  account_banned: 'This account has been suspended.',
  config_error: 'Service configuration error. Please contact support.',
  server_error: 'An unexpected error occurred. Please try again.',
};

const FEATURES = [
  { icon: '⚡', text: 'See every agent run, tool call, and LLM cost in real time' },
  { icon: '🔍', text: 'Diagnose failures with full trace context — no guessing' },
  { icon: '💰', text: 'Track spend leaks and cut wasted LLM tokens automatically' },
  { icon: '🛡️', text: 'Graph-native analytics across your entire agent fleet' },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string; invitecode?: string }>;
}) {
  const { redirect, error, invitecode } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? 'Sign in failed. Please try again.') : null;

  return (
    <div className={styles.page}>
      {/* Left — introduction */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.brand}>
            <Image src="/favicon.png" alt="ClawTrace" width={36} height={36} className={styles.brandIcon} />
            <span className={styles.brandName}>ClawTrace</span>
          </div>

          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>
              Make your OpenClaw agents better, cheaper, and faster.
            </h1>
            <p className={styles.heroSub}>
              The workflow reliability control room for OpenClaw — built so you
              can see what failed, where spend leaked, and what to fix first.
            </p>
          </div>

          <ul className={styles.features}>
            {FEATURES.map((f) => (
              <li key={f.text} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <p className={styles.leftFooter}>Trusted by teams running OpenClaw in production.</p>
        </div>
      </div>

      {/* Right — login panel */}
      <div className={styles.right}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Sign in</h2>
          <p className={styles.cardSub}>Connect your OpenClaw workspace to ClawTrace.</p>

          {errorMessage && (
            <div className={styles.errorBanner} role="alert">
              {errorMessage}
            </div>
          )}

          <div className={styles.buttons}>
            <LoginButtons redirect={redirect ?? '/trace'} inviteCode={invitecode} />
          </div>

          <p className={styles.terms}>
            By signing in you agree to our{' '}
            <a href="/privacy" className={styles.link}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
