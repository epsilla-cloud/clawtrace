import { MessageEvent } from "./MessageEvent.ts";
import { type ExtensibleEventType, type IPartialEvent } from "../@types/extensible_events.ts";
import { type KnownPollKind, type PollStartEventContent, type PollAnswer } from "../@types/polls.ts";
import { ExtensibleEvent } from "./ExtensibleEvent.ts";
/**
 * Represents a poll answer. Note that this is represented as a subtype and is
 * not registered as a parsable event - it is implied for usage exclusively
 * within the PollStartEvent parsing.
 */
export declare class PollAnswerSubevent extends MessageEvent {
    /**
     * The answer ID.
     */
    readonly id: string;
    constructor(wireFormat: IPartialEvent<PollAnswer>);
    serialize(): IPartialEvent<object>;
    /**
     * Creates a new PollAnswerSubevent from ID and text.
     * @param id - The answer ID (unique within the poll).
     * @param text - The text.
     * @returns The representative answer.
     */
    static from(id: string, text: string): PollAnswerSubevent;
}
/**
 * Represents a poll start event.
 */
export declare class PollStartEvent extends ExtensibleEvent<PollStartEventContent> {
    /**
     * The question being asked, as a MessageEvent node.
     */
    readonly question: MessageEvent;
    /**
     * The interpreted kind of poll. Note that this will infer a value that is known to the
     * SDK rather than verbatim - this means unknown types will be represented as undisclosed
     * polls.
     *
     * To get the raw kind, use rawKind.
     */
    readonly kind: KnownPollKind;
    /**
     * The true kind as provided by the event sender. Might not be valid.
     */
    readonly rawKind: string;
    /**
     * The maximum number of selections a user is allowed to make.
     */
    readonly maxSelections: number;
    /**
     * The possible answers for the poll.
     */
    readonly answers: PollAnswerSubevent[];
    /**
     * Creates a new PollStartEvent from a pure format. Note that the event is *not*
     * parsed here: it will be treated as a literal m.poll.start primary typed event.
     * @param wireFormat - The event.
     */
    constructor(wireFormat: IPartialEvent<PollStartEventContent>);
    isEquivalentTo(primaryEventType: ExtensibleEventType): boolean;
    serialize(): IPartialEvent<object>;
    /**
     * Creates a new PollStartEvent from question, answers, and metadata.
     * @param question - The question to ask.
     * @param answers - The answers. Should be unique within each other.
     * @param kind - The kind of poll.
     * @param maxSelections - The maximum number of selections. Must be 1 or higher.
     * @returns The representative poll start event.
     */
    static from(question: string, answers: string[], kind: KnownPollKind | string, maxSelections?: number): PollStartEvent;
}
//# sourceMappingURL=PollStartEvent.d.ts.map