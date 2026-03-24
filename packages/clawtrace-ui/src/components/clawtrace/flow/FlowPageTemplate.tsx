import Link from 'next/link';
import type { ClawTraceFlowDefinition } from '../../../lib/flow-pages';
import styles from './FlowPageTemplate.module.css';

type FlowPageTemplateProps = {
  flow: ClawTraceFlowDefinition;
  allFlows: ClawTraceFlowDefinition[];
  previousFlow: ClawTraceFlowDefinition | null;
  nextFlow: ClawTraceFlowDefinition | null;
};

export function FlowPageTemplate({ flow, allFlows, previousFlow, nextFlow }: FlowPageTemplateProps) {
  const primaryHref = nextFlow?.route ?? '/control-room';

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.phasePill}>{flow.phase}</span>
        <h1 className={styles.title}>{flow.title}</h1>
        <p className={styles.subtitle}>{flow.subtitle}</p>
        <p className={styles.question}>User question: {flow.userQuestion}</p>

        <nav className={styles.flowRail} aria-label="ClawTrace journey flow pages">
          {allFlows.map((item) => (
            <Link
              key={item.id}
              className={`${styles.flowChip} ${item.id === flow.id ? styles.flowChipActive : ''}`}
              href={item.route}
            >
              <span className={styles.flowChipIndex}>F{item.order}</span>
              <span className={styles.flowChipLabel}>{item.title}</span>
            </Link>
          ))}
        </nav>
      </header>

      <section className={styles.layout}>
        <div className={styles.mainColumn}>
          <article className={styles.focusCard}>
            <h2 className={styles.cardTitle}>What This Page Focuses On</h2>
            <p className={styles.cardBody}>{flow.firstTimeHint}</p>
          </article>

          {flow.modules.map((module) => (
            <article key={module.title} className={styles.moduleCard}>
              <h3 className={styles.moduleTitle}>{module.title}</h3>
              <p className={styles.cardBody}>{module.description}</p>
            </article>
          ))}
        </div>

        <aside className={styles.sideColumn}>
          <article className={styles.sideCard}>
            <h2 className={styles.cardTitle}>Primary Action</h2>
            <Link className={styles.primaryButton} href={primaryHref}>
              {flow.primaryActionLabel}
            </Link>
          </article>

          <article className={styles.sideCard}>
            <h2 className={styles.cardTitle}>Success Checks</h2>
            <ul className={styles.checkList}>
              {flow.successChecks.map((check) => (
                <li key={check} className={styles.checkItem}>
                  {check}
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.sideCard}>
            <h2 className={styles.cardTitle}>Flow Navigation</h2>
            <div className={styles.navActions}>
              {previousFlow ? (
                <Link className={styles.secondaryButton} href={previousFlow.route}>
                  Back: F{previousFlow.order}
                </Link>
              ) : null}
              {nextFlow ? (
                <Link className={styles.secondaryButton} href={nextFlow.route}>
                  Next: F{nextFlow.order}
                </Link>
              ) : null}
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
