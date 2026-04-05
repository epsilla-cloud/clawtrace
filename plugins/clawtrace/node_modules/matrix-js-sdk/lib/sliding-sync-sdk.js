import _defineProperty from "@babel/runtime/helpers/defineProperty";
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

import { NotificationCountType, Room, RoomEvent } from "./models/room.js";
import { logger } from "./logger.js";
import { promiseMapSeries } from "./utils.js";
import { EventTimeline } from "./models/event-timeline.js";
import { ClientEvent } from "./client.js";
import { SyncState, _createAndReEmitRoom, defaultClientOpts, defaultSyncApiOpts, processToDeviceMessages } from "./sync.js";
import { MatrixError } from "./http-api/index.js";
import { ExtensionState, SlidingSyncEvent, SlidingSyncState } from "./sliding-sync.js";
import { EventType } from "./@types/event.js";
import { RoomStateEvent } from "./models/room-state.js";
import { RoomMemberEvent } from "./models/room-member.js";
import { KnownMembership } from "./@types/membership.js";

// Number of consecutive failed syncs that will lead to a syncState of ERROR as opposed
// to RECONNECTING. This is needed to inform the client of server issues when the
// keepAlive is successful but the server /sync fails.
var FAILED_SYNC_ERROR_THRESHOLD = 3;
class ExtensionE2EE {
  constructor(crypto) {
    this.crypto = crypto;
  }
  name() {
    return "e2ee";
  }
  when() {
    return ExtensionState.PreProcess;
  }
  onRequest(isInitial) {
    var _this = this;
    return _asyncToGenerator(function* () {
      if (isInitial) {
        // In SSS, the `?pos=` contains the stream position for device list updates.
        // If we do not have a `?pos=` (e.g because we forgot it, or because the server
        // invalidated our connection) then we MUST invlaidate all device lists because
        // the server will not tell us the delta. This will then cause UTDs as we will fail
        // to encrypt for new devices. This is an expensive call, so we should
        // really really remember `?pos=` wherever possible.
        logger.log("ExtensionE2EE: invalidating all device lists due to missing 'pos'");
        yield _this.crypto.markAllTrackedUsersAsDirty();
      }
      return {
        enabled: true // this is sticky so only send it on the initial request
      };
    })();
  }
  onResponse(data) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // Handle device list updates
      if (data.device_lists) {
        yield _this2.crypto.processDeviceLists(data.device_lists);
      }

