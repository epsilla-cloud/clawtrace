import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { ChromeMcpSnapshotNode } from "./chrome-mcp.snapshot.js";
import type { BrowserTab } from "./client.js";
type ChromeMcpStructuredPage = {
    id: number;
    url?: string;
    selected?: boolean;
};
type ChromeMcpSession = {
    client: Client;
    transport: StdioClientTransport;
    ready: Promise<void>;
};
type ChromeMcpSessionFactory = (profileName: string, userDataDir?: string) => Promise<ChromeMcpSession>;
export declare function buildChromeMcpArgs(userDataDir?: string): string[];
export declare function ensureChromeMcpAvailable(profileName: string, userDataDir?: string): Promise<void>;
export declare function getChromeMcpPid(profileName: string): number | null;
export declare function closeChromeMcpSession(profileName: string): Promise<boolean>;
export declare function stopAllChromeMcpSessions(): Promise<void>;
export declare function listChromeMcpPages(profileName: string, userDataDir?: string): Promise<ChromeMcpStructuredPage[]>;
export declare function listChromeMcpTabs(profileName: string, userDataDir?: string): Promise<BrowserTab[]>;
export declare function openChromeMcpTab(profileName: string, url: string, userDataDir?: string): Promise<BrowserTab>;
export declare function focusChromeMcpTab(profileName: string, targetId: string, userDataDir?: string): Promise<void>;
export declare function closeChromeMcpTab(profileName: string, targetId: string, userDataDir?: string): Promise<void>;
export declare function navigateChromeMcpPage(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    url: string;
    timeoutMs?: number;
}): Promise<{
    url: string;
}>;
export declare function takeChromeMcpSnapshot(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
}): Promise<ChromeMcpSnapshotNode>;
export declare function takeChromeMcpScreenshot(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    uid?: string;
    fullPage?: boolean;
    format?: "png" | "jpeg";
}): Promise<Buffer>;
export declare function clickChromeMcpElement(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    uid: string;
    doubleClick?: boolean;
}): Promise<void>;
export declare function fillChromeMcpElement(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    uid: string;
    value: string;
}): Promise<void>;
export declare function fillChromeMcpForm(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    elements: Array<{
        uid: string;
        value: string;
    }>;
}): Promise<void>;
export declare function hoverChromeMcpElement(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    uid: string;
}): Promise<void>;
export declare function dragChromeMcpElement(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    fromUid: string;
    toUid: string;
}): Promise<void>;
export declare function uploadChromeMcpFile(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    uid: string;
    filePath: string;
}): Promise<void>;
export declare function pressChromeMcpKey(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    key: string;
}): Promise<void>;
export declare function resizeChromeMcpPage(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    width: number;
    height: number;
}): Promise<void>;
export declare function handleChromeMcpDialog(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    action: "accept" | "dismiss";
    promptText?: string;
}): Promise<void>;
export declare function evaluateChromeMcpScript(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    fn: string;
    args?: string[];
}): Promise<unknown>;
export declare function waitForChromeMcpText(params: {
    profileName: string;
    userDataDir?: string;
    targetId: string;
    text: string[];
    timeoutMs?: number;
}): Promise<void>;
export declare function setChromeMcpSessionFactoryForTest(factory: ChromeMcpSessionFactory | null): void;
export declare function resetChromeMcpSessionsForTest(): Promise<void>;
export {};
