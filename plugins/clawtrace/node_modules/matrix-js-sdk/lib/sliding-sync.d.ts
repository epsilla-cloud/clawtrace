import { type MatrixClient } from "./client.ts";
import { type IRoomEvent, type IStateEvent } from "./sync-accumulator.ts";
import { TypedEventEmitter } from "./models/typed-event-emitter.ts";
export declare const MSC3575_WILDCARD = "*";
export declare const MSC3575_STATE_KEY_ME = "$ME";
export declare const MSC3575_STATE_KEY_LAZY = "$LAZY";
/**
 * Represents a subscription to a room or set of rooms. Controls which events are returned.
 */
export interface MSC3575RoomSubscription {
    required_state?: string[][];
    timeline_limit?: number;
    include_old_rooms?: MSC3575RoomSubscription;
}
/**
 * Controls which rooms are returned in a given list.
 */
export interface MSC3575Filter {
    is_dm?: boolean;
    is_encrypted?: boolean;
    is_invite?: boolean;
    room_name_like?: string;
    room_types?: string[];
    not_room_types?: string[];
    spaces?: string[];
    tags?: string[];
    not_tags?: string[];
}
/**
 * Represents a list subscription.
 */
export interface MSC3575List extends MSC3575RoomSubscription {
    ranges: number[][];
    sort?: string[];
    filters?: MSC3575Filter;
    slow_get_all_rooms?: boolean;
}
/**
 * A complete Sliding Sync request.
 */
export interface MSC3575SlidingSyncRequest {
    lists?: Record<string, MSC3575List>;
    unsubscribe_rooms?: string[];
    room_subscriptions?: Record<string, MSC3575RoomSubscription>;
    extensions?: object;
    txn_id?: string;
    pos?: string;
    timeout?: number;
    clientTimeout?: number;
}
/**
 * New format of hero introduced in MSC4186 with display name and avatar URL
 * in addition to just user_id (as it is on the wire, with underscores)
 * as opposed to Hero in room-summary.ts which has fields in camelCase
 * (and also a flag to note what format the hero came from).
 */
export interface MSC4186Hero {
    user_id: string;
    displayname?: string;
    avatar_url?: string;
}
export interface MSC3575RoomData {
    name: string;
    required_state: IStateEvent[];
    timeline: (IRoomEvent | IStateEvent)[];
    heroes?: MSC4186Hero[];
    notification_count?: number;
    highlight_count?: number;
    joined_count?: number;
    invited_count?: number;
    invite_state?: IStateEvent[];
    initial?: boolean;
    limited?: boolean;
    is_dm?: boolean;
    prev_batch?: string;
    num_live?: number;
    bump_stamp?: number;
}
interface ListResponse {
    count: number;
}
/**
 * A complete Sliding Sync response
 */
export interface MSC3575SlidingSyncResponse {
    pos: string;
    txn_id?: string;
    lists: Record<string, ListResponse>;
    rooms: Record<string, MSC3575RoomData>;
    extensions: Record<string, object>;
}
export declare enum SlidingSyncState {
    /**
     * Fired by SlidingSyncEvent.Lifecycle event immediately before processing the response.
     */
    RequestFinished = "FINISHED",
    /**
     * Fired by SlidingSyncEvent.Lifecycle event immediately after all room data listeners have been
     * invoked, but before list listeners.
     */
    Complete = "COMPLETE"
}
/**
 * When onResponse extensions should be invoked: before or after processing the main response.
 */
export declare enum ExtensionState {
    PreProcess = "ExtState.PreProcess",
    PostProcess = "ExtState.PostProcess"
}
/**
 * An interface that must be satisfied to register extensions
 */
export interface Extension<Req extends object, Res extends object> {
    /**
     * The extension name to go under 'extensions' in the request body.
     * @returns The JSON key.
     */
    name(): string;
    /**
     * A function which is called when the request JSON is being formed.
     * Returns the data to insert under this key.
     * @param isInitial - True when this is part of the initial request.
     * @returns The request JSON to send.
     */
    onRequest(isInitial: boolean): Promise<Req>;
    /**
     * A function which is called when there is response JSON under this extension.
     * @param data - The response JSON under the extension name.
     */
    onResponse(data: Res): Promise<void>;
    /**
     * Controls when onResponse should be called.
     * @returns The state when it should be called.
     */
    when(): ExtensionState;
}
/**
 * Events which can be fired by the SlidingSync class. These are designed to provide different levels
 * of information when processing sync responses.
 *  - RoomData: concerns rooms, useful for SlidingSyncSdk to update its knowledge of rooms.
 *  - Lifecycle: concerns callbacks at various well-defined points in the sync process.
 * Specifically, the order of event invocation is:
 *  - Lifecycle (state=RequestFinished)
 *  - RoomData (N times)
 *  - Lifecycle (state=Complete)
 */
export declare enum SlidingSyncEvent {
    /**
     * This event fires when there are updates for a room. Fired as and when rooms are encountered
     * in the response.
     */
    RoomData = "SlidingSync.RoomData",
    /**
     * This event fires at various points in the /sync loop lifecycle.
     *  - SlidingSyncState.RequestFinished: Fires after we receive a valid response but before the
     * response has been processed. Perform any pre-process steps here. If there was a problem syncing,
     * `err` will be set (e.g network errors).
     *  - SlidingSyncState.Complete: Fires after the response has been processed.
     */
    Lifecycle = "SlidingSync.Lifecycle"
}
export type SlidingSyncEventHandlerMap = {
    [SlidingSyncEvent.RoomData]: (roomId: string, roomData: MSC3575RoomData) => Promise<void> | void;
    [SlidingSyncEvent.Lifecycle]: (state: SlidingSyncState, resp: MSC3575SlidingSyncResponse | null, err?: Error) => void;
};
/**
 * SlidingSync is a high-level data structure which controls the majority of sliding sync.
 * It has no hooks into JS SDK except for needing a MatrixClient to perform the HTTP request.
 * This means this class (and everything it uses) can be used in isolation from JS SDK if needed.
 * To hook this up with the JS SDK, you need to use SlidingSyncSdk.
 */
