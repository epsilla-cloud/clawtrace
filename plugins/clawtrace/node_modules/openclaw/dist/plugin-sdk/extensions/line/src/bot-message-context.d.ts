import type { EventSource, MessageEvent, PostbackEvent } from "@line/bot-sdk";
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
import type { HistoryEntry } from "openclaw/plugin-sdk/reply-history";
import type { ResolvedLineAccount } from "./types.js";
interface MediaRef {
    path: string;
    contentType?: string;
}
interface BuildLineMessageContextParams {
    event: MessageEvent;
    allMedia: MediaRef[];
    cfg: OpenClawConfig;
    account: ResolvedLineAccount;
    commandAuthorized: boolean;
    groupHistories?: Map<string, HistoryEntry[]>;
    historyLimit?: number;
}
export type LineSourceInfo = {
    userId?: string;
    groupId?: string;
    roomId?: string;
    isGroup: boolean;
};
export declare function getLineSourceInfo(source: EventSource): LineSourceInfo;
export declare function buildLineMessageContext(params: BuildLineMessageContextParams): Promise<{
    ctxPayload: {
        CommandAuthorized: boolean;
        OriginatingChannel: "line";
        OriginatingTo: string;
        GroupSystemPrompt: string | undefined;
        InboundHistory: Pick<HistoryEntry, "timestamp" | "body" | "sender">[] | undefined;
        LocationLat?: number | undefined;
        LocationLon?: number | undefined;
        LocationAccuracy?: number;
        LocationName?: string;
        LocationAddress?: string;
        LocationSource?: import("../../../src/channels/location.ts").LocationSource | undefined;
        LocationIsLive?: boolean | undefined;
        Body: string;
        BodyForAgent: string;
        RawBody: string;
        CommandBody: string;
        From: string;
        To: string;
        SessionKey: string;
        AccountId: string;
        ChatType: string;
        ConversationLabel: string;
        GroupSubject: string | undefined;
        SenderId: string;
        Provider: string;
        Surface: string;
        MessageSid: string;
        Timestamp: number;
        MediaPath: string | undefined;
        MediaType: string | undefined;
        MediaUrl: string | undefined;
        MediaPaths: string[] | undefined;
        MediaUrls: string[] | undefined;
        MediaTypes: string[] | undefined;
    } & Omit<import("openclaw/plugin-sdk/reply-runtime").MsgContext, "CommandAuthorized"> & {
        CommandAuthorized: boolean;
    };
    event: MessageEvent;
    userId: string | undefined;
    groupId: string | undefined;
    roomId: string | undefined;
    isGroup: boolean;
    route: import("openclaw/plugin-sdk/routing").ResolvedAgentRoute;
    replyToken: string;
    accountId: string;
} | null>;
export declare function buildLinePostbackContext(params: {
    event: PostbackEvent;
    cfg: OpenClawConfig;
    account: ResolvedLineAccount;
    commandAuthorized: boolean;
}): Promise<{
    ctxPayload: {
        CommandAuthorized: boolean;
        OriginatingChannel: "line";
        OriginatingTo: string;
        GroupSystemPrompt: string | undefined;
        InboundHistory: Pick<HistoryEntry, "timestamp" | "body" | "sender">[] | undefined;
        LocationLat?: number | undefined;
        LocationLon?: number | undefined;
        LocationAccuracy?: number;
        LocationName?: string;
        LocationAddress?: string;
        LocationSource?: import("../../../src/channels/location.ts").LocationSource | undefined;
        LocationIsLive?: boolean | undefined;
        Body: string;
        BodyForAgent: string;
        RawBody: string;
        CommandBody: string;
        From: string;
        To: string;
        SessionKey: string;
        AccountId: string;
        ChatType: string;
        ConversationLabel: string;
        GroupSubject: string | undefined;
        SenderId: string;
        Provider: string;
        Surface: string;
        MessageSid: string;
        Timestamp: number;
        MediaPath: string | undefined;
        MediaType: string | undefined;
        MediaUrl: string | undefined;
        MediaPaths: string[] | undefined;
        MediaUrls: string[] | undefined;
        MediaTypes: string[] | undefined;
    } & Omit<import("openclaw/plugin-sdk/reply-runtime").MsgContext, "CommandAuthorized"> & {
        CommandAuthorized: boolean;
    };
    event: PostbackEvent;
    userId: string | undefined;
    groupId: string | undefined;
    roomId: string | undefined;
    isGroup: boolean;
    route: import("openclaw/plugin-sdk/routing").ResolvedAgentRoute;
    replyToken: string;
    accountId: string;
} | null>;
export type LineMessageContext = NonNullable<Awaited<ReturnType<typeof buildLineMessageContext>>>;
export type LinePostbackContext = NonNullable<Awaited<ReturnType<typeof buildLinePostbackContext>>>;
export type LineInboundContext = LineMessageContext | LinePostbackContext;
export {};
