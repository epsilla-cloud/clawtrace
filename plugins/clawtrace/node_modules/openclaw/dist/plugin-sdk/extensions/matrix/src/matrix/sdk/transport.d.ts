import { type SsrFPolicy } from "../../runtime-api.js";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type QueryValue = string | number | boolean | null | undefined | Array<string | number | boolean | null | undefined>;
export type QueryParams = Record<string, QueryValue> | null | undefined;
export declare function createMatrixGuardedFetch(params: {
    ssrfPolicy?: SsrFPolicy;
}): typeof fetch;
export declare function performMatrixRequest(params: {
    homeserver: string;
    accessToken: string;
    method: HttpMethod;
    endpoint: string;
    qs?: QueryParams;
    body?: unknown;
    timeoutMs: number;
    raw?: boolean;
    maxBytes?: number;
    readIdleTimeoutMs?: number;
    ssrfPolicy?: SsrFPolicy;
    allowAbsoluteEndpoint?: boolean;
}): Promise<{
    response: Response;
    text: string;
    buffer: Buffer;
}>;
export {};
