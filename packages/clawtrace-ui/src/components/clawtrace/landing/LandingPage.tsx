'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { UserButton } from '@/components/auth/user-button';
import idcLogo from '../../../../idc.png';
import logoImage from '../../../../logo.png';
import nvidiaLogo from '../../../../nvidia.png';
import overviewImage from '../../../../overview.png';
import tracingGraphImage from '../../../../tracing_graph.png';
import tracingPathImage from '../../../../tracing_path.png';
import tracingTimelineImage from '../../../../tracing_timeline.png';
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
  { key: 'overview', image: overviewImage, alt: 'ClawTrace overview dashboard' },
  { key: 'tracing-path', image: tracingPathImage, alt: 'ClawTrace execution path tracing view' },
  { key: 'tracing-graph', image: tracingGraphImage, alt: 'ClawTrace actor graph tracing view' },
  { key: 'tracing-timeline', image: tracingTimelineImage, alt: 'ClawTrace step timeline tracing view' },
];

const TRACY_QUESTIONS = [
  'Which trace cost the most?',
  'Where is the bottleneck?',
  'How can I reduce costs?',
];

const TRACY_FEATURES = [
  {
    icon: '\u{1F3AF}',
    title: 'Context-aware',
    desc: 'Tracy knows which page you are on and scopes all analysis to that agent or trajectory automatically.',
  },
  {
    icon: '\u26A1',
    title: 'Real-time queries',
    desc: 'Queries your trajectory graph database live. No pre-computed reports or stale dashboards.',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Charts and drill-down',
    desc: 'Inline visualizations with multi-turn follow-up conversations for deeper investigation.',
  },
];

const FEATURES = [
  {
    title: 'Execution Path',
    desc: 'Interactive trace tree showing every LLM call, tool use, and sub-agent delegation with full input/output payloads.',
    src: '/docs/images/2.2.1-see-detail-trajectory---tracing-view.png',
    alt: 'Execution path view',
  },
  {
    title: 'Call Graph',
    desc: 'Node-link diagram visualizing the relationships between agents, tools, and models at a glance.',
    src: '/docs/images/2.2.1-see-detail-trajectory---graph-view.png',
    alt: 'Call graph view',
  },
  {
    title: 'Timeline',
    desc: 'Gantt chart showing when each step started, how long it ran, and where parallelism or gaps exist.',
    src: '/docs/images/2.2.3-see-detail-trajectory---timeline-view.png',
    alt: 'Timeline view',
  },
  {
    title: 'Cost Analytics',
    desc: 'Token usage, credit consumption, and spend trends broken down by agent, trajectory, and step.',
    src: '/docs/images/2.1-see-all-trajectories-of-an-agent.png',
    alt: 'Trajectory dashboard with cost analytics',
  },
];

const STEPS = [
  {
    num: '1',
    title: 'Connect',
    desc: 'Add the ClawTrace plugin to your OpenClaw agent. One npm install, one config line.',
    icon: '\u{1F50C}',
  },
  {
    num: '2',
    title: 'Observe',
    desc: 'Every trajectory streams to ClawTrace automatically. See traces, spans, tokens, and costs.',
    icon: '\u{1F441}',
  },
  {
    num: '3',
    title: 'Improve',
    desc: 'Ask Tracy what went wrong, what costs too much, and how to fix it. Get specific, actionable answers.',
    icon: '\u{1F680}',
  },
];

