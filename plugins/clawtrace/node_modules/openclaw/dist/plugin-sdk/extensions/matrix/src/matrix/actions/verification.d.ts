import type { MatrixActionClientOpts } from "./types.js";
export declare function listMatrixVerifications(opts?: MatrixActionClientOpts): Promise<import("../sdk/verification-manager.ts").MatrixVerificationSummary[]>;
export declare function requestMatrixVerification(params?: MatrixActionClientOpts & {
    ownUser?: boolean;
    userId?: string;
    deviceId?: string;
    roomId?: string;
}): Promise<import("../sdk/verification-manager.ts").MatrixVerificationSummary>;
export declare function acceptMatrixVerification(requestId: string, opts?: MatrixActionClientOpts): Promise<import("../sdk/verification-manager.ts").MatrixVerificationSummary>;
export declare function cancelMatrixVerification(requestId: string, opts?: MatrixActionClientOpts & {
    reason?: string;
    code?: string;
}): Promise<import("../sdk/verification-manager.ts").MatrixVerificationSummary>;
export declare function startMatrixVerification(requestId: string, opts?: MatrixActionClientOpts & {
    method?: "sas";
}): Promise<import("../sdk/verification-manager.ts").MatrixVerificationSummary>;
export declare function generateMatrixVerificationQr(requestId: string, opts?: MatrixActionClientOpts): Promise<{
    qrDataBase64: string;
}>;
export declare function scanMatrixVerificationQr(requestId: string, qrDataBase64: string, opts?: MatrixActionClientOpts): Promise<import("../sdk/verification-manager.ts").MatrixVerificationSummary>;
export declare function getMatrixVerificationSas(requestId: string, opts?: MatrixActionClientOpts): Promise<{
    decimal?: [number, number, number];
    emoji?: Array<[string, string]>;
}>;
export declare function confirmMatrixVerificationSas(requestId: string, opts?: MatrixActionClientOpts): Promise<import("../sdk/verification-manager.ts").MatrixVerificationSummary>;
export declare function mismatchMatrixVerificationSas(requestId: string, opts?: MatrixActionClientOpts): Promise<import("../sdk/verification-manager.ts").MatrixVerificationSummary>;
export declare function confirmMatrixVerificationReciprocateQr(requestId: string, opts?: MatrixActionClientOpts): Promise<import("../sdk/verification-manager.ts").MatrixVerificationSummary>;
export declare function getMatrixEncryptionStatus(opts?: MatrixActionClientOpts & {
    includeRecoveryKey?: boolean;
}): Promise<{
    pendingVerifications: number;
    recoveryKey?: string | null | undefined;
    encryptionEnabled: boolean;
    recoveryKeyStored: boolean;
    recoveryKeyCreatedAt: string | null;
}>;
export declare function getMatrixVerificationStatus(opts?: MatrixActionClientOpts & {
    includeRecoveryKey?: boolean;
}): Promise<{
    pendingVerifications: number;
    encryptionEnabled: boolean;
    userId: string | null;
    deviceId: string | null;
    verified: boolean;
    localVerified: boolean;
    crossSigningVerified: boolean;
    signedByOwner: boolean;
    recoveryKeyStored: boolean;
    recoveryKeyCreatedAt: string | null;
    recoveryKeyId: string | null;
    backupVersion: string | null;
    backup: import("../sdk.js").MatrixRoomKeyBackupStatus;
} | {
    recoveryKey: string | null;
    pendingVerifications: number;
    encryptionEnabled: boolean;
    userId: string | null;
    deviceId: string | null;
    verified: boolean;
    localVerified: boolean;
    crossSigningVerified: boolean;
    signedByOwner: boolean;
    recoveryKeyStored: boolean;
    recoveryKeyCreatedAt: string | null;
    recoveryKeyId: string | null;
    backupVersion: string | null;
    backup: import("../sdk.js").MatrixRoomKeyBackupStatus;
}>;
export declare function getMatrixRoomKeyBackupStatus(opts?: MatrixActionClientOpts): Promise<import("../sdk.js").MatrixRoomKeyBackupStatus>;
export declare function verifyMatrixRecoveryKey(recoveryKey: string, opts?: MatrixActionClientOpts): Promise<import("../sdk.js").MatrixRecoveryKeyVerificationResult>;
export declare function restoreMatrixRoomKeyBackup(opts?: MatrixActionClientOpts & {
    recoveryKey?: string;
}): Promise<import("../sdk.js").MatrixRoomKeyBackupRestoreResult>;
export declare function resetMatrixRoomKeyBackup(opts?: MatrixActionClientOpts): Promise<import("../sdk.js").MatrixRoomKeyBackupResetResult>;
export declare function bootstrapMatrixVerification(opts?: MatrixActionClientOpts & {
    recoveryKey?: string;
    forceResetCrossSigning?: boolean;
}): Promise<import("../sdk.js").MatrixVerificationBootstrapResult>;
