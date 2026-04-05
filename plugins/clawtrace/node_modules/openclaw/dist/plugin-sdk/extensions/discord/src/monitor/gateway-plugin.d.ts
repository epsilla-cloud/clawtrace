import * as carbonGateway from "@buape/carbon/gateway";
import * as httpsProxyAgent from "https-proxy-agent";
import type { DiscordAccountConfig } from "openclaw/plugin-sdk/config-runtime";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import * as undici from "undici";
import * as ws from "ws";
type DiscordGatewayWebSocketCtor = new (url: string, options?: {
    agent?: unknown;
}) => ws.WebSocket;
export declare function resolveDiscordGatewayIntents(intentsConfig?: import("openclaw/plugin-sdk/config-runtime").DiscordIntentsConfig): number;
export declare function createDiscordGatewayPlugin(params: {
    discordConfig: DiscordAccountConfig;
    runtime: RuntimeEnv;
    __testing?: {
        HttpsProxyAgentCtor?: typeof httpsProxyAgent.HttpsProxyAgent;
        ProxyAgentCtor?: typeof undici.ProxyAgent;
        undiciFetch?: typeof undici.fetch;
        webSocketCtor?: DiscordGatewayWebSocketCtor;
        registerClient?: (plugin: carbonGateway.GatewayPlugin, client: Parameters<carbonGateway.GatewayPlugin["registerClient"]>[0]) => Promise<void>;
    };
}): carbonGateway.GatewayPlugin;
export {};
