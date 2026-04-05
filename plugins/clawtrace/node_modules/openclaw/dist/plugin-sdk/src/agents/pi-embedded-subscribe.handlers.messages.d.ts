import type { AgentEvent, AgentMessage } from "@mariozechner/pi-agent-core";
import type { BlockReplyPayload } from "./pi-embedded-payloads.js";
import type { EmbeddedPiSubscribeContext, EmbeddedPiSubscribeState } from "./pi-embedded-subscribe.handlers.types.js";
export declare function resolveSilentReplyFallbackText(params: {
    text: string;
    messagingToolSentTexts: string[];
}): string;
export declare function consumePendingToolMediaIntoReply(state: Pick<EmbeddedPiSubscribeState, "pendingToolMediaUrls" | "pendingToolAudioAsVoice">, payload: BlockReplyPayload): BlockReplyPayload;
export declare function consumePendingToolMediaReply(state: Pick<EmbeddedPiSubscribeState, "pendingToolMediaUrls" | "pendingToolAudioAsVoice">): BlockReplyPayload | null;
export declare function hasAssistantVisibleReply(params: {
    text?: string;
    mediaUrls?: string[];
    mediaUrl?: string;
    audioAsVoice?: boolean;
}): boolean;
export declare function buildAssistantStreamData(params: {
    text?: string;
    delta?: string;
    mediaUrls?: string[];
    mediaUrl?: string;
}): {
    text: string;
    delta: string;
    mediaUrls?: string[];
};
export declare function handleMessageStart(ctx: EmbeddedPiSubscribeContext, evt: AgentEvent & {
    message: AgentMessage;
}): void;
export declare function handleMessageUpdate(ctx: EmbeddedPiSubscribeContext, evt: AgentEvent & {
    message: AgentMessage;
    assistantMessageEvent?: unknown;
}): void;
export declare function handleMessageEnd(ctx: EmbeddedPiSubscribeContext, evt: AgentEvent & {
    message: AgentMessage;
}): void;
