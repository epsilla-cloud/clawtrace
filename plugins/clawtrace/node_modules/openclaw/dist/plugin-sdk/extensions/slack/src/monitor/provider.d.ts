import { resolveOpenProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy } from "openclaw/plugin-sdk/config-runtime";
import { getSocketEmitter, waitForSlackSocketDisconnect } from "./reconnect-policy.js";
import type { MonitorSlackOpts } from "./types.js";
type SlackAppConstructor = typeof import("@slack/bolt").App;
type SlackHttpReceiverConstructor = typeof import("@slack/bolt").HTTPReceiver;
type SlackBoltResolvedExports = {
    App: SlackAppConstructor;
    HTTPReceiver: SlackHttpReceiverConstructor;
};
declare function resolveSlackBoltInterop(params: {
    defaultImport: unknown;
    namespaceImport: unknown;
}): SlackBoltResolvedExports;
declare function publishSlackConnectedStatus(setStatus?: (next: Record<string, unknown>) => void): void;
declare function publishSlackDisconnectedStatus(setStatus?: (next: Record<string, unknown>) => void, error?: unknown): void;
export declare function monitorSlackProvider(opts?: MonitorSlackOpts): Promise<void>;
export { isNonRecoverableSlackAuthError } from "./reconnect-policy.js";
export declare const resolveSlackRuntimeGroupPolicy: typeof resolveOpenProviderRuntimeGroupPolicy;
export declare const __testing: {
    publishSlackConnectedStatus: typeof publishSlackConnectedStatus;
    publishSlackDisconnectedStatus: typeof publishSlackDisconnectedStatus;
    resolveSlackRuntimeGroupPolicy: typeof resolveOpenProviderRuntimeGroupPolicy;
    resolveDefaultGroupPolicy: typeof resolveDefaultGroupPolicy;
    resolveSlackBoltInterop: typeof resolveSlackBoltInterop;
    getSocketEmitter: typeof getSocketEmitter;
    waitForSlackSocketDisconnect: typeof waitForSlackSocketDisconnect;
};
