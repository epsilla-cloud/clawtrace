'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { UserButton } from '@/components/auth/user-button';
import idcLogo from '../../../../idc.png';
import logoImage from '../../../../logo.png';
import nvidiaLogo from '../../../../nvidia.png';
import yCombinatorLogo from '../../../../ycombinator.png';
import styles from './LandingPage.module.css';

/* ── Static data ───────────────────────────────────────────────────────── */
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
    lead: 'Know exactly why cost spiked.',
    body: 'See spend by agent run and step so you can cut cost without guessing.',
  },
  {
    step: '03',
    title: 'Faster',
    lead: 'Stop agents from looping back and forth, and get to the right fix faster.',
    body: 'Use cheaper models when possible and script repeatable steps so runs stay stable.',
  },
];

const PREVIEW_SLIDES = [
  { key: 'dashboard', src: '/docs/images/2.1-see-all-trajectories-of-an-agent.png', alt: 'Trajectory dashboard with metrics and trends' },
  { key: 'tracing-path', src: '/docs/images/2.2.1-see-detail-trajectory---tracing-view.png', alt: 'Execution path tracing view' },
  { key: 'tracing-graph', src: '/docs/images/2.2.1-see-detail-trajectory---graph-view.png', alt: 'Actor graph tracing view' },
  { key: 'tracing-timeline', src: '/docs/images/2.2.3-see-detail-trajectory---timeline-view.png', alt: 'Step timeline tracing view' },
];

const TRACY_QUESTIONS = [
  'Why did this run fail?',
  'Where is the bottleneck?',
  'How can I reduce costs?',
];

const TRACY_FEATURES = [
  {
    icon: '/landing-icons/context.svg',
    title: 'Understands your context',
    desc: 'Tracy adapts to the page you are on and focuses on the agent or trajectory you are looking at.',
  },
  {
    icon: '/landing-icons/realtime.svg',
    title: 'Always up to date',
    desc: 'Every answer comes from live data. No stale dashboards, no waiting for reports to refresh.',
  },
  {
    icon: '/landing-icons/drilldown.svg',
    title: 'Follow up naturally',
    desc: 'Ask a question, then dig deeper. Tracy remembers the conversation and builds on previous answers.',
  },
];

const FEATURES = [
  {
    title: 'Execution Path',
    desc: 'See every LLM call, tool use, and sub-agent delegation in an interactive trace tree with full payloads.',
    src: '/docs/images/2.2.1-see-detail-trajectory---tracing-view.png',
    alt: 'Execution path view',
  },
  {
    title: 'Call Graph',
    desc: 'Visualize how agents, tools, and models relate to each other across the entire trajectory.',
    src: '/docs/images/2.2.1-see-detail-trajectory---graph-view.png',
    alt: 'Call graph view',
  },
  {
    title: 'Timeline',
    desc: 'Spot bottlenecks and parallelism at a glance with a Gantt chart of every step in the run.',
    src: '/docs/images/2.2.3-see-detail-trajectory---timeline-view.png',
    alt: 'Timeline view',
  },
  {
    title: 'Trajectory Dashboard',
    desc: 'All trajectories at a glance with metrics, daily trends, token usage, and run level drilldown.',
    src: '/docs/images/2.1-see-all-trajectories-of-an-agent.png',
    alt: 'Trajectory dashboard for an OpenClaw agent',
  },
];

const STEPS = [
  {
    num: '1',
    title: 'Connect',
    desc: 'Install the ClawTrace plugin on your OpenClaw agent and authenticate with your observe key.',
    icon: '/landing-icons/connect.svg',
  },
  {
    num: '2',
    title: 'Observe',
    desc: 'Every trajectory streams to ClawTrace automatically. See traces, spans, tokens, and costs in real time.',
    icon: '/landing-icons/observe.svg',
  },
  {
    num: '3',
    title: 'Improve',
    desc: 'Ask Tracy to analyze your runs, find what costs too much, and recommend specific improvements.',
    icon: '/landing-icons/improve.svg',
  },
];

