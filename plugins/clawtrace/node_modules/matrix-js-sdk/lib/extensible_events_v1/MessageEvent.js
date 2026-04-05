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

import { ExtensibleEvent } from "./ExtensibleEvent.js";
import { isEventTypeSame, M_HTML, M_MESSAGE, M_TEXT } from "../@types/extensible_events.js";
import { isOptionalAString, isProvided } from "./utilities.js";
import { InvalidEventError } from "./InvalidEventError.js";

/**
 * Represents a message event. Message events are the simplest form of event with
 * just text (optionally of different mimetypes, like HTML).
 *
 * Message events can additionally be an Emote or Notice, though typically those
 * are represented as EmoteEvent and NoticeEvent respectively.
 */
export class MessageEvent extends ExtensibleEvent {
  /**
   * Creates a new MessageEvent from a pure format. Note that the event is
   * *not* parsed here: it will be treated as a literal m.message primary
   * typed event.
   * @param wireFormat - The event.
   */
  constructor(wireFormat) {
    super(wireFormat);
    /**
     * The default text for the event.
     */
    _defineProperty(this, "text", void 0);
    /**
     * The default HTML for the event, if provided.
     */
    _defineProperty(this, "html", void 0);
    /**
     * All the different renderings of the message. Note that this is the same
     * format as an m.message body but may contain elements not found directly
     * in the event content: this is because this is interpreted based off the
     * other information available in the event.
     */
    _defineProperty(this, "renderings", void 0);
    var mmessage = M_MESSAGE.findIn(this.wireContent);
    var mtext = M_TEXT.findIn(this.wireContent);
    var mhtml = M_HTML.findIn(this.wireContent);
    if (isProvided(mmessage)) {
      if (!Array.isArray(mmessage)) {
        throw new InvalidEventError("m.message contents must be an array");
      }
      var text = mmessage.find(r => !isProvided(r.mimetype) || r.mimetype === "text/plain");
      var html = mmessage.find(r => r.mimetype === "text/html");
      if (!text) throw new InvalidEventError("m.message is missing a plain text representation");
      this.text = text.body;
      this.html = html === null || html === void 0 ? void 0 : html.body;
      this.renderings = mmessage;
    } else if (isOptionalAString(mtext)) {
      this.text = mtext;
      this.html = mhtml !== null && mhtml !== void 0 ? mhtml : undefined;
      this.renderings = [{
        body: mtext,
        mimetype: "text/plain"
      }];
      if (this.html) {
        this.renderings.push({
          body: this.html,
          mimetype: "text/html"
        });
      }
    } else {
      throw new InvalidEventError("Missing textual representation for event");
    }
  }
  isEquivalentTo(primaryEventType) {
    return isEventTypeSame(primaryEventType, M_MESSAGE);
  }
  serializeMMessageOnly() {
    var messageRendering = {
      [M_MESSAGE.name]: this.renderings
    };

    // Use the shorthand if it's just a simple text event
    if (this.renderings.length === 1) {
      var mime = this.renderings[0].mimetype;
      if (mime === undefined || mime === "text/plain") {
        messageRendering = {
          [M_TEXT.name]: this.renderings[0].body
        };
      }
    }
    return messageRendering;
  }
  serialize() {
    var _this$html;
    return {
      type: "m.room.message",
      content: _objectSpread(_objectSpread({}, this.serializeMMessageOnly()), {}, {
        body: this.text,
        msgtype: "m.text",
        format: this.html ? "org.matrix.custom.html" : undefined,
        formatted_body: (_this$html = this.html) !== null && _this$html !== void 0 ? _this$html : undefined
      })
    };
  }

  /**
   * Creates a new MessageEvent from text and HTML.
   * @param text - The text.
   * @param html - Optional HTML.
   * @returns The representative message event.
   */
  static from(text, html) {
    return new MessageEvent({
      type: M_MESSAGE.name,
      content: {
        [M_TEXT.name]: text,
        [M_HTML.name]: html
      }
    });
  }
}
//# sourceMappingURL=MessageEvent.js.map