/*
Copyright 2016 - 2021 The Matrix.org Foundation C.I.C.

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

import { FILTER_RELATED_BY_REL_TYPES, FILTER_RELATED_BY_SENDERS, THREAD_RELATION_TYPE } from "./models/thread.js";

/**
 * Checks if a value matches a given field value, which may be a * terminated
 * wildcard pattern.
 * @param actualValue -  The value to be compared
 * @param filterValue -  The filter pattern to be compared
 * @returns true if the actualValue matches the filterValue
 */
function matchesWildcard(actualValue, filterValue) {
  if (filterValue.endsWith("*")) {
    var typePrefix = filterValue.slice(0, -1);
    return actualValue.slice(0, typePrefix.length) === typePrefix;
  } else {
    return actualValue === filterValue;
  }
}

/* eslint-disable camelcase */

/* eslint-enable camelcase */

/**
 * FilterComponent is a section of a Filter definition which defines the
 * types, rooms, senders filters etc to be applied to a particular type of resource.
 * This is all ported over from synapse's Filter object.
 *
 * N.B. that synapse refers to these as 'Filters', and what js-sdk refers to as
 * 'Filters' are referred to as 'FilterCollections'.
 */
export class FilterComponent {
  constructor(filterJson, userId) {
    this.filterJson = filterJson;
    this.userId = userId;
  }

  /**
   * Checks with the filter component matches the given event
   * @param event - event to be checked against the filter
   * @returns true if the event matches the filter
   */
  check(event) {
    var _event$getUnsigned, _bundledRelationships;
    var bundledRelationships = ((_event$getUnsigned = event.getUnsigned()) === null || _event$getUnsigned === void 0 ? void 0 : _event$getUnsigned["m.relations"]) || {};
    var relations = Object.keys(bundledRelationships);
    // Relation senders allows in theory a look-up of any senders
    // however clients can only know about the current user participation status
    // as sending a whole list of participants could be proven problematic in terms
    // of performance
    // This should be improved when bundled relationships solve that problem
    var relationSenders = [];
    if (this.userId && bundledRelationships !== null && bundledRelationships !== void 0 && (_bundledRelationships = bundledRelationships[THREAD_RELATION_TYPE.name]) !== null && _bundledRelationships !== void 0 && _bundledRelationships.current_user_participated) {
      relationSenders.push(this.userId);
    }
    return this.checkFields(event.getRoomId(), event.getSender(), event.getType(), event.getContent() ? event.getContent().url !== undefined : false, relations, relationSenders);
  }

  /**
   * Converts the filter component into the form expected over the wire
   */
  toJSON() {
    return Object.fromEntries(Object.entries({
      types: this.filterJson.types,
      not_types: this.filterJson.not_types,
      rooms: this.filterJson.rooms,
      not_rooms: this.filterJson.not_rooms,
      senders: this.filterJson.senders,
      not_senders: this.filterJson.not_senders,
      contains_url: this.filterJson.contains_url,
      [FILTER_RELATED_BY_SENDERS.name]: this.filterJson[FILTER_RELATED_BY_SENDERS.name],
      [FILTER_RELATED_BY_REL_TYPES.name]: this.filterJson[FILTER_RELATED_BY_REL_TYPES.name]
    }).filter(_ref => {
      var [_key, value] = _ref;
      return value;
    }));
  }

  /**
   * Checks whether the filter component matches the given event fields.
   * @param roomId -        the roomId for the event being checked
   * @param sender -        the sender of the event being checked
   * @param eventType -     the type of the event being checked
   * @param containsUrl -  whether the event contains a content.url field
   * @param relationTypes -  whether has aggregated relation of the given type
   * @param relationSenders - whether one of the relation is sent by the user listed
   * @returns true if the event fields match the filter
   */
  checkFields(roomId, sender, eventType, containsUrl, relationTypes, relationSenders) {
    var literalKeys = {
      rooms: function rooms(v) {
        return roomId === v;
      },
      senders: function senders(v) {
        return sender === v;
      },
      types: function types(v) {
        return matchesWildcard(eventType, v);
      }
    };
    for (var name in literalKeys) {
      var matchFunc = literalKeys[name];
      var notName = "not_" + name;
      var disallowedValues = this.filterJson[notName];
      if (disallowedValues !== null && disallowedValues !== void 0 && disallowedValues.some(matchFunc)) {
        return false;
      }
      var allowedValues = this.filterJson[name];
      if (allowedValues && !allowedValues.some(matchFunc)) {
        return false;
      }
    }
    var containsUrlFilter = this.filterJson.contains_url;
    if (containsUrlFilter !== undefined && containsUrlFilter !== containsUrl) {
      return false;
    }
    var relationTypesFilter = this.filterJson[FILTER_RELATED_BY_REL_TYPES.name];
    if (relationTypesFilter !== undefined) {
      if (!this.arrayMatchesFilter(relationTypesFilter, relationTypes)) {
        return false;
      }
    }
    var relationSendersFilter = this.filterJson[FILTER_RELATED_BY_SENDERS.name];
    if (relationSendersFilter !== undefined) {
      if (!this.arrayMatchesFilter(relationSendersFilter, relationSenders)) {
        return false;
      }
    }
    return true;
  }
  arrayMatchesFilter(filter, values) {
    return values.length > 0 && filter.every(value => {
      return values.includes(value);
    });
  }

  /**
   * Filters a list of events down to those which match this filter component
   * @param events -  Events to be checked against the filter component
   * @returns events which matched the filter component
   */
  filter(events) {
    return events.filter(this.check, this);
  }

  /**
   * Returns the limit field for a given filter component, providing a default of
   * 10 if none is otherwise specified. Cargo-culted from Synapse.
   * @returns the limit for this filter component.
   */
  limit() {
    return this.filterJson.limit !== undefined ? this.filterJson.limit : 10;
  }
}
//# sourceMappingURL=filter-component.js.map