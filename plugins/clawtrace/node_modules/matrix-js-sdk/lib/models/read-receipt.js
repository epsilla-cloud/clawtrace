import _defineProperty from "@babel/runtime/helpers/defineProperty";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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

import { MAIN_ROOM_TIMELINE, ReceiptType } from "../@types/read_receipts.js";
import { TypedEventEmitter } from "./typed-event-emitter.js";
import { isSupportedReceiptType } from "../utils.js";
import { MatrixEvent } from "./event.js";
import { EventType } from "../@types/event.js";
import { MapWithDefault } from "../utils.js";
import { NotificationCountType } from "./room.js";
import { logger } from "../logger.js";
import { inMainTimelineForReceipt, threadIdForReceipt } from "../client.js";

/**
 * Create a synthetic receipt for the given event
 * @param userId - The user ID if the receipt sender
 * @param event - The event that is to be acknowledged
 * @param receiptType - The type of receipt
 * @param unthreaded - the receipt is unthreaded
 * @returns a new event with the synthetic receipt in it
 */
export function synthesizeReceipt(userId, event, receiptType) {
  var unthreaded = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  return new MatrixEvent({
    content: {
      [event.getId()]: {
        [receiptType]: {
          [userId]: _objectSpread({
            ts: event.getTs()
          }, !unthreaded && {
            thread_id: threadIdForReceipt(event)
          })
        }
      }
    },
    type: EventType.Receipt,
    room_id: event.getRoomId()
  });
}
var ReceiptPairRealIndex = 0;
var ReceiptPairSyntheticIndex = 1;
export class ReadReceipt extends TypedEventEmitter {
  constructor() {
    super(...arguments);
    // receipts should clobber based on receipt_type and user_id pairs hence
    // the form of this structure. This is sub-optimal for the exposed APIs
    // which pass in an event ID and get back some receipts, so we also store
    // a pre-cached list for this purpose.
    // Map: receipt type → user Id → receipt
    _defineProperty(this, "receipts", new MapWithDefault(() => new Map()));
    _defineProperty(this, "receiptCacheByEventId", new Map());
  }
  /**
   * Gets the latest receipt for a given user in the room
   * @param userId - The id of the user for which we want the receipt
   * @param ignoreSynthesized - Whether to ignore synthesized receipts or not
   * @param receiptType - Optional. The type of the receipt we want to get
   * @returns the latest receipts of the chosen type for the chosen user
   */
  getReadReceiptForUserId(userId) {
    var _this$receipts$get$ge, _this$receipts$get;
    var ignoreSynthesized = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var receiptType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ReceiptType.Read;
    var [realReceipt, syntheticReceipt] = (_this$receipts$get$ge = (_this$receipts$get = this.receipts.get(receiptType)) === null || _this$receipts$get === void 0 ? void 0 : _this$receipts$get.get(userId)) !== null && _this$receipts$get$ge !== void 0 ? _this$receipts$get$ge : [null, null];
    if (ignoreSynthesized) {
      return realReceipt;
    }
    return syntheticReceipt !== null && syntheticReceipt !== void 0 ? syntheticReceipt : realReceipt;
  }
  compareReceipts(a, b) {
    var _this$getUnfilteredTi;
    // Try compare them in our unfiltered timeline set order, falling back to receipt timestamp which should be
    // relatively sane as receipts are set only by the originating homeserver so as long as its clock doesn't
    // jump around then it should be valid.
    return (_this$getUnfilteredTi = this.getUnfilteredTimelineSet().compareEventOrdering(a.eventId, b.eventId)) !== null && _this$getUnfilteredTi !== void 0 ? _this$getUnfilteredTi : a.data.ts - b.data.ts;
  }

