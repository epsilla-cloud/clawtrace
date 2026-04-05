import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
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

import { ToDeviceMessageId } from "./@types/event.js";
import { ClientEvent } from "./client.js";
import { MatrixScheduler } from "./scheduler.js";
import { SyncState } from "./sync.js";
import { MapWithDefault } from "./utils.js";
var MAX_BATCH_SIZE = 20;

/**
 * Maintains a queue of outgoing to-device messages, sending them
 * as soon as the homeserver is reachable.
 */
export class ToDeviceMessageQueue {
  constructor(client, logger) {
    var _this = this;
    this.client = client;
    this.logger = logger;
    _defineProperty(this, "sending", false);
    _defineProperty(this, "running", true);
    _defineProperty(this, "retryTimeout", null);
    _defineProperty(this, "retryAttempts", 0);
    _defineProperty(this, "sendQueue", /*#__PURE__*/_asyncToGenerator(function* () {
      if (_this.retryTimeout !== null) clearTimeout(_this.retryTimeout);
      _this.retryTimeout = null;
      if (_this.sending || !_this.running) return;
      _this.logger.debug("Attempting to send queued to-device messages");
      _this.sending = true;
      var headBatch;
      try {
        while (_this.running) {
          headBatch = yield _this.client.store.getOldestToDeviceBatch();
          if (headBatch === null) break;
          yield _this.sendBatch(headBatch);
          yield _this.client.store.removeToDeviceBatch(headBatch.id);
          _this.retryAttempts = 0;
        }

        // Make sure we're still running after the async tasks: if not, stop.
        if (!_this.running) return;
        _this.logger.debug("All queued to-device messages sent");
      } catch (e) {
        ++_this.retryAttempts;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        // eslint-disable-next-line new-cap
        var retryDelay = MatrixScheduler.RETRY_BACKOFF_RATELIMIT(null, _this.retryAttempts, e);
        if (retryDelay === -1) {
          // the scheduler function doesn't differentiate between fatal errors and just getting
          // bored and giving up for now
          if (Math.floor(e.httpStatus / 100) === 4) {
            _this.logger.error("Fatal error when sending to-device message - dropping to-device batch!", e);
            yield _this.client.store.removeToDeviceBatch(headBatch.id);
          } else {
            _this.logger.info("Automatic retry limit reached for to-device messages.");
          }
          return;
        }
        _this.logger.info("Failed to send batch of to-device messages. Will retry in ".concat(retryDelay, "ms"), e);
        _this.retryTimeout = setTimeout(_this.sendQueue, retryDelay);
      } finally {
        _this.sending = false;
      }
    }));
    /**
     * Listen to sync state changes and automatically resend any pending events
     * once syncing is resumed
     */
    _defineProperty(this, "onResumedSync", (state, oldState) => {
      if (state === SyncState.Syncing && oldState !== SyncState.Syncing) {
        this.logger.info("Resuming queue after resumed sync");
        this.sendQueue();
      }
    });
  }
  start() {
    this.running = true;
    this.sendQueue();
    this.client.on(ClientEvent.Sync, this.onResumedSync);
  }
  stop() {
    this.running = false;
    if (this.retryTimeout !== null) clearTimeout(this.retryTimeout);
    this.retryTimeout = null;
    this.client.removeListener(ClientEvent.Sync, this.onResumedSync);
  }
  queueBatch(batch) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var batches = [];
      for (var i = 0; i < batch.batch.length; i += MAX_BATCH_SIZE) {
        var batchWithTxnId = {
          eventType: batch.eventType,
          batch: batch.batch.slice(i, i + MAX_BATCH_SIZE),
          txnId: _this2.client.makeTxnId()
        };
        batches.push(batchWithTxnId);
        var msgmap = batchWithTxnId.batch.map(msg => "".concat(msg.userId, "/").concat(msg.deviceId, " (msgid ").concat(msg.payload[ToDeviceMessageId], ")"));
        _this2.logger.info("Enqueuing batch of to-device messages. type=".concat(batch.eventType, " txnid=").concat(batchWithTxnId.txnId), msgmap);
      }
      yield _this2.client.store.saveToDeviceBatches(batches);
      _this2.sendQueue();
    })();
  }
  /**
   * Attempts to send a batch of to-device messages.
   */
  sendBatch(batch) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      var contentMap = new MapWithDefault(() => new Map());
      for (var item of batch.batch) {
        contentMap.getOrCreate(item.userId).set(item.deviceId, item.payload);
      }
      _this3.logger.info("Sending batch of ".concat(batch.batch.length, " to-device messages with ID ").concat(batch.id, " and txnId ").concat(batch.txnId));
      yield _this3.client.sendToDevice(batch.eventType, contentMap, batch.txnId);
    })();
  }
}
//# sourceMappingURL=ToDeviceMessageQueue.js.map