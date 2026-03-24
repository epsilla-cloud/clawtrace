import Link from 'next/link';
import type { ClawTraceFlowDefinition } from '../../../lib/flow-pages';
import styles from './FlowLeftNav.module.css';

type FlowLeftNavProps = {
  flow: ClawTraceFlowDefinition;
  allFlows: ClawTraceFlowDefinition[];
};

const PHASE_ORDER: Array<ClawTraceFlowDefinition['phase']> = ['Onboarding', 'Operate', 'Improve'];

export function FlowLeftNav({ flow, allFlows }: FlowLeftNavProps) {
  return (
    <aside className={styles.nav} aria-label="ClawTrace flow navigation">
      <section className={styles.block}>
        <p className={styles.blockLabel}>Journey</p>
        <div className={styles.phaseGroupList}>
          {PHASE_ORDER.map((phase) => {
            const phaseFlows = allFlows.filter((item) => item.phase === phase);
            if (!phaseFlows.length) {
              return null;
            }

            return (
              <div key={phase} className={styles.phaseGroup}>
                <p className={styles.phaseLabel}>{phase}</p>
                <div className={styles.flowList}>
                  {phaseFlows.map((item) => (
                    <Link key={item.id} href={item.route} className={`${styles.flowItem} ${item.id === flow.id ? styles.flowItemActive : ''}`}>
                      <span className={styles.flowIndex}>F{item.order}</span>
                      <span className={styles.flowName}>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.block}>
        <p className={styles.blockLabel}>Sub-flows</p>
        <div className={styles.subflowList}>
          {flow.modules.map((module, index) => (
            <article key={module.title} className={styles.subflowItem}>
              <span className={styles.subflowIndex}>
                {flow.id.toUpperCase()}-{index + 1}
              </span>
              <p className={styles.subflowTitle}>{module.title}</p>
              <p className={styles.subflowBody}>{module.description}</p>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}

