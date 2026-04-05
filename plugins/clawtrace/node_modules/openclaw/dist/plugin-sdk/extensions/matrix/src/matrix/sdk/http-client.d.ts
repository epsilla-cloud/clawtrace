import type { SsrFPolicy } from "../../runtime-api.js";
import { type HttpMethod, type QueryParams } from "./transport.js";
export declare class MatrixAuthedHttpClient {
    private readonly homeserver;
    private readonly accessToken;
    private readonly ssrfPolicy?;
    constructor(homeserver: string, accessToken: string, ssrfPolicy?: SsrFPolicy | undefined);
    requestJson(params: {
        method: HttpMethod;
        endpoint: string;
        qs?: QueryParams;
        body?: unknown;
        timeoutMs: number;
        allowAbsoluteEndpoint?: boolean;
    }): Promise<unknown>;
    requestRaw(params: {
        method: HttpMethod;
        endpoint: string;
        qs?: QueryParams;
        timeoutMs: number;
        maxBytes?: number;
        readIdleTimeoutMs?: number;
        allowAbsoluteEndpoint?: boolean;
    }): Promise<Buffer>;
}
