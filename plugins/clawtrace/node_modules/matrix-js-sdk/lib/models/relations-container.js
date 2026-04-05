import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2022 The Matrix.org Foundation C.I.C.

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

import { Relations } from "./relations.js";
import { EventStatus, MatrixEventEvent } from "./event.js";
export class RelationsContainer {
  constructor(client, room) {
    this.client = client;
    this.room = room;
    // A tree of objects to access a set of related children for an event, as in:
    // this.relations.get(parentEventId).get(relationType).get(relationEventType)
    _defineProperty(this, "relations", new Map());
  }

  /**
   * Get a collection of child events to a given event in this timeline set.
   *
   * @param eventId - The ID of the event that you'd like to access child events for.
   * For example, with annotations, this would be the ID of the event being annotated.
   * @param relationType - The type of relationship involved, such as "m.annotation", "m.reference", "m.replace", etc.
   * @param eventType - The relation event's type, such as "m.reaction", etc.
   * @throws If `eventId</code>, <code>relationType</code> or <code>eventType`
   * are not valid.
   *
   * @returns
   * A container for relation events or undefined if there are no relation events for
   * the relationType.
   */
  getChildEventsForEvent(eventId, relationType, eventType) {
    var _this$relations$get;
    return (_this$relations$get = this.relations.get(eventId)) === null || _this$relations$get === void 0 || (_this$relations$get = _this$relations$get.get(relationType)) === null || _this$relations$get === void 0 ? void 0 : _this$relations$get.get(eventType);
  }
  getAllChildEventsForEvent(parentEventId) {
    var _this$relations$get2;
    var relationsForEvent = (_this$relations$get2 = this.relations.get(parentEventId)) !== null && _this$relations$get2 !== void 0 ? _this$relations$get2 : new Map();
    var events = [];
    for (var relationsRecord of relationsForEvent.values()) {
      for (var relations of relationsRecord.values()) {
        events.push(...relations.getRelations());
      }
    }
    return events;
  }

  /**
   * Set an event as the target event if any Relations exist for it already.
   * Child events can point to other child events as their parent, so this method may be
   * called for events which are also logically child events.
   *
   * @param event - The event to check as relation target.
   */
  aggregateParentEvent(event) {
    var relationsForEvent = this.relations.get(event.getId());
    if (!relationsForEvent) return;
    for (var relationsWithRelType of relationsForEvent.values()) {
      for (var relationsWithEventType of relationsWithRelType.values()) {
        relationsWithEventType.setTargetEvent(event);
      }
    }
  }

  /**
   * Add relation events to the relevant relation collection.
   *
   * @param event - The new child event to be aggregated.
   * @param timelineSet - The event timeline set within which to search for the related event if any.
   */
  aggregateChildEvent(event, timelineSet) {
    if (event.isRedacted() || event.status === EventStatus.CANCELLED) {
      return;
    }
    var relation = event.getRelation();
    if (!relation) return;
    var onEventDecrypted = () => {
      if (event.isDecryptionFailure()) {
        // This could for example happen if the encryption keys are not yet available.
        // The event may still be decrypted later. Register the listener again.
        event.once(MatrixEventEvent.Decrypted, onEventDecrypted);
        return;
      }
      this.aggregateChildEvent(event, timelineSet);
    };

    // If the event is currently encrypted, wait until it has been decrypted.
    if (event.isBeingDecrypted() || event.shouldAttemptDecryption()) {
      event.once(MatrixEventEvent.Decrypted, onEventDecrypted);
      return;
    }
    var {
      event_id: relatesToEventId,
      rel_type: relationType
    } = relation;
    var eventType = event.getType();
    var relationsForEvent = this.relations.get(relatesToEventId);
    if (!relationsForEvent) {
      relationsForEvent = new Map();
      this.relations.set(relatesToEventId, relationsForEvent);
    }
    var relationsWithRelType = relationsForEvent.get(relationType);
    if (!relationsWithRelType) {
      relationsWithRelType = new Map();
      relationsForEvent.set(relationType, relationsWithRelType);
    }
    var relationsWithEventType = relationsWithRelType.get(eventType);
    if (!relationsWithEventType) {
      var _this$room, _ref, _timelineSet$findEven;
      relationsWithEventType = new Relations(relationType, eventType, this.client);
      relationsWithRelType.set(eventType, relationsWithEventType);
      var _room = (_this$room = this.room) !== null && _this$room !== void 0 ? _this$room : timelineSet === null || timelineSet === void 0 ? void 0 : timelineSet.room;
      var relatesToEvent = (_ref = (_timelineSet$findEven = timelineSet === null || timelineSet === void 0 ? void 0 : timelineSet.findEventById(relatesToEventId)) !== null && _timelineSet$findEven !== void 0 ? _timelineSet$findEven : _room === null || _room === void 0 ? void 0 : _room.findEventById(relatesToEventId)) !== null && _ref !== void 0 ? _ref : _room === null || _room === void 0 ? void 0 : _room.getPendingEvent(relatesToEventId);
      if (relatesToEvent) {
        relationsWithEventType.setTargetEvent(relatesToEvent);
      }
    }
    relationsWithEventType.addEvent(event);
  }
}
//# sourceMappingURL=relations-container.js.map