import Link from 'next/link';
import type { ClawTraceFlowDefinition } from '../../../lib/flow-pages';
import { FlowLeftNav } from './FlowLeftNav';
import styles from './FlowPageTemplate.module.css';

type FlowPageTemplateProps = {
  flow: ClawTraceFlowDefinition;
  allFlows: ClawTraceFlowDefinition[];
  previousFlow: ClawTraceFlowDefinition | null;
  nextFlow: ClawTraceFlowDefinition | null;
};

export function FlowPageTemplate({ flow, allFlows, previousFlow, nextFlow }: FlowPageTemplateProps) {
  const primaryHref = nextFlow?.route ?? '/control-room';
  const transitionLinks =
    flow.transitions
      ?.map((transition) => {
        const target = allFlows.find((item) => item.id === transition.target);
        if (!target) {
          return null;
        }
        return {
          label: transition.label,
          route: target.route,
          flowOrder: target.order,
        };
      })
      .filter((item): item is { label: string; route: string; flowOrder: number } => Boolean(item)) ?? [];

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <div className={styles.leftRail}>
          <FlowLeftNav flow={flow} allFlows={allFlows} />
        </div>

        <div className={styles.content}>
          <header className={styles.header}>
            <span className={styles.phasePill}>{flow.phase}</span>
            <h1 className={styles.title}>{flow.title}</h1>
            <p className={styles.subtitle}>{flow.subtitle}</p>
            <p className={styles.question}>User question: {flow.userQuestion}</p>
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

              {transitionLinks.length ? (
                <article className={styles.sideCard}>
                  <h2 className={styles.cardTitle}>Transition Outcomes</h2>
                  <div className={styles.transitionList}>
                    {transitionLinks.map((transition) => (
                      <Link key={`${transition.flowOrder}-${transition.route}`} href={transition.route} className={styles.transitionLink}>
                        <span className={styles.transitionLabel}>{transition.label}</span>
                        <span className={styles.transitionTarget}>Go to F{transition.flowOrder}</span>
                      </Link>
                    ))}
                  </div>
                </article>
              ) : null}
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
