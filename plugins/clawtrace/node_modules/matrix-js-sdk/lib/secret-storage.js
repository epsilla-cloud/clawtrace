import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
/*
Copyright 2021-2023 The Matrix.org Foundation C.I.C.

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
 * Implementation of server-side secret storage
 *
 * @see https://spec.matrix.org/v1.6/client-server-api/#storage
 */

import { ClientEvent } from "./client.js";
import { secureRandomString } from "./randomstring.js";
import { logger } from "./logger.js";
import encryptAESSecretStorageItem from "./utils/encryptAESSecretStorageItem.js";
import decryptAESSecretStorageItem from "./utils/decryptAESSecretStorageItem.js";
export var SECRET_STORAGE_ALGORITHM_V1_AES = "m.secret_storage.v1.aes-hmac-sha2";

/**
 * Common base interface for Secret Storage Keys.
 *
 * The common properties for all encryption keys used in server-side secret storage.
 *
 * @see https://spec.matrix.org/v1.6/client-server-api/#key-storage
 */

/**
 * Properties for a SSSS key using the `m.secret_storage.v1.aes-hmac-sha2` algorithm.
 *
 * Corresponds to `AesHmacSha2KeyDescription` in the specification.
 *
 * @see https://spec.matrix.org/v1.6/client-server-api/#msecret_storagev1aes-hmac-sha2
 */

/**
 * Union type for secret storage keys.
 *
 * For now, this is only {@link SecretStorageKeyDescriptionAesV1}, but other interfaces may be added in future.
 */

/**
 * Information on how to generate the key from a passphrase.
 *
 * @see https://spec.matrix.org/v1.6/client-server-api/#deriving-keys-from-passphrases
 */

/**
 * Options for {@link ServerSideSecretStorageImpl#addKey}.
 */

/**
 * Return type for {@link ServerSideSecretStorageImpl#getKey}.
 */

/**
 * Return type for {@link ServerSideSecretStorageImpl#addKey}.
 */

/** Interface for managing account data on the server.
 *
 * A subset of {@link MatrixClient}.
 */

/**
 *  Application callbacks for use with {@link SecretStorage.ServerSideSecretStorageImpl}
 */

/**
 * Account Data event types which can store secret-storage-encrypted information.
 */

/**
 * Account Data event content type for storing secret-storage-encrypted information.
 *
 * See https://spec.matrix.org/v1.13/client-server-api/#msecret_storagev1aes-hmac-sha2-1
 */

/**
 * Interface provided by SecretStorage implementations
 *
 * Normally this will just be an {@link ServerSideSecretStorageImpl}, but for backwards
 * compatibility some methods allow other implementations.
 */

/**
 * Implementation of Server-side secret storage.
 *
 * Secret *sharing* is *not* implemented here: this class is strictly about the storage component of
 * SSSS.
 *
 * @see https://spec.matrix.org/v1.6/client-server-api/#storage
 */
export class ServerSideSecretStorageImpl {
  /**
   * Construct a new `SecretStorage`.
   *
   * Normally, it is unnecessary to call this directly, since MatrixClient automatically constructs one.
   * However, it may be useful to construct a new `SecretStorage`, if custom `callbacks` are required, for example.
   *
   * @param accountDataAdapter - interface for fetching and setting account data on the server. Normally an instance
   *   of {@link MatrixClient}.
   * @param callbacks - application level callbacks for retrieving secret keys
   */
  constructor(accountDataAdapter, callbacks) {
    this.accountDataAdapter = accountDataAdapter;
    this.callbacks = callbacks;
  }

  /**
   * Get the current default key ID for encrypting secrets.
   *
   * @returns The default key ID or null if no default key ID is set
   */
  getDefaultKeyId() {
    var _this = this;
    return _asyncToGenerator(function* () {
      var _defaultKey$key;
      var defaultKey = yield _this.accountDataAdapter.getAccountDataFromServer("m.secret_storage.default_key");
      if (!defaultKey) return null;
      return (_defaultKey$key = defaultKey.key) !== null && _defaultKey$key !== void 0 ? _defaultKey$key : null;
    })();
  }

