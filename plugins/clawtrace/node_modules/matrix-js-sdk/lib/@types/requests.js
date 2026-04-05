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

// allow camelcase as these are things that go onto the wire
/* eslint-disable camelcase */

/** Options object for {@link MatrixClient.invite}. */

export function isSendDelayedEventRequestOpts(opts) {
  if ("parent_delay_id" in opts && typeof opts.parent_delay_id !== "string") {
    // Invalid type, reject
    return false;
  }
  if ("delay" in opts && typeof opts.delay !== "number") {
    // Invalid type, reject.
    return true;
  }
  // At least one of these fields must be specified.
  return "delay" in opts || "parent_delay_id" in opts;
}
export var UpdateDelayedEventAction = /*#__PURE__*/function (UpdateDelayedEventAction) {
  UpdateDelayedEventAction["Cancel"] = "cancel";
  UpdateDelayedEventAction["Restart"] = "restart";
  UpdateDelayedEventAction["Send"] = "send";
  return UpdateDelayedEventAction;
}({});

/* eslint-enable camelcase */
//# sourceMappingURL=requests.js.map