import { type RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
import type { WebChannel } from "openclaw/plugin-sdk/text-runtime";
import { hasWebCredsSync, resolveWebCredsBackupPath, resolveWebCredsPath } from "./creds-files.js";
import { type WhatsAppSelfIdentity } from "./identity.js";
export { hasWebCredsSync, resolveWebCredsBackupPath, resolveWebCredsPath };
export declare function resolveDefaultWebAuthDir(): string;
export declare const WA_WEB_AUTH_DIR: string;
export declare function readCredsJsonRaw(filePath: string): string | null;
export declare function maybeRestoreCredsFromBackup(authDir: string): void;
export declare function webAuthExists(authDir?: string): Promise<boolean>;
export declare function logoutWeb(params: {
    authDir?: string;
    isLegacyAuthDir?: boolean;
    runtime?: RuntimeEnv;
}): Promise<boolean>;
export declare function readWebSelfId(authDir?: string): {
    readonly e164: string | null;
    readonly jid: string | null;
    readonly lid: string | null;
};
export declare function readWebSelfIdentity(authDir?: string, fallback?: {
    id?: string | null;
    lid?: string | null;
} | null): Promise<WhatsAppSelfIdentity>;
/**
 * Return the age (in milliseconds) of the cached WhatsApp web auth state, or null when missing.
 * Helpful for heartbeats/observability to spot stale credentials.
 */
export declare function getWebAuthAgeMs(authDir?: string): number | null;
export declare function logWebSelfId(authDir?: string, runtime?: RuntimeEnv, includeChannelPrefix?: boolean): void;
export declare function pickWebChannel(pref: WebChannel | "auto", authDir?: string): Promise<WebChannel>;