  /**
   * Implementation of {@link ServerSideSecretStorage#setDefaultKeyId}.
   */
  setDefaultKeyId(keyId) {
    return new Promise((resolve, reject) => {
      var listener = ev => {
        if (ev.getType() !== "m.secret_storage.default_key") {
          //  Different account data item
          return;
        }

        // If keyId === null, the content should be an empty object.
        // Otherwise, the `key` in the content object should match keyId.
        var content = ev.getContent();
        var isSameKey = keyId === null ? Object.keys(content).length === 0 : content.key === keyId;
        if (isSameKey) {
          this.accountDataAdapter.removeListener(ClientEvent.AccountData, listener);
          resolve();
        }
      };
      this.accountDataAdapter.on(ClientEvent.AccountData, listener);

      // The spec [1] says that the value of the account data entry should be an object with a `key` property.
      // It doesn't specify how to delete the default key; we do it by setting the account data to an empty object.
      //
      // [1]: https://spec.matrix.org/v1.13/client-server-api/#key-storage
      var newValue = keyId === null ? {} : {
        key: keyId
      };
      this.accountDataAdapter.setAccountData("m.secret_storage.default_key", newValue).catch(e => {
        this.accountDataAdapter.removeListener(ClientEvent.AccountData, listener);
        reject(e);
      });
    });
  }

  /**
   * Add a key for encrypting secrets.
   *
   * @param algorithm - the algorithm used by the key.
   * @param opts - the options for the algorithm.  The properties used
   *     depend on the algorithm given.
   * @param keyId - the ID of the key.  If not given, a random
   *     ID will be generated.
   *
   * @returns An object with:
   *     keyId: the ID of the key
   *     keyInfo: details about the key (iv, mac, passphrase)
   */
  addKey(algorithm, opts, keyId) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      if (algorithm !== SECRET_STORAGE_ALGORITHM_V1_AES) {
        throw new Error("Unknown key algorithm ".concat(algorithm));
      }
      var keyInfo = {
        algorithm
      };
      if (opts.name) {
        keyInfo.name = opts.name;
      }
      if (opts.passphrase) {
        keyInfo.passphrase = opts.passphrase;
      }
      var {
        iv,
        mac
      } = yield calculateKeyCheck(opts.key);
      keyInfo.iv = iv;
      keyInfo.mac = mac;

