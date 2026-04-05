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
import { QrState } from "@matrix-org/matrix-sdk-crypto-wasm";
import { VerificationPhase, VerificationRequestEvent, VerifierEvent } from "../crypto-api/verification.js";
import { TypedEventEmitter } from "../models/typed-event-emitter.js";
import { TypedReEmitter } from "../ReEmitter.js";
import { EventType, MsgType } from "../@types/event.js";
import { VerificationMethod } from "../types.js";
/**
 * An incoming, or outgoing, request to verify a user or a device via cross-signing.
 *
 * @internal
 */
export class RustVerificationRequest extends TypedEventEmitter {
  /**
   * Construct a new RustVerificationRequest to wrap the rust-level `VerificationRequest`.
   *
   * @param logger - A logger instance which will be used to log events.
   * @param olmMachine - The `OlmMachine` from the underlying rust crypto sdk.
   * @param inner - VerificationRequest from the Rust SDK.
   * @param outgoingRequestProcessor - `OutgoingRequestProcessor` to use for making outgoing HTTP requests.
   * @param supportedVerificationMethods - Verification methods to use when `accept()` is called.
   */
  constructor(logger, olmMachine, inner, outgoingRequestProcessor, supportedVerificationMethods) {
    super();
    this.logger = logger;
    this.olmMachine = olmMachine;
    this.inner = inner;
    this.outgoingRequestProcessor = outgoingRequestProcessor;
    this.supportedVerificationMethods = supportedVerificationMethods;
    /** a reëmitter which relays VerificationRequestEvent.Changed events emitted by the verifier */
    _defineProperty(this, "reEmitter", void 0);
    /** Are we in the process of sending an `m.key.verification.ready` event? */
    _defineProperty(this, "_accepting", false);
    /** Are we in the process of sending an `m.key.verification.cancellation` event? */
    _defineProperty(this, "_cancelling", false);
    _defineProperty(this, "_verifier", void 0);
    this.reEmitter = new TypedReEmitter(this);

    // Obviously, the Rust object maintains a reference to the callback function. If the callback function maintains
    // a reference to the Rust object, then we have a reference cycle which means that `RustVerificationRequest`
    // will never be garbage-collected, and hence the underlying rust object will never be freed.
    //
    // To avoid this reference cycle, use a weak reference in the callback function. If the `RustVerificationRequest`
    // gets garbage-collected, then there is nothing to update!
    var weakThis = new WeakRef(this);
    inner.registerChangesCallback(/*#__PURE__*/_asyncToGenerator(function* () {
      var _weakThis$deref;
      return (_weakThis$deref = weakThis.deref()) === null || _weakThis$deref === void 0 ? void 0 : _weakThis$deref.onChange();
    }));
  }

  /**
   * Hook which is called when the underlying rust class notifies us that there has been a change.
   */
  onChange() {
    var verification = this.inner.getVerification();

    // Set the _verifier object (wrapping the rust `Verification` as a js-sdk Verifier) if:
    // - we now have a `Verification` where we lacked one before
    // - we have transitioned from QR to SAS
    // - we are verifying with SAS, but we need to replace our verifier with a new one because both parties
    //   tried to start verification at the same time, and we lost the tie breaking
    if (verification instanceof RustSdkCryptoJs.Sas) {
      if (this._verifier === undefined || this._verifier instanceof RustQrCodeVerifier) {
        this.setVerifier(new RustSASVerifier(verification, this, this.outgoingRequestProcessor));
      } else if (this._verifier instanceof RustSASVerifier) {
        this._verifier.replaceInner(verification);
      }
    } else if (verification instanceof RustSdkCryptoJs.Qr && this._verifier === undefined) {
      this.setVerifier(new RustQrCodeVerifier(verification, this.outgoingRequestProcessor));
    }
    this.emit(VerificationRequestEvent.Change);
  }
  setVerifier(verifier) {
    // if we already have a verifier, unsubscribe from its events
    if (this._verifier) {
      this.reEmitter.stopReEmitting(this._verifier, [VerificationRequestEvent.Change]);
    }
    this._verifier = verifier;
    this.reEmitter.reEmit(this._verifier, [VerificationRequestEvent.Change]);
  }

