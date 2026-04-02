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

type StatusFilter = 'all' | 'observing' | 'issues';

function getStatus(key: ApiKey): 'observing' | 'idle' | 'not_connected' {
  if (!key.last_used_at) return 'not_connected';
  const hoursSince = (Date.now() - new Date(key.last_used_at).getTime()) / 3_600_000;
  if (hoursSince < 24) return 'observing';
  return 'idle';
}

const STATUS_LABELS: Record<string, string> = {
  observing: 'OBSERVING',
  idle: 'IDLE',
  not_connected: 'NOT CONNECTED',
};

export function InstancesGrid() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    fetch('/api/keys', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setKeys((d.keys ?? []).filter((k: ApiKey) => !k.revoked)))
      .finally(() => setLoading(false));
  }, []);

  const filtered = keys.filter((k) => {
    if (filter === 'all') return true;
    if (filter === 'observing') return getStatus(k) === 'observing';
    if (filter === 'issues') return getStatus(k) === 'not_connected';
    return true;
  });

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.headerLabel}>ACTIVE INFRASTRUCTURE</p>
          <h1 className={styles.title}>Instances</h1>
          <p className={styles.subtitle}>
            Monitor and manage your connected OpenClaw agents. Each instance
            streams telemetry through its observe key.
          </p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.filters}>
            {(['all', 'observing', 'issues'] as StatusFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <a href="/console/connect" className={styles.connectBtn}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 5v6M5 8h6" />
            </svg>
            Connect New Instance
          </a>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((key) => {
            const status = getStatus(key);
            return (
              <div key={key.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.logoWrap}>
                    <Image src="/openclaw-logo.svg" alt="OpenClaw" width={32} height={32} />
                  </div>
                  <span className={`${styles.statusBadge} ${styles[`status_${status}`]}`}>
                    <span className={styles.statusDot} />
                    {STATUS_LABELS[status]}
                  </span>
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
                  <a href="/console" className={styles.viewLink}>View Overview →</a>
                </div>
              </div>
            );
          })}

          {/* Add New Node card */}
          <a href="/console/connect" className={styles.addCard}>
            <span className={styles.addIcon}>+</span>
            <span className={styles.addLabel}>Add New Node</span>
          </a>
        </div>
      )}

      {!loading && keys.length === 0 && (
        <div className={styles.empty}>
          No instances connected yet.{' '}
          <a href="/console/connect" className={styles.emptyLink}>
            Connect your first OpenClaw agent →
          </a>
        </div>
      )}
    </div>
  );
}
