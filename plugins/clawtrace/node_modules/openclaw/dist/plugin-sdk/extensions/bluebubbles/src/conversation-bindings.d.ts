import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { type BindingTargetKind } from "openclaw/plugin-sdk/conversation-runtime";
type BlueBubblesBindingTargetKind = "subagent" | "acp";
type BlueBubblesConversationBindingRecord = {
    accountId: string;
    conversationId: string;
    targetKind: BlueBubblesBindingTargetKind;
    targetSessionKey: string;
    agentId?: string;
    label?: string;
    boundBy?: string;
    boundAt: number;
    lastActivityAt: number;
};
type BlueBubblesConversationBindingManager = {
    accountId: string;
    getByConversationId: (conversationId: string) => BlueBubblesConversationBindingRecord | undefined;
    listBySessionKey: (targetSessionKey: string) => BlueBubblesConversationBindingRecord[];
    bindConversation: (params: {
        conversationId: string;
        targetKind: BindingTargetKind;
        targetSessionKey: string;
        metadata?: Record<string, unknown>;
    }) => BlueBubblesConversationBindingRecord | null;
    touchConversation: (conversationId: string, at?: number) => BlueBubblesConversationBindingRecord | null;
    unbindConversation: (conversationId: string) => BlueBubblesConversationBindingRecord | null;
    unbindBySessionKey: (targetSessionKey: string) => BlueBubblesConversationBindingRecord[];
    stop: () => void;
};
export declare function createBlueBubblesConversationBindingManager(params: {
    accountId?: string;
    cfg: OpenClawConfig;
}): BlueBubblesConversationBindingManager;
export declare const __testing: {
    resetBlueBubblesConversationBindingsForTests(): void;
};
export {};
