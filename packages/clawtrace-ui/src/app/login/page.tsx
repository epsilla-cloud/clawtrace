import type { Metadata } from 'next';
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

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string; invitecode?: string }>;
}) {
  const { redirect, error, invitecode } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? 'Sign in failed. Please try again.') : null;

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoText}>ClawTrace</span>
        </div>

        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          Observability for your OpenClaw agents
        </p>

        {errorMessage && (
          <div className={styles.errorBanner} role="alert">
            {errorMessage}
          </div>
        )}

        <div className={styles.buttons}>
          <LoginButtons redirect={redirect} inviteCode={invitecode} />
        </div>

        <p className={styles.terms}>
          By signing in, you agree to our{' '}
          <a href="/privacy" className={styles.link}>Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}
