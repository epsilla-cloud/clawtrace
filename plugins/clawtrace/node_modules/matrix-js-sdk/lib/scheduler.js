import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2015 - 2021 The Matrix.org Foundation C.I.C.

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
 * This is an internal module which manages queuing, scheduling and retrying
 * of requests.
 */
import { logger } from "./logger.js";
import { EventType } from "./@types/event.js";
import { removeElement } from "./utils.js";
import { calculateRetryBackoff } from "./http-api/index.js";
var DEBUG = false; // set true to enable console logging.

/**
 * The function to invoke to process (send) events in the queue.
 * @param event - The event to send.
 * @returns Resolved/rejected depending on the outcome of the request.
 */

// eslint-disable-next-line camelcase
export class MatrixScheduler {
  /**
   * Default retry algorithm for the matrix scheduler. Retries events up to 4 times with exponential backoff.
   * @param attempts - Number of attempts that have been made, including the one that just failed (ie. starting at 1)
   * @see retryAlgorithm
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static RETRY_BACKOFF_RATELIMIT(event, attempts, err) {
    return calculateRetryBackoff(err, attempts, false);
  }

  /**
   * Queues `m.room.message` events and lets other events continue
   * concurrently.
   * @see queueAlgorithm
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static QUEUE_MESSAGES(event) {
    // enqueue messages or events that associate with another event (redactions and relations)
    if (event.getType() === EventType.RoomMessage || event.hasAssociation()) {
      // put these events in the 'message' queue.
      return "message";
    }
    // allow all other events continue concurrently.
    return null;
  }

  // queueName: [{
  //  event: MatrixEvent,  // event to send
  //  defer: PromiseWithResolvers,  // defer to resolve/reject at the END of the retries
  //  attempts: Number  // number of times we've called processFn
  // }, ...]

  /**
   * Construct a scheduler for Matrix. Requires
   * {@link MatrixScheduler#setProcessFunction} to be provided
   * with a way of processing events.
   * @param retryAlgorithm - Optional. The retry
   * algorithm to apply when determining when to try to send an event again.
   * Defaults to {@link MatrixScheduler.RETRY_BACKOFF_RATELIMIT}.
   * @param queueAlgorithm - Optional. The queuing
   * algorithm to apply when determining which events should be sent before the
   * given event. Defaults to {@link MatrixScheduler.QUEUE_MESSAGES}.
   */
  constructor() {
    var retryAlgorithm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : MatrixScheduler.RETRY_BACKOFF_RATELIMIT;
    var queueAlgorithm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MatrixScheduler.QUEUE_MESSAGES;
    this.retryAlgorithm = retryAlgorithm;
    this.queueAlgorithm = queueAlgorithm;
    _defineProperty(this, "queues", {});
    _defineProperty(this, "activeQueues", []);
    _defineProperty(this, "procFn", null);
    _defineProperty(this, "processQueue", queueName => {
      // get head of queue
      var obj = this.peekNextEvent(queueName);
      if (!obj) {
        this.disableQueue(queueName);
        return;
      }
      debuglog("Queue '%s' has %s pending events", queueName, this.queues[queueName].length);
      // fire the process function and if it resolves, resolve the deferred. Else
      // invoke the retry algorithm.

      // First wait for a resolved promise, so the resolve handlers for
      // the deferred of the previously sent event can run.
      // This way enqueued relations/redactions to enqueued events can receive
      // the remove id of their target before being sent.
      Promise.resolve().then(() => {
        return this.procFn(obj.event);
      }).then(res => {
        // remove this from the queue
        this.removeNextEvent(queueName);
        debuglog("Queue '%s' sent event %s", queueName, obj.event.getId());
        obj.resolvers.resolve(res);
        // keep processing
        this.processQueue(queueName);
      }, err => {
        obj.attempts += 1;
        // ask the retry algorithm when/if we should try again
        var waitTimeMs = this.retryAlgorithm(obj.event, obj.attempts, err);
        debuglog("retry(%s) err=%s event_id=%s waitTime=%s", obj.attempts, err, obj.event.getId(), waitTimeMs);
        if (waitTimeMs === -1) {
          // give up (you quitter!)
          logger.info("Queue '%s' giving up on event %s", queueName, obj.event.getId());
          // remove this from the queue
          this.clearQueue(queueName, err);
        } else {
          setTimeout(this.processQueue, waitTimeMs, queueName);
        }
      });
    });
  }

