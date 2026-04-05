import type { OpenClawConfig } from "./runtime-api.js";
export type BlueBubblesAccountResolveOpts = {
    serverUrl?: string;
    password?: string;
    accountId?: string;
    cfg?: OpenClawConfig;
};
export declare function resolveBlueBubblesServerAccount(params: BlueBubblesAccountResolveOpts): {
    baseUrl: string;
    password: string;
    accountId: string;
    allowPrivateNetwork: boolean;
};
