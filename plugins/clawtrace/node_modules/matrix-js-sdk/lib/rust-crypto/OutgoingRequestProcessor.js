import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/*
Copyright 2023 The Matrix.org Foundation C.I.C.

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

import { KeysBackupRequest, KeysClaimRequest, KeysQueryRequest, KeysUploadRequest, PutDehydratedDeviceRequest, RoomMessageRequest, SignatureUploadRequest, ToDeviceRequest, UploadSigningKeysRequest } from "@matrix-org/matrix-sdk-crypto-wasm";
import { calculateRetryBackoff, Method } from "../http-api/index.js";
import { logDuration, sleep } from "../utils.js";
import { ToDeviceMessageId } from "../@types/event.js";
import { UnstablePrefix as DehydrationUnstablePrefix } from "./DehydratedDeviceManager.js";

/**
 * OutgoingRequestManager: turns `OutgoingRequest`s from the rust sdk into HTTP requests
 *
 * We have one of these per `RustCrypto` (and hence per `MatrixClient`), not that it does anything terribly complicated.
 * It's responsible for:
 *
 *   * holding the reference to the `MatrixHttpApi`
 *   * turning `OutgoingRequest`s from the rust backend into HTTP requests, and sending them
 *   * sending the results of such requests back to the rust backend.
 *
 * @internal
 */
export class OutgoingRequestProcessor {
  constructor(logger, olmMachine, http) {
    this.logger = logger;
    this.olmMachine = olmMachine;
    this.http = http;
  }
  makeOutgoingRequest(msg, uiaCallback) {
    var _this = this;
    return _asyncToGenerator(function* () {
      var resp;

      /* refer https://docs.rs/matrix-sdk-crypto/0.6.0/matrix_sdk_crypto/requests/enum.OutgoingRequests.html
       * for the complete list of request types
       */
      if (msg instanceof KeysUploadRequest) {
        resp = yield _this.requestWithRetry(Method.Post, "/_matrix/client/v3/keys/upload", {}, msg.body);
      } else if (msg instanceof KeysQueryRequest) {
        resp = yield _this.requestWithRetry(Method.Post, "/_matrix/client/v3/keys/query", {}, msg.body);
      } else if (msg instanceof KeysClaimRequest) {
        resp = yield _this.requestWithRetry(Method.Post, "/_matrix/client/v3/keys/claim", {}, msg.body);
      } else if (msg instanceof SignatureUploadRequest) {
        resp = yield _this.requestWithRetry(Method.Post, "/_matrix/client/v3/keys/signatures/upload", {}, msg.body);
      } else if (msg instanceof KeysBackupRequest) {
        resp = yield _this.requestWithRetry(Method.Put, "/_matrix/client/v3/room_keys/keys", {
          version: msg.version
        }, msg.body);
      } else if (msg instanceof ToDeviceRequest) {
        resp = yield _this.sendToDeviceRequest(msg);
      } else if (msg instanceof RoomMessageRequest) {
        var path = "/_matrix/client/v3/rooms/".concat(encodeURIComponent(msg.room_id), "/send/") + "".concat(encodeURIComponent(msg.event_type), "/").concat(encodeURIComponent(msg.txn_id));
        resp = yield _this.requestWithRetry(Method.Put, path, {}, msg.body);
      } else if (msg instanceof UploadSigningKeysRequest) {
        yield _this.makeRequestWithUIA(Method.Post, "/_matrix/client/v3/keys/device_signing/upload", {}, msg.body, uiaCallback);
        // SigningKeysUploadRequest does not implement OutgoingRequest and does not need to be marked as sent.
        return;
      } else if (msg instanceof PutDehydratedDeviceRequest) {
        var _path = DehydrationUnstablePrefix + "/dehydrated_device";
        yield _this.rawJsonRequest(Method.Put, _path, {}, msg.body);
        // PutDehydratedDeviceRequest does not implement OutgoingRequest and does not need to be marked as sent.
        return;
      } else {
        _this.logger.warn("Unsupported outgoing message", Object.getPrototypeOf(msg));
        resp = "";
      }
      if (msg.id) {
        try {
          yield logDuration(_this.logger, "Mark Request as sent ".concat(msg.type), /*#__PURE__*/_asyncToGenerator(function* () {
            yield _this.olmMachine.markRequestAsSent(msg.id, msg.type, resp);
          }));
        } catch (e) {
          // Ignore errors which are caused by the olmMachine having been freed. The exact error message depends
          // on whether we are using a release or develop build of rust-sdk-crypto-wasm.
          if (e instanceof Error && (e.message === "Attempt to use a moved value" || e.message === "null pointer passed to rust")) {
            _this.logger.debug("Ignoring error '".concat(e.message, "': client is likely shutting down"));
          } else {
            throw e;
          }
        }
      } else {
        _this.logger.trace("Outgoing request type:".concat(msg.type, " does not have an ID"));
      }
    })();
  }