  /**
   * Get the ID of the event that a given user has read up to, or null if:
   * - we have received no read receipts for them, or
   * - the receipt we have points at an event we don't have, or
   * - the thread ID in the receipt does not match the thread root of the
   *   referenced event.
   *
   * (The event might not exist if it is not loaded, and the thread ID might
   * not match if the event has moved thread because it was redacted.)
   *
   * @param userId - The user ID to get read receipt event ID for
   * @param ignoreSynthesized - If true, return only receipts that have been
   *                            sent by the server, not implicit ones generated
   *                            by the JS SDK.
   * @returns ID of the latest existing event that the given user has read, or null.
   */
  getEventReadUpTo(userId) {
    var ignoreSynthesized = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    // Find what the latest receipt says is the latest event we have read
    var latestReceipt = this.getLatestReceipt(userId, ignoreSynthesized);
    if (!latestReceipt) {
      return null;
    }
    return this.receiptPointsAtConsistentEvent(latestReceipt) ? latestReceipt.eventId : null;
  }

  /**
   * Returns true if the event pointed at by this receipt exists, and its
   * threadRootId is consistent with the thread information in the receipt.
   */
  receiptPointsAtConsistentEvent(receipt) {
    var _receipt$data;
    var event = this.findEventById(receipt.eventId);
    if (!event) {
      // If the receipt points at a non-existent event, we have multiple
      // possibilities:
      //
      // 1. We don't have the event because it's not loaded yet - probably
      //    it's old and we're best off ignoring the receipt - we can just
      //    send a new one when we read a new event.
      //
      // 2. We have a bug e.g. we misclassified this event into the wrong
      //    thread.
      //
      // 3. The referenced event moved out of this thread (e.g. because it
      //    was deleted.)
      //
      // 4. The receipt had the incorrect thread ID (due to a bug in a
      // client, or malicious behaviour).

      // This receipt is not "valid" because it doesn't point at an event
      // we have. We want to pretend it doesn't exist.
      return false;
    }
    if (!((_receipt$data = receipt.data) !== null && _receipt$data !== void 0 && _receipt$data.thread_id)) {
      // If this is an unthreaded receipt, it could point at any event, so
      // there is no need to validate further - this receipt is valid.
      return true;
    }
    // Otherwise it is a threaded receipt...

    if (receipt.data.thread_id === MAIN_ROOM_TIMELINE) {
      // The receipt is for the main timeline: we check that the event is
      // in the main timeline.

      // Check if the event is in the main timeline
      var eventIsInMainTimeline = inMainTimelineForReceipt(event);
      if (eventIsInMainTimeline) {
        // The receipt is for the main timeline, and so is the event, so
        // the receipt is valid.
        return true;
      }
    } else {
      // The receipt is for a different thread (not the main timeline)

      if (event.threadRootId === receipt.data.thread_id) {
        // If the receipt and event agree on the thread ID, the receipt
        // is valid.
        return true;
      }
    }

    // The receipt thread ID disagrees with the event thread ID. There are 2
    // possibilities:
    //
    // 1. The event moved to a different thread after the receipt was
    //    created. This can happen if the event was redacted because that
    //    moves it to the main timeline.
    //
    // 2. There is a bug somewhere - either we put the event into the wrong
    //    thread, or someone sent an incorrect receipt.
    //
    // In many cases, we won't get here because the call to findEventById
    // would have already returned null. We include this check to cover
    // cases when `this` is a  room, meaning findEventById will find events
    // in any thread, and to be defensive against unforeseen code paths.
    logger.warn("Ignoring receipt because its thread_id (".concat(receipt.data.thread_id, ") disagrees ") + "with the thread root (".concat(event.threadRootId, ") of the referenced event ") + "(event ID = ".concat(receipt.eventId, ")"));

    // This receipt is not "valid" because it disagrees with us about what
    // thread the event is in. We want to pretend it doesn't exist.
    return false;
  }
  getLatestReceipt(userId, ignoreSynthesized) {
    var _ref, _ref2;
    // XXX: This is very very ugly and I hope I won't have to ever add a new
    // receipt type here again. IMHO this should be done by the server in
    // some more intelligent manner or the client should just use timestamps

    var publicReadReceipt = this.getReadReceiptForUserId(userId, ignoreSynthesized, ReceiptType.Read);
    var privateReadReceipt = this.getReadReceiptForUserId(userId, ignoreSynthesized, ReceiptType.ReadPrivate);

    // If we have both, compare them
    var comparison;
    if (publicReadReceipt !== null && publicReadReceipt !== void 0 && publicReadReceipt.eventId && privateReadReceipt !== null && privateReadReceipt !== void 0 && privateReadReceipt.eventId) {
      comparison = this.compareReceipts(publicReadReceipt, privateReadReceipt);
    }

    // The public receipt is more likely to drift out of date so the private
    // one has precedence
    if (!comparison) return (_ref = privateReadReceipt !== null && privateReadReceipt !== void 0 ? privateReadReceipt : publicReadReceipt) !== null && _ref !== void 0 ? _ref : null;

    // If public read receipt is older, return the private one
    return (_ref2 = comparison < 0 ? privateReadReceipt : publicReadReceipt) !== null && _ref2 !== void 0 ? _ref2 : null;
  }
  addReceiptToStructure(eventId, receiptType, userId, receipt, synthetic) {
    var _pair$ReceiptPairSynt2, _pair$ReceiptPairSynt3;
    var receiptTypesMap = this.receipts.getOrCreate(receiptType);
    var pair = receiptTypesMap.get(userId);
    if (!pair) {
      pair = [null, null];
      receiptTypesMap.set(userId, pair);
    }
    var existingReceipt = pair[ReceiptPairRealIndex];
    if (synthetic) {
      var _pair$ReceiptPairSynt;
      existingReceipt = (_pair$ReceiptPairSynt = pair[ReceiptPairSyntheticIndex]) !== null && _pair$ReceiptPairSynt !== void 0 ? _pair$ReceiptPairSynt : pair[ReceiptPairRealIndex];
    }
    var wrappedReceipt = {
      eventId,
      data: receipt
    };
    if (existingReceipt) {
      // We only want to add this receipt if we think it is later than the one we already have.
      // This is managed server-side, but because we synthesize RRs locally we have to do it here too.
      var _ordering = this.compareReceipts(existingReceipt, wrappedReceipt);
      if (_ordering >= 0) {
        return;
      }
    }
    var realReceipt = synthetic ? pair[ReceiptPairRealIndex] : wrappedReceipt;
    var syntheticReceipt = synthetic ? wrappedReceipt : pair[ReceiptPairSyntheticIndex];
    var ordering = null;
    if (realReceipt && syntheticReceipt) {
      ordering = this.getUnfilteredTimelineSet().compareEventOrdering(realReceipt.eventId, syntheticReceipt.eventId);
    }
    var preferSynthetic = ordering === null || ordering < 0;

    // we don't bother caching just real receipts by event ID as there's nothing that would read it.
    // Take the current cached receipt before we overwrite the pair elements.
    var cachedReceipt = (_pair$ReceiptPairSynt2 = pair[ReceiptPairSyntheticIndex]) !== null && _pair$ReceiptPairSynt2 !== void 0 ? _pair$ReceiptPairSynt2 : pair[ReceiptPairRealIndex];
    if (synthetic && preferSynthetic) {
      pair[ReceiptPairSyntheticIndex] = wrappedReceipt;
    } else if (!synthetic) {
      pair[ReceiptPairRealIndex] = wrappedReceipt;
      if (!preferSynthetic) {
        pair[ReceiptPairSyntheticIndex] = null;
      }
    }
    var newCachedReceipt = (_pair$ReceiptPairSynt3 = pair[ReceiptPairSyntheticIndex]) !== null && _pair$ReceiptPairSynt3 !== void 0 ? _pair$ReceiptPairSynt3 : pair[ReceiptPairRealIndex];
    if (cachedReceipt === newCachedReceipt) return;

    // clean up any previous cache entry
    if (cachedReceipt && this.receiptCacheByEventId.get(cachedReceipt.eventId)) {
      var previousEventId = cachedReceipt.eventId;
      // Remove the receipt we're about to clobber out of existence from the cache
      this.receiptCacheByEventId.set(previousEventId, this.receiptCacheByEventId.get(previousEventId).filter(r => {
        return r.type !== receiptType || r.userId !== userId;
      }));
      if (this.receiptCacheByEventId.get(previousEventId).length < 1) {
        this.receiptCacheByEventId.delete(previousEventId); // clean up the cache keys
      }
    }

    // cache the new one
    if (!this.receiptCacheByEventId.get(eventId)) {
      this.receiptCacheByEventId.set(eventId, []);
    }
    this.receiptCacheByEventId.get(eventId).push({
      userId: userId,
      type: receiptType,
      data: receipt
    });
  }

