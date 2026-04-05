import { RoomMember } from "./room-member.ts";
import { EventType } from "../@types/event.ts";
import { type MatrixEvent } from "./event.ts";
import { type MatrixClient } from "../client.ts";
import { GuestAccess, HistoryVisibility, JoinRule } from "../@types/partials.ts";
import { TypedEventEmitter } from "./typed-event-emitter.ts";
import { Beacon, BeaconEvent, type BeaconEventHandlerMap, type BeaconIdentifier } from "./beacon.ts";
import { TypedReEmitter } from "../ReEmitter.ts";
export interface IMarkerFoundOptions {
    /** Whether the timeline was empty before the marker event arrived in the
     *  room. This could be happen in a variety of cases:
     *  1. From the initial sync
     *  2. It's the first state we're seeing after joining the room
     *  3. Or whether it's coming from `syncFromCache`
     *
     * A marker event refers to `UNSTABLE_MSC2716_MARKER` and indicates that
     * history was imported somewhere back in time. It specifically points to an
     * MSC2716 insertion event where the history was imported at. Marker events
     * are sent as state events so they are easily discoverable by clients and
     * homeservers and don't get lost in timeline gaps.
     */
    timelineWasEmpty?: boolean;
}
declare enum OobStatus {
    NotStarted = 0,
    InProgress = 1,
    Finished = 2
}
export interface IPowerLevelsContent {
    users?: Record<string, number>;
    events?: Record<string, number>;
    notifications?: Partial<Record<"room", number>>;
    users_default?: number;
    events_default?: number;
    state_default?: number;
    ban?: number;
    invite?: number;
    kick?: number;
    redact?: number;
}
export declare enum RoomStateEvent {
    Events = "RoomState.events",
    Members = "RoomState.members",
    NewMember = "RoomState.newMember",
    Update = "RoomState.update",// signals batches of updates without specificity
    BeaconLiveness = "RoomState.BeaconLiveness",
    Marker = "RoomState.Marker"
}
export type RoomStateEventHandlerMap = {
    /**
     * Fires whenever the event dictionary in room state is updated.
     * This does not guarantee that any related objects (like RoomMember) have been updated.
     * Use RoomStateEvent.Update for that.
     * @param event - The matrix event which caused this event to fire.
     * @param state - The room state whose RoomState.events dictionary
     * was updated.
     * @param prevEvent - The event being replaced by the new state, if
     * known. Note that this can differ from `getPrevContent()` on the new state event
     * as this is the store's view of the last state, not the previous state provided
     * by the server.
     * @example
     * ```
     * matrixClient.on("RoomState.events", function(event, state, prevEvent){
     *   var newStateEvent = event;
     * });
     * ```
     */
    [RoomStateEvent.Events]: (event: MatrixEvent, state: RoomState, prevEvent: MatrixEvent | null) => void;
    /**
     * Fires whenever a member in the members dictionary is updated in any way.
     * @param event - The matrix event which caused this event to fire.
     * @param state - The room state whose RoomState.members dictionary
     * was updated.
     * @param member - The room member that was updated.
     * @example
     * ```
     * matrixClient.on("RoomState.members", function(event, state, member){
     *   var newMembershipState = member.membership;
     * });
     * ```
     */
    [RoomStateEvent.Members]: (event: MatrixEvent, state: RoomState, member: RoomMember) => void;
    /**
     * Fires whenever a member is added to the members dictionary. The RoomMember
     * will not be fully populated yet (e.g. no membership state) but will already
     * be available in the members dictionary.
     * @param event - The matrix event which caused this event to fire.
     * @param state - The room state whose RoomState.members dictionary
     * was updated with a new entry.
     * @param member - The room member that was added.
     * @example
     * ```
     * matrixClient.on("RoomState.newMember", function(event, state, member){
     *   // add event listeners on 'member'
     * });
     * ```
     */
    [RoomStateEvent.NewMember]: (event: MatrixEvent, state: RoomState, member: RoomMember) => void;
    [RoomStateEvent.Update]: (state: RoomState) => void;
    [RoomStateEvent.BeaconLiveness]: (state: RoomState, hasLiveBeacons: boolean) => void;
    [RoomStateEvent.Marker]: (event: MatrixEvent, setStateOptions?: IMarkerFoundOptions) => void;
    [BeaconEvent.New]: (event: MatrixEvent, beacon: Beacon) => void;
};
type EmittedEvents = RoomStateEvent | BeaconEvent;
type EventHandlerMap = RoomStateEventHandlerMap & BeaconEventHandlerMap;
type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
export declare class RoomState extends TypedEventEmitter<EmittedEvents, EventHandlerMap> {
    readonly roomId: string;
    private oobMemberFlags;
    readonly reEmitter: TypedReEmitter<EmittedEvents, EventHandlerMap>;
    private sentinels;
    private displayNameToUserIds;
    private userIdsToDisplayNames;
    private tokenToInvite;
    private joinedMemberCount;
    private summaryJoinedMemberCount;
    private invitedMemberCount;
    private summaryInvitedMemberCount;
    private modified;
    members: Record<string, RoomMember>;
    events: Map<string, Map<string, MatrixEvent>>;
    paginationToken: string | null;
    readonly beacons: Map<string, Beacon>;
    private _liveBeaconIds;
    private getVersionWarning;
    /**
     * Construct room state.
     *
     * Room State represents the state of the room at a given point.
     * It can be mutated by adding state events to it.
     * There are two types of room member associated with a state event:
     * normal member objects (accessed via getMember/getMembers) which mutate
     * with the state to represent the current state of that room/user, e.g.
     * the object returned by `getMember('@bob:example.com')` will mutate to
     * get a different display name if Bob later changes his display name
     * in the room.
     * There are also 'sentinel' members (accessed via getSentinelMember).
     * These also represent the state of room members at the point in time
     * represented by the RoomState object, but unlike objects from getMember,
     * sentinel objects will always represent the room state as at the time
     * getSentinelMember was called, so if Bob subsequently changes his display
     * name, a room member object previously acquired with getSentinelMember
     * will still have his old display name. Calling getSentinelMember again
     * after the display name change will return a new RoomMember object
     * with Bob's new display name.
     *
     * @param roomId - Optional. The ID of the room which has this state.
     * If none is specified it just tracks paginationTokens, useful for notifTimelineSet
     * @param oobMemberFlags - Optional. The state of loading out of bound members.
     * As the timeline might get reset while they are loading, this state needs to be inherited
     * and shared when the room state is cloned for the new timeline.
     * This should only be passed from clone.
     */
    constructor(roomId: string, oobMemberFlags?: {
        status: OobStatus;
    });
    /**
     * Gets the version of the room
     * @returns The version of the room
     */
    getRoomVersion(): string;
    /**
     * Returns the number of joined members in this room
     * This method caches the result.
     * @returns The number of members in this room whose membership is 'join'
     */
    getJoinedMemberCount(): number;
    /**
     * Set the joined member count explicitly (like from summary part of the sync response)
     * @param count - the amount of joined members
     */
    setJoinedMemberCount(count: number): void;
    /**
     * Returns the number of invited members in this room
     * @returns The number of members in this room whose membership is 'invite'
     */
    getInvitedMemberCount(): number;
    /**
     * Set the amount of invited members in this room
     * @param count - the amount of invited members
     */
    setInvitedMemberCount(count: number): void;
    /**
     * Get all RoomMembers in this room.
     * @returns A list of RoomMembers.
     */
    getMembers(): RoomMember[];
    /**
     * Get all RoomMembers in this room, excluding the user IDs provided.
     * @param excludedIds - The user IDs to exclude.
     * @returns A list of RoomMembers.
     */
    getMembersExcept(excludedIds: string[]): RoomMember[];
    /**
     * Get a room member by their user ID.
     * @param userId - The room member's user ID.
     * @returns The member or null if they do not exist.
     */
    getMember(userId: string): RoomMember | null;
    /**
     * Get a room member whose properties will not change with this room state. You
     * typically want this if you want to attach a RoomMember to a MatrixEvent which
     * may no longer be represented correctly by Room.currentState or Room.oldState.
     * The term 'sentinel' refers to the fact that this RoomMember is an unchanging
     * guardian for state at this particular point in time.
     * @param userId - The room member's user ID.
     * @returns The member or null if they do not exist.
     */
    getSentinelMember(userId: string): RoomMember | null;
    /**
     * Get state events from the state of the room.
     * @param eventType - The event type of the state event.
     * @returns A list of events
     */
    getStateEvents(eventType: EventType | string): MatrixEvent[];
    /**
     * Get state events from the state of the room.
     * @param eventType - The event type of the state event.
     * @param stateKey - The state_key of the state event.
     * @returns A single event (or null if no match found).
     */
    getStateEvents(eventType: EventType | string, stateKey: string): MatrixEvent | null;
    get hasLiveBeacons(): boolean;
    get liveBeaconIds(): BeaconIdentifier[];
    /**
     * Creates a copy of this room state so that mutations to either won't affect the other.
     * @returns the copy of the room state
     */
    clone(): RoomState;
    /**
     * Add previously unknown state events.
     * When lazy loading members while back-paginating,
     * the relevant room state for the timeline chunk at the end
     * of the chunk can be set with this method.
     * @param events - state events to prepend
     */
    setUnknownStateEvents(events: MatrixEvent[]): void;
    /**
     * Add an array of one or more state MatrixEvents, overwriting any existing
     * state with the same `{type, stateKey}` tuple. Will fire "RoomState.events"
     * for every event added. May fire "RoomState.members" if there are
     * `m.room.member` events. May fire "RoomStateEvent.Marker" if there are
     * `UNSTABLE_MSC2716_MARKER` events.
     * @param stateEvents - a list of state events for this room.
     *
     * @remarks
     * Fires {@link RoomStateEvent.Members}
     * Fires {@link RoomStateEvent.NewMember}
     * Fires {@link RoomStateEvent.Events}
     * Fires {@link RoomStateEvent.Marker}
     */
    setStateEvents(stateEvents: MatrixEvent[], markerFoundOptions?: IMarkerFoundOptions): void;
    processBeaconEvents(events: MatrixEvent[], matrixClient: MatrixClient): Promise<void>;
    /**
     * Looks up a member by the given userId, and if it doesn't exist,
     * create it and emit the `RoomState.newMember` event.
     * This method makes sure the member is added to the members dictionary
     * before emitting, as this is done from setStateEvents and setOutOfBandMember.
     * @param userId - the id of the user to look up
     * @param event - the membership event for the (new) member. Used to emit.
     * @returns the member, existing or newly created.
     *
     * @remarks
     * Fires {@link RoomStateEvent.NewMember}
     */
    private getOrCreateMember;
    private setStateEvent;
    /**
     * @experimental
     */
    private setBeacon;
    /**
     * @experimental
     * Check liveness of room beacons
     * emit RoomStateEvent.BeaconLiveness event
     */
    private onBeaconLivenessChange;
    private getStateEventMatching;
    private updateMember;
    /**
     * Get the out-of-band members loading state, whether loading is needed or not.
     * Note that loading might be in progress and hence isn't needed.
     * @returns whether or not the members of this room need to be loaded
     */
    needsOutOfBandMembers(): boolean;
    /**
     * Check if loading of out-of-band-members has completed
     *
     * @returns true if the full membership list of this room has been loaded. False if it is not started or is in
     *    progress.
     */
    outOfBandMembersReady(): boolean;
    /**
     * Mark this room state as waiting for out-of-band members,
     * ensuring it doesn't ask for them to be requested again
     * through needsOutOfBandMembers
     */
    markOutOfBandMembersStarted(): void;
    /**
     * Mark this room state as having failed to fetch out-of-band members
     */
    markOutOfBandMembersFailed(): void;
    /**
     * Clears the loaded out-of-band members
     */
    clearOutOfBandMembers(): void;
    /**
     * Sets the loaded out-of-band members.
     * @param stateEvents - array of membership state events
     */
    setOutOfBandMembers(stateEvents: MatrixEvent[]): void;
    /**
     * Sets a single out of band member, used by both setOutOfBandMembers and clone
     * @param stateEvent - membership state event
     */
    private setOutOfBandMember;
    /**
     * Set the current typing event for this room.
     * @param event - The typing event
     */
    setTypingEvent(event: MatrixEvent): void;
    /**
     * Get the m.room.member event which has the given third party invite token.
     *
     * @param token - The token
     * @returns The m.room.member event or null
     */
    getInviteForThreePidToken(token: string): MatrixEvent | null;
    /**
     * Update the last modified time to the current time.
     */
    private updateModifiedTime;
    /**
     * Get the timestamp when this room state was last updated. This timestamp is
     * updated when this object has received new state events.
     * @returns The timestamp
     */
    getLastModifiedTime(): number;
    /**
     * Get user IDs with the specified or similar display names.
     * @param displayName - The display name to get user IDs from.
     * @returns An array of user IDs or an empty array.
     */
    getUserIdsWithDisplayName(displayName: string): string[];
    /**
     * Returns true if userId is in room, event is not redacted and either sender of
     * mxEvent or has power level sufficient to redact events other than their own.
     * @param mxEvent - The event to test permission for
     * @param userId - The user ID of the user to test permission for
     * @returns true if the given used ID can redact given event
     */
    maySendRedactionForEvent(mxEvent: MatrixEvent, userId: string): boolean;
    /**
     * Returns true if the given power level is sufficient for action
     * @param action - The type of power level to check
     * @param powerLevel - The power level of the member
     * @returns true if the given power level is sufficient
     */
    hasSufficientPowerLevelFor(action: KeysMatching<Required<IPowerLevelsContent>, number>, powerLevel: number): boolean;
    /**
     * Short-form for maySendEvent('m.room.message', userId)
     * @param userId - The user ID of the user to test permission for
     * @returns true if the given user ID should be permitted to send
     *                   message events into the given room.
     */
    maySendMessage(userId: string): boolean;
    /**
     * Returns true if the given user ID has permission to send a normal
     * event of type `eventType` into this room.
     * @param eventType - The type of event to test
     * @param userId - The user ID of the user to test permission for
     * @returns true if the given user ID should be permitted to send
     *                        the given type of event into this room,
     *                        according to the room's state.
     */
    maySendEvent(eventType: EventType | string, userId: string): boolean;
    /**
     * Returns true if the given MatrixClient has permission to send a state
     * event of type `stateEventType` into this room.
     * @param stateEventType - The type of state events to test
     * @param cli - The client to test permission for
     * @returns true if the given client should be permitted to send
     *                        the given type of state event into this room,
     *                        according to the room's state.
     */
    mayClientSendStateEvent(stateEventType: EventType | string, cli: MatrixClient): boolean;
    /**
     * Returns true if the given user ID has permission to send a state
     * event of type `stateEventType` into this room.
     * @param stateEventType - The type of state events to test
     * @param userId - The user ID of the user to test permission for
     * @returns true if the given user ID should be permitted to send
     *                        the given type of state event into this room,
     *                        according to the room's state.
     */
    maySendStateEvent(stateEventType: EventType | string, userId: string): boolean;
    /**
     * Returns true if the given user ID has permission to send a normal or state
     * event of type `eventType` into this room.
     * @param eventType - The type of event to test
     * @param userId - The user ID of the user to test permission for
     * @param state - If true, tests if the user may send a state
     event of this type. Otherwise tests whether
     they may send a regular event.
     * @returns true if the given user ID should be permitted to send
     *                        the given type of event into this room,
     *                        according to the room's state.
     */
    private maySendEventOfType;
    /**
     * Returns true if the given user ID has permission to trigger notification
     * of type `notifLevelKey`
     * @param notifLevelKey - The level of notification to test (eg. 'room')
     * @param userId - The user ID of the user to test permission for
     * @returns true if the given user ID has permission to trigger a
     *                        notification of this type.
     */
    mayTriggerNotifOfType(notifLevelKey: string, userId: string): boolean;
    /**
     * Returns the join rule based on the m.room.join_rule state event, defaulting to `invite`.
     * @returns the join_rule applied to this room
     */
    getJoinRule(): JoinRule;
    /**
     * Returns the history visibility based on the m.room.history_visibility state event, defaulting to `shared`.
     * @returns the history_visibility applied to this room
     */
    getHistoryVisibility(): HistoryVisibility;
    /**
     * Returns the guest access based on the m.room.guest_access state event, defaulting to `shared`.
     * @returns the guest_access applied to this room
     */
    getGuestAccess(): GuestAccess;
    /**
     * Find the predecessor room based on this room state.
     *
     * @param msc3946ProcessDynamicPredecessor - if true, look for an
     * m.room.predecessor state event and use it if found (MSC3946).
     * @returns null if this room has no predecessor. Otherwise, returns
     * the roomId, last eventId and viaServers of the predecessor room.
     *
     * If msc3946ProcessDynamicPredecessor is true, use m.predecessor events
     * as well as m.room.create events to find predecessors.
     *
     * Note: if an m.predecessor event is used, eventId may be undefined
     * since last_known_event_id is optional.
     *
     * Note: viaServers may be undefined, and will definitely be undefined if
     * this predecessor comes from a RoomCreate event (rather than a
     * RoomPredecessor, which has the optional via_servers property).
     */
    findPredecessor(msc3946ProcessDynamicPredecessor?: boolean): {
        roomId: string;
        eventId?: string;
        viaServers?: string[];
    } | null;
    private updateThirdPartyTokenCache;
    private updateDisplayNameCache;
}
export {};
//# sourceMappingURL=room-state.d.ts.map