import { type IMarkerFoundOptions, RoomState } from "./room-state.ts";
import { type EventTimelineSet } from "./event-timeline-set.ts";
import { type MatrixEvent } from "./event.ts";
import { type Filter } from "../filter.ts";
export interface IInitialiseStateOptions extends Pick<IMarkerFoundOptions, "timelineWasEmpty"> {
}
export interface IAddEventOptions extends Pick<IMarkerFoundOptions, "timelineWasEmpty"> {
    /** Whether to insert the new event at the start of the timeline where the
     * oldest events are (timeline is in chronological order, oldest to most
     * recent) */
    toStartOfTimeline: boolean;
    /** The state events to reconcile metadata from */
    roomState?: RoomState;
    /** Whether to add timeline events to the state as was done in legacy sync v2.
     * If true then timeline events will be added to the state.
     * In sync v2 with org.matrix.msc4222.use_state_after and simplified sliding sync,
     * all state arrives explicitly and timeline events should not be added. */
    addToState: boolean;
}
export declare enum Direction {
    Backward = "b",
    Forward = "f"
}
export declare class EventTimeline {
    private readonly eventTimelineSet;
    /**
     * Symbolic constant for methods which take a 'direction' argument:
     * refers to the start of the timeline, or backwards in time.
     */
    static readonly BACKWARDS = Direction.Backward;
    /**
     * Symbolic constant for methods which take a 'direction' argument:
     * refers to the end of the timeline, or forwards in time.
     */
    static readonly FORWARDS = Direction.Forward;
    /**
     * Static helper method to set sender and target properties
     *
     * @param event -   the event whose metadata is to be set
     * @param stateContext -  the room state to be queried
     * @param toStartOfTimeline -  if true the event's forwardLooking flag is set false
     */
    static setEventMetadata(event: MatrixEvent, stateContext: RoomState, toStartOfTimeline: boolean): void;
    private readonly roomId;
    private readonly name;
    private events;
    private baseIndex;
    private startState?;
    private endState?;
    private startToken;
    private endToken;
    private prevTimeline;
    private nextTimeline;
    paginationRequests: Record<Direction, Promise<boolean> | null>;
    /**
     * Construct a new EventTimeline
     *
     * <p>An EventTimeline represents a contiguous sequence of events in a room.
     *
     * <p>As well as keeping track of the events themselves, it stores the state of
     * the room at the beginning and end of the timeline, and pagination tokens for
     * going backwards and forwards in the timeline.
     *
     * <p>In order that clients can meaningfully maintain an index into a timeline,
     * the EventTimeline object tracks a 'baseIndex'. This starts at zero, but is
     * incremented when events are prepended to the timeline. The index of an event
     * relative to baseIndex therefore remains constant.
     *
     * <p>Once a timeline joins up with its neighbour, they are linked together into a
     * doubly-linked list.
     *
     * @param eventTimelineSet - the set of timelines this is part of
     */
    constructor(eventTimelineSet: EventTimelineSet);
    /**
     * Initialise the start and end state with the given events
     *
     * <p>This can only be called before any events are added.
     *
     * @param stateEvents - list of state events to initialise the
     * state with.
     * @throws Error if an attempt is made to call this after addEvent is called.
     */
    initialiseState(stateEvents: MatrixEvent[], { timelineWasEmpty }?: IInitialiseStateOptions): void;
    /**
     * Forks the (live) timeline, taking ownership of the existing directional state of this timeline.
     * All attached listeners will keep receiving state updates from the new live timeline state.
     * The end state of this timeline gets replaced with an independent copy of the current RoomState,
     * and will need a new pagination token if it ever needs to paginate forwards.

     * @param direction -   EventTimeline.BACKWARDS to get the state at the
     *   start of the timeline; EventTimeline.FORWARDS to get the state at the end
     *   of the timeline.
     *
     * @returns the new timeline
     */
    forkLive(direction: Direction): EventTimeline;
    /**
     * Creates an independent timeline, inheriting the directional state from this timeline.
     *
     * @param direction -   EventTimeline.BACKWARDS to get the state at the
     *   start of the timeline; EventTimeline.FORWARDS to get the state at the end
     *   of the timeline.
     *
     * @returns the new timeline
     */
    fork(direction: Direction): EventTimeline;
    /**
     * Get the ID of the room for this timeline
     * @returns room ID
     */
    getRoomId(): string | null;
    /**
     * Get the filter for this timeline's timelineSet (if any)
     * @returns filter
     */
    getFilter(): Filter | undefined;
    /**
     * Get the timelineSet for this timeline
     * @returns timelineSet
     */
    getTimelineSet(): EventTimelineSet;
    /**
     * Get the base index.
     *
     * <p>This is an index which is incremented when events are prepended to the
     * timeline. An individual event therefore stays at the same index in the array
     * relative to the base index (although note that a given event's index may
     * well be less than the base index, thus giving that event a negative relative
     * index).
     */
    getBaseIndex(): number;
    /**
     * Get the list of events in this context
     *
     * @returns An array of MatrixEvents
     */
    getEvents(): MatrixEvent[];
    /**
     * Get the room state at the start/end of the timeline
     *
     * @param direction -   EventTimeline.BACKWARDS to get the state at the
     *   start of the timeline; EventTimeline.FORWARDS to get the state at the end
     *   of the timeline.
     *
     * @returns state at the start/end of the timeline
     */
    getState(direction: Direction): RoomState | undefined;
    /**
     * Get a pagination token
     *
     * @param direction - EventTimeline.BACKWARDS to get the pagination
     *   token for going backwards in time; EventTimeline.FORWARDS to get the
     *   pagination token for going forwards in time.
     *
     * @returns pagination token
     */
    getPaginationToken(direction: Direction): string | null;
    /**
     * Set a pagination token
     *
     * @param token -       pagination token
     *
     * @param direction -    EventTimeline.BACKWARDS to set the pagination
     *   token for going backwards in time; EventTimeline.FORWARDS to set the
     *   pagination token for going forwards in time.
     */
    setPaginationToken(token: string | null, direction: Direction): void;
    /**
     * Get the next timeline in the series
     *
     * @param direction - EventTimeline.BACKWARDS to get the previous
     *   timeline; EventTimeline.FORWARDS to get the next timeline.
     *
     * @returns previous or following timeline, if they have been
     * joined up.
     */
    getNeighbouringTimeline(direction: Direction): EventTimeline | null;
    /**
     * Set the next timeline in the series
     *
     * @param neighbour - previous/following timeline
     *
     * @param direction - EventTimeline.BACKWARDS to set the previous
     *   timeline; EventTimeline.FORWARDS to set the next timeline.
     *
     * @throws Error if an attempt is made to set the neighbouring timeline when
     * it is already set.
     */
    setNeighbouringTimeline(neighbour: EventTimeline, direction: Direction): void;
    /**
     * Add a new event to the timeline, and update the state
     *
     * @param event - new event
     * @param options - addEvent options
     */
    addEvent(event: MatrixEvent, { toStartOfTimeline, roomState, timelineWasEmpty, addToState }: IAddEventOptions): void;
    /**
     * Insert a new event into the timeline, and update the state.
     *
     * TEMPORARY: until we have recursive relations, we need this function
     * to exist to allow us to insert events in timeline order, which is our
     * best guess for Sync Order.
     * This is a copy of addEvent above, modified to allow inserting an event at
     * a specific index.
     *
     * @internal
     */
    insertEvent(event: MatrixEvent, insertIndex: number, roomState: RoomState, addToState: boolean): void;
    /**
     * Remove an event from the timeline
     *
     * @param eventId -  ID of event to be removed
     * @returns removed event, or null if not found
     */
    removeEvent(eventId: string): MatrixEvent | null;
    /**
     * Return a string to identify this timeline, for debugging
     *
     * @returns name for this timeline
     */
    toString(): string;
}
//# sourceMappingURL=event-timeline.d.ts.map