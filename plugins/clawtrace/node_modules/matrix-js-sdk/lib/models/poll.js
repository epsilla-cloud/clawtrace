import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2023 The Matrix.org Foundation C.I.C.

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

import { M_POLL_START } from "matrix-events-sdk";
import { M_POLL_END, M_POLL_RESPONSE } from "../@types/polls.js";
import { Relations } from "./relations.js";
import { TypedEventEmitter } from "./typed-event-emitter.js";
export var PollEvent = /*#__PURE__*/function (PollEvent) {
  PollEvent["New"] = "Poll.new";
  PollEvent["End"] = "Poll.end";
  PollEvent["Update"] = "Poll.update";
  PollEvent["Responses"] = "Poll.Responses";
  PollEvent["Destroy"] = "Poll.Destroy";
  PollEvent["UndecryptableRelations"] = "Poll.UndecryptableRelations";
  return PollEvent;
}({});
var filterResponseRelations = (relationEvents, pollEndTimestamp) => {
  var responseEvents = relationEvents.filter(event => {
    if (event.isDecryptionFailure()) {
      return;
    }
    return M_POLL_RESPONSE.matches(event.getType()) &&
    // From MSC3381:
    // "Votes sent on or before the end event's timestamp are valid votes"
    event.getTs() <= pollEndTimestamp;
  });
  return {
    responseEvents
  };
};
export class Poll extends TypedEventEmitter {
  constructor(rootEvent, matrixClient, room) {
    super();
    this.rootEvent = rootEvent;
    this.matrixClient = matrixClient;
    this.room = room;
    _defineProperty(this, "roomId", void 0);
    _defineProperty(this, "pollEvent", void 0);
    _defineProperty(this, "_isFetchingResponses", false);
    _defineProperty(this, "relationsNextBatch", void 0);
    _defineProperty(this, "responses", null);
    _defineProperty(this, "endEvent", void 0);
    /**
     * Keep track of undecryptable relations
     * As incomplete result sets affect poll results
     */
    _defineProperty(this, "undecryptableRelationEventIds", new Set());
    _defineProperty(this, "countUndecryptableEvents", events => {
      var undecryptableEventIds = events.filter(event => event.isDecryptionFailure()).map(event => event.getId());
      var previousCount = this.undecryptableRelationsCount;
      this.undecryptableRelationEventIds = new Set([...this.undecryptableRelationEventIds, ...undecryptableEventIds]);
      if (this.undecryptableRelationsCount !== previousCount) {
        this.emit(PollEvent.UndecryptableRelations, this.undecryptableRelationsCount);
      }
    });
    if (!this.rootEvent.getRoomId() || !this.rootEvent.getId()) {
      throw new Error("Invalid poll start event.");
    }
    this.roomId = this.rootEvent.getRoomId();
    this.pollEvent = this.rootEvent.unstableExtensibleEvent;
  }
  get pollId() {
    return this.rootEvent.getId();
  }
  get endEventId() {
    var _this$endEvent;
    return (_this$endEvent = this.endEvent) === null || _this$endEvent === void 0 ? void 0 : _this$endEvent.getId();
  }
  get isEnded() {
    return !!this.endEvent;
  }
  get isFetchingResponses() {
    return this._isFetchingResponses;
  }
  get undecryptableRelationsCount() {
    return this.undecryptableRelationEventIds.size;
  }
  getResponses() {
    var _this = this;
    return _asyncToGenerator(function* () {
      // if we have already fetched some responses
      // just return them
      if (_this.responses) {
        return _this.responses;
      }

      // if there is no fetching in progress
      // start fetching
      if (!_this.isFetchingResponses) {
        yield _this.fetchResponses();
      }
      // return whatever responses we got from the first page
      return _this.responses;
    })();
  }

  /**
   *
   * @param event - event with a relation to the rootEvent
   * @returns void
   */
  onNewRelation(event) {
    var _this$endEvent2;
    if (M_POLL_END.matches(event.getType()) && this.validateEndEvent(event)) {
      this.endEvent = event;
      this.refilterResponsesOnEnd();
      this.emit(PollEvent.End);
    }

    // wait for poll responses to be initialised
    if (!this.responses) {
      return;
    }
    var pollEndTimestamp = ((_this$endEvent2 = this.endEvent) === null || _this$endEvent2 === void 0 ? void 0 : _this$endEvent2.getTs()) || Number.MAX_SAFE_INTEGER;
    var {
      responseEvents
    } = filterResponseRelations([event], pollEndTimestamp);
    this.countUndecryptableEvents([event]);
    if (responseEvents.length) {
      responseEvents.forEach(event => {
        this.responses.addEvent(event);
      });
      this.emit(PollEvent.Responses, this.responses);
    }
  }
  fetchResponses() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var _this2$endEvent, _allRelations$nextBat;
      _this2._isFetchingResponses = true;

