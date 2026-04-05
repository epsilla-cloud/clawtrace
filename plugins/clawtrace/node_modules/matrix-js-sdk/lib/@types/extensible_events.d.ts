import { type EitherAnd, NamespacedValue, UnstableValue } from "matrix-events-sdk";
/**
 * Represents the stable and unstable values of a given namespace.
 */
export type TSNamespace<N> = N extends NamespacedValue<infer S, infer U> ? TSNamespaceValue<S> | TSNamespaceValue<U> : never;
/**
 * Represents a namespaced value, if the value is a string. Used to extract provided types
 * from a TSNamespace<N> (in cases where only stable *or* unstable is provided).
 */
export type TSNamespaceValue<V> = V extends string ? V : never;
/**
 * Creates a type which is V when T is `never`, otherwise T.
 */
export type DefaultNever<T, V> = [T] extends [never] ? V : T;
/**
 * The namespaced value for m.message
 */
export declare const M_MESSAGE: UnstableValue<"m.message", "org.matrix.msc1767.message">;
/**
 * An m.message event rendering
 */
export interface IMessageRendering {
    body: string;
    mimetype?: string;
}
/**
 * The content for an m.message event
 */
export type ExtensibleMessageEventContent = EitherAnd<{
    [M_MESSAGE.name]: IMessageRendering[];
}, {
    [M_MESSAGE.altName]: IMessageRendering[];
}>;
/**
 * The namespaced value for m.text
 */
export declare const M_TEXT: UnstableValue<"m.text", "org.matrix.msc1767.text">;
/**
 * The content for an m.text event
 */
export type TextEventContent = EitherAnd<{
    [M_TEXT.name]: string;
}, {
    [M_TEXT.altName]: string;
}>;
/**
 * The namespaced value for m.html
 */
export declare const M_HTML: UnstableValue<"m.html", "org.matrix.msc1767.html">;
/**
 * The content for an m.html event
 */
export type HtmlEventContent = EitherAnd<{
    [M_HTML.name]: string;
}, {
    [M_HTML.altName]: string;
}>;
/**
 * The content for an m.message, m.text, or m.html event
 */
export type ExtensibleAnyMessageEventContent = ExtensibleMessageEventContent | TextEventContent | HtmlEventContent;
/**
 * The namespaced value for an m.reference relation
 */
export declare const REFERENCE_RELATION: NamespacedValue<"m.reference", string>;
/**
 * Represents any relation type
 */
export type AnyRelation = TSNamespace<typeof REFERENCE_RELATION> | string;
/**
 * An m.relates_to relationship
 */
export type RelatesToRelationship<R = never> = {
    "m.relates_to": {
        rel_type: [R] extends [never] ? AnyRelation : TSNamespace<R>;
        event_id: string;
    };
};
/**
 * Partial types for a Matrix Event.
 */
export interface IPartialEvent<TContent> {
    type: string;
    content: TContent;
}
/**
 * Represents a potentially namespaced event type.
 */
export type ExtensibleEventType = NamespacedValue<string, string> | string;
/**
 * Determines if two event types are the same, including namespaces.
 * @param given - The given event type. This will be compared
 * against the expected type.
 * @param expected - The expected event type.
 * @returns True if the given type matches the expected type.
 */
export declare function isEventTypeSame(given: ExtensibleEventType | null, expected: ExtensibleEventType | null): boolean;
//# sourceMappingURL=extensible_events.d.ts.map