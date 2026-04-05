/**
 * This is an internal module. See {@link MemoryStore} for the public class.
 */
import { type EventType } from "../@types/event.ts";
import { type Room } from "../models/room.ts";
import { type User } from "../models/user.ts";
import { type IEvent, type MatrixEvent } from "../models/event.ts";
import { type Filter } from "../filter.ts";
import { type ISavedSync, type IStore, type UserCreator } from "./index.ts";
import { type RoomSummary } from "../models/room-summary.ts";
import { type ISyncResponse } from "../sync-accumulator.ts";
import { type IStateEventWithRoomId } from "../@types/search.ts";
import { type IndexedToDeviceBatch, type ToDeviceBatchWithTxnId } from "../models/ToDeviceMessage.ts";
import { type IStoredClientOpts } from "../client.ts";
export interface IOpts {
    /** The local storage instance to persist some forms of data such as tokens. Rooms will NOT be stored. */
    localStorage?: Storage;
}
export declare class MemoryStore implements IStore {
    private rooms;
    private users;
    private syncToken;
    private filters;
    accountData: Map<string, MatrixEvent>;
    protected readonly localStorage?: Storage;
    private oobMembers;
    private pendingEvents;
    private clientOptions?;
    private pendingToDeviceBatches;
    private nextToDeviceBatchId;
    protected createUser?: UserCreator;
    /**
     * Construct a new in-memory data store for the Matrix Client.
     * @param opts - Config options
     */
    constructor(opts?: IOpts);
    /**
     * Retrieve the token to stream from.
     * @returns The token or null.
     */
    getSyncToken(): string | null;
    /** @returns whether or not the database was newly created in this session. */
    isNewlyCreated(): Promise<boolean>;
    /**
     * Set the token to stream from.
     * @param token - The token to stream from.
     */
    setSyncToken(token: string): void;
    /**
     * Store the given room.
     * @param room - The room to be stored. All properties must be stored.
     */
    storeRoom(room: Room): void;
    setUserCreator(creator: UserCreator): void;
    /**
     * Called when a room member in a room being tracked by this store has been
     * updated.
     */
    private onRoomMember;
    /**
     * Retrieve a room by its' room ID.
     * @param roomId - The room ID.
     * @returns The room or null.
     */
    getRoom(roomId: string): Room | null;
    /**
     * Retrieve all known rooms.
     * @returns A list of rooms, which may be empty.
     */
    getRooms(): Room[];
    /**
     * Permanently delete a room.
     */
    removeRoom(roomId: string): void;
    /**
     * Retrieve a summary of all the rooms.
     * @returns A summary of each room.
     */
    getRoomSummaries(): RoomSummary[];
    /**
     * Store a User.
     * @param user - The user to store.
     */
    storeUser(user: User): void;
    /**
     * Retrieve a User by its' user ID.
     * @param userId - The user ID.
     * @returns The user or null.
     */
    getUser(userId: string): User | null;
    /**
     * Retrieve all known users.
     * @returns A list of users, which may be empty.
     */
    getUsers(): User[];
    /**
     * Retrieve scrollback for this room.
     * @param room - The matrix room
     * @param limit - The max number of old events to retrieve.
     * @returns An array of objects which will be at most 'limit'
     * length and at least 0. The objects are the raw event JSON.
     */
    scrollback(room: Room, limit: number): MatrixEvent[];
    /**
     * Store events for a room. The events have already been added to the timeline
     * @param room - The room to store events for.
     * @param events - The events to store.
     * @param token - The token associated with these events.
     * @param toStart - True if these are paginated results.
     */
    storeEvents(room: Room, events: MatrixEvent[], token: string | null, toStart: boolean): void;
    /**
     * Store a filter.
     */
    storeFilter(filter: Filter): void;
    /**
     * Retrieve a filter.
     * @returns A filter or null.
     */
    getFilter(userId: string, filterId: string): Filter | null;
    /**
     * Retrieve a filter ID with the given name.
     * @param filterName - The filter name.
     * @returns The filter ID or null.
     */
    getFilterIdByName(filterName: string): string | null;
    /**
     * Set a filter name to ID mapping.
     */
    setFilterIdByName(filterName: string, filterId?: string): void;
    /**
     * Store user-scoped account data events.
     * N.B. that account data only allows a single event per type, so multiple
     * events with the same type will replace each other.
     * @param events - The events to store.
     */
    storeAccountDataEvents(events: MatrixEvent[]): void;
    /**
     * Get account data event by event type
     * @param eventType - The event type being queried
     * @returns the user account_data event of given type, if any
     */
    getAccountData(eventType: EventType | string): MatrixEvent | undefined;
    /**
     * setSyncData does nothing as there is no backing data store.
     *
     * @param syncData - The sync data
     * @returns An immediately resolved promise.
     */
    setSyncData(syncData: ISyncResponse): Promise<void>;
    /**
     * We never want to save becase we have nothing to save to.
     *
     * @returns If the store wants to save
     */
    wantsSave(): boolean;
    /**
     * Save does nothing as there is no backing data store.
     * @param force - True to force a save (but the memory
     *     store still can't save anything)
     */
    save(force: boolean): Promise<void>;
    /**
     * Startup does nothing as this store doesn't require starting up.
     * @returns An immediately resolved promise.
     */
    startup(): Promise<void>;
    /**
     * @returns Promise which resolves with a sync response to restore the
     * client state to where it was at the last save, or null if there
     * is no saved sync data.
     */
    getSavedSync(): Promise<ISavedSync | null>;
    /**
     * @returns If there is a saved sync, the nextBatch token
     * for this sync, otherwise null.
     */
    getSavedSyncToken(): Promise<string | null>;
    /**
     * Delete all data from this store.
     * @returns An immediately resolved promise.
     */
    deleteAllData(): Promise<void>;
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
    getPendingEvents(roomId: string): Promise<Partial<IEvent>[]>;
    setPendingEvents(roomId: string, events: Partial<IEvent>[]): Promise<void>;
    saveToDeviceBatches(batches: ToDeviceBatchWithTxnId[]): Promise<void>;
    getOldestToDeviceBatch(): Promise<IndexedToDeviceBatch | null>;
    removeToDeviceBatch(id: number): Promise<void>;
    destroy(): Promise<void>;
}
//# sourceMappingURL=memory.d.ts.map