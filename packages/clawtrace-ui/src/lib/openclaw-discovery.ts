import { promises as fs } from 'node:fs';
import path from 'node:path';

export type DiscoveryMessageRole = 'assistant' | 'system' | 'user';

export type DiscoveryTrustState =
  | 'healthy'
  | 'at_risk'
  | 'drifting'
  | 'blocked'
  | 'awaiting_confirmation'
  | 'partially_verified';

export type WorkflowRecommendation = {
  id: string;
  label: string;
  detail: string;
  suggestedSetting: string;
  severity: 'high' | 'medium' | 'low';
  status: 'recommended' | 'already_enabled' | 'partially_enabled';
};

export type WorkflowTrajectory = {
  traceId: string;
  sessionKey: string;
  startedAtMs: number;
  endedAtMs: number;
  durationMs: number;
  llmCalls: number;
  toolCalls: number;
  totalTokens: number;
  models: string[];
  signals: string[];
  mutatingBoundaries: string[];
  status: 'running' | 'completed';
};

export type WorkflowDiscovery = {
  id: string;
  name: string;
  enabled: boolean;
  scheduleLabel: string;
  trustState: DiscoveryTrustState;
  trustReason: string;
  instructionPath: string | null;
  instructionExists: boolean;
  inferredGoals: string[];
  failureThemes: string[];
  runStats7d: {
    total: number;
    success: number;
    failed: number;
    unknown: number;
    successRate: number;
  };
  tokenStats7d: {
    total: number;
    input: number;
    output: number;
  };
  modelUsage: Array<{
    model: string;
    count: number;
  }>;
  latestRun: {
    status: string;
    atMs: number;
    durationMs: number;
    summary: string;
  } | null;
  trajectories: WorkflowTrajectory[];
  recommendations: WorkflowRecommendation[];
  mutatingBoundaries: string[];
};

export type OpenClawDiscoverySnapshot = {
  generatedAtMs: number;
  openclawPath: string;
  workspacePath: string;
  importHealth: 'connected' | 'partial' | 'disconnected';
  warnings: string[];
  runtime: {
    primaryModel: string | null;
    heartbeatEvery: string | null;
    tracingPluginEnabled: boolean;
    enabledPlugins: string[];
    gatewayMode: string | null;
  };
  versioning: {
    configAuditEnabled: boolean;
    configChanges7d: number;
    stateFiles: Array<{
      filePath: string;
      exists: boolean;
      fileSizeBytes: number | null;
      modifiedAtMs: number | null;
    }>;
  };
  metrics: {
    workflowCount: number;
    runsLast7d: number;
    trajectoriesLast7d: number;
    activeTrajectories: number;
    tokensLast7d: number;
    modelsUsed: string[];
  };
  inferredPortfolioGoals: string[];
  workflows: WorkflowDiscovery[];
};

type CronJob = {
  id: string;
  name?: string;
  enabled?: boolean;
  schedule?: {
    kind?: string;
    expr?: string;
  };
  payload?: {
    kind?: string;
    message?: string;
  };
  state?: {
    nextRunAtMs?: number;
    lastRunAtMs?: number;
    lastRunStatus?: string;
    lastDurationMs?: number;
    consecutiveErrors?: number;
  };
};

type CronJobsFile = {
  jobs?: CronJob[];
};

type CronRun = {
  ts?: number;
  jobId?: string;
  status?: string;
  summary?: string;
  error?: string;
  runAtMs?: number;
  durationMs?: number;
  nextRunAtMs?: number;
  model?: string;
  provider?: string;
  sessionId?: string;
  sessionKey?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
};

type TraceSpan = {
  traceId?: string;
  sessionKey?: string;
  kind?: string;
  name?: string;
  toolName?: string;
  toolParams?: {
    command?: string;
  };
  startMs?: number;
  endMs?: number;
  durationMs?: number;
  model?: string;
  tokensIn?: number;
  tokensOut?: number;
  attributes?: {
    totalTokens?: number;
  };
};

type TraceAccumulator = {
  traceId: string;
  sessionKey: string;
  startedAtMs: number;
  endedAtMs: number;
  llmCalls: number;
  toolCalls: number;
  totalTokens: number;
  models: Set<string>;
  signals: Set<string>;
  mutatingBoundaries: Set<string>;
  hasAnySpanWithoutEnd: boolean;
  lastObservedMs: number;
};

