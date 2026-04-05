import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
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

import * as RustSdkCryptoJs from "@matrix-org/matrix-sdk-crypto-wasm";
import { CollectStrategy, EncryptionAlgorithm, EncryptionSettings, HistoryVisibility as RustHistoryVisibility, RoomId, UserId } from "@matrix-org/matrix-sdk-crypto-wasm";
import { EventType } from "../@types/event.js";
import { LogSpan } from "../logger.js";
import { HistoryVisibility } from "../@types/partials.js";
import { logDuration } from "../utils.js";
import { KnownMembership } from "../@types/membership.js";
import { DeviceIsolationModeKind } from "../crypto-api/index.js";

/**
 * RoomEncryptor: responsible for encrypting messages to a given room
 *
 * @internal
 */
export class RoomEncryptor {
  /**
   * @param prefixedLogger - A logger to use for log messages.
   * @param olmMachine - The rust-sdk's OlmMachine
   * @param keyClaimManager - Our KeyClaimManager, which manages the queue of one-time-key claim requests
   * @param outgoingRequestManager - The OutgoingRequestManager, which manages the queue of outgoing requests.
   * @param room - The room we want to encrypt for
   * @param encryptionSettings - body of the m.room.encryption event currently in force in this room
   */
  constructor(prefixedLogger, olmMachine, keyClaimManager, outgoingRequestManager, room, encryptionSettings) {
    this.prefixedLogger = prefixedLogger;
    this.olmMachine = olmMachine;
    this.keyClaimManager = keyClaimManager;
    this.outgoingRequestManager = outgoingRequestManager;
    this.room = room;
    this.encryptionSettings = encryptionSettings;
    /** whether the room members have been loaded and tracked for the first time */
    _defineProperty(this, "lazyLoadedMembersResolved", false);
    /**
     * Ensures that there is only one encryption operation at a time for that room.
     *
     * An encryption operation is either a {@link prepareForEncryption} or an {@link encryptEvent} call.
     */
    _defineProperty(this, "currentEncryptionPromise", Promise.resolve());
    // start tracking devices for any users already known to be in this room.
    // Do not load members here, would defeat lazy loading.
    var members = room.getJoinedMembers();

    // At this point just mark the known members as tracked, it might not be the full list of members
    // because of lazy loading. This is fine, because we will get a member list update when sending a message for
    // the first time, see `RoomEncryptor#ensureEncryptionSession`
    this.olmMachine.updateTrackedUsers(members.map(u => new RustSdkCryptoJs.UserId(u.userId))).catch(e => this.prefixedLogger.error("Error initializing tracked users", e));
  }

  /**
   * Handle a new `m.room.encryption` event in this room
   *
   * @param config - The content of the encryption event
   */
  onCryptoEvent(config) {
    if (JSON.stringify(this.encryptionSettings) != JSON.stringify(config)) {
      // This should currently be unreachable, since the Rust SDK will reject any attempts to change config.
      throw new Error("Cannot reconfigure an active RoomEncryptor");
    }
  }

  /**
   * Handle a new `m.room.member` event in this room
   *
   * @param member - new membership state
   */
  onRoomMembership(member) {
    if (member.membership == KnownMembership.Join || member.membership == KnownMembership.Invite && this.room.shouldEncryptForInvitedMembers()) {
      // make sure we are tracking the deviceList for this user
      this.olmMachine.updateTrackedUsers([new UserId(member.userId)]).catch(e => {
        this.prefixedLogger.error("Unable to update tracked users", e);
      });
    }

    // TODO: handle leaves (including our own)
  }

  /**
   * Prepare to encrypt events in this room.
   *
   * This ensures that we have a megolm session ready to use and that we have shared its key with all the devices
   * in the room.
   * @param globalBlacklistUnverifiedDevices - When `true`, and `deviceIsolationMode` is `AllDevicesIsolationMode`,
   * will not send encrypted messages to unverified devices.
   * Ignored when `deviceIsolationMode` is `OnlySignedDevicesIsolationMode`.
   * @param deviceIsolationMode - The device isolation mode. See {@link DeviceIsolationMode}.
   */
  prepareForEncryption(globalBlacklistUnverifiedDevices, deviceIsolationMode) {
    var _this = this;
    return _asyncToGenerator(function* () {
      // We consider a prepareForEncryption as an encryption promise as it will potentially share keys
      // even if it doesn't send an event.
      // Usually this is called when the user starts typing, so we want to make sure we have keys ready when the
      // message is finally sent.
      // If `encryptEvent` is invoked before `prepareForEncryption` has completed, the `encryptEvent` call will wait for
      // `prepareForEncryption` to complete before executing.
      // The part where `encryptEvent` shares the room key will then usually be a no-op as it was already performed by `prepareForEncryption`.
      yield _this.encryptEvent(null, globalBlacklistUnverifiedDevices, deviceIsolationMode);
    })();
  }