  /**
   * Unique ID for this verification request.
   *
   * An ID isn't assigned until the first message is sent, so this may be `undefined` in the early phases.
   */
  get transactionId() {
    return this.inner.flowId;
  }

  /**
   * For an in-room verification, the ID of the room.
   *
   * For to-device verifications, `undefined`.
   */
  get roomId() {
    var _this$inner$roomId;
    return (_this$inner$roomId = this.inner.roomId) === null || _this$inner$roomId === void 0 ? void 0 : _this$inner$roomId.toString();
  }

  /**
   * True if this request was initiated by the local client.
   *
   * For in-room verifications, the initiator is who sent the `m.key.verification.request` event.
   * For to-device verifications, the initiator is who sent the `m.key.verification.start` event.
   */
  get initiatedByMe() {
    return this.inner.weStarted();
  }

  /** The user id of the other party in this request */
  get otherUserId() {
    return this.inner.otherUserId.toString();
  }

  /** For verifications via to-device messages: the ID of the other device. Otherwise, undefined. */
  get otherDeviceId() {
    var _this$inner$otherDevi;
    return (_this$inner$otherDevi = this.inner.otherDeviceId) === null || _this$inner$otherDevi === void 0 ? void 0 : _this$inner$otherDevi.toString();
  }

  /** Get the other device involved in the verification, if it is known */
  getOtherDevice() {
    var _this = this;
    return _asyncToGenerator(function* () {
      var otherDeviceId = _this.inner.otherDeviceId;
      if (!otherDeviceId) {
        return undefined;
      }
      return yield _this.olmMachine.getDevice(_this.inner.otherUserId, otherDeviceId, 5);
    })();
  }

  /** True if the other party in this request is one of this user's own devices. */
  get isSelfVerification() {
    return this.inner.isSelfVerification();
  }

  /** current phase of the request. */
  get phase() {
    var phase = this.inner.phase();
    switch (phase) {
      case RustSdkCryptoJs.VerificationRequestPhase.Created:
      case RustSdkCryptoJs.VerificationRequestPhase.Requested:
        return VerificationPhase.Requested;
      case RustSdkCryptoJs.VerificationRequestPhase.Ready:
        // if we're still sending the `m.key.verification.ready`, that counts as "Requested" in the js-sdk's
        // parlance.
        return this._accepting ? VerificationPhase.Requested : VerificationPhase.Ready;
      case RustSdkCryptoJs.VerificationRequestPhase.Transitioned:
        if (!this._verifier) {
          // this shouldn't happen, because the onChange handler should have created a _verifier.
          throw new Error("VerificationRequest: inner phase == Transitioned but no verifier!");
        }
        return this._verifier.verificationPhase;
      case RustSdkCryptoJs.VerificationRequestPhase.Done:
        return VerificationPhase.Done;
      case RustSdkCryptoJs.VerificationRequestPhase.Cancelled:
        return VerificationPhase.Cancelled;
    }
    throw new Error("Unknown verification phase ".concat(phase));
  }

  /** True if the request has sent its initial event and needs more events to complete
   * (ie it is in phase `Requested`, `Ready` or `Started`).
   */
  get pending() {
    if (this.inner.isPassive()) return false;
    var phase = this.phase;
    return phase !== VerificationPhase.Done && phase !== VerificationPhase.Cancelled;
  }

  /**
   * True if we have started the process of sending an `m.key.verification.ready` (but have not necessarily received
   * the remote echo which causes a transition to {@link VerificationPhase.Ready}.
   */
  get accepting() {
    return this._accepting;
  }

  /**
   * True if we have started the process of sending an `m.key.verification.cancel` (but have not necessarily received
   * the remote echo which causes a transition to {@link VerificationPhase.Cancelled}).
   */
  get declining() {
    return this._cancelling;
  }

  /**
   * The remaining number of ms before the request will be automatically cancelled.
   *
   * `null` indicates that there is no timeout
   */
  get timeout() {
    return this.inner.timeRemainingMillis();
  }

