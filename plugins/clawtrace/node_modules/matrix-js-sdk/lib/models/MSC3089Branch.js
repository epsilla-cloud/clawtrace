import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/*
Copyright 2021 The Matrix.org Foundation C.I.C.

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

import { RelationType, UNSTABLE_MSC3089_BRANCH } from "../@types/event.js";
import { EventTimeline } from "./event-timeline.js";
/**
 * Represents a [MSC3089](https://github.com/matrix-org/matrix-doc/pull/3089) branch - a reference
 * to a file (leaf) in the tree. Note that this is UNSTABLE and subject to breaking changes
 * without notice.
 */
export class MSC3089Branch {
  constructor(client, indexEvent, directory) {
    this.client = client;
    this.indexEvent = indexEvent;
    this.directory = directory;
  } // Nothing to do

  /**
   * The file ID.
   */
  get id() {
    var stateKey = this.indexEvent.getStateKey();
    if (!stateKey) {
      throw new Error("State key not found for branch");
    }
    return stateKey;
  }

  /**
   * Whether this branch is active/valid.
   */
  get isActive() {
    return this.indexEvent.getContent()["active"] === true;
  }

  /**
   * Version for the file, one-indexed.
   */
  get version() {
    var _this$indexEvent$getC;
    return (_this$indexEvent$getC = this.indexEvent.getContent()["version"]) !== null && _this$indexEvent$getC !== void 0 ? _this$indexEvent$getC : 1;
  }
  get roomId() {
    return this.indexEvent.getRoomId();
  }

  /**
   * Deletes the file from the tree, including all prior edits/versions.
   * @returns Promise which resolves when complete.
   */
  delete() {
    var _this = this;
    return _asyncToGenerator(function* () {
      yield _this.client.sendStateEvent(_this.roomId, UNSTABLE_MSC3089_BRANCH.name, {}, _this.id);
      yield _this.client.redactEvent(_this.roomId, _this.id);
      var nextVersion = (yield _this.getVersionHistory())[1]; // [0] will be us
      if (nextVersion) yield nextVersion.delete(); // implicit recursion
    })();
  }

  /**
   * Gets the name for this file.
   * @returns The name, or "Unnamed File" if unknown.
   */
  getName() {
    return this.indexEvent.getContent()["name"] || "Unnamed File";
  }

  /**
   * Sets the name for this file.
   * @param name - The new name for this file.
   * @returns Promise which resolves when complete.
   */
  setName(name) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      yield _this2.client.sendStateEvent(_this2.roomId, UNSTABLE_MSC3089_BRANCH.name, _objectSpread(_objectSpread({}, _this2.indexEvent.getContent()), {}, {
        name: name
      }), _this2.id);
    })();
  }

  /**
   * Gets whether or not a file is locked.
   * @returns True if locked, false otherwise.
   */
  isLocked() {
    return this.indexEvent.getContent()["locked"] || false;
  }

  /**
   * Sets a file as locked or unlocked.
   * @param locked - True to lock the file, false otherwise.
   * @returns Promise which resolves when complete.
   */
  setLocked(locked) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      yield _this3.client.sendStateEvent(_this3.roomId, UNSTABLE_MSC3089_BRANCH.name, _objectSpread(_objectSpread({}, _this3.indexEvent.getContent()), {}, {
        locked: locked
      }), _this3.id);
    })();
  }

  /**
   * Gets information about the file needed to download it.
   * @returns Information about the file.
   */
  getFileInfo() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      var event = yield _this4.getFileEvent();
      var file = event.getOriginalContent()["file"];
      var httpUrl = _this4.client.mxcUrlToHttp(file["url"]);
      if (!httpUrl) {
        throw new Error("No HTTP URL available for ".concat(file["url"]));
      }
      return {
        info: file,
        httpUrl: httpUrl
      };
    })();
  }

  /**
   * Gets the event the file points to.
   * @returns Promise which resolves to the file's event.
   */
  getFileEvent() {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      var room = _this5.client.getRoom(_this5.roomId);
      if (!room) throw new Error("Unknown room");
      var event = room.getUnfilteredTimelineSet().findEventById(_this5.id);

      // keep scrolling back if needed until we find the event or reach the start of the room:
      while (!event && room.getLiveTimeline().getState(EventTimeline.BACKWARDS).paginationToken) {
        yield _this5.client.scrollback(room, 100);
        event = room.getUnfilteredTimelineSet().findEventById(_this5.id);
      }
      if (!event) throw new Error("Failed to find event");

      // Sometimes the event isn't decrypted for us, so do that.
      yield _this5.client.decryptEventIfNeeded(event);
      return event;
    })();
  }

  /**
   * Creates a new version of this file with contents in a type that is compatible with MatrixClient.uploadContent().
   * @param name - The name of the file.
   * @param encryptedContents - The encrypted contents.
   * @param info - The encrypted file information.
   * @param additionalContent - Optional event content fields to include in the message.
   * @returns Promise which resolves to the file event's sent response.
   */
  createNewVersion(name, encryptedContents, info, additionalContent) {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      var fileEventResponse = yield _this6.directory.createFile(name, encryptedContents, info, _objectSpread(_objectSpread({}, additionalContent !== null && additionalContent !== void 0 ? additionalContent : {}), {}, {
        "m.new_content": true,
        "m.relates_to": {
          rel_type: RelationType.Replace,
          event_id: _this6.id
        }
      }));

      // Update the version of the new event
      yield _this6.client.sendStateEvent(_this6.roomId, UNSTABLE_MSC3089_BRANCH.name, {
        active: true,
        name: name,
        version: _this6.version + 1
      }, fileEventResponse["event_id"]);

      // Deprecate ourselves
      yield _this6.client.sendStateEvent(_this6.roomId, UNSTABLE_MSC3089_BRANCH.name, _objectSpread(_objectSpread({}, _this6.indexEvent.getContent()), {}, {
        active: false
      }), _this6.id);
      return fileEventResponse;
    })();
  }

  /**
   * Gets the file's version history, starting at this file.
   * @returns Promise which resolves to the file's version history, with the
   * first element being the current version and the last element being the first version.
   */
  getVersionHistory() {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      var fileHistory = [];
      fileHistory.push(_this7); // start with ourselves

      var room = _this7.client.getRoom(_this7.roomId);
      if (!room) throw new Error("Invalid or unknown room");

      // Clone the timeline to reverse it, getting most-recent-first ordering, hopefully
      // shortening the awful loop below. Without the clone, we can unintentionally mutate
      // the timeline.
      var timelineEvents = [...room.getLiveTimeline().getEvents()].reverse();

      // XXX: This is a very inefficient search, but it's the best we can do with the
      // relations structure we have in the SDK. As of writing, it is not worth the
      // investment in improving the structure.
      var childEvent;
      var parentEvent = yield _this7.getFileEvent();
      do {
        childEvent = timelineEvents.find(e => e.replacingEventId() === parentEvent.getId());
        if (childEvent) {
          var branch = _this7.directory.getFile(childEvent.getId());
          if (branch) {
            fileHistory.push(branch);
            parentEvent = childEvent;
          } else {
            break; // prevent infinite loop
          }
        }
      } while (childEvent);
      return fileHistory;
    })();
  }
}
//# sourceMappingURL=MSC3089Branch.js.map