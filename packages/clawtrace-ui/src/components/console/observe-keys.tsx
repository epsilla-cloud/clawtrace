'use client';

import { useEffect, useState } from 'react';
import styles from './observe-keys.module.css';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  tenant_id: string;
  created_at: string;
  last_used_at: string | null;
  revoked: boolean;
}

export function ObserveKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function loadKeys() {
    const res = await fetch('/api/keys', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setKeys((data.keys ?? []).filter((k: ApiKey) => !k.revoked));
    }
    setLoading(false);
  }

  useEffect(() => { loadKeys(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setCreating(true);
    const res = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newKeyName.trim() }),
    });
    if (res.ok) {
      const data = await res.json();
      setCreatedKey(data.key);
      setNewKeyName('');
      await loadKeys();
    }
    setCreating(false);
  }

  async function handleRevoke(id: string) {
    if (!confirm('Revoke this key? OpenClaw agents using it will stop sending data.')) return;
    setRevoking(id);
    const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
    if (res.status === 204) await loadKeys();
    setRevoking(null);
  }

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.root}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>Observe Keys</h2>
          <p className={styles.sectionSub}>
            Use these keys to configure the <code>@epsilla/clawtrace</code> plugin in your OpenClaw agents.
            Your tenant ID is <code>{keys[0]?.tenant_id ?? '—'}</code>.
          </p>
        </div>
      </div>

      {/* Created key — show once */}
      {createdKey && (
        <div className={styles.newKeyBanner}>
          <div className={styles.newKeyTop}>
            <span className={styles.newKeyLabel}>
              ⚠ Copy this key now — it will not be shown again
            </span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => handleCopy(createdKey)}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <code className={styles.newKeyValue}>{createdKey}</code>
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={() => setCreatedKey(null)}
          >
            I have saved it — dismiss
          </button>
        </div>
      )}

      {/* Create form */}
      <form onSubmit={handleCreate} className={styles.createForm}>
        <input
          type="text"
          className={styles.nameInput}
          placeholder="Key name (e.g. production-agent)"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          maxLength={80}
        />
        <button type="submit" className={styles.createBtn} disabled={creating || !newKeyName.trim()}>
          {creating ? 'Creating…' : '+ New key'}
        </button>
      </form>

      {/* Key list */}
      {loading ? (
        <div className={styles.skeletonRows}>
          {[0, 1, 2].map((i) => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonBar} style={{ width: '25%', height: 14 }} />
              <div className={styles.skeletonBar} style={{ width: '20%', height: 14 }} />
              <div className={styles.skeletonBar} style={{ width: '15%', height: 14 }} />
              <div className={styles.skeletonBar} style={{ width: '15%', height: 14 }} />
              <div className={styles.skeletonBar} style={{ width: 60, height: 24, borderRadius: 5 }} />
            </div>
          ))}
        </div>
      ) : keys.length === 0 ? (
        <p className={styles.empty}>No active keys — create one above to get started.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Key prefix</th>
              <th>Created</th>
              <th>Last used</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td className={styles.keyName}>{k.name}</td>
                <td><code className={styles.prefix}>{k.key_prefix}…</code></td>
                <td className={styles.date}>{new Date(k.created_at).toLocaleDateString()}</td>
                <td className={styles.date}>
                  {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : '—'}
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.revokeBtn}
                    disabled={revoking === k.id}
                    onClick={() => handleRevoke(k.id)}
                  >
                    {revoking === k.id ? 'Revoking…' : 'Revoke'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
