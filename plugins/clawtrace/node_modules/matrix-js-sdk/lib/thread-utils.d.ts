import { type IEvent } from "./models/event.ts";
/**
 * Returns a filter function for the /relations endpoint to filter out relations directly
 * to the thread root event that should not live in the thread timeline
 *
 * @param threadId - the thread ID (ie. the event ID of the root event of the thread)
 * @returns the filtered list of events
 */
export declare function getRelationsThreadFilter(threadId: string): (e: Partial<IEvent>) => boolean;
//# sourceMappingURL=thread-utils.d.ts.map