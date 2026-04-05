import { ExtensibleEvent } from "./ExtensibleEvent.ts";
import { type ExtensibleEventType, type IMessageRendering, type IPartialEvent, type ExtensibleAnyMessageEventContent } from "../@types/extensible_events.ts";
/**
 * Represents a message event. Message events are the simplest form of event with
 * just text (optionally of different mimetypes, like HTML).
 *
 * Message events can additionally be an Emote or Notice, though typically those
 * are represented as EmoteEvent and NoticeEvent respectively.
 */
export declare class MessageEvent extends ExtensibleEvent<ExtensibleAnyMessageEventContent> {
    /**
     * The default text for the event.
     */
    readonly text: string;
    /**
     * The default HTML for the event, if provided.
     */
    readonly html?: string;
    /**
     * All the different renderings of the message. Note that this is the same
     * format as an m.message body but may contain elements not found directly
     * in the event content: this is because this is interpreted based off the
     * other information available in the event.
     */
    readonly renderings: IMessageRendering[];
    /**
     * Creates a new MessageEvent from a pure format. Note that the event is
     * *not* parsed here: it will be treated as a literal m.message primary
     * typed event.
     * @param wireFormat - The event.
     */
    constructor(wireFormat: IPartialEvent<ExtensibleAnyMessageEventContent>);
    isEquivalentTo(primaryEventType: ExtensibleEventType): boolean;
    protected serializeMMessageOnly(): ExtensibleAnyMessageEventContent;
    serialize(): IPartialEvent<object>;
    /**
     * Creates a new MessageEvent from text and HTML.
     * @param text - The text.
     * @param html - Optional HTML.
     * @returns The representative message event.
     */
    static from(text: string, html?: string): MessageEvent;
}
//# sourceMappingURL=MessageEvent.d.ts.map