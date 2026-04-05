import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
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

import { TypedEventEmitter } from "../models/typed-event-emitter.js";
import { KeyTransportEvents } from "./IKeyTransport.js";
import { logger as rootLogger } from "../logger.js";
import { ClientEvent } from "../client.js";
import { EventType } from "../@types/event.js";
export class NotSupportedError extends Error {
  constructor(message) {
    super(message);
  }
  get name() {
    return "NotSupportedError";
  }
}
/**
 * ToDeviceKeyTransport is used to send MatrixRTC keys to other devices using the
 * to-device CS-API.
 */
export class ToDeviceKeyTransport extends TypedEventEmitter {
  setParentLogger(parentLogger) {
    this.logger = parentLogger.getChild("[ToDeviceKeyTransport]");
  }
  constructor(membership, roomId, client, statistics, parentLogger) {
    super();
    this.membership = membership;
    this.roomId = roomId;
    this.client = client;
    this.statistics = statistics;
    _defineProperty(this, "logger", rootLogger);
    _defineProperty(this, "onToDeviceEvent", event => {
      if (event.getType() !== EventType.CallEncryptionKeysPrefix) {
        // Ignore this is not a call encryption event
        return;
      }

      // TODO: Not possible to check if the event is encrypted or not
      // see https://github.com/matrix-org/matrix-rust-sdk/issues/4883
      // if (evnt.getWireType() != EventType.RoomMessageEncrypted) {
      //     // WARN: The call keys were sent in clear. Ignore them
      //     logger.warn(`Call encryption keys sent in clear from: ${event.getSender()}`);
      //     return;
      // }

      var content = this.getValidEventContent(event);
      if (!content) return;
      if (!event.getSender()) return;
      this.receiveCallKeyEvent(event.getSender(), content);
    });
    this.setParentLogger(parentLogger !== null && parentLogger !== void 0 ? parentLogger : rootLogger);
  }
  start() {
    this.client.on(ClientEvent.ToDeviceEvent, this.onToDeviceEvent);
  }
  stop() {
    this.client.off(ClientEvent.ToDeviceEvent, this.onToDeviceEvent);
  }
  sendKey(keyBase64Encoded, index, members) {
    var _this = this;
    return _asyncToGenerator(function* () {
      var content = {
        keys: {
          index: index,
          key: keyBase64Encoded
        },
        room_id: _this.roomId,
        member: {
          claimed_device_id: _this.membership.deviceId,
          id: _this.membership.memberId
        },
        session: {
          call_id: "",
          application: "m.call",
          scope: "m.room"
        },
        sent_ts: Date.now()
      };
      var targets = members.map(member => {
        return {
          userId: member.userId,
          deviceId: member.deviceId
        };
      })
      // filter out me
      .filter(member => !(member.userId == _this.membership.userId && member.deviceId == _this.membership.deviceId));
      if (targets.length > 0) {
        yield _this.client.encryptAndSendToDevice(EventType.CallEncryptionKeysPrefix, targets, content).catch(error => {
          var msg = error.message;
          // This is not ideal. We would want to have a custom error type for unsupported actions.
          // This is not part of the widget API spec. Since as of now there are only two implementations:
          // Rust SDK + JS-SDK, and the JS-SDK does support to-device sending, we can assume that
          // this is a widget driver issue error message.
          if (msg.includes("unknown variant") && msg.includes("send_to_device") || msg.includes("not supported")) {
            throw new NotSupportedError("The widget driver does not support to-device encryption");
          }
        });
        _this.statistics.counters.roomEventEncryptionKeysSent += 1;
      } else {
        _this.logger.warn("No targets found for sending key");
      }
    })();
  }
  receiveCallKeyEvent(fromUser, content) {
    var _content$member$id;
    // The event has already been validated at this point.

    this.statistics.counters.roomEventEncryptionKeysReceived += 1;

    // What is this, and why is it needed?
    // Also to device events do not have an origin server ts
    var now = Date.now();
    var age = now - (typeof content.sent_ts === "number" ? content.sent_ts : now);
    this.statistics.totals.roomEventEncryptionKeysReceivedTotalAge += age;
    var hardcodedMemberIdAlternative = "".concat(fromUser, ":").concat(content.member.claimed_device_id);
    this.emit(KeyTransportEvents.ReceivedKeys,
    // TODO userId this is claimed information, deviceId is claimed information
    {
      userId: fromUser,
      deviceId: content.member.claimed_device_id,
      memberId: (_content$member$id = content.member.id) !== null && _content$member$id !== void 0 ? _content$member$id : hardcodedMemberIdAlternative
    }, content.keys.key, content.keys.index, now);
  }
  getValidEventContent(event) {
    var content = event.getContent();
    var roomId = content.room_id;
    if (!roomId) {
      // Invalid event
      this.logger.warn("Malformed Event: invalid call encryption keys event, no roomId");
      return;
    }
    if (roomId !== this.roomId) {
      this.logger.warn("Malformed Event: Mismatch roomId");
      return;
    }
    if (!content.keys || !content.keys.key || typeof content.keys.index !== "number") {
      this.logger.warn("Malformed Event: Missing keys field");
      return;
    }
    if (!content.member || !content.member.claimed_device_id) {
      this.logger.warn("Malformed Event: Missing claimed_device_id");
      return;
    }

    // TODO check for session related fields once the to-device encryption uses the new format.
    return content;
  }
}
//# sourceMappingURL=ToDeviceKeyTransport.js.map