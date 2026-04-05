import { type Logger } from "../../logger.ts";
import { type CryptoStore, type ISession, type SessionExtended, type ISessionInfo, type IWithheld, MigrationState, type Mode, type SecretStorePrivateKeys, type InboundGroupSessionData, type IRoomEncryption } from "./base.ts";
import { type CrossSigningKeyInfo } from "../../crypto-api/index.ts";
/**
 * An implementation of CryptoStore, which is normally backed by an indexeddb,
 * but with fallback to MemoryCryptoStore.
 */
export declare class IndexedDBCryptoStore implements CryptoStore {
    private readonly indexedDB;
    private readonly dbName;
    static STORE_ACCOUNT: string;
    static STORE_SESSIONS: string;
    static STORE_INBOUND_GROUP_SESSIONS: string;
    static STORE_INBOUND_GROUP_SESSIONS_WITHHELD: string;
    static STORE_SHARED_HISTORY_INBOUND_GROUP_SESSIONS: string;
    static STORE_PARKED_SHARED_HISTORY: string;
    static STORE_DEVICE_DATA: string;
    static STORE_ROOMS: string;
    static STORE_BACKUP: string;
    static exists(indexedDB: IDBFactory, dbName: string): Promise<boolean>;
    /**
     * Utility to check if a legacy crypto store exists and has not been migrated.
     * Returns true if the store exists and has not been migrated, false otherwise.
     */
    static existsAndIsNotMigrated(indexedDb: IDBFactory, dbName: string): Promise<boolean>;
    private backendPromise?;
    private backend?;
    /**
     * Create a new IndexedDBCryptoStore
     *
     * @param indexedDB -  global indexedDB instance
     * @param dbName -   name of db to connect to
     */
    constructor(indexedDB: IDBFactory, dbName: string);
    /**
     * Returns true if this CryptoStore has ever been initialised (ie, it might contain data).
     *
     * Implementation of {@link CryptoStore.containsData}.
     *
     * @internal
     */
    containsData(): Promise<boolean>;
    /**
     * Ensure the database exists and is up-to-date, or fall back to
     * a local storage or in-memory store.
     *
     * This must be called before the store can be used.
     *
     * @returns resolves to either an IndexedDBCryptoStoreBackend.Backend,
     * or a MemoryCryptoStore
     */
    startup(): Promise<CryptoStore>;
    /**
     * Delete all data from this store.
     *
     * @returns resolves when the store has been cleared.
     */
    deleteAllData(): Promise<void>;
    /**
     * Get data on how much of the libolm to Rust Crypto migration has been done.
     *
     * Implementation of {@link CryptoStore.getMigrationState}.
     *
     * @internal
     */
    getMigrationState(): Promise<MigrationState>;
    /**
     * Set data on how much of the libolm to Rust Crypto migration has been done.
     *
     * Implementation of {@link CryptoStore.setMigrationState}.
     *
     * @internal
     */
    setMigrationState(migrationState: MigrationState): Promise<void>;
    getAccount(txn: IDBTransaction, func: (accountPickle: string | null) => void): void;
    /**
     * Write the account pickle to the store.
     * This requires an active transaction. See doTxn().
     *
     * @param txn - An active transaction. See doTxn().
     * @param accountPickle - The new account pickle to store.
     */
    storeAccount(txn: IDBTransaction, accountPickle: string): void;
    /**
     * Get the public part of the cross-signing keys (eg. self-signing key,
     * user signing key).
     *
     * @param txn - An active transaction. See doTxn().
     * @param func - Called with the account keys object:
     *        `{ key_type: base64 encoded seed }` where key type = user_signing_key_seed or self_signing_key_seed
     */
    getCrossSigningKeys(txn: IDBTransaction, func: (keys: Record<string, CrossSigningKeyInfo> | null) => void): void;
    /**
     * @param txn - An active transaction. See doTxn().
     * @param func - Called with the private key
     * @param type - A key type
     */
    getSecretStorePrivateKey<K extends keyof SecretStorePrivateKeys>(txn: IDBTransaction, func: (key: SecretStorePrivateKeys[K] | null) => void, type: K): void;
    /**
     * Write the cross-signing private keys back to the store
     *
     * @param txn - An active transaction. See doTxn().
     * @param type - The type of cross-signing private key to store
     * @param key - keys object as getCrossSigningKeys()
     */
    storeSecretStorePrivateKey<K extends keyof SecretStorePrivateKeys>(txn: IDBTransaction, type: K, key: SecretStorePrivateKeys[K]): void;
    /**
     * Returns the number of end-to-end sessions in the store
     * @param txn - An active transaction. See doTxn().
     * @param func - Called with the count of sessions
     */
    countEndToEndSessions(txn: IDBTransaction, func: (count: number) => void): void;
    /**
     * Retrieve a specific end-to-end session between the logged-in user
     * and another device.
     * @param deviceKey - The public key of the other device.
     * @param sessionId - The ID of the session to retrieve
     * @param txn - An active transaction. See doTxn().
     * @param func - Called with A map from sessionId
     *     to session information object with 'session' key being the
     *     Base64 end-to-end session and lastReceivedMessageTs being the
     *     timestamp in milliseconds at which the session last received
     *     a message.
     */
    getEndToEndSession(deviceKey: string, sessionId: string, txn: IDBTransaction, func: (session: ISessionInfo | null) => void): void;
    /**
     * Retrieve the end-to-end sessions between the logged-in user and another
     * device.
     * @param deviceKey - The public key of the other device.
     * @param txn - An active transaction. See doTxn().
     * @param func - Called with A map from sessionId
     *     to session information object with 'session' key being the
     *     Base64 end-to-end session and lastReceivedMessageTs being the
     *     timestamp in milliseconds at which the session last received
     *     a message.
     */
    getEndToEndSessions(deviceKey: string, txn: IDBTransaction, func: (sessions: {
        [sessionId: string]: ISessionInfo;
    }) => void): void;
    /**
     * Store a session between the logged-in user and another device
     * @param deviceKey - The public key of the other device.
     * @param sessionId - The ID for this end-to-end session.
     * @param sessionInfo - Session information object
     * @param txn - An active transaction. See doTxn().
     */
    storeEndToEndSession(deviceKey: string, sessionId: string, sessionInfo: ISessionInfo, txn: IDBTransaction): void;
    /**
     * Count the number of Megolm sessions in the database.
     *
     * Implementation of {@link CryptoStore.countEndToEndInboundGroupSessions}.
     *
     * @internal
     */
    countEndToEndInboundGroupSessions(): Promise<number>;
    /**
     * Fetch a batch of Olm sessions from the database.
     *
     * Implementation of {@link CryptoStore.getEndToEndSessionsBatch}.
     *
     * @internal
     */
    getEndToEndSessionsBatch(): Promise<null | ISessionInfo[]>;
    /**
     * Delete a batch of Olm sessions from the database.
     *
     * Implementation of {@link CryptoStore.deleteEndToEndSessionsBatch}.
     *
     * @internal
     */
    deleteEndToEndSessionsBatch(sessions: {
        deviceKey: string;
        sessionId: string;
    }[]): Promise<void>;
    /**
     * Retrieve the end-to-end inbound group session for a given
     * server key and session ID
     * @param senderCurve25519Key - The sender's curve 25519 key
     * @param sessionId - The ID of the session
     * @param txn - An active transaction. See doTxn().
     * @param func - Called with A map from sessionId
     *     to Base64 end-to-end session.
     */
    getEndToEndInboundGroupSession(senderCurve25519Key: string, sessionId: string, txn: IDBTransaction, func: (groupSession: InboundGroupSessionData | null, groupSessionWithheld: IWithheld | null) => void): void;
    /**
     * Writes an end-to-end inbound group session to the store.
     * If there already exists an inbound group session with the same
     * senderCurve25519Key and sessionID, it will be overwritten.
     * @param senderCurve25519Key - The sender's curve 25519 key
     * @param sessionId - The ID of the session
     * @param sessionData - The session data structure
     * @param txn - An active transaction. See doTxn().
     */
    storeEndToEndInboundGroupSession(senderCurve25519Key: string, sessionId: string, sessionData: InboundGroupSessionData, txn: IDBTransaction): void;
    /**
     * Fetch a batch of Megolm sessions from the database.
     *
     * Implementation of {@link CryptoStore.getEndToEndInboundGroupSessionsBatch}.
     *
     * @internal
     */
    getEndToEndInboundGroupSessionsBatch(): Promise<SessionExtended[] | null>;
    /**
     * Delete a batch of Megolm sessions from the database.
     *
     * Implementation of {@link CryptoStore.deleteEndToEndInboundGroupSessionsBatch}.
     *
     * @internal
     */
    deleteEndToEndInboundGroupSessionsBatch(sessions: {
        senderKey: string;
        sessionId: string;
    }[]): Promise<void>;
    /**
     * Get an object of `roomId->roomInfo` for all e2e rooms in the store
     * @param txn - An active transaction. See doTxn().
     * @param func - Function called with the end-to-end encrypted rooms
     */
    getEndToEndRooms(txn: IDBTransaction, func: (rooms: Record<string, IRoomEncryption>) => void): void;
    /**
     * Mark sessions as needing to be backed up.
     * @param sessions - The sessions that need to be backed up.
     * @param txn - An active transaction. See doTxn(). (optional)
     * @returns resolves when the sessions are marked
     */
    markSessionsNeedingBackup(sessions: ISession[], txn?: IDBTransaction): Promise<void>;
    /**
     * Perform a transaction on the crypto store. Any store methods
     * that require a transaction (txn) object to be passed in may
     * only be called within a callback of either this function or
     * one of the store functions operating on the same transaction.
     *
     * @param mode - 'readwrite' if you need to call setter
     *     functions with this transaction. Otherwise, 'readonly'.
     * @param stores - List IndexedDBCryptoStore.STORE_*
     *     options representing all types of object that will be
     *     accessed or written to with this transaction.
     * @param func - Function called with the
     *     transaction object: an opaque object that should be passed
     *     to store functions.
     * @param log - A possibly customised log
     * @returns Promise that resolves with the result of the `func`
     *     when the transaction is complete. If the backend is
     *     async (ie. the indexeddb backend) any of the callback
     *     functions throwing an exception will cause this promise to
     *     reject with that exception. On synchronous backends, the
     *     exception will propagate to the caller of the getFoo method.
     */
    doTxn<T>(mode: Mode, stores: Iterable<string>, func: (txn: IDBTransaction) => T, log?: Logger): Promise<T>;
}
//# sourceMappingURL=indexeddb-crypto-store.d.ts.map