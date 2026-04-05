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

/**
 * Cryptography-related events emitted by the {@link matrix.MatrixClient}.
 */
export var CryptoEvent = /*#__PURE__*/function (CryptoEvent) {
  /**
   * Fires when the trust status of a user changes.
   * The payload is a pair (userId, userTrustLevel). The trust level is one of the values from UserVerificationStatus.
   */
  CryptoEvent["UserTrustStatusChanged"] = "userTrustStatusChanged";
  /**
   * Fires when the key backup status changes.
   * The payload is a boolean indicating whether the key backup is enabled.
   */
  CryptoEvent["KeyBackupStatus"] = "crypto.keyBackupStatus";
  /**
   * Fires when we failed to back up the keys
   * The payload is the error code of the error that occurred.
   */
  CryptoEvent["KeyBackupFailed"] = "crypto.keyBackupFailed";
  /**
   * Fires when the number of sessions that can be backed up changes.
   * The payload is the remaining number of sessions that can be backed up.
   */
  CryptoEvent["KeyBackupSessionsRemaining"] = "crypto.keyBackupSessionsRemaining";
  /**
   * Fires when a new valid backup decryption key is in cache.
   * This will happen when a secret is received from another session, from secret storage,
   * or when a new backup is created from this session.
   *
   * The payload is the version of the backup for which we have the key for.
   *
   * This event is only fired by the rust crypto backend.
   */
  CryptoEvent["KeyBackupDecryptionKeyCached"] = "crypto.keyBackupDecryptionKeyCached";
  /**
   * Fires when a key verification request is received.
   * The payload is a VerificationRequest object representing the request.
   */
  CryptoEvent["VerificationRequestReceived"] = "crypto.verificationRequestReceived";
  /** @deprecated Use {@link DevicesUpdated} instead when using rust crypto */
  CryptoEvent["WillUpdateDevices"] = "crypto.willUpdateDevices";
  /**
   * Fires whenever the stored devices for a user have been updated
   * The payload is a pair (userIds, initialFetch).
   */
  CryptoEvent["DevicesUpdated"] = "crypto.devicesUpdated";
  /**
   * Fires when the user's cross-signing keys have changed or cross-signing
   * has been enabled/disabled. The client can use getStoredCrossSigningForUser
   * with the user ID of the logged in user to check if cross-signing is
   * enabled on the account. If enabled, it can test whether the current key
   * is trusted using with checkUserTrust with the user ID of the logged
   * in user. The checkOwnCrossSigningTrust function may be used to reconcile
   * the trust in the account key.
   *
   * The cross-signing API is currently UNSTABLE and may change without notice.
   * @experimental
   */
  CryptoEvent["KeysChanged"] = "crossSigning.keysChanged";
  /**
   * Fires when data is being migrated from legacy crypto to rust crypto.
   *
   * The payload is a pair `(progress, total)`, where `progress` is the number of steps completed so far, and
   * `total` is the total number of steps. When migration is complete, a final instance of the event is emitted, with
   * `progress === total === -1`.
   */
  CryptoEvent["LegacyCryptoStoreMigrationProgress"] = "crypto.legacyCryptoStoreMigrationProgress";
  /**
   * Fires when a new dehydrated device is created locally.
   *
   * After the client calls {@link CryptoApi.startDehydration}, this event
   * will be fired every time a new dehydrated device is created.  It may fire
   * before `startDehydration` returns.
   */
  CryptoEvent["DehydratedDeviceCreated"] = "dehydration.DehydratedDeviceCreated";
  /**
   * Fires when a new dehydrated device is successfully uploaded to the server.
   *
   * This should fire shortly after {@link DehydratedDeviceCreated} fires. If
   * upload is unsuccessful, this will be reported either by an error thrown
   * by {@link CryptoApi.startDehydration} (for errors that happen before
   * `startDehydration` returns), or by firing {@link DehydratedDeviceRotationError}
   * (for errors that happen during regular rotation of the dehydrated device)
   */
  CryptoEvent["DehydratedDeviceUploaded"] = "dehydration.DehydratedDeviceUploaded";
  /**
   * Fires when rehydration has started.
   *
   * After the client calls {@link CryptoApi.startDehydration}, this event will
   * fire if a dehydrated device is found and we attempt to rehydrate it.
   */
  CryptoEvent["RehydrationStarted"] = "dehydration.RehydrationStarted";
  /**
   * Fires during rehydration, to inform the application of rehydration progress.
   *
   * The payload is a pair `[roomKeyCount: number, toDeviceCount: number]`,
   * where `roomKeyCount` is the number of room keys that have been received
   * so far, and `toDeviceCount` is the number of to-device messages received
   * so far (including the messages containing room keys).
   */
  CryptoEvent["RehydrationProgress"] = "dehydration.RehydrationProgress";
  /** Fires when rehydration has completed successfully. */
  CryptoEvent["RehydrationCompleted"] = "dehydration.RehydrationCompleted";
  /** Fires when there was an error in rehydration.
   *
   * The payload is an error message as a string.
   */
  CryptoEvent["RehydrationError"] = "dehydration.RehydrationError";
  /**
   * Fires when a dehydrated device key has been cached in the local database.
   */
  CryptoEvent["DehydrationKeyCached"] = "dehydration.DehydrationKeyCached";
  /**
   * Fires when an error occurs during periodic rotation of the dehydrated device.
   *
   * The payload is an error message as a string.
   */
  CryptoEvent["DehydratedDeviceRotationError"] = "dehydration.DehydratedDeviceRotationError";
  return CryptoEvent;
}({});
//# sourceMappingURL=CryptoEvent.js.map