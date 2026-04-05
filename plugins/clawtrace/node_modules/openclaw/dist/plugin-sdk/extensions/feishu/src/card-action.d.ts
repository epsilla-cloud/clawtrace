import type { ClawdbotConfig, RuntimeEnv } from "../runtime-api.js";
export type FeishuCardActionEvent = {
    operator: {
        open_id: string;
        user_id: string;
        union_id: string;
    };
    token: string;
    action: {
        value: Record<string, unknown>;
        tag: string;
    };
    context: {
        open_id: string;
        user_id: string;
        chat_id: string;
    };
};
export declare function resetProcessedFeishuCardActionTokensForTests(): void;
export declare function handleFeishuCardAction(params: {
    cfg: ClawdbotConfig;
    event: FeishuCardActionEvent;
    botOpenId?: string;
    runtime?: RuntimeEnv;
    accountId?: string;
}): Promise<void>;
