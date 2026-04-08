'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './connect-wizard.module.css';

type Step = 1 | 2;

interface CreatedKey {
  key: string;
  observe_key: string;
  key_prefix: string;
  id: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={styles.copyBtn}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

export function ConnectWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdKey, setCreatedKey] = useState<CreatedKey | null>(null);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error('Failed to create key');
      const data = await res.json();
      setCreatedKey({ key: data.key, observe_key: data.observe_key, key_prefix: data.key_prefix, id: data.id });
      setStep(2);
    } catch {
      setError('Could not create observe key. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.root}>
      {step === 1 && (
        <div className={styles.card}>
          <form onSubmit={handleContinue}>
            <label className={styles.label} htmlFor="conn-name">
              OpenClaw Agent Name
            </label>
            <input
              id="conn-name"
              type="text"
              className={styles.input}
              placeholder="e.g. Eliza Claw"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={80}
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.footer}>
              <button
                type="submit"
                className={styles.continueBtn}
                disabled={!name.trim() || loading}
              >
                {loading ? 'Creating…' : 'Continue →'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && createdKey && (
        <div className={styles.page2}>
          <p className={styles.stepLabel}>STEP 2: SECURITY & SETUP</p>
          <h1 className={styles.heading}>Observe Key &amp; Guidance</h1>
          <p className={styles.subheading}>
            Your unique observe key links this OpenClaw instance to ClawTrace.
            Install the plugin and paste the key to start streaming telemetry.
          </p>

          {/* Key panel */}
          <div className={styles.keyPanel}>
            <div className={styles.keyPanelHeader}>
              <span className={styles.keyPanelTitle}>Your Observe Key</span>
              <span className={styles.keyLiveTag}>
                <span className={styles.keyLiveDot} />
                Live &amp; Ready
              </span>
            </div>
            <div className={styles.keyRow}>
              <code className={styles.keyValue}>{createdKey.observe_key}</code>
              <CopyButton text={createdKey.observe_key} />
            </div>
            <p className={styles.keyWarning}>
              Treat this key as a password. ClawTrace will not show it again once you leave this screen.
            </p>
          </div>

          {/* Setup instructions */}
          <div className={styles.briefing}>
            <h2 className={styles.briefingTitle}>System Briefing</h2>

            <div className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <div>
                <p className={styles.stepTitle}>Install the ClawTrace plugin</p>
                <p className={styles.stepDesc}>Run this in your terminal on the machine running OpenClaw.</p>
                <div className={styles.codeBlock}>
                  <span className={styles.codeLang}>BASH</span>
                  <code>openclaw plugins install @epsilla/clawtrace</code>
                  <CopyButton text="openclaw plugins install @epsilla/clawtrace" />
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <div>
                <p className={styles.stepTitle}>Authenticate with your observe key</p>
                <p className={styles.stepDesc}>
                  Run the interactive setup. When prompted for your observe key,
                  paste the key shown above.
                </p>
                <div className={styles.codeBlock}>
                  <span className={styles.codeLang}>BASH</span>
                  <code>openclaw clawtrace setup</code>
                  <CopyButton text="openclaw clawtrace setup" />
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <div>
                <p className={styles.stepTitle}>Restart OpenClaw gateway</p>
                <p className={styles.stepDesc}>Reload the gateway so the plugin picks up your new key.</p>
                <div className={styles.codeBlock}>
                  <span className={styles.codeLang}>BASH</span>
                  <code>openclaw gateway restart</code>
                  <CopyButton text="openclaw gateway restart" />
                </div>
              </div>
            </div>
          </div>

          {/* Listener status */}
          <div className={styles.listener}>
            <div className={styles.listenerIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 12h8M12 8v8" />
              </svg>
            </div>
            <div>
              <p className={styles.listenerTitle}>Connection Listener</p>
              <p className={styles.listenerDesc}>
                ClawTrace is waiting for a heartbeat from your instance. The dashboard will populate
                after the first agent run.
              </p>
            </div>
            <span className={styles.listeningBadge}>● LISTENING…</span>
          </div>

          <div className={styles.footer2}>
            <button
              type="button"
              className={styles.continueBtn}
              onClick={() => router.push('/trace')}
            >
              Done →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
