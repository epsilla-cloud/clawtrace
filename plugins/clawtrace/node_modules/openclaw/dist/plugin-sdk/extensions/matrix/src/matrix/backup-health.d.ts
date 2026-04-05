export type MatrixRoomKeyBackupStatusLike = {
    serverVersion: string | null;
    activeVersion: string | null;
    trusted: boolean | null;
    matchesDecryptionKey: boolean | null;
    decryptionKeyCached: boolean | null;
    keyLoadAttempted: boolean;
    keyLoadError: string | null;
};
export type MatrixRoomKeyBackupIssueCode = "missing-server-backup" | "key-load-failed" | "key-not-loaded" | "key-mismatch" | "untrusted-signature" | "inactive" | "indeterminate" | "ok";
export type MatrixRoomKeyBackupIssue = {
    code: MatrixRoomKeyBackupIssueCode;
    summary: string;
    message: string | null;
};
export declare function resolveMatrixRoomKeyBackupIssue(backup: MatrixRoomKeyBackupStatusLike): MatrixRoomKeyBackupIssue;
export declare function resolveMatrixRoomKeyBackupReadinessError(backup: MatrixRoomKeyBackupStatusLike, opts: {
    requireServerBackup: boolean;
}): string | null;
