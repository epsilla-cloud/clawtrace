export { removeAckReactionAfterReply, shouldAckReaction } from "../channels/ack-reactions.js";
export type { ChannelAccountSnapshot, ChannelGatewayContext } from "../channels/plugins/types.js";
export type { OpenClawConfig } from "../config/config.js";
export type { PluginRuntime } from "../plugins/runtime/types.js";
export type { RuntimeEnv } from "../runtime.js";
export type { MockFn } from "../test-utils/vitest-mock-fn.js";
/** Create a tiny Windows `.cmd` shim fixture for plugin tests that spawn CLIs. */
export declare function createWindowsCmdShimFixture(params: {
    shimPath: string;
    scriptPath: string;
    shimLine: string;
}): Promise<void>;
type ResolveTargetMode = "explicit" | "implicit" | "heartbeat";
type ResolveTargetResult = {
    ok: boolean;
    to?: string;
    error?: unknown;
};
type ResolveTargetFn = (params: {
    to?: string;
    mode: ResolveTargetMode;
    allowFrom: string[];
}) => ResolveTargetResult;
/** Install a shared test matrix for target-resolution error handling. */
export declare function installCommonResolveTargetErrorCases(params: {
    resolveTarget: ResolveTargetFn;
    implicitAllowFrom: string[];
}): void;
