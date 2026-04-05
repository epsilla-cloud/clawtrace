import { z } from "openclaw/plugin-sdk/zod";
export type MattermostFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export type MattermostClient = {
    baseUrl: string;
    apiBaseUrl: string;
    token: string;
    request: <T>(path: string, init?: RequestInit) => Promise<T>;
    /** Guarded fetch implementation; use in place of raw fetch for outbound requests. */
    fetchImpl: MattermostFetch;
};
export type MattermostUser = {
    id: string;
    username?: string | null;
    nickname?: string | null;
    first_name?: string | null;
    last_name?: string | null;
};
export type MattermostChannel = {
    id: string;
    name?: string | null;
    display_name?: string | null;
    type?: string | null;
    team_id?: string | null;
};
export declare const MattermostPostSchema: z.ZodObject<{
    id: z.ZodString;
    user_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    channel_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    file_ids: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    root_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    create_at: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    props: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
export type MattermostPost = z.infer<typeof MattermostPostSchema>;
export type MattermostFileInfo = {
    id: string;
    name?: string | null;
    mime_type?: string | null;
    size?: number | null;
};
export declare function normalizeMattermostBaseUrl(raw?: string | null): string | undefined;
export declare function readMattermostError(res: Response): Promise<string>;
export declare function createMattermostClient(params: {
    baseUrl: string;
    botToken: string;
    fetchImpl?: MattermostFetch;
    /** Allow requests to private/internal IPs (self-hosted/LAN deployments). */
    allowPrivateNetwork?: boolean;
}): MattermostClient;
export declare function fetchMattermostMe(client: MattermostClient): Promise<MattermostUser>;
export declare function fetchMattermostUser(client: MattermostClient, userId: string): Promise<MattermostUser>;
export declare function fetchMattermostUserByUsername(client: MattermostClient, username: string): Promise<MattermostUser>;
export declare function fetchMattermostChannel(client: MattermostClient, channelId: string): Promise<MattermostChannel>;
export declare function fetchMattermostChannelByName(client: MattermostClient, teamId: string, channelName: string): Promise<MattermostChannel>;
export declare function sendMattermostTyping(client: MattermostClient, params: {
    channelId: string;
    parentId?: string;
}): Promise<void>;
export declare function createMattermostDirectChannel(client: MattermostClient, userIds: string[], signal?: AbortSignal): Promise<MattermostChannel>;
export type CreateDmChannelRetryOptions = {
    /** Maximum number of retry attempts (default: 3) */
    maxRetries?: number;
    /** Initial delay in milliseconds (default: 1000) */
    initialDelayMs?: number;
    /** Maximum delay in milliseconds (default: 10000) */
    maxDelayMs?: number;
    /** Timeout for each individual request in milliseconds (default: 30000) */
    timeoutMs?: number;
    /** Optional logger for retry events */
    onRetry?: (attempt: number, delayMs: number, error: Error) => void;
};
/**
 * Creates a Mattermost DM channel with exponential backoff retry logic.
 * Retries on transient errors (429, 5xx, network errors) but not on
 * client errors (4xx except 429) or permanent failures.
 */
export declare function createMattermostDirectChannelWithRetry(client: MattermostClient, userIds: string[], options?: CreateDmChannelRetryOptions): Promise<MattermostChannel>;
export declare function createMattermostPost(client: MattermostClient, params: {
    channelId: string;
    message: string;
    rootId?: string;
    fileIds?: string[];
    props?: Record<string, unknown>;
}): Promise<MattermostPost>;
export type MattermostTeam = {
    id: string;
    name?: string | null;
    display_name?: string | null;
};
export declare function fetchMattermostUserTeams(client: MattermostClient, userId: string): Promise<MattermostTeam[]>;
export declare function updateMattermostPost(client: MattermostClient, postId: string, params: {
    message?: string;
    props?: Record<string, unknown>;
}): Promise<MattermostPost>;
export declare function uploadMattermostFile(client: MattermostClient, params: {
    channelId: string;
    buffer: Buffer;
    fileName: string;
    contentType?: string;
}): Promise<MattermostFileInfo>;
