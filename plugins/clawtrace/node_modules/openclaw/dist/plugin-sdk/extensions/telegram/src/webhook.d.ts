import type { IncomingMessage } from "node:http";
import * as grammy from "grammy";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
export declare function startTelegramWebhook(opts: {
    token: string;
    accountId?: string;
    config?: OpenClawConfig;
    path?: string;
    port?: number;
    host?: string;
    secret?: string;
    runtime?: RuntimeEnv;
    fetch?: typeof fetch;
    abortSignal?: AbortSignal;
    healthPath?: string;
    publicUrl?: string;
    webhookCertPath?: string;
}): Promise<{
    server: import("node:http").Server<typeof IncomingMessage, typeof import("node:http").ServerResponse>;
    bot: grammy.Bot<grammy.Context, grammy.Api<grammy.RawApi>>;
    stop: () => void;
}>;
