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

// salt for HKDF, with 8 bytes of zeros
var zeroSalt = new Uint8Array(8);

/**
 * Derive AES and HMAC keys from a master key.
 *
 * This is used for deriving secret storage keys: see https://spec.matrix.org/v1.11/client-server-api/#msecret_storagev1aes-hmac-sha2 (step 1).
 *
 * @param key
 * @param name
 */
export function deriveKeys(_x, _x2) {
  return _deriveKeys.apply(this, arguments);
}
function _deriveKeys() {
  _deriveKeys = _asyncToGenerator(function* (key, name) {
    var hkdfkey = yield globalThis.crypto.subtle.importKey("raw", key, {
      name: "HKDF"
    }, false, ["deriveBits"]);
    var keybits = yield globalThis.crypto.subtle.deriveBits({
      name: "HKDF",
      salt: zeroSalt,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/879
      info: new TextEncoder().encode(name),
      hash: "SHA-256"
    }, hkdfkey, 512);
    var aesKey = keybits.slice(0, 32);
    var hmacKey = keybits.slice(32);
    var aesProm = globalThis.crypto.subtle.importKey("raw", aesKey, {
      name: "AES-CTR"
    }, false, ["encrypt", "decrypt"]);
    var hmacProm = globalThis.crypto.subtle.importKey("raw", hmacKey, {
      name: "HMAC",
      hash: {
        name: "SHA-256"
      }
    }, false, ["sign", "verify"]);
    return Promise.all([aesProm, hmacProm]);
  });
  return _deriveKeys.apply(this, arguments);
}
//# sourceMappingURL=deriveKeys.js.map