  /** once the phase is Started (and !initiatedByMe) or Ready: common methods supported by both sides */
  get methods() {
    throw new Error("not implemented");
  }

  /** the method picked in the .start event */
  get chosenMethod() {
    if (this.phase !== VerificationPhase.Started) return null;
    var verification = this.inner.getVerification();
    if (verification instanceof RustSdkCryptoJs.Sas) {
      return VerificationMethod.Sas;
    } else if (verification instanceof RustSdkCryptoJs.Qr) {
      return VerificationMethod.Reciprocate;
    } else {
      return null;
    }
  }

  /**
   * Checks whether the other party supports a given verification method.
   * This is useful when setting up the QR code UI, as it is somewhat asymmetrical:
   * if the other party supports SCAN_QR, we should show a QR code in the UI, and vice versa.
   * For methods that need to be supported by both ends, use the `methods` property.
   *
   * @param method - the method to check
   * @returns true if the other party said they supported the method
   */
  otherPartySupportsMethod(method) {
    var theirMethods = this.inner.theirSupportedMethods;
    if (theirMethods === undefined) {
      // no message from the other side yet
      return false;
    }
    var requiredMethod = verificationMethodsByIdentifier[method];
    return theirMethods.some(m => m === requiredMethod);
  }

  /**
   * Accepts the request, sending a .ready event to the other party
   *
   * @returns Promise which resolves when the event has been sent.
   */
  accept() {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      if (_this2.inner.phase() !== RustSdkCryptoJs.VerificationRequestPhase.Requested || _this2._accepting) {
        throw new Error("Cannot accept a verification request in phase ".concat(_this2.phase));
      }
      _this2._accepting = true;
      try {
        var req = _this2.inner.acceptWithMethods(_this2.supportedVerificationMethods.map(verificationMethodIdentifierToMethod));
        if (req) {
          yield _this2.outgoingRequestProcessor.makeOutgoingRequest(req);
        }
      } finally {
        _this2._accepting = false;
      }

      // phase may have changed, so emit a 'change' event
      _this2.emit(VerificationRequestEvent.Change);
    })();
  }

  /**
   * Cancels the request, sending a cancellation to the other party
   *
   * @param params - Details for the cancellation, including `reason` (defaults to "User declined"), and `code`
   *    (defaults to `m.user`).
   *
   * @returns Promise which resolves when the event has been sent.
   */
  cancel(params) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      if (_this3._cancelling) {
        // already cancelling; do nothing
        return;
      }
      _this3.logger.info("Cancelling verification request with params:", params);
      _this3._cancelling = true;
      try {
        var req = _this3.inner.cancel();
        if (req) {
          yield _this3.outgoingRequestProcessor.makeOutgoingRequest(req);
        }
      } finally {
        _this3._cancelling = false;
      }
    })();
  }

  /**
   * Create a {@link Verifier} to do this verification via a particular method.
   *
   * If a verifier has already been created for this request, returns that verifier.
   *
   * This does *not* send the `m.key.verification.start` event - to do so, call {@link Verifier#verifier} on the
   * returned verifier.
   *
   * If no previous events have been sent, pass in `targetDevice` to set who to direct this request to.
   *
   * @param method - the name of the verification method to use.
   * @param targetDevice - details of where to send the request to.
   *
   * @returns The verifier which will do the actual verification.
   */
  beginKeyVerification(method, targetDevice) {
    throw new Error("not implemented");
  }

  /**
   * Send an `m.key.verification.start` event to start verification via a particular method.
   *
   * Implementation of {@link Crypto.VerificationRequest#startVerification}.
   *
   * @param method - the name of the verification method to use.
   */
  startVerification(method) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      if (method !== VerificationMethod.Sas) {
        throw new Error("Unsupported verification method ".concat(method));
      }

      // make sure that we have a list of the other user's devices (workaround https://github.com/matrix-org/matrix-rust-sdk/issues/2896)
      if (!(yield _this4.getOtherDevice())) {
        throw new Error("startVerification(): other device is unknown");
      }
      var res = yield _this4.inner.startSas();
      if (res) {
        var [, req] = res;
        yield _this4.outgoingRequestProcessor.makeOutgoingRequest(req);
      }

      // this should have triggered the onChange callback, and we should now have a verifier
      if (!_this4._verifier) {
        throw new Error("Still no verifier after startSas() call");
      }
      return _this4._verifier;
    })();
  }

  /**
   * Start a QR code verification by providing a scanned QR code for this verification flow.
   *
   * Implementation of {@link Crypto.VerificationRequest#scanQRCode}.
   *
   * @param qrCodeData - the decoded QR code.
   * @returns A verifier; call `.verify()` on it to wait for the other side to complete the verification flow.
   */
  scanQRCode(uint8Array) {
    var _this5 = this;
    return _asyncToGenerator(function* () {
      var scan = RustSdkCryptoJs.QrCodeScan.fromBytes(uint8Array);
      var verifier = yield _this5.inner.scanQrCode(scan);

      // this should have triggered the onChange callback, and we should now have a verifier
      if (!_this5._verifier) {
        throw new Error("Still no verifier after scanQrCode() call");
      }

      // we can immediately trigger the reciprocate request
      var req = verifier.reciprocate();
      if (req) {
        yield _this5.outgoingRequestProcessor.makeOutgoingRequest(req);
      }
      return _this5._verifier;
    })();
  }

  /**
   * The verifier which is doing the actual verification, once the method has been established.
   * Only defined when the `phase` is Started.
   */
  get verifier() {
    // It's possible for us to have a Verifier before a method has been chosen (in particular,
    // if we are showing a QR code which the other device has not yet scanned. At that point, we could
    // still switch to SAS).
    //
    // In that case, we should not return it to the application yet, since the application will not expect the
    // Verifier to be replaced during the lifetime of the VerificationRequest.
    return this.phase === VerificationPhase.Started ? this._verifier : undefined;
  }

  /**
   * Stub implementation of {@link Crypto.VerificationRequest#getQRCodeBytes}.
   */
  getQRCodeBytes() {
    throw new Error("getQRCodeBytes() unsupported in Rust Crypto; use generateQRCode() instead.");
  }

  /**
   * Generate the data for a QR code allowing the other device to verify this one, if it supports it.
   *
   * Implementation of {@link Crypto.VerificationRequest#generateQRCode}.
   */
  generateQRCode() {
    var _this6 = this;
    return _asyncToGenerator(function* () {
      // make sure that we have a list of the other user's devices (workaround https://github.com/matrix-org/matrix-rust-sdk/issues/2896)
      if (!(yield _this6.getOtherDevice())) {
        throw new Error("generateQRCode(): other device is unknown");
      }
      var innerVerifier = yield _this6.inner.generateQrCode();
      // If we are unable to generate a QRCode, we return undefined
      if (!innerVerifier) return;
      return innerVerifier.toBytes();
    })();
  }

  /**
   * If this request has been cancelled, the cancellation code (e.g `m.user`) which is responsible for cancelling
   * this verification.
   */
  get cancellationCode() {
    var _this$inner$cancelInf, _this$inner$cancelInf2;
    return (_this$inner$cancelInf = (_this$inner$cancelInf2 = this.inner.cancelInfo) === null || _this$inner$cancelInf2 === void 0 ? void 0 : _this$inner$cancelInf2.cancelCode()) !== null && _this$inner$cancelInf !== void 0 ? _this$inner$cancelInf : null;
  }

  /**
   * The id of the user that cancelled the request.
   *
   * Only defined when phase is Cancelled
   */
  get cancellingUserId() {
    var cancelInfo = this.inner.cancelInfo;
    if (!cancelInfo) {
      return undefined;
    } else if (cancelInfo.cancelledbyUs()) {
      return this.olmMachine.userId.toString();
    } else {
      return this.inner.otherUserId.toString();
    }
  }
}

