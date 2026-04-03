import { AppNav } from '@/components/app-nav/AppNav';
import styles from './trace.module.css';

export const metadata = { title: 'Trace — ClawTrace' };

export default function TracePage() {
  return (
    <div className={styles.shell}>
      <AppNav />
      <main className={styles.main}>
        <div className={styles.placeholder}>
          <h1 className={styles.title}>Trace Investigation</h1>
          <p className={styles.sub}>Select an agent and trace to begin investigating.</p>
        </div>
      </main>
    </div>
  );
}