const HOME_DIR = process.env.HOME ?? '/Users/songrenchu';
const DEFAULT_OPENCLAW_PATH = path.join(HOME_DIR, '.openclaw');
const DEFAULT_WORKSPACE_PATH = path.join(HOME_DIR, 'ClawWork');

function compactText(value: string | null | undefined, max = 220): string {
  if (!value) {
    return '';
  }
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) {
    return normalized;
  }
  return `${normalized.slice(0, max - 1)}…`;
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return 0;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function readJsonLines<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const lines = raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const parsed: T[] = [];
    for (const line of lines) {
      try {
        parsed.push(JSON.parse(line) as T);
      } catch {
        // Keep import resilient to partial/corrupt rows.
      }
    }
    return parsed;
  } catch {
    return [];
  }
}

async function listJsonlFiles(directoryPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.jsonl'))
      .map((entry) => path.join(directoryPath, entry.name))
      .sort();
  } catch {
    return [];
  }
}

function deriveInstructionPath(payloadMessage: string | undefined, workspacePath: string): string | null {
  if (!payloadMessage) {
    return null;
  }
  const match = payloadMessage.match(/\b(?:read|Read)\s+([^\s]+\.(?:md|txt|json))/);
  if (!match) {
    return null;
  }

  const rawPath = match[1].trim();
  if (rawPath.startsWith('~')) {
    return path.join(HOME_DIR, rawPath.slice(1));
  }
  if (path.isAbsolute(rawPath)) {
    return rawPath;
  }
  return path.join(workspacePath, rawPath);
}

function inferGoals(...sources: Array<string | null | undefined>): string[] {
  const text = sources
    .filter((value): value is string => Boolean(value))
    .join('\n')
    .toLowerCase();

  const goals: string[] = [];
  if (/seo|blog|content/.test(text)) {
    goals.push('Scale SEO content output while keeping daily operator time close to zero.');
  }
  if (/news|trend|intelligence/.test(text)) {
    goals.push('Continuously ingest fresh market signals and turn them into publishable outputs.');
  }
  if (/image|cover|hero/.test(text)) {
    goals.push('Guarantee image asset quality so publish/deploy steps never ship broken visuals.');
  }
  if (/git|commit|push/.test(text)) {
    goals.push('Keep every generated artifact versioned so rollback and audit stay deterministic.');
  }
  if (/deploy|vercel|production/.test(text)) {
    goals.push('Automate production deployment with explicit verification gates before side effects.');
  }

  if (!goals.length) {
    goals.push('Reduce repeated workflow failures and restore operator confidence in autonomous runs.');
  }

  return goals.slice(0, 4);
}

function detectFailureThemes(runs: CronRun[]): string[] {
  const counters: Record<string, number> = {
    cover_image_generation: 0,
    deployment: 0,
    timeout_or_latency: 0,
    data_fetch: 0,
    git_or_repo: 0,
  };

  for (const run of runs) {
    const text = `${run.error ?? ''} ${run.summary ?? ''}`.toLowerCase();
    const isFailureLike = run.status === 'error' || /fail|error|timeout|corrupt|broken/.test(text);
    if (!isFailureLike) {
      continue;
    }

    if (/cover|image|hero|png|jpeg|asset/.test(text)) {
      counters.cover_image_generation += 1;
    }
    if (/deploy|vercel|build/.test(text)) {
      counters.deployment += 1;
    }
    if (/timeout|latency|timed out/.test(text)) {
      counters.timeout_or_latency += 1;
    }
    if (/fetch|rss|news|http|network/.test(text)) {
      counters.data_fetch += 1;
    }
    if (/git|commit|push|repository/.test(text)) {
      counters.git_or_repo += 1;
    }
  }

  return Object.entries(counters)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([theme]) => theme)
    .slice(0, 3);
}

function detectMutatingBoundaries(instructionText: string | null): string[] {
  if (!instructionText) {
    return [];
  }

  const text = instructionText.toLowerCase();
  const boundaries: string[] = [];
  if (/sitemap/.test(text)) {
    boundaries.push('sitemap_update');
  }
  if (/git|commit|push/.test(text)) {
    boundaries.push('git_push');
  }
  if (/deploy|vercel/.test(text)) {
    boundaries.push('deploy_to_production');
  }
  if (/cover|image|hero/.test(text)) {
    boundaries.push('cover_image_publish');
  }

  return boundaries;
}

