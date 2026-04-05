import type { IncomingMessage, ServerResponse } from "node:http";
import { type MattermostClient, type MattermostPost } from "./client.js";
import { type OpenClawConfig } from "./runtime-api.js";
/**
 * Mattermost interactive message callback payload.
 * Sent by Mattermost when a user clicks an action button.
 * See: https://developers.mattermost.com/integrate/plugins/interactive-messages/
 */
export type MattermostInteractionPayload = {
    user_id: string;
    user_name?: string;
    channel_id: string;
    team_id?: string;
    post_id: string;
    trigger_id?: string;
    type?: string;
    data_source?: string;
    context?: Record<string, unknown>;
};
export type MattermostInteractionResponse = {
    update?: {
        message: string;
        props?: Record<string, unknown>;
    };
    ephemeral_text?: string;
};
export type MattermostInteractionAuthorizationResult = {
    ok: true;
} | {
    ok: false;
    statusCode?: number;
    response?: MattermostInteractionResponse;
};
export type MattermostInteractiveButtonInput = {
    id?: string;
    callback_data?: string;
    text?: string;
    name?: string;
    label?: string;
    style?: "default" | "primary" | "danger";
    context?: Record<string, unknown>;
};
export declare function setInteractionCallbackUrl(accountId: string, url: string): void;
export declare function getInteractionCallbackUrl(accountId: string): string | undefined;
type InteractionCallbackConfig = Pick<OpenClawConfig, "gateway" | "channels"> & {
    interactions?: {
        callbackBaseUrl?: string;
    };
};
export declare function resolveInteractionCallbackPath(accountId: string): string;
/**
 * Resolve the interaction callback URL for an account.
 * Falls back to computing it from interactions.callbackBaseUrl or gateway host config.
 */
export declare function computeInteractionCallbackUrl(accountId: string, cfg?: InteractionCallbackConfig): string;
/**
 * Resolve the interaction callback URL for an account.
 * Prefers the in-memory registered URL (set by the gateway monitor) so callers outside the
 * monitor lifecycle can reuse the runtime-validated callback destination.
 */
export declare function resolveInteractionCallbackUrl(accountId: string, cfg?: InteractionCallbackConfig): string;
export declare function setInteractionSecret(accountIdOrBotToken: string, botToken?: string): void;
export declare function getInteractionSecret(accountId?: string): string;
export declare function generateInteractionToken(context: Record<string, unknown>, accountId?: string): string;
export declare function verifyInteractionToken(context: Record<string, unknown>, token: string, accountId?: string): boolean;
export type MattermostButton = {
    id: string;
    type: "button" | "select";
    name: string;
    style?: "default" | "primary" | "danger";
    integration: {
        url: string;
        context: Record<string, unknown>;
    };
};
export type MattermostAttachment = {
    text?: string;
    actions?: MattermostButton[];
    [key: string]: unknown;
};
export declare function buildButtonAttachments(params: {
    callbackUrl: string;
    accountId?: string;
    buttons: Array<{
        id: string;
        name: string;
        style?: "default" | "primary" | "danger";
        context?: Record<string, unknown>;
    }>;
    text?: string;
}): MattermostAttachment[];
export declare function buildButtonProps(params: {
    callbackUrl: string;
    accountId?: string;
    channelId: string;
    buttons: Array<unknown>;
    text?: string;
}): Record<string, unknown> | undefined;
export declare function createMattermostInteractionHandler(params: {
    client: MattermostClient;
    botUserId: string;
    accountId: string;
    allowedSourceIps?: string[];
    trustedProxies?: string[];
    allowRealIpFallback?: boolean;
    resolveSessionKey?: (params: {
        channelId: string;
        userId: string;
        post: MattermostPost;
    }) => Promise<string>;
    handleInteraction?: (opts: {
        payload: MattermostInteractionPayload;
        userName: string;
        actionId: string;
        actionName: string;
        originalMessage: string;
        context: Record<string, unknown>;
        post: MattermostPost;
    }) => Promise<MattermostInteractionResponse | null>;
    authorizeButtonClick?: (opts: {
        payload: MattermostInteractionPayload;
        post: MattermostPost;
    }) => Promise<MattermostInteractionAuthorizationResult>;
    dispatchButtonClick?: (opts: {
        channelId: string;
        userId: string;
        userName: string;
        actionId: string;
        actionName: string;
        postId: string;
        post: MattermostPost;
    }) => Promise<void>;
    log?: (message: string) => void;
}): (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export {};
