import type { ResolvedBrowserConfig } from "./config.js";
export type BrowserExecutable = {
    kind: "brave" | "canary" | "chromium" | "chrome" | "custom" | "edge";
    path: string;
};
export declare function findChromeExecutableMac(): BrowserExecutable | null;
export declare function findGoogleChromeExecutableMac(): BrowserExecutable | null;
export declare function findChromeExecutableLinux(): BrowserExecutable | null;
export declare function findGoogleChromeExecutableLinux(): BrowserExecutable | null;
export declare function findChromeExecutableWindows(): BrowserExecutable | null;
export declare function findGoogleChromeExecutableWindows(): BrowserExecutable | null;
export declare function resolveGoogleChromeExecutableForPlatform(platform: NodeJS.Platform): BrowserExecutable | null;
export declare function readBrowserVersion(executablePath: string): string | null;
export declare function parseBrowserMajorVersion(rawVersion: string | null | undefined): number | null;
export declare function resolveBrowserExecutableForPlatform(resolved: ResolvedBrowserConfig, platform: NodeJS.Platform): BrowserExecutable | null;