function signalsFromTraceSpan(span: TraceSpan): { signals: string[]; mutatingBoundaries: string[] } {
  const text = `${span.name ?? ''} ${span.toolName ?? ''} ${span.toolParams?.command ?? ''} ${span.sessionKey ?? ''}`.toLowerCase();
  const signals: string[] = [];
  const mutatingBoundaries: string[] = [];

  if (/moltbook/.test(text)) {
    signals.push('moltbook_engagement');
    mutatingBoundaries.push('external_posting');
  }
  if (/seo|blog|hn\.algolia|public\/blogs|sitemap/.test(text)) {
    signals.push('seo_content');
  }
  if (/cover|image|png|jpg|jpeg|nano-banana|generate_image/.test(text)) {
    signals.push('image_generation');
    mutatingBoundaries.push('cover_image_publish');
  }
  if (/video|ffmpeg|youtube|faceless_videos/.test(text)) {
    signals.push('video_generation');
  }
  if (/telegram|message send --channel telegram/.test(text)) {
    signals.push('telegram_ops');
  }
  if (/vercel|deploy/.test(text)) {
    signals.push('deployment');
    mutatingBoundaries.push('deploy_to_production');
  }
  if (/git add|git commit|git push/.test(text)) {
    mutatingBoundaries.push('git_push');
  }
  if (/sitemap/.test(text)) {
    mutatingBoundaries.push('sitemap_update');
  }

  return {
    signals: unique(signals),
    mutatingBoundaries: unique(mutatingBoundaries),
  };
}

function inferWorkflowFromTrajectory(trajectory: WorkflowTrajectory): {
  id: string;
  name: string;
  scheduleLabel: string;
  inferredGoals: string[];
  failureThemes: string[];
} {
  const signals = new Set(trajectory.signals);
  const sessionKey = trajectory.sessionKey;

  if (signals.has('moltbook_engagement')) {
    return {
      id: 'inferred-moltbook-engagement',
      name: 'Moltbook Engagement',
      scheduleLabel: 'event-driven (heartbeat/inferred)',
      inferredGoals: ['Maintain social engagement workflow quality while keeping external posting actions verifiable.'],
      failureThemes: [],
    };
  }

  if (signals.has('video_generation')) {
    return {
      id: 'inferred-video-generation',
      name: 'Video Generation',
      scheduleLabel: 'event-driven (inferred)',
      inferredGoals: ['Automate video asset generation with deterministic execution and output verification.'],
      failureThemes: [],
    };
  }

  if (signals.has('seo_content')) {
    return {
      id: 'inferred-seo-content',
      name: 'SEO Content Operations (Ad-hoc)',
      scheduleLabel: 'event-driven (inferred)',
      inferredGoals: ['Scale SEO content throughput while preserving deploy and quality gates.'],
      failureThemes: [],
    };
  }

  if (signals.has('image_generation')) {
    return {
      id: 'inferred-image-generation',
      name: 'Image Generation',
      scheduleLabel: 'event-driven (inferred)',
      inferredGoals: ['Guarantee generated image assets are valid before any publish boundary.'],
      failureThemes: ['cover_image_generation'],
    };
  }

  if (signals.has('deployment')) {
    return {
      id: 'inferred-deployment-ops',
      name: 'Deployment Operations',
      scheduleLabel: 'event-driven (inferred)',
      inferredGoals: ['Protect production deploy steps with explicit verification and rollback-safe controls.'],
      failureThemes: ['deployment'],
    };
  }

  if (signals.has('telegram_ops') || sessionKey.includes(':telegram:')) {
    return {
      id: 'inferred-telegram-ops',
      name: 'Telegram Operations',
      scheduleLabel: 'event-driven (inferred)',
      inferredGoals: ['Keep Telegram-facing agent tasks observable and policy-aligned.'],
      failureThemes: [],
    };
  }

  if (sessionKey.includes(':subagent:')) {
    return {
      id: 'inferred-subagent-ops',
      name: 'Subagent Operations',
      scheduleLabel: 'event-driven (inferred)',
      inferredGoals: ['Track delegated subagent executions and prevent silent drift.'],
      failureThemes: [],
    };
  }

  return {
    id: 'inferred-main-ops',
    name: 'Main Session Operations',
    scheduleLabel: 'event-driven (inferred)',
    inferredGoals: ['Observe non-cron agent trajectories and promote stable patterns into explicit workflows.'],
    failureThemes: [],
  };
}

