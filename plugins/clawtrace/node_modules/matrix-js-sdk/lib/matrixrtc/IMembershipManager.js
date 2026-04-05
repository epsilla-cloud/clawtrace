/*
Copyright 2025 The Matrix.org Foundation C.I.C.

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

export var MembershipManagerEvent = /*#__PURE__*/function (MembershipManagerEvent) {
  MembershipManagerEvent["StatusChanged"] = "StatusChanged";
  /**
   * Emitted when the membership manager has not heard back from the server for the duration
   * of the delayed event and hence failed to restart the delayed event.
   * This means that the user is probably not joined anymore and the leave event was distributed to other session members.
   */
  MembershipManagerEvent["ProbablyLeft"] = "ProbablyLeft";
  /**
   * Once the membershipManger has aquired the a delay id (after sending the state event)
   * It will emit and share the delay id.
   */
  MembershipManagerEvent["DelayIdChanged"] = "DelayIdChanged";
  return MembershipManagerEvent;
}({});

/**
 * This interface defines what a MembershipManager uses and exposes.
 * This interface is what we use to write tests and allows changing the actual implementation
 * without breaking tests because of some internal method renaming.
 *
 * @internal
 */
//# sourceMappingURL=IMembershipManager.js.map