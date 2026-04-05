import type { MatrixDecryptBridge } from "./decrypt-bridge.js";
import type { MatrixRecoveryKeyStore } from "./recovery-key-store.js";
import type { MatrixCryptoBootstrapApi, MatrixRawEvent } from "./types.js";
import type { MatrixVerificationManager } from "./verification-manager.js";
export type MatrixCryptoBootstrapperDeps<TRawEvent extends MatrixRawEvent> = {
    getUserId: () => Promise<string>;
    getPassword?: () => string | undefined;
    getDeviceId: () => string | null | undefined;
    verificationManager: MatrixVerificationManager;
    recoveryKeyStore: MatrixRecoveryKeyStore;
    decryptBridge: Pick<MatrixDecryptBridge<TRawEvent>, "bindCryptoRetrySignals">;
};
export type MatrixCryptoBootstrapOptions = {
    forceResetCrossSigning?: boolean;
    allowAutomaticCrossSigningReset?: boolean;
    allowSecretStorageRecreateWithoutRecoveryKey?: boolean;
    strict?: boolean;
};
export type MatrixCryptoBootstrapResult = {
    crossSigningReady: boolean;
    crossSigningPublished: boolean;
    ownDeviceVerified: boolean | null;
};
export declare class MatrixCryptoBootstrapper<TRawEvent extends MatrixRawEvent> {
    private readonly deps;
    private verificationHandlerRegistered;
    constructor(deps: MatrixCryptoBootstrapperDeps<TRawEvent>);
    bootstrap(crypto: MatrixCryptoBootstrapApi, options?: MatrixCryptoBootstrapOptions): Promise<MatrixCryptoBootstrapResult>;
    private createSigningKeysUiAuthCallback;
    private bootstrapCrossSigning;
    private bootstrapSecretStorage;
    private registerVerificationRequestHandler;
    private ensureOwnDeviceTrust;
}
