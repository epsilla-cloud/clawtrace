import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
/*
 * Copyright 2024 The Matrix.org Foundation C.I.C.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var DEFAULT_BIT_SIZE = 256;

/**
 * Derive a recovery key from a passphrase and salt using PBKDF2.
 * @see https://spec.matrix.org/v1.11/client-server-api/#deriving-keys-from-passphrases
 *
 * @param passphrase - The passphrase to derive the key from
 * @param salt - The salt to use in the derivation
 * @param iterations - The number of iterations to use in the derivation
 * @param numBits - The number of bits to derive
 */
export function deriveRecoveryKeyFromPassphrase(_x, _x2, _x3) {
  return _deriveRecoveryKeyFromPassphrase.apply(this, arguments);
}
function _deriveRecoveryKeyFromPassphrase() {
  _deriveRecoveryKeyFromPassphrase = _asyncToGenerator(function* (passphrase, salt, iterations) {
    var numBits = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_BIT_SIZE;
    if (!globalThis.crypto.subtle || !TextEncoder) {
      throw new Error("Password-based backup is not available on this platform");
    }
    var key = yield globalThis.crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), {
      name: "PBKDF2"
    }, false, ["deriveBits"]);
    var keybits = yield globalThis.crypto.subtle.deriveBits({
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: iterations,
      hash: "SHA-512"
    }, key, numBits);
    return new Uint8Array(keybits);
  });
  return _deriveRecoveryKeyFromPassphrase.apply(this, arguments);
}
//# sourceMappingURL=key-passphrase.js.map