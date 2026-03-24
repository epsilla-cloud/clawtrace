import type { ClawTraceFlowId } from './flow-pages';

export type OnboardingFlowId = 'f0-connect' | 'f1-audit' | 'f2-handoff';

type OnboardingMessageRole = 'assistant' | 'user' | 'system';

export type OnboardingChatMessage = {
  id: string;
  role: OnboardingMessageRole;
  text: string;
};

export type OnboardingChatScript = {
  messages: OnboardingChatMessage[];
  quickReplies: string[];
};

const ONBOARDING_SCRIPTS: Record<OnboardingFlowId, OnboardingChatScript> = {
  'f0-connect': {
    messages: [
      {
        id: 'f0-a-1',
        role: 'assistant',
        text: 'Welcome to ClawTrace onboarding. First we connect your OpenClaw workspace so runtime visibility is reliable.',
      },
      {
        id: 'f0-u-1',
        role: 'user',
        text: 'I need daily confidence on my SEO workflow without babysitting every run.',
      },
      {
        id: 'f0-a-2',
        role: 'assistant',
        text: 'Understood. I will scope access to your workflows and verify recent run ingestion before we do anything else.',
      },
      {
        id: 'f0-s-1',
        role: 'system',
        text: 'Connection check complete: 3 workflows discovered, telemetry ingestion healthy over last 7 days.',
      },
      {
        id: 'f0-a-3',
        role: 'assistant',
        text: 'Great. Next we run a guided audit to infer contracts, trust baselines, and unknowns from historical runs.',
      },
    ],
    quickReplies: ['Show discovered workflows', 'Expand connection scope', 'Continue to guided audit'],
  },
  'f1-audit': {
    messages: [
      {
        id: 'f1-a-1',
        role: 'assistant',
        text: 'Guided audit is running. I am inferring critical steps, mutating boundaries, verifier candidates, and trust states.',
      },
      {
        id: 'f1-s-1',
        role: 'system',
        text: 'Inference complete: contract draft v1 created for Daily SEO Content Pipeline. Unknowns flagged for image verifier fallback path.',
      },
      {
        id: 'f1-u-1',
        role: 'user',
        text: 'The cover image step is where repeated failures happen. Please weight that risk higher.',
      },
      {
        id: 'f1-a-2',
        role: 'assistant',
        text: 'Applied. I elevated image-verifier checks to a critical boundary and marked publish as blocked when image verification fails.',
      },
      {
        id: 'f1-s-2',
        role: 'system',
        text: 'Trust baseline published: 1 workflow at risk, 2 workflows healthy.',
      },
    ],
    quickReplies: ['Approve contract baseline', 'Show known vs unknown evidence', 'Adjust verifier strictness'],
  },
  'f2-handoff': {
    messages: [
      {
        id: 'f2-a-1',
        role: 'assistant',
        text: 'Onboarding handoff: I selected Daily SEO Content Pipeline as your first deep cockpit because it carries highest business impact and highest current risk.',
      },
      {
        id: 'f2-s-1',
        role: 'system',
        text: 'Primary next action generated: revalidate cover-image step before publish. Confidence: high.',
      },
      {
        id: 'f2-u-1',
        role: 'user',
        text: 'Will this still keep operations calm when things are healthy?',
      },
      {
        id: 'f2-a-2',
        role: 'assistant',
        text: 'Yes. Daily home is a calm overview. Investigation drawer opens only when trust degrades or you ask for deeper analysis.',
      },
      {
        id: 'f2-s-2',
        role: 'system',
        text: 'Onboarding complete. Overview is ready with one focused workflow and explicit verification criteria.',
      },
    ],
    quickReplies: ['Open overview', 'Explain primary action logic', 'Review verification criteria'],
  },
};

export function isOnboardingFlowId(flowId: ClawTraceFlowId): flowId is OnboardingFlowId {
  return flowId === 'f0-connect' || flowId === 'f1-audit' || flowId === 'f2-handoff';
}

export function getOnboardingChatScript(flowId: OnboardingFlowId): OnboardingChatScript {
  return ONBOARDING_SCRIPTS[flowId];
}
