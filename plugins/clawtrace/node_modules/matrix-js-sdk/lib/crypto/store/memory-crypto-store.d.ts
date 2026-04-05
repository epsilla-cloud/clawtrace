import { type CryptoStore, type ISession, type SessionExtended, type ISessionInfo, type IWithheld, MigrationState, type Mode, type SecretStorePrivateKeys, type InboundGroupSessionData, type IRoomEncryption } from "./base.ts";
import { type CrossSigningKeyInfo } from "../../crypto-api/index.ts";
/**
 * Internal module. in-memory storage for e2e.
 */
export declare class MemoryCryptoStore implements CryptoStore {
    private migrationState;
    private account;
    private crossSigningKeys;
    private privateKeys;
    private sessions;
    private inboundGroupSessions;
    private inboundGroupSessionsWithheld;
    private rooms;
    private sessionsNeedingBackup;
    /**
     * Returns true if this CryptoStore has ever been initialised (ie, it might contain data).
     *
     * Implementation of {@link CryptoStore.containsData}.
     *
     * @internal
     */
    containsData(): Promise<boolean>;
    /**
     * Ensure the database exists and is up-to-date.
     *
     * This must be called before the store can be used.
     *
     * @returns resolves to the store.
     */
    startup(): Promise<CryptoStore>;
    /**
     * Delete all data from this store.
     *
     * @returns Promise which resolves when the store has been cleared.
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
    getAccount(txn: unknown, func: (accountPickle: string | null) => void): void;
    storeAccount(txn: unknown, accountPickle: string): void;
    getCrossSigningKeys(txn: unknown, func: (keys: Record<string, CrossSigningKeyInfo> | null) => void): void;
    getSecretStorePrivateKey<K extends keyof SecretStorePrivateKeys>(txn: unknown, func: (key: SecretStorePrivateKeys[K] | null) => void, type: K): void;
    storeSecretStorePrivateKey<K extends keyof SecretStorePrivateKeys>(txn: unknown, type: K, key: SecretStorePrivateKeys[K]): void;
    countEndToEndSessions(txn: unknown, func: (count: number) => void): void;
    getEndToEndSession(deviceKey: string, sessionId: string, txn: unknown, func: (session: ISessionInfo) => void): void;
    getEndToEndSessions(deviceKey: string, txn: unknown, func: (sessions: {
        [sessionId: string]: ISessionInfo;
    }) => void): void;
    storeEndToEndSession(deviceKey: string, sessionId: string, sessionInfo: ISessionInfo, txn: unknown): void;
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
    getEndToEndInboundGroupSession(senderCurve25519Key: string, sessionId: string, txn: unknown, func: (groupSession: InboundGroupSessionData | null, groupSessionWithheld: IWithheld | null) => void): void;
    storeEndToEndInboundGroupSession(senderCurve25519Key: string, sessionId: string, sessionData: InboundGroupSessionData, txn: unknown): void;
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
     *
     * @internal
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
    getEndToEndRooms(txn: unknown, func: (rooms: Record<string, IRoomEncryption>) => void): void;
    markSessionsNeedingBackup(sessions: ISession[]): Promise<void>;
    doTxn<T>(mode: Mode, stores: Iterable<string>, func: (txn?: unknown) => T): Promise<T>;
}
//# sourceMappingURL=memory-crypto-store.d.ts.map