  /**
   * Get a list of receipts for the given event.
   * @param event - the event to get receipts for
   * @returns A list of receipts with a userId, type and data keys or
   * an empty list.
   */
  getReceiptsForEvent(event) {
    return this.receiptCacheByEventId.get(event.getId()) || [];
  }

  /**
   * Look in this room/thread's timeline to find an event. If `this` is a
   * room, we look in all threads, but if `this` is a thread, we look only
   * inside this thread.
   */

  /**
   * This issue should also be addressed on synapse's side and is tracked as part
   * of https://github.com/matrix-org/synapse/issues/14837
   *
   * Retrieves the read receipt for the logged in user and checks if it matches
   * the last event in the room and whether that event originated from the logged
   * in user.
   * Under those conditions we can consider the context as read. This is useful
   * because we never send read receipts against our own events
   * @param userId - the logged in user
   */
  fixupNotifications(userId) {
    var receipt = this.getReadReceiptForUserId(userId, false);
    var lastEvent = this.timeline[this.timeline.length - 1];
    if (lastEvent && (receipt === null || receipt === void 0 ? void 0 : receipt.eventId) === lastEvent.getId() && userId === lastEvent.getSender()) {
      this.setUnread(NotificationCountType.Total, 0);
      this.setUnread(NotificationCountType.Highlight, 0);
    }
  }