/** Common base class for `Verifier` implementations which wrap rust classes.
 *
 * The generic parameter `InnerType` is the type of the rust Verification class which we wrap.
 *
 * @internal
 */
class BaseRustVerifer extends TypedEventEmitter {
  constructor(inner, outgoingRequestProcessor) {
    super();
    this.inner = inner;
    this.outgoingRequestProcessor = outgoingRequestProcessor;
    /** A deferred which completes when the verification completes (or rejects when it is cancelled/fails) */
    _defineProperty(this, "completionDeferred", void 0);
    this.completionDeferred = Promise.withResolvers();

    // As with RustVerificationRequest, we need to avoid a reference cycle.
    // See the comments in RustVerificationRequest.
    var weakThis = new WeakRef(this);
    inner.registerChangesCallback(/*#__PURE__*/_asyncToGenerator(function* () {
      var _weakThis$deref2;
      return (_weakThis$deref2 = weakThis.deref()) === null || _weakThis$deref2 === void 0 ? void 0 : _weakThis$deref2.onChange();
    }));

    // stop the runtime complaining if nobody catches a failure
    this.completionDeferred.promise.catch(() => null);
  }

  /**
   * Hook which is called when the underlying rust class notifies us that there has been a change.
   *
   * Can be overridden by subclasses to see if we can notify the application about an update. The overriding method
   * must call `super.onChange()`.
   */
  onChange() {
    if (this.inner.isDone()) {
      this.completionDeferred.resolve(undefined);
    } else if (this.inner.isCancelled()) {
      var cancelInfo = this.inner.cancelInfo();
      this.completionDeferred.reject(new Error("Verification cancelled by ".concat(cancelInfo.cancelledbyUs() ? "us" : "them", " with code ").concat(cancelInfo.cancelCode(), ": ").concat(cancelInfo.reason())));
    }
    this.emit(VerificationRequestEvent.Change);
  }

