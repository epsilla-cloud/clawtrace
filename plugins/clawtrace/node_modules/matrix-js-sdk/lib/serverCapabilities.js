import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2024 The Matrix.org Foundation C.I.C.

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

import { Method } from "./http-api/index.js";
// How often we update the server capabilities.
// 6 hours - an arbitrary value, but they should change very infrequently.
var CAPABILITIES_CACHE_MS = 6 * 60 * 60 * 1000;

// How long we want before retrying if we couldn't fetch
var CAPABILITIES_RETRY_MS = 30 * 1000;
export var RoomVersionStability = /*#__PURE__*/function (RoomVersionStability) {
  RoomVersionStability["Stable"] = "stable";
  RoomVersionStability["Unstable"] = "unstable";
  return RoomVersionStability;
}({});

/**
 * A representation of the capabilities advertised by a homeserver as defined by
 * [Capabilities negotiation](https://spec.matrix.org/v1.6/client-server-api/#get_matrixclientv3capabilities).
 */

/**
 * Manages storing and periodically refreshing the server capabilities.
 */
export class ServerCapabilities {
  constructor(logger, http) {
    var _this = this;
    this.logger = logger;
    this.http = http;
    _defineProperty(this, "capabilities", void 0);
    _defineProperty(this, "retryTimeout", void 0);
    _defineProperty(this, "refreshTimeout", void 0);
    /**
     * Fetches the latest server capabilities from the homeserver and returns them, or rejects
     * on failure.
     */
    _defineProperty(this, "fetchCapabilities", /*#__PURE__*/_asyncToGenerator(function* () {
      var resp = yield _this.http.authedRequest(Method.Get, "/capabilities");
      _this.capabilities = resp["capabilities"];
      return _this.capabilities;
    }));
    _defineProperty(this, "poll", /*#__PURE__*/_asyncToGenerator(function* () {
      try {
        yield _this.fetchCapabilities();
        _this.clearTimeouts();
        _this.refreshTimeout = setTimeout(_this.poll, CAPABILITIES_CACHE_MS);
        _this.logger.debug("Fetched new server capabilities");
      } catch (e) {
        _this.clearTimeouts();
        var howLong = Math.floor(CAPABILITIES_RETRY_MS + Math.random() * 5000);
        _this.retryTimeout = setTimeout(_this.poll, howLong);
        _this.logger.warn("Failed to refresh capabilities: retrying in ".concat(howLong, "ms"), e);
      }
    }));
  }

  /**
   * Starts periodically fetching the server capabilities.
   */
  start() {
    this.poll().then();
  }

  /**
   * Stops the service
   */
  stop() {
    this.clearTimeouts();
  }

  /**
   * Returns the cached capabilities, or undefined if none are cached.
   * @returns the current capabilities, if any.
   */
  getCachedCapabilities() {
    return this.capabilities;
  }
  clearTimeouts() {
    if (this.refreshTimeout) {
      clearInterval(this.refreshTimeout);
      this.refreshTimeout = undefined;
    }
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = undefined;
    }
  }
}
//# sourceMappingURL=serverCapabilities.js.map