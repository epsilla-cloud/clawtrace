'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import styles from './LandingPage.module.css';

type WaitlistState = 'idle' | 'loading' | 'success' | 'error';

const BACKERS = ['YC', 'NVIDIA Inception', 'IDC Innovation'];

const VALUE_SECTIONS = [
  {
    title: 'Better',
    label: 'Quality',
    bullets: [
      'Less babysitting, fewer repeated mistakes.',
      'More reliable output from the workflows you already run daily.',
    ],
    highlight: 'Find unstable steps before they repeat.',
  },
  {
    title: 'Cheaper',
    label: 'Cost',
    bullets: [
      'Know exactly why cost spiked this week.',
      'Fix the biggest leak first instead of guessing.',
    ],
    highlight: 'See where spend goes by workflow and run.',
  },
  {
    title: 'Faster',
    label: 'Speed',
    bullets: [
      'Get from "something is wrong" to "here is the fix" quickly.',
      'Spend less time debugging and more time shipping.',
    ],
    highlight: 'Move from incident to action in one control room.',
  },
];

const HERO_SIGNALS = [
  { label: 'Quality signal', value: 'Trace-backed root cause' },
  { label: 'Cost signal', value: 'Leak attribution by workflow' },
  { label: 'Speed signal', value: 'Priority-ranked next fix' },
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LandingPage() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<WaitlistState>('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setState('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setState('loading');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          source: 'landing_page',
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Waitlist signup failed.');
      }

      setState('success');
      setMessage('You are on the waitlist. We will reach out soon.');
      setEmail('');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Could not submit email right now.');
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.glowA} aria-hidden="true" />
      <div className={styles.glowB} aria-hidden="true" />

      <header className={styles.header}>
        <p className={styles.brand}>ClawTrace</p>
        <nav className={styles.nav}>
          <Link href="/onboarding/connect" className={styles.navLink}>
            Product Tour
          </Link>
          <Link href="/control-room" className={styles.navLink}>
            Demo App
          </Link>
        </nav>
      </header>

      <section className={styles.backerStrip} aria-label="Backed by">
        <p className={styles.backerLabel}>Backed by</p>
        <div className={styles.backerBadges}>
          {BACKERS.map((backer) => (
            <span key={backer} className={styles.backerBadge}>
              {backer}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.hero}>
        <article className={styles.heroMain}>
          <p className={styles.kicker}>Built for OpenClaw operators</p>
          <h1 className={styles.headline}>Make your OpenClaw agents better, cheaper, and faster.</h1>
          <p className={styles.subhead}>See what failed, where spend leaked, and what to fix first.</p>
          <a href="#waitlist" className={styles.heroButton}>
            Join Waitlist
          </a>
        </article>

        <aside className={styles.heroPanel}>
          <p className={styles.panelKicker}>Live performance control loop</p>
          <h2 className={styles.panelTitle}>One surface for quality, cost, and speed.</h2>
          <div className={styles.signalGrid}>
            {HERO_SIGNALS.map((signal) => (
              <article key={signal.label} className={styles.signalCard}>
                <p className={styles.signalLabel}>{signal.label}</p>
                <p className={styles.signalValue}>{signal.value}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className={styles.valueGrid} aria-label="Core value sections">
        {VALUE_SECTIONS.map((section) => (
          <article key={section.title} className={styles.valueCard}>
            <p className={styles.valueLabel}>{section.label}</p>
            <h2 className={styles.cardTitle}>{section.title}</h2>
            <p className={styles.valueHighlight}>{section.highlight}</p>
            <ul className={styles.cardList}>
              {section.bullets.map((bullet) => (
                <li key={bullet} className={styles.cardListItem}>
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className={styles.cta} id="waitlist">
        <div>
          <h2 className={styles.ctaTitle}>Join Waitlist</h2>
          <p className={styles.ctaSub}>Get early access updates and launch details.</p>
        </div>
        <form className={styles.form} onSubmit={onSubmit}>
          <label htmlFor="waitlist-email" className={styles.srOnly}>
            Email address
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={styles.input}
            value={email}
            onChange={(event) => {
              setEmail(event.currentTarget.value);
              if (state !== 'idle') {
                setState('idle');
                setMessage('');
              }
            }}
          />
          <button type="submit" className={styles.button} disabled={state === 'loading'}>
            {state === 'loading' ? 'Joining...' : 'Join Waitlist'}
          </button>
        </form>
        {message ? <p className={`${styles.feedback} ${state === 'success' ? styles.success : styles.error}`}>{message}</p> : null}
      </section>
    </main>
  );
}
