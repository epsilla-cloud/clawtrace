import { type RequestClient } from "@buape/carbon";
import { type OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { type DiscordComponentBuildResult, type DiscordComponentMessageSpec } from "./components.js";
import type { DiscordSendResult } from "./send.types.js";
type DiscordComponentSendOpts = {
    cfg?: OpenClawConfig;
    accountId?: string;
    token?: string;
    rest?: RequestClient;
    silent?: boolean;
    replyTo?: string;
    sessionKey?: string;
    agentId?: string;
    mediaUrl?: string;
    mediaLocalRoots?: readonly string[];
    filename?: string;
};
export declare function registerBuiltDiscordComponentMessage(params: {
    buildResult: DiscordComponentBuildResult;
    messageId: string;
}): void;
export declare function sendDiscordComponentMessage(to: string, spec: DiscordComponentMessageSpec, opts?: DiscordComponentSendOpts): Promise<DiscordSendResult>;
export declare function editDiscordComponentMessage(to: string, messageId: string, spec: DiscordComponentMessageSpec, opts?: DiscordComponentSendOpts): Promise<DiscordSendResult>;
export {};