  /**
   * Encrypt an event for this room, or prepare for encryption.
   *
   * This will ensure that we have a megolm session for this room, share it with the devices in the room, and
   * then, if an event is provided, encrypt it using the session.
   *
   * @param event - Event to be encrypted, or null if only preparing for encryption (in which case we will pre-share the room key).
   * @param globalBlacklistUnverifiedDevices - When `true`, and `deviceIsolationMode` is `AllDevicesIsolationMode`,
   * will not send encrypted messages to unverified devices.
   * Ignored when `deviceIsolationMode` is `OnlySignedDevicesIsolationMode`.
   * @param deviceIsolationMode - The device isolation mode. See {@link DeviceIsolationMode}.
   */
  encryptEvent(event, globalBlacklistUnverifiedDevices, deviceIsolationMode) {
    var _event$getTxnId,
      _this2 = this;
    var logger = new LogSpan(this.prefixedLogger, event ? (_event$getTxnId = event.getTxnId()) !== null && _event$getTxnId !== void 0 ? _event$getTxnId : "" : "prepareForEncryption");
    // Ensure order of encryption to avoid message ordering issues, as the scheduler only ensures
    // events order after they have been encrypted.
    var prom = this.currentEncryptionPromise.catch(() => {
      // Any errors in the previous call will have been reported already, so there is nothing to do here.
      // we just throw away the error and start anew.
    }).then(/*#__PURE__*/_asyncToGenerator(function* () {
      yield logDuration(logger, "ensureEncryptionSession", /*#__PURE__*/_asyncToGenerator(function* () {
        yield _this2.ensureEncryptionSession(logger, globalBlacklistUnverifiedDevices, deviceIsolationMode);
      }));
      if (event) {
        yield logDuration(logger, "encryptEventInner", /*#__PURE__*/_asyncToGenerator(function* () {
          yield _this2.encryptEventInner(logger, event);
        }));
      }
    }));
    this.currentEncryptionPromise = prom;
    return prom;
  }

  /**
   * Prepare to encrypt events in this room.
   *
   * This ensures that we have a megolm session ready to use and that we have shared its key with all the devices
   * in the room.
   *
   * @param logger - a place to write diagnostics to
   * @param globalBlacklistUnverifiedDevices - When `true`, and `deviceIsolationMode` is `AllDevicesIsolationMode`,
   * will not send encrypted messages to unverified devices.
   * Ignored when `deviceIsolationMode` is `OnlySignedDevicesIsolationMode`.
   * @param deviceIsolationMode - The device isolation mode. See {@link DeviceIsolationMode}.
   */
  ensureEncryptionSession(logger, globalBlacklistUnverifiedDevices, deviceIsolationMode) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      if (_this3.encryptionSettings.algorithm !== "m.megolm.v1.aes-sha2") {
        throw new Error("Cannot encrypt in ".concat(_this3.room.roomId, " for unsupported algorithm '").concat(_this3.encryptionSettings.algorithm, "'"));
      }
      logger.debug("Starting encryption");
      var members = yield _this3.room.getEncryptionTargetMembers();

      // If this is the first time we are sending a message to the room, we may not yet have seen all the members
      // (so the Crypto SDK might not have a device list for them). So, if this is the first time we are encrypting
      // for this room, give the SDK the full list of members, to be on the safe side.
      //
      // This could end up being racy (if two calls to ensureEncryptionSession happen at the same time), but that's
      // not a particular problem, since `OlmMachine.updateTrackedUsers` just adds any users that weren't already tracked.
      if (!_this3.lazyLoadedMembersResolved) {
        yield logDuration(logger, "loadMembersIfNeeded: updateTrackedUsers", /*#__PURE__*/_asyncToGenerator(function* () {
          yield _this3.olmMachine.updateTrackedUsers(members.map(u => new RustSdkCryptoJs.UserId(u.userId)));
        }));
        logger.debug("Updated tracked users");
        _this3.lazyLoadedMembersResolved = true;

        // Query keys in case we don't have them for newly tracked members.
        // It's important after loading members for the first time, as likely most of them won't be
        // known yet and will be unable to decrypt messages despite being in the room for long.
        // This must be done before ensuring sessions. If not the devices of these users are not
        // known yet and will not get the room key.
        // We don't have API to only get the keys queries related to this member list, so we just
        // process the pending requests from the olmMachine. (usually these are processed
        // at the end of the sync, but we can't wait for that).
        // XXX future improvement process only KeysQueryRequests for the users that have never been queried.
        logger.debug("Processing outgoing requests");
        yield logDuration(logger, "doProcessOutgoingRequests", /*#__PURE__*/_asyncToGenerator(function* () {
          yield _this3.outgoingRequestManager.doProcessOutgoingRequests();
        }));
      } else {
        // If members are already loaded it's less critical to await on key queries.
        // We might still want to trigger a processOutgoingRequests here.
        // The call to `ensureSessionsForUsers` below will wait a bit on in-flight key queries we are
        // interested in. If a sync handling happens in the meantime, and some new members are added to the room
        // or have new devices it would give us a chance to query them before sending.
        // It's less critical due to the racy nature of this process.
        logger.debug("Processing outgoing requests in background");
        _this3.outgoingRequestManager.doProcessOutgoingRequests();
      }
      logger.debug("Encrypting for users (shouldEncryptForInvitedMembers: ".concat(_this3.room.shouldEncryptForInvitedMembers(), "):"), members.map(u => "".concat(u.userId, " (").concat(u.membership, ")")));
      var userList = members.map(u => new UserId(u.userId));
      yield logDuration(logger, "ensureSessionsForUsers", /*#__PURE__*/_asyncToGenerator(function* () {
        yield _this3.keyClaimManager.ensureSessionsForUsers(logger, userList);
      }));
      var rustEncryptionSettings = new EncryptionSettings();
      rustEncryptionSettings.historyVisibility = toRustHistoryVisibility(_this3.room.getHistoryVisibility());

