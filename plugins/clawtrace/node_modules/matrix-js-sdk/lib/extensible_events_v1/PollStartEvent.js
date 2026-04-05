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

import { NamespacedValue } from "matrix-events-sdk";
import { MessageEvent } from "./MessageEvent.js";
import { isEventTypeSame, M_TEXT } from "../@types/extensible_events.js";
import { M_POLL_KIND_DISCLOSED, M_POLL_KIND_UNDISCLOSED, M_POLL_START } from "../@types/polls.js";
import { InvalidEventError } from "./InvalidEventError.js";
import { ExtensibleEvent } from "./ExtensibleEvent.js";

/**
 * Represents a poll answer. Note that this is represented as a subtype and is
 * not registered as a parsable event - it is implied for usage exclusively
 * within the PollStartEvent parsing.
 */
export class PollAnswerSubevent extends MessageEvent {
  constructor(wireFormat) {
    super(wireFormat);
    /**
     * The answer ID.
     */
    _defineProperty(this, "id", void 0);
    var id = wireFormat.content.id;
    if (!id || typeof id !== "string") {
      throw new InvalidEventError("Answer ID must be a non-empty string");
    }
    this.id = id;
  }
  serialize() {
    return {
      type: "org.matrix.sdk.poll.answer",
      content: _objectSpread({
        id: this.id
      }, this.serializeMMessageOnly())
    };
  }

  /**
   * Creates a new PollAnswerSubevent from ID and text.
   * @param id - The answer ID (unique within the poll).
   * @param text - The text.
   * @returns The representative answer.
   */
  static from(id, text) {
    return new PollAnswerSubevent({
      type: "org.matrix.sdk.poll.answer",
      content: {
        id: id,
        [M_TEXT.name]: text
      }
    });
  }
}

/**
 * Represents a poll start event.
 */
export class PollStartEvent extends ExtensibleEvent {
  /**
   * Creates a new PollStartEvent from a pure format. Note that the event is *not*
   * parsed here: it will be treated as a literal m.poll.start primary typed event.
   * @param wireFormat - The event.
   */
  constructor(wireFormat) {
    super(wireFormat);
    /**
     * The question being asked, as a MessageEvent node.
     */
    _defineProperty(this, "question", void 0);
    /**
     * The interpreted kind of poll. Note that this will infer a value that is known to the
     * SDK rather than verbatim - this means unknown types will be represented as undisclosed
     * polls.
     *
     * To get the raw kind, use rawKind.
     */
    _defineProperty(this, "kind", void 0);
    /**
     * The true kind as provided by the event sender. Might not be valid.
     */
    _defineProperty(this, "rawKind", void 0);
    /**
     * The maximum number of selections a user is allowed to make.
     */
    _defineProperty(this, "maxSelections", void 0);
    /**
     * The possible answers for the poll.
     */
    _defineProperty(this, "answers", void 0);
    var poll = M_POLL_START.findIn(this.wireContent);
    if (!(poll !== null && poll !== void 0 && poll.question)) {
      throw new InvalidEventError("A question is required");
    }
    this.question = new MessageEvent({
      type: "org.matrix.sdk.poll.question",
      content: poll.question
    });
    this.rawKind = poll.kind;
    if (M_POLL_KIND_DISCLOSED.matches(this.rawKind)) {
      this.kind = M_POLL_KIND_DISCLOSED;
    } else {
      this.kind = M_POLL_KIND_UNDISCLOSED; // default & assumed value
    }
    this.maxSelections = Number.isFinite(poll.max_selections) && poll.max_selections > 0 ? poll.max_selections : 1;
    if (!Array.isArray(poll.answers)) {
      throw new InvalidEventError("Poll answers must be an array");
    }
    var answers = poll.answers.slice(0, 20).map(a => new PollAnswerSubevent({
      type: "org.matrix.sdk.poll.answer",
      content: a
    }));
    if (answers.length <= 0) {
      throw new InvalidEventError("No answers available");
    }
    this.answers = answers;
  }
  isEquivalentTo(primaryEventType) {
    return isEventTypeSame(primaryEventType, M_POLL_START);
  }
  serialize() {
    return {
      type: M_POLL_START.name,
      content: {
        [M_POLL_START.name]: {
          question: this.question.serialize().content,
          kind: this.rawKind,
          max_selections: this.maxSelections,
          answers: this.answers.map(a => a.serialize().content)
        },
        [M_TEXT.name]: "".concat(this.question.text, "\n").concat(this.answers.map((a, i) => "".concat(i + 1, ". ").concat(a.text)).join("\n"))
      }
    };
  }

  /**
   * Creates a new PollStartEvent from question, answers, and metadata.
   * @param question - The question to ask.
   * @param answers - The answers. Should be unique within each other.
   * @param kind - The kind of poll.
   * @param maxSelections - The maximum number of selections. Must be 1 or higher.
   * @returns The representative poll start event.
   */
  static from(question, answers, kind) {
    var maxSelections = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    return new PollStartEvent({
      type: M_POLL_START.name,
      content: {
        [M_TEXT.name]: question,
        // unused by parsing
        [M_POLL_START.name]: {
          question: {
            [M_TEXT.name]: question
          },
          kind: kind instanceof NamespacedValue ? kind.name : kind,
          max_selections: maxSelections,
          answers: answers.map(a => ({
            id: makeId(),
            [M_TEXT.name]: a
          }))
        }
      }
    });
  }
}
var LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function makeId() {
  return [...Array(16)].map(() => LETTERS.charAt(Math.floor(Math.random() * LETTERS.length))).join("");
}
//# sourceMappingURL=PollStartEvent.js.map