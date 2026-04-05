import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2022-2024 The Matrix.org Foundation C.I.C.

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

import { logger } from "./logger.js";
import { TypedEventEmitter } from "./models/typed-event-emitter.js";
import { sleep } from "./utils.js";
// /sync requests allow you to set a timeout= but the request may continue
// beyond that and wedge forever, so we need to track how long we are willing
// to keep open the connection. This constant is *ADDED* to the timeout= value
// to determine the max time we're willing to wait.
var BUFFER_PERIOD_MS = 10 * 1000;
export var MSC3575_WILDCARD = "*";
export var MSC3575_STATE_KEY_ME = "$ME";
export var MSC3575_STATE_KEY_LAZY = "$LAZY";

/**
 * Represents a subscription to a room or set of rooms. Controls which events are returned.
 */

/**
 * Controls which rooms are returned in a given list.
 */

/**
 * Represents a list subscription.
 */

/**
 * A complete Sliding Sync request.
 */

/**
 * New format of hero introduced in MSC4186 with display name and avatar URL
 * in addition to just user_id (as it is on the wire, with underscores)
 * as opposed to Hero in room-summary.ts which has fields in camelCase
 * (and also a flag to note what format the hero came from).
 */

/**
 * A complete Sliding Sync response
 */

export var SlidingSyncState = /*#__PURE__*/function (SlidingSyncState) {
  /**
   * Fired by SlidingSyncEvent.Lifecycle event immediately before processing the response.
   */
  SlidingSyncState["RequestFinished"] = "FINISHED";
  /**
   * Fired by SlidingSyncEvent.Lifecycle event immediately after all room data listeners have been
   * invoked, but before list listeners.
   */
  SlidingSyncState["Complete"] = "COMPLETE";
  return SlidingSyncState;
}({});

/**
 * Internal Class. SlidingList represents a single list in sliding sync. The list can have filters,
 * multiple sliding windows, and maintains the index-\>room_id mapping.
 */
class SlidingList {
  /**
   * Construct a new sliding list.
   * @param list - The range, sort and filter values to use for this list.
   */
  constructor(list) {
    _defineProperty(this, "list", void 0);
    _defineProperty(this, "isModified", void 0);
    // returned data
    _defineProperty(this, "joinedCount", 0);
    this.replaceList(list);
  }

  /**
   * Mark this list as modified or not. Modified lists will return sticky params with calls to getList.
   * This is useful for the first time the list is sent, or if the list has changed in some way.
   * @param modified - True to mark this list as modified so all sticky parameters will be re-sent.
   */
  setModified(modified) {
    this.isModified = modified;
  }

  /**
   * Update the list range for this list. Does not affect modified status as list ranges are non-sticky.
   * @param newRanges - The new ranges for the list
   */
  updateListRange(newRanges) {
    this.list.ranges = JSON.parse(JSON.stringify(newRanges));
  }

  /**
   * Replace list parameters. All fields will be replaced with the new list parameters.
   * @param list - The new list parameters
   */
  replaceList(list) {
    var _list$filters, _list$ranges;
    list.filters = (_list$filters = list.filters) !== null && _list$filters !== void 0 ? _list$filters : {};
    list.ranges = (_list$ranges = list.ranges) !== null && _list$ranges !== void 0 ? _list$ranges : [];
    this.list = JSON.parse(JSON.stringify(list));
    this.isModified = true;

    // reset values as the join count may be very different (if filters changed) including the rooms
    // (e.g. sort orders or sliding window ranges changed)

    // the total number of joined rooms according to the server, always >= len(roomIndexToRoomId)
    this.joinedCount = 0;
  }

  /**
   * Return a copy of the list suitable for a request body.
   * @param forceIncludeAllParams - True to forcibly include all params even if the list
   * hasn't been modified. Callers may want to do this if they are modifying the list prior to calling
   * updateList.
   */
  getList(forceIncludeAllParams) {
    var list = {
      ranges: JSON.parse(JSON.stringify(this.list.ranges))
    };
    if (this.isModified || forceIncludeAllParams) {
      list = JSON.parse(JSON.stringify(this.list));
    }
    return list;
  }
}

