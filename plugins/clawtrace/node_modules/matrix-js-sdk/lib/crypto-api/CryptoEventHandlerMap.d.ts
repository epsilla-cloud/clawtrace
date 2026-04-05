import { type CryptoEvent } from "./CryptoEvent.ts";
import { type VerificationRequest } from "./verification.ts";
import { type UserVerificationStatus } from "./index.ts";
import { type RustBackupCryptoEventMap } from "../rust-crypto/backup.ts";
import { type EmptyObject } from "../@types/common.ts";
/**
 * A map of the {@link CryptoEvent} fired by the {@link CryptoApi} and their payloads.
 */
export type CryptoEventHandlerMap = {
    [CryptoEvent.VerificationRequestReceived]: (request: VerificationRequest) => void;
    [CryptoEvent.UserTrustStatusChanged]: (userId: string, userTrustLevel: UserVerificationStatus) => void;
    [CryptoEvent.KeyBackupDecryptionKeyCached]: (version: string) => void;
    [CryptoEvent.KeysChanged]: (data: EmptyObject) => void;
    [CryptoEvent.WillUpdateDevices]: (users: string[], initialFetch: boolean) => void;
    [CryptoEvent.DevicesUpdated]: (users: string[], initialFetch: boolean) => void;
    [CryptoEvent.LegacyCryptoStoreMigrationProgress]: (progress: number, total: number) => void;
    [CryptoEvent.DehydratedDeviceCreated]: () => void;
    [CryptoEvent.DehydratedDeviceUploaded]: () => void;
    [CryptoEvent.RehydrationStarted]: () => void;
    [CryptoEvent.RehydrationProgress]: (roomKeyCount: number, toDeviceCount: number) => void;
    [CryptoEvent.RehydrationCompleted]: () => void;
    [CryptoEvent.RehydrationError]: (msg: string) => void;
    [CryptoEvent.DehydrationKeyCached]: () => void;
    [CryptoEvent.DehydratedDeviceRotationError]: (msg: string) => void;
} & RustBackupCryptoEventMap;
//# sourceMappingURL=CryptoEventHandlerMap.d.ts.map