export declare class SlidingSync extends TypedEventEmitter<SlidingSyncEvent, SlidingSyncEventHandlerMap> {
    private readonly proxyBaseUrl;
    private roomSubscriptionInfo;
    private readonly client;
    private readonly timeoutMS;
    private lists;
    private listModifiedCount;
    private terminated;
    private needsResend;
    private extensions;
    private desiredRoomSubscriptions;
    private confirmedRoomSubscriptions;
    private customSubscriptions;
    private roomIdToCustomSubscription;
    private pendingReq?;
    private abortController?;
    /**
     * Create a new sliding sync instance
     * @param proxyBaseUrl - The base URL of the sliding sync proxy
     * @param lists - The lists to use for sliding sync.
     * @param roomSubscriptionInfo - The params to use for room subscriptions.
     * @param client - The client to use for /sync calls.
     * @param timeoutMS - The number of milliseconds to wait for a response.
     */
    constructor(proxyBaseUrl: string, lists: Map<string, MSC3575List>, roomSubscriptionInfo: MSC3575RoomSubscription, client: MatrixClient, timeoutMS: number);
    /**
     * Add a custom room subscription, referred to by an arbitrary name. If a subscription with this
     * name already exists, it is replaced. No requests are sent by calling this method.
     * @param name - The name of the subscription. Only used to reference this subscription in
     * useCustomSubscription.
     * @param sub - The subscription information.
     */
    addCustomSubscription(name: string, sub: MSC3575RoomSubscription): void;
    /**
     * Use a custom subscription previously added via addCustomSubscription. No requests are sent
     * by calling this method. Use modifyRoomSubscriptions to resend subscription information.
     * @param roomId - The room to use the subscription in.
     * @param name - The name of the subscription. If this name is unknown, the default subscription
     * will be used.
     */
    useCustomSubscription(roomId: string, name: string): void;
    /**
     * Get the room index data for a list.
     * @param key - The list key
     * @returns The list data which contains the rooms in this list
     */
    getListData(key: string): {
        joinedCount: number;
    } | null;
    /**
     * Get the full request list parameters for a list index. This function is provided for callers to use
     * in conjunction with setList to update fields on an existing list.
     * @param key - The list key to get the params for.
     * @returns A copy of the list params or undefined.
     */
    getListParams(key: string): MSC3575List | null;
    /**
     * Set new ranges for an existing list. Calling this function when _only_ the ranges have changed
     * is more efficient than calling setList(index,list) as this function won't resend sticky params,
     * whereas setList always will.
     * @param key - The list key to modify
     * @param ranges - The new ranges to apply.
     * @returns A promise which resolves to the transaction ID when it has been received down sync
     * (or rejects with the transaction ID if the action was not applied e.g the request was cancelled
     * immediately after sending, in which case the action will be applied in the subsequent request)
     */
    setListRanges(key: string, ranges: number[][]): void;
    /**
     * Add or replace a list. Calling this function will interrupt the /sync request to resend new
     * lists.
     * @param key - The key to modify
     * @param list - The new list parameters.
     * @returns A promise which resolves to the transaction ID when it has been received down sync
     * (or rejects with the transaction ID if the action was not applied e.g the request was cancelled
     * immediately after sending, in which case the action will be applied in the subsequent request)
     */
    setList(key: string, list: MSC3575List): void;
    /**
     * Get the room subscriptions for the sync API.
     * @returns A copy of the desired room subscriptions.
     */
    getRoomSubscriptions(): Set<string>;
    /**
     * Modify the room subscriptions for the sync API. Calling this function will interrupt the
     * /sync request to resend new subscriptions. If the /sync stream has not started, this will
     * prepare the room subscriptions for when start() is called.
     * @param s - The new desired room subscriptions.
     */
    modifyRoomSubscriptions(s: Set<string>): void;
    /**
     * Modify which events to retrieve for room subscriptions. Invalidates all room subscriptions
     * such that they will be sent up afresh.
     * @param rs - The new room subscription fields to fetch.
     */
    modifyRoomSubscriptionInfo(rs: MSC3575RoomSubscription): void;
    /**
     * Register an extension to send with the /sync request.
     * @param ext - The extension to register.
     */
    registerExtension(ext: Extension<any, any>): void;
    private getExtensionRequest;
    private onPreExtensionsResponse;
    private onPostExtensionsResponse;
    /**
     * Invoke all attached room data listeners.
     * @param roomId - The room which received some data.
     * @param roomData - The raw sliding sync response JSON.
     */
    private invokeRoomDataListeners;
    /**
     * Invoke all attached lifecycle listeners.
     * @param state - The Lifecycle state
     * @param resp - The raw sync response JSON
     * @param err - Any error that occurred when making the request e.g. network errors.
     */
    private invokeLifecycleListeners;
    /**
     * Resend a Sliding Sync request. Used when something has changed in the request.
     */
    resend(): void;
    /**
     * Stop syncing with the server.
     */
    stop(): void;
    /**
     * Re-setup this connection e.g in the event of an expired session.
     */
    private resetup;
    /**
     * Start syncing with the server. Blocks until stopped.
     */
    start(): Promise<void>;
}
export {};
//# sourceMappingURL=sliding-sync.d.ts.map