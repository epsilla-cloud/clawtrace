import { type GatewayRpcOpts } from "./core-api.js";
export type BrowserParentOpts = GatewayRpcOpts & {
    json?: boolean;
    browserProfile?: string;
};
type BrowserRequestParams = {
    method: "GET" | "POST" | "DELETE";
    path: string;
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
};
export declare function callBrowserRequest<T>(opts: BrowserParentOpts, params: BrowserRequestParams, extra?: {
    timeoutMs?: number;
    progress?: boolean;
}): Promise<T>;
export declare function callBrowserResize(opts: BrowserParentOpts, params: {
    profile?: string;
    width: number;
    height: number;
    targetId?: string;
}, extra?: {
    timeoutMs?: number;
}): Promise<unknown>;
export {};