const ROADMAP = [
  {
    title: 'Rubric-Based Evaluation',
    desc: 'Define quality rubrics, auto-score agent trajectories, catch regressions before deployment.',
  },
  {
    title: 'A/B Testing',
    desc: 'Run agent variants side-by-side, compare cost, quality, and speed. Promote winners with confidence.',
  },
  {
    title: 'Version Control',
    desc: 'Track agent config changes over time, roll back to known-good versions, audit who changed what.',
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
  const tracyRef = useScrollReveal();
  const featuresRef = useScrollReveal();
  const stepsRef = useScrollReveal();
  const roadmapRef = useScrollReveal();
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
          </nav>
          <UserButton />
        </div>
      </header>

      {/* ── S1: Hero (kept as-is) ──────────────────────────────────── */}
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
                <Image
                  src={slide.image} alt={slide.alt}
                  width={slide.image.width} height={slide.image.height}
                  priority={i === 0} sizes="(max-width: 980px) 100vw, 1120px"
                  className={styles.heroImage}
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

      {/* ── S2: Backers (kept as-is) ───────────────────────────────── */}
      <section className={styles.backers} aria-label="Backed by">
        <div className={styles.backersList}>
          {BACKERS.map((b) => (
            <Image key={b.name} src={b.logo} alt={b.name}
              width={b.logo.width} height={b.logo.height}
              className={styles.backerLogo} sizes="(max-width: 760px) 120px, 180px" />
          ))}
        </div>
      </section>

      {/* ── S3: Better / Cheaper / Faster (kept as-is) ─────────────── */}
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

      {/* ── S4: Tracy Showcase (NEW) ───────────────────────────────── */}
      <section className={`${styles.tracySection} ${styles.reveal}`} id="tracy" ref={tracyRef}>
        <p className={styles.sectionKicker}>Meet Tracy</p>
        <h2 className={styles.sectionTitle}>Your OpenClaw Doctor Agent</h2>
        <p className={styles.sectionSub}>
          Don't just see what happened. Ask why — and get answers.
        </p>

        <div className={styles.tracyShowcase}>
          <div className={styles.tracyLeft}>
            <p className={styles.tracyDesc}>
              Tracy is an AI observability analyst that lives inside ClawTrace.
              She queries your trajectory data in real time, spots anomalies you would miss,
              and delivers actionable optimization advice — all through natural conversation.
            </p>
            <div className={styles.tracyQuestions}>
              {TRACY_QUESTIONS.map((q) => (
                <span key={q} className={styles.tracyPill}>{q}</span>
              ))}
            </div>
          </div>
          <div className={styles.tracyRight}>
            <Image
              src="/docs/images/ask_tracy_4_result.png" alt="Tracy analyzing trajectory costs"
              width={510} height={680}
              className={styles.tracyScreenshot}
              sizes="(max-width: 760px) 100vw, 510px"
            />
          </div>
        </div>

        <div className={styles.tracyFeatures}>
          {TRACY_FEATURES.map((f) => (
            <div key={f.title} className={styles.tracyFeatureCard}>
              <span className={styles.tracyFeatureIcon}>{f.icon}</span>
              <h4 className={styles.tracyFeatureTitle}>{f.title}</h4>
              <p className={styles.tracyFeatureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── S5: Product Features Grid (NEW) ────────────────────────── */}
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

      {/* ── S6: How It Works (NEW) ─────────────────────────────────── */}
      <section className={`${styles.stepsSection} ${styles.reveal}`} id="how-it-works" ref={stepsRef}>
        <p className={styles.sectionKicker}>Get started in minutes</p>
        <h2 className={styles.sectionTitle}>Three steps to reliable agents</h2>

        <div className={styles.stepsGrid}>
          {STEPS.map((s) => (
            <article key={s.num} className={styles.stepCard}>
              <span className={styles.stepNum}>{s.icon}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </article>
          ))}
        </div>

        <div className={styles.codeSnippet}>
          <p className={styles.codeLabel}>One-line install</p>
          <code className={styles.codeBlock}>npm install @epsilla/clawtrace</code>
        </div>
      </section>

      {/* ── S7: Coming Soon (NEW) ──────────────────────────────────── */}
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

      {/* ── S8: CTA (replaced waitlist) ────────────────────────────── */}
      <section className={`${styles.cta} ${styles.reveal}`} id="get-started" ref={ctaRef}>
        <h2 className={styles.ctaTitle}>Start improving your agents today</h2>
        <p className={styles.ctaSub}>200 free credits. No credit card required.</p>
        <a className={styles.ctaButton} href="/login">Get Started Free</a>
        <p className={styles.ctaSignin}>
          Already have an account? <Link href="/login" className={styles.ctaLink}>Sign in</Link>
        </p>
      </section>

      {/* ── S9: Footer (NEW) ───────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image src={logoImage} alt="ClawTrace" width={120} height={30}
              className={styles.footerLogo} sizes="120px" />
            <p className={styles.footerTagline}>Workflow reliability for OpenClaw agents</p>
          </div>
          <nav className={styles.footerLinks}>
            <a href="#features" className={styles.footerLink}>Product</a>
            <a href="/docs" className={styles.footerLink}>Documentation</a>
            <a href="/billing" className={styles.footerLink}>Billing</a>
            <a href="/docs/ask-tracy" className={styles.footerLink}>Ask Tracy</a>
          </nav>
          <p className={styles.footerCopy}>Built by Epsilla Inc.</p>
        </div>
      </footer>
    </main>
  );
}