/**
 * When onResponse extensions should be invoked: before or after processing the main response.
 */
export var ExtensionState = /*#__PURE__*/function (ExtensionState) {
  // Call onResponse before processing the response body. This is useful when your extension is
  // preparing the ground for the response body e.g. processing to-device messages before the
  // encrypted event arrives.
  ExtensionState["PreProcess"] = "ExtState.PreProcess";
  // Call onResponse after processing the response body. This is useful when your extension is
  // decorating data from the client, and you rely on MatrixClient.getRoom returning the Room object
  // e.g. room account data.
  ExtensionState["PostProcess"] = "ExtState.PostProcess";
  return ExtensionState;
}({});

/**
 * An interface that must be satisfied to register extensions
 */

/**
 * Events which can be fired by the SlidingSync class. These are designed to provide different levels
 * of information when processing sync responses.
 *  - RoomData: concerns rooms, useful for SlidingSyncSdk to update its knowledge of rooms.
 *  - Lifecycle: concerns callbacks at various well-defined points in the sync process.
 * Specifically, the order of event invocation is:
 *  - Lifecycle (state=RequestFinished)
 *  - RoomData (N times)
 *  - Lifecycle (state=Complete)
 */
export var SlidingSyncEvent = /*#__PURE__*/function (SlidingSyncEvent) {
  /**
   * This event fires when there are updates for a room. Fired as and when rooms are encountered
   * in the response.
   */
  SlidingSyncEvent["RoomData"] = "SlidingSync.RoomData";
  /**
   * This event fires at various points in the /sync loop lifecycle.
   *  - SlidingSyncState.RequestFinished: Fires after we receive a valid response but before the
   * response has been processed. Perform any pre-process steps here. If there was a problem syncing,
   * `err` will be set (e.g network errors).
   *  - SlidingSyncState.Complete: Fires after the response has been processed.
   */
  SlidingSyncEvent["Lifecycle"] = "SlidingSync.Lifecycle";
  return SlidingSyncEvent;
}({});
/**
 * SlidingSync is a high-level data structure which controls the majority of sliding sync.
 * It has no hooks into JS SDK except for needing a MatrixClient to perform the HTTP request.
 * This means this class (and everything it uses) can be used in isolation from JS SDK if needed.
 * To hook this up with the JS SDK, you need to use SlidingSyncSdk.
 */
export class SlidingSync extends TypedEventEmitter {
  /**
   * Create a new sliding sync instance
   * @param proxyBaseUrl - The base URL of the sliding sync proxy
   * @param lists - The lists to use for sliding sync.
   * @param roomSubscriptionInfo - The params to use for room subscriptions.
   * @param client - The client to use for /sync calls.
   * @param timeoutMS - The number of milliseconds to wait for a response.
   */
  constructor(proxyBaseUrl, lists, roomSubscriptionInfo, client, timeoutMS) {
    super();
    this.proxyBaseUrl = proxyBaseUrl;
    this.roomSubscriptionInfo = roomSubscriptionInfo;
    this.client = client;
    this.timeoutMS = timeoutMS;
    _defineProperty(this, "lists", void 0);
    _defineProperty(this, "listModifiedCount", 0);
    _defineProperty(this, "terminated", false);
    // flag set when resend() is called because we cannot rely on detecting AbortError in JS SDK :(
    _defineProperty(this, "needsResend", false);
    // map of extension name to req/resp handler
    _defineProperty(this, "extensions", {});
    _defineProperty(this, "desiredRoomSubscriptions", new Set());
    // the *desired* room subscriptions
    _defineProperty(this, "confirmedRoomSubscriptions", new Set());
    // map of custom subscription name to the subscription
    _defineProperty(this, "customSubscriptions", new Map());
    // map of room ID to custom subscription name
    _defineProperty(this, "roomIdToCustomSubscription", new Map());
    _defineProperty(this, "pendingReq", void 0);
    _defineProperty(this, "abortController", void 0);
    this.lists = new Map();
    lists.forEach((list, key) => {
      this.lists.set(key, new SlidingList(list));
    });
  }

