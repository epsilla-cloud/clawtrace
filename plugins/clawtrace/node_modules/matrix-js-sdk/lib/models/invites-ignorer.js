import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
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

import { EventTimeline } from "./event-timeline.js";
import { Preset } from "../@types/partials.js";
import { globToRegexp } from "../utils.js";
import { EventType } from "../@types/event.js";
import { IGNORE_INVITES_ACCOUNT_EVENT_KEY, POLICIES_ACCOUNT_EVENT_TYPE, PolicyRecommendation, PolicyScope } from "./invites-ignorer-types.js";
export { IGNORE_INVITES_ACCOUNT_EVENT_KEY, POLICIES_ACCOUNT_EVENT_TYPE, PolicyRecommendation, PolicyScope };
var scopeToEventTypeMap = {
  [PolicyScope.User]: EventType.PolicyRuleUser,
  [PolicyScope.Room]: EventType.PolicyRuleRoom,
  [PolicyScope.Server]: EventType.PolicyRuleServer
};

/**
 * A container for ignored invites.
 *
 * # Performance
 *
 * This implementation is extremely naive. It expects that we are dealing
 * with a very short list of sources (e.g. only one). If real-world
 * applications turn out to require longer lists, we may need to rework
 * our data structures.
 */
export class IgnoredInvites {
  constructor(client) {
    this.client = client;
  }

  /**
   * Add a new rule.
   *
   * @param scope - The scope for this rule.
   * @param entity - The entity covered by this rule. Globs are supported.
   * @param reason - A human-readable reason for introducing this new rule.
   * @returns The event id for the new rule.
   */
  addRule(scope, entity, reason) {
    var _this = this;
    return _asyncToGenerator(function* () {
      var target = yield _this.getOrCreateTargetRoom();
      var response = yield _this.client.sendStateEvent(target.roomId, scopeToEventTypeMap[scope], {
        entity,
        reason,
        recommendation: PolicyRecommendation.Ban
      });
      return response.event_id;
    })();
  }

