'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ClawTraceFlowDefinition } from '../../../lib/flow-pages';
import { getOnboardingChatScript, type OnboardingChatMessage, type OnboardingFlowId } from '../../../lib/onboarding-chat-script';
import styles from './OnboardingGuidedConversation.module.css';

type OnboardingFlowDefinition = Omit<ClawTraceFlowDefinition, 'id'> & { id: OnboardingFlowId };

type OnboardingGuidedConversationProps = {
  flow: OnboardingFlowDefinition;
  onboardingFlows: ClawTraceFlowDefinition[];
  previousFlow: ClawTraceFlowDefinition | null;
  nextFlow: ClawTraceFlowDefinition | null;
};

function roleClass(role: OnboardingChatMessage['role']) {
  if (role === 'assistant') return styles.assistant;
  if (role === 'user') return styles.user;
  return styles.system;
}

export function OnboardingGuidedConversation({
  flow,
  onboardingFlows,
  previousFlow,
  nextFlow,
}: OnboardingGuidedConversationProps) {
  const script = getOnboardingChatScript(flow.id);
  const [draft, setDraft] = useState('');
  const [manualMessages, setManualMessages] = useState<OnboardingChatMessage[]>([]);

  const transcript = useMemo(() => [...script.messages, ...manualMessages], [script.messages, manualMessages]);

  const continueHref = nextFlow?.route ?? '/control-room';

  const onQuickReply = (reply: string) => {
    setDraft(reply);
  };

  const onSend = () => {
    const trimmed = draft.trim();
    if (!trimmed.length) {
      return;
    }

    setManualMessages((current) => [
      ...current,
      {
        id: `manual-${current.length + 1}`,
        role: 'user',
        text: trimmed,
      },
      {
        id: `ack-${current.length + 1}`,
        role: 'assistant',
        text: 'Captured. This mock reply is saved in onboarding context for the next step.',
      },
    ]);
    setDraft('');
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Onboarding</p>
        <h1 className={styles.title}>{flow.title}</h1>
        <p className={styles.subtitle}>{flow.subtitle}</p>

        <nav className={styles.stepRail} aria-label="Onboarding steps">
          {onboardingFlows.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              className={`${styles.stepChip} ${item.id === flow.id ? styles.stepChipActive : ''}`}
            >
              <span className={styles.stepIndex}>F{item.order}</span>
              <span className={styles.stepLabel}>{item.title}</span>
            </Link>
          ))}
        </nav>
      </header>

      <section className={styles.layout}>
        <section className={styles.chatPanel}>
          <header className={styles.chatHeader}>
            <h2 className={styles.chatTitle}>Guided Conversation</h2>
            <p className={styles.chatSubtitle}>One decision at a time, grounded in evidence from your workspace.</p>
          </header>

          <div className={styles.transcript}>
            {transcript.map((message) => (
              <article key={message.id} className={`${styles.message} ${roleClass(message.role)}`}>
                <p className={styles.messageRole}>{message.role}</p>
                <p className={styles.messageText}>{message.text}</p>
              </article>
            ))}
          </div>

          <footer className={styles.composer}>
            <div className={styles.quickReplies}>
              {script.quickReplies.map((reply) => (
                <button key={reply} type="button" className={styles.quickReply} onClick={() => onQuickReply(reply)}>
                  {reply}
                </button>
              ))}
            </div>

            <div className={styles.composerRow}>
              <input
                className={styles.input}
                value={draft}
                onChange={(event) => setDraft(event.currentTarget.value)}
                placeholder="Type a mock reply to continue the guided flow"
                aria-label="Onboarding reply"
              />
              <button className={styles.sendButton} type="button" onClick={onSend}>
                Send
              </button>
            </div>
          </footer>
        </section>

        <aside className={styles.sidePanel}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Step Goal</h2>
            <p className={styles.cardBody}>{flow.userQuestion}</p>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>What We Configure Here</h2>
            <ul className={styles.list}>
              {flow.modules.map((module) => (
                <li key={module.title} className={styles.listItem}>
                  <p className={styles.listTitle}>{module.title}</p>
                  <p className={styles.listBody}>{module.description}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Success Checks</h2>
            <ul className={styles.checkList}>
              {flow.successChecks.map((check) => (
                <li key={check} className={styles.checkItem}>
                  {check}
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              {previousFlow ? (
                <Link className={styles.secondaryButton} href={previousFlow.route}>
                  Back
                </Link>
              ) : null}
              <Link className={styles.primaryButton} href={continueHref}>
                {flow.primaryActionLabel}
              </Link>
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