  /**
   * Retrieve a queue based on an event. The event provided does not need to be in
   * the queue.
   * @param event - An event to get the queue for.
   * @returns A shallow copy of events in the queue or null.
   * Modifying this array will not modify the list itself. Modifying events in
   * this array <i>will</i> modify the underlying event in the queue.
   * @see MatrixScheduler.removeEventFromQueue To remove an event from the queue.
   */
  getQueueForEvent(event) {
    var name = this.queueAlgorithm(event);
    if (!name || !this.queues[name]) {
      return null;
    }
    return this.queues[name].map(function (obj) {
      return obj.event;
    });
  }

  /**
   * Remove this event from the queue. The event is equal to another event if they
   * have the same ID returned from event.getId().
   * @param event - The event to remove.
   * @returns True if this event was removed.
   */
  removeEventFromQueue(event) {
    var name = this.queueAlgorithm(event);
    if (!name || !this.queues[name]) {
      return false;
    }
    var removed = false;
    removeElement(this.queues[name], element => {
      if (element.event.getId() === event.getId()) {
        // XXX we should probably reject the promise?
        // https://github.com/matrix-org/matrix-js-sdk/issues/496
        removed = true;
        return true;
      }
      return false;
    });
    return removed;
  }

  /**
   * Set the process function. Required for events in the queue to be processed.
   * If set after events have been added to the queue, this will immediately start
   * processing them.
   * @param fn - The function that can process events
   * in the queue.
   */
  setProcessFunction(fn) {
    this.procFn = fn;
    this.startProcessingQueues();
  }

  /**
   * Queue an event if it is required and start processing queues.
   * @param event - The event that may be queued.
   * @returns A promise if the event was queued, which will be
   * resolved or rejected in due time, else null.
   */
  queueEvent(event) {
    var queueName = this.queueAlgorithm(event);
    if (!queueName) {
      return null;
    }
    // add the event to the queue and make a deferred for it.
    if (!this.queues[queueName]) {
      this.queues[queueName] = [];
    }
    var eventResolvers = Promise.withResolvers();
    this.queues[queueName].push({
      event: event,
      resolvers: eventResolvers,
      attempts: 0
    });
    debuglog("Queue algorithm dumped event %s into queue '%s'", event.getId(), queueName);
    this.startProcessingQueues();
    return eventResolvers.promise;
  }
  startProcessingQueues() {
    if (!this.procFn) return;
    // for each inactive queue with events in them
    Object.keys(this.queues).filter(queueName => {
      return this.activeQueues.indexOf(queueName) === -1 && this.queues[queueName].length > 0;
    }).forEach(queueName => {
      // mark the queue as active
      this.activeQueues.push(queueName);
      // begin processing the head of the queue
      debuglog("Spinning up queue: '%s'", queueName);
      this.processQueue(queueName);
    });
  }
  disableQueue(queueName) {
    // queue is empty. Mark as inactive and stop recursing.
    var index = this.activeQueues.indexOf(queueName);
    if (index >= 0) {
      this.activeQueues.splice(index, 1);
    }
    logger.info("Stopping queue '%s' as it is now empty", queueName);
  }
  clearQueue(queueName, err) {
    logger.info("clearing queue '%s'", queueName);
    var obj;
    while (obj = this.removeNextEvent(queueName)) {
      obj.resolvers.reject(err);
    }
    this.disableQueue(queueName);
  }
  peekNextEvent(queueName) {
    var queue = this.queues[queueName];
    if (!Array.isArray(queue)) {
      return undefined;
    }
    return queue[0];
  }
  removeNextEvent(queueName) {
    var queue = this.queues[queueName];
    if (!Array.isArray(queue)) {
      return undefined;
    }
    return queue.shift();
  }
}

/* istanbul ignore next */
function debuglog() {
  if (DEBUG) {
    logger.log(...arguments);
  }
}
//# sourceMappingURL=scheduler.js.map