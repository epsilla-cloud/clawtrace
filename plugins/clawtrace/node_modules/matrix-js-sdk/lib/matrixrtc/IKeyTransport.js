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

export var KeyTransportEvents = /*#__PURE__*/function (KeyTransportEvents) {
  KeyTransportEvents["ReceivedKeys"] = "received_keys";
  KeyTransportEvents["NotSupportedError"] = "not_supported_error";
  return KeyTransportEvents;
}({});

/**
 * Generic interface for the transport used to share room keys.
 * Keys can be shared using different transports, e.g. to-device messages or room messages.
 */
//# sourceMappingURL=IKeyTransport.js.map