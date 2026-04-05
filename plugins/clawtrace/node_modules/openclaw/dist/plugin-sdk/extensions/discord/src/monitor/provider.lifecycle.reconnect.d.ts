import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import type { MutableDiscordGateway } from "./gateway-handle.js";
import type { DiscordMonitorStatusSink } from "./status.js";
export declare function createDiscordGatewayReconnectController(params: {
    accountId: string;
    gateway?: MutableDiscordGateway;
    runtime: RuntimeEnv;
    abortSignal?: AbortSignal;
    pushStatus: (patch: Parameters<DiscordMonitorStatusSink>[0]) => void;
    isLifecycleStopping: () => boolean;
    drainPendingGatewayErrors: () => "continue" | "stop";
}): {
    ensureStartupReady: () => Promise<void>;
    onAbort: () => void;
    onGatewayDebug: (msg: unknown) => void;
    clearHelloWatch: () => void;
    registerForceStop: (handler: (err: unknown) => void) => void;
    dispose: () => void;
};
