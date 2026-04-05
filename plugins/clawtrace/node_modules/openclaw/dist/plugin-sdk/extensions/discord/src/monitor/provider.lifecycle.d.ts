import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import type { DiscordVoiceManager } from "../voice/manager.js";
import type { MutableDiscordGateway } from "./gateway-handle.js";
import type { DiscordGatewaySupervisor } from "./gateway-supervisor.js";
import type { DiscordMonitorStatusSink } from "./status.js";
type ExecApprovalsHandler = {
    start: () => Promise<void>;
    stop: () => Promise<void>;
};
export declare function runDiscordGatewayLifecycle(params: {
    accountId: string;
    gateway?: MutableDiscordGateway;
    runtime: RuntimeEnv;
    abortSignal?: AbortSignal;
    isDisallowedIntentsError: (err: unknown) => boolean;
    voiceManager: DiscordVoiceManager | null;
    voiceManagerRef: {
        current: DiscordVoiceManager | null;
    };
    execApprovalsHandler: ExecApprovalsHandler | null;
    threadBindings: {
        stop: () => void;
    };
    gatewaySupervisor: DiscordGatewaySupervisor;
    statusSink?: DiscordMonitorStatusSink;
}): Promise<void>;
export {};