  /**
   * Returns true if the verification has been cancelled, either by us or the other side.
   */
  get hasBeenCancelled() {
    return this.inner.isCancelled();
  }

  /**
   * The ID of the other user in the verification process.
   */
  get userId() {
    return this.inner.otherUserId.toString();
  }

  /**
   * Cancel a verification.
   *
   * We will send an `m.key.verification.cancel` if the verification is still in flight. The verification promise
   * will reject, and a {@link Crypto.VerifierEvent#Cancel} will be emitted.
   *
   * @param e - the reason for the cancellation.
   */
  cancel(e) {
    // TODO: something with `e`
    var req = this.inner.cancel();
    if (req) {
      this.outgoingRequestProcessor.makeOutgoingRequest(req);
    }
  }

  /**
   * Get the details for an SAS verification, if one is in progress
   *
   * Returns `null`, unless this verifier is for a SAS-based verification and we are waiting for the user to confirm
   * the SAS matches.
   */
  getShowSasCallbacks() {
    return null;
  }

  /**
   * Get the details for reciprocating QR code verification, if one is in progress
   *
   * Returns `null`, unless this verifier is for reciprocating a QR-code-based verification (ie, the other user has
   * already scanned our QR code), and we are waiting for the user to confirm.
   */
  getReciprocateQrCodeCallbacks() {
    return null;
  }
}

/** A Verifier instance which is used to show and/or scan a QR code. */
export class RustQrCodeVerifier extends BaseRustVerifer {
  constructor(inner, outgoingRequestProcessor) {
    super(inner, outgoingRequestProcessor);
    _defineProperty(this, "callbacks", null);
  }
  onChange() {
    // if the other side has scanned our QR code and sent us a "reciprocate" message, it is now time for the
    // application to prompt the user to confirm their side.
    if (this.callbacks === null && this.inner.hasBeenScanned()) {
      this.callbacks = {
        confirm: () => {
          this.confirmScanning();
        },
        cancel: () => this.cancel()
      };
    }
    super.onChange();
  }

