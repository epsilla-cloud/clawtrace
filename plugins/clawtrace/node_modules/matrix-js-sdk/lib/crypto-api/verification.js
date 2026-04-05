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
 * An incoming, or outgoing, request to verify a user or a device via cross-signing.
 */

/** Events emitted by {@link VerificationRequest}. */
export var VerificationRequestEvent = /*#__PURE__*/function (VerificationRequestEvent) {
  /**
   * Fires whenever the state of the request object has changed.
   *
   * There is no payload to the event.
   */
  VerificationRequestEvent["Change"] = "change";
  return VerificationRequestEvent;
}({});

/**
 * Listener type map for {@link VerificationRequestEvent}s.
 *
 * @internal
 */

/** The current phase of a verification request. */
export var VerificationPhase = /*#__PURE__*/function (VerificationPhase) {
  /** Initial state: no event yet exchanged */
  VerificationPhase[VerificationPhase["Unsent"] = 1] = "Unsent";
  /** An `m.key.verification.request` event has been sent or received */
  VerificationPhase[VerificationPhase["Requested"] = 2] = "Requested";
  /** An `m.key.verification.ready` event has been sent or received, indicating the verification request is accepted. */
  VerificationPhase[VerificationPhase["Ready"] = 3] = "Ready";
  /**
   * The verification is in flight.
   *
   * This means that an `m.key.verification.start` event has been sent or received, choosing a verification method;
   * however the verification has not yet completed or been cancelled.
   */
  VerificationPhase[VerificationPhase["Started"] = 4] = "Started";
  /**
   * An `m.key.verification.cancel` event has been sent or received at any time before the `done` event, cancelling
   * the verification request
   */
  VerificationPhase[VerificationPhase["Cancelled"] = 5] = "Cancelled";
  /**
   * The verification request is complete.
   *
   * Normally this means that `m.key.verification.done` events have been sent and received.
   */
  VerificationPhase[VerificationPhase["Done"] = 6] = "Done";
  return VerificationPhase;
}({});

/**
 * A `Verifier` is responsible for performing the verification using a particular method, such as via QR code or SAS
 * (emojis).
 *
 * A verifier object can be created by calling `VerificationRequest.beginVerification`; one is also created
 * automatically when a `m.key.verification.start` event is received for an existing VerificationRequest.
 *
 * Once a verifier object is created, the verification can be started by calling the {@link Verifier#verify} method.
 */

/** Events emitted by {@link Verifier} */
export var VerifierEvent = /*#__PURE__*/function (VerifierEvent) {
  /**
   * The verification has been cancelled, by us or the other side.
   *
   * The payload is either an {@link Error}, or an (incoming or outgoing) {@link MatrixEvent}, depending on
   * unspecified reasons.
   */
  VerifierEvent["Cancel"] = "cancel";
  /**
   * SAS data has been exchanged and should be displayed to the user.
   *
   * The payload is the {@link ShowSasCallbacks} object.
   */
  VerifierEvent["ShowSas"] = "show_sas";
  /**
   * The user should confirm if the other side has scanned our QR code.
   *
   * The payload is the {@link ShowQrCodeCallbacks} object.
   */
  VerifierEvent["ShowReciprocateQr"] = "show_reciprocate_qr";
  return VerifierEvent;
}({});

/** Listener type map for {@link VerifierEvent}s. */

/**
 * Callbacks for user actions to confirm that the other side has scanned our QR code.
 *
 * This is exposed as the payload of a `VerifierEvent.ShowReciprocateQr` event, or can be retrieved directly from the
 * verifier as `reciprocateQREvent`.
 */

/**
 * Callbacks for user actions while a SAS is displayed.
 *
 * This is exposed as the payload of a `VerifierEvent.ShowSas` event, or directly from the verifier as `sasEvent`.
 */

/** A generated SAS to be shown to the user, in alternative formats */

/**
 * An emoji for the generated SAS. A tuple `[emoji, name]` where `emoji` is the emoji itself and `name` is the
 * English name.
 */

/**
 * True if the request is in a state where it can be accepted (ie, that we're in phases {@link VerificationPhase.Unsent}
 * or {@link VerificationPhase.Requested}, and that we're not in the process of sending a `ready` or `cancel`).
 */
export function canAcceptVerificationRequest(req) {
  return req.phase < VerificationPhase.Ready && !req.accepting && !req.declining;
}
//# sourceMappingURL=verification.js.map