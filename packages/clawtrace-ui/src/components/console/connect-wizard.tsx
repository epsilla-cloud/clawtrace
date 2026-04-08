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
      title="Copy to clipboard"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
      )}
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
              Connection Name
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
                className={styles.primaryBtn}
                disabled={!name.trim() || loading}
              >
                {loading ? 'Creating…' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 2 && createdKey && (
        <div className={styles.page2}>
          <h1 className={styles.heading}>Observe Key &amp; Setup</h1>
          <p className={styles.subheading}>
            Follow the steps below to install and configure the ClawTrace plugin in your OpenClaw.
          </p>

          {/* Key panel */}
          <div className={styles.keyPanel}>
            <div className={styles.keyPanelHeader}>
              <span className={styles.keyPanelTitle}>Your Observe Key</span>
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
            <h2 className={styles.briefingTitle}>Setup Guide</h2>

            <div className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNum}>1</span>
                <div>
                  <p className={styles.stepTitle}>Install the ClawTrace plugin</p>
                  <p className={styles.stepDesc}>Run this in your terminal on the machine running OpenClaw.</p>
                </div>
              </div>
              <div className={styles.codeBlock}>
                <code>openclaw plugins install @epsilla/clawtrace</code>
                <CopyButton text="openclaw plugins install @epsilla/clawtrace" />
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNum}>2</span>
                <div>
                  <p className={styles.stepTitle}>Authenticate with your observe key</p>
                  <p className={styles.stepDesc}>Run the interactive setup. When prompted, paste the key shown above.</p>
                </div>
              </div>
              <div className={styles.codeBlock}>
                <code>openclaw clawtrace setup</code>
                <CopyButton text="openclaw clawtrace setup" />
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNum}>3</span>
                <div>
                  <p className={styles.stepTitle}>Restart OpenClaw gateway</p>
                  <p className={styles.stepDesc}>Reload the gateway so the plugin picks up your new key.</p>
                </div>
              </div>
              <div className={styles.codeBlock}>
                <code>openclaw gateway restart</code>
                <CopyButton text="openclaw gateway restart" />
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNum}>4</span>
                <div>
                  <p className={styles.stepTitle}>Wait for trajectories to appear</p>
                  <p className={styles.stepDesc}>
                    It usually takes about 5 minutes for trajectories to show up on the dashboard
                    after completing the setup above.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer2}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => router.push(`/trace/${createdKey.id}`)}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
