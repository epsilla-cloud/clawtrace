import type { SsrFPolicy } from "../../../../src/infra/net/ssrf.js";
export declare function postJsonWithRetry<T>(params: {
    url: string;
    headers: Record<string, string>;
    ssrfPolicy?: SsrFPolicy;
    body: unknown;
    errorPrefix: string;
}): Promise<T>;
