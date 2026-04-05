import { type OpenClawConfig } from "openclaw/plugin-sdk/account-resolution";
import type { ResolvedSynologyChatAccount } from "./types.js";
type SynologyGatewayLog = {
    info?: (message: string) => void;
    warn?: (message: string) => void;
    error?: (message: string) => void;
};
type SynologyGatewayStartupIssueCode = "disabled" | "missing-credentials" | "empty-allowlist" | "inherited-shared-webhook-path" | "duplicate-webhook-path";
type SynologyGatewayStartupIssue = {
    code: SynologyGatewayStartupIssueCode;
    logLevel: "info" | "warn";
    message: string;
};
export declare function collectSynologyGatewayStartupIssues(params: {
    cfg: OpenClawConfig;
    account: ResolvedSynologyChatAccount;
    accountId: string;
}): SynologyGatewayStartupIssue[];
export declare function collectSynologyGatewayRoutingWarnings(params: {
    cfg: OpenClawConfig;
    account: ResolvedSynologyChatAccount;
}): string[];
export declare function validateSynologyGatewayAccountStartup(params: {
    cfg: OpenClawConfig;
    account: ResolvedSynologyChatAccount;
    accountId: string;
    log?: SynologyGatewayLog;
}): {
    ok: true;
} | {
    ok: false;
};
export declare function registerSynologyWebhookRoute(params: {
    account: ResolvedSynologyChatAccount;
    accountId: string;
    log?: SynologyGatewayLog;
}): () => void;
export {};
