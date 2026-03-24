'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import idcLogo from '../../../../idc.png';
import nvidiaLogo from '../../../../nvidia.png';
import yCombinatorLogo from '../../../../ycombinator.png';
import styles from './LandingPage.module.css';

type WaitlistState = 'idle' | 'loading' | 'success' | 'error';

const BACKERS = [
  { name: 'Y Combinator', logo: yCombinatorLogo },
  { name: 'NVIDIA Inception', logo: nvidiaLogo },
  { name: 'IDC Innovation', logo: idcLogo },
];

const IMPROVEMENT_BLOCKS = [
  {
    step: '01',
    title: 'Better',
    lead: 'Less babysitting, fewer repeated mistakes.',
    body: 'Trace unstable agent behavior, surface the likely root cause, and get actions to improve.',
  },
  {
    step: '02',
    title: 'Cheaper',
    lead: 'Know exactly why cost spiked this week.',
    body: 'See spend by agent run and step so you can cut cost without guessing.',
  },
  {
    step: '03',
    title: 'Faster',
    lead: 'Get from "something is wrong" to "here is the fix" quickly.',
    body: 'Run one control loop that prioritizes the next action and cuts time lost in manual debugging.',
  },
];

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=2200&q=80';

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
      <header className={styles.header}>
        <a href="/" className={styles.brand}>
          ClawTrace
        </a>

        <nav className={styles.nav}>
          <a href="#improvement" className={styles.navLink}>
            Product
          </a>
          <a href="#improvement" className={styles.navLink}>
            How It Works
          </a>
          <a href="#waitlist" className={styles.navLink}>
            Waitlist
          </a>
        </nav>
      </header>

      <section className={styles.hero} id="hero">
        <h1 className={styles.headline}>
          Make your OpenClaw agents <span>better, cheaper, and faster.</span>
        </h1>

        <p className={styles.subhead}>See what failed, where spend leaked, and how to improve.</p>

        <a className={styles.primaryButton} href="#waitlist">
          Join Waitlist
        </a>

        <div className={styles.heroFrame}>
          <Image
            src={HERO_IMAGE_URL}
            alt="ClawTrace agent run control room visual"
            width={2200}
            height={1400}
            priority
            sizes="(max-width: 980px) 100vw, 1120px"
            className={styles.heroImage}
          />

          <div className={styles.heroStats}>
            <article className={styles.statCard}>
              <p className={styles.statLabel}>Quality</p>
              <p className={styles.statValue}>Better run outcomes</p>
            </article>
            <article className={styles.statCard}>
              <p className={styles.statLabel}>Cost</p>
              <p className={styles.statValue}>Lower spend waste</p>
            </article>
            <article className={styles.statCard}>
              <p className={styles.statLabel}>Speed</p>
              <p className={styles.statValue}>Faster incident fixes</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.backers} aria-label="Backed by">
        <div className={styles.backersList}>
          {BACKERS.map((backer) => (
            <Image
              key={backer.name}
              src={backer.logo}
              alt={backer.name}
              width={backer.logo.width}
              height={backer.logo.height}
              className={styles.backerLogo}
              sizes="(max-width: 760px) 120px, 180px"
            />
          ))}
        </div>
      </section>

      <section className={styles.improvementSection} id="improvement">
        <p className={styles.sectionKicker}>How it works</p>
        <h2 className={styles.sectionTitle}>Three moves to improve your OpenClaw agent.</h2>

        <div className={styles.improvementGrid}>
          {IMPROVEMENT_BLOCKS.map((block) => (
            <article key={block.title} className={styles.improvementCard}>
              <p className={styles.step}>{block.step}</p>
              <h3 className={styles.cardTitle}>{block.title}</h3>
              <p className={styles.cardLead}>{block.lead}</p>
              <p className={styles.cardBody}>{block.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta} id="waitlist">
        <h2 className={styles.ctaTitle}>Join Waitlist</h2>
        <p className={styles.ctaSub}>Get early access updates and launch details.</p>

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
