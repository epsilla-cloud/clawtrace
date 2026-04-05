import type { MatrixCryptoBootstrapApi, MatrixCryptoCallbacks, MatrixStoredRecoveryKey } from "./types.js";
export declare function isRepairableSecretStorageAccessError(err: unknown): boolean;
export declare class MatrixRecoveryKeyStore {
    private readonly recoveryKeyPath?;
    private readonly secretStorageKeyCache;
    private stagedRecoveryKey;
    private readonly stagedCacheKeyIds;
    constructor(recoveryKeyPath?: string | undefined);
    buildCryptoCallbacks(): MatrixCryptoCallbacks;
    getRecoveryKeySummary(): {
        encodedPrivateKey?: string;
        keyId?: string | null;
        createdAt?: string;
    } | null;
    private resolveEncodedRecoveryKeyInput;
    storeEncodedRecoveryKey(params: {
        encodedPrivateKey: string;
        keyId?: string | null;
        keyInfo?: MatrixStoredRecoveryKey["keyInfo"];
    }): {
        encodedPrivateKey?: string;
        keyId?: string | null;
        createdAt?: string;
    };
    stageEncodedRecoveryKey(params: {
        encodedPrivateKey: string;
        keyId?: string | null;
        keyInfo?: MatrixStoredRecoveryKey["keyInfo"];
    }): void;
    commitStagedRecoveryKey(params?: {
        keyId?: string | null;
        keyInfo?: MatrixStoredRecoveryKey["keyInfo"];
    }): {
        encodedPrivateKey?: string;
        keyId?: string | null;
        createdAt?: string;
    } | null;
    discardStagedRecoveryKey(): void;
    bootstrapSecretStorageWithRecoveryKey(crypto: MatrixCryptoBootstrapApi, options?: {
        setupNewKeyBackup?: boolean;
        allowSecretStorageRecreateWithoutRecoveryKey?: boolean;
        forceNewSecretStorage?: boolean;
    }): Promise<void>;
    private clearStagedRecoveryKeyTracking;
    private rememberSecretStorageKey;
    private loadStoredRecoveryKey;
    private saveRecoveryKeyToDisk;
}
