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

export var InvalidCryptoStoreState = /*#__PURE__*/function (InvalidCryptoStoreState) {
  InvalidCryptoStoreState["TooNew"] = "TOO_NEW";
  return InvalidCryptoStoreState;
}({});
export class InvalidCryptoStoreError extends Error {
  constructor(reason) {
    var message = "Crypto store is invalid because ".concat(reason, ", ") + "please stop the client, delete all data and start the client again";
    super(message);
    this.reason = reason;
    this.name = "InvalidCryptoStoreError";
  }
}
_defineProperty(InvalidCryptoStoreError, "TOO_NEW", InvalidCryptoStoreState.TooNew);
export class KeySignatureUploadError extends Error {
  constructor(message, value) {
    super(message);
    this.value = value;
  }
}

/**
 * It is invalid to call most methods once {@link MatrixClient#stopClient} has been called.
 *
 * This error will be thrown if you attempt to do so.
 *
 * {@link MatrixClient#stopClient} itself is an exception to this: it may safely be called multiple times on the same
 * instance.
 */
export class ClientStoppedError extends Error {
  constructor() {
    super("MatrixClient has been stopped");
  }
}

/**
 * This error is thrown when the Homeserver does not support the delayed events endpoints.
 */
export class UnsupportedDelayedEventsEndpointError extends Error {
  constructor(message, clientEndpoint) {
    super(message);
    this.clientEndpoint = clientEndpoint;
    this.name = "UnsupportedDelayedEventsEndpointError";
  }
}

/**
 * This error is thrown when the Homeserver does not support the sticky events endpoints.
 */
export class UnsupportedStickyEventsEndpointError extends Error {
  constructor(message, clientEndpoint) {
    super(message);
    this.clientEndpoint = clientEndpoint;
    this.name = "UnsupportedStickyEventsEndpointError";
  }
}
//# sourceMappingURL=errors.js.map