      // We only support megolm
      rustEncryptionSettings.algorithm = EncryptionAlgorithm.MegolmV1AesSha2;

      // We need to convert the rotation period from milliseconds to microseconds
      // See https://spec.matrix.org/v1.8/client-server-api/#mroomencryption and
      // https://matrix-org.github.io/matrix-rust-sdk-crypto-wasm/classes/EncryptionSettings.html#rotationPeriod
      if (typeof _this3.encryptionSettings.rotation_period_ms === "number") {
        rustEncryptionSettings.rotationPeriod = BigInt(_this3.encryptionSettings.rotation_period_ms * 1000);
      }
      if (typeof _this3.encryptionSettings.rotation_period_msgs === "number") {
        rustEncryptionSettings.rotationPeriodMessages = BigInt(_this3.encryptionSettings.rotation_period_msgs);
      }
      switch (deviceIsolationMode.kind) {
        case DeviceIsolationModeKind.AllDevicesIsolationMode:
          {
            var _this3$room$getBlackl;
            // When this.room.getBlacklistUnverifiedDevices() === null, the global settings should be used
            // See Room#getBlacklistUnverifiedDevices
            var onlyAllowTrustedDevices = (_this3$room$getBlackl = _this3.room.getBlacklistUnverifiedDevices()) !== null && _this3$room$getBlackl !== void 0 ? _this3$room$getBlackl : globalBlacklistUnverifiedDevices;
            rustEncryptionSettings.sharingStrategy = CollectStrategy.deviceBasedStrategy(onlyAllowTrustedDevices, deviceIsolationMode.errorOnVerifiedUserProblems);
          }
          break;
        case DeviceIsolationModeKind.OnlySignedDevicesIsolationMode:
          rustEncryptionSettings.sharingStrategy = CollectStrategy.identityBasedStrategy();
          break;
      }
      yield logDuration(logger, "shareRoomKey", /*#__PURE__*/_asyncToGenerator(function* () {
        var shareMessages = yield _this3.olmMachine.shareRoomKey(new RoomId(_this3.room.roomId),
        // safe to pass without cloning, as it's not reused here (before or after)
        userList, rustEncryptionSettings);
        if (shareMessages) {
          for (var m of shareMessages) {
            yield _this3.outgoingRequestManager.outgoingRequestProcessor.makeOutgoingRequest(m);
          }
        }
      }));
    })();
  }

  /**
   * Discard any existing group session for this room
   */
  forceDiscardSession() {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      var r = yield _this4.olmMachine.invalidateGroupSession(new RoomId(_this4.room.roomId));
      if (r) {
        _this4.prefixedLogger.info("Discarded existing group session");
      }
    })();
  }
  encryptEventInner(logger, event) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      logger.debug("Encrypting actual message content");
      var room = new RoomId(_this5.room.roomId);
      var type = event.getType();
      var content = JSON.stringify(event.getContent());
      var encryptedContent;
      if (event.isState()) {
        encryptedContent = yield _this5.olmMachine.encryptStateEvent(room, type,
        // Safety: we've already checked above that this is a state event, so the state key must exist.
        event.getStateKey(), content);
      } else {
        encryptedContent = yield _this5.olmMachine.encryptRoomEvent(room, type, content);
      }
      event.makeEncrypted(EventType.RoomMessageEncrypted, JSON.parse(encryptedContent), _this5.olmMachine.identityKeys.curve25519.toBase64(), _this5.olmMachine.identityKeys.ed25519.toBase64());
      logger.debug("Encrypted event successfully");
    })();
  }
}

/**
 * Convert a HistoryVisibility to a RustHistoryVisibility
 * @param visibility - HistoryVisibility enum
 * @returns a RustHistoryVisibility enum
 */
export function toRustHistoryVisibility(visibility) {
  switch (visibility) {
    case HistoryVisibility.Invited:
      return RustHistoryVisibility.Invited;
    case HistoryVisibility.Joined:
      return RustHistoryVisibility.Joined;
    case HistoryVisibility.Shared:
      return RustHistoryVisibility.Shared;
    case HistoryVisibility.WorldReadable:
      return RustHistoryVisibility.WorldReadable;
  }
}
//# sourceMappingURL=RoomEncryptor.js.map