const ROADMAP = [
  {
    title: 'Rubric-Based Evaluation',
    desc: 'Define quality rubrics, auto-score agent trajectories, and catch regressions before deployment.',
  },
  {
    title: 'A/B Testing',
    desc: 'Run agent variants side by side, compare cost, quality, and speed, then promote winners with confidence.',
  },
  {
    title: 'Version Control',
    desc: 'Track agent config changes over time, roll back to known good versions, and audit who changed what.',
  },
  {
    title: 'Self-Evolving Agents',
    desc: 'Agents that learn from their own trajectory data to continuously improve reliability, reduce costs, and adapt to new patterns.',
  },
];

/* ── Scroll reveal hook ────────────────────────────────────────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles.visible);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ── Component ─────────────────────────────────────────────────────────── */
export function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/epsilla-cloud/clawtrace')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.stargazers_count != null) setStars(d.stargazers_count); })
      .catch(() => {});
  }, []);
  const tracyRef = useScrollReveal();
  const featuresRef = useScrollReveal();
  const stepsRef = useScrollReveal();
  const roadmapRef = useScrollReveal();
  const billingRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  useEffect(() => {
    if (PREVIEW_SLIDES.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setActiveSlide((c) => (c + 1) % PREVIEW_SLIDES.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className={styles.page}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <a href="/" className={styles.brand} aria-label="ClawTrace home">
          <Image
            src={logoImage} alt="ClawTrace"
            width={logoImage.width} height={logoImage.height}
            className={styles.brandImage} sizes="200px" priority
          />
        </a>
        <div className={styles.headerRight}>
          <nav className={styles.nav}>
            <a href="#features" className={styles.navLink}>Product</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="/docs" className={styles.navLink}>Documentation</a>
            <a href="https://github.com/epsilla-cloud/clawtrace" target="_blank" rel="noopener" className={styles.githubBadge} aria-label="Star on GitHub">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span>{stars !== null ? stars.toLocaleString() : 'Star'}</span>
            </a>
          </nav>
          <UserButton />
        </div>
        <button type="button" className={styles.hamburger} onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu">
          <svg viewBox="0 0 20 14" width="20" height="14" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round">
            {menuOpen
              ? <><line x1="2" y1="2" x2="18" y2="12" /><line x1="2" y1="12" x2="18" y2="2" /></>
              : <><line x1="2" y1="2" x2="18" y2="2" /><line x1="2" y1="7" x2="18" y2="7" /><line x1="2" y1="12" x2="18" y2="12" /></>
            }
          </svg>
        </button>
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#features" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Product</a>
            <a href="#how-it-works" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="/docs" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Documentation</a>
            <div className={styles.mobileDivider} />
            <UserButton />
          </div>
        )}
      </header>

      {/* ── S1: Hero ───────────────────────────────────────────────── */}
      <section className={styles.hero} id="hero">
        <h1 className={styles.headline}>
          Make your OpenClaw agents <span>better, cheaper, and faster.</span>
        </h1>
        <p className={styles.subhead}>See what failed, where spend leaked, and how to improve.</p>
        <a className={styles.primaryButton} href="/login">Get Started Free</a>

        <div className={styles.heroFrame} aria-label="Product preview carousel">
          <div
            className={styles.heroTrack}
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {PREVIEW_SLIDES.map((slide, i) => (
              <div key={slide.key} className={styles.heroSlide} aria-hidden={i !== activeSlide}>
                <img
                  src={slide.src} alt={slide.alt}
                  className={styles.heroImage}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
          <button type="button" className={`${styles.heroControl} ${styles.heroControlPrev}`}
            aria-label="Previous preview"
            onClick={() => setActiveSlide((c) => (c - 1 + PREVIEW_SLIDES.length) % PREVIEW_SLIDES.length)}>
            &#8249;
          </button>
          <button type="button" className={`${styles.heroControl} ${styles.heroControlNext}`}
            aria-label="Next preview"
            onClick={() => setActiveSlide((c) => (c + 1) % PREVIEW_SLIDES.length)}>
            &#8250;
          </button>
          <div className={styles.heroDots} role="tablist" aria-label="Preview slides">
            {PREVIEW_SLIDES.map((slide, i) => (
              <button key={`${slide.key}-dot`} type="button" role="tab"
                aria-selected={i === activeSlide}
                aria-label={`Show slide ${i + 1}`}
                className={`${styles.heroDot} ${i === activeSlide ? styles.heroDotActive : ''}`}
                onClick={() => setActiveSlide(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── S2: Backers ────────────────────────────────────────────── */}
      <section className={styles.backers} aria-label="Backed by">
        <div className={styles.backersList}>
          {BACKERS.map((b) => (
            <Image key={b.name} src={b.logo} alt={b.name}
              width={b.logo.width} height={b.logo.height}
              className={styles.backerLogo} sizes="(max-width: 760px) 120px, 180px" />
          ))}
        </div>
      </section>

      {/* ── S3: Better / Cheaper / Faster ──────────────────────────── */}
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

      {/* ── S4: Tracy Showcase ─────────────────────────────────────── */}
      <section className={`${styles.tracySection} ${styles.reveal}`} id="tracy" ref={tracyRef}>
        <div className={styles.tracyHeader}>
          <img src="/tracy.png" alt="Tracy" className={styles.tracyAvatar} />
          <p className={styles.sectionKicker}>Meet Tracy</p>
        </div>
        <h2 className={styles.sectionTitle}>Your OpenClaw Doctor Agent</h2>
        <p className={styles.sectionSub}>
          Don't just see what happened. Ask why, and get tailored recommendations.
        </p>

        <div className={styles.tracyShowcase}>
          <div className={styles.tracyLeft}>
            <p className={styles.tracyDesc}>
              Tracy is your OpenClaw's doctor. She watches every run, spots the problems
              you would miss, and tells you exactly what to fix and why.
            </p>
            <div className={styles.tracyQuestions}>
              {TRACY_QUESTIONS.map((q) => (
                <span key={q} className={styles.tracyPill}>{q}</span>
              ))}
            </div>
          </div>
          <div className={styles.tracyRight}>
            <div className={styles.tracyScreenshots}>
              <img
                src="/docs/images/ask_tracy_4_result.png" alt="Tracy analyzing trajectory costs with chart"
                className={styles.tracyScreenshot}
                loading="lazy"
              />
              <img
                src="/docs/images/ask_tracy_5_drilldown_1.png" alt="Tracy providing detailed cost analysis and recommendations"
                className={styles.tracyScreenshot}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className={styles.tracyFeatures}>
          {TRACY_FEATURES.map((f) => (
            <div key={f.title} className={styles.tracyFeatureCard}>
              <img src={f.icon} alt="" className={styles.tracyFeatureIcon} />
              <h4 className={styles.tracyFeatureTitle}>{f.title}</h4>
              <p className={styles.tracyFeatureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── S5: Product Features Grid ──────────────────────────────── */}
      <section className={`${styles.featuresSection} ${styles.reveal}`} id="features" ref={featuresRef}>
        <p className={styles.sectionKicker}>Full visibility</p>
        <h2 className={styles.sectionTitle}>Everything you need to understand your agents</h2>

        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <article key={f.title} className={styles.featureCard}>
              <div className={styles.featureImageWrap}>
                <img
                  src={f.src} alt={f.alt}
                  className={styles.featureImage}
                  loading="lazy"
                />
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── S6: How It Works ───────────────────────────────────────── */}
      <section className={`${styles.stepsSection} ${styles.reveal}`} id="how-it-works" ref={stepsRef}>
        <p className={styles.sectionKicker}>Get started in minutes</p>
        <h2 className={styles.sectionTitle}>Three steps to reliable agents</h2>

        <div className={styles.stepsGrid}>
          {STEPS.map((s) => (
            <article key={s.num} className={styles.stepCard}>
              <img src={s.icon} alt="" className={styles.stepNum} />
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </article>
          ))}
        </div>

        <div className={styles.codeSnippet}>
          <p className={styles.codeLabel}>Quick setup</p>
          <div className={styles.codeSteps}>
            <code className={styles.codeBlock}><span className={styles.codeComment}># Step 1: Install the plugin</span>{'\n'}openclaw plugins install @epsilla/clawtrace</code>
            <code className={styles.codeBlock}><span className={styles.codeComment}># Step 2: Authenticate with your observe key</span>{'\n'}openclaw clawtrace setup</code>
            <code className={styles.codeBlock}><span className={styles.codeComment}># Step 3: Restart the gateway</span>{'\n'}openclaw gateway restart</code>
          </div>
        </div>
      </section>

      {/* ── S7: Coming Soon ────────────────────────────────────────── */}
      <section className={`${styles.roadmapSection} ${styles.reveal}`} id="roadmap" ref={roadmapRef}>
        <p className={styles.sectionKicker}>On the horizon</p>
        <h2 className={styles.sectionTitle}>Building the foundation for self-evolving agents</h2>

        <div className={styles.roadmapGrid}>
          {ROADMAP.map((item) => (
            <article key={item.title} className={styles.roadmapCard}>
              <h3 className={styles.roadmapTitle}>{item.title}</h3>
              <p className={styles.roadmapDesc}>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── S8: Billing ────────────────────────────────────────────── */}
      <section className={`${styles.billingSection} ${styles.reveal}`} id="billing" ref={billingRef}>
        <p className={styles.sectionKicker}>Simple pricing</p>
        <h2 className={styles.sectionTitle}>Pay for what you use</h2>
        <p className={styles.sectionSub}>
          Buy credits instead of monthly subscriptions based on seat count.
          No minimum commitment, no surprise invoices.{' '}
          <Link href="/docs/billing/credits" className={styles.billingLink}>Learn more</Link>
        </p>
      </section>

      {/* ── S9: CTA ────────────────────────────────────────────────── */}
      <section className={`${styles.cta} ${styles.reveal}`} id="get-started" ref={ctaRef}>
        <h2 className={styles.ctaTitle}>Start improving your agents today</h2>
        <p className={styles.ctaSub}>100 free credits. No credit card required.</p>
        <a className={styles.ctaButton} href="/login">Get Started Free</a>
        <p className={styles.ctaSignin}>
          Already have an account? <Link href="/login" className={styles.ctaLink}>Sign in</Link>
        </p>
      </section>

      {/* ── S10: Footer ────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image src={logoImage} alt="ClawTrace" width={120} height={30}
              className={styles.footerLogo} sizes="120px" />
            <p className={styles.footerTagline}>Make your OpenClaw agents better, cheaper, and faster.</p>
          </div>
          <nav className={styles.footerLinks}>
            <a href="#features" className={styles.footerLink}>Product</a>
            <a href="/docs" className={styles.footerLink}>Documentation</a>
            <a href="#billing" className={styles.footerLink}>Billing</a>
            <a href="/docs/ask-tracy" className={styles.footerLink}>Ask Tracy</a>
          </nav>
          <div className={styles.footerSocials}>
            <a href="https://x.com/epsilla_inc" target="_blank" rel="noopener" className={styles.socialIcon} aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/epsilla" target="_blank" rel="noopener" className={styles.socialIcon} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="https://github.com/epsilla-cloud" target="_blank" rel="noopener" className={styles.socialIcon} aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a href="https://www.youtube.com/@Epsilla-kp5cx" target="_blank" rel="noopener" className={styles.socialIcon} aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
            <a href="https://discord.com/invite/cDaY2CxZc5" target="_blank" rel="noopener" className={styles.socialIcon} aria-label="Discord">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
          </div>
          <p className={styles.footerCopy}>
            Built with{' '}
            <svg className={styles.heart} viewBox="0 0 16 16" aria-label="love">
              <path d="M8 14s-5.5-3.5-5.5-7A3.5 3.5 0 018 4a3.5 3.5 0 015.5 3c0 3.5-5.5 7-5.5 7z" fill="#c0392b" />
            </svg>
            {' '}by{' '}
            <a href="https://epsilla.com?utm_source=clawtrace&utm_medium=landing&utm_campaign=footer"
              target="_blank" rel="noopener" className={styles.epsillaLink}>
              <img src="/epsilla-logo.png" alt="Epsilla" className={styles.epsillaLogo} />
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
