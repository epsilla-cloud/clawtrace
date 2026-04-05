import { makeWASocket } from "@whiskeysockets/baileys";
export { formatError, getStatusCode } from "./session-errors.js";
export { getWebAuthAgeMs, logoutWeb, logWebSelfId, pickWebChannel, readWebSelfId, WA_WEB_AUTH_DIR, webAuthExists, } from "./auth-store.js";
/**
 * Create a Baileys socket backed by the multi-file auth store we keep on disk.
 * Consumers can opt into QR printing for interactive login flows.
 */
export declare function createWaSocket(printQr: boolean, verbose: boolean, opts?: {
    authDir?: string;
    onQr?: (qr: string) => void;
}): Promise<ReturnType<typeof makeWASocket>>;
export declare function waitForWaConnection(sock: ReturnType<typeof makeWASocket>): Promise<void>;
/** Await pending credential saves — scoped to one authDir, or all if omitted. */
export declare function waitForCredsSaveQueue(authDir?: string): Promise<void>;
/** Await pending credential saves, but don't hang forever on stalled I/O. */
export declare function waitForCredsSaveQueueWithTimeout(authDir: string, timeoutMs?: number): Promise<void>;
export declare function newConnectionId(): `${string}-${string}-${string}-${string}-${string}`;