      // we want:
      // - stable and unstable M_POLL_RESPONSE
      // - stable and unstable M_POLL_END
      // so make one api call and filter by event type client side
      var allRelations = yield _this2.matrixClient.relations(_this2.roomId, _this2.rootEvent.getId(), "m.reference", undefined, {
        from: _this2.relationsNextBatch || undefined
      });
      yield Promise.all(allRelations.events.map(event => _this2.matrixClient.decryptEventIfNeeded(event)));
      var responses = _this2.responses || new Relations("m.reference", M_POLL_RESPONSE.name, _this2.matrixClient, [M_POLL_RESPONSE.altName]);
      var pollEndEvent = allRelations.events.find(event => M_POLL_END.matches(event.getType()));
      if (_this2.validateEndEvent(pollEndEvent)) {
        _this2.endEvent = pollEndEvent;
        _this2.refilterResponsesOnEnd();
        _this2.emit(PollEvent.End);
      }
      var pollCloseTimestamp = ((_this2$endEvent = _this2.endEvent) === null || _this2$endEvent === void 0 ? void 0 : _this2$endEvent.getTs()) || Number.MAX_SAFE_INTEGER;
      var {
        responseEvents
      } = filterResponseRelations(allRelations.events, pollCloseTimestamp);
      responseEvents.forEach(event => {
        responses.addEvent(event);
      });
      _this2.relationsNextBatch = (_allRelations$nextBat = allRelations.nextBatch) !== null && _allRelations$nextBat !== void 0 ? _allRelations$nextBat : undefined;
      _this2.responses = responses;
      _this2.countUndecryptableEvents(allRelations.events);

      // while there are more pages of relations
      // fetch them
      if (_this2.relationsNextBatch) {
        // don't await
        // we want to return the first page as soon as possible
        _this2.fetchResponses();
      } else {
        // no more pages
        _this2._isFetchingResponses = false;
      }

      // emit after updating _isFetchingResponses state
      _this2.emit(PollEvent.Responses, _this2.responses);
    })();
  }

  /**
   * Only responses made before the poll ended are valid
   * Refilter after an end event is recieved
   * To ensure responses are valid
   */
  refilterResponsesOnEnd() {
    var _this$endEvent3;
    if (!this.responses) {
      return;
    }
    var pollEndTimestamp = ((_this$endEvent3 = this.endEvent) === null || _this$endEvent3 === void 0 ? void 0 : _this$endEvent3.getTs()) || Number.MAX_SAFE_INTEGER;
    this.responses.getRelations().forEach(event => {
      if (event.getTs() > pollEndTimestamp) {
        var _this$responses;
        (_this$responses = this.responses) === null || _this$responses === void 0 || _this$responses.removeEvent(event);
      }
    });
    this.emit(PollEvent.Responses, this.responses);
  }
  validateEndEvent(endEvent) {
    if (!endEvent) {
      return false;
    }
    /**
     * Repeated end events are ignored -
     * only the first (valid) closure event by origin_server_ts is counted.
     */
    if (this.endEvent && this.endEvent.getTs() < endEvent.getTs()) {
      return false;
    }

    /**
     * MSC3381
     * If a m.poll.end event is received from someone other than the poll creator or user with permission to redact
     * others' messages in the room, the event must be ignored by clients due to being invalid.
     */
    var roomCurrentState = this.room.currentState;
    var endEventSender = endEvent.getSender();
    return !!endEventSender && (endEventSender === this.rootEvent.getSender() || roomCurrentState.maySendRedactionForEvent(this.rootEvent, endEventSender));
  }
}

/**
 * Tests whether the event is a start, response or end poll event.
 *
 * @param event - Event to test
 * @returns true if the event is a poll event, else false
 */
export var isPollEvent = event => {
  var eventType = event.getType();
  return M_POLL_START.matches(eventType) || M_POLL_RESPONSE.matches(eventType) || M_POLL_END.matches(eventType);
};
//# sourceMappingURL=poll.js.map