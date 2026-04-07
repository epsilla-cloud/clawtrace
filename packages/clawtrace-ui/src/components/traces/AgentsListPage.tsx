'use client';

import { InstancesGrid } from '../console/instances-grid';
import styles from './AgentsListPage.module.css';

export function AgentsListPage() {
  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <h1 className={styles.title}>OpenClaw Agents</h1>
      </header>
      <div className={styles.body}>
        <InstancesGrid />
      </div>
    </section>
  );
}
