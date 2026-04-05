import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
/*
Copyright 2023-2024 The Matrix.org Foundation C.I.C.

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

import * as RustSdkCryptoJs from "@matrix-org/matrix-sdk-crypto-wasm";
import { MigrationState } from "../crypto/store/base.js";
import { IndexedDBCryptoStore } from "../crypto/store/indexeddb-crypto-store.js";
import { requestKeyBackupVersion } from "./backup.js";
import { sleep } from "../utils.js";
import { encodeBase64 } from "../base64.js";
import decryptAESSecretStorageItem from "../utils/decryptAESSecretStorageItem.js";
/**
 * Determine if any data needs migrating from the legacy store, and do so.
 *
 * This migrates the base account data, and olm and megolm sessions. It does *not* migrate the room list, which should
 * happen after an `OlmMachine` is created, via {@link migrateRoomSettingsFromLegacyCrypto}.
 *
 * @param args - Arguments object.
 */
export function migrateFromLegacyCrypto(_x) {
  return _migrateFromLegacyCrypto.apply(this, arguments);
}
function _migrateFromLegacyCrypto() {
  _migrateFromLegacyCrypto = _asyncToGenerator(function* (args) {
    var _args$legacyMigration2;
    var {
      logger,
      legacyStore
    } = args;

    // initialise the rust matrix-sdk-crypto-wasm, if it hasn't already been done
    yield RustSdkCryptoJs.initAsync();
    if (!(yield legacyStore.containsData())) {
      // This store was never used. Nothing to migrate.
      return;
    }
    yield legacyStore.startup();
    var accountPickle = null;
    yield legacyStore.doTxn("readonly", [IndexedDBCryptoStore.STORE_ACCOUNT], txn => {
      legacyStore.getAccount(txn, acctPickle => {
        accountPickle = acctPickle;
      });
    });
    if (!accountPickle) {
      // This store is not properly set up. Nothing to migrate.
      logger.debug("Legacy crypto store is not set up (no account found). Not migrating.");
      return;
    }
    var migrationState = yield legacyStore.getMigrationState();
    if (migrationState >= MigrationState.MEGOLM_SESSIONS_MIGRATED) {
      // All migration is done for now. The room list comes later, once we have an OlmMachine.
      return;
    }
    var nOlmSessions = yield countOlmSessions(logger, legacyStore);
    var nMegolmSessions = yield countMegolmSessions(logger, legacyStore);
    var totalSteps = 1 + nOlmSessions + nMegolmSessions;
    logger.info("Migrating data from legacy crypto store. ".concat(nOlmSessions, " olm sessions and ").concat(nMegolmSessions, " megolm sessions to migrate."));
    var stepsDone = 0;
    function onProgress(steps) {
      var _args$legacyMigration;
      stepsDone += steps;
      (_args$legacyMigration = args.legacyMigrationProgressListener) === null || _args$legacyMigration === void 0 || _args$legacyMigration.call(args, stepsDone, totalSteps);
    }
    onProgress(0);
    var pickleKey = new TextEncoder().encode(args.legacyPickleKey).slice();
    if (migrationState === MigrationState.NOT_STARTED) {
      logger.info("Migrating data from legacy crypto store. Step 1: base data");
      yield migrateBaseData(args.http, args.userId, args.deviceId, legacyStore, pickleKey, args.storeHandle, logger);
      migrationState = MigrationState.INITIAL_DATA_MIGRATED;
      yield legacyStore.setMigrationState(migrationState);
    }
    onProgress(1);
    if (migrationState === MigrationState.INITIAL_DATA_MIGRATED) {
      logger.info("Migrating data from legacy crypto store. Step 2: olm sessions (".concat(nOlmSessions, " sessions to migrate)."));
      yield migrateOlmSessions(logger, legacyStore, pickleKey, args.storeHandle, onProgress);
      migrationState = MigrationState.OLM_SESSIONS_MIGRATED;
      yield legacyStore.setMigrationState(migrationState);
    }
    if (migrationState === MigrationState.OLM_SESSIONS_MIGRATED) {
      logger.info("Migrating data from legacy crypto store. Step 3: megolm sessions (".concat(nMegolmSessions, " sessions to migrate)."));
      yield migrateMegolmSessions(logger, legacyStore, pickleKey, args.storeHandle, onProgress);
      migrationState = MigrationState.MEGOLM_SESSIONS_MIGRATED;
      yield legacyStore.setMigrationState(migrationState);
    }

    // Migration is done.
    (_args$legacyMigration2 = args.legacyMigrationProgressListener) === null || _args$legacyMigration2 === void 0 || _args$legacyMigration2.call(args, -1, -1);
    logger.info("Migration from legacy crypto store complete");
  });
  return _migrateFromLegacyCrypto.apply(this, arguments);
}
function migrateBaseData(_x2, _x3, _x4, _x5, _x6, _x7, _x8) {
  return _migrateBaseData.apply(this, arguments);
}
function _migrateBaseData() {
  _migrateBaseData = _asyncToGenerator(function* (http, userId, deviceId, legacyStore, pickleKey, storeHandle, logger) {
    var migrationData = new RustSdkCryptoJs.BaseMigrationData();
    migrationData.userId = new RustSdkCryptoJs.UserId(userId);
    migrationData.deviceId = new RustSdkCryptoJs.DeviceId(deviceId);
    yield legacyStore.doTxn("readonly", [IndexedDBCryptoStore.STORE_ACCOUNT], txn => legacyStore.getAccount(txn, a => {
      migrationData.pickledAccount = a !== null && a !== void 0 ? a : "";
    }));
    var recoveryKey = yield getAndDecryptCachedSecretKey(legacyStore, pickleKey, "m.megolm_backup.v1");

    // If we have a backup recovery key, we need to try to figure out which backup version it is for.
    // All we can really do is ask the server for the most recent version and check if the cached key we have matches.
    // It is possible that the backup has changed since last time his session was opened.
    if (recoveryKey) {
      var backupCallDone = false;
      var backupInfo = null;
      while (!backupCallDone) {
        try {
          backupInfo = yield requestKeyBackupVersion(http);
          backupCallDone = true;
        } catch (e) {
          logger.info("Failed to get backup version during migration, retrying in 2 seconds", e);
          // Retry until successful, use simple constant delay
          yield sleep(2000);
        }
      }
      if (backupInfo && backupInfo.algorithm == "m.megolm_backup.v1.curve25519-aes-sha2") {
        // check if the recovery key matches, as the active backup version may have changed since the key was cached
        // and the migration started.
        try {
          var _backupInfo$auth_data;
          var decryptionKey = RustSdkCryptoJs.BackupDecryptionKey.fromBase64(recoveryKey);
          var publicKey = (_backupInfo$auth_data = backupInfo.auth_data) === null || _backupInfo$auth_data === void 0 ? void 0 : _backupInfo$auth_data.public_key;
          var isValid = decryptionKey.megolmV1PublicKey.publicKeyBase64 == publicKey;
          if (isValid) {
            migrationData.backupVersion = backupInfo.version;
            migrationData.backupRecoveryKey = recoveryKey;
          } else {
            logger.debug("The backup key to migrate does not match the active backup version", "Cached pub key: ".concat(decryptionKey.megolmV1PublicKey.publicKeyBase64), "Active pub key: ".concat(publicKey));
          }
        } catch (e) {
          logger.warn("Failed to check if the backup key to migrate matches the active backup version", e);
        }
      }
    }
    migrationData.privateCrossSigningMasterKey = yield getAndDecryptCachedSecretKey(legacyStore, pickleKey, "master");
    migrationData.privateCrossSigningSelfSigningKey = yield getAndDecryptCachedSecretKey(legacyStore, pickleKey, "self_signing");
    migrationData.privateCrossSigningUserSigningKey = yield getAndDecryptCachedSecretKey(legacyStore, pickleKey, "user_signing");
    yield RustSdkCryptoJs.Migration.migrateBaseData(migrationData, pickleKey, storeHandle, logger);
  });
  return _migrateBaseData.apply(this, arguments);
}
function countOlmSessions(_x9, _x0) {
  return _countOlmSessions.apply(this, arguments);
}
function _countOlmSessions() {
  _countOlmSessions = _asyncToGenerator(function* (logger, legacyStore) {
    logger.debug("Counting olm sessions to be migrated");
    var nSessions;
    yield legacyStore.doTxn("readonly", [IndexedDBCryptoStore.STORE_SESSIONS], txn => legacyStore.countEndToEndSessions(txn, n => nSessions = n));
    return nSessions;
  });
  return _countOlmSessions.apply(this, arguments);
}
function countMegolmSessions(_x1, _x10) {
  return _countMegolmSessions.apply(this, arguments);
}
function _countMegolmSessions() {
  _countMegolmSessions = _asyncToGenerator(function* (logger, legacyStore) {
    logger.debug("Counting megolm sessions to be migrated");
    return yield legacyStore.countEndToEndInboundGroupSessions();
  });
  return _countMegolmSessions.apply(this, arguments);
}
function migrateOlmSessions(_x11, _x12, _x13, _x14, _x15) {
  return _migrateOlmSessions.apply(this, arguments);
}
function _migrateOlmSessions() {
  _migrateOlmSessions = _asyncToGenerator(function* (logger, legacyStore, pickleKey, storeHandle, onBatchDone) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      var batch = yield legacyStore.getEndToEndSessionsBatch();
      if (batch === null) return;
      logger.debug("Migrating batch of ".concat(batch.length, " olm sessions"));
      var migrationData = [];
      for (var session of batch) {
        var pickledSession = new RustSdkCryptoJs.PickledSession();
        pickledSession.senderKey = session.deviceKey;
        pickledSession.pickle = session.session;
        pickledSession.lastUseTime = pickledSession.creationTime = new Date(session.lastReceivedMessageTs);
        migrationData.push(pickledSession);
      }
      yield RustSdkCryptoJs.Migration.migrateOlmSessions(migrationData, pickleKey, storeHandle, logger);
      yield legacyStore.deleteEndToEndSessionsBatch(batch);
      onBatchDone(batch.length);
    }
  });
  return _migrateOlmSessions.apply(this, arguments);
}
function migrateMegolmSessions(_x16, _x17, _x18, _x19, _x20) {
  return _migrateMegolmSessions.apply(this, arguments);
}
/**
 * Determine if any room settings need migrating from the legacy store, and do so.
 *
 * @param args - Arguments object.
 */
