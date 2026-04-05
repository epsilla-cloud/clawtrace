import { NamespacedValue } from "../NamespacedValue.ts";
import { type IMessageRendering } from "./extensible_events.ts";
/**
 * Extensible topic event type based on MSC3765
 * https://github.com/matrix-org/matrix-spec-proposals/pull/3765
 *
 * @example
 * ```
 * {
 *      "type": "m.room.topic,
 *      "state_key": "",
 *      "content": {
 *          "topic": "All about **pizza**",
 *          "m.topic": [{
 *              "body": "All about **pizza**",
 *              "mimetype": "text/plain",
 *          }, {
 *              "body": "All about <b>pizza</b>",
 *              "mimetype": "text/html",
 *          }],
 *      }
 * }
 * ```
 */
/**
 * The event type for an m.topic event (in content)
 */
export declare const M_TOPIC: NamespacedValue<"m.topic", string>;
/**
 * The event content for an m.topic event (in content)
 */
export type MTopicContent = {
    "m.text": IMessageRendering[];
};
/**
 * A previous incorrect form of m.topic used by matrix-js-sdk
 * TODO remove this after a few releases
 *      https://github.com/matrix-org/matrix-js-sdk/pull/4984#pullrequestreview-3174251065
 */
export type MalformedMTopicEvent = {
    "m.topic": IMessageRendering[];
};
/**
 * The event definition for an m.topic event (in content)
 */
export type MTopicEvent = {
    "m.topic": MTopicContent;
} | MalformedMTopicEvent;
/**
 * The event content for an m.room.topic event
 */
export type MRoomTopicEventContent = {
    topic: string | null | undefined;
} & Partial<MTopicEvent>;
//# sourceMappingURL=topic.d.ts.map