  /**
   * Add a custom room subscription, referred to by an arbitrary name. If a subscription with this
   * name already exists, it is replaced. No requests are sent by calling this method.
   * @param name - The name of the subscription. Only used to reference this subscription in
   * useCustomSubscription.
   * @param sub - The subscription information.
   */
  addCustomSubscription(name, sub) {
    if (this.customSubscriptions.has(name)) {
      logger.warn("addCustomSubscription: ".concat(name, " already exists as a custom subscription, ignoring."));
      return;
    }
    this.customSubscriptions.set(name, sub);
  }

  /**
   * Use a custom subscription previously added via addCustomSubscription. No requests are sent
   * by calling this method. Use modifyRoomSubscriptions to resend subscription information.
   * @param roomId - The room to use the subscription in.
   * @param name - The name of the subscription. If this name is unknown, the default subscription
   * will be used.
   */
  useCustomSubscription(roomId, name) {
    // We already know about this custom subscription, as it is immutable,
    // we don't need to unconfirm the subscription.
    if (this.roomIdToCustomSubscription.get(roomId) === name) {
      return;
    }
    this.roomIdToCustomSubscription.set(roomId, name);
    // unconfirm this subscription so a resend() will send it up afresh.
    this.confirmedRoomSubscriptions.delete(roomId);
  }

  /**
   * Get the room index data for a list.
   * @param key - The list key
   * @returns The list data which contains the rooms in this list
   */
  getListData(key) {
    var data = this.lists.get(key);
    if (!data) {
      return null;
    }
    return {
      joinedCount: data.joinedCount
    };
  }

  /**
   * Get the full request list parameters for a list index. This function is provided for callers to use
   * in conjunction with setList to update fields on an existing list.
   * @param key - The list key to get the params for.
   * @returns A copy of the list params or undefined.
   */
  getListParams(key) {
    var params = this.lists.get(key);
    if (!params) {
      return null;
    }
    return params.getList(true);
  }

  /**
   * Set new ranges for an existing list. Calling this function when _only_ the ranges have changed
   * is more efficient than calling setList(index,list) as this function won't resend sticky params,
   * whereas setList always will.
   * @param key - The list key to modify
   * @param ranges - The new ranges to apply.
   * @returns A promise which resolves to the transaction ID when it has been received down sync
   * (or rejects with the transaction ID if the action was not applied e.g the request was cancelled
   * immediately after sending, in which case the action will be applied in the subsequent request)
   */
  setListRanges(key, ranges) {
    var list = this.lists.get(key);
    if (!list) {
      throw new Error("no list with key " + key);
    }
    list.updateListRange(ranges);
    this.resend();
  }

  /**
   * Add or replace a list. Calling this function will interrupt the /sync request to resend new
   * lists.
   * @param key - The key to modify
   * @param list - The new list parameters.
   * @returns A promise which resolves to the transaction ID when it has been received down sync
   * (or rejects with the transaction ID if the action was not applied e.g the request was cancelled
   * immediately after sending, in which case the action will be applied in the subsequent request)
   */
  setList(key, list) {
    var existingList = this.lists.get(key);
    if (existingList) {
      existingList.replaceList(list);
      this.lists.set(key, existingList);
    } else {
      this.lists.set(key, new SlidingList(list));
    }
    this.listModifiedCount += 1;
    this.resend();
  }

  /**
   * Get the room subscriptions for the sync API.
   * @returns A copy of the desired room subscriptions.
   */
  getRoomSubscriptions() {
    return new Set(Array.from(this.desiredRoomSubscriptions));
  }

  /**
   * Modify the room subscriptions for the sync API. Calling this function will interrupt the
   * /sync request to resend new subscriptions. If the /sync stream has not started, this will
   * prepare the room subscriptions for when start() is called.
   * @param s - The new desired room subscriptions.
   */
  modifyRoomSubscriptions(s) {
    this.desiredRoomSubscriptions = s;
    this.resend();
  }

