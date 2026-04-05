import type { SsrFPolicy } from "openclaw/plugin-sdk/ssrf-runtime";
export declare function concatUint8Arrays(parts: Uint8Array[]): Uint8Array;
export declare function postMultipartFormData(params: {
    url: string;
    boundary: string;
    parts: Uint8Array[];
    timeoutMs: number;
    ssrfPolicy?: SsrFPolicy;
}): Promise<Response>;
export declare function assertMultipartActionOk(response: Response, action: string): Promise<void>;