  /**
   * Add a temporary local-echo receipt to the room to reflect in the
   * client the fact that we've sent one.
   * @param userId - The user ID if the receipt sender
   * @param e - The event that is to be acknowledged
   * @param receiptType - The type of receipt
   * @param unthreaded - the receipt is unthreaded
   */
  addLocalEchoReceipt(userId, e, receiptType) {
    var unthreaded = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    this.addReceipt(synthesizeReceipt(userId, e, receiptType, unthreaded), true);
  }

  /**
   * Get a list of user IDs who have <b>read up to</b> the given event.
   * @param event - the event to get read receipts for.
   * @returns A list of user IDs.
   */
  getUsersReadUpTo(event) {
    return this.getReceiptsForEvent(event).filter(function (receipt) {
      return isSupportedReceiptType(receipt.type);
    }).map(function (receipt) {
      return receipt.userId;
    });
  }

  /**
   * Determines if the given user has read a particular event ID with the known
   * history of the room. This is not a definitive check as it relies only on
   * what is available to the room at the time of execution.
   * @param userId - The user ID to check the read state of.
   * @param eventId - The event ID to check if the user read.
   * @returns True if the user has read the event, false otherwise.
   */

  /**
   * Returns the most recent unthreaded receipt for a given user
   * @param userId - the MxID of the User
   * @returns an unthreaded Receipt. Can be undefined if receipts have been disabled
   * or a user chooses to use private read receipts (or we have simply not received
   * a receipt from this user yet).
   *
   * @deprecated use `hasUserReadEvent` or `getEventReadUpTo` instead
   */
}
//# sourceMappingURL=read-receipt.js.map