  /**
   * Start the key verification, if it has not already been started.
   *
   * @returns Promise which resolves when the verification has completed, or rejects if the verification is cancelled
   *    or times out.
   */
  verify() {
    var _this7 = this;
    return _asyncToGenerator(function* () {
      // Some applications (hello, matrix-react-sdk) may not check if there is a `ShowQrCodeCallbacks` and instead
      // register a `ShowReciprocateQr` listener which they expect to be called once `.verify` is called.
      if (_this7.callbacks !== null) {
        _this7.emit(VerifierEvent.ShowReciprocateQr, _this7.callbacks);
      }
      // Nothing to do here but wait.
      yield _this7.completionDeferred.promise;
    })();
  }

  /**
   * Calculate an appropriate VerificationPhase for a VerificationRequest where this is the verifier.
   *
   * This is abnormally complicated because a rust-side QR Code verifier can span several verification phases.
   */
  get verificationPhase() {
    switch (this.inner.state()) {
      case QrState.Created:
        // we have created a QR for display; neither side has yet sent an `m.key.verification.start`.
        return VerificationPhase.Ready;
      case QrState.Scanned:
        // other side has scanned our QR and sent an `m.key.verification.start` with `m.reciprocate.v1`
        return VerificationPhase.Started;
      case QrState.Confirmed:
        // we have confirmed the other side's scan and sent an `m.key.verification.done`.
        //
        // However, the verification is not yet "Done", because we have to wait until we have received the
        // `m.key.verification.done` from the other side (in particular, we don't mark the device/identity as
        // verified until that happens). If we return "Done" too soon, we risk the user cancelling the flow.
        return VerificationPhase.Started;
      case QrState.Reciprocated:
        // although the rust SDK doesn't immediately send the `m.key.verification.start` on transition into this
        // state, `RustVerificationRequest.scanQrCode` immediately calls `reciprocate()` and does so, so in practice
        // we can treat the two the same.
        return VerificationPhase.Started;
      case QrState.Done:
        return VerificationPhase.Done;
      case QrState.Cancelled:
        return VerificationPhase.Cancelled;
      default:
        throw new Error("Unknown qr code state ".concat(this.inner.state()));
    }
  }

  /**
   * Get the details for reciprocating QR code verification, if one is in progress
   *
   * Returns `null`, unless this verifier is for reciprocating a QR-code-based verification (ie, the other user has
   * already scanned our QR code), and we are waiting for the user to confirm.
   */
  getReciprocateQrCodeCallbacks() {
    return this.callbacks;
  }
  confirmScanning() {
    var _this8 = this;
    return _asyncToGenerator(function* () {
      var req = _this8.inner.confirmScanning();
      if (req) {
        yield _this8.outgoingRequestProcessor.makeOutgoingRequest(req);
      }
    })();
  }
}

/** A Verifier instance which is used if we are exchanging emojis */
export class RustSASVerifier extends BaseRustVerifer {
  constructor(inner, _verificationRequest, outgoingRequestProcessor) {
    super(inner, outgoingRequestProcessor);
    _defineProperty(this, "callbacks", null);
  }

  /**
   * Start the key verification, if it has not already been started.
   *
   * This means sending a `m.key.verification.start` if we are the first responder, or a `m.key.verification.accept`
   * if the other side has already sent a start event.
   *
   * @returns Promise which resolves when the verification has completed, or rejects if the verification is cancelled
   *    or times out.
   */
  verify() {
    var _this9 = this;
    return _asyncToGenerator(function* () {
      yield _this9.sendAccept();
      yield _this9.completionDeferred.promise;
    })();
  }

  /**
   * Send the accept or start event, if it hasn't already been sent
   */
  sendAccept() {
    var _this0 = this;
    return _asyncToGenerator(function* () {
      var req = _this0.inner.accept();
      if (req) {
        yield _this0.outgoingRequestProcessor.makeOutgoingRequest(req);
      }
    })();
  }

