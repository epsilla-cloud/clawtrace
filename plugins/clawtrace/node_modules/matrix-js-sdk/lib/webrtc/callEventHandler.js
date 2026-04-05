import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2020 The Matrix.org Foundation C.I.C.

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

import { logger } from "../logger.js";
import { CallDirection, CallError, CallErrorCode, CallState, createNewMatrixCall } from "./call.js";
import { EventType } from "../@types/event.js";
import { ClientEvent } from "../client.js";
import { GroupCallErrorCode, GroupCallEvent, GroupCallUnknownDeviceError } from "./groupCall.js";
import { RoomEvent } from "../models/room.js";

// Don't ring unless we'd be ringing for at least 3 seconds: the user needs some
// time to press the 'accept' button
var RING_GRACE_PERIOD = 3000;
export var CallEventHandlerEvent = /*#__PURE__*/function (CallEventHandlerEvent) {
  CallEventHandlerEvent["Incoming"] = "Call.incoming";
  return CallEventHandlerEvent;
}({});
export class CallEventHandler {
  constructor(client) {
    // XXX: Most of these are only public because of the tests
    _defineProperty(this, "calls", void 0);
    _defineProperty(this, "callEventBuffer", void 0);
    _defineProperty(this, "nextSeqByCall", new Map());
    _defineProperty(this, "toDeviceEventBuffers", new Map());
    _defineProperty(this, "client", void 0);
    _defineProperty(this, "candidateEventsByCall", void 0);
    _defineProperty(this, "eventBufferPromiseChain", void 0);
    _defineProperty(this, "onSync", () => {
      // Process the current event buffer and start queuing into a new one.
      var currentEventBuffer = this.callEventBuffer;
      this.callEventBuffer = [];

      // Ensure correct ordering by only processing this queue after the previous one has finished processing
      if (this.eventBufferPromiseChain) {
        this.eventBufferPromiseChain = this.eventBufferPromiseChain.then(() => this.evaluateEventBuffer(currentEventBuffer));
      } else {
        this.eventBufferPromiseChain = this.evaluateEventBuffer(currentEventBuffer);
      }
    });
    _defineProperty(this, "onRoomTimeline", event => {
      this.callEventBuffer.push(event);
    });
    _defineProperty(this, "onToDeviceEvent", event => {
      var content = event.getContent();
      if (!content.call_id) {
        this.callEventBuffer.push(event);
        return;
      }
      if (!this.nextSeqByCall.has(content.call_id)) {
        this.nextSeqByCall.set(content.call_id, 0);
      }
      if (content.seq === undefined) {
        this.callEventBuffer.push(event);
        return;
      }
      var nextSeq = this.nextSeqByCall.get(content.call_id) || 0;
      if (content.seq !== nextSeq) {
        if (!this.toDeviceEventBuffers.has(content.call_id)) {
          this.toDeviceEventBuffers.set(content.call_id, []);
        }
        var buffer = this.toDeviceEventBuffers.get(content.call_id);
        var index = buffer.findIndex(e => e.getContent().seq > content.seq);
        if (index === -1) {
          buffer.push(event);
        } else {
          buffer.splice(index, 0, event);
        }
      } else {
        var callId = content.call_id;
        this.callEventBuffer.push(event);
        this.nextSeqByCall.set(callId, content.seq + 1);
        var _buffer = this.toDeviceEventBuffers.get(callId);
        var nextEvent = _buffer && _buffer.shift();
        while (nextEvent && nextEvent.getContent().seq === this.nextSeqByCall.get(callId)) {
          this.callEventBuffer.push(nextEvent);
          this.nextSeqByCall.set(callId, nextEvent.getContent().seq + 1);
          nextEvent = _buffer.shift();
        }
      }
    });
    this.client = client;
    this.calls = new Map();
    // The sync code always emits one event at a time, so it will patiently
    // wait for us to finish processing a call invite before delivering the
    // next event, even if that next event is a hangup. We therefore accumulate
    // all our call events and then process them on the 'sync' event, ie.
    // each time a sync has completed. This way, we can avoid emitting incoming
    // call events if we get both the invite and answer/hangup in the same sync.
    // This happens quite often, eg. replaying sync from storage, catchup sync
    // after loading and after we've been offline for a bit.
    this.callEventBuffer = [];
    this.candidateEventsByCall = new Map();
  }
  start() {
    this.client.on(ClientEvent.Sync, this.onSync);
    this.client.on(RoomEvent.Timeline, this.onRoomTimeline);
    this.client.on(ClientEvent.ToDeviceEvent, this.onToDeviceEvent);
  }
  stop() {
    this.client.removeListener(ClientEvent.Sync, this.onSync);
    this.client.removeListener(RoomEvent.Timeline, this.onRoomTimeline);
    this.client.removeListener(ClientEvent.ToDeviceEvent, this.onToDeviceEvent);
  }
  evaluateEventBuffer(eventBuffer) {
    var _this = this;
    return _asyncToGenerator(function* () {
      yield Promise.all(eventBuffer.map(event => _this.client.decryptEventIfNeeded(event)));
      var callEvents = eventBuffer.filter(event => {
        var eventType = event.getType();
        return eventType.startsWith("m.call.") || eventType.startsWith("org.matrix.call.");
      });
      var ignoreCallIds = new Set();

      // inspect the buffer and mark all calls which have been answered
      // or hung up before passing them to the call event handler.
      for (var event of callEvents) {
        var eventType = event.getType();
        if (eventType === EventType.CallAnswer || eventType === EventType.CallHangup) {
          ignoreCallIds.add(event.getContent().call_id);
        }
      }

      // Process call events in the order that they were received
      for (var _event of callEvents) {
        var _eventType = _event.getType();
        var callId = _event.getContent().call_id;
        if (_eventType === EventType.CallInvite && ignoreCallIds.has(callId)) {
          // This call has previously been answered or hung up: ignore it
          continue;
        }
        try {
          yield _this.handleCallEvent(_event);
        } catch (e) {
          logger.error("CallEventHandler evaluateEventBuffer() caught exception handling call event", e);
        }
      }
    })();
  }
  handleCallEvent(event) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var _getGroupCallById;
      _this2.client.emit(ClientEvent.ReceivedVoipEvent, event);
      var content = event.getContent();
      var callRoomId = event.getRoomId() || ((_getGroupCallById = _this2.client.groupCallEventHandler.getGroupCallById(content.conf_id)) === null || _getGroupCallById === void 0 || (_getGroupCallById = _getGroupCallById.room) === null || _getGroupCallById === void 0 ? void 0 : _getGroupCallById.roomId);
      var groupCallId = content.conf_id;
      var type = event.getType();
      var senderId = event.getSender();
      var call = content.call_id ? _this2.calls.get(content.call_id) : undefined;
      var opponentDeviceId;
      var groupCall;
      if (groupCallId) {
        groupCall = _this2.client.groupCallEventHandler.getGroupCallById(groupCallId);
        if (!groupCall) {
          logger.warn("CallEventHandler handleCallEvent() could not find a group call - ignoring event (groupCallId=".concat(groupCallId, ", type=").concat(type, ")"));
          return;
        }
        opponentDeviceId = content.device_id;
        if (!opponentDeviceId) {
          logger.warn("CallEventHandler handleCallEvent() could not find a device id - ignoring event (senderId=".concat(senderId, ")"));
          groupCall.emit(GroupCallEvent.Error, new GroupCallUnknownDeviceError(senderId));
          return;
        }
        if (content.dest_session_id !== _this2.client.getSessionId()) {
          logger.warn("CallEventHandler handleCallEvent() call event does not match current session id - ignoring");
          return;
        }
      }
      var weSentTheEvent = senderId === _this2.client.credentials.userId && (opponentDeviceId === undefined || opponentDeviceId === _this2.client.getDeviceId());
      if (!callRoomId) return;
      if (type === EventType.CallInvite) {
        var _this2$client$getTurn, _createNewMatrixCall, _groupCall;
        // ignore invites you send
        if (weSentTheEvent) return;
        // expired call
        if (event.getLocalAge() > content.lifetime - RING_GRACE_PERIOD) return;
        // stale/old invite event
        if (call && call.state === CallState.Ended) return;
        if (call) {
          logger.warn("CallEventHandler handleCallEvent() already has a call but got an invite - clobbering (callId=".concat(content.call_id, ")"));
        }
        if (content.invitee && content.invitee !== _this2.client.getUserId()) {
          return; // This invite was meant for another user in the room
        }
        var timeUntilTurnCresExpire = ((_this2$client$getTurn = _this2.client.getTurnServersExpiry()) !== null && _this2$client$getTurn !== void 0 ? _this2$client$getTurn : 0) - Date.now();
        logger.info("CallEventHandler handleCallEvent() current turn creds expire in " + timeUntilTurnCresExpire + " ms");
        call = (_createNewMatrixCall = createNewMatrixCall(_this2.client, callRoomId, {
          forceTURN: _this2.client.forceTURN,
          opponentDeviceId,
          groupCallId,
          opponentSessionId: content.sender_session_id
        })) !== null && _createNewMatrixCall !== void 0 ? _createNewMatrixCall : undefined;
        if (!call) {
          logger.log("CallEventHandler handleCallEvent() this client does not support WebRTC (callId=".concat(content.call_id, ")"));
          // don't hang up the call: there could be other clients
          // connected that do support WebRTC and declining the
          // the call on their behalf would be really annoying.
          return;
        }
        call.callId = content.call_id;
        var stats = (_groupCall = groupCall) === null || _groupCall === void 0 ? void 0 : _groupCall.getGroupCallStats();
        if (stats) {
          call.initStats(stats);
        }
        try {
          yield call.initWithInvite(event);
        } catch (e) {
          if (e instanceof CallError) {
            if (e.code === GroupCallErrorCode.UnknownDevice) {
              var _groupCall2;
              (_groupCall2 = groupCall) === null || _groupCall2 === void 0 || _groupCall2.emit(GroupCallEvent.Error, e);
            } else {
              logger.error(e);
            }
          }
        }
        _this2.calls.set(call.callId, call);

        // if we stashed candidate events for that call ID, play them back now
        if (_this2.candidateEventsByCall.get(call.callId)) {
          for (var ev of _this2.candidateEventsByCall.get(call.callId)) {
            call.onRemoteIceCandidatesReceived(ev);
          }
        }

        // Were we trying to call that user (room)?
        var existingCall;
        for (var thisCall of _this2.calls.values()) {
          var _call$getOpponentMemb;
          var isCalling = [CallState.WaitLocalMedia, CallState.CreateOffer, CallState.InviteSent].includes(thisCall.state);
          if (call.roomId === thisCall.roomId && thisCall.direction === CallDirection.Outbound && ((_call$getOpponentMemb = call.getOpponentMember()) === null || _call$getOpponentMemb === void 0 ? void 0 : _call$getOpponentMemb.userId) === thisCall.invitee && isCalling) {
            existingCall = thisCall;
            break;
          }
        }
        if (existingCall) {
          if (existingCall.callId > call.callId) {
            logger.log("CallEventHandler handleCallEvent() detected glare - answering incoming call and canceling outgoing call (incomingId=".concat(call.callId, ", outgoingId=").concat(existingCall.callId, ")"));
            existingCall.replacedBy(call);
          } else {
            logger.log("CallEventHandler handleCallEvent() detected glare - hanging up incoming call (incomingId=".concat(call.callId, ", outgoingId=").concat(existingCall.callId, ")"));
            call.hangup(CallErrorCode.Replaced, true);
          }
        } else {
          _this2.client.emit(CallEventHandlerEvent.Incoming, call);
        }
        return;
      } else if (type === EventType.CallCandidates) {
        if (weSentTheEvent) return;
        if (!call) {
          // store the candidates; we may get a call eventually.
          if (!_this2.candidateEventsByCall.has(content.call_id)) {
            _this2.candidateEventsByCall.set(content.call_id, []);
          }
          _this2.candidateEventsByCall.get(content.call_id).push(event);
        } else {
          call.onRemoteIceCandidatesReceived(event);
        }
        return;
      } else if ([EventType.CallHangup, EventType.CallReject].includes(type)) {
        // Note that we also observe our own hangups here so we can see
        // if we've already rejected a call that would otherwise be valid
        if (!call) {
          var _createNewMatrixCall2;
          // if not live, store the fact that the call has ended because
          // we're probably getting events backwards so
          // the hangup will come before the invite
          call = (_createNewMatrixCall2 = createNewMatrixCall(_this2.client, callRoomId, {
            opponentDeviceId,
            opponentSessionId: content.sender_session_id
          })) !== null && _createNewMatrixCall2 !== void 0 ? _createNewMatrixCall2 : undefined;
          if (call) {
            call.callId = content.call_id;
            call.initWithHangup(event);
            _this2.calls.set(content.call_id, call);
          }
        } else {
          if (call.state !== CallState.Ended) {
            if (type === EventType.CallHangup) {
              call.onHangupReceived(content);
            } else {
              call.onRejectReceived(content);
            }

            // @ts-expect-error typescript thinks the state can't be 'ended' because we're
            // inside the if block where it wasn't, but it could have changed because
            // on[Hangup|Reject]Received are side-effecty.
            if (call.state === CallState.Ended) _this2.calls.delete(content.call_id);
          }
        }
        return;
      }

      // The following events need a call and a peer connection
      if (!call || !call.hasPeerConnection) {
        logger.info("CallEventHandler handleCallEvent() discarding possible call event as we don't have a call (type=".concat(type, ")"));
        return;
      }
      // Ignore remote echo
      if (event.getContent().party_id === call.ourPartyId) return;
      switch (type) {
        case EventType.CallAnswer:
          if (weSentTheEvent) {
            if (call.state === CallState.Ringing) {
              call.onAnsweredElsewhere(content);
            }
          } else {
            call.onAnswerReceived(event);
          }
          break;
        case EventType.CallSelectAnswer:
          call.onSelectAnswerReceived(event);
          break;
        case EventType.CallNegotiate:
          call.onNegotiateReceived(event);
          break;
        case EventType.CallAssertedIdentity:
        case EventType.CallAssertedIdentityPrefix:
          call.onAssertedIdentityReceived(event);
          break;
        case EventType.CallSDPStreamMetadataChanged:
        case EventType.CallSDPStreamMetadataChangedPrefix:
          call.onSDPStreamMetadataChangedReceived(event);
          break;
      }
    })();
  }
}
//# sourceMappingURL=callEventHandler.js.map