function _migrateMegolmSessions() {
  _migrateMegolmSessions = _asyncToGenerator(function* (logger, legacyStore, pickleKey, storeHandle, onBatchDone) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      var batch = yield legacyStore.getEndToEndInboundGroupSessionsBatch();
      if (batch === null) return;
      logger.debug("Migrating batch of ".concat(batch.length, " megolm sessions"));
      var migrationData = [];
      for (var session of batch) {
        var _sessionData$keysClai;
        var sessionData = session.sessionData;
        var pickledSession = new RustSdkCryptoJs.PickledInboundGroupSession();
        pickledSession.pickle = sessionData.session;
        pickledSession.roomId = new RustSdkCryptoJs.RoomId(sessionData.room_id);
        pickledSession.senderKey = session.senderKey;
        pickledSession.senderSigningKey = (_sessionData$keysClai = sessionData.keysClaimed) === null || _sessionData$keysClai === void 0 ? void 0 : _sessionData$keysClai["ed25519"];
        pickledSession.backedUp = !session.needsBackup;

        // The Rust SDK `imported` flag is used to indicate the authenticity status of a Megolm
        // session, which tells us whether we can reliably tell which Olm device is the owner
        // (creator) of the session.
        //
        // If `imported` is true, then we have no cryptographic proof that the session is owned
        // by the device with the identity key `senderKey`.
        //
        // Only Megolm sessions received directly from the owning device via an encrypted
        // `m.room_key` to-device message should have `imported` flag set to false. Megolm
        // sessions received by any other currently available means (i.e. from a
        // `m.forwarded_room_key`, from v1 asymmetric server-side key backup, imported from a
        // file, etc) should have the `imported` flag set to true.
        //
        // Messages encrypted with such Megolm sessions will have a grey shield in the UI
        // ("Authenticity of this message cannot be guaranteed").
        //
        // However, we don't want to bluntly mark all sessions as `imported` during migration
        // because users will suddenly start seeing all their historic messages decorated with a
        // grey shield, which would be seen as a non-actionable regression.
        //
        // In the legacy crypto stack, the flag encoding similar information was called
        // `InboundGroupSessionData.untrusted`. The value of this flag was set as follows:
        //
        // - For outbound Megolm sessions created by our own device, `untrusted` is `undefined`.
        // - For Megolm sessions received via a `m.room_key` to-device message, `untrusted` is
        //   `undefined`.
        // - For Megolm sessions received via a `m.forwarded_room_key` to-device message,
        //   `untrusted` is `true`.
        // - For Megolm sessions imported from a (v1 asymmetric / "legacy") server-side key
        //   backup, `untrusted` is `true`.
        // - For Megolm sessions imported from a file, untrusted is `undefined`.
        //
        // The main difference between the legacy crypto stack and the Rust crypto stack is that
        // the Rust stack considers sessions imported from a file as `imported` (not
        // authenticated). This is because the Megolm session export file format does not
        // encode this authenticity information.
        //
        // Given this migration is only a one-time thing, we make a concession to accept the
        // loss of information in this case, to avoid degrading UX in a non-actionable way.
        pickledSession.imported = sessionData.untrusted === true;
        migrationData.push(pickledSession);
      }
      yield RustSdkCryptoJs.Migration.migrateMegolmSessions(migrationData, pickleKey, storeHandle, logger);
      yield legacyStore.deleteEndToEndInboundGroupSessionsBatch(batch);
      onBatchDone(batch.length);
    }
  });
  return _migrateMegolmSessions.apply(this, arguments);
}
export function migrateRoomSettingsFromLegacyCrypto(_x21) {
  return _migrateRoomSettingsFromLegacyCrypto.apply(this, arguments);
}
function _migrateRoomSettingsFromLegacyCrypto() {
  _migrateRoomSettingsFromLegacyCrypto = _asyncToGenerator(function* (_ref) {
    var {
      logger,
      legacyStore,
      olmMachine
    } = _ref;
    if (!(yield legacyStore.containsData())) {
      // This store was never used. Nothing to migrate.
      return;
    }
    var migrationState = yield legacyStore.getMigrationState();
    if (migrationState >= MigrationState.ROOM_SETTINGS_MIGRATED) {
      // We've already migrated the room settings.
      return;
    }
    var rooms = {};
    yield legacyStore.doTxn("readwrite", [IndexedDBCryptoStore.STORE_ROOMS], txn => {
      legacyStore.getEndToEndRooms(txn, result => {
        rooms = result;
      });
    });
    logger.debug("Migrating ".concat(Object.keys(rooms).length, " sets of room settings"));
    for (var [roomId, legacySettings] of Object.entries(rooms)) {
      try {
        var rustSettings = new RustSdkCryptoJs.RoomSettings();
        if (legacySettings.algorithm !== "m.megolm.v1.aes-sha2") {
          logger.warn("Room ".concat(roomId, ": ignoring room with invalid algorithm ").concat(legacySettings.algorithm));
          continue;
        }
        rustSettings.algorithm = RustSdkCryptoJs.EncryptionAlgorithm.MegolmV1AesSha2;
        rustSettings.sessionRotationPeriodMs = legacySettings.rotation_period_ms;
        rustSettings.sessionRotationPeriodMessages = legacySettings.rotation_period_msgs;
        yield olmMachine.setRoomSettings(new RustSdkCryptoJs.RoomId(roomId), rustSettings);

        // We don't attempt to clear out the settings from the old store, or record where we've gotten up to,
        // which means that if the app gets restarted while we're in the middle of this migration, we'll start
        // again from scratch. So be it. Given that legacy crypto loads the whole room list into memory on startup
        // anyway, we know it can't be that big.
      } catch (e) {
        logger.warn("Room ".concat(roomId, ": ignoring settings ").concat(JSON.stringify(legacySettings), " which caused error ").concat(e));
      }
    }
    logger.debug("Completed room settings migration");
    yield legacyStore.setMigrationState(MigrationState.ROOM_SETTINGS_MIGRATED);
  });
  return _migrateRoomSettingsFromLegacyCrypto.apply(this, arguments);
}
function getAndDecryptCachedSecretKey(_x22, _x23, _x24) {
  return _getAndDecryptCachedSecretKey.apply(this, arguments);
}
/**
 * Check if the user's published identity (ie, public cross-signing keys) was trusted by the legacy session,
 * and if so mark it as trusted in the Rust session if needed.
 *
 * By default, if the legacy session didn't have the private MSK, the migrated session will revert to unverified,
 * even if the user has verified the session in the past.
 *
 * This only occurs if the private MSK was not cached in the crypto store (USK and SSK private keys won't help
 * to establish trust: the trust is rooted in the MSK).
 *
 * Rust crypto will only consider the current session as trusted if we import the private MSK itself.
 *
 * We could prompt the user to verify the session again, but it's probably better to just mark the user identity
 * as locally verified if it was before.
 *
 * See https://github.com/element-hq/element-web/issues/27079
 *
 * @param args - Argument object.
 */
