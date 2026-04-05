import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
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

/**
 * Check that the private cross signing keys (master, self signing, user signing) are stored in the secret storage and encrypted with the default secret storage key.
 *
 * @param secretStorage - The secret store using account data
 * @returns True if the cross-signing keys are all stored and encrypted with the same secret storage key.
 *
 * @internal
 */
export function secretStorageContainsCrossSigningKeys(_x) {
  return _secretStorageContainsCrossSigningKeys.apply(this, arguments);
}

/**
 *
 * Check that the secret storage can access the given secrets using the default key.
 *
 * @param secretStorage - The secret store using account data
 * @param secretNames - The secret names to check
 * @returns True if all the given secrets are accessible and encrypted with the given key.
 *
 * @internal
 */
function _secretStorageContainsCrossSigningKeys() {
  _secretStorageContainsCrossSigningKeys = _asyncToGenerator(function* (secretStorage) {
    return secretStorageCanAccessSecrets(secretStorage, ["m.cross_signing.master", "m.cross_signing.user_signing", "m.cross_signing.self_signing"]);
  });
  return _secretStorageContainsCrossSigningKeys.apply(this, arguments);
}
export function secretStorageCanAccessSecrets(_x2, _x3) {
  return _secretStorageCanAccessSecrets.apply(this, arguments);
}
function _secretStorageCanAccessSecrets() {
  _secretStorageCanAccessSecrets = _asyncToGenerator(function* (secretStorage, secretNames) {
    var defaultKeyId = yield secretStorage.getDefaultKeyId();
    if (!defaultKeyId) return false;
    for (var secretName of secretNames) {
      // check which keys this particular secret is encrypted with
      var record = (yield secretStorage.isStored(secretName)) || {};
      // if it's not encrypted with the right key, there is no point continuing
      if (!(defaultKeyId in record)) return false;
    }
    return true;
  });
  return _secretStorageCanAccessSecrets.apply(this, arguments);
}
//# sourceMappingURL=secret-storage.js.map