  /**
   * Remove a rule.
   */
  removeRule(event) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      yield _this2.client.redactEvent(event.getRoomId(), event.getId());
    })();
  }

  /**
   * Add a new room to the list of sources. If the user isn't a member of the
   * room, attempt to join it.
   *
   * @param roomId - A valid room id. If this room is already in the list
   * of sources, it will not be duplicated.
   * @returns `true` if the source was added, `false` if it was already present.
   * @throws If `roomId` isn't the id of a room that the current user is already
   * member of or can join.
   *
   * # Safety
   *
   * This method will rewrite the `Policies` object in the user's account data.
   * This rewrite is inherently racy and could overwrite or be overwritten by
   * other concurrent rewrites of the same object.
   */
  addSource(roomId) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      // We attempt to join the room *before* calling
      // `await this.getOrCreateSourceRooms()` to decrease the duration
      // of the racy section.
      yield _this3.client.joinRoom(roomId);
      // Race starts.
      var sources = (yield _this3.getOrCreateSourceRooms()).map(room => room.roomId);
      if (sources.includes(roomId)) {
        return false;
      }
      sources.push(roomId);
      yield _this3.withIgnoreInvitesPolicies(ignoreInvitesPolicies => {
        ignoreInvitesPolicies.sources = sources;
      });

      // Race ends.
      return true;
    })();
  }

  /**
   * Find out whether an invite should be ignored.
   *
   * @param params
   * @param params.sender - The user id for the user who issued the invite.
   * @param params.roomId - The room to which the user is invited.
   * @returns A rule matching the entity, if any was found, `null` otherwise.
   */
  getRuleForInvite(_ref) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      var {
        sender,
        roomId
      } = _ref;
      // In this implementation, we perform a very naive lookup:
      // - search in each policy room;
      // - turn each (potentially glob) rule entity into a regexp.
      //
      // Real-world testing will tell us whether this is performant enough.
      // In the (unfortunately likely) case it isn't, there are several manners
      // in which we could optimize this:
      // - match several entities per go;
      // - pre-compile each rule entity into a regexp;
      // - pre-compile entire rooms into a single regexp.
      var policyRooms = yield _this4.getOrCreateSourceRooms();
      var senderServer = sender.split(":")[1];
      var roomServer = roomId.split(":")[1];
      for (var room of policyRooms) {
        var state = room.getUnfilteredTimelineSet().getLiveTimeline().getState(EventTimeline.FORWARDS);
        for (var {
          scope,
          entities
        } of [{
          scope: PolicyScope.Room,
          entities: [roomId]
        }, {
          scope: PolicyScope.User,
          entities: [sender]
        }, {
          scope: PolicyScope.Server,
          entities: [senderServer, roomServer]
        }]) {
          var events = state.getStateEvents(scopeToEventTypeMap[scope]);
          for (var event of events) {
            var content = event.getContent();
            if ((content === null || content === void 0 ? void 0 : content.recommendation) != PolicyRecommendation.Ban) {
              // Ignoring invites only looks at `m.ban` recommendations.
              continue;
            }
            var glob = content === null || content === void 0 ? void 0 : content.entity;
            if (!glob) {
              // Invalid event.
              continue;
            }
            var regexp = void 0;
            try {
              regexp = new RegExp(globToRegexp(glob));
            } catch (_unused) {
              // Assume invalid event.
              continue;
            }
            for (var entity of entities) {
              if (entity && regexp.test(entity)) {
                return event;
              }
            }
            // No match.
          }
        }
      }
      return null;
    })();
  }

  /**
   * Get the target room, i.e. the room in which any new rule should be written.
   *
   * If there is no target room setup, a target room is created.
   *
   * Note: This method is public for testing reasons. Most clients should not need
   * to call it directly.
   *
   * # Safety
   *
   * This method will rewrite the `Policies` object in the user's account data.
   * This rewrite is inherently racy and could overwrite or be overwritten by
   * other concurrent rewrites of the same object.
   */
  getOrCreateTargetRoom() {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      var ignoreInvitesPolicies = _this5.getIgnoreInvitesPolicies();
      var target = ignoreInvitesPolicies.target;
      // Validate `target`. If it is invalid, trash out the current `target`
      // and create a new room.
      if (typeof target !== "string") {
        target = null;
      }
      if (target) {
        // Check that the room exists and is valid.
        var room = _this5.client.getRoom(target);
        if (room) {
          return room;
        } else {
          target = null;
        }
      }
      // We need to create our own policy room for ignoring invites.
      target = (yield _this5.client.createRoom({
        name: "Individual Policy Room",
        preset: Preset.PrivateChat
      })).room_id;
      yield _this5.withIgnoreInvitesPolicies(ignoreInvitesPolicies => {
        ignoreInvitesPolicies.target = target;
      });

      // Since we have just called `createRoom`, `getRoom` should not be `null`.
      return _this5.client.getRoom(target);
    })();
  }

  /**
   * Get the list of source rooms, i.e. the rooms from which rules need to be read.
   *
   * If no source rooms are setup, the target room is used as sole source room.
   *
   * Note: This method is public for testing reasons. Most clients should not need
   * to call it directly.
   *
   * # Safety
   *
   * This method will rewrite the `Policies` object in the user's account data.
   * This rewrite is inherently racy and could overwrite or be overwritten by
   * other concurrent rewrites of the same object.
   */
  getOrCreateSourceRooms() {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      var ignoreInvitesPolicies = _this6.getIgnoreInvitesPolicies();
      var sources = ignoreInvitesPolicies.sources;

      // Validate `sources`. If it is invalid, trash out the current `sources`
      // and create a new list of sources from `target`.
      var hasChanges = false;
      if (!Array.isArray(sources)) {
        // `sources` could not be an array.
        hasChanges = true;
        sources = [];
      }
      var sourceRooms = sources
      // `sources` could contain non-string / invalid room ids
      .filter(roomId => typeof roomId === "string").map(roomId => _this6.client.getRoom(roomId)).filter(room => !!room);
      if (sourceRooms.length != sources.length) {
        hasChanges = true;
      }
      if (sourceRooms.length == 0) {
        // `sources` could be empty (possibly because we've removed
        // invalid content)
        var target = yield _this6.getOrCreateTargetRoom();
        hasChanges = true;
        sourceRooms = [target];
      }
      if (hasChanges) {
        // Reload `policies`/`ignoreInvitesPolicies` in case it has been changed
        // during or by our call to `this.getTargetRoom()`.
        yield _this6.withIgnoreInvitesPolicies(ignoreInvitesPolicies => {
          ignoreInvitesPolicies.sources = sources;
        });
      }
      return sourceRooms;
    })();
  }

  /**
   * Fetch the `IGNORE_INVITES_POLICIES` object from account data.
   *
   * If both an unstable prefix version and a stable prefix version are available,
   * it will return the stable prefix version preferentially.
   *
   * The result is *not* validated but is guaranteed to be a non-null object.
   *
   * @returns A non-null object.
   */
  getIgnoreInvitesPolicies() {
    return this.getPoliciesAndIgnoreInvitesPolicies().ignoreInvitesPolicies;
  }

  /**
   * Modify in place the `IGNORE_INVITES_POLICIES` object from account data.
   */
  withIgnoreInvitesPolicies(cb) {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      var {
        policies,
        ignoreInvitesPolicies
      } = _this7.getPoliciesAndIgnoreInvitesPolicies();
      cb(ignoreInvitesPolicies);
      policies[IGNORE_INVITES_ACCOUNT_EVENT_KEY.name] = ignoreInvitesPolicies;
      yield _this7.client.setAccountData(POLICIES_ACCOUNT_EVENT_TYPE.name, policies);
    })();
  }

  /**
   * As `getIgnoreInvitesPolicies` but also return the `POLICIES_ACCOUNT_EVENT_TYPE`
   * object.
   */
  getPoliciesAndIgnoreInvitesPolicies() {
    var policies = {};
    for (var key of [POLICIES_ACCOUNT_EVENT_TYPE.name, POLICIES_ACCOUNT_EVENT_TYPE.altName]) {
      var _this$client$getAccou;
      if (!key) {
        continue;
      }
      var value = (_this$client$getAccou = this.client.getAccountData(key)) === null || _this$client$getAccou === void 0 ? void 0 : _this$client$getAccou.getContent();
      if (value) {
        policies = value;
        break;
      }
    }
    var ignoreInvitesPolicies = {};
    var hasIgnoreInvitesPolicies = false;
    for (var _key of [IGNORE_INVITES_ACCOUNT_EVENT_KEY.name, IGNORE_INVITES_ACCOUNT_EVENT_KEY.altName]) {
      if (!_key) {
        continue;
      }
      var _value = policies[_key];
      if (_value && typeof _value == "object") {
        ignoreInvitesPolicies = _value;
        hasIgnoreInvitesPolicies = true;
        break;
      }
    }
    if (!hasIgnoreInvitesPolicies) {
      policies[IGNORE_INVITES_ACCOUNT_EVENT_KEY.name] = ignoreInvitesPolicies;
    }
    return {
      policies,
      ignoreInvitesPolicies
    };
  }
}
//# sourceMappingURL=invites-ignorer.js.map