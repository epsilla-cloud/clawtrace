import { type Logger } from "../../logger.ts";
import { type CryptoStore, type IDeviceData, type ISession, type SessionExtended, type ISessionInfo, type IWithheld, MigrationState, type Mode, type SecretStorePrivateKeys, type InboundGroupSessionData, type IRoomEncryption } from "./base.ts";
import { type CrossSigningKeyInfo } from "../../crypto-api/index.ts";
/**
 * Implementation of a CryptoStore which is backed by an existing
 * IndexedDB connection. Generally you want IndexedDBCryptoStore
 * which connects to the database and defers to one of these.
 *
 * @internal
 */
export declare class Backend implements CryptoStore {
    private db;
    private nextTxnId;
    /**
     */
    constructor(db: IDBDatabase);
    containsData(): Promise<boolean>;
    startup(): Promise<CryptoStore>;
    deleteAllData(): Promise<void>;
    /**
     * Get data on how much of the libolm to Rust Crypto migration has been done.
     *
     * Implementation of {@link CryptoStore.getMigrationState}.
     */
    getMigrationState(): Promise<MigrationState>;
    /**
     * Set data on how much of the libolm to Rust Crypto migration has been done.
     *
     * Implementation of {@link CryptoStore.setMigrationState}.
     */
    setMigrationState(migrationState: MigrationState): Promise<void>;
    getAccount(txn: IDBTransaction, func: (accountPickle: string | null) => void): void;
    storeAccount(txn: IDBTransaction, accountPickle: string): void;
    getCrossSigningKeys(txn: IDBTransaction, func: (keys: Record<string, CrossSigningKeyInfo> | null) => void): void;
    getSecretStorePrivateKey<K extends keyof SecretStorePrivateKeys>(txn: IDBTransaction, func: (key: SecretStorePrivateKeys[K] | null) => void, type: K): void;
    storeSecretStorePrivateKey<K extends keyof SecretStorePrivateKeys>(txn: IDBTransaction, type: K, key: SecretStorePrivateKeys[K]): void;
    countEndToEndSessions(txn: IDBTransaction, func: (count: number) => void): void;
    getEndToEndSessions(deviceKey: string, txn: IDBTransaction, func: (sessions: {
        [sessionId: string]: ISessionInfo;
    }) => void): void;
    getEndToEndSession(deviceKey: string, sessionId: string, txn: IDBTransaction, func: (session: ISessionInfo | null) => void): void;
    storeEndToEndSession(deviceKey: string, sessionId: string, sessionInfo: ISessionInfo, txn: IDBTransaction): void;
    /**
     * Fetch a batch of Olm sessions from the database.
     *
     * Implementation of {@link CryptoStore.getEndToEndSessionsBatch}.
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
    getEndToEndInboundGroupSession(senderCurve25519Key: string, sessionId: string, txn: IDBTransaction, func: (groupSession: InboundGroupSessionData | null, groupSessionWithheld: IWithheld | null) => void): void;
    storeEndToEndInboundGroupSession(senderCurve25519Key: string, sessionId: string, sessionData: InboundGroupSessionData, txn: IDBTransaction): void;
    /**
     * Count the number of Megolm sessions in the database.
     *
     * Implementation of {@link CryptoStore.countEndToEndInboundGroupSessions}.
     *
     * @internal
     */
    countEndToEndInboundGroupSessions(): Promise<number>;
    /**
     * Fetch a batch of Megolm sessions from the database.
     *
     * Implementation of {@link CryptoStore.getEndToEndInboundGroupSessionsBatch}.
     */
    getEndToEndInboundGroupSessionsBatch(): Promise<null | SessionExtended[]>;
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
    getEndToEndDeviceData(txn: IDBTransaction, func: (deviceData: IDeviceData | null) => void): void;
    getEndToEndRooms(txn: IDBTransaction, func: (rooms: Record<string, IRoomEncryption>) => void): void;
    markSessionsNeedingBackup(sessions: ISession[], txn?: IDBTransaction): Promise<void>;
    doTxn<T>(mode: Mode, stores: string | string[], func: (txn: IDBTransaction) => T, log?: Logger): Promise<T>;
}
export declare const VERSION: number;
export declare function upgradeDatabase(db: IDBDatabase, oldVersion: number): void;
//# sourceMappingURL=indexeddb-crypto-store-backend.d.ts.map