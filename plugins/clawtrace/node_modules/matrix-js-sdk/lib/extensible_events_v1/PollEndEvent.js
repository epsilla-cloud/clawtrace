import _defineProperty from "@babel/runtime/helpers/defineProperty";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/*
Copyright 2022 - 2023 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { isEventTypeSame, M_TEXT, REFERENCE_RELATION } from "../@types/extensible_events.js";
import { M_POLL_END } from "../@types/polls.js";
import { ExtensibleEvent } from "./ExtensibleEvent.js";
import { InvalidEventError } from "./InvalidEventError.js";
import { MessageEvent } from "./MessageEvent.js";

/**
 * Represents a poll end/closure event.
 */
export class PollEndEvent extends ExtensibleEvent {
  /**
   * Creates a new PollEndEvent from a pure format. Note that the event is *not*
   * parsed here: it will be treated as a literal m.poll.response primary typed event.
   * @param wireFormat - The event.
   */
  constructor(wireFormat) {
    super(wireFormat);
    /**
     * The poll start event ID referenced by the response.
     */
    _defineProperty(this, "pollEventId", void 0);
    /**
     * The closing message for the event.
     */
    _defineProperty(this, "closingMessage", void 0);
    var rel = this.wireContent["m.relates_to"];
    if (!REFERENCE_RELATION.matches(rel === null || rel === void 0 ? void 0 : rel.rel_type) || typeof (rel === null || rel === void 0 ? void 0 : rel.event_id) !== "string") {
      throw new InvalidEventError("Relationship must be a reference to an event");
    }
    this.pollEventId = rel.event_id;
    this.closingMessage = new MessageEvent(this.wireFormat);
  }
  isEquivalentTo(primaryEventType) {
    return isEventTypeSame(primaryEventType, M_POLL_END);
  }
  serialize() {
    return {
      type: M_POLL_END.name,
      content: _objectSpread({
        "m.relates_to": {
          rel_type: REFERENCE_RELATION.name,
          event_id: this.pollEventId
        },
        [M_POLL_END.name]: {}
      }, this.closingMessage.serialize().content)
    };
  }

  /**
   * Creates a new PollEndEvent from a poll event ID.
   * @param pollEventId - The poll start event ID.
   * @param message - A closing message, typically revealing the top answer.
   * @returns The representative poll closure event.
   */
  static from(pollEventId, message) {
    return new PollEndEvent({
      type: M_POLL_END.name,
      content: {
        "m.relates_to": {
          rel_type: REFERENCE_RELATION.name,
          event_id: pollEventId
        },
        [M_POLL_END.name]: {},
        [M_TEXT.name]: message
      }
    });
  }
}
//# sourceMappingURL=PollEndEvent.js.map