      // Handle one_time_keys_count and unused_fallback_key_types
      yield _this2.crypto.processKeyCounts(data.device_one_time_keys_count, data["device_unused_fallback_key_types"] || data["org.matrix.msc2732.device_unused_fallback_key_types"]);
      _this2.crypto.onSyncCompleted({});
    })();
  }
}
class ExtensionToDevice {
  constructor(client, cryptoCallbacks) {
    this.client = client;
    this.cryptoCallbacks = cryptoCallbacks;
    _defineProperty(this, "nextBatch", null);
  }
  name() {
    return "to_device";
  }
  when() {
    return ExtensionState.PreProcess;
  }
  onRequest(isInitial) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      return {
        since: _this3.nextBatch !== null ? _this3.nextBatch : undefined,
        limit: 100,
        enabled: true
      };
    })();
  }
  onResponse(data) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      var events = data["events"] || [];
      var receivedToDeviceMessages;
      if (_this4.cryptoCallbacks) {
        receivedToDeviceMessages = yield _this4.cryptoCallbacks.preprocessToDeviceMessages(events);
      } else {
        receivedToDeviceMessages = events.map(rawEvent => (
        // Crypto is not enabled, so we just return the events.
        {
          message: rawEvent,
          encryptionInfo: null
        }));
      }
      processToDeviceMessages(receivedToDeviceMessages, _this4.client);
      _this4.nextBatch = data.next_batch;
    })();
  }
}
class ExtensionAccountData {
  constructor(client) {
    this.client = client;
  }
  name() {
    return "account_data";
  }
  when() {
    return ExtensionState.PostProcess;
  }
  onRequest(isInitial) {
    return _asyncToGenerator(function* () {
      return {
        enabled: true
      };
    })();
  }
  onResponse(data) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      if (data.global && data.global.length > 0) {
        _this5.processGlobalAccountData(data.global);
      }
      for (var roomId in data.rooms) {
        var accountDataEvents = mapEvents(_this5.client, roomId, data.rooms[roomId]);
        var room = _this5.client.getRoom(roomId);
        if (!room) {
          logger.warn("got account data for room but room doesn't exist on client:", roomId);
          continue;
        }
        room.addAccountData(accountDataEvents);
        accountDataEvents.forEach(e => {
          _this5.client.emit(ClientEvent.Event, e);
        });
      }
    })();
  }
  processGlobalAccountData(globalAccountData) {
    var events = mapEvents(this.client, undefined, globalAccountData);
    var prevEventsMap = events.reduce((m, c) => {
      m[c.getType()] = this.client.store.getAccountData(c.getType());
      return m;
    }, {});
    this.client.store.storeAccountDataEvents(events);
    events.forEach(accountDataEvent => {
      // Honour push rules that come down the sync stream but also
      // honour push rules that were previously cached. Base rules
      // will be updated when we receive push rules via getPushRules
      // (see sync) before syncing over the network.
      if (accountDataEvent.getType() === EventType.PushRules) {
        var rules = accountDataEvent.getContent();
        this.client.setPushRules(rules);
      }
      var prevEvent = prevEventsMap[accountDataEvent.getType()];
      this.client.emit(ClientEvent.AccountData, accountDataEvent, prevEvent);
      return accountDataEvent;
    });
  }
}
class ExtensionTyping {
  constructor(client) {
    this.client = client;
  }
  name() {
    return "typing";
  }
  when() {
    return ExtensionState.PostProcess;
  }
  onRequest(isInitial) {
    return _asyncToGenerator(function* () {
      return {
        enabled: true
      };
    })();
  }
  onResponse(data) {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      if (!(data !== null && data !== void 0 && data.rooms)) {
        return;
      }
      for (var roomId in data.rooms) {
        processEphemeralEvents(_this6.client, roomId, [data.rooms[roomId]]);
      }
    })();
  }
}
class ExtensionReceipts {
  constructor(client) {
    this.client = client;
  }
  name() {
    return "receipts";
  }
  when() {
    return ExtensionState.PostProcess;
  }
  onRequest(isInitial) {
    return _asyncToGenerator(function* () {
      return {
        enabled: true
      };
    })();
  }
  onResponse(data) {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      if (!(data !== null && data !== void 0 && data.rooms)) {
        return;
      }
      for (var roomId in data.rooms) {
        processEphemeralEvents(_this7.client, roomId, [data.rooms[roomId]]);
      }
    })();
  }
}

/**
 * A copy of SyncApi such that it can be used as a drop-in replacement for sync v2. For the actual
 * sliding sync API, see sliding-sync.ts or the class SlidingSync.
 */
export class SlidingSyncSdk {
  // accumulator of sync events in the current sync response

