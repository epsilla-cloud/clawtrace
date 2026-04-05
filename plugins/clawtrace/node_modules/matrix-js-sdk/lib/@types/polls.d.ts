import { type EitherAnd, UnstableValue } from "matrix-events-sdk";
import { type ExtensibleAnyMessageEventContent, type REFERENCE_RELATION, type RelatesToRelationship, type TSNamespace } from "./extensible_events.ts";
import { type EmptyObject } from "./common.ts";
/**
 * Identifier for a disclosed poll.
 */
export declare const M_POLL_KIND_DISCLOSED: UnstableValue<"m.poll.disclosed", "org.matrix.msc3381.poll.disclosed">;
/**
 * Identifier for an undisclosed poll.
 */
export declare const M_POLL_KIND_UNDISCLOSED: UnstableValue<"m.poll.undisclosed", "org.matrix.msc3381.poll.undisclosed">;
/**
 * Any poll kind.
 */
export type PollKind = TSNamespace<typeof M_POLL_KIND_DISCLOSED> | TSNamespace<typeof M_POLL_KIND_UNDISCLOSED> | string;
/**
 * Known poll kind namespaces.
 */
export type KnownPollKind = typeof M_POLL_KIND_DISCLOSED | typeof M_POLL_KIND_UNDISCLOSED;
/**
 * The namespaced value for m.poll.start
 */
export declare const M_POLL_START: UnstableValue<"m.poll.start", "org.matrix.msc3381.poll.start">;
/**
 * The m.poll.start type within event content
 */
export type PollStartSubtype = {
    question: ExtensibleAnyMessageEventContent;
    kind: PollKind;
    max_selections?: number;
    answers: PollAnswer[];
};
/**
 * A poll answer.
 */
export type PollAnswer = ExtensibleAnyMessageEventContent & {
    id: string;
};
/**
 * The event definition for an m.poll.start event (in content)
 */
export type PollStartEvent = EitherAnd<{
    [M_POLL_START.name]: PollStartSubtype;
}, {
    [M_POLL_START.altName]: PollStartSubtype;
}>;
/**
 * The content for an m.poll.start event
 */
export type PollStartEventContent = PollStartEvent & ExtensibleAnyMessageEventContent;
/**
 * The namespaced value for m.poll.response
 */
export declare const M_POLL_RESPONSE: UnstableValue<"m.poll.response", "org.matrix.msc3381.poll.response">;
/**
 * The m.poll.response type within event content
 */
export type PollResponseSubtype = {
    answers: string[];
};
/**
 * The event definition for an m.poll.response event (in content)
 */
export type PollResponseEvent = EitherAnd<{
    [M_POLL_RESPONSE.name]: PollResponseSubtype;
}, {
    [M_POLL_RESPONSE.altName]: PollResponseSubtype;
}>;
/**
 * The content for an m.poll.response event
 */
export type PollResponseEventContent = PollResponseEvent & RelatesToRelationship<typeof REFERENCE_RELATION>;
/**
 * The namespaced value for m.poll.end
 */
export declare const M_POLL_END: UnstableValue<"m.poll.end", "org.matrix.msc3381.poll.end">;
/**
 * The event definition for an m.poll.end event (in content)
 */
export type PollEndEvent = EitherAnd<{
    [M_POLL_END.name]: EmptyObject;
}, {
    [M_POLL_END.altName]: EmptyObject;
}>;
/**
 * The content for an m.poll.end event
 */
export type PollEndEventContent = PollEndEvent & RelatesToRelationship<typeof REFERENCE_RELATION> & ExtensibleAnyMessageEventContent;
//# sourceMappingURL=polls.d.ts.map