import type { WebhookRequestBody } from "@line/bot-sdk";
import type { NextFunction, Request, Response } from "express";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { type RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import type { LineInboundContext } from "./bot-message-context.js";
import type { ResolvedLineAccount } from "./types.js";
export interface LineBotOptions {
    channelAccessToken: string;
    channelSecret: string;
    accountId?: string;
    runtime?: RuntimeEnv;
    config?: OpenClawConfig;
    mediaMaxMb?: number;
    onMessage?: (ctx: LineInboundContext) => Promise<void>;
}
export interface LineBot {
    handleWebhook: (body: WebhookRequestBody) => Promise<void>;
    account: ResolvedLineAccount;
}
export declare function createLineBot(opts: LineBotOptions): LineBot;
export declare function createLineWebhookCallback(bot: LineBot, channelSecret: string, path?: string): {
    path: string;
    handler: (req: Request, res: Response, _next: NextFunction) => Promise<void>;
};
