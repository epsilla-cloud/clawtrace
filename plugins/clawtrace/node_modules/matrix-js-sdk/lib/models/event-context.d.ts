import { type MatrixEvent } from "./event.ts";
export declare class EventContext {
    readonly ourEvent: MatrixEvent;
    private timeline;
    private ourEventIndex;
    private paginateTokens;
    /**
     * Construct a new EventContext
     *
     * An eventcontext is used for circumstances such as search results, when we
     * have a particular event of interest, and a bunch of events before and after
     * it.
     *
     * It also stores pagination tokens for going backwards and forwards in the
     * timeline.
     *
     * @param ourEvent - the event at the centre of this context
     */
    constructor(ourEvent: MatrixEvent);
    /**
     * Get the main event of interest
     *
     * This is a convenience function for getTimeline()[getOurEventIndex()].
     *
     * @returns The event at the centre of this context.
     */
    getEvent(): MatrixEvent;
    /**
     * Get the list of events in this context
     *
     * @returns An array of MatrixEvents
     */
    getTimeline(): MatrixEvent[];
    /**
     * Get the index in the timeline of our event
     */
    getOurEventIndex(): number;
    /**
     * Get a pagination token.
     *
     * @param backwards -   true to get the pagination token for going
     */
    getPaginateToken(backwards?: boolean): string | null;
    /**
     * Set a pagination token.
     *
     * Generally this will be used only by the matrix js sdk.
     *
     * @param token -        pagination token
     * @param backwards -   true to set the pagination token for going
     *                                   backwards in time
     */
    setPaginateToken(token?: string, backwards?: boolean): void;
    /**
     * Add more events to the timeline
     *
     * @param events -      new events, in timeline order
     * @param atStart -   true to insert new events at the start
     */
    addEvents(events: MatrixEvent[], atStart?: boolean): void;
}
//# sourceMappingURL=event-context.d.ts.map