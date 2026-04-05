import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { type BindingTargetKind } from "openclaw/plugin-sdk/conversation-runtime";
type FeishuBindingTargetKind = "subagent" | "acp";
type FeishuThreadBindingRecord = {
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
    deliveryTo?: string;
    deliveryThreadId?: string;
    targetKind: FeishuBindingTargetKind;
    targetSessionKey: string;
    agentId?: string;
    label?: string;
    boundBy?: string;
    boundAt: number;
    lastActivityAt: number;
};
type FeishuThreadBindingManager = {
    accountId: string;
    getByConversationId: (conversationId: string) => FeishuThreadBindingRecord | undefined;
    listBySessionKey: (targetSessionKey: string) => FeishuThreadBindingRecord[];
    bindConversation: (params: {
        conversationId: string;
        parentConversationId?: string;
        targetKind: BindingTargetKind;
        targetSessionKey: string;
        metadata?: Record<string, unknown>;
    }) => FeishuThreadBindingRecord | null;
    touchConversation: (conversationId: string, at?: number) => FeishuThreadBindingRecord | null;
    unbindConversation: (conversationId: string) => FeishuThreadBindingRecord | null;
    unbindBySessionKey: (targetSessionKey: string) => FeishuThreadBindingRecord[];
    stop: () => void;
};
export declare function createFeishuThreadBindingManager(params: {
    accountId?: string;
    cfg: OpenClawConfig;
}): FeishuThreadBindingManager;
export declare function getFeishuThreadBindingManager(accountId?: string): FeishuThreadBindingManager | null;
export declare const __testing: {
    resetFeishuThreadBindingsForTests(): void;
};
export {};
