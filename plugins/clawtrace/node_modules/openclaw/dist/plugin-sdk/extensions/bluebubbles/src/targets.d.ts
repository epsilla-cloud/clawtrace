import { type ParsedChatTarget } from "openclaw/plugin-sdk/imessage-core";
export type BlueBubblesService = "imessage" | "sms" | "auto";
export type BlueBubblesTarget = {
    kind: "chat_id";
    chatId: number;
} | {
    kind: "chat_guid";
    chatGuid: string;
} | {
    kind: "chat_identifier";
    chatIdentifier: string;
} | {
    kind: "handle";
    to: string;
    service: BlueBubblesService;
};
export type BlueBubblesAllowTarget = ParsedChatTarget | {
    kind: "handle";
    handle: string;
};
export declare function normalizeBlueBubblesHandle(raw: string): string;
/**
 * Extracts the handle from a chat_guid if it's a DM (1:1 chat).
 * BlueBubbles chat_guid format for DM: "service;-;handle" (e.g., "iMessage;-;+19257864429")
 * Group chat format: "service;+;groupId" (has "+" instead of "-")
 */
export declare function extractHandleFromChatGuid(chatGuid: string): string | null;
export declare function normalizeBlueBubblesMessagingTarget(raw: string): string | undefined;
export declare function looksLikeBlueBubblesTargetId(raw: string, normalized?: string): boolean;
export declare function looksLikeBlueBubblesExplicitTargetId(raw: string, normalized?: string): boolean;
export declare function inferBlueBubblesTargetChatType(raw: string): "direct" | "group" | undefined;
export declare function parseBlueBubblesTarget(raw: string): BlueBubblesTarget;
export declare function parseBlueBubblesAllowTarget(raw: string): BlueBubblesAllowTarget;
export declare function isAllowedBlueBubblesSender(params: {
    allowFrom: Array<string | number>;
    sender: string;
    chatId?: number | null;
    chatGuid?: string | null;
    chatIdentifier?: string | null;
}): boolean;
export declare function formatBlueBubblesChatTarget(params: {
    chatId?: number | null;
    chatGuid?: string | null;
    chatIdentifier?: string | null;
}): string;
