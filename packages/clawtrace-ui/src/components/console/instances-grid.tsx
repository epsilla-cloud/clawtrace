'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './instances-grid.module.css';

interface Agent {
  id: string;
  name: string;
  key_prefix: string;
  tenant_id: string;
  created_at: string;
  last_used_at: string | null;
}

function DeleteModal({ name, onConfirm, onCancel }: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Delete agent?</h3>
        <p className={styles.modalBody}>
          <strong>{name}</strong> will be permanently deleted. Any OpenClaw instances
          using its observe key will stop sending telemetry.
        </p>
        <div className={styles.modalActions}>
          <button type="button" className={styles.modalCancel} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={styles.modalDelete} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function InstancesGrid() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Agent | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  async function loadAgents() {
    const res = await fetch('/api/agents', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setAgents(data.agents ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { loadAgents(); }, []);

  function startRename(agent: Agent) {
    setRenamingId(agent.id);
    setRenameValue(agent.name);
    setTimeout(() => renameInputRef.current?.focus(), 30);
  }

  async function submitRename(id: string) {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    const res = await fetch(`/api/agents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: renameValue.trim() }),
    });
    if (res.ok) {
      setAgents((prev) => prev.map((a) => a.id === id ? { ...a, name: renameValue.trim() } : a));
    }
    setRenamingId(null);
  }

  async function doDelete(id: string) {
    setDeletingId(id);
    setConfirmDelete(null);
    const res = await fetch(`/api/agents/${id}`, { method: 'DELETE' });
    if (res.status === 204) setAgents((prev) => prev.filter((a) => a.id !== id));
    setDeletingId(null);
  }

  return (
    <div className={styles.root}>
      {/* Delete confirmation modal */}
      {confirmDelete && (
        <DeleteModal
          name={confirmDelete.name}
          onConfirm={() => doDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>OpenClaw Agents</h1>
          <p className={styles.subtitle}>
            Connected OpenClaw instances streaming telemetry to ClawTrace.
          </p>
        </div>
        <a href="/overview/connect" className={styles.connectBtn}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="8" cy="8" r="6" /><path d="M8 5v6M5 8h6" />
          </svg>
          Observe New OpenClaw Agent
        </a>
      </div>

      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : (
        <div className={styles.grid}>
          {agents.map((agent) => (
            <div key={agent.id} className={styles.card}>
              <div className={styles.logoWrap}>
                <Image src="/openclaw-logo.svg" alt="OpenClaw" width={32} height={32} />
              </div>

              {renamingId === agent.id ? (
                <form onSubmit={(e) => { e.preventDefault(); submitRename(agent.id); }} className={styles.renameForm}>
                  <input
                    ref={renameInputRef}
                    className={styles.renameInput}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => submitRename(agent.id)}
                    maxLength={80}
                  />
                </form>
              ) : (
                <button type="button" className={styles.cardName} onClick={() => startRename(agent)} title="Click to rename">
                  {agent.name}
                </button>
              )}

              <p className={styles.cardId}>ID: {agent.key_prefix}…</p>

              <div className={styles.cardFooter}>
                <div>
                  <p className={styles.cardMetaLabel}>LAST ACTIVE</p>
                  <p className={styles.cardMetaValue}>
                    {agent.last_used_at ? new Date(agent.last_used_at).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className={styles.cardActions}>
                  <a href={`/traces?agentId=${agent.id}`} className={styles.viewLink}>View Traces →</a>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    disabled={deletingId === agent.id}
                    onClick={() => setConfirmDelete(agent)}
                    title="Delete agent"
                  >
                    {deletingId === agent.id ? '…' : '✕'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <a href="/overview/connect" className={styles.addCard}>
            <span className={styles.addIcon}>+</span>
            <span className={styles.addLabel}>Observe New OpenClaw Agent</span>
          </a>
        </div>
      )}
    </div>
  );
}
