import { type ChildProcess } from "node:child_process";
import type { SsrFPolicy } from "../infra/net/ssrf.js";
import { type BrowserExecutable } from "./chrome.executables.js";
import type { ResolvedBrowserConfig, ResolvedBrowserProfile } from "./config.js";
export type { BrowserExecutable } from "./chrome.executables.js";
export { findChromeExecutableLinux, findChromeExecutableMac, findChromeExecutableWindows, resolveBrowserExecutableForPlatform, } from "./chrome.executables.js";
export { decorateOpenClawProfile, ensureProfileCleanExit, isProfileDecorated, } from "./chrome.profile-decoration.js";
export type RunningChrome = {
    pid: number;
    exe: BrowserExecutable;
    userDataDir: string;
    cdpPort: number;
    startedAt: number;
    proc: ChildProcess;
};
export declare function resolveOpenClawUserDataDir(profileName?: string): string;
export declare function buildOpenClawChromeLaunchArgs(params: {
    resolved: ResolvedBrowserConfig;
    profile: ResolvedBrowserProfile;
    userDataDir: string;
}): string[];
export declare function isChromeReachable(cdpUrl: string, timeoutMs?: number, ssrfPolicy?: SsrFPolicy): Promise<boolean>;
export declare function getChromeWebSocketUrl(cdpUrl: string, timeoutMs?: number, ssrfPolicy?: SsrFPolicy): Promise<string | null>;
export declare function isChromeCdpReady(cdpUrl: string, timeoutMs?: number, handshakeTimeoutMs?: number, ssrfPolicy?: SsrFPolicy): Promise<boolean>;
export declare function launchOpenClawChrome(resolved: ResolvedBrowserConfig, profile: ResolvedBrowserProfile): Promise<RunningChrome>;
export declare function stopOpenClawChrome(running: RunningChrome, timeoutMs?: number): Promise<void>;
