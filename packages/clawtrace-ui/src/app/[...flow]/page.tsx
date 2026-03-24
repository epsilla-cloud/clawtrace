import { notFound } from 'next/navigation';
import type { ClawTraceFlowDefinition } from '../../lib/flow-pages';
import { FlowPageTemplate } from '../../components/clawtrace/flow/FlowPageTemplate';
import { OnboardingGuidedConversation } from '../../components/clawtrace/onboarding/OnboardingGuidedConversation';
import { CLAWTRACE_FLOW_PAGES, getAdjacentFlow, getFlowBySegments, getFlowSegments } from '../../lib/flow-pages';
import type { OnboardingFlowId } from '../../lib/onboarding-chat-script';
import { isOnboardingFlowId } from '../../lib/onboarding-chat-script';

type FlowRoutePageProps = {
  params: Promise<{
    flow: string[];
  }>;
};

export function generateStaticParams() {
  return CLAWTRACE_FLOW_PAGES.map((flow) => ({
    flow: getFlowSegments(flow),
  }));
}

export default async function FlowRoutePage({ params }: FlowRoutePageProps) {
  const { flow: flowSegments } = await params;
  const flow = getFlowBySegments(flowSegments);

  if (!flow) {
    notFound();
  }

  const previousFlow = getAdjacentFlow(flow.id, -1);
  const nextFlow = getAdjacentFlow(flow.id, 1);
  const onboardingFlows = CLAWTRACE_FLOW_PAGES.filter((item) => isOnboardingFlowId(item.id));

  if (isOnboardingFlowId(flow.id)) {
    const onboardingFlow = flow as ClawTraceFlowDefinition & { id: OnboardingFlowId };

    return (
      <div className="operator clawtrace">
        <OnboardingGuidedConversation
          flow={onboardingFlow}
          onboardingFlows={onboardingFlows}
          previousFlow={previousFlow}
          nextFlow={nextFlow}
        />
      </div>
    );
  }

  return (
    <div className="operator clawtrace">
      <FlowPageTemplate flow={flow} allFlows={CLAWTRACE_FLOW_PAGES} previousFlow={previousFlow} nextFlow={nextFlow} />
    </div>
  );
}
