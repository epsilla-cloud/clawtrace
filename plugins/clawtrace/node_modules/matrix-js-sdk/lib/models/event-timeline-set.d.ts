import { EventTimeline, type IAddEventOptions } from "./event-timeline.ts";
import { type MatrixEvent } from "./event.ts";
import { type Room, RoomEvent } from "./room.ts";
import { type Filter } from "../filter.ts";
import { type RoomState } from "./room-state.ts";
import { TypedEventEmitter } from "./typed-event-emitter.ts";
import { RelationsContainer } from "./relations-container.ts";
import { type MatrixClient } from "../client.ts";
import { type Thread, type ThreadFilterType } from "./thread.ts";
interface IOpts {
    timelineSupport?: boolean;
    filter?: Filter;
    pendingEvents?: boolean;
}
export declare enum DuplicateStrategy {
    Ignore = "ignore",
    Replace = "replace"
}
export interface IRoomTimelineData {
    timeline: EventTimeline;
    liveEvent?: boolean;
}
export interface IAddEventToTimelineOptions extends Pick<IAddEventOptions, "toStartOfTimeline" | "roomState" | "timelineWasEmpty" | "addToState"> {
    /** Whether the sync response came from cache */
    fromCache?: boolean;
}
export interface IAddLiveEventOptions extends Pick<IAddEventToTimelineOptions, "fromCache" | "roomState" | "timelineWasEmpty" | "addToState"> {
    /** Applies to events in the timeline only. If this is 'replace' then if a
     * duplicate is encountered, the event passed to this function will replace
     * the existing event in the timeline. If this is not specified, or is
     * 'ignore', then the event passed to this function will be ignored
     * entirely, preserving the existing event in the timeline. Events are
     * identical based on their event ID <b>only</b>. */
    duplicateStrategy?: DuplicateStrategy;
}
type EmittedEvents = RoomEvent.Timeline | RoomEvent.TimelineReset;
export type EventTimelineSetHandlerMap = {
    /**
     * Fires whenever the timeline in a room is updated.
     * @param event - The matrix event which caused this event to fire.
     * @param room - The room, if any, whose timeline was updated.
     * @param toStartOfTimeline - True if this event was added to the start
     * @param removed - True if this event has just been removed from the timeline
     * (beginning; oldest) of the timeline e.g. due to pagination.
     *
     * @param data - more data about the event
     *
     * @example
     * ```
     * matrixClient.on("Room.timeline",
     *                 function(event, room, toStartOfTimeline, removed, data) {
     *   if (!toStartOfTimeline && data.liveEvent) {
     *     var messageToAppend = room.timeline.[room.timeline.length - 1];
     *   }
     * });
     * ```
     */
    [RoomEvent.Timeline]: (event: MatrixEvent, room: Room | undefined, toStartOfTimeline: boolean | undefined, removed: boolean, data: IRoomTimelineData) => void;
    /**
     * Fires whenever the live timeline in a room is reset.
     *
     * When we get a 'limited' sync (for example, after a network outage), we reset
     * the live timeline to be empty before adding the recent events to the new
     * timeline. This event is fired after the timeline is reset, and before the
     * new events are added.
     *
     * @param room - The room whose live timeline was reset, if any
     * @param timelineSet - timelineSet room whose live timeline was reset
     * @param resetAllTimelines - True if all timelines were reset.
     */
    [RoomEvent.TimelineReset]: (room: Room | undefined, timelineSet: EventTimelineSet, resetAllTimelines: boolean) => void;
};
export declare class EventTimelineSet extends TypedEventEmitter<EmittedEvents, EventTimelineSetHandlerMap> {
    readonly room: Room | undefined;
    readonly thread?: Thread | undefined;
    readonly threadListType: ThreadFilterType | null;
    readonly relations: RelationsContainer;
    private readonly timelineSupport;
    private readonly displayPendingEvents;
    private liveTimeline;
    private timelines;
    private _eventIdToTimeline;
    private filter?;
    /**
     * Construct a set of EventTimeline objects, typically on behalf of a given
     * room.  A room may have multiple EventTimelineSets for different levels
     * of filtering.  The global notification list is also an EventTimelineSet, but
     * lacks a room.
     *
     * <p>This is an ordered sequence of timelines, which may or may not
     * be continuous. Each timeline lists a series of events, as well as tracking
     * the room state at the start and the end of the timeline (if appropriate).
     * It also tracks forward and backward pagination tokens, as well as containing
     * links to the next timeline in the sequence.
     *
     * <p>There is one special timeline - the 'live' timeline, which represents the
     * timeline to which events are being added in real-time as they are received
     * from the /sync API. Note that you should not retain references to this
     * timeline - even if it is the current timeline right now, it may not remain
     * so if the server gives us a timeline gap in /sync.
     *
     * <p>In order that we can find events from their ids later, we also maintain a
     * map from event_id to timeline and index.
     *
     * @param room - Room for this timelineSet. May be null for non-room cases, such as the
     * notification timeline.
     * @param opts - Options inherited from Room.
     * @param client - the Matrix client which owns this EventTimelineSet,
     * can be omitted if room is specified.
     * @param thread - the thread to which this timeline set relates.
     * @param threadListType - the type of thread list represented, if any
     * (e.g., All threads or My threads)
     */
    constructor(room: Room | undefined, opts?: IOpts, client?: MatrixClient, thread?: Thread | undefined, threadListType?: ThreadFilterType | null);
    /**
     * Get all the timelines in this set
     * @returns the timelines in this set
     */
    getTimelines(): EventTimeline[];
    /**
     * Get the filter object this timeline set is filtered on, if any
     * @returns the optional filter for this timelineSet
     */
    getFilter(): Filter | undefined;
    /**
     * Set the filter object this timeline set is filtered on
     * (passed to the server when paginating via /messages).
     * @param filter - the filter for this timelineSet
     */
    setFilter(filter?: Filter): void;
    /**
     * Get the list of pending sent events for this timelineSet's room, filtered
     * by the timelineSet's filter if appropriate.
     *
     * @returns A list of the sent events
     * waiting for remote echo.
     *
     * @throws If `opts.pendingEventOrdering` was not 'detached'
     */
    getPendingEvents(): MatrixEvent[];
    /**
     * Get the live timeline for this room.
     *
     * @returns live timeline
     */
    getLiveTimeline(): EventTimeline;
    /**
     * Set the live timeline for this room.
     *
     * @returns live timeline
     */
    setLiveTimeline(timeline: EventTimeline): void;
    /**
     * Return the timeline (if any) this event is in.
     * @param eventId - the eventId being sought
     * @returns timeline
     */
    eventIdToTimeline(eventId: string): EventTimeline | undefined;
    /**
     * Track a new event as if it were in the same timeline as an old event,
     * replacing it.
     * @param oldEventId -  event ID of the original event
     * @param newEventId -  event ID of the replacement event
     */
    replaceEventId(oldEventId: string, newEventId: string): void;
    /**
     * Reset the live timeline, and start a new one.
     *
     * <p>This is used when /sync returns a 'limited' timeline.
     *
     * @param backPaginationToken -   token for back-paginating the new timeline
     * @param forwardPaginationToken - token for forward-paginating the old live timeline,
     * if absent or null, all timelines are reset.
     *
     * @remarks
     * Fires {@link RoomEvent.TimelineReset}
     */
    resetLiveTimeline(backPaginationToken?: string, forwardPaginationToken?: string): void;
    /**
     * Get the timeline which contains the given event, if any
     *
     * @param eventId -  event ID to look for
     * @returns timeline containing
     * the given event, or null if unknown
     */
    getTimelineForEvent(eventId?: string): EventTimeline | null;
    /**
     * Get an event which is stored in our timelines
     *
     * @param eventId -  event ID to look for
     * @returns the given event, or undefined if unknown
     */
    findEventById(eventId: string): MatrixEvent | undefined;
    /**
     * Add a new timeline to this timeline list
     *
     * @returns newly-created timeline
     */
    addTimeline(): EventTimeline;
    /**
     * Add events to a timeline
     *
     * <p>Will fire "Room.timeline" for each event added.
     *
     * @param events - A list of events to add.
     *
     * @param toStartOfTimeline -   True to add these events to the start
     * (oldest) instead of the end (newest) of the timeline. If true, the oldest
     * event will be the <b>last</b> element of 'events'.
     *
     * @param timeline -   timeline to
     *    add events to.
     *
     * @param paginationToken -   token for the next batch of events
     *
     * @remarks
     * Fires {@link RoomEvent.Timeline}
     *
     */
    addEventsToTimeline(events: MatrixEvent[], toStartOfTimeline: boolean, addToState: boolean, timeline: EventTimeline, paginationToken?: string | null): void;
    /**
     * Add an event to the end of this live timeline.
     *
     * @param event - Event to be added
     * @param options - addLiveEvent options
     */
    addLiveEvent(event: MatrixEvent, { duplicateStrategy, fromCache, roomState, timelineWasEmpty, addToState }: IAddLiveEventOptions): void;
    /**
     * Add event to the given timeline, and emit Room.timeline. Assumes
     * we have already checked we don't know about this event.
     *
     * Will fire "Room.timeline" for each event added.
     *
     * @param event - the event to add
     * @param timeline - the timeline onto which to add it
     * @param options - addEventToTimeline options
     *
     * @remarks
     * Fires {@link RoomEvent.Timeline}
     */
    addEventToTimeline(event: MatrixEvent, timeline: EventTimeline, { toStartOfTimeline, fromCache, roomState, timelineWasEmpty, addToState }: IAddEventToTimelineOptions): void;
    /**
     * Insert event to the given timeline, and emit Room.timeline. Assumes
     * we have already checked we don't know about this event.
     *
     * TEMPORARY: until we have recursive relations, we need this function
     * to exist to allow us to insert events in timeline order, which is our
     * best guess for Sync Order.
     * This is a copy of addEventToTimeline above, modified to insert the event
     * after the event it relates to, and before any event with a later
     * timestamp. This is our best guess at Sync Order.
     *
     * Will fire "Room.timeline" for each event added.
     *
     * @internal
     *
     * @remarks
     * Fires {@link RoomEvent.Timeline}
     */
    insertEventIntoTimeline(event: MatrixEvent, timeline: EventTimeline, roomState: RoomState, addToState: boolean): void;
    /**
     * Replaces event with ID oldEventId with one with newEventId, if oldEventId is
     * recognised.  Otherwise, add to the live timeline.  Used to handle remote echos.
     *
     * @param localEvent -     the new event to be added to the timeline
     * @param oldEventId -          the ID of the original event
     * @param newEventId -         the ID of the replacement event
     *
     * @remarks
     * Fires {@link RoomEvent.Timeline}
     */
    handleRemoteEcho(localEvent: MatrixEvent, oldEventId: string, newEventId: string): void;
    /**
     * Removes a single event from this room.
     *
     * @param eventId -  The id of the event to remove
     *
     * @returns the removed event, or null if the event was not found
     * in this room.
     */
    removeEvent(eventId: string): MatrixEvent | null;
    /**
     * Determine where two events appear in the timeline relative to one another
     *
     * @param eventId1 -   The id of the first event
     * @param eventId2 -   The id of the second event

     * @returns -1 if eventId1 precedes eventId2, and +1 eventId1 succeeds
     * eventId2. 0 if they are the same event; null if we can't tell (either
     * because we don't know about one of the events, or because they are in
     * separate timelines which don't join up).
     */
    compareEventOrdering(eventId1: string, eventId2: string): number | null;
    /**
     * Determine whether a given event can sanely be added to this event timeline set,
     * for timeline sets relating to a thread, only return true for events in the same
     * thread timeline, for timeline sets not relating to a thread only return true
     * for events which should be shown in the main room timeline.
     * Requires the `room` property to have been set at EventTimelineSet construction time.
     *
     * @param event - the event to check whether it belongs to this timeline set.
     * @throws Error if `room` was not set when constructing this timeline set.
     * @returns whether the event belongs to this timeline set.
     */
    canContain(event: MatrixEvent): boolean;
}
export {};
//# sourceMappingURL=event-timeline-set.d.ts.map