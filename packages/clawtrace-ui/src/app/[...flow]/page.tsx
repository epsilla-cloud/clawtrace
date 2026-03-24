import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FlowPageTemplate } from '../../components/clawtrace/flow/FlowPageTemplate';
import { WorkflowPortfolio } from '../../components/clawtrace/portfolio/WorkflowPortfolio';
import { CLAWTRACE_FLOW_PAGES, getAdjacentFlow, getFlowBySegments } from '../../lib/flow-pages';
import { loadOpenClawDiscoverySnapshot } from '../../lib/openclaw-discovery';

type FlowRoutePageProps = {
  params: Promise<{
    flow: string[];
  }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: FlowRoutePageProps): Promise<Metadata> {
  const { flow: flowSegments } = await params;
  const flow = getFlowBySegments(flowSegments);

  if (!flow) {
    return {
      title: 'Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: flow.title,
    description: flow.subtitle,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function FlowRoutePage({ params }: FlowRoutePageProps) {
  const { flow: flowSegments } = await params;
  const flow = getFlowBySegments(flowSegments);

  if (!flow) {
    notFound();
  }

  const previousFlow = getAdjacentFlow(flow.id, -1);
  const nextFlow = getAdjacentFlow(flow.id, 1);

  if (flow.id === 'f3-control-room') {
    const snapshot = await loadOpenClawDiscoverySnapshot().catch(() => null);
    return (
      <div className="operator clawtrace">
        <WorkflowPortfolio initialSnapshot={snapshot} flow={flow} allFlows={CLAWTRACE_FLOW_PAGES} />
      </div>
    );
  }

  return (
    <div className="operator clawtrace">
      <FlowPageTemplate flow={flow} allFlows={CLAWTRACE_FLOW_PAGES} previousFlow={previousFlow} nextFlow={nextFlow} />
    </div>
  );
}
