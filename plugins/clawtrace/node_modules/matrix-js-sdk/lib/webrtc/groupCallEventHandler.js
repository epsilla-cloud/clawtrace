import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2021 Šimon Brandner <simon.bra.ag@gmail.com>

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

import { ClientEvent } from "../client.js";
import { GroupCall, GroupCallIntent, GroupCallType } from "./groupCall.js";
import { RoomStateEvent } from "../models/room-state.js";
import { logger } from "../logger.js";
import { EventType } from "../@types/event.js";
import { SyncState } from "../sync.js";
export var GroupCallEventHandlerEvent = /*#__PURE__*/function (GroupCallEventHandlerEvent) {
  GroupCallEventHandlerEvent["Incoming"] = "GroupCall.incoming";
  GroupCallEventHandlerEvent["Outgoing"] = "GroupCall.outgoing";
  GroupCallEventHandlerEvent["Ended"] = "GroupCall.ended";
  GroupCallEventHandlerEvent["Participants"] = "GroupCall.participants";
  return GroupCallEventHandlerEvent;
}({});
export class GroupCallEventHandler {
  constructor(client) {
    this.client = client;
    _defineProperty(this, "groupCalls", new Map());
    // roomId -> GroupCall
    // All rooms we know about and whether we've seen a 'Room' event
    // for them. The promise will be fulfilled once we've processed that
    // event which means we're "up to date" on what calls are in a room
    // and get
    _defineProperty(this, "roomDeferreds", new Map());
    _defineProperty(this, "onRoomsChanged", room => {
      this.createGroupCallForRoom(room);
    });
    _defineProperty(this, "onRoomStateChanged", (event, state) => {
      var eventType = event.getType();
      if (eventType === EventType.GroupCallPrefix) {
        var groupCallId = event.getStateKey();
        var content = event.getContent();
        var currentGroupCall = this.groupCalls.get(state.roomId);
        if (!currentGroupCall && !content["m.terminated"] && !event.isRedacted()) {
          this.createGroupCallFromRoomStateEvent(event);
        } else if (currentGroupCall && currentGroupCall.groupCallId === groupCallId) {
          if (content["m.terminated"] || event.isRedacted()) {
            currentGroupCall.terminate(false);
          } else if (content["m.type"] !== currentGroupCall.type) {
            // TODO: Handle the callType changing when the room state changes
            logger.warn("GroupCallEventHandler onRoomStateChanged() currently does not support changing type (roomId=".concat(state.roomId, ")"));
          }
        } else if (currentGroupCall && currentGroupCall.groupCallId !== groupCallId) {
          // TODO: Handle new group calls and multiple group calls
          logger.warn("GroupCallEventHandler onRoomStateChanged() currently does not support multiple calls (roomId=".concat(state.roomId, ")"));
        }
      }
    });
  }
  start() {
    var _this = this;
    return _asyncToGenerator(function* () {
      // We wait until the client has started syncing for real.
      // This is because we only support one call at a time, and want
      // the latest. We therefore want the latest state of the room before
      // we create a group call for the room so we can be fairly sure that
      // the group call we create is really the latest one.
      if (_this.client.getSyncState() !== SyncState.Syncing) {
        logger.debug("GroupCallEventHandler start() waiting for client to start syncing");
        yield new Promise(resolve => {
          var onSync = () => {
            if (_this.client.getSyncState() === SyncState.Syncing) {
              _this.client.off(ClientEvent.Sync, onSync);
              return resolve();
            }
          };
          _this.client.on(ClientEvent.Sync, onSync);
        });
      }
      var rooms = _this.client.getRooms();
      for (var room of rooms) {
        _this.createGroupCallForRoom(room);
      }
      _this.client.on(ClientEvent.Room, _this.onRoomsChanged);
      _this.client.on(RoomStateEvent.Events, _this.onRoomStateChanged);
    })();
  }
  stop() {
    this.client.removeListener(ClientEvent.Room, this.onRoomsChanged);
    this.client.removeListener(RoomStateEvent.Events, this.onRoomStateChanged);
  }
  getRoomDeferred(roomId) {
    var deferred = this.roomDeferreds.get(roomId);
    if (deferred === undefined) {
      var resolveFunc;
      deferred = {
        prom: new Promise(resolve => {
          resolveFunc = resolve;
        })
      };
      deferred.resolve = resolveFunc;
      this.roomDeferreds.set(roomId, deferred);
    }
    return deferred;
  }
  waitUntilRoomReadyForGroupCalls(roomId) {
    return this.getRoomDeferred(roomId).prom;
  }
  getGroupCallById(groupCallId) {
    return [...this.groupCalls.values()].find(groupCall => groupCall.groupCallId === groupCallId);
  }
  createGroupCallForRoom(room) {
    var callEvents = room.currentState.getStateEvents(EventType.GroupCallPrefix);
    var sortedCallEvents = callEvents.sort((a, b) => b.getTs() - a.getTs());
    for (var callEvent of sortedCallEvents) {
      var content = callEvent.getContent();
      if (content["m.terminated"] || callEvent.isRedacted()) {
        continue;
      }
      logger.debug("GroupCallEventHandler createGroupCallForRoom() choosing group call from possible calls (stateKey=".concat(callEvent.getStateKey(), ", ts=").concat(callEvent.getTs(), ", roomId=").concat(room.roomId, ", numOfPossibleCalls=").concat(callEvents.length, ")"));
      this.createGroupCallFromRoomStateEvent(callEvent);
      break;
    }
    this.getRoomDeferred(room.roomId).resolve();
  }
  createGroupCallFromRoomStateEvent(event) {
    var roomId = event.getRoomId();
    var content = event.getContent();
    var room = this.client.getRoom(roomId);
    if (!room) {
      logger.warn("GroupCallEventHandler createGroupCallFromRoomStateEvent() couldn't find room for call (roomId=".concat(roomId, ")"));
      return;
    }
    var groupCallId = event.getStateKey();
    var callType = content["m.type"];
    if (!Object.values(GroupCallType).includes(callType)) {
      logger.warn("GroupCallEventHandler createGroupCallFromRoomStateEvent() received invalid call type (type=".concat(callType, ", roomId=").concat(roomId, ")"));
      return;
    }
    var callIntent = content["m.intent"];
    if (!Object.values(GroupCallIntent).includes(callIntent)) {
      logger.warn("Received invalid group call intent (type=".concat(callType, ", roomId=").concat(roomId, ")"));
      return;
    }
    var isPtt = Boolean(content["io.element.ptt"]);
    var dataChannelOptions;
    if (content !== null && content !== void 0 && content.dataChannelsEnabled && content !== null && content !== void 0 && content.dataChannelOptions) {
      // Pull out just the dataChannelOptions we want to support.
      var {
        ordered,
        maxPacketLifeTime,
        maxRetransmits,
        protocol
      } = content.dataChannelOptions;
      dataChannelOptions = {
        ordered,
        maxPacketLifeTime,
        maxRetransmits,
        protocol
      };
    }
    var groupCall = new GroupCall(this.client, room, callType, isPtt, callIntent, groupCallId,
    // Because without Media section a WebRTC connection is not possible, so need a RTCDataChannel to set up a
    // no media WebRTC connection anyway.
    (content === null || content === void 0 ? void 0 : content.dataChannelsEnabled) || this.client.isVoipWithNoMediaAllowed, dataChannelOptions, this.client.isVoipWithNoMediaAllowed, this.client.useLivekitForGroupCalls, content["io.element.livekit_service_url"]);
    this.groupCalls.set(room.roomId, groupCall);
    this.client.emit(GroupCallEventHandlerEvent.Incoming, groupCall);
    return groupCall;
  }
}
//# sourceMappingURL=groupCallEventHandler.js.map