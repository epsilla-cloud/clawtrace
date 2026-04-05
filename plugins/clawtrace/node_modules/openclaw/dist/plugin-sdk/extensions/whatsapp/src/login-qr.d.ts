import { type RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
export declare function startWebLoginWithQr(opts?: {
    verbose?: boolean;
    timeoutMs?: number;
    force?: boolean;
    accountId?: string;
    runtime?: RuntimeEnv;
}): Promise<{
    qrDataUrl?: string;
    message: string;
}>;
export declare function waitForWebLogin(opts?: {
    timeoutMs?: number;
    runtime?: RuntimeEnv;
    accountId?: string;
}): Promise<{
    connected: boolean;
    message: string;
}>;