  constructor(slidingSync, client, opts, syncOpts) {
    this.slidingSync = slidingSync;
    this.client = client;
    _defineProperty(this, "opts", void 0);
    _defineProperty(this, "syncOpts", void 0);
    _defineProperty(this, "syncState", null);
    _defineProperty(this, "syncStateData", void 0);
    _defineProperty(this, "lastPos", null);
    _defineProperty(this, "failCount", 0);
    _defineProperty(this, "notifEvents", []);
    this.opts = defaultClientOpts(opts);
    this.syncOpts = defaultSyncApiOpts(syncOpts);
    if (client.getNotifTimelineSet()) {
      client.reEmitter.reEmit(client.getNotifTimelineSet(), [RoomEvent.Timeline, RoomEvent.TimelineReset]);
    }
    this.slidingSync.on(SlidingSyncEvent.Lifecycle, this.onLifecycle.bind(this));
    this.slidingSync.on(SlidingSyncEvent.RoomData, this.onRoomData.bind(this));
    var extensions = [new ExtensionToDevice(this.client, this.syncOpts.cryptoCallbacks), new ExtensionAccountData(this.client), new ExtensionTyping(this.client), new ExtensionReceipts(this.client)];
    if (this.syncOpts.cryptoCallbacks) {
      extensions.push(new ExtensionE2EE(this.syncOpts.cryptoCallbacks));
    }
    extensions.forEach(ext => {
      this.slidingSync.registerExtension(ext);
    });
  }
  onRoomData(roomId, roomData) {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      var room = _this8.client.store.getRoom(roomId);
      if (!room) {
        if (!roomData.initial) {
          _this8.syncOpts.logger.debug("initial flag not set but no stored room exists for room ", roomId, roomData);
          return;
        }
        room = _createAndReEmitRoom(_this8.client, roomId, _this8.opts);
      }
      yield _this8.processRoomData(_this8.client, room, roomData);
    })();
  }
  onLifecycle(state, resp, err) {
    if (err) {
      this.syncOpts.logger.debug("onLifecycle", state, err);
    }
    switch (state) {
      case SlidingSyncState.Complete:
        this.purgeNotifications();
        if (!resp) {
          break;
        }
        // Element won't stop showing the initial loading spinner unless we fire SyncState.Prepared
        if (!this.lastPos) {
          this.updateSyncState(SyncState.Prepared, {
            oldSyncToken: undefined,
            nextSyncToken: resp.pos,
            catchingUp: false,
            fromCache: false
          });
        }
        // Conversely, Element won't show the room list unless there is at least 1x SyncState.Syncing
        // so hence for the very first sync we will fire prepared then immediately syncing.
        this.updateSyncState(SyncState.Syncing, {
          oldSyncToken: this.lastPos,
          nextSyncToken: resp.pos,
          catchingUp: false,
          fromCache: false
        });
        this.lastPos = resp.pos;
        break;
      case SlidingSyncState.RequestFinished:
        if (err) {
          this.failCount += 1;
          this.updateSyncState(this.failCount > FAILED_SYNC_ERROR_THRESHOLD ? SyncState.Error : SyncState.Reconnecting, {
            error: new MatrixError(err)
          });
          if (this.shouldAbortSync(new MatrixError(err))) {
            return; // shouldAbortSync actually stops syncing too so we don't need to do anything.
          }
        } else {
          this.failCount = 0;
          this.syncOpts.logger.debug("SlidingSyncState.RequestFinished with ".concat(Object.keys((resp === null || resp === void 0 ? void 0 : resp.rooms) || []).length, " rooms"));
        }
        break;
    }
  }

  /**
   * Sync rooms the user has left.
   * @returns Resolved when they've been added to the store.
   */
  syncLeftRooms() {
    return _asyncToGenerator(function* () {
      return []; // TODO
    })();
  }

  /**
   * Peek into a room. This will result in the room in question being synced so it
   * is accessible via getRooms(). Live updates for the room will be provided.
   * @param roomId - The room ID to peek into.
   * @returns A promise which resolves once the room has been added to the
   * store.
   */
  peek(roomId) {
    return _asyncToGenerator(function* () {
      return null; // TODO
    })();
  }

  /**
   * Stop polling for updates in the peeked room. NOPs if there is no room being
   * peeked.
   */
  stopPeeking() {
    // TODO
  }

  /**
   * Specify the set_presence value to be used for subsequent calls to the Sync API.
   * @param presence - the presence to specify to set_presence of sync calls
   */
  setPresence(presence) {
    // TODO not possible in sliding sync yet
  }

  /**
   * Returns the current state of this sync object
   * @see MatrixClient#event:"sync"
   */
  getSyncState() {
    return this.syncState;
  }

  /**
   * Returns the additional data object associated with
   * the current sync state, or null if there is no
   * such data.
   * Sync errors, if available, are put in the 'error' key of
   * this object.
   */
  getSyncStateData() {
    var _this$syncStateData;
    return (_this$syncStateData = this.syncStateData) !== null && _this$syncStateData !== void 0 ? _this$syncStateData : null;
  }

  // Helper functions which set up JS SDK structs are below and are identical to the sync v2 counterparts

  createRoom(roomId) {
    // XXX cargoculted from sync.ts
    var {
      timelineSupport
    } = this.client;
    var room = new Room(roomId, this.client, this.client.getUserId(), {
      lazyLoadMembers: this.opts.lazyLoadMembers,
      pendingEventOrdering: this.opts.pendingEventOrdering,
      timelineSupport
    });
    this.client.reEmitter.reEmit(room, [RoomEvent.Name, RoomEvent.Redaction, RoomEvent.RedactionCancelled, RoomEvent.Receipt, RoomEvent.Tags, RoomEvent.LocalEchoUpdated, RoomEvent.AccountData, RoomEvent.MyMembership, RoomEvent.Timeline, RoomEvent.TimelineReset]);
    this.registerStateListeners(room);
    return room;
  }
  registerStateListeners(room) {
    // XXX cargoculted from sync.ts
    // we need to also re-emit room state and room member events, so hook it up
    // to the client now. We need to add a listener for RoomState.members in
    // order to hook them correctly.
    this.client.reEmitter.reEmit(room.currentState, [RoomStateEvent.Events, RoomStateEvent.Members, RoomStateEvent.NewMember, RoomStateEvent.Update]);
    room.currentState.on(RoomStateEvent.NewMember, (event, state, member) => {
      var _this$client$getUser;
      member.user = (_this$client$getUser = this.client.getUser(member.userId)) !== null && _this$client$getUser !== void 0 ? _this$client$getUser : undefined;
      this.client.reEmitter.reEmit(member, [RoomMemberEvent.Name, RoomMemberEvent.Typing, RoomMemberEvent.PowerLevel, RoomMemberEvent.Membership]);
    });
  }

  /*
  private deregisterStateListeners(room: Room): void { // XXX cargoculted from sync.ts
      // could do with a better way of achieving this.
      room.currentState.removeAllListeners(RoomStateEvent.Events);
      room.currentState.removeAllListeners(RoomStateEvent.Members);
      room.currentState.removeAllListeners(RoomStateEvent.NewMember);
  } */

  shouldAbortSync(error) {
    if (error.errcode === "M_UNKNOWN_TOKEN") {
      // The logout already happened, we just need to stop.
      this.syncOpts.logger.warn("Token no longer valid - assuming logout");
      this.stop();
      this.updateSyncState(SyncState.Error, {
        error
      });
      return true;
    }
    return false;
  }
  processRoomData(client, room, roomData) {
    var _this9 = this;
    return _asyncToGenerator(function* () {
      roomData = ensureNameEvent(client, room.roomId, roomData);
      var stateEvents = mapEvents(_this9.client, room.roomId, roomData.required_state);
      // Prevent events from being decrypted ahead of time
      // this helps large account to speed up faster
      // room::decryptCriticalEvent is in charge of decrypting all the events
      // required for a client to function properly
      var timelineEvents = mapEvents(_this9.client, room.roomId, roomData.timeline, false);
      var ephemeralEvents = []; // TODO this.mapSyncEventsFormat(joinObj.ephemeral);

      // TODO: handle threaded / beacon events

      if (roomData.limited || roomData.initial) {
        // we should not know about any of these timeline entries if this is a genuinely new room.
        // If we do, then we've effectively done scrollback (e.g requesting timeline_limit: 1 for
        // this room, then timeline_limit: 50).
        var knownEvents = new Set();
        room.getLiveTimeline().getEvents().forEach(e => {
          knownEvents.add(e.getId());
        });
        // all unknown events BEFORE a known event must be scrollback e.g:
        //       D E   <-- what we know
        // A B C D E F <-- what we just received
        // means:
        // A B C       <-- scrollback
        //       D E   <-- dupes
        //           F <-- new event
        // We bucket events based on if we have seen a known event yet.
        var oldEvents = [];
        var newEvents = [];
        var seenKnownEvent = false;
        for (var i = timelineEvents.length - 1; i >= 0; i--) {
          var recvEvent = timelineEvents[i];
          if (knownEvents.has(recvEvent.getId())) {
            seenKnownEvent = true;
            continue; // don't include this event, it's a dupe
          }
          if (seenKnownEvent) {
            // old -> new
            oldEvents.push(recvEvent);
          } else {
            // old -> new
            newEvents.unshift(recvEvent);
          }
        }
        timelineEvents = newEvents;
        if (oldEvents.length > 0) {
          // old events are scrollback, insert them now
          room.addEventsToTimeline(oldEvents, true, false, room.getLiveTimeline(), roomData.prev_batch);
        }
      }
      var encrypted = room.hasEncryptionStateEvent();
      // we do this first so it's correct when any of the events fire
      if (roomData.notification_count != null) {
        room.setUnreadNotificationCount(NotificationCountType.Total, roomData.notification_count);
      }
      if (roomData.highlight_count != null) {
        // We track unread notifications ourselves in encrypted rooms, so don't
        // bother setting it here. We trust our calculations better than the
        // server's for this case, and therefore will assume that our non-zero
        // count is accurate.
        if (!encrypted || encrypted && room.getUnreadNotificationCount(NotificationCountType.Highlight) <= 0) {
          room.setUnreadNotificationCount(NotificationCountType.Highlight, roomData.highlight_count);
        }
      }
      if (roomData.bump_stamp) {
        room.setBumpStamp(roomData.bump_stamp);
      }
      if (Number.isInteger(roomData.invited_count)) {
        room.currentState.setInvitedMemberCount(roomData.invited_count);
      }
      if (Number.isInteger(roomData.joined_count)) {
        room.currentState.setJoinedMemberCount(roomData.joined_count);
      }
      if (roomData.invite_state) {
        var inviteStateEvents = mapEvents(_this9.client, room.roomId, roomData.invite_state);
        yield _this9.injectRoomEvents(room, inviteStateEvents);
        if (roomData.initial) {
          room.recalculate();
          _this9.client.store.storeRoom(room);
          _this9.client.emit(ClientEvent.Room, room);
        }
        inviteStateEvents.forEach(e => {
          _this9.client.emit(ClientEvent.Event, e);
        });
        return;
      }
      if (roomData.limited) {
        var _roomData$prev_batch;
        // set the back-pagination token. Do this *before* adding any
        // events so that clients can start back-paginating.
        room.getLiveTimeline().setPaginationToken((_roomData$prev_batch = roomData.prev_batch) !== null && _roomData$prev_batch !== void 0 ? _roomData$prev_batch : null, EventTimeline.BACKWARDS);
      }

      /* TODO
      else if (roomData.limited) {
           let limited = true;
           // we've got a limited sync, so we *probably* have a gap in the
          // timeline, so should reset. But we might have been peeking or
          // paginating and already have some of the events, in which
          // case we just want to append any subsequent events to the end
          // of the existing timeline.
          //
          // This is particularly important in the case that we already have
          // *all* of the events in the timeline - in that case, if we reset
          // the timeline, we'll end up with an entirely empty timeline,
          // which we'll try to paginate but not get any new events (which
          // will stop us linking the empty timeline into the chain).
          //
          for (let i = timelineEvents.length - 1; i >= 0; i--) {
              const eventId = timelineEvents[i].getId();
              if (room.getTimelineForEvent(eventId)) {
                  this.syncOpts.logger.debug("Already have event " + eventId + " in limited " +
                      "sync - not resetting");
                  limited = false;
                   // we might still be missing some of the events before i;
                  // we don't want to be adding them to the end of the
                  // timeline because that would put them out of order.
                  timelineEvents.splice(0, i);
                   // XXX: there's a problem here if the skipped part of the
                  // timeline modifies the state set in stateEvents, because
                  // we'll end up using the state from stateEvents rather
                  // than the later state from timelineEvents. We probably
                  // need to wind stateEvents forward over the events we're
                  // skipping.
                  break;
              }
          }
           if (limited) {
              room.resetLiveTimeline(
                  roomData.prev_batch,
                  null, // TODO this.syncOpts.canResetEntireTimeline(room.roomId) ? null : syncEventData.oldSyncToken,
              );
               // We have to assume any gap in any timeline is
              // reason to stop incrementally tracking notifications and
              // reset the timeline.
              this.client.resetNotifTimelineSet();
              this.registerStateListeners(room);
          }
      } */

      yield _this9.injectRoomEvents(room, stateEvents, timelineEvents, roomData.num_live);

      // we deliberately don't add ephemeral events to the timeline
      room.addEphemeralEvents(ephemeralEvents);

      // local fields must be set before any async calls because call site assumes
      // synchronous execution prior to emitting SlidingSyncState.Complete
      room.updateMyMembership(KnownMembership.Join);
      room.setMSC4186SummaryData(roomData.heroes, roomData.joined_count, roomData.invited_count);
      room.recalculate();
      if (roomData.initial) {
        client.store.storeRoom(room);
        client.emit(ClientEvent.Room, room);
      }

      // check if any timeline events should bing and add them to the notifEvents array:
      // we'll purge this once we've fully processed the sync response
      _this9.addNotifications(timelineEvents);
      var processRoomEvent = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (e) {
          client.emit(ClientEvent.Event, e);
          if (e.isState() && e.getType() == EventType.RoomEncryption && _this9.syncOpts.cryptoCallbacks) {
            yield _this9.syncOpts.cryptoCallbacks.onCryptoEvent(room, e);
          }
        });
        return function processRoomEvent(_x) {
          return _ref.apply(this, arguments);
        };
      }();
      yield promiseMapSeries(stateEvents, processRoomEvent);
      yield promiseMapSeries(timelineEvents, processRoomEvent);
      ephemeralEvents.forEach(function (e) {
        client.emit(ClientEvent.Event, e);
      });

      // Decrypt only the last message in all rooms to make sure we can generate a preview
      // And decrypt all events after the recorded read receipt to ensure an accurate
      // notification count
      room.decryptCriticalEvents();
    })();
  }

  /**
   * Injects events into a room's model.
   * @param stateEventList - A list of state events. This is the state
   * at the *END* of the timeline list if it is supplied.
   * @param timelineEventList - A list of timeline events. Lower index
   * is earlier in time. Higher index is later.
   * @param numLive - the number of events in timelineEventList which just happened,
   * supplied from the server.
   */
  injectRoomEvents(room, stateEventList) {
    var _arguments = arguments,
      _this0 = this;
    return _asyncToGenerator(function* () {
      var timelineEventList = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : [];
      var numLive = _arguments.length > 3 && _arguments[3] !== undefined ? _arguments[3] : 0;
      // If there are no events in the timeline yet, initialise it with
      // the given state events
      var liveTimeline = room.getLiveTimeline();
      var timelineWasEmpty = liveTimeline.getEvents().length == 0;
      if (timelineWasEmpty) {
        // Passing these events into initialiseState will freeze them, so we need
        // to compute and cache the push actions for them now, otherwise sync dies
        // with an attempt to assign to read only property.
        // XXX: This is pretty horrible and is assuming all sorts of behaviour from
        // these functions that it shouldn't be. We should probably either store the
        // push actions cache elsewhere so we can freeze MatrixEvents, or otherwise
        // find some solution where MatrixEvents are immutable but allow for a cache
        // field.
        for (var ev of stateEventList) {
          _this0.client.getPushActionsForEvent(ev);
        }
        liveTimeline.initialiseState(stateEventList);
      }

      // If the timeline wasn't empty, we process the state events here: they're
      // defined as updates to the state before the start of the timeline, so this
      // starts to roll the state forward.
      // XXX: That's what we *should* do, but this can happen if we were previously
      // peeking in a room, in which case we obviously do *not* want to add the
      // state events here onto the end of the timeline. Historically, the js-sdk
      // has just set these new state events on the old and new state. This seems
      // very wrong because there could be events in the timeline that diverge the
      // state, in which case this is going to leave things out of sync. However,
      // for now I think it;s best to behave the same as the code has done previously.
      if (!timelineWasEmpty) {
        // XXX: As above, don't do this...
        //room.addLiveEvents(stateEventList || []);
        // Do this instead...
        room.oldState.setStateEvents(stateEventList);
        room.currentState.setStateEvents(stateEventList);
      }

      // the timeline is broken into 'live' events which just happened and normal timeline events
      // which are still to be appended to the end of the live timeline but happened a while ago.
      // The live events are marked as fromCache=false to ensure that downstream components know
      // this is a live event, not historical (from a remote server cache).

      var liveTimelineEvents = [];
      if (numLive > 0) {
        // last numLive events are live
        liveTimelineEvents = timelineEventList.slice(-1 * numLive);
        // everything else is not live
        timelineEventList = timelineEventList.slice(0, -1 * liveTimelineEvents.length);
      }

      // Execute the timeline events.
      // This also needs to be done before running push rules on the events as they need
      // to be decorated with sender etc.
      yield room.addLiveEvents(timelineEventList, {
        fromCache: true,
        addToState: false
      });
      if (liveTimelineEvents.length > 0) {
        yield room.addLiveEvents(liveTimelineEvents, {
          fromCache: false,
          addToState: false
        });
      }
      room.recalculate();

      // resolve invites now we have set the latest state
      _this0.resolveInvites(room);
    })();
  }
  resolveInvites(room) {
    if (!room || !this.opts.resolveInvitesToProfiles) {
      return;
    }
    var client = this.client;
    // For each invited room member we want to give them a displayname/avatar url
    // if they have one (the m.room.member invites don't contain this).
    room.getMembersWithMembership(KnownMembership.Invite).forEach(function (member) {
      if (member.requestedProfileInfo) return;
      member.requestedProfileInfo = true;
      // try to get a cached copy first.
      var user = client.getUser(member.userId);
      var promise;
      if (user) {
        promise = Promise.resolve({
          avatar_url: user.avatarUrl,
          displayname: user.displayName
        });
      } else {
        promise = client.getProfileInfo(member.userId);
      }
      promise.then(function (info) {
        // slightly naughty by doctoring the invite event but this means all
        // the code paths remain the same between invite/join display name stuff
        // which is a worthy trade-off for some minor pollution.
        var inviteEvent = member.events.member;
        if (inviteEvent.getContent().membership !== KnownMembership.Invite) {
          // between resolving and now they have since joined, so don't clobber
          return;
        }
        inviteEvent.getContent().avatar_url = info.avatar_url;
        inviteEvent.getContent().displayname = info.displayname;
        // fire listeners
        member.setMembershipEvent(inviteEvent, room.currentState);
      }, function (_err) {
        // OH WELL.
      });
    });
  }
  retryImmediately() {
    return true;
  }

  /**
   * Main entry point. Blocks until stop() is called.
   */
  sync() {
    var _this1 = this;
    return _asyncToGenerator(function* () {
      _this1.syncOpts.logger.debug("Sliding sync init loop");

      //   1) We need to get push rules so we can check if events should bing as we get
      //      them from /sync.
      while (!_this1.client.isGuest()) {
        try {
          _this1.syncOpts.logger.debug("Getting push rules...");
          var result = yield _this1.client.getPushRules();
          _this1.syncOpts.logger.debug("Got push rules");
          _this1.client.pushRules = result;
          break;
        } catch (err) {
          _this1.syncOpts.logger.error("Getting push rules failed", err);
          if (_this1.shouldAbortSync(err)) {
            return;
          }
        }
      }

      // start syncing
      yield _this1.slidingSync.start();
    })();
  }

  /**
   * Stops the sync object from syncing.
   */
  stop() {
    this.syncOpts.logger.debug("SyncApi.stop");
    this.slidingSync.stop();
  }

  /**
   * Sets the sync state and emits an event to say so
   * @param newState - The new state string
   * @param data - Object of additional data to emit in the event
   */
  updateSyncState(newState, data) {
    var old = this.syncState;
    this.syncState = newState;
    this.syncStateData = data;
    this.client.emit(ClientEvent.Sync, this.syncState, old, data);
  }

  /**
   * Takes a list of timelineEvents and adds and adds to notifEvents
   * as appropriate.
   * This must be called after the room the events belong to has been stored.
   *
   * @param timelineEventList - A list of timeline events. Lower index
   * is earlier in time. Higher index is later.
   */
  addNotifications(timelineEventList) {
    // gather our notifications into this.notifEvents
    if (!this.client.getNotifTimelineSet()) {
      return;
    }
    for (var timelineEvent of timelineEventList) {
      var pushActions = this.client.getPushActionsForEvent(timelineEvent);
      if (pushActions && pushActions.notify && pushActions.tweaks && pushActions.tweaks.highlight) {
        this.notifEvents.push(timelineEvent);
      }
    }
  }

  /**
   * Purge any events in the notifEvents array. Used after a /sync has been complete.
   * This should not be called at a per-room scope (e.g in onRoomData) because otherwise the ordering
   * will be messed up e.g room A gets a bing, room B gets a newer bing, but both in the same /sync
   * response. If we purge at a per-room scope then we could process room B before room A leading to
   * room B appearing earlier in the notifications timeline, even though it has the higher origin_server_ts.
   */
  purgeNotifications() {
    this.notifEvents.sort(function (a, b) {
      return a.getTs() - b.getTs();
    });
    this.notifEvents.forEach(event => {
      var _this$client$getNotif;
      (_this$client$getNotif = this.client.getNotifTimelineSet()) === null || _this$client$getNotif === void 0 || _this$client$getNotif.addLiveEvent(event, {
        addToState: false
      });
    });
    this.notifEvents = [];
  }
}
function ensureNameEvent(client, roomId, roomData) {
  // make sure m.room.name is in required_state if there is a name, replacing anything previously
  // there if need be. This ensures clients transparently 'calculate' the right room name. Native
  // sliding sync clients should just read the "name" field.
  if (!roomData.name) {
    return roomData;
  }
  for (var stateEvent of roomData.required_state) {
    if (stateEvent.type === EventType.RoomName && stateEvent.state_key === "") {
      stateEvent.content = {
        name: roomData.name
      };
      return roomData;
    }
  }
  roomData.required_state.push({
    event_id: "$fake-sliding-sync-name-event-" + roomId,
    state_key: "",
    type: EventType.RoomName,
    content: {
      name: roomData.name
    },
    sender: client.getUserId(),
    origin_server_ts: new Date().getTime()
  });
  return roomData;
}
// Helper functions which set up JS SDK structs are below and are identical to the sync v2 counterparts,
// just outside the class.
function mapEvents(client, roomId, events) {
  var decrypt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var mapper = client.getEventMapper({
    decrypt
  });
  return events.map(function (e) {
    e.room_id = roomId;
    return mapper(e);
  });
}
function processEphemeralEvents(client, roomId, ephEvents) {
  var ephemeralEvents = mapEvents(client, roomId, ephEvents);
  var room = client.getRoom(roomId);
  if (!room) {
    logger.warn("got ephemeral events for room but room doesn't exist on client:", roomId);
    return;
  }
  room.addEphemeralEvents(ephemeralEvents);
  ephemeralEvents.forEach(e => {
    client.emit(ClientEvent.Event, e);
  });
}
//# sourceMappingURL=sliding-sync-sdk.js.map