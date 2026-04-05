import type { ClawdbotConfig, RuntimeEnv } from "../runtime-api.js";
import { type FeishuMessageEvent } from "./bot.js";
import { getMessageFeishu } from "./send.js";
import type { ResolvedFeishuAccount } from "./types.js";
export type FeishuReactionCreatedEvent = {
    message_id: string;
    chat_id?: string;
    chat_type?: string;
    reaction_type?: {
        emoji_type?: string;
    };
    operator_type?: string;
    user_id?: {
        open_id?: string;
    };
    action_time?: string;
};
export type FeishuReactionDeletedEvent = FeishuReactionCreatedEvent & {
    reaction_id?: string;
};
type ResolveReactionSyntheticEventParams = {
    cfg: ClawdbotConfig;
    accountId: string;
    event: FeishuReactionCreatedEvent;
    botOpenId?: string;
    fetchMessage?: typeof getMessageFeishu;
    verificationTimeoutMs?: number;
    logger?: (message: string) => void;
    uuid?: () => string;
    action?: "created" | "deleted";
};
export declare function resolveReactionSyntheticEvent(params: ResolveReactionSyntheticEventParams): Promise<FeishuMessageEvent | null>;
export type BotOpenIdSource = {
    kind: "prefetched";
    botOpenId?: string;
    botName?: string;
} | {
    kind: "fetch";
};
export type MonitorSingleAccountParams = {
    cfg: ClawdbotConfig;
    account: ResolvedFeishuAccount;
    runtime?: RuntimeEnv;
    abortSignal?: AbortSignal;
    botOpenIdSource?: BotOpenIdSource;
};
export declare function monitorSingleAccount(params: MonitorSingleAccountParams): Promise<void>;
export {};
