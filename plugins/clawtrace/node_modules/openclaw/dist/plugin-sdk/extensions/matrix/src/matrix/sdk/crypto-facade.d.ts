import type { MatrixRecoveryKeyStore } from "./recovery-key-store.js";
import type { EncryptedFile } from "./types.js";
import type { MatrixVerificationManager, MatrixVerificationMethod, MatrixVerificationSummary } from "./verification-manager.js";
type MatrixCryptoFacadeClient = {
    getRoom: (roomId: string) => {
        hasEncryptionStateEvent: () => boolean;
    } | null;
    getCrypto: () => unknown;
};
export type MatrixCryptoFacade = {
    prepare: (joinedRooms: string[]) => Promise<void>;
    updateSyncData: (toDeviceMessages: unknown, otkCounts: unknown, unusedFallbackKeyAlgs: unknown, changedDeviceLists: unknown, leftDeviceLists: unknown) => Promise<void>;
    isRoomEncrypted: (roomId: string) => Promise<boolean>;
    requestOwnUserVerification: () => Promise<unknown | null>;
    encryptMedia: (buffer: Buffer) => Promise<{
        buffer: Buffer;
        file: Omit<EncryptedFile, "url">;
    }>;
    decryptMedia: (file: EncryptedFile, opts?: {
        maxBytes?: number;
        readIdleTimeoutMs?: number;
    }) => Promise<Buffer>;
    getRecoveryKey: () => Promise<{
        encodedPrivateKey?: string;
        keyId?: string | null;
        createdAt?: string;
    } | null>;
    listVerifications: () => Promise<MatrixVerificationSummary[]>;
    ensureVerificationDmTracked: (params: {
        roomId: string;
        userId: string;
    }) => Promise<MatrixVerificationSummary | null>;
    requestVerification: (params: {
        ownUser?: boolean;
        userId?: string;
        deviceId?: string;
        roomId?: string;
    }) => Promise<MatrixVerificationSummary>;
    acceptVerification: (id: string) => Promise<MatrixVerificationSummary>;
    cancelVerification: (id: string, params?: {
        reason?: string;
        code?: string;
    }) => Promise<MatrixVerificationSummary>;
    startVerification: (id: string, method?: MatrixVerificationMethod) => Promise<MatrixVerificationSummary>;
    generateVerificationQr: (id: string) => Promise<{
        qrDataBase64: string;
    }>;
    scanVerificationQr: (id: string, qrDataBase64: string) => Promise<MatrixVerificationSummary>;
    confirmVerificationSas: (id: string) => Promise<MatrixVerificationSummary>;
    mismatchVerificationSas: (id: string) => Promise<MatrixVerificationSummary>;
    confirmVerificationReciprocateQr: (id: string) => Promise<MatrixVerificationSummary>;
    getVerificationSas: (id: string) => Promise<{
        decimal?: [number, number, number];
        emoji?: Array<[string, string]>;
    }>;
};
export declare function createMatrixCryptoFacade(deps: {
    client: MatrixCryptoFacadeClient;
    verificationManager: MatrixVerificationManager;
    recoveryKeyStore: MatrixRecoveryKeyStore;
    getRoomStateEvent: (roomId: string, eventType: string, stateKey?: string) => Promise<Record<string, unknown>>;
    downloadContent: (mxcUrl: string, opts?: {
        maxBytes?: number;
        readIdleTimeoutMs?: number;
    }) => Promise<Buffer>;
}): MatrixCryptoFacade;
export {};