  /**
   * Modify which events to retrieve for room subscriptions. Invalidates all room subscriptions
   * such that they will be sent up afresh.
   * @param rs - The new room subscription fields to fetch.
   */
  modifyRoomSubscriptionInfo(rs) {
    this.roomSubscriptionInfo = rs;
    this.confirmedRoomSubscriptions = new Set();
    this.resend();
  }

  /**
   * Register an extension to send with the /sync request.
   * @param ext - The extension to register.
   */
  registerExtension(ext) {
    if (this.extensions[ext.name()]) {
      throw new Error("registerExtension: ".concat(ext.name(), " already exists as an extension"));
    }
    this.extensions[ext.name()] = ext;
  }
  getExtensionRequest(isInitial) {
    var _this = this;
    return _asyncToGenerator(function* () {
      var ext = {};
      for (var extName in _this.extensions) {
        ext[extName] = yield _this.extensions[extName].onRequest(isInitial);
      }
      return ext;
    })();
  }
  onPreExtensionsResponse(ext) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      yield Promise.all(Object.keys(ext).map(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (extName) {
          if (_this2.extensions[extName].when() == ExtensionState.PreProcess) {
            yield _this2.extensions[extName].onResponse(ext[extName]);
          }
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }()));
    })();
  }
  onPostExtensionsResponse(ext) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      yield Promise.all(Object.keys(ext).map(/*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(function* (extName) {
          if (_this3.extensions[extName].when() == ExtensionState.PostProcess) {
            yield _this3.extensions[extName].onResponse(ext[extName]);
          }
        });
        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }()));
    })();
  }

  /**
   * Invoke all attached room data listeners.
   * @param roomId - The room which received some data.
   * @param roomData - The raw sliding sync response JSON.
   */
  invokeRoomDataListeners(roomId, roomData) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      if (!roomData.required_state) {
        roomData.required_state = [];
      }
      if (!roomData.timeline) {
        roomData.timeline = [];
      }
      yield _this4.emitPromised(SlidingSyncEvent.RoomData, roomId, roomData);
    })();
  }

  /**
   * Invoke all attached lifecycle listeners.
   * @param state - The Lifecycle state
   * @param resp - The raw sync response JSON
   * @param err - Any error that occurred when making the request e.g. network errors.
   */
  invokeLifecycleListeners(state, resp, err) {
    this.emit(SlidingSyncEvent.Lifecycle, state, resp, err);
  }

  /**
   * Resend a Sliding Sync request. Used when something has changed in the request.
   */
  resend() {
    var _this$abortController;
    this.needsResend = true;
    (_this$abortController = this.abortController) === null || _this$abortController === void 0 || _this$abortController.abort();
    this.abortController = new AbortController();
  }

  /**
   * Stop syncing with the server.
   */
  stop() {
    var _this$abortController2;
    this.terminated = true;
    (_this$abortController2 = this.abortController) === null || _this$abortController2 === void 0 || _this$abortController2.abort();
    // remove all listeners so things can be GC'd
    this.removeAllListeners(SlidingSyncEvent.Lifecycle);
    this.removeAllListeners(SlidingSyncEvent.RoomData);
  }

  /**
   * Re-setup this connection e.g in the event of an expired session.
   */
  resetup() {
    logger.warn("SlidingSync: resetting connection info");
    // resend sticky params and de-confirm all subscriptions
    this.lists.forEach(l => {
      l.setModified(true);
    });
    this.confirmedRoomSubscriptions = new Set(); // leave desired ones alone though!
    // reset the connection as we might be wedged
    this.resend();
  }

  /**
   * Start syncing with the server. Blocks until stopped.
   */
  start() {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      _this5.abortController = new AbortController();
      var currentPos;
      var _loop = function* _loop() {
          _this5.needsResend = false;
          var resp;
          try {
            var _resp$lists, _resp$rooms, _resp$extensions;
            var reqLists = {};
            _this5.lists.forEach((l, key) => {
              reqLists[key] = l.getList(true);
            });
            var reqBody = {
              lists: reqLists,
              pos: currentPos,
              timeout: _this5.timeoutMS,
              clientTimeout: _this5.timeoutMS + BUFFER_PERIOD_MS,
              extensions: yield _this5.getExtensionRequest(currentPos === undefined)
            };
            // check if we are (un)subscribing to a room and modify request this one time for it
            var newSubscriptions = difference(_this5.desiredRoomSubscriptions, _this5.confirmedRoomSubscriptions);
            var unsubscriptions = difference(_this5.confirmedRoomSubscriptions, _this5.desiredRoomSubscriptions);
            if (unsubscriptions.size > 0) {
              reqBody.unsubscribe_rooms = Array.from(unsubscriptions);
            }
            if (newSubscriptions.size > 0) {
              reqBody.room_subscriptions = {};
              for (var roomId of newSubscriptions) {
                var customSubName = _this5.roomIdToCustomSubscription.get(roomId);
                var sub = _this5.roomSubscriptionInfo;
                if (customSubName && _this5.customSubscriptions.has(customSubName)) {
                  sub = _this5.customSubscriptions.get(customSubName);
                }
                reqBody.room_subscriptions[roomId] = sub;
              }
            }
            _this5.pendingReq = _this5.client.slidingSync(reqBody, _this5.proxyBaseUrl, _this5.abortController.signal);
            resp = yield _this5.pendingReq;
            currentPos = resp.pos;
            // update what we think we're subscribed to.
            for (var _roomId of newSubscriptions) {
              _this5.confirmedRoomSubscriptions.add(_roomId);
            }
            for (var _roomId2 of unsubscriptions) {
              _this5.confirmedRoomSubscriptions.delete(_roomId2);
            }
            // mark all these lists as having been sent as sticky so we don't keep sending sticky params
            _this5.lists.forEach(l => {
              l.setModified(false);
            });
            // set default empty values so we don't need to null check
            resp.lists = (_resp$lists = resp.lists) !== null && _resp$lists !== void 0 ? _resp$lists : {};
            resp.rooms = (_resp$rooms = resp.rooms) !== null && _resp$rooms !== void 0 ? _resp$rooms : {};
            resp.extensions = (_resp$extensions = resp.extensions) !== null && _resp$extensions !== void 0 ? _resp$extensions : {};
            Object.keys(resp.lists).forEach(key => {
              var list = _this5.lists.get(key);
              if (!list || !resp) {
                return;
              }
              list.joinedCount = resp.lists[key].count;
            });
            _this5.invokeLifecycleListeners(SlidingSyncState.RequestFinished, resp);
          } catch (err) {
            if (err.httpStatus) {
              _this5.invokeLifecycleListeners(SlidingSyncState.RequestFinished, null, err);
              if (err.httpStatus === 400) {
                // session probably expired TODO: assign an errcode
                // so drop state and re-request
                _this5.resetup();
                currentPos = undefined;
                yield sleep(50); // in case the 400 was for something else; don't tightloop
                return 0; // continue
              } // else fallthrough to generic error handling
            } else if (_this5.needsResend || err.name === "AbortError") {
              return 0; // continue
              // don't sleep as we caused this error by abort()ing the request.
            }
            logger.error(err);
            yield sleep(5000);
          }
          if (!resp) {
            return 0; // continue
          }
          yield _this5.onPreExtensionsResponse(resp.extensions);
          for (var _roomId3 in resp.rooms) {
            yield _this5.invokeRoomDataListeners(_roomId3, resp.rooms[_roomId3]);
          }
          _this5.invokeLifecycleListeners(SlidingSyncState.Complete, resp);
          yield _this5.onPostExtensionsResponse(resp.extensions);
        },
        _ret;
      while (!_this5.terminated) {
        _ret = yield* _loop();
        if (_ret === 0) continue;
      }
    })();
  }
}
var difference = (setA, setB) => {
  var diff = new Set(setA);
  for (var elem of setB) {
    diff.delete(elem);
  }
  return diff;
};
//# sourceMappingURL=sliding-sync.js.map