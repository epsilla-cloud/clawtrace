import { Room } from "./models/room.ts";
import { type IStoredClientOpts, type MatrixClient } from "./client.ts";
import { type ISyncStateData, SyncState, type SyncApiOptions, type SetPresence } from "./sync.ts";
import { type MatrixEvent } from "./models/event.ts";
import { type SlidingSync } from "./sliding-sync.ts";
/**
 * A copy of SyncApi such that it can be used as a drop-in replacement for sync v2. For the actual
 * sliding sync API, see sliding-sync.ts or the class SlidingSync.
 */
export declare class SlidingSyncSdk {
    private readonly slidingSync;
    private readonly client;
    private readonly opts;
    private readonly syncOpts;
    private syncState;
    private syncStateData?;
    private lastPos;
    private failCount;
    private notifEvents;
    constructor(slidingSync: SlidingSync, client: MatrixClient, opts: IStoredClientOpts | undefined, syncOpts: SyncApiOptions);
    private onRoomData;
    private onLifecycle;
    /**
     * Sync rooms the user has left.
     * @returns Resolved when they've been added to the store.
     */
    syncLeftRooms(): Promise<Room[]>;
    /**
     * Peek into a room. This will result in the room in question being synced so it
     * is accessible via getRooms(). Live updates for the room will be provided.
     * @param roomId - The room ID to peek into.
     * @returns A promise which resolves once the room has been added to the
     * store.
     */
    peek(roomId: string): Promise<Room>;
    /**
     * Stop polling for updates in the peeked room. NOPs if there is no room being
     * peeked.
     */
    stopPeeking(): void;
    /**
     * Specify the set_presence value to be used for subsequent calls to the Sync API.
     * @param presence - the presence to specify to set_presence of sync calls
     */
    setPresence(presence?: SetPresence): void;
    /**
     * Returns the current state of this sync object
     * @see MatrixClient#event:"sync"
     */
    getSyncState(): SyncState | null;
    /**
     * Returns the additional data object associated with
     * the current sync state, or null if there is no
     * such data.
     * Sync errors, if available, are put in the 'error' key of
     * this object.
     */
    getSyncStateData(): ISyncStateData | null;
    createRoom(roomId: string): Room;
    private registerStateListeners;
    private shouldAbortSync;
    private processRoomData;
    /**
     * Injects events into a room's model.
     * @param stateEventList - A list of state events. This is the state
     * at the *END* of the timeline list if it is supplied.
     * @param timelineEventList - A list of timeline events. Lower index
     * is earlier in time. Higher index is later.
     * @param numLive - the number of events in timelineEventList which just happened,
     * supplied from the server.
     */
    injectRoomEvents(room: Room, stateEventList: MatrixEvent[], timelineEventList?: MatrixEvent[], numLive?: number): Promise<void>;
    private resolveInvites;
    retryImmediately(): boolean;
    /**
     * Main entry point. Blocks until stop() is called.
     */
    sync(): Promise<void>;
    /**
     * Stops the sync object from syncing.
     */
    stop(): void;
    /**
     * Sets the sync state and emits an event to say so
     * @param newState - The new state string
     * @param data - Object of additional data to emit in the event
     */
    private updateSyncState;
    /**
     * Takes a list of timelineEvents and adds and adds to notifEvents
     * as appropriate.
     * This must be called after the room the events belong to has been stored.
     *
     * @param timelineEventList - A list of timeline events. Lower index
     * is earlier in time. Higher index is later.
     */
    private addNotifications;
    /**
     * Purge any events in the notifEvents array. Used after a /sync has been complete.
     * This should not be called at a per-room scope (e.g in onRoomData) because otherwise the ordering
     * will be messed up e.g room A gets a bing, room B gets a newer bing, but both in the same /sync
     * response. If we purge at a per-room scope then we could process room B before room A leading to
     * room B appearing earlier in the notifications timeline, even though it has the higher origin_server_ts.
     */
    private purgeNotifications;
}
//# sourceMappingURL=sliding-sync-sdk.d.ts.map