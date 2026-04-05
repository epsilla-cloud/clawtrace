/*
Copyright 2021 The Matrix.org Foundation C.I.C.

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
 * Internal module. Definitions for storage for the crypto module
 */

/**
 * Abstraction of things that can store data required for end-to-end encryption
 */

/** Data on a Megolm session */

/** Extended data on a Megolm session */

/** Data on an Olm session */

/**
 * Represents an outgoing room key request
 */

/**
 * Keys for the `account` object store to store the migration state.
 * Values are defined in `MigrationState`.
 * @internal
 */
export var ACCOUNT_OBJECT_KEY_MIGRATION_STATE = "migrationState";

/**
 * A record of which steps have been completed in the libolm to Rust Crypto migration.
 *
 * Used by {@link CryptoStore#getMigrationState} and {@link CryptoStore#setMigrationState}.
 *
 * @internal
 */
export var MigrationState = /*#__PURE__*/function (MigrationState) {
  /** No migration steps have yet been completed. */
  MigrationState[MigrationState["NOT_STARTED"] = 0] = "NOT_STARTED";
  /** We have migrated the account data, cross-signing keys, etc. */
  MigrationState[MigrationState["INITIAL_DATA_MIGRATED"] = 1] = "INITIAL_DATA_MIGRATED";
  /** INITIAL_DATA_MIGRATED, and in addition, we have migrated all the Olm sessions. */
  MigrationState[MigrationState["OLM_SESSIONS_MIGRATED"] = 2] = "OLM_SESSIONS_MIGRATED";
  /** OLM_SESSIONS_MIGRATED, and in addition, we have migrated all the Megolm sessions. */
  MigrationState[MigrationState["MEGOLM_SESSIONS_MIGRATED"] = 3] = "MEGOLM_SESSIONS_MIGRATED";
  /** MEGOLM_SESSIONS_MIGRATED, and in addition, we have migrated all the room settings. */
  MigrationState[MigrationState["ROOM_SETTINGS_MIGRATED"] = 4] = "ROOM_SETTINGS_MIGRATED";
  /** ROOM_SETTINGS_MIGRATED, and in addition, we have done the first own keys query in order to
   * load the public part of the keys that have been migrated */
  MigrationState[MigrationState["INITIAL_OWN_KEY_QUERY_DONE"] = 5] = "INITIAL_OWN_KEY_QUERY_DONE";
  return MigrationState;
}({});

/**
 * The size of batches to be returned by {@link CryptoStore#getEndToEndSessionsBatch} and
 * {@link CryptoStore#getEndToEndInboundGroupSessionsBatch}.
 */
export var SESSION_BATCH_SIZE = 50;

/* eslint-disable camelcase */

/* eslint-enable camelcase */

export var TrackingStatus = /*#__PURE__*/function (TrackingStatus) {
  TrackingStatus[TrackingStatus["NotTracked"] = 0] = "NotTracked";
  TrackingStatus[TrackingStatus["PendingDownload"] = 1] = "PendingDownload";
  TrackingStatus[TrackingStatus["DownloadInProgress"] = 2] = "DownloadInProgress";
  TrackingStatus[TrackingStatus["UpToDate"] = 3] = "UpToDate";
  return TrackingStatus;
}({});

/**
 *  possible states for a room key request
 *
 * The state machine looks like:
 * ```
 *
 *     |         (cancellation sent)
 *     | .-------------------------------------------------.
 *     | |                                                 |
 *     V V       (cancellation requested)                  |
 *   UNSENT  -----------------------------+                |
 *     |                                  |                |
 *     |                                  |                |
 *     | (send successful)                |  CANCELLATION_PENDING_AND_WILL_RESEND
 *     V                                  |                Λ
 *    SENT                                |                |
 *     |--------------------------------  |  --------------'
 *     |                                  |  (cancellation requested with intent
 *     |                                  |   to resend the original request)
 *     |                                  |
 *     | (cancellation requested)         |
 *     V                                  |
 * CANCELLATION_PENDING                   |
 *     |                                  |
 *     | (cancellation sent)              |
 *     V                                  |
 * (deleted)  <---------------------------+
 * ```
 */
export var RoomKeyRequestState = /*#__PURE__*/function (RoomKeyRequestState) {
  /** request not yet sent */
  RoomKeyRequestState[RoomKeyRequestState["Unsent"] = 0] = "Unsent";
  /** request sent, awaiting reply */
  RoomKeyRequestState[RoomKeyRequestState["Sent"] = 1] = "Sent";
  /** reply received, cancellation not yet sent */
  RoomKeyRequestState[RoomKeyRequestState["CancellationPending"] = 2] = "CancellationPending";
  /**
   * Cancellation not yet sent and will transition to UNSENT instead of
   * being deleted once the cancellation has been sent.
   */
  RoomKeyRequestState[RoomKeyRequestState["CancellationPendingAndWillResend"] = 3] = "CancellationPendingAndWillResend";
  return RoomKeyRequestState;
}({});

/* eslint-disable camelcase */

/**
 * The parameters of a room key request. The details of the request may
 * vary with the crypto algorithm, but the management and storage layers for
 * outgoing requests expect it to have 'room_id' and 'session_id' properties.
 */

/* eslint-enable camelcase */

/** State of the verification of the device. */
export var DeviceVerification = /*#__PURE__*/function (DeviceVerification) {
  DeviceVerification[DeviceVerification["Blocked"] = -1] = "Blocked";
  DeviceVerification[DeviceVerification["Unverified"] = 0] = "Unverified";
  DeviceVerification[DeviceVerification["Verified"] = 1] = "Verified";
  return DeviceVerification;
}({});
//# sourceMappingURL=base.js.map