import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import { type ExecHost } from "../infra/exec-approvals.js";
import type { ProcessSession } from "./bash-process-registry.js";
import type { ExecToolDetails } from "./bash-tools.exec-types.js";
import type { BashSandboxConfig } from "./bash-tools.shared.js";
export { applyPathPrepend, findPathKey, normalizePathPrepend } from "../infra/path-prepend.js";
export { normalizeExecAsk, normalizeExecHost, normalizeExecSecurity, } from "../infra/exec-approvals.js";
import type { RunExit } from "../process/supervisor/types.js";
/**
 * Detect cursor key mode from PTY output chunk.
 * Uses lastIndexOf to find the *last* toggle in the chunk.
 * Returns "application" if smkx is the last toggle, "normal" if rmkx is last,
 * or null if no toggle is found.
 */
export declare function detectCursorKeyMode(raw: string): "application" | "normal" | null;
export declare function sanitizeHostBaseEnv(env: Record<string, string>): Record<string, string>;
export declare function validateHostEnv(env: Record<string, string>): void;
export declare const DEFAULT_MAX_OUTPUT: number;
export declare const DEFAULT_PENDING_MAX_OUTPUT: number;
export declare const DEFAULT_PATH: string;
export declare const DEFAULT_NOTIFY_TAIL_CHARS = 400;
export declare const DEFAULT_APPROVAL_TIMEOUT_MS = 120000;
export declare const DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS = 130000;
export declare const execSchema: import("@sinclair/typebox").TObject<{
    command: import("@sinclair/typebox").TString;
    workdir: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    env: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TString>>;
    yieldMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    background: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    timeout: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    pty: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    elevated: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    host: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    security: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    ask: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    node: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type ExecProcessFailureKind = "shell-command-not-found" | "shell-not-executable" | "overall-timeout" | "no-output-timeout" | "signal" | "aborted" | "runtime-error";
type ExecExitFailureKind = Exclude<ExecProcessFailureKind, "runtime-error">;
export type ExecProcessOutcome = {
    status: "completed";
    exitCode: number;
    exitSignal: NodeJS.Signals | number | null;
    durationMs: number;
    aggregated: string;
    timedOut: false;
} | {
    status: "failed";
    exitCode: number | null;
    exitSignal: NodeJS.Signals | number | null;
    durationMs: number;
    aggregated: string;
    timedOut: boolean;
    failureKind: ExecProcessFailureKind;
    reason: string;
};
export type ExecProcessHandle = {
    session: ProcessSession;
    startedAt: number;
    pid?: number;
    promise: Promise<ExecProcessOutcome>;
    kill: () => void;
};
export declare function renderExecHostLabel(host: ExecHost): "sandbox" | "gateway" | "node";
export declare function normalizeNotifyOutput(value: string): string;
export declare function applyShellPath(env: Record<string, string>, shellPath?: string | null): void;
export declare function createApprovalSlug(id: string): string;
export declare function buildApprovalPendingMessage(params: {
    warningText?: string;
    approvalSlug: string;
    approvalId: string;
    command: string;
    cwd: string;
    host: "gateway" | "node";
    nodeId?: string;
}): string;
export declare function resolveApprovalRunningNoticeMs(value?: number): number;
export declare function emitExecSystemEvent(text: string, opts: {
    sessionKey?: string;
    contextKey?: string;
}): void;
export declare function formatExecFailureReason(params: {
    failureKind: ExecExitFailureKind;
    exitSignal: NodeJS.Signals | number | null;
    timeoutSec: number | null | undefined;
}): string;
export declare function buildExecExitOutcome(params: {
    exit: RunExit;
    aggregated: string;
    durationMs: number;
    timeoutSec: number | null | undefined;
}): ExecProcessOutcome;
export declare function buildExecRuntimeErrorOutcome(params: {
    error: unknown;
    aggregated: string;
    durationMs: number;
}): ExecProcessOutcome;
export declare function runExecProcess(opts: {
    command: string;
    execCommand?: string;
    workdir: string;
    env: Record<string, string>;
    sandbox?: BashSandboxConfig;
    containerWorkdir?: string | null;
    usePty: boolean;
    warnings: string[];
    maxOutput: number;
    pendingMaxOutput: number;
    notifyOnExit: boolean;
    notifyOnExitEmptySuccess?: boolean;
    scopeKey?: string;
    sessionKey?: string;
    timeoutSec: number | null;
    onUpdate?: (partialResult: AgentToolResult<ExecToolDetails>) => void;
}): Promise<ExecProcessHandle>;
