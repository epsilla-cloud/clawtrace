import { type ExtensibleEventType, type IPartialEvent } from "../@types/extensible_events.ts";
import { type PollEndEventContent } from "../@types/polls.ts";
import { ExtensibleEvent } from "./ExtensibleEvent.ts";
import { MessageEvent } from "./MessageEvent.ts";
/**
 * Represents a poll end/closure event.
 */
export declare class PollEndEvent extends ExtensibleEvent<PollEndEventContent> {
    /**
     * The poll start event ID referenced by the response.
     */
    readonly pollEventId: string;
    /**
     * The closing message for the event.
     */
    readonly closingMessage: MessageEvent;
    /**
     * Creates a new PollEndEvent from a pure format. Note that the event is *not*
     * parsed here: it will be treated as a literal m.poll.response primary typed event.
     * @param wireFormat - The event.
     */
    constructor(wireFormat: IPartialEvent<PollEndEventContent>);
    isEquivalentTo(primaryEventType: ExtensibleEventType): boolean;
    serialize(): IPartialEvent<object>;
    /**
     * Creates a new PollEndEvent from a poll event ID.
     * @param pollEventId - The poll start event ID.
     * @param message - A closing message, typically revealing the top answer.
     * @returns The representative poll closure event.
     */
    static from(pollEventId: string, message: string): PollEndEvent;
}
//# sourceMappingURL=PollEndEvent.d.ts.map