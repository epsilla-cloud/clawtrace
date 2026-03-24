import { notFound } from 'next/navigation';
import { FlowPageTemplate } from '../../components/clawtrace/flow/FlowPageTemplate';
import { CLAWTRACE_FLOW_PAGES, getAdjacentFlow, getFlowBySegments, getFlowSegments } from '../../lib/flow-pages';

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

  return (
    <div className="operator clawtrace">
      <FlowPageTemplate flow={flow} allFlows={CLAWTRACE_FLOW_PAGES} previousFlow={previousFlow} nextFlow={nextFlow} />
    </div>
  );
}