function _getAndDecryptCachedSecretKey() {
  _getAndDecryptCachedSecretKey = _asyncToGenerator(function* (legacyStore, legacyPickleKey, name) {
    var key = yield new Promise(resolve => {
      legacyStore.doTxn("readonly", [IndexedDBCryptoStore.STORE_ACCOUNT], txn => {
        legacyStore.getSecretStorePrivateKey(txn, resolve, name);
      });
    });
    if (key && key.ciphertext && key.iv && key.mac) {
      return yield decryptAESSecretStorageItem(key, legacyPickleKey, name);
    } else if (key instanceof Uint8Array) {
      // This is a legacy backward compatibility case where the key was stored in clear.
      return encodeBase64(key);
    } else {
      return undefined;
    }
  });
  return _getAndDecryptCachedSecretKey.apply(this, arguments);
}
export function migrateLegacyLocalTrustIfNeeded(_x25) {
  return _migrateLegacyLocalTrustIfNeeded.apply(this, arguments);
}

/**
 * Checks if the legacy store has a trusted public master key, and returns it if so.
 *
 * @param legacyStore - The legacy store to check.
 *
 * @returns `null` if there were no cross signing keys or if they were not trusted. The trusted public master key if it was.
 */
function _migrateLegacyLocalTrustIfNeeded() {
  _migrateLegacyLocalTrustIfNeeded = _asyncToGenerator(function* (args) {
    var {
      legacyCryptoStore,
      rustCrypto,
      logger
    } = args;
    // Get the public cross-signing identity from rust.
    var rustOwnIdentity = yield rustCrypto.getOwnIdentity();
    if (!rustOwnIdentity) {
      // There are no cross-signing keys published server side, so nothing to do here.
      return;
    }
    if (rustOwnIdentity.isVerified()) {
      // The rust session already trusts the keys, so again, nothing to do.
      return;
    }
    var legacyLocallyTrustedMSK = yield getLegacyTrustedPublicMasterKeyBase64(legacyCryptoStore);
    if (!legacyLocallyTrustedMSK) {
      // The user never verified their identity in the legacy session, so nothing to do.
      return;
    }
    var mskInfo = JSON.parse(rustOwnIdentity.masterKey);
    if (!mskInfo.keys || Object.keys(mskInfo.keys).length === 0) {
      // This should not happen, but let's be safe
      logger.error("Post Migration | Unexpected error: no master key in the rust session.");
      return;
    }
    var rustSeenMSK = Object.values(mskInfo.keys)[0];
    if (rustSeenMSK && rustSeenMSK == legacyLocallyTrustedMSK) {
      logger.info("Post Migration: Migrating legacy trusted MSK: ".concat(legacyLocallyTrustedMSK, " to locally verified."));
      // Let's mark the user identity as locally verified as part of the migration.
      yield rustOwnIdentity.verify();
      // As well as marking the MSK as trusted, `OlmMachine.verify` returns a
      // `SignatureUploadRequest` which will publish a signature of the MSK using
      // this device. In this case, we ignore the request: since the user hasn't
      // actually re-verified the MSK, we don't publish a new signature. (`.verify`
      // doesn't store the signature, and if we drop the request here it won't be
      // retried.)
      //
      // Not publishing the signature is consistent with the behaviour of
      // matrix-crypto-sdk when the private key is imported via
      // `importCrossSigningKeys`, and when the identity is verified via interactive
      // verification.
      //
      // [Aside: device signatures on the MSK are not considered by the rust-sdk to
      // establish the trust of the user identity so in any case, what we actually do
      // here is somewhat moot.]
    }
  });
  return _migrateLegacyLocalTrustIfNeeded.apply(this, arguments);
}
function getLegacyTrustedPublicMasterKeyBase64(_x26) {
  return _getLegacyTrustedPublicMasterKeyBase.apply(this, arguments);
}
function _getLegacyTrustedPublicMasterKeyBase() {
  _getLegacyTrustedPublicMasterKeyBase = _asyncToGenerator(function* (legacyStore) {
    var maybeTrustedKeys = null;
    yield legacyStore.doTxn("readonly", "account", txn => {
      legacyStore.getCrossSigningKeys(txn, keys => {
        // can be an empty object after resetting cross-signing keys, see storeTrustedSelfKeys
        var msk = keys === null || keys === void 0 ? void 0 : keys.master;
        if (msk && Object.keys(msk.keys).length != 0) {
          // `msk.keys` is an object with { [`ed25519:${pubKey}`]: pubKey }
          maybeTrustedKeys = Object.values(msk.keys)[0];
        }
      });
    });
    return maybeTrustedKeys;
  });
  return _getLegacyTrustedPublicMasterKeyBase.apply(this, arguments);
}
//# sourceMappingURL=libolm_migration.js.map