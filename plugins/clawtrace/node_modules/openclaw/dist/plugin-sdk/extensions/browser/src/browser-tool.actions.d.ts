import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import { browserAct, browserConsoleMessages, browserSnapshot, browserTabs, imageResultFromFile, loadConfig } from "./core-api.js";
export declare const __testing: {
    setDepsForTest(overrides: Partial<{
        browserAct: typeof browserAct;
        browserConsoleMessages: typeof browserConsoleMessages;
        browserSnapshot: typeof browserSnapshot;
        browserTabs: typeof browserTabs;
        imageResultFromFile: typeof imageResultFromFile;
        loadConfig: typeof loadConfig;
    }> | null): void;
};
type BrowserProxyRequest = (opts: {
    method: string;
    path: string;
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
    timeoutMs?: number;
    profile?: string;
}) => Promise<unknown>;
export declare function executeTabsAction(params: {
    baseUrl?: string;
    profile?: string;
    proxyRequest: BrowserProxyRequest | null;
}): Promise<AgentToolResult<unknown>>;
export declare function executeSnapshotAction(params: {
    input: Record<string, unknown>;
    baseUrl?: string;
    profile?: string;
    proxyRequest: BrowserProxyRequest | null;
}): Promise<AgentToolResult<unknown>>;
export declare function executeConsoleAction(params: {
    input: Record<string, unknown>;
    baseUrl?: string;
    profile?: string;
    proxyRequest: BrowserProxyRequest | null;
}): Promise<AgentToolResult<unknown>>;
export declare function executeActAction(params: {
    request: Parameters<typeof browserAct>[1];
    baseUrl?: string;
    profile?: string;
    proxyRequest: BrowserProxyRequest | null;
}): Promise<AgentToolResult<unknown>>;
export {};