function buildRecommendations(input: {
  tracingEnabled: boolean;
  configAuditEnabled: boolean;
  configChanges7d: number;
  runs7d: CronRun[];
  failureThemes: string[];
  mutatingBoundaries: string[];
}): WorkflowRecommendation[] {
  const recommendations: WorkflowRecommendation[] = [];

  const failCount = input.runs7d.filter((run) => run.status === 'error').length;
  const totalRuns = input.runs7d.length;
  const failRate = totalRuns > 0 ? failCount / totalRuns : 0;

  recommendations.push({
    id: 'trace-capture',
    label: 'Trace Interception Coverage',
    detail:
      input.tracingEnabled
        ? 'OpenClaw tracing plugin is already enabled. Keep this as the canonical runtime interception path for LLM/tool calls.'
        : 'Enable the OpenClaw tracing plugin so every LLM/tool call can be intercepted and attached to workflow trajectories.',
    suggestedSetting: 'plugins.allow += openclaw-tracing',
    severity: 'high',
    status: input.tracingEnabled ? 'already_enabled' : 'recommended',
  });

  recommendations.push({
    id: 'state-time-machine',
    label: 'State Time Machine Snapshot Pack',
    detail:
      input.configAuditEnabled
        ? `Config audit is present (${input.configChanges7d} config changes in 7d). Add file-level snapshots for AGENTS/MEMORY/SOUL/instructions per run to complete run-correlated drift diffs.`
        : 'No config audit stream detected. Capture run-level state snapshots (config + instructions + memory files + plugin set) to explain drift regressions.',
    suggestedSetting: 'snapshot.onRunStart = [config, AGENTS.md, MEMORY.md, SOUL.md, workflow instructions, plugins]',
    severity: 'high',
    status: input.configAuditEnabled ? 'partially_enabled' : 'recommended',
  });

  if (input.failureThemes.includes('cover_image_generation')) {
    recommendations.push({
      id: 'image-verifier-gate',
      label: 'Cover Image Verification Gate',
      detail:
        'Repeated image-related failures detected. Add a hard verifier (exists, valid PNG/JPEG signature, minimum bytes) before any mutating publish/deploy step.',
      suggestedSetting: 'verifier.cover_image = required; policy.onCoverImageFail = block_publish',
      severity: 'high',
      status: 'recommended',
    });
  }

  if (input.mutatingBoundaries.length > 0) {
    recommendations.push({
      id: 'mutating-boundary-policy',
      label: 'Mutating Boundary Approval Policy',
      detail:
        `Workflow contains high-risk boundaries (${input.mutatingBoundaries.join(', ')}). Bind deterministic checks before each mutating operation to prevent bad side effects.`,
      suggestedSetting: 'control.pre_action = verifier_pass && contract_match',
      severity: 'high',
      status: 'recommended',
    });
  }

  if (failRate >= 0.2 || failCount >= 2) {
    recommendations.push({
      id: 'alert-policy',
      label: 'Reliability Alert Policy',
      detail:
        'Current failure pattern is high enough to require proactive alerting. Alert on consecutive failures, token spikes, and unusually long run duration.',
      suggestedSetting: 'alert.when(consecutive_errors>=2 OR success_rate_7d<0.8 OR duration_ms>p95*1.5)',
      severity: 'medium',
      status: 'recommended',
    });

    recommendations.push({
      id: 'incident-to-eval',
      label: 'Incident to Regression Eval Promotion',
      detail:
        'Promote recent failing trajectories into a golden regression set so repeated mistakes are blocked before the next daily run.',
      suggestedSetting: 'eval.promote_failed_runs = true; release_gate.requires_eval_pass = true',
      severity: 'medium',
      status: 'recommended',
    });
  }

  return recommendations.slice(0, 6);
}

function statusToTrustState(input: {
  totalRuns: number;
  failCount: number;
  latestStatus: string | null;
  consecutiveErrors: number;
}): { trustState: DiscoveryTrustState; reason: string } {
  const { totalRuns, failCount, latestStatus, consecutiveErrors } = input;
  if (totalRuns === 0) {
    return {
      trustState: 'awaiting_confirmation',
      reason: 'No recent runs captured yet. Waiting for first reliable baseline.',
    };
  }

  const failRate = failCount / totalRuns;

  if (consecutiveErrors >= 2 || failRate >= 0.5) {
    return {
      trustState: 'blocked',
      reason: `Failure pressure is high (${failCount}/${totalRuns} failed). Intervention recommended before next mutating run.`,
    };
  }

  if (latestStatus === 'error' || failRate >= 0.2) {
    return {
      trustState: 'at_risk',
      reason: `Recent reliability is unstable (${failCount}/${totalRuns} failed). Add stronger control points.`,
    };
  }

  return {
    trustState: 'healthy',
    reason: `Recent reliability is stable (${totalRuns - failCount}/${totalRuns} successful).`,
  };
}