  /**
   * Send the HTTP request for a `ToDeviceRequest`
   *
   * @param request - request to send
   * @returns JSON-serialized body of the response, if successful
   */
  sendToDeviceRequest(request) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // a bit of extra logging, to help trace to-device messages through the system
      var parsedBody = JSON.parse(request.body);
      var messageList = [];
      for (var [userId, perUserMessages] of Object.entries(parsedBody.messages)) {
        for (var [deviceId, message] of Object.entries(perUserMessages)) {
          messageList.push("".concat(userId, "/").concat(deviceId, " (msgid ").concat(message[ToDeviceMessageId], ")"));
        }
      }
      _this2.logger.info("Sending batch of to-device messages. type=".concat(request.event_type, " txnid=").concat(request.txn_id), messageList);
      var path = "/_matrix/client/v3/sendToDevice/".concat(encodeURIComponent(request.event_type), "/") + encodeURIComponent(request.txn_id);
      return yield _this2.requestWithRetry(Method.Put, path, {}, request.body);
    })();
  }
  makeRequestWithUIA(method, path, queryParams, body, uiaCallback) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      if (!uiaCallback) {
        return yield _this3.requestWithRetry(method, path, queryParams, body);
      }
      var parsedBody = JSON.parse(body);
      var makeRequest = /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator(function* (auth) {
          var newBody = _objectSpread({}, parsedBody);
          if (auth !== null) {
            newBody.auth = auth;
          }
          var resp = yield _this3.requestWithRetry(method, path, queryParams, JSON.stringify(newBody));
          return JSON.parse(resp);
        });
        return function makeRequest(_x) {
          return _ref2.apply(this, arguments);
        };
      }();
      var resp = yield uiaCallback(makeRequest);
      return JSON.stringify(resp);
    })();
  }
  requestWithRetry(method, path, queryParams, body) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      var currentRetryCount = 0;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          return yield _this4.rawJsonRequest(method, path, queryParams, body);
        } catch (e) {
          currentRetryCount++;
          var backoff = calculateRetryBackoff(e, currentRetryCount, true);
          if (backoff < 0) {
            // Max number of retries reached, or error is not retryable. rethrow the error
            throw e;
          }
          // wait for the specified time and then retry the request
          yield sleep(backoff);
        }
      }
    })();
  }
  rawJsonRequest(method, path, queryParams, body) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      var opts = {
        // inhibit the JSON stringification and parsing within HttpApi.
        json: false,
        // nevertheless, we are sending, and accept, JSON.
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        // we use the full prefix
        prefix: "",
        // We set a timeout of 60 seconds to guard against requests getting stuck forever and wedging the
        // request loop (cf https://github.com/element-hq/element-web/issues/29534).
        //
        // (XXX: should we do this in the whole of the js-sdk?)
        localTimeoutMs: 60000
      };
      return yield _this5.http.authedRequest(method, path, queryParams, body, opts);
    })();
  }
}
//# sourceMappingURL=OutgoingRequestProcessor.js.map