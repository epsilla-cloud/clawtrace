import { promises as fs } from 'node:fs';
import os from 'node:os';
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
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  models: string[];
  signals: string[];
  mutatingBoundaries: string[];
  costModel: string | null;
  estimatedCostUsd: number;
  resultStatus: 'success' | 'failure' | 'running' | 'unknown';
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
  costStats7d: {
    totalUsd: number;
    avgPerRunUsd: number;
    avgPerSuccessUsd: number | null;
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
    estimatedCostUsdLast7d: number;
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
  costUsd?: number;
  cost_usd?: number;
  cost?: number | { usd?: number; total?: number };
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
};

type TraceSpan = {
  traceId?: string;
  spanId?: string;
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

type TraceGroup = {
  traceId: string;
  sessionKey: string;
  spans: TraceSpan[];
  lastObservedMs: number;
};

const HOME_DIR = process.env.HOME ?? os.homedir() ?? '';
const DEFAULT_OPENCLAW_PATH = path.join(HOME_DIR, '.openclaw');
const DEFAULT_WORKSPACE_PATH = path.join(HOME_DIR, 'ClawWork');
const DEFAULT_COST_PER_1K_INPUT_USD = 0.003;
const DEFAULT_COST_PER_1K_OUTPUT_USD = 0.010;
type ModelCostEntry = { input: number; output: number }; // USD per 1K tokens
const MODEL_COST_PER_1K_TOKENS_USD: Record<string, ModelCostEntry> = {
  // Anthropic
  'claude-opus-4-6':      { input: 0.005,    output: 0.025   },
  'claude-opus-4-5':      { input: 0.005,    output: 0.025   },
  'claude-opus-4-1':      { input: 0.015,    output: 0.075   },
  'claude-opus-4':        { input: 0.015,    output: 0.075   },
  'claude-sonnet-4-6':    { input: 0.003,    output: 0.015   },
  'claude-sonnet-4':      { input: 0.003,    output: 0.015   },
  'claude-haiku-4-5':     { input: 0.001,    output: 0.005   },
  // OpenAI GPT-5.x
  'gpt-5.4':              { input: 0.0025,   output: 0.015   },
  'gpt-5.4-mini':         { input: 0.00075,  output: 0.0045  },
  'gpt-5.2':              { input: 0.00175,  output: 0.014   },
  'gpt-5':                { input: 0.00125,  output: 0.010   },
  'gpt-5-mini':           { input: 0.00025,  output: 0.002   },
  // OpenAI GPT-4.x
  'gpt-4.1':              { input: 0.002,    output: 0.008   },
  'gpt-4.1-mini':         { input: 0.0004,   output: 0.0016  },
  'gpt-4.1-nano':         { input: 0.0001,   output: 0.0004  },
  'gpt-4o':               { input: 0.0025,   output: 0.010   },
  'gpt-4o-mini':          { input: 0.00015,  output: 0.0006  },
  // OpenAI reasoning
  'o4-mini':              { input: 0.0011,   output: 0.0044  },
  'o3':                   { input: 0.002,    output: 0.008   },
  'o3-mini':              { input: 0.0011,   output: 0.0044  },
  // Google Gemini
  'gemini-3.1-pro-preview': { input: 0.002,  output: 0.012   },
  'gemini-3-flash-preview': { input: 0.0005, output: 0.003   },
  'gemini-2.5-pro':       { input: 0.00125,  output: 0.010   },
  'gemini-2.5-flash':     { input: 0.0003,   output: 0.0025  },
  'gemini-2.0-flash':     { input: 0.0001,   output: 0.0004  },
  // DeepSeek
  'deepseek-chat':        { input: 0.00028,  output: 0.00042 },
  'deepseek-reasoner':    { input: 0.00028,  output: 0.00042 },
  // Mistral
  'mistral-large':        { input: 0.002,    output: 0.006   },
  'mistral-small':        { input: 0.0002,   output: 0.0006  },
  // Chinese vendors
  'qwen3-max':            { input: 0.00078,  output: 0.0039  },
  'qwen3.6-plus':         { input: 0.000325, output: 0.00195 },
  'glm-5.1':              { input: 0.00126,  output: 0.00396 },
  'glm-5':                { input: 0.00072,  output: 0.0023  },
  'kimi-k2.5':            { input: 0.000383, output: 0.00172 },
  'ernie-5':              { input: 0.00083,  output: 0.00333 },
  // Open source
  'llama-3.3-70b':        { input: 0.00059,  output: 0.00079 },
  'llama-3.1-8b':         { input: 0.00005,  output: 0.00008 },
};

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

function roundUsd(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function normalizeModel(model: string | null | undefined): string | null {
  if (!model) {
    return null;
  }
  const normalized = model.trim().toLowerCase();
  return normalized.length ? normalized : null;
}

function estimateCostUsdFromTokens(
  tokens: number,
  model: string | null | undefined,
  inputTokens = 0,
  outputTokens = 0,
): number {
  const normalizedModel = normalizeModel(model);
  const entry = normalizedModel ? MODEL_COST_PER_1K_TOKENS_USD[normalizedModel] : undefined;
  if (entry && (inputTokens > 0 || outputTokens > 0)) {
    // Use separate input/output pricing when token breakdown is available
    return roundUsd(
      (Math.max(inputTokens, 0) / 1000) * entry.input +
      (Math.max(outputTokens, 0) / 1000) * entry.output,
    );
  }
  // Fallback: blended rate using total tokens
  const blendedRate = entry
    ? (entry.input + entry.output) / 2
    : (DEFAULT_COST_PER_1K_INPUT_USD + DEFAULT_COST_PER_1K_OUTPUT_USD) / 2;
  return roundUsd((Math.max(tokens, 0) / 1000) * blendedRate);
}

function extractRunCostUsd(run: CronRun): number {
  const direct = toNumber(run.costUsd) || toNumber(run.cost_usd);
  if (direct > 0) {
    return roundUsd(direct);
  }
  if (typeof run.cost === 'number') {
    return roundUsd(toNumber(run.cost));
  }
  if (typeof run.cost === 'object' && run.cost !== null) {
    const nested = toNumber((run.cost as { usd?: number; total?: number }).usd) || toNumber((run.cost as { usd?: number; total?: number }).total);
    if (nested > 0) {
      return roundUsd(nested);
    }
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
  estimatedCostUsd7d?: number;
  successRuns7d?: number;
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

  const estimatedCostUsd7d = toNumber(input.estimatedCostUsd7d);
  const successRuns7d = toNumber(input.successRuns7d);
  if (estimatedCostUsd7d > 0 && (successRuns7d === 0 || estimatedCostUsd7d / Math.max(successRuns7d, 1) > 0.15)) {
    recommendations.push({
      id: 'cost-budget-guard',
      label: 'Cost Guardrail and Budget Alerts',
      detail:
        'Cost per successful run is elevated. Add step-level token budget alerts and block retries that repeat the same high-cost behavior.',
      suggestedSetting: 'budget.when(cost_per_success_usd > target OR token_spike > p95*1.5)',
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

function extractSpanTotalTokens(span: TraceSpan): number {
  return Math.max(
    0,
    toNumber(span.attributes?.totalTokens) || toNumber(span.tokensIn) + toNumber(span.tokensOut),
  );
}

function buildTrajectoriesFromTraceGroup(
  group: TraceGroup,
  nowMs: number,
  fallbackModel: string | null,
): WorkflowTrajectory[] {
  type MergedSpan = {
    spanId: string;
    kind: string;
    startMs: number;
    endMs: number;
    hasClosed: boolean;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    model: string | null;
    signals: Set<string>;
    mutatingBoundaries: Set<string>;
  };

  const sortedSpans = [...group.spans].sort((a, b) => toNumber(a.startMs) - toNumber(b.startMs));
  const mergedBySpanId = new Map<string, MergedSpan>();
  const fallbackKeyCounts = new Map<string, number>();

  for (const span of sortedSpans) {
    const startMs = toNumber(span.startMs);
    if (startMs <= 0 || !span.kind) {
      continue;
    }

    const rawEndMs = toNumber(span.endMs);
    const inferred = signalsFromTraceSpan(span);
    const spanInputTokens = Math.max(0, toNumber(span.tokensIn));
    const spanOutputTokens = Math.max(0, toNumber(span.tokensOut));
    const spanTotalTokens = extractSpanTotalTokens(span);

    let spanKey = span.spanId ?? null;
    if (!spanKey) {
      const fallbackBase = `${span.kind}:${startMs}:${span.model ?? span.toolName ?? 'na'}`;
      const sequence = (fallbackKeyCounts.get(fallbackBase) ?? 0) + 1;
      fallbackKeyCounts.set(fallbackBase, sequence);
      spanKey = `${fallbackBase}:${sequence}`;
    }

    const existing = mergedBySpanId.get(spanKey);
    if (!existing) {
      mergedBySpanId.set(spanKey, {
        spanId: spanKey,
        kind: span.kind,
        startMs,
        endMs: rawEndMs > 0 ? rawEndMs : startMs,
        hasClosed: rawEndMs > 0,
        inputTokens: spanInputTokens,
        outputTokens: spanOutputTokens,
        totalTokens: spanTotalTokens,
        model: span.model ?? null,
        signals: new Set(inferred.signals),
        mutatingBoundaries: new Set(inferred.mutatingBoundaries),
      });
      continue;
    }

    existing.endMs = Math.max(existing.endMs, rawEndMs > 0 ? rawEndMs : startMs);
    existing.hasClosed = existing.hasClosed || rawEndMs > 0;
    existing.inputTokens = Math.max(existing.inputTokens, spanInputTokens);
    existing.outputTokens = Math.max(existing.outputTokens, spanOutputTokens);
    existing.totalTokens = Math.max(existing.totalTokens, spanTotalTokens);
    if (!existing.model && span.model) {
      existing.model = span.model;
    }
    for (const signal of inferred.signals) {
      existing.signals.add(signal);
    }
    for (const boundary of inferred.mutatingBoundaries) {
      existing.mutatingBoundaries.add(boundary);
    }
  }

  const mergedSpans = Array.from(mergedBySpanId.values()).sort((a, b) => a.startMs - b.startMs);
  const llmSpans = mergedSpans.filter((span) => span.kind === 'llm_call');
  const toolSpans = mergedSpans.filter((span) => span.kind === 'tool_call');
  if (!llmSpans.length && !toolSpans.length) {
    return [];
  }

  const startedAtMs = mergedSpans[0]?.startMs ?? 0;
  const latestObservedMs = Math.max(
    ...mergedSpans.map((span) => Math.max(span.startMs, span.endMs)),
    group.lastObservedMs || 0,
    nowMs,
  );
  const endedAtMs = Math.max(startedAtMs, latestObservedMs);
  const inputTokens = llmSpans.reduce((sum, span) => sum + span.inputTokens, 0);
  const outputTokens = llmSpans.reduce((sum, span) => sum + span.outputTokens, 0);
  const totalTokens = llmSpans.reduce((sum, span) => sum + span.totalTokens, 0);
  const models = Array.from(new Set(llmSpans.map((span) => span.model).filter(Boolean))) as string[];
  const allSignals = new Set<string>();
  const allMutatingBoundaries = new Set<string>();
  for (const span of mergedSpans) {
    for (const signal of span.signals) {
      allSignals.add(signal);
    }
    for (const boundary of span.mutatingBoundaries) {
      allMutatingBoundaries.add(boundary);
    }
  }

  const costModel = models[0] ?? fallbackModel ?? null;
  const estimatedCostUsd = estimateCostUsdFromTokens(totalTokens, costModel);
  const hasOpenLlm = llmSpans.some((span) => !span.hasClosed);
  const status: WorkflowTrajectory['status'] = hasOpenLlm ? 'running' : 'completed';
  const resultStatus: WorkflowTrajectory['resultStatus'] = hasOpenLlm ? 'running' : 'unknown';

  return [
    {
      traceId: group.traceId,
      sessionKey: group.sessionKey,
      startedAtMs,
      endedAtMs,
      durationMs: Math.max(0, endedAtMs - startedAtMs),
      llmCalls: llmSpans.length,
      toolCalls: toolSpans.length,
      inputTokens,
      outputTokens,
      totalTokens,
      models,
      signals: Array.from(allSignals).sort(),
      mutatingBoundaries: Array.from(allMutatingBoundaries).sort(),
      costModel,
      estimatedCostUsd,
      resultStatus,
      status,
    },
  ];
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
  const traceGroups = new Map<string, TraceGroup>();

  for (const traceFile of traceFiles) {
    const spans = await readJsonLines<TraceSpan>(traceFile);

    for (const span of spans) {
      if (!span.traceId || !span.sessionKey || !span.startMs) {
        continue;
      }

      const key = `${span.sessionKey}::${span.traceId}`;
      const startMs = toNumber(span.startMs);
      const observedEnd = Math.max(startMs, toNumber(span.endMs));
      const existing = traceGroups.get(key);
      if (!existing) {
        traceGroups.set(key, {
          traceId: span.traceId,
          sessionKey: span.sessionKey,
          spans: [span],
          lastObservedMs: Math.max(startMs, observedEnd),
        });
        continue;
      }

      existing.spans.push(span);
      existing.lastObservedMs = Math.max(existing.lastObservedMs, startMs, observedEnd);
    }
  }

  const trajectories = Array.from(traceGroups.values())
    .flatMap((group) => buildTrajectoriesFromTraceGroup(group, nowMs, primaryModel))
    .sort((a, b) => b.startedAtMs - a.startedAtMs);

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

    const recentRunsSorted = [...runs7d].sort((a, b) => toNumber(a.runAtMs) - toNumber(b.runAtMs));
    const trajectoriesForWorkflow = trajectories
      .filter((trajectory) => trajectory.sessionKey.includes(`:cron:${job.id}`))
      .map((trajectory) => {
        const closestRun = recentRunsSorted.reduce<CronRun | null>((best, run) => {
          const runAtMs = toNumber(run.runAtMs);
          if (!runAtMs) {
            return best;
          }
          if (!best) {
            return run;
          }
          const bestDiff = Math.abs(toNumber(best.runAtMs) - trajectory.startedAtMs);
          const candidateDiff = Math.abs(runAtMs - trajectory.startedAtMs);
          return candidateDiff < bestDiff ? run : best;
        }, null);

        const closestRunAtMs = toNumber(closestRun?.runAtMs);
        const closestDiffMs = closestRunAtMs ? Math.abs(closestRunAtMs - trajectory.startedAtMs) : Number.POSITIVE_INFINITY;
        const runStatus = closestRun?.status ?? null;
        const withinMatchWindow = closestDiffMs <= 30 * 60 * 1000;
        const resultStatus: WorkflowTrajectory['resultStatus'] =
          trajectory.status === 'running'
            ? 'running'
            : withinMatchWindow
              ? runStatus === 'error'
                ? 'failure'
                : runStatus === 'ok'
                  ? 'success'
                  : 'unknown'
              : 'unknown';

        return {
          ...trajectory,
          resultStatus,
        };
      })
      .sort((a, b) => b.startedAtMs - a.startedAtMs);
    for (const trajectory of trajectoriesForWorkflow) {
      assignedTrajectoryKeys.add(`${trajectory.sessionKey}::${trajectory.traceId}`);
    }

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

    const costTotalFromRuns = runs7d.reduce((sum, run) => {
      const explicitCost = extractRunCostUsd(run);
      if (explicitCost > 0) {
        return sum + explicitCost;
      }
      const usageTokens = toNumber(run.usage?.total_tokens) || toNumber(run.usage?.input_tokens) + toNumber(run.usage?.output_tokens);
      return sum + estimateCostUsdFromTokens(usageTokens, run.model ?? primaryModel);
    }, 0);

    const costTotalFromTrajectories = trajectoriesForWorkflow
      .filter((trajectory) => trajectory.startedAtMs >= windowStartMs)
      .reduce((sum, trajectory) => sum + trajectory.estimatedCostUsd, 0);

    const totalCostUsd7d = roundUsd(costTotalFromRuns > 0 ? costTotalFromRuns : costTotalFromTrajectories);
    const avgPerRunUsd = runs7d.length > 0 ? roundUsd(totalCostUsd7d / runs7d.length) : 0;
    const avgPerSuccessUsd = success > 0 ? roundUsd(totalCostUsd7d / success) : null;
    const recommendations = buildRecommendations({
      tracingEnabled,
      configAuditEnabled: configAuditRows.length > 0,
      configChanges7d,
      runs7d,
      failureThemes,
      mutatingBoundaries,
      estimatedCostUsd7d: totalCostUsd7d,
      successRuns7d: success,
    });

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
      costStats7d: {
        totalUsd: totalCostUsd7d,
        avgPerRunUsd,
        avgPerSuccessUsd,
      },
      modelUsage: aggregateModelUsage(runs7d, trajectoriesForWorkflow),
      latestRun: latestRun
        ? {
            status: latestRun.status ?? 'unknown',
            atMs: toNumber(latestRun.runAtMs),
            durationMs: toNumber(latestRun.durationMs),
            summary: compactText(latestRun.summary ?? latestRun.error ?? 'No summary'),
          }
        : null,
      trajectories: trajectoriesForWorkflow,
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
    const totalCostUsd = roundUsd(recentTrajectories.reduce((sum, trajectory) => sum + trajectory.estimatedCostUsd, 0));
    const mutatingBoundaries = unique(recentTrajectories.flatMap((trajectory) => trajectory.mutatingBoundaries));
    const recentTrajectoriesWithOutcome = recentTrajectories.map((trajectory) => ({
      ...trajectory,
      resultStatus: trajectory.status === 'running' ? ('running' as const) : ('success' as const),
    }));
    const latestTrajectory = recentTrajectoriesWithOutcome[0];
    const inferredCompleted = recentTrajectories.filter((trajectory) => trajectory.status === 'completed').length;
    const inferredRunning = recentTrajectories.filter((trajectory) => trajectory.status === 'running').length;
    const inferredTotal = recentTrajectories.length;

    const recommendations = buildRecommendations({
      tracingEnabled,
      configAuditEnabled: configAuditRows.length > 0,
      configChanges7d,
      runs7d: [],
      failureThemes: bucket.failureThemes,
      mutatingBoundaries,
      estimatedCostUsd7d: totalCostUsd,
      successRuns7d: 0,
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
        total: inferredTotal,
        success: inferredCompleted,
        failed: 0,
        unknown: inferredRunning,
        successRate: inferredTotal > 0 ? inferredCompleted / inferredTotal : 0,
      },
      tokenStats7d: {
        total: tokenTotal,
        input: 0,
        output: 0,
      },
      costStats7d: {
        totalUsd: totalCostUsd,
        avgPerRunUsd: roundUsd(totalCostUsd / Math.max(inferredTotal, 1)),
        avgPerSuccessUsd: null,
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
      trajectories: recentTrajectoriesWithOutcome,
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
  const estimatedCostUsdLast7d = roundUsd(workflows.reduce((sum, workflow) => sum + workflow.costStats7d.totalUsd, 0));

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
      estimatedCostUsdLast7d,
      modelsUsed,
    },
    inferredPortfolioGoals,
    workflows,
  };
}
