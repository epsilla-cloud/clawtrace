import type { Metadata } from 'next';
import { TraceDetailWorkbench } from '../../../components/clawtrace/trace-detail/TraceDetailWorkbench';
import {
  CLAWTRACE_FLOW_PAGES,
  getFlowBySegments,
  type ClawTraceFlowDefinition,
} from '../../../lib/flow-pages';
import { loadOpenClawDiscoverySnapshot } from '../../../lib/openclaw-discovery';
import { loadTraceDetailSnapshot } from '../../../lib/trace-detail';

type TraceDetailPageProps = {
  params: Promise<{
    workflowId: string;
  }>;
  searchParams: Promise<{
    trace?: string | string[];
  }>;
};

export const dynamic = 'force-dynamic';

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function firstValue(value: string | string[] | undefined): string | null {
  if (!value) return null;
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value;
}

function resolveOverviewFlow(): ClawTraceFlowDefinition {
  return getFlowBySegments(['control-room']) ?? CLAWTRACE_FLOW_PAGES.find((flow) => flow.id === 'f3-control-room') ?? CLAWTRACE_FLOW_PAGES[0];
}

export async function generateMetadata({ params }: TraceDetailPageProps): Promise<Metadata> {
  const { workflowId: rawWorkflowId } = await params;
  const workflowId = safeDecode(rawWorkflowId);

  return {
    title: `${workflowId} Run Detail`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function TraceDetailPage({ params, searchParams }: TraceDetailPageProps) {
  const [{ workflowId: rawWorkflowId }, query] = await Promise.all([params, searchParams]);
  const workflowId = safeDecode(rawWorkflowId);
  const selectedTraceId = firstValue(query.trace);

  const snapshot = await loadOpenClawDiscoverySnapshot().catch(() => null);

  const detail = snapshot
    ? await loadTraceDetailSnapshot({
        workflowId,
        selectedTraceId,
        snapshot,
      }).catch(() => null)
    : null;

  const flow = resolveOverviewFlow();

  return (
    <div className="operator clawtrace">
      <TraceDetailWorkbench
        flow={flow}
        allFlows={CLAWTRACE_FLOW_PAGES}
        workflowId={workflowId}
        snapshot={snapshot}
        detail={detail}
      />
    </div>
  );
}
