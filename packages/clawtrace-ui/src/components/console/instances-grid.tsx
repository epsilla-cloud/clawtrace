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

/* ── Delete confirmation modal ──────────────────────────────────────────── */
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
          <button type="button" className={styles.modalCancel} onClick={onCancel}>Cancel</button>
          <button type="button" className={styles.modalDelete} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Action menu (⋮) ────────────────────────────────────────────────────── */
function ActionMenu({ onRename, onDelete }: { onRename: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={menuRef} className={styles.menuWrap}>
      <button type="button" className={styles.menuTrigger} onClick={() => setOpen(!open)} aria-label="Actions">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className={styles.menuDropdown}>
          <button type="button" className={styles.menuItem} onClick={() => { setOpen(false); onRename(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
            </svg>
            Rename
          </button>
          <button type="button" className={styles.menuItem} onClick={() => { setOpen(false); onDelete(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Agent card ──────────────────────────────────────────────────────────── */
function AgentCard({ agent, onRename, onDelete, isDeleting }: {
  agent: Agent;
  onRename: (id: string, name: string) => void;
  onDelete: (agent: Agent) => void;
  isDeleting: boolean;
}) {
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(agent.name);
  const inputRef = useRef<HTMLInputElement>(null);

  function startRename() {
    setRenameValue(agent.name);
    setRenaming(true);
    setTimeout(() => inputRef.current?.select(), 30);
  }

  function submitRename() {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== agent.name) {
      onRename(agent.id, trimmed);
    }
    setRenaming(false);
  }

  const lastActive = agent.last_used_at
    ? new Date(agent.last_used_at).toLocaleString([], { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : '—';

  return (
    <div className={`${styles.card} ${isDeleting ? styles.cardDeleting : ''}`}>
      {/* Top row: logo + name/id + menu */}
      <div className={styles.cardTop}>
        <div className={styles.logoWrap}>
          <Image src="/openclaw-logo.svg" alt="OpenClaw" width={28} height={28} />
        </div>
        <div className={styles.cardIdentity}>
          {renaming ? (
            <form onSubmit={(e) => { e.preventDefault(); submitRename(); }} className={styles.renameForm}>
              <input
                ref={inputRef}
                className={styles.renameInput}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={submitRename}
                maxLength={80}
              />
            </form>
          ) : (
            <p className={styles.cardName}>{agent.name}</p>
          )}
          <p className={styles.cardId}>ID: {agent.id}</p>
        </div>
        <ActionMenu onRename={startRename} onDelete={() => onDelete(agent)} />
      </div>

      {/* Bottom row: last active + view button */}
      <div className={styles.cardBottom}>
        <div>
          <p className={styles.cardMetaLabel}>Last Active</p>
          <p className={styles.cardMetaValue}>{lastActive}</p>
        </div>
        <a href={`/trace/${agent.id}`} className={styles.viewBtn}>
          View Trajectories
        </a>
      </div>
    </div>
  );
}

/* ── Main grid ───────────────────────────────────────────────────────────── */
export function InstancesGrid() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Agent | null>(null);

  async function loadAgents() {
    const res = await fetch('/api/agents', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setAgents(data.agents ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { loadAgents(); }, []);

  async function handleRename(id: string, name: string) {
    const res = await fetch(`/api/agents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setAgents((prev) => prev.map((a) => a.id === id ? { ...a, name } : a));
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setConfirmDelete(null);
    const res = await fetch(`/api/agents/${id}`, { method: 'DELETE' });
    if (res.status === 204) setAgents((prev) => prev.filter((a) => a.id !== id));
    setDeletingId(null);
  }

  return (
    <div className={styles.root}>
      {confirmDelete && (
        <DeleteModal
          name={confirmDelete.name}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {loading ? (
        <div className={styles.empty}>Loading...</div>
      ) : (
        <div className={styles.grid}>
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onRename={handleRename}
              onDelete={(a) => setConfirmDelete(a)}
              isDeleting={deletingId === agent.id}
            />
          ))}
          <a href="/overview/connect" className={styles.addCard}>
            <span className={styles.addIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="M12 5v14" />
              </svg>
            </span>
            <span className={styles.addLabel}>Observe New Agent</span>
          </a>
        </div>
      )}
    </div>
  );
}
