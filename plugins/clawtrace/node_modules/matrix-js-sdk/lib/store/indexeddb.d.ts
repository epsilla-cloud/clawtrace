import { MemoryStore, type IOpts as IBaseOpts } from "./memory.ts";
import { type IEvent } from "../models/event.ts";
import { type ISavedSync } from "./index.ts";
import { type IIndexedDBBackend } from "./indexeddb-backend.ts";
import { type ISyncResponse } from "../sync-accumulator.ts";
import { type EventEmitterEvents } from "../models/typed-event-emitter.ts";
import { type IStateEventWithRoomId } from "../@types/search.ts";
import { type IndexedToDeviceBatch, type ToDeviceBatchWithTxnId } from "../models/ToDeviceMessage.ts";
import { type IStoredClientOpts } from "../client.ts";
interface IOpts extends IBaseOpts {
    /** The Indexed DB interface e.g. `window.indexedDB` */
    indexedDB?: IDBFactory;
    /** Optional database name. The same name must be used to open the same database. */
    dbName?: string;
    /** Optional factory to spin up a Worker to execute the IDB transactions within. */
    workerFactory?: () => Worker;
}
export declare class IndexedDBStore extends MemoryStore {
    static exists(indexedDB: IDBFactory, dbName: string): Promise<boolean>;
    /**
     * The backend instance.
     * Call through to this API if you need to perform specific indexeddb actions like deleting the database.
     */
    readonly backend: IIndexedDBBackend;
    private startedUp;
    private syncTs;
    private userModifiedMap;
    private emitter;
    /**
     * Construct a new Indexed Database store, which extends MemoryStore.
     *
     * This store functions like a MemoryStore except it periodically persists
     * the contents of the store to an IndexedDB backend.
     *
     * All data is still kept in-memory but can be loaded from disk by calling
     * `startup()`. This can make startup times quicker as a complete
     * sync from the server is not required. This does not reduce memory usage as all
     * the data is eagerly fetched when `startup()` is called.
     * ```
     * let opts = { indexedDB: window.indexedDB, localStorage: window.localStorage };
     * let store = new IndexedDBStore(opts);
     * let client = sdk.createClient({
     *     store: store,
     * });
     * await store.startup(); // load from indexed db, must be called after createClient
     * client.startClient();
     * client.on("sync", function(state, prevState, data) {
     *     if (state === "PREPARED") {
     *         console.log("Started up, now with go faster stripes!");
     *     }
     * });
     * ```
     *
     * @param opts - Options object.
     */
    constructor(opts: IOpts);
    /** Re-exports `TypedEventEmitter.on` */
    on(event: EventEmitterEvents | "degraded" | "closed", handler: (...args: any[]) => void): void;
    /**
     * @returns Resolved when loaded from indexed db.
     */
    startup(): Promise<void>;
    destroy(): Promise<void>;
    private onClose;
    /**
     * @returns Promise which resolves with a sync response to restore the
     * client state to where it was at the last save, or null if there
     * is no saved sync data.
     */
    getSavedSync: DegradableFn<[], ISavedSync | null>;
    /** @returns whether or not the database was newly created in this session. */
    isNewlyCreated: DegradableFn<[], boolean>;
    /**
     * @returns If there is a saved sync, the nextBatch token
     * for this sync, otherwise null.
     */
    getSavedSyncToken: DegradableFn<[], string | null>;
    /**
     * Delete all data from this store.
     * @returns Promise which resolves if the data was deleted from the database.
     */
    deleteAllData: DegradableFn<[], void>;
    /**
     * Whether this store would like to save its data
     * Note that obviously whether the store wants to save or
     * not could change between calling this function and calling
     * save().
     *
     * @returns True if calling save() will actually save
     *     (at the time this function is called).
     */
    wantsSave(): boolean;
    /**
     * Possibly write data to the database.
     *
     * @param force - True to force a save to happen
     * @returns Promise resolves after the write completes
     *     (or immediately if no write is performed)
     */
    save(force?: boolean): Promise<void>;
    private reallySave;
    setSyncData: DegradableFn<[syncData: ISyncResponse], void>;
    /**
     * Returns the out-of-band membership events for this room that
     * were previously loaded.
     * @returns the events, potentially an empty array if OOB loading didn't yield any new members
     * @returns in case the members for this room haven't been stored yet
     */
    getOutOfBandMembers: DegradableFn<[roomId: string], IStateEventWithRoomId[] | null>;
    /**
     * Stores the out-of-band membership events for this room. Note that
     * it still makes sense to store an empty array as the OOB status for the room is
     * marked as fetched, and getOutOfBandMembers will return an empty array instead of null
     * @param membershipEvents - the membership events to store
     * @returns when all members have been stored
     */
    setOutOfBandMembers: DegradableFn<[roomId: string, membershipEvents: IStateEventWithRoomId[]], void>;
    clearOutOfBandMembers: DegradableFn<[roomId: string], void>;
    getClientOptions: DegradableFn<[], IStoredClientOpts | undefined>;
    storeClientOptions: DegradableFn<[options: IStoredClientOpts], void>;
    /**
     * All member functions of `IndexedDBStore` that access the backend use this wrapper to
     * watch for failures after initial store startup, including `QuotaExceededError` as
     * free disk space changes, etc.
     *
     * When IndexedDB fails via any of these paths, we degrade this back to a `MemoryStore`
     * in place so that the current operation and all future ones are in-memory only.
     *
     * @param func - The degradable work to do.
     * @param fallback - The method name for fallback.
     * @returns A wrapped member function.
     */
    private degradable;
    getPendingEvents(roomId: string): Promise<Partial<IEvent>[]>;
    setPendingEvents(roomId: string, events: Partial<IEvent>[]): Promise<void>;
    saveToDeviceBatches(batches: ToDeviceBatchWithTxnId[]): Promise<void>;
    getOldestToDeviceBatch(): Promise<IndexedToDeviceBatch | null>;
    removeToDeviceBatch(id: number): Promise<void>;
}
type DegradableFn<A extends Array<any>, T> = (...args: A) => Promise<T>;
export {};
//# sourceMappingURL=indexeddb.d.ts.map