function formatSchedule(job: CronJob): string {
  const schedule = job.schedule;
  if (!schedule) {
    return 'No schedule configured';
  }
  if (schedule.kind === 'cron' && schedule.expr) {
    return `cron: ${schedule.expr}`;
  }
  if (schedule.expr) {
    return schedule.expr;
  }
  return schedule.kind ?? 'Scheduled';
}

function toTrajectory(acc: TraceAccumulator, nowMs: number): WorkflowTrajectory {
  const durationMs = Math.max(0, (acc.endedAtMs || acc.lastObservedMs) - acc.startedAtMs);
  const running = acc.hasAnySpanWithoutEnd && nowMs - acc.lastObservedMs < 30 * 60 * 1000;

  return {
    traceId: acc.traceId,
    sessionKey: acc.sessionKey,
    startedAtMs: acc.startedAtMs,
    endedAtMs: acc.endedAtMs || acc.lastObservedMs,
    durationMs,
    llmCalls: acc.llmCalls,
    toolCalls: acc.toolCalls,
    totalTokens: acc.totalTokens,
    models: Array.from(acc.models).sort(),
    signals: Array.from(acc.signals).sort(),
    mutatingBoundaries: Array.from(acc.mutatingBoundaries).sort(),
    status: running ? 'running' : 'completed',
  };
}

