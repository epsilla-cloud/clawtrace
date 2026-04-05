import { ExtensibleEvent } from "./ExtensibleEvent.ts";
import { type PollResponseEventContent } from "../@types/polls.ts";
import { type ExtensibleEventType, type IPartialEvent } from "../@types/extensible_events.ts";
import { type PollStartEvent } from "./PollStartEvent.ts";
/**
 * Represents a poll response event.
 */
export declare class PollResponseEvent extends ExtensibleEvent<PollResponseEventContent> {
    private internalAnswerIds;
    private internalSpoiled;
    /**
     * The provided answers for the poll. Note that this may be falsy/unpredictable if
     * the `spoiled` property is true.
     */
    get answerIds(): string[];
    /**
     * The poll start event ID referenced by the response.
     */
    readonly pollEventId: string;
    /**
     * Whether the vote is spoiled.
     */
    get spoiled(): boolean;
    /**
     * Creates a new PollResponseEvent from a pure format. Note that the event is *not*
     * parsed here: it will be treated as a literal m.poll.response primary typed event.
     *
     * To validate the response against a poll, call `validateAgainst` after creation.
     * @param wireFormat - The event.
     */
    constructor(wireFormat: IPartialEvent<PollResponseEventContent>);
    /**
     * Validates the poll response using the poll start event as a frame of reference. This
     * is used to determine if the vote is spoiled, whether the answers are valid, etc.
     * @param poll - The poll start event.
     */
    validateAgainst(poll: PollStartEvent | null): void;
    isEquivalentTo(primaryEventType: ExtensibleEventType): boolean;
    serialize(): IPartialEvent<object>;
    /**
     * Creates a new PollResponseEvent from a set of answers. To spoil the vote, pass an empty
     * answers array.
     * @param answers - The user's answers. Should be valid from a poll's answer IDs.
     * @param pollEventId - The poll start event ID.
     * @returns The representative poll response event.
     */
    static from(answers: string[], pollEventId: string): PollResponseEvent;
}
//# sourceMappingURL=PollResponseEvent.d.ts.map