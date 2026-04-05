import type { ClawdbotConfig, RuntimeEnv } from "../runtime-api.js";
export declare const FEISHU_QUICK_ACTION_CARD_TTL_MS: number;
export declare function isFeishuQuickActionMenuEventKey(eventKey: string): boolean;
export declare function createQuickActionLauncherCard(params: {
    operatorOpenId: string;
    chatId?: string;
    expiresAt: number;
    chatType?: "p2p" | "group";
    sessionKey?: string;
}): Record<string, unknown>;
export declare function maybeHandleFeishuQuickActionMenu(params: {
    cfg: ClawdbotConfig;
    eventKey: string;
    operatorOpenId: string;
    runtime?: RuntimeEnv;
    accountId?: string;
    now?: number;
}): Promise<boolean>;
