import type { BrowserActionOk, BrowserActionPathResult, BrowserActionTabResult } from "./client-actions-types.js";
export type BrowserFormField = {
    ref: string;
    type: string;
    value?: string | number | boolean;
};
export type BrowserActRequest = {
    kind: "click";
    ref?: string;
    selector?: string;
    targetId?: string;
    doubleClick?: boolean;
    button?: string;
    modifiers?: string[];
    delayMs?: number;
    timeoutMs?: number;
} | {
    kind: "type";
    ref?: string;
    selector?: string;
    text: string;
    targetId?: string;
    submit?: boolean;
    slowly?: boolean;
    timeoutMs?: number;
} | {
    kind: "press";
    key: string;
    targetId?: string;
    delayMs?: number;
} | {
    kind: "hover";
    ref?: string;
    selector?: string;
    targetId?: string;
    timeoutMs?: number;
} | {
    kind: "scrollIntoView";
    ref?: string;
    selector?: string;
    targetId?: string;
    timeoutMs?: number;
} | {
    kind: "drag";
    startRef?: string;
    startSelector?: string;
    endRef?: string;
    endSelector?: string;
    targetId?: string;
    timeoutMs?: number;
} | {
    kind: "select";
    ref?: string;
    selector?: string;
    values: string[];
    targetId?: string;
    timeoutMs?: number;
} | {
    kind: "fill";
    fields: BrowserFormField[];
    targetId?: string;
    timeoutMs?: number;
} | {
    kind: "resize";
    width: number;
    height: number;
    targetId?: string;
} | {
    kind: "wait";
    timeMs?: number;
    text?: string;
    textGone?: string;
    selector?: string;
    url?: string;
    loadState?: "load" | "domcontentloaded" | "networkidle";
    fn?: string;
    targetId?: string;
    timeoutMs?: number;
} | {
    kind: "evaluate";
    fn: string;
    ref?: string;
    targetId?: string;
    timeoutMs?: number;
} | {
    kind: "close";
    targetId?: string;
} | {
    kind: "batch";
    actions: BrowserActRequest[];
    targetId?: string;
    stopOnError?: boolean;
};
export type BrowserActResponse = {
    ok: true;
    targetId: string;
    url?: string;
    result?: unknown;
    results?: Array<{
        ok: boolean;
        error?: string;
    }>;
};
export type BrowserDownloadPayload = {
    url: string;
    suggestedFilename: string;
    path: string;
};
type BrowserDownloadResult = {
    ok: true;
    targetId: string;
    download: BrowserDownloadPayload;
};
export declare function browserNavigate(baseUrl: string | undefined, opts: {
    url: string;
    targetId?: string;
    profile?: string;
}): Promise<BrowserActionTabResult>;
export declare function browserArmDialog(baseUrl: string | undefined, opts: {
    accept: boolean;
    promptText?: string;
    targetId?: string;
    timeoutMs?: number;
    profile?: string;
}): Promise<BrowserActionOk>;
export declare function browserArmFileChooser(baseUrl: string | undefined, opts: {
    paths: string[];
    ref?: string;
    inputRef?: string;
    element?: string;
    targetId?: string;
    timeoutMs?: number;
    profile?: string;
}): Promise<BrowserActionOk>;
export declare function browserWaitForDownload(baseUrl: string | undefined, opts: {
    path?: string;
    targetId?: string;
    timeoutMs?: number;
    profile?: string;
}): Promise<BrowserDownloadResult>;
export declare function browserDownload(baseUrl: string | undefined, opts: {
    ref: string;
    path: string;
    targetId?: string;
    timeoutMs?: number;
    profile?: string;
}): Promise<BrowserDownloadResult>;
export declare function browserAct(baseUrl: string | undefined, req: BrowserActRequest, opts?: {
    profile?: string;
}): Promise<BrowserActResponse>;
export declare function browserScreenshotAction(baseUrl: string | undefined, opts: {
    targetId?: string;
    fullPage?: boolean;
    ref?: string;
    element?: string;
    type?: "png" | "jpeg";
    profile?: string;
}): Promise<BrowserActionPathResult>;
export {};
