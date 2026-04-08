'use client';

import { InstancesGrid } from '../console/instances-grid';
import styles from './PageShell.module.css';

export function AgentsListPage() {
  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbCurrent}>OpenClaw Agents</span>
        </nav>
        <a href="/connect" className={styles.connectBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
          </svg>
          Observe New Agent
        </a>
      </header>
      <div className={styles.body}>
        <InstancesGrid />
      </div>
    </section>
  );
}
