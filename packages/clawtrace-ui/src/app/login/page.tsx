import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginButtons } from '@/components/auth/login-buttons';
import styles from './login.module.css';

export const metadata: Metadata = {
  title: 'Sign in',
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
  { text: 'See every agent run, tool call, and LLM cost in real time' },
  { text: 'Ask Tracy why something failed and get tailored recommendations' },
  { text: 'Cut wasted tokens with per-span cost breakdowns across 80+ models' },
  { text: 'Understand agent behavior with execution path, call graph, and timeline views' },
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
          <a href="/" className={styles.brand}>
            <Image src="/clawtrace-logo.png" alt="ClawTrace" width={140} height={32} className={styles.brandLogo} />
          </a>

          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>
              Make your OpenClaw agents better, cheaper, and faster.
            </h1>
            <p className={styles.heroSub}>
              See what failed, where spend leaked, and how to improve.
              Ask Tracy for tailored recommendations.
            </p>
          </div>

          <ul className={styles.features}>
            {FEATURES.map((f) => (
              <li key={f.text} className={styles.featureItem}>
                <span className={styles.featureDot} />
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <p className={styles.leftFooter}>100 free credits on signup. No credit card required.</p>
        </div>
      </div>

      {/* Right — login panel */}
      <div className={styles.right}>
        <div className={styles.card}>
          <a href="/" className={styles.mobileBrand}>
            <Image src="/clawtrace-logo.png" alt="ClawTrace" width={120} height={28} className={styles.brandLogo} />
          </a>
          <h2 className={styles.cardTitle}>Sign in</h2>
          <p className={styles.cardSub}>Start analyzing your OpenClaw agent trajectories.</p>

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
            <a href="https://www.epsilla.com/privacy" target="_blank" rel="noopener" className={styles.link}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