      // Create a unique key id. XXX: this is racey.
      if (!keyId) {
        do {
          keyId = secureRandomString(32);
        } while (yield _this2.accountDataAdapter.getAccountDataFromServer("m.secret_storage.key.".concat(keyId)));
      }
      yield _this2.accountDataAdapter.setAccountData("m.secret_storage.key.".concat(keyId), keyInfo);
      return {
        keyId,
        keyInfo
      };
    })();
  }

  /**
   * Get the key information for a given ID.
   *
   * @param keyId - The ID of the key to check
   *     for. Defaults to the default key ID if not provided.
   * @returns If the key was found, the return value is an array of
   *     the form [keyId, keyInfo].  Otherwise, null is returned.
   *     XXX: why is this an array when addKey returns an object?
   */
  getKey(keyId) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      if (!keyId) {
        keyId = yield _this3.getDefaultKeyId();
      }
      if (!keyId) {
        return null;
      }
      var keyInfo = yield _this3.accountDataAdapter.getAccountDataFromServer("m.secret_storage.key.".concat(keyId));
      return keyInfo ? [keyId, keyInfo] : null;
    })();
  }

  /**
   * Check whether we have a key with a given ID.
   *
   * @param keyId - The ID of the key to check
   *     for. Defaults to the default key ID if not provided.
   * @returns Whether we have the key.
   */
  hasKey(keyId) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      var key = yield _this4.getKey(keyId);
      return Boolean(key);
    })();
  }

  /**
   * Check whether a key matches what we expect based on the key info
   *
   * @param key - the key to check
   * @param info - the key info
   *
   * @returns whether or not the key matches
   */
  checkKey(key, info) {
    return _asyncToGenerator(function* () {
      if (info.algorithm === SECRET_STORAGE_ALGORITHM_V1_AES) {
        if (info.mac) {
          var {
            mac
          } = yield calculateKeyCheck(key, info.iv);
          return trimTrailingEquals(info.mac) === trimTrailingEquals(mac);
        } else {
          // if we have no information, we have to assume the key is right
          return true;
        }
      } else {
        throw new Error("Unknown algorithm");
      }
    })();
  }

  /**
   * Implementation of {@link ServerSideSecretStorage#store}.
   */
  store(name, secret, keys) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      if (secret === null) {
        // remove secret
        yield _this5.accountDataAdapter.setAccountData(name, {});
        return;
      }
      var encrypted = {};
      if (!keys) {
        var defaultKeyId = yield _this5.getDefaultKeyId();
        if (!defaultKeyId) {
          throw new Error("No keys specified and no default key present");
        }
        keys = [defaultKeyId];
      }
      if (keys.length === 0) {
        throw new Error("Zero keys given to encrypt with!");
      }
      for (var _keyId of keys) {
        // get key information from key storage
        var _keyInfo = yield _this5.accountDataAdapter.getAccountDataFromServer("m.secret_storage.key.".concat(_keyId));
        if (!_keyInfo) {
          throw new Error("Unknown key: " + _keyId);
        }

        // encrypt secret, based on the algorithm
        if (_keyInfo.algorithm === SECRET_STORAGE_ALGORITHM_V1_AES) {
          var _keys = {
            [_keyId]: _keyInfo
          };
          var [, encryption] = yield _this5.getSecretStorageKey(_keys, name);
          encrypted[_keyId] = yield encryption.encrypt(secret);
        } else {
          logger.warn("unknown algorithm for secret storage key " + _keyId + ": " + _keyInfo.algorithm);
          // do nothing if we don't understand the encryption algorithm
        }
      }

      // save encrypted secret
      yield _this5.accountDataAdapter.setAccountData(name, {
        encrypted
      });
    })();
  }

  /**
   * Get a secret from storage, and decrypt it.
   *
   * {@link SecretStorageCallbacks#getSecretStorageKey} will be called to obtain a secret storage
   * key to decrypt the secret.
   *
   * @param name - the name of the secret - i.e., the "event type" stored in the account data
   *
   * @returns the decrypted contents of the secret, or "undefined" if `name` is not found in
   *    the user's account data.
   */
  get(name) {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      var secretInfo = yield _this6.accountDataAdapter.getAccountDataFromServer(name);
      if (!secretInfo) {
        return;
      }
      if (!secretInfo.encrypted) {
        throw new Error("Content is not encrypted!");
      }

      // get possible keys to decrypt
      var keys = {};
      for (var _keyId2 of Object.keys(secretInfo.encrypted)) {
        // get key information from key storage
        var _keyInfo2 = yield _this6.accountDataAdapter.getAccountDataFromServer("m.secret_storage.key.".concat(_keyId2));
        var _encInfo = secretInfo.encrypted[_keyId2];
        // only use keys we understand the encryption algorithm of
        if ((_keyInfo2 === null || _keyInfo2 === void 0 ? void 0 : _keyInfo2.algorithm) === SECRET_STORAGE_ALGORITHM_V1_AES) {
          if (_encInfo.iv && _encInfo.ciphertext && _encInfo.mac) {
            keys[_keyId2] = _keyInfo2;
          }
        }
      }
      if (Object.keys(keys).length === 0) {
        throw new Error("Could not decrypt ".concat(name, " because none of ") + "the keys it is encrypted with are for a supported algorithm");
      }

      // fetch private key from app
      var [keyId, decryption] = yield _this6.getSecretStorageKey(keys, name);
      var encInfo = secretInfo.encrypted[keyId];
      return decryption.decrypt(encInfo);
    })();
  }

  /**
   * Check if a secret is stored on the server.
   *
   * @param name - the name of the secret
   *
   * @returns map of key name to key info the secret is encrypted
   *     with, or null if it is not present or not encrypted with a trusted
   *     key
   */
  isStored(name) {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      // check if secret exists
      var secretInfo = yield _this7.accountDataAdapter.getAccountDataFromServer(name);
      if (!(secretInfo !== null && secretInfo !== void 0 && secretInfo.encrypted)) return null;
      var ret = {};

      // filter secret encryption keys with supported algorithm
      for (var _keyId3 of Object.keys(secretInfo.encrypted)) {
        // get key information from key storage
        var _keyInfo3 = yield _this7.accountDataAdapter.getAccountDataFromServer("m.secret_storage.key.".concat(_keyId3));
        if (!_keyInfo3) continue;
        var encInfo = secretInfo.encrypted[_keyId3];

        // only use keys we understand the encryption algorithm of
        if (_keyInfo3.algorithm === SECRET_STORAGE_ALGORITHM_V1_AES) {
          if (encInfo.iv && encInfo.ciphertext && encInfo.mac) {
            ret[_keyId3] = _keyInfo3;
          }
        }
      }
      return Object.keys(ret).length ? ret : null;
    })();
  }
  getSecretStorageKey(keys, name) {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      if (!_this8.callbacks.getSecretStorageKey) {
        throw new Error("No getSecretStorageKey callback supplied");
      }
      var returned = yield _this8.callbacks.getSecretStorageKey({
        keys
      }, name);
      if (!returned) {
        throw new Error("getSecretStorageKey callback returned falsey");
      }
      if (returned.length < 2) {
        throw new Error("getSecretStorageKey callback returned invalid data");
      }
      var [keyId, privateKey] = returned;
      if (!keys[keyId]) {
        throw new Error("App returned unknown key from getSecretStorageKey!");
      }
      if (keys[keyId].algorithm === SECRET_STORAGE_ALGORITHM_V1_AES) {
        var decryption = {
          encrypt: function encrypt(secret) {
            return encryptAESSecretStorageItem(secret, privateKey, name);
          },
          decrypt: function decrypt(encInfo) {
            return decryptAESSecretStorageItem(encInfo, privateKey, name);
          }
        };
        return [keyId, decryption];
      } else {
        throw new Error("Unknown key type: " + keys[keyId].algorithm);
      }
    })();
  }
}

/** trim trailing instances of '=' from a string
 *
 * @internal
 *
 * @param input - input string
 */
export function trimTrailingEquals(input) {
  // according to Sonar and CodeQL, a regex such as /=+$/ is superlinear.
  // Not sure I believe it, but it's easy enough to work around.

  // find the number of characters before the trailing =
  var i = input.length;
  while (i >= 1 && input.charCodeAt(i - 1) == 0x3d) i--;

  // trim to the calculated length
  if (i < input.length) {
    return input.substring(0, i);
  } else {
    return input;
  }
}

// string of zeroes, for calculating the key check
var ZERO_STR = "\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0";

/**
 * Calculate the MAC for checking the key.
 * See https://spec.matrix.org/v1.11/client-server-api/#msecret_storagev1aes-hmac-sha2, steps 3 and 4.
 *
 * @param key - the key to use
 * @param iv - The initialization vector as a base64-encoded string.
 *     If omitted, a random initialization vector will be created.
 * @returns An object that contains, `mac` and `iv` properties.
 */
export function calculateKeyCheck(key, iv) {
  return encryptAESSecretStorageItem(ZERO_STR, key, "", iv);
}
//# sourceMappingURL=secret-storage.js.map