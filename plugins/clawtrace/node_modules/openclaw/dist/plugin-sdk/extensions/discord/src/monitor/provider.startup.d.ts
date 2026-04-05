import { Client, ReadyListener, type BaseCommand, type BaseMessageInteractiveComponent, type Modal } from "@buape/carbon";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import type { DiscordGuildEntryResolved } from "./allow-list.js";
import { createDiscordAutoPresenceController } from "./auto-presence.js";
import type { DiscordDmPolicy } from "./dm-command-auth.js";
import type { MutableDiscordGateway } from "./gateway-handle.js";
import { createDiscordGatewayPlugin } from "./gateway-plugin.js";
import { createDiscordGatewaySupervisor } from "./gateway-supervisor.js";
import { DiscordMessageListener } from "./listeners.js";
import { resolveDiscordPresenceUpdate } from "./presence.js";
type DiscordAutoPresenceController = ReturnType<typeof createDiscordAutoPresenceController>;
type DiscordListenerConfig = {
    dangerouslyAllowNameMatching?: boolean;
    intents?: {
        presence?: boolean;
    };
};
type CreateClientFn = (options: ConstructorParameters<typeof Client>[0], handlers: ConstructorParameters<typeof Client>[1], plugins: ConstructorParameters<typeof Client>[2]) => Client;
export declare function createDiscordStatusReadyListener(params: {
    discordConfig: Parameters<typeof resolveDiscordPresenceUpdate>[0];
    getAutoPresenceController: () => DiscordAutoPresenceController | null;
}): ReadyListener;
export declare function createDiscordMonitorClient(params: {
    accountId: string;
    applicationId: string;
    token: string;
    commands: BaseCommand[];
    components: BaseMessageInteractiveComponent[];
    modals: Modal[];
    voiceEnabled: boolean;
    discordConfig: Parameters<typeof resolveDiscordPresenceUpdate>[0] & {
        eventQueue?: {
            listenerTimeout?: number;
        };
    };
    runtime: RuntimeEnv;
    createClient: CreateClientFn;
    createGatewayPlugin: typeof createDiscordGatewayPlugin;
    createGatewaySupervisor: typeof createDiscordGatewaySupervisor;
    createAutoPresenceController: typeof createDiscordAutoPresenceController;
    isDisallowedIntentsError: (err: unknown) => boolean;
}): {
    client: Client;
    gateway: MutableDiscordGateway | undefined;
    gatewaySupervisor: import("./gateway-supervisor.js").DiscordGatewaySupervisor;
    autoPresenceController: import("./auto-presence.js").DiscordAutoPresenceController | null;
    eventQueueOpts: {
        listenerTimeout: number;
    };
};
export declare function fetchDiscordBotIdentity(params: {
    client: Pick<Client, "fetchUser">;
    runtime: RuntimeEnv;
    logStartupPhase: (phase: string, details?: string) => void;
}): Promise<{
    botUserId: string;
    botUserName: string | undefined;
} | {
    botUserId: undefined;
    botUserName: undefined;
}>;
export declare function registerDiscordMonitorListeners(params: {
    cfg: OpenClawConfig;
    client: Pick<Client, "listeners">;
    accountId: string;
    discordConfig: DiscordListenerConfig;
    runtime: RuntimeEnv;
    botUserId?: string;
    dmEnabled: boolean;
    groupDmEnabled: boolean;
    groupDmChannels?: string[];
    dmPolicy: DiscordDmPolicy;
    allowFrom?: string[];
    groupPolicy: "open" | "allowlist" | "disabled";
    guildEntries?: Record<string, DiscordGuildEntryResolved>;
    logger: NonNullable<ConstructorParameters<typeof DiscordMessageListener>[1]>;
    messageHandler: ConstructorParameters<typeof DiscordMessageListener>[0];
    trackInboundEvent?: () => void;
    eventQueueListenerTimeoutMs?: number;
}): void;
export {};
