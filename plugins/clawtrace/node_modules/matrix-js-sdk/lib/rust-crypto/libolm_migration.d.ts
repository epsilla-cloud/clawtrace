import * as RustSdkCryptoJs from "@matrix-org/matrix-sdk-crypto-wasm";
import { type Logger } from "../logger.ts";
import { type CryptoStore } from "../crypto/store/base.ts";
import { type IHttpOpts, type MatrixHttpApi } from "../http-api/index.ts";
import { type RustCrypto } from "./rust-crypto.ts";
/**
 * Determine if any data needs migrating from the legacy store, and do so.
 *
 * This migrates the base account data, and olm and megolm sessions. It does *not* migrate the room list, which should
 * happen after an `OlmMachine` is created, via {@link migrateRoomSettingsFromLegacyCrypto}.
 *
 * @param args - Arguments object.
 */
export declare function migrateFromLegacyCrypto(args: {
    /** A `Logger` instance that will be used for debug output. */
    logger: Logger;
    /**
     * Low-level HTTP interface: used to make outgoing requests required by the rust SDK.
     * We expect it to set the access token, etc.
     */
    http: MatrixHttpApi<IHttpOpts & {
        onlyData: true;
    }>;
    /** Store to migrate data from. */
    legacyStore: CryptoStore;
    /** Pickle key for `legacyStore`. */
    legacyPickleKey?: string;
    /** Local user's User ID. */
    userId: string;
    /** Local user's Device ID. */
    deviceId: string;
    /** Rust crypto store to migrate data into. */
    storeHandle: RustSdkCryptoJs.StoreHandle;
    /**
     * A callback which will receive progress updates on migration from `legacyStore`.
     *
     * Called with (-1, -1) to mark the end of migration.
     */
    legacyMigrationProgressListener?: (progress: number, total: number) => void;
}): Promise<void>;
/**
 * Determine if any room settings need migrating from the legacy store, and do so.
 *
 * @param args - Arguments object.
 */
export declare function migrateRoomSettingsFromLegacyCrypto({ logger, legacyStore, olmMachine, }: {
    /** A `Logger` instance that will be used for debug output. */
    logger: Logger;
    /** Store to migrate data from. */
    legacyStore: CryptoStore;
    /** OlmMachine to store the new data on. */
    olmMachine: RustSdkCryptoJs.OlmMachine;
}): Promise<void>;
/**
 * Check if the user's published identity (ie, public cross-signing keys) was trusted by the legacy session,
 * and if so mark it as trusted in the Rust session if needed.
 *
 * By default, if the legacy session didn't have the private MSK, the migrated session will revert to unverified,
 * even if the user has verified the session in the past.
 *
 * This only occurs if the private MSK was not cached in the crypto store (USK and SSK private keys won't help
 * to establish trust: the trust is rooted in the MSK).
 *
 * Rust crypto will only consider the current session as trusted if we import the private MSK itself.
 *
 * We could prompt the user to verify the session again, but it's probably better to just mark the user identity
 * as locally verified if it was before.
 *
 * See https://github.com/element-hq/element-web/issues/27079
 *
 * @param args - Argument object.
 */
export declare function migrateLegacyLocalTrustIfNeeded(args: {
    /** The legacy crypto store that is migrated. */
    legacyCryptoStore: CryptoStore;
    /** The migrated rust crypto stack. */
    rustCrypto: RustCrypto;
    /** The logger to use */
    logger: Logger;
}): Promise<void>;
//# sourceMappingURL=libolm_migration.d.ts.map