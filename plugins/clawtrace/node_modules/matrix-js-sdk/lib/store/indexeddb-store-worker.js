import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2017 - 2021 The Matrix.org Foundation C.I.C.

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

import { LocalIndexedDBStoreBackend } from "./indexeddb-local-backend.js";
import { logger } from "../logger.js";
/**
 * This class lives in the webworker and drives a LocalIndexedDBStoreBackend
 * controlled by messages from the main process.
 *
 * @example
 * It should be instantiated by a web worker script provided by the application
 * in a script, for example:
 * ```
 * import {IndexedDBStoreWorker} from 'matrix-js-sdk/lib/indexeddb-worker.js';
 * const remoteWorker = new IndexedDBStoreWorker(postMessage);
 * onmessage = remoteWorker.onMessage;
 * ```
 *
 * Note that it is advisable to import this class by referencing the file directly to
 * avoid a dependency on the whole js-sdk.
 *
 */
export class IndexedDBStoreWorker {
  /**
   * @param postMessage - The web worker postMessage function that
   * should be used to communicate back to the main script.
   */
  constructor(postMessage) {
    this.postMessage = postMessage;
    _defineProperty(this, "backend", void 0);
    _defineProperty(this, "onClose", () => {
      this.postMessage.call(null, {
        command: "closed"
      });
    });
    /**
     * Passes a message event from the main script into the class. This method
     * can be directly assigned to the web worker `onmessage` variable.
     *
     * @param ev - The message event
     */
    _defineProperty(this, "onMessage", ev => {
      var _this$backend, _this$backend2, _this$backend3, _this$backend4, _this$backend5, _this$backend6, _this$backend7, _this$backend8, _this$backend9, _this$backend0, _this$backend1, _this$backend10, _this$backend11, _this$backend12, _this$backend13, _this$backend14;
      var msg = ev.data;
      var prom;
      switch (msg.command) {
        case "setupWorker":
          // this is the 'indexedDB' global (where global != window
          // because it's a web worker and there is no window).
          this.backend = new LocalIndexedDBStoreBackend(indexedDB, msg.args[0]);
          prom = Promise.resolve();
          break;
        case "connect":
          prom = (_this$backend = this.backend) === null || _this$backend === void 0 ? void 0 : _this$backend.connect(this.onClose);
          break;
        case "isNewlyCreated":
          prom = (_this$backend2 = this.backend) === null || _this$backend2 === void 0 ? void 0 : _this$backend2.isNewlyCreated();
          break;
        case "clearDatabase":
          prom = (_this$backend3 = this.backend) === null || _this$backend3 === void 0 ? void 0 : _this$backend3.clearDatabase();
          break;
        case "getSavedSync":
          prom = (_this$backend4 = this.backend) === null || _this$backend4 === void 0 ? void 0 : _this$backend4.getSavedSync(false);
          break;
        case "setSyncData":
          prom = (_this$backend5 = this.backend) === null || _this$backend5 === void 0 ? void 0 : _this$backend5.setSyncData(msg.args[0]);
          break;
        case "syncToDatabase":
          prom = (_this$backend6 = this.backend) === null || _this$backend6 === void 0 ? void 0 : _this$backend6.syncToDatabase(msg.args[0]);
          break;
        case "getUserPresenceEvents":
          prom = (_this$backend7 = this.backend) === null || _this$backend7 === void 0 ? void 0 : _this$backend7.getUserPresenceEvents();
          break;
        case "getNextBatchToken":
          prom = (_this$backend8 = this.backend) === null || _this$backend8 === void 0 ? void 0 : _this$backend8.getNextBatchToken();
          break;
        case "getOutOfBandMembers":
          prom = (_this$backend9 = this.backend) === null || _this$backend9 === void 0 ? void 0 : _this$backend9.getOutOfBandMembers(msg.args[0]);
          break;
        case "clearOutOfBandMembers":
          prom = (_this$backend0 = this.backend) === null || _this$backend0 === void 0 ? void 0 : _this$backend0.clearOutOfBandMembers(msg.args[0]);
          break;
        case "setOutOfBandMembers":
          prom = (_this$backend1 = this.backend) === null || _this$backend1 === void 0 ? void 0 : _this$backend1.setOutOfBandMembers(msg.args[0], msg.args[1]);
          break;
        case "getClientOptions":
          prom = (_this$backend10 = this.backend) === null || _this$backend10 === void 0 ? void 0 : _this$backend10.getClientOptions();
          break;
        case "storeClientOptions":
          prom = (_this$backend11 = this.backend) === null || _this$backend11 === void 0 ? void 0 : _this$backend11.storeClientOptions(msg.args[0]);
          break;
        case "saveToDeviceBatches":
          prom = (_this$backend12 = this.backend) === null || _this$backend12 === void 0 ? void 0 : _this$backend12.saveToDeviceBatches(msg.args[0]);
          break;
        case "getOldestToDeviceBatch":
          prom = (_this$backend13 = this.backend) === null || _this$backend13 === void 0 ? void 0 : _this$backend13.getOldestToDeviceBatch();
          break;
        case "removeToDeviceBatch":
          prom = (_this$backend14 = this.backend) === null || _this$backend14 === void 0 ? void 0 : _this$backend14.removeToDeviceBatch(msg.args[0]);
          break;
      }
      if (prom === undefined) {
        this.postMessage({
          command: "cmd_fail",
          seq: msg.seq,
          // Can't be an Error because they're not structured cloneable
          error: "Unrecognised command"
        });
        return;
      }
      prom.then(ret => {
        this.postMessage.call(null, {
          command: "cmd_success",
          seq: msg.seq,
          result: ret
        });
      }, err => {
        logger.error("Error running command: " + msg.command, err);
        this.postMessage.call(null, {
          command: "cmd_fail",
          seq: msg.seq,
          // Just send a string because Error objects aren't cloneable
          error: {
            message: err.message,
            name: err.name
          }
        });
      });
    });
  }
}
//# sourceMappingURL=indexeddb-store-worker.js.map