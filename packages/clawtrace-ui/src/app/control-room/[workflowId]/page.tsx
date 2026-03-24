import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

type AgentDetailPageProps = {
  params: Promise<{
    workflowId: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Agent Details',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { workflowId } = await params;

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.kicker}>Agent details</p>
        <h1 className={styles.title}>{decodeURIComponent(workflowId)}</h1>
        <p className={styles.body}>Detail view is the next step. This page is reserved for deep run analysis and interventions.</p>
        <Link href="/control-room" className={styles.backLink}>
          Back to agent dashboard
        </Link>
      </div>
    </main>
  );
}

