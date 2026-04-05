import { MemoryCryptoStore } from "./memory-crypto-store.ts";
import { type CryptoStore, type ISession, type SessionExtended, type ISessionInfo, type IWithheld, MigrationState, type Mode, type SecretStorePrivateKeys, type InboundGroupSessionData, type IRoomEncryption } from "./base.ts";
import { type CrossSigningKeyInfo } from "../../crypto-api/index.ts";
export declare class LocalStorageCryptoStore extends MemoryCryptoStore implements CryptoStore {
    private readonly store;
    static exists(store: Storage): boolean;
    constructor(store: Storage);
    /**
     * Returns true if this CryptoStore has ever been initialised (ie, it might contain data).
     *
     * Implementation of {@link CryptoStore.containsData}.
     *
     * @internal
     */
    containsData(): Promise<boolean>;
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
    countEndToEndSessions(txn: unknown, func: (count: number) => void): void;
    private _getEndToEndSessions;
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
    getEndToEndRooms(txn: unknown, func: (rooms: Record<string, IRoomEncryption>) => void): void;
    markSessionsNeedingBackup(sessions: ISession[]): Promise<void>;
    /**
     * Delete all data from this store.
     *
     * @returns Promise which resolves when the store has been cleared.
     */
    deleteAllData(): Promise<void>;
    getAccount(txn: unknown, func: (accountPickle: string | null) => void): void;
    storeAccount(txn: unknown, accountPickle: string): void;
    getCrossSigningKeys(txn: unknown, func: (keys: Record<string, CrossSigningKeyInfo> | null) => void): void;
    getSecretStorePrivateKey<K extends keyof SecretStorePrivateKeys>(txn: unknown, func: (key: SecretStorePrivateKeys[K] | null) => void, type: K): void;
    storeSecretStorePrivateKey<K extends keyof SecretStorePrivateKeys>(txn: unknown, type: K, key: SecretStorePrivateKeys[K]): void;
    doTxn<T>(mode: Mode, stores: Iterable<string>, func: (txn: unknown) => T): Promise<T>;
}
//# sourceMappingURL=localStorage-crypto-store.d.ts.map