/*
Copyright 2015 - 2022 The Matrix.org Foundation C.I.C.

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

/**
 * Enum for event statuses.
 * @readonly
 */
export var EventStatus = /*#__PURE__*/function (EventStatus) {
  /** The event was not sent and will no longer be retried. */
  EventStatus["NOT_SENT"] = "not_sent";
  /** The message is being encrypted */
  EventStatus["ENCRYPTING"] = "encrypting";
  /** The event is in the process of being sent. */
  EventStatus["SENDING"] = "sending";
  /** The event is in a queue waiting to be sent. */
  EventStatus["QUEUED"] = "queued";
  /** The event has been sent to the server, but we have not yet received the echo. */
  EventStatus["SENT"] = "sent";
  /** The event was cancelled before it was successfully sent. */
  EventStatus["CANCELLED"] = "cancelled";
  return EventStatus;
}({});
//# sourceMappingURL=event-status.js.map