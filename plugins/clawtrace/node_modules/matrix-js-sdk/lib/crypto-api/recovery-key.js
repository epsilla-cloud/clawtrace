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

import bs58 from "bs58";

// picked arbitrarily but to try & avoid clashing with any bitcoin ones
// (which are also base58 encoded, but bitcoin's involve a lot more hashing)
var OLM_RECOVERY_KEY_PREFIX = [0x8b, 0x01];
var KEY_SIZE = 32;

/**
 * Encode a recovery key using the Matrix {@link https://spec.matrix.org/v1.11/appendices/#cryptographic-key-representation | Cryptographic key representation}
 * @param key
 */
export function encodeRecoveryKey(key) {
  var _base58key$match;
  var buf = new Uint8Array(OLM_RECOVERY_KEY_PREFIX.length + key.length + 1);
  buf.set(OLM_RECOVERY_KEY_PREFIX, 0);
  buf.set(key, OLM_RECOVERY_KEY_PREFIX.length);
  var parity = 0;
  for (var i = 0; i < buf.length - 1; ++i) {
    parity ^= buf[i];
  }
  buf[buf.length - 1] = parity;
  var base58key = bs58.encode(buf);
  return (_base58key$match = base58key.match(/.{1,4}/g)) === null || _base58key$match === void 0 ? void 0 : _base58key$match.join(" ");
}

/**
 * Decode a recovery key encoded with the Matrix {@link https://spec.matrix.org/v1.11/appendices/#cryptographic-key-representation | Cryptographic key representation} encoding.
 * @param recoveryKey
 */
export function decodeRecoveryKey(recoveryKey) {
  var result = bs58.decode(recoveryKey.replace(/ /g, ""));
  var parity = 0;
  for (var b of result) {
    parity ^= b;
  }
  if (parity !== 0) {
    throw new Error("Incorrect parity");
  }
  for (var i = 0; i < OLM_RECOVERY_KEY_PREFIX.length; ++i) {
    if (result[i] !== OLM_RECOVERY_KEY_PREFIX[i]) {
      throw new Error("Incorrect prefix");
    }
  }
  if (result.length !== OLM_RECOVERY_KEY_PREFIX.length + KEY_SIZE + 1) {
    throw new Error("Incorrect length");
  }
  return Uint8Array.from(result.slice(OLM_RECOVERY_KEY_PREFIX.length, OLM_RECOVERY_KEY_PREFIX.length + KEY_SIZE));
}
//# sourceMappingURL=recovery-key.js.map