  /** if we can now show the callbacks, do so */
  onChange() {
    var _this1 = this;
    super.onChange();
    if (this.callbacks === null) {
      var emoji = this.inner.emoji();
      var decimal = this.inner.decimals();
      if (emoji === undefined && decimal === undefined) {
        return;
      }
      var sas = {};
      if (emoji) {
        sas.emoji = emoji.map(e => [e.symbol, e.description]);
      }
      if (decimal) {
        sas.decimal = [decimal[0], decimal[1], decimal[2]];
      }
      this.callbacks = {
        sas,
        confirm: function () {
          var _confirm = _asyncToGenerator(function* () {
            var requests = yield _this1.inner.confirm();
            for (var m of requests) {
              yield _this1.outgoingRequestProcessor.makeOutgoingRequest(m);
            }
          });
          function confirm() {
            return _confirm.apply(this, arguments);
          }
          return confirm;
        }(),
        mismatch: () => {
          var request = this.inner.cancelWithCode("m.mismatched_sas");
          if (request) {
            this.outgoingRequestProcessor.makeOutgoingRequest(request);
          }
        },
        cancel: () => {
          var request = this.inner.cancelWithCode("m.user");
          if (request) {
            this.outgoingRequestProcessor.makeOutgoingRequest(request);
          }
        }
      };
      this.emit(VerifierEvent.ShowSas, this.callbacks);
    }
  }

  /**
   * Calculate an appropriate VerificationPhase for a VerificationRequest where this is the verifier.
   */
  get verificationPhase() {
    return VerificationPhase.Started;
  }

  /**
   * Get the details for an SAS verification, if one is in progress
   *
   * Returns `null`, unless this verifier is for a SAS-based verification and we are waiting for the user to confirm
   * the SAS matches.
   */
  getShowSasCallbacks() {
    return this.callbacks;
  }

  /**
   * Replace the inner Rust verifier with a different one.
   *
   * @param inner - the new Rust verifier
   * @internal
   */
  replaceInner(inner) {
    if (this.inner != inner) {
      this.inner = inner;

      // As with RustVerificationRequest, we need to avoid a reference cycle.
      // See the comments in RustVerificationRequest.
      var weakThis = new WeakRef(this);
      inner.registerChangesCallback(/*#__PURE__*/_asyncToGenerator(function* () {
        var _weakThis$deref3;
        return (_weakThis$deref3 = weakThis.deref()) === null || _weakThis$deref3 === void 0 ? void 0 : _weakThis$deref3.onChange();
      }));

      // replaceInner will only get called if we started the verification at the same time as the other side, and we lost
      // the tie breaker.  So we need to re-accept their verification.
      this.sendAccept();
      this.onChange();
    }
  }
}

/** For each specced verification method, the rust-side `VerificationMethod` corresponding to it */
var verificationMethodsByIdentifier = {
  [VerificationMethod.Sas]: RustSdkCryptoJs.VerificationMethod.SasV1,
  [VerificationMethod.ScanQrCode]: RustSdkCryptoJs.VerificationMethod.QrCodeScanV1,
  [VerificationMethod.ShowQrCode]: RustSdkCryptoJs.VerificationMethod.QrCodeShowV1,
  [VerificationMethod.Reciprocate]: RustSdkCryptoJs.VerificationMethod.ReciprocateV1
};

/**
 * Convert a specced verification method identifier into a rust-side `VerificationMethod`.
 *
 * @param method - specced method identifier, for example `m.sas.v1`.
 * @returns Rust-side `VerificationMethod` corresponding to `method`.
 * @throws An error if the method is unknown.
 *
 * @internal
 */
export function verificationMethodIdentifierToMethod(method) {
  var meth = verificationMethodsByIdentifier[method];
  if (meth === undefined) {
    throw new Error("Unknown verification method ".concat(method));
  }
  return meth;
}

/**
 * Return true if the event's type matches that of an in-room verification event
 *
 * @param event - MatrixEvent
 * @returns
 *
 * @internal
 */
export function isVerificationEvent(event) {
  switch (event.getType()) {
    case EventType.KeyVerificationCancel:
    case EventType.KeyVerificationDone:
    case EventType.KeyVerificationMac:
    case EventType.KeyVerificationStart:
    case EventType.KeyVerificationKey:
    case EventType.KeyVerificationReady:
    case EventType.KeyVerificationAccept:
      return true;
    case EventType.RoomMessage:
      return event.getContent().msgtype === MsgType.KeyVerificationRequest;
    default:
      return false;
  }
}
//# sourceMappingURL=verification.js.map