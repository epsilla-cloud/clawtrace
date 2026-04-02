'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './instances-grid.module.css';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  tenant_id: string;
  created_at: string;
  last_used_at: string | null;
  revoked: boolean;
}

export function InstancesGrid() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/keys', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setKeys((d.keys ?? []).filter((k: ApiKey) => !k.revoked)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>OpenClaw Agents</h1>
          <p className={styles.subtitle}>
            Monitor and manage your connected OpenClaw agents. Each instance
            streams telemetry through its observe key.
          </p>
        </div>
        <a href="/console/connect" className={styles.connectBtn}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 5v6M5 8h6" />
          </svg>
          Connect New Instance
        </a>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : (
        <div className={styles.grid}>
          {keys.map((key) => (
            <div key={key.id} className={styles.card}>
              <div className={styles.logoWrap}>
                <Image src="/openclaw-logo.svg" alt="OpenClaw" width={32} height={32} />
              </div>
              <p className={styles.cardName}>{key.name}</p>
              <p className={styles.cardId}>ID: {key.key_prefix}…</p>
              <div className={styles.cardFooter}>
                <div>
                  <p className={styles.cardMetaLabel}>LAST ACTIVE</p>
                  <p className={styles.cardMetaValue}>
                    {key.last_used_at
                      ? new Date(key.last_used_at).toLocaleDateString()
                      : '—'}
                  </p>
                </div>
                <a href="/traces" className={styles.viewLink}>View Overview →</a>
              </div>
            </div>
          ))}

          {/* Add New Node card */}
          <a href="/console/connect" className={styles.addCard}>
            <span className={styles.addIcon}>+</span>
            <span className={styles.addLabel}>Add New Node</span>
          </a>
        </div>
      )}

      {!loading && keys.length === 0 && (
        <div className={styles.empty}>
          No agents connected yet.{' '}
          <a href="/console/connect" className={styles.emptyLink}>
            Connect your first OpenClaw agent →
          </a>
        </div>
      )}
    </div>
  );
}
