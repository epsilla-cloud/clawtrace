import { type ISyncResponse } from "../sync-accumulator.ts";
import { type IStateEventWithRoomId, type IStoredClientOpts } from "../matrix.ts";
import { type ISavedSync } from "./index.ts";
import { type IIndexedDBBackend, type UserTuple } from "./indexeddb-backend.ts";
import { type IndexedToDeviceBatch, type ToDeviceBatchWithTxnId } from "../models/ToDeviceMessage.ts";
export declare class LocalIndexedDBStoreBackend implements IIndexedDBBackend {
    private readonly indexedDB;
    static exists(indexedDB: IDBFactory, dbName: string): Promise<boolean>;
    private readonly dbName;
    private readonly syncAccumulator;
    private db?;
    private disconnected;
    private _isNewlyCreated;
    private syncToDatabasePromise?;
    private pendingUserPresenceData;
    /**
     * Does the actual reading from and writing to the indexeddb
     *
     * Construct a new Indexed Database store backend. This requires a call to
     * `connect()` before this store can be used.
     * @param indexedDB - The Indexed DB interface e.g
     * `window.indexedDB`
     * @param dbName - Optional database name. The same name must be used
     * to open the same database.
     */
    constructor(indexedDB: IDBFactory, dbName?: string);
    /**
     * Attempt to connect to the database. This can fail if the user does not
     * grant permission.
     * @returns Promise which resolves if successfully connected.
     */
    connect(onClose?: () => void): Promise<void>;
    /** @returns whether or not the database was newly created in this session. */
    isNewlyCreated(): Promise<boolean>;
    /**
     * Having connected, load initial data from the database and prepare for use
     * @returns Promise which resolves on success
     */
    private init;
    /**
     * Returns the out-of-band membership events for this room that
     * were previously loaded.
     * @returns the events, potentially an empty array if OOB loading didn't yield any new members
     * @returns in case the members for this room haven't been stored yet
     */
    getOutOfBandMembers(roomId: string): Promise<IStateEventWithRoomId[] | null>;
    /**
     * Stores the out-of-band membership events for this room. Note that
     * it still makes sense to store an empty array as the OOB status for the room is
     * marked as fetched, and getOutOfBandMembers will return an empty array instead of null
     * @param membershipEvents - the membership events to store
     */
    setOutOfBandMembers(roomId: string, membershipEvents: IStateEventWithRoomId[]): Promise<void>;
    clearOutOfBandMembers(roomId: string): Promise<void>;
    /**
     * Clear the entire database. This should be used when logging out of a client
     * to prevent mixing data between accounts. Closes the database.
     * @returns Resolved when the database is cleared.
     */
    clearDatabase(): Promise<void>;
    /**
     * @param copy - If false, the data returned is from internal
     * buffers and must not be mutated. Otherwise, a copy is made before
     * returning such that the data can be safely mutated. Default: true.
     *
     * @returns Promise which resolves with a sync response to restore the
     * client state to where it was at the last save, or null if there
     * is no saved sync data.
     */
    getSavedSync(copy?: boolean): Promise<ISavedSync | null>;
    getNextBatchToken(): Promise<string>;
    setSyncData(syncData: ISyncResponse): Promise<void>;
    /**
     * Sync users and all accumulated sync data to the database.
     * If a previous sync is in flight, the new data will be added to the
     * next sync and the current sync's promise will be returned.
     * @param userTuples - The user tuples
     * @returns Promise which resolves if the data was persisted.
     */
    syncToDatabase(userTuples: UserTuple[]): Promise<void>;
    private doSyncToDatabase;
    /**
     * Persist rooms /sync data along with the next batch token.
     * @param nextBatch - The next_batch /sync value.
     * @param roomsData - The 'rooms' /sync data from a SyncAccumulator
     * @returns Promise which resolves if the data was persisted.
     */
    private persistSyncData;
    /**
     * Persist a list of account data events. Events with the same 'type' will
     * be replaced.
     * @param accountData - An array of raw user-scoped account data events
     * @returns Promise which resolves if the events were persisted.
     */
    private persistAccountData;
    /**
     * Persist a list of [user id, presence event] they are for.
     * Users with the same 'userId' will be replaced.
     * Presence events should be the event in its raw form (not the Event
     * object)
     * @param tuples - An array of [userid, event] tuples
     * @returns Promise which resolves if the users were persisted.
     */
    private persistUserPresenceEvents;
    /**
     * Load all user presence events from the database. This is not cached.
     * FIXME: It would probably be more sensible to store the events in the
     * sync.
     * @returns A list of presence events in their raw form.
     */
    getUserPresenceEvents(): Promise<UserTuple[]>;
    /**
     * Load all the account data events from the database. This is not cached.
     * @returns A list of raw global account events.
     */
    private loadAccountData;
    /**
     * Load the sync data from the database.
     * @returns An object with "roomsData" and "nextBatch" keys.
     */
    private loadSyncData;
    getClientOptions(): Promise<IStoredClientOpts | undefined>;
    storeClientOptions(options: IStoredClientOpts): Promise<void>;
    saveToDeviceBatches(batches: ToDeviceBatchWithTxnId[]): Promise<void>;
    getOldestToDeviceBatch(): Promise<IndexedToDeviceBatch | null>;
    removeToDeviceBatch(id: number): Promise<void>;
    destroy(): Promise<void>;
}
//# sourceMappingURL=indexeddb-local-backend.d.ts.map