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

import { MatrixError, TokenRefreshLogoutError } from "./errors.js";
import { sleep } from "../utils.js";

/**
 * This is an internal module. See {@link MatrixHttpApi} for the public class.
 */

export var TokenRefreshOutcome = /*#__PURE__*/function (TokenRefreshOutcome) {
  TokenRefreshOutcome["Success"] = "success";
  TokenRefreshOutcome["Failure"] = "failure";
  TokenRefreshOutcome["Logout"] = "logout";
  return TokenRefreshOutcome;
}({});
// If the token expires in less than this time amount of time, we will eagerly refresh it before making the intended request.
var REFRESH_IF_TOKEN_EXPIRES_WITHIN_MS = 500;
// If we get an unknown token error and the token expires in less than this time amount of time, we will refresh it before making the intended request.
// Otherwise, we will error as the token should not have expired yet and we need to avoid retrying indefinitely.
var REFRESH_ON_ERROR_IF_TOKEN_EXPIRES_WITHIN_MS = 60 * 1000;
/**
 * This class is responsible for managing the access token and refresh token for authenticated requests.
 * It will automatically refresh the access token when it is about to expire, and will handle unknown token errors.
 */
export class TokenRefresher {
  constructor(opts) {
    this.opts = opts;
    /**
     * Promise used to block authenticated requests during a token refresh to avoid repeated expected errors.
     * @private
     */
    _defineProperty(this, "tokenRefreshPromise", void 0);
    _defineProperty(this, "latestTokenRefreshExpiry", void 0);
  }
  /**
   * This function is called before every request to ensure that the access token is valid.
   * @returns a snapshot containing the access token and other properties which must be passed to the handleUnknownToken
   *     handler if an M_UNKNOWN_TOKEN error is encountered.
   */
  prepareForRequest() {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Ensure our token is refreshed before we build the headers/params
      yield _this.refreshIfNeeded();
      return {
        accessToken: _this.opts.accessToken,
        refreshToken: _this.opts.refreshToken,
        expiry: _this.latestTokenRefreshExpiry
      };
    })();
  }
  refreshIfNeeded() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      if (_this2.tokenRefreshPromise) {
        return _this2.tokenRefreshPromise;
      }
      // If we don't know the token expiry, we can't eagerly refresh
      if (!_this2.latestTokenRefreshExpiry) return;
      var expiresIn = _this2.latestTokenRefreshExpiry.getTime() - Date.now();
      if (expiresIn <= REFRESH_IF_TOKEN_EXPIRES_WITHIN_MS) {
        yield _this2._handleUnknownToken();
      }
    })();
  }

  /**
   * This function is called when an M_UNKNOWN_TOKEN error is encountered.
   * It will attempt to refresh the access token if it is unknown, and will return a TokenRefreshOutcome.
   * @param snapshot - the snapshot returned by prepareForRequest
   * @param attempt - the number of attempts made for this request so far
   * @returns a TokenRefreshOutcome indicating the result of the refresh attempt
   */
  handleUnknownToken(snapshot, attempt) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      return _this3._handleUnknownToken(snapshot, attempt);
    })();
  }

  /* eslint-disable @typescript-eslint/naming-convention */

  _handleUnknownToken(snapshot, attempt) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      if (snapshot !== null && snapshot !== void 0 && snapshot.expiry) {
        // If our token is unknown, but it should not have expired yet, then we should not refresh
        var expiresIn = snapshot.expiry.getTime() - Date.now();
        // If it still has plenty of time left on the clock, we assume something else must be wrong and
        // do not refresh. Otherwise if it's expired, or will soon, we try refreshing.
        if (expiresIn >= REFRESH_ON_ERROR_IF_TOKEN_EXPIRES_WITHIN_MS) {
          return TokenRefreshOutcome.Logout;
        }
      }
      if (!snapshot || (snapshot === null || snapshot === void 0 ? void 0 : snapshot.accessToken) === _this4.opts.accessToken) {
        var _this4$tokenRefreshPr;
        // If we have a snapshot, but the access token is the same as the current one then a refresh
        // did not happen behind us but one may be ongoing anyway
        (_this4$tokenRefreshPr = _this4.tokenRefreshPromise) !== null && _this4$tokenRefreshPr !== void 0 ? _this4$tokenRefreshPr : _this4.tokenRefreshPromise = _this4.doTokenRefresh(attempt);
        try {
          return yield _this4.tokenRefreshPromise;
        } finally {
          _this4.tokenRefreshPromise = undefined;
        }
      }

      // We may end up here if the token was refreshed in the background due to another request
      return TokenRefreshOutcome.Success;
    })();
  }

  /**
   * Attempt to refresh access tokens.
   * On success, sets new access and refresh tokens in opts.
   * @returns Promise that resolves to a boolean - true when token was refreshed successfully
   */
  doTokenRefresh(attempt) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      if (!_this5.opts.refreshToken || !_this5.opts.tokenRefreshFunction) {
        var _this5$opts$logger;
        (_this5$opts$logger = _this5.opts.logger) === null || _this5$opts$logger === void 0 || _this5$opts$logger.error("Unable to refresh token - no refresh token or refresh function");
        return TokenRefreshOutcome.Logout;
      }
      if (attempt && attempt > 1) {
        // Exponential backoff to ensure we don't trash the server, up to 2^5 seconds
        yield sleep(1000 * Math.min(32, 2 ** attempt));
      }
      try {
        var _this5$opts$logger2, _this5$opts$logger3;
        (_this5$opts$logger2 = _this5.opts.logger) === null || _this5$opts$logger2 === void 0 || _this5$opts$logger2.debug("Attempting to refresh token");
        var {
          accessToken,
          refreshToken,
          expiry
        } = yield _this5.opts.tokenRefreshFunction(_this5.opts.refreshToken);
        _this5.opts.accessToken = accessToken;
        _this5.opts.refreshToken = refreshToken;
        _this5.latestTokenRefreshExpiry = expiry;
        (_this5$opts$logger3 = _this5.opts.logger) === null || _this5$opts$logger3 === void 0 || _this5$opts$logger3.debug("... token refresh complete, new token expiry:", expiry);

        // successfully got new tokens
        return TokenRefreshOutcome.Success;
      } catch (error) {
        var _this5$opts$logger5;
        // If we get a TokenError or MatrixError, we should log out, otherwise assume transient
        if (error instanceof TokenRefreshLogoutError || error instanceof MatrixError) {
          var _this5$opts$logger4;
          (_this5$opts$logger4 = _this5.opts.logger) === null || _this5$opts$logger4 === void 0 || _this5$opts$logger4.error("Failed to refresh token", error);
          return TokenRefreshOutcome.Logout;
        }
        (_this5$opts$logger5 = _this5.opts.logger) === null || _this5$opts$logger5 === void 0 || _this5$opts$logger5.warn("Failed to refresh token", error);
        return TokenRefreshOutcome.Failure;
      }
    })();
  }
}
//# sourceMappingURL=refresh.js.map