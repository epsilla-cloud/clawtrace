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

import { UnstableValue } from "matrix-events-sdk";

/// The event type storing the user's individual policies.
///
/// Exported for testing purposes.
export var POLICIES_ACCOUNT_EVENT_TYPE = new UnstableValue("m.policies", "org.matrix.msc3847.policies");

/// The key within the user's individual policies storing the user's ignored invites.
///
/// Exported for testing purposes.
export var IGNORE_INVITES_ACCOUNT_EVENT_KEY = new UnstableValue("m.ignore.invites", "org.matrix.msc3847.ignore.invites");

/// The types of recommendations understood.
export var PolicyRecommendation = /*#__PURE__*/function (PolicyRecommendation) {
  PolicyRecommendation["Ban"] = "m.ban";
  return PolicyRecommendation;
}({});

/**
 * The various scopes for policies.
 */
export var PolicyScope = /*#__PURE__*/function (PolicyScope) {
  /**
   * The policy deals with an individual user, e.g. reject invites
   * from this user.
   */
  PolicyScope["User"] = "m.policy.user";
  /**
   * The policy deals with a room, e.g. reject invites towards
   * a specific room.
   */
  PolicyScope["Room"] = "m.policy.room";
  /**
   * The policy deals with a server, e.g. reject invites from
   * this server.
   */
  PolicyScope["Server"] = "m.policy.server";
  return PolicyScope;
}({});
//# sourceMappingURL=invites-ignorer-types.js.map