function aggregateModelUsage(runs: CronRun[], trajectories: WorkflowTrajectory[]): Array<{ model: string; count: number }> {
  const counts = new Map<string, number>();

  for (const run of runs) {
    if (run.model) {
      counts.set(run.model, (counts.get(run.model) ?? 0) + 1);
    }
  }

  for (const trajectory of trajectories) {
    for (const model of trajectory.models) {
      counts.set(model, (counts.get(model) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([model, count]) => ({ model, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export async function loadOpenClawDiscoverySnapshot(): Promise<OpenClawDiscoverySnapshot> {
  const nowMs = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const windowStartMs = nowMs - sevenDaysMs;

  const openclawPath = DEFAULT_OPENCLAW_PATH;
  const warnings: string[] = [];

  const openclawConfig = await readJsonFile<Record<string, unknown>>(path.join(openclawPath, 'openclaw.json'));

  const configuredWorkspacePath =
    typeof openclawConfig?.workspace === 'object' && openclawConfig.workspace !== null
      ? (openclawConfig.workspace as { path?: string }).path ?? null
      : null;

  const workspacePath = configuredWorkspacePath && configuredWorkspacePath.length > 0
    ? configuredWorkspacePath
    : DEFAULT_WORKSPACE_PATH;

  const jobsFilePath = path.join(openclawPath, 'cron', 'jobs.json');
  const jobsFile = await readJsonFile<CronJobsFile>(jobsFilePath);
  const jobs = jobsFile?.jobs ?? [];

  const runsByJob = new Map<string, CronRun[]>();
  const allRuns: CronRun[] = [];

  for (const job of jobs) {
    const runFilePath = path.join(openclawPath, 'cron', 'runs', `${job.id}.jsonl`);
    const runs = await readJsonLines<CronRun>(runFilePath);
    const sortedRuns = runs
      .filter((run) => typeof run.runAtMs === 'number')
      .sort((a, b) => toNumber(a.runAtMs) - toNumber(b.runAtMs));

    runsByJob.set(job.id, sortedRuns);
    allRuns.push(...sortedRuns);
  }

  const traceFiles = await listJsonlFiles(path.join(openclawPath, 'traces'));
  const traceAccumulators = new Map<string, TraceAccumulator>();

  for (const traceFile of traceFiles) {
    const spans = await readJsonLines<TraceSpan>(traceFile);

    for (const span of spans) {
      if (!span.traceId || !span.sessionKey || !span.startMs) {
        continue;
      }

      const key = `${span.sessionKey}::${span.traceId}`;
      const startMs = toNumber(span.startMs);
      const endMs = toNumber(span.endMs);
      const observedEnd = endMs > 0 ? endMs : startMs;
      const inferred = signalsFromTraceSpan(span);

      const existing = traceAccumulators.get(key);
      if (!existing) {
        traceAccumulators.set(key, {
          traceId: span.traceId,
          sessionKey: span.sessionKey,
          startedAtMs: startMs,
          endedAtMs: observedEnd,
          llmCalls: span.kind === 'llm_call' ? 1 : 0,
          toolCalls: span.kind === 'tool_call' ? 1 : 0,
          totalTokens: Math.max(
            0,
            toNumber(span.attributes?.totalTokens) || toNumber(span.tokensIn) + toNumber(span.tokensOut),
          ),
          models: span.model ? new Set([span.model]) : new Set(),
          signals: new Set(inferred.signals),
          mutatingBoundaries: new Set(inferred.mutatingBoundaries),
          hasAnySpanWithoutEnd: !span.endMs,
          lastObservedMs: Math.max(startMs, observedEnd),
        });
        continue;
      }

      existing.startedAtMs = Math.min(existing.startedAtMs, startMs);
      existing.endedAtMs = Math.max(existing.endedAtMs, observedEnd);
      existing.lastObservedMs = Math.max(existing.lastObservedMs, startMs, observedEnd);
      existing.llmCalls += span.kind === 'llm_call' ? 1 : 0;
      existing.toolCalls += span.kind === 'tool_call' ? 1 : 0;
      existing.totalTokens += Math.max(
        0,
        toNumber(span.attributes?.totalTokens) || toNumber(span.tokensIn) + toNumber(span.tokensOut),
      );
      if (span.model) {
        existing.models.add(span.model);
      }
      for (const signal of inferred.signals) {
        existing.signals.add(signal);
      }
      for (const boundary of inferred.mutatingBoundaries) {
        existing.mutatingBoundaries.add(boundary);
      }
      if (!span.endMs) {
        existing.hasAnySpanWithoutEnd = true;
      }
    }
  }

  const trajectories = Array.from(traceAccumulators.values()).map((acc) => toTrajectory(acc, nowMs));

  const configAuditPath = path.join(openclawPath, 'logs', 'config-audit.jsonl');
  const configAuditRows = await readJsonLines<{ ts?: string }>(configAuditPath);
  const configChanges7d = configAuditRows.filter((row) => {
    if (!row.ts) {
      return false;
    }
    const tsMs = Date.parse(row.ts);
    return Number.isFinite(tsMs) && tsMs >= windowStartMs;
  }).length;

  const stateFiles = [
    path.join(workspacePath, 'AGENTS.md'),
    path.join(workspacePath, 'MEMORY.md'),
    path.join(workspacePath, 'SOUL.md'),
    path.join(workspacePath, 'HEARTBEAT.md'),
  ];

  const versionedStateFiles: OpenClawDiscoverySnapshot['versioning']['stateFiles'] = [];
  for (const filePath of stateFiles) {
    try {
      const stat = await fs.stat(filePath);
      versionedStateFiles.push({
        filePath,
        exists: true,
        fileSizeBytes: stat.size,
        modifiedAtMs: stat.mtimeMs,
      });
    } catch {
      versionedStateFiles.push({
        filePath,
        exists: false,
        fileSizeBytes: null,
        modifiedAtMs: null,
      });
    }
  }

  const tracingEnabled = Array.isArray((openclawConfig?.plugins as { allow?: string[] } | undefined)?.allow)
    ? ((openclawConfig?.plugins as { allow?: string[] }).allow ?? []).includes('openclaw-tracing')
    : false;

  const gatewayMode =
    typeof openclawConfig?.gateway === 'object' && openclawConfig.gateway !== null
      ? ((openclawConfig.gateway as { mode?: string }).mode ?? null)
      : null;

  const primaryModel =
    typeof openclawConfig?.agents === 'object' && openclawConfig.agents !== null
      ? (
          (openclawConfig.agents as { defaults?: { model?: { primary?: string } } }).defaults?.model?.primary ?? null
        )
      : null;

  const heartbeatEvery =
    typeof openclawConfig?.agents === 'object' && openclawConfig.agents !== null
      ? (
          (openclawConfig.agents as { defaults?: { heartbeat?: { every?: string } } }).defaults?.heartbeat?.every ?? null
        )
      : null;

  const enabledPlugins = Array.isArray((openclawConfig?.plugins as { allow?: string[] } | undefined)?.allow)
    ? ((openclawConfig?.plugins as { allow?: string[] }).allow ?? [])
    : [];

  if (!jobs.length) {
    warnings.push('No cron workflows discovered in ~/.openclaw/cron/jobs.json.');
  }

  if (!trajectories.length) {
    warnings.push('No trajectory traces discovered under ~/.openclaw/traces.');
  }

  const workflows: WorkflowDiscovery[] = [];
  const assignedTrajectoryKeys = new Set<string>();

  for (const job of jobs) {
    const allJobRuns = runsByJob.get(job.id) ?? [];
    const runs7d = allJobRuns.filter((run) => toNumber(run.runAtMs) >= windowStartMs);
    const success = runs7d.filter((run) => run.status === 'ok').length;
    const failed = runs7d.filter((run) => run.status === 'error').length;
    const unknown = runs7d.length - success - failed;

    const latestRun = allJobRuns.length ? allJobRuns[allJobRuns.length - 1] : null;

    const trust = statusToTrustState({
      totalRuns: runs7d.length,
      failCount: failed,
      latestStatus: latestRun?.status ?? null,
      consecutiveErrors: toNumber(job.state?.consecutiveErrors),
    });

    const instructionPath = deriveInstructionPath(job.payload?.message, workspacePath);
    const instructionExists = instructionPath ? await fileExists(instructionPath) : false;
    const failureThemes = detectFailureThemes(runs7d);
    const mutatingBoundaries = detectMutatingBoundaries(`${job.payload?.message ?? ''} ${latestRun?.summary ?? ''}`);

    const trajectoriesForWorkflow = trajectories
      .filter((trajectory) => trajectory.sessionKey.includes(`:cron:${job.id}`))
      .sort((a, b) => b.startedAtMs - a.startedAtMs);
    for (const trajectory of trajectoriesForWorkflow) {
      assignedTrajectoryKeys.add(`${trajectory.sessionKey}::${trajectory.traceId}`);
    }

    const recommendations = buildRecommendations({
      tracingEnabled,
      configAuditEnabled: configAuditRows.length > 0,
      configChanges7d,
      runs7d,
      failureThemes,
      mutatingBoundaries,
    });

    const tokenStats7d = runs7d.reduce(
      (acc, run) => {
        const input = toNumber(run.usage?.input_tokens);
        const output = toNumber(run.usage?.output_tokens);
        const total = toNumber(run.usage?.total_tokens) || input + output;

        acc.input += input;
        acc.output += output;
        acc.total += total;
        return acc;
      },
      { input: 0, output: 0, total: 0 },
    );

    if (!tokenStats7d.total) {
      tokenStats7d.total = trajectoriesForWorkflow
        .filter((trajectory) => trajectory.startedAtMs >= windowStartMs)
        .reduce((sum, trajectory) => sum + trajectory.totalTokens, 0);
    }

    const name = job.name && job.name.trim().length ? job.name : `workflow-${job.id.slice(0, 8)}`;

    workflows.push({
      id: job.id,
      name,
      enabled: Boolean(job.enabled),
      scheduleLabel: formatSchedule(job),
      trustState: trust.trustState,
      trustReason: trust.reason,
      instructionPath,
      instructionExists,
      inferredGoals: inferGoals(job.name, job.payload?.message, latestRun?.summary),
      failureThemes,
      runStats7d: {
        total: runs7d.length,
        success,
        failed,
        unknown,
        successRate: runs7d.length ? success / runs7d.length : 0,
      },
      tokenStats7d,
      modelUsage: aggregateModelUsage(runs7d, trajectoriesForWorkflow),
      latestRun: latestRun
        ? {
            status: latestRun.status ?? 'unknown',
            atMs: toNumber(latestRun.runAtMs),
            durationMs: toNumber(latestRun.durationMs),
            summary: compactText(latestRun.summary ?? latestRun.error ?? 'No summary'),
          }
        : null,
      trajectories: trajectoriesForWorkflow.slice(0, 12),
      recommendations,
      mutatingBoundaries,
    });
  }

  const inferredBuckets = new Map<
    string,
    {
      id: string;
      name: string;
      scheduleLabel: string;
      inferredGoals: string[];
      failureThemes: string[];
      trajectories: WorkflowTrajectory[];
    }
  >();

  for (const trajectory of trajectories) {
    const key = `${trajectory.sessionKey}::${trajectory.traceId}`;
    if (assignedTrajectoryKeys.has(key)) {
      continue;
    }

    const inferredWorkflow = inferWorkflowFromTrajectory(trajectory);
    const existing = inferredBuckets.get(inferredWorkflow.id);
    if (!existing) {
      inferredBuckets.set(inferredWorkflow.id, {
        ...inferredWorkflow,
        trajectories: [trajectory],
      });
      continue;
    }

    existing.trajectories.push(trajectory);
    existing.inferredGoals = unique([...existing.inferredGoals, ...inferredWorkflow.inferredGoals]);
    existing.failureThemes = unique([...existing.failureThemes, ...inferredWorkflow.failureThemes]);
  }

  for (const bucket of inferredBuckets.values()) {
    const recentTrajectories = bucket.trajectories
      .filter((trajectory) => trajectory.startedAtMs >= windowStartMs)
      .sort((a, b) => b.startedAtMs - a.startedAtMs);

    if (!recentTrajectories.length) {
      continue;
    }

    const tokenTotal = recentTrajectories.reduce((sum, trajectory) => sum + trajectory.totalTokens, 0);
    const mutatingBoundaries = unique(recentTrajectories.flatMap((trajectory) => trajectory.mutatingBoundaries));
    const latestTrajectory = recentTrajectories[0];

    const recommendations = buildRecommendations({
      tracingEnabled,
      configAuditEnabled: configAuditRows.length > 0,
      configChanges7d,
      runs7d: [],
      failureThemes: bucket.failureThemes,
      mutatingBoundaries,
    });

    workflows.push({
      id: bucket.id,
      name: bucket.name,
      enabled: true,
      scheduleLabel: bucket.scheduleLabel,
      trustState: 'partially_verified',
      trustReason:
        'This workflow is inferred from trace trajectories (non-cron). Enable explicit Cron/Heartbeat contracts for stronger determinism.',
      instructionPath: null,
      instructionExists: false,
      inferredGoals: bucket.inferredGoals,
      failureThemes: bucket.failureThemes,
      runStats7d: {
        total: recentTrajectories.length,
        success: 0,
        failed: 0,
        unknown: recentTrajectories.length,
        successRate: 0,
      },
      tokenStats7d: {
        total: tokenTotal,
        input: 0,
        output: 0,
      },
      modelUsage: aggregateModelUsage([], recentTrajectories),
      latestRun: {
        status: latestTrajectory.status,
        atMs: latestTrajectory.startedAtMs,
        durationMs: latestTrajectory.durationMs,
        summary: compactText(
          latestTrajectory.signals.length
            ? `Inferred from trajectory signals: ${latestTrajectory.signals.join(', ')}`
            : 'Inferred from non-cron trajectory telemetry.',
        ),
      },
      trajectories: recentTrajectories.slice(0, 12),
      recommendations,
      mutatingBoundaries,
    });
  }

  if (workflows.length > jobs.length) {
    warnings.push(
      `Discovered ${workflows.length - jobs.length} additional inferred workflow group(s) from non-cron trajectories.`,
    );
  }

  const runsLast7d =
    allRuns.filter((run) => toNumber(run.runAtMs) >= windowStartMs).length +
    workflows
      .filter((workflow) => workflow.id.startsWith('inferred-'))
      .reduce((sum, workflow) => sum + workflow.runStats7d.total, 0);
  const trajectoriesLast7d = trajectories.filter((trajectory) => trajectory.startedAtMs >= windowStartMs).length;
  const activeTrajectories = trajectories.filter((trajectory) => trajectory.status === 'running').length;

  const tokensLast7d = workflows.reduce((sum, workflow) => sum + workflow.tokenStats7d.total, 0);

  const modelsUsed = unique(
    workflows
      .flatMap((workflow) => workflow.modelUsage.map((item) => item.model))
      .filter((value) => value.length > 0),
  ).sort();

  const inferredPortfolioGoals = unique(workflows.flatMap((workflow) => workflow.inferredGoals)).slice(0, 6);

  const openclawExists = await fileExists(openclawPath);
  const workspaceExists = await fileExists(workspacePath);

  let importHealth: OpenClawDiscoverySnapshot['importHealth'] = 'connected';
  if (!openclawExists || !workspaceExists) {
    importHealth = 'disconnected';
  } else if (warnings.length > 0) {
    importHealth = 'partial';
  }

  return {
    generatedAtMs: nowMs,
    openclawPath,
    workspacePath,
    importHealth,
    warnings,
    runtime: {
      primaryModel,
      heartbeatEvery,
      tracingPluginEnabled: tracingEnabled,
      enabledPlugins,
      gatewayMode,
    },
    versioning: {
      configAuditEnabled: configAuditRows.length > 0,
      configChanges7d,
      stateFiles: versionedStateFiles,
    },
    metrics: {
      workflowCount: workflows.length,
      runsLast7d,
      trajectoriesLast7d,
      activeTrajectories,
      tokensLast7d,
      modelsUsed,
    },
    inferredPortfolioGoals,
    workflows,
  };
}
