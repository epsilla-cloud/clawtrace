export type BrowserTransport = "cdp" | "chrome-mcp";
export type BrowserStatus = {
    enabled: boolean;
    profile?: string;
    driver?: "openclaw" | "existing-session";
    transport?: BrowserTransport;
    running: boolean;
    cdpReady?: boolean;
    cdpHttp?: boolean;
    pid: number | null;
    cdpPort: number | null;
    cdpUrl?: string | null;
    chosenBrowser: string | null;
    detectedBrowser?: string | null;
    detectedExecutablePath?: string | null;
    detectError?: string | null;
    userDataDir: string | null;
    color: string;
    headless: boolean;
    noSandbox?: boolean;
    executablePath?: string | null;
    attachOnly: boolean;
};
export type ProfileStatus = {
    name: string;
    transport?: BrowserTransport;
    cdpPort: number | null;
    cdpUrl: string | null;
    color: string;
    driver: "openclaw" | "existing-session";
    running: boolean;
    tabCount: number;
    isDefault: boolean;
    isRemote: boolean;
    missingFromConfig?: boolean;
    reconcileReason?: string | null;
};
export type BrowserResetProfileResult = {
    ok: true;
    moved: boolean;
    from: string;
    to?: string;
};
export type BrowserTab = {
    targetId: string;
    title: string;
    url: string;
    wsUrl?: string;
    type?: string;
};
export type SnapshotAriaNode = {
    ref: string;
    role: string;
    name: string;
    value?: string;
    description?: string;
    backendDOMNodeId?: number;
    depth: number;
};
export type SnapshotResult = {
    ok: true;
    format: "aria";
    targetId: string;
    url: string;
    nodes: SnapshotAriaNode[];
} | {
    ok: true;
    format: "ai";
    targetId: string;
    url: string;
    snapshot: string;
    truncated?: boolean;
    refs?: Record<string, {
        role: string;
        name?: string;
        nth?: number;
    }>;
    stats?: {
        lines: number;
        chars: number;
        refs: number;
        interactive: number;
    };
    labels?: boolean;
    labelsCount?: number;
    labelsSkipped?: number;
    imagePath?: string;
    imageType?: "png" | "jpeg";
};
export declare function browserStatus(baseUrl?: string, opts?: {
    profile?: string;
}): Promise<BrowserStatus>;
export declare function browserProfiles(baseUrl?: string): Promise<ProfileStatus[]>;
export declare function browserStart(baseUrl?: string, opts?: {
    profile?: string;
}): Promise<void>;
export declare function browserStop(baseUrl?: string, opts?: {
    profile?: string;
}): Promise<void>;
export declare function browserResetProfile(baseUrl?: string, opts?: {
    profile?: string;
}): Promise<BrowserResetProfileResult>;
export type BrowserCreateProfileResult = {
    ok: true;
    profile: string;
    transport?: BrowserTransport;
    cdpPort: number | null;
    cdpUrl: string | null;
    userDataDir: string | null;
    color: string;
    isRemote: boolean;
};
export declare function browserCreateProfile(baseUrl: string | undefined, opts: {
    name: string;
    color?: string;
    cdpUrl?: string;
    userDataDir?: string;
    driver?: "openclaw" | "existing-session";
}): Promise<BrowserCreateProfileResult>;
export type BrowserDeleteProfileResult = {
    ok: true;
    profile: string;
    deleted: boolean;
};
export declare function browserDeleteProfile(baseUrl: string | undefined, profile: string): Promise<BrowserDeleteProfileResult>;
export declare function browserTabs(baseUrl?: string, opts?: {
    profile?: string;
}): Promise<BrowserTab[]>;
export declare function browserOpenTab(baseUrl: string | undefined, url: string, opts?: {
    profile?: string;
}): Promise<BrowserTab>;
export declare function browserFocusTab(baseUrl: string | undefined, targetId: string, opts?: {
    profile?: string;
}): Promise<void>;
export declare function browserCloseTab(baseUrl: string | undefined, targetId: string, opts?: {
    profile?: string;
}): Promise<void>;
export declare function browserTabAction(baseUrl: string | undefined, opts: {
    action: "list" | "new" | "close" | "select";
    index?: number;
    profile?: string;
}): Promise<unknown>;
export declare function browserSnapshot(baseUrl: string | undefined, opts: {
    format?: "aria" | "ai";
    targetId?: string;
    limit?: number;
    maxChars?: number;
    refs?: "role" | "aria";
    interactive?: boolean;
    compact?: boolean;
    depth?: number;
    selector?: string;
    frame?: string;
    labels?: boolean;
    mode?: "efficient";
    profile?: string;
}): Promise<SnapshotResult>;
