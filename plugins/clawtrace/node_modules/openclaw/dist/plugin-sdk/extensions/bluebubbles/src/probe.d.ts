import type { BaseProbeResult } from "./runtime-api.js";
export type BlueBubblesProbe = BaseProbeResult & {
    status?: number | null;
};
export type BlueBubblesServerInfo = {
    os_version?: string;
    server_version?: string;
    private_api?: boolean;
    helper_connected?: boolean;
    proxy_service?: string;
    detected_icloud?: string;
    computer_id?: string;
};
/**
 * Fetch server info from BlueBubbles API and cache it.
 * Returns cached result if available and not expired.
 */
export declare function fetchBlueBubblesServerInfo(params: {
    baseUrl?: string | null;
    password?: string | null;
    accountId?: string;
    timeoutMs?: number;
    allowPrivateNetwork?: boolean;
}): Promise<BlueBubblesServerInfo | null>;
/**
 * Get cached server info synchronously (for use in describeMessageTool).
 * Returns null if not cached or expired.
 */
export declare function getCachedBlueBubblesServerInfo(accountId?: string): BlueBubblesServerInfo | null;
/**
 * Read cached private API capability for a BlueBubbles account.
 * Returns null when capability is unknown (for example, before first probe).
 */
export declare function getCachedBlueBubblesPrivateApiStatus(accountId?: string): boolean | null;
export declare function isBlueBubblesPrivateApiStatusEnabled(status: boolean | null): boolean;
export declare function isBlueBubblesPrivateApiEnabled(accountId?: string): boolean;
/**
 * Parse macOS version string (e.g., "15.0.1" or "26.0") into major version number.
 */
export declare function parseMacOSMajorVersion(version?: string | null): number | null;
/**
 * Check if the cached server info indicates macOS 26 or higher.
 * Returns false if no cached info is available (fail open for action listing).
 */
export declare function isMacOS26OrHigher(accountId?: string): boolean;
/** Clear the server info cache (for testing) */
export declare function clearServerInfoCache(): void;
export declare function probeBlueBubbles(params: {
    baseUrl?: string | null;
    password?: string | null;
    timeoutMs?: number;
    allowPrivateNetwork?: boolean;
}): Promise<BlueBubblesProbe>;
