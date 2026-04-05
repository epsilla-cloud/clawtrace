import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import { type BindingTargetKind } from "openclaw/plugin-sdk/conversation-runtime";
type IMessageBindingTargetKind = "subagent" | "acp";
type IMessageConversationBindingRecord = {
    accountId: string;
    conversationId: string;
    targetKind: IMessageBindingTargetKind;
    targetSessionKey: string;
    agentId?: string;
    label?: string;
    boundBy?: string;
    boundAt: number;
    lastActivityAt: number;
};
type IMessageConversationBindingManager = {
    accountId: string;
    getByConversationId: (conversationId: string) => IMessageConversationBindingRecord | undefined;
    listBySessionKey: (targetSessionKey: string) => IMessageConversationBindingRecord[];
    bindConversation: (params: {
        conversationId: string;
        targetKind: BindingTargetKind;
        targetSessionKey: string;
        metadata?: Record<string, unknown>;
    }) => IMessageConversationBindingRecord | null;
    touchConversation: (conversationId: string, at?: number) => IMessageConversationBindingRecord | null;
    unbindConversation: (conversationId: string) => IMessageConversationBindingRecord | null;
    unbindBySessionKey: (targetSessionKey: string) => IMessageConversationBindingRecord[];
    stop: () => void;
};
export declare function createIMessageConversationBindingManager(params: {
    accountId?: string;
    cfg: OpenClawConfig;
}): IMessageConversationBindingManager;
export declare const __testing: {
    resetIMessageConversationBindingsForTests(): void;
};
export {};
