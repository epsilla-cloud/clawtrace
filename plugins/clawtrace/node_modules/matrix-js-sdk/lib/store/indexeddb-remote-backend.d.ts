import { type ISavedSync } from "./index.ts";
import { type IStoredClientOpts } from "../client.ts";
import { type IStateEventWithRoomId, type ISyncResponse } from "../matrix.ts";
import { type IIndexedDBBackend, type UserTuple } from "./indexeddb-backend.ts";
import { type IndexedToDeviceBatch, type ToDeviceBatchWithTxnId } from "../models/ToDeviceMessage.ts";
export declare class RemoteIndexedDBStoreBackend implements IIndexedDBBackend {
    private readonly workerFactory;
    private readonly dbName?;
    private worker?;
    private nextSeq;
    private inFlight;
    private startPromise?;
    private onClose;
    /**
     * An IndexedDB store backend where the actual backend sits in a web
     * worker.
     *
     * Construct a new Indexed Database store backend. This requires a call to
     * `connect()` before this store can be used.
     * @param workerFactory - Factory which produces a Worker
     * @param dbName - Optional database name. The same name must be used
     * to open the same database.
     */
    constructor(workerFactory: () => Worker, dbName?: string | undefined);
    /**
     * Attempt to connect to the database. This can fail if the user does not
     * grant permission.
     * @returns Promise which resolves if successfully connected.
     */
    connect(onClose?: () => void): Promise<void>;
    /**
     * Clear the entire database. This should be used when logging out of a client
     * to prevent mixing data between accounts.
     * @returns Resolved when the database is cleared.
     */
    clearDatabase(): Promise<void>;
    /** @returns whether or not the database was newly created in this session. */
    isNewlyCreated(): Promise<boolean>;
    /**
     * @returns Promise which resolves with a sync response to restore the
     * client state to where it was at the last save, or null if there
     * is no saved sync data.
     */
    getSavedSync(): Promise<ISavedSync>;
    getNextBatchToken(): Promise<string>;
    setSyncData(syncData: ISyncResponse): Promise<void>;
    syncToDatabase(userTuples: UserTuple[]): Promise<void>;
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
     * @returns when all members have been stored
     */
    setOutOfBandMembers(roomId: string, membershipEvents: IStateEventWithRoomId[]): Promise<void>;
    clearOutOfBandMembers(roomId: string): Promise<void>;
    getClientOptions(): Promise<IStoredClientOpts | undefined>;
    storeClientOptions(options: IStoredClientOpts): Promise<void>;
    /**
     * Load all user presence events from the database. This is not cached.
     * @returns A list of presence events in their raw form.
     */
    getUserPresenceEvents(): Promise<UserTuple[]>;
    saveToDeviceBatches(batches: ToDeviceBatchWithTxnId[]): Promise<void>;
    getOldestToDeviceBatch(): Promise<IndexedToDeviceBatch | null>;
    removeToDeviceBatch(id: number): Promise<void>;
    private ensureStarted;
    private doCmd;
    private onWorkerMessage;
    destroy(): Promise<void>;
}
//# sourceMappingURL=indexeddb-remote-backend.d.ts.map