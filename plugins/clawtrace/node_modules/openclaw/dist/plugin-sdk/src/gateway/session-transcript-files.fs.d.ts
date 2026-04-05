import { type SessionArchiveReason } from "../config/sessions.js";
export type ArchiveFileReason = SessionArchiveReason;
export declare function resolveSessionTranscriptCandidates(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): string[];
export declare function archiveFileOnDisk(filePath: string, reason: ArchiveFileReason): string;
export declare function archiveSessionTranscripts(opts: {
    sessionId: string;
    storePath: string | undefined;
    sessionFile?: string;
    agentId?: string;
    reason: "reset" | "deleted";
    /**
     * When true, only archive files resolved under the session store directory.
     * This prevents maintenance operations from mutating paths outside the agent sessions dir.
     */
    restrictToStoreDir?: boolean;
}): string[];
export declare function cleanupArchivedSessionTranscripts(opts: {
    directories: string[];
    olderThanMs: number;
    reason?: ArchiveFileReason;
    nowMs?: number;
}): Promise<{
    removed: number;
    scanned: number;
}>;
