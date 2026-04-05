import { Relations } from "./relations.ts";
import { type EventType, type RelationType } from "../@types/event.ts";
import { type MatrixEvent } from "./event.ts";
import { type EventTimelineSet } from "./event-timeline-set.ts";
import { type MatrixClient } from "../client.ts";
import { type Room } from "./room.ts";
export declare class RelationsContainer {
    private readonly client;
    private readonly room?;
    private relations;
    constructor(client: MatrixClient, room?: Room | undefined);
    /**
     * Get a collection of child events to a given event in this timeline set.
     *
     * @param eventId - The ID of the event that you'd like to access child events for.
     * For example, with annotations, this would be the ID of the event being annotated.
     * @param relationType - The type of relationship involved, such as "m.annotation", "m.reference", "m.replace", etc.
     * @param eventType - The relation event's type, such as "m.reaction", etc.
     * @throws If `eventId</code>, <code>relationType</code> or <code>eventType`
     * are not valid.
     *
     * @returns
     * A container for relation events or undefined if there are no relation events for
     * the relationType.
     */
    getChildEventsForEvent(eventId: string, relationType: RelationType | string, eventType: EventType | string): Relations | undefined;
    getAllChildEventsForEvent(parentEventId: string): MatrixEvent[];
    /**
     * Set an event as the target event if any Relations exist for it already.
     * Child events can point to other child events as their parent, so this method may be
     * called for events which are also logically child events.
     *
     * @param event - The event to check as relation target.
     */
    aggregateParentEvent(event: MatrixEvent): void;
    /**
     * Add relation events to the relevant relation collection.
     *
     * @param event - The new child event to be aggregated.
     * @param timelineSet - The event timeline set within which to search for the related event if any.
     */
    aggregateChildEvent(event: MatrixEvent, timelineSet?: EventTimelineSet): void;
}
//# sourceMappingURL=relations-container.d.ts.map