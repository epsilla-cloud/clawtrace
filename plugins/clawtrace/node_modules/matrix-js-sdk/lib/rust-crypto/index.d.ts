import { RustCrypto } from "./rust-crypto.ts";
import { type IHttpOpts, type MatrixHttpApi } from "../http-api/index.ts";
import { type ServerSideSecretStorage } from "../secret-storage.ts";
import { type Logger } from "../logger.ts";
import { type CryptoStore } from "../crypto/store/base.ts";
import { type CryptoCallbacks } from "../crypto-api/index.ts";
/**
 * Create a new `RustCrypto` implementation
 *
 * @param args - Parameter object
 * @internal
 */
export declare function initRustCrypto(args: {
    /** A `Logger` instance that will be used for debug output. */
    logger: Logger;
    /**
     * Low-level HTTP interface: used to make outgoing requests required by the rust SDK.
     * We expect it to set the access token, etc.
     */
    http: MatrixHttpApi<IHttpOpts & {
        onlyData: true;
    }>;
    /** The local user's User ID. */
    userId: string;
    /** The local user's Device ID. */
    deviceId: string;
    /** Interface to server-side secret storage. */
    secretStorage: ServerSideSecretStorage;
    /** Crypto callbacks provided by the application. */
    cryptoCallbacks: CryptoCallbacks;
    /**
     * The prefix to use on the indexeddbs created by rust-crypto.
     * If `null`, a memory store will be used.
     */
    storePrefix: string | null;
    /**
     * A passphrase to use to encrypt the indexeddb created by rust-crypto.
     *
     * Ignored if `storePrefix` is null, or `storeKey` is set.  If neither this nor `storeKey` is set
     * (and `storePrefix` is not null), the indexeddb will be unencrypted.
     */
    storePassphrase?: string;
    /**
     * A key to use to encrypt the indexeddb created by rust-crypto.
     *
     * Ignored if `storePrefix` is null. Otherwise, if it is set, it must be a 32-byte cryptographic key, which
     * will be used to encrypt the indexeddb. See also `storePassphrase`.
     */
    storeKey?: Uint8Array;
    /** If defined, we will check if any data needs migrating from this store to the rust store. */
    legacyCryptoStore?: CryptoStore;
    /** The pickle key for `legacyCryptoStore` */
    legacyPickleKey?: string;
    /**
     * A callback which will receive progress updates on migration from `legacyCryptoStore`.
     *
     * Called with (-1, -1) to mark the end of migration.
     */
    legacyMigrationProgressListener?: (progress: number, total: number) => void;
    /**
     * Whether to enable support for encrypting state events.
     */
    enableEncryptedStateEvents?: boolean;
}): Promise<RustCrypto>;
//# sourceMappingURL=index.d.ts.map