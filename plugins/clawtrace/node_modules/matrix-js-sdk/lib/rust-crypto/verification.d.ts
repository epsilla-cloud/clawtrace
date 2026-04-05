import * as RustSdkCryptoJs from "@matrix-org/matrix-sdk-crypto-wasm";
import { type ShowQrCodeCallbacks, type ShowSasCallbacks, VerificationPhase, type VerificationRequest, VerificationRequestEvent, type VerificationRequestEventHandlerMap, type Verifier, VerifierEvent, type VerifierEventHandlerMap } from "../crypto-api/verification.ts";
import { TypedEventEmitter } from "../models/typed-event-emitter.ts";
import { type OutgoingRequestProcessor } from "./OutgoingRequestProcessor.ts";
import { type MatrixEvent } from "../models/event.ts";
import type { Logger } from "../logger.ts";
/**
 * An incoming, or outgoing, request to verify a user or a device via cross-signing.
 *
 * @internal
 */
export declare class RustVerificationRequest extends TypedEventEmitter<VerificationRequestEvent, VerificationRequestEventHandlerMap> implements VerificationRequest {
    private readonly logger;
    private readonly olmMachine;
    private readonly inner;
    private readonly outgoingRequestProcessor;
    private readonly supportedVerificationMethods;
    /** a reëmitter which relays VerificationRequestEvent.Changed events emitted by the verifier */
    private readonly reEmitter;
    /** Are we in the process of sending an `m.key.verification.ready` event? */
    private _accepting;
    /** Are we in the process of sending an `m.key.verification.cancellation` event? */
    private _cancelling;
    private _verifier;
    /**
     * Construct a new RustVerificationRequest to wrap the rust-level `VerificationRequest`.
     *
     * @param logger - A logger instance which will be used to log events.
     * @param olmMachine - The `OlmMachine` from the underlying rust crypto sdk.
     * @param inner - VerificationRequest from the Rust SDK.
     * @param outgoingRequestProcessor - `OutgoingRequestProcessor` to use for making outgoing HTTP requests.
     * @param supportedVerificationMethods - Verification methods to use when `accept()` is called.
     */
    constructor(logger: Logger, olmMachine: RustSdkCryptoJs.OlmMachine, inner: RustSdkCryptoJs.VerificationRequest, outgoingRequestProcessor: OutgoingRequestProcessor, supportedVerificationMethods: string[]);
    /**
     * Hook which is called when the underlying rust class notifies us that there has been a change.
     */
    private onChange;
    private setVerifier;
    /**
     * Unique ID for this verification request.
     *
     * An ID isn't assigned until the first message is sent, so this may be `undefined` in the early phases.
     */
    get transactionId(): string | undefined;
    /**
     * For an in-room verification, the ID of the room.
     *
     * For to-device verifications, `undefined`.
     */
    get roomId(): string | undefined;
    /**
     * True if this request was initiated by the local client.
     *
     * For in-room verifications, the initiator is who sent the `m.key.verification.request` event.
     * For to-device verifications, the initiator is who sent the `m.key.verification.start` event.
     */
    get initiatedByMe(): boolean;
    /** The user id of the other party in this request */
    get otherUserId(): string;
    /** For verifications via to-device messages: the ID of the other device. Otherwise, undefined. */
    get otherDeviceId(): string | undefined;
    /** Get the other device involved in the verification, if it is known */
    private getOtherDevice;
    /** True if the other party in this request is one of this user's own devices. */
    get isSelfVerification(): boolean;
    /** current phase of the request. */
    get phase(): VerificationPhase;
    /** True if the request has sent its initial event and needs more events to complete
     * (ie it is in phase `Requested`, `Ready` or `Started`).
     */
    get pending(): boolean;
    /**
     * True if we have started the process of sending an `m.key.verification.ready` (but have not necessarily received
     * the remote echo which causes a transition to {@link VerificationPhase.Ready}.
     */
    get accepting(): boolean;
    /**
     * True if we have started the process of sending an `m.key.verification.cancel` (but have not necessarily received
     * the remote echo which causes a transition to {@link VerificationPhase.Cancelled}).
     */
    get declining(): boolean;
    /**
     * The remaining number of ms before the request will be automatically cancelled.
     *
     * `null` indicates that there is no timeout
     */
    get timeout(): number | null;
    /** once the phase is Started (and !initiatedByMe) or Ready: common methods supported by both sides */
    get methods(): string[];
    /** the method picked in the .start event */
    get chosenMethod(): string | null;
    /**
     * Checks whether the other party supports a given verification method.
     * This is useful when setting up the QR code UI, as it is somewhat asymmetrical:
     * if the other party supports SCAN_QR, we should show a QR code in the UI, and vice versa.
     * For methods that need to be supported by both ends, use the `methods` property.
     *
     * @param method - the method to check
     * @returns true if the other party said they supported the method
     */
    otherPartySupportsMethod(method: string): boolean;
    /**
     * Accepts the request, sending a .ready event to the other party
     *
     * @returns Promise which resolves when the event has been sent.
     */
    accept(): Promise<void>;
    /**
     * Cancels the request, sending a cancellation to the other party
     *
     * @param params - Details for the cancellation, including `reason` (defaults to "User declined"), and `code`
     *    (defaults to `m.user`).
     *
     * @returns Promise which resolves when the event has been sent.
     */
    cancel(params?: {
        reason?: string;
        code?: string;
    }): Promise<void>;
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
    beginKeyVerification(method: string, targetDevice?: {
        userId?: string;
        deviceId?: string;
    }): Verifier;
    /**
     * Send an `m.key.verification.start` event to start verification via a particular method.
     *
     * Implementation of {@link Crypto.VerificationRequest#startVerification}.
     *
     * @param method - the name of the verification method to use.
     */
    startVerification(method: string): Promise<Verifier>;
    /**
     * Start a QR code verification by providing a scanned QR code for this verification flow.
     *
     * Implementation of {@link Crypto.VerificationRequest#scanQRCode}.
     *
     * @param qrCodeData - the decoded QR code.
     * @returns A verifier; call `.verify()` on it to wait for the other side to complete the verification flow.
     */
    scanQRCode(uint8Array: Uint8ClampedArray): Promise<Verifier>;
    /**
     * The verifier which is doing the actual verification, once the method has been established.
     * Only defined when the `phase` is Started.
     */
    get verifier(): Verifier | undefined;
    /**
     * Stub implementation of {@link Crypto.VerificationRequest#getQRCodeBytes}.
     */
    getQRCodeBytes(): Uint8ClampedArray | undefined;
    /**
     * Generate the data for a QR code allowing the other device to verify this one, if it supports it.
     *
     * Implementation of {@link Crypto.VerificationRequest#generateQRCode}.
     */
    generateQRCode(): Promise<Uint8ClampedArray | undefined>;
    /**
     * If this request has been cancelled, the cancellation code (e.g `m.user`) which is responsible for cancelling
     * this verification.
     */
    get cancellationCode(): string | null;
    /**
     * The id of the user that cancelled the request.
     *
     * Only defined when phase is Cancelled
     */
    get cancellingUserId(): string | undefined;
}
/** Common base class for `Verifier` implementations which wrap rust classes.
 *
 * The generic parameter `InnerType` is the type of the rust Verification class which we wrap.
 *
 * @internal
 */
declare abstract class BaseRustVerifer<InnerType extends RustSdkCryptoJs.Qr | RustSdkCryptoJs.Sas> extends TypedEventEmitter<VerifierEvent | VerificationRequestEvent, VerifierEventHandlerMap & VerificationRequestEventHandlerMap> {
    protected inner: InnerType;
    protected readonly outgoingRequestProcessor: OutgoingRequestProcessor;
    /** A deferred which completes when the verification completes (or rejects when it is cancelled/fails) */
    protected readonly completionDeferred: PromiseWithResolvers<void>;
    constructor(inner: InnerType, outgoingRequestProcessor: OutgoingRequestProcessor);
    /**
     * Hook which is called when the underlying rust class notifies us that there has been a change.
     *
     * Can be overridden by subclasses to see if we can notify the application about an update. The overriding method
     * must call `super.onChange()`.
     */
    protected onChange(): void;
    /**
     * Returns true if the verification has been cancelled, either by us or the other side.
     */
    get hasBeenCancelled(): boolean;
    /**
     * The ID of the other user in the verification process.
     */
    get userId(): string;
    /**
     * Cancel a verification.
     *
     * We will send an `m.key.verification.cancel` if the verification is still in flight. The verification promise
     * will reject, and a {@link Crypto.VerifierEvent#Cancel} will be emitted.
     *
     * @param e - the reason for the cancellation.
     */
    cancel(e?: Error): void;
    /**
     * Get the details for an SAS verification, if one is in progress
     *
     * Returns `null`, unless this verifier is for a SAS-based verification and we are waiting for the user to confirm
     * the SAS matches.
     */
    getShowSasCallbacks(): ShowSasCallbacks | null;
    /**
     * Get the details for reciprocating QR code verification, if one is in progress
     *
     * Returns `null`, unless this verifier is for reciprocating a QR-code-based verification (ie, the other user has
     * already scanned our QR code), and we are waiting for the user to confirm.
     */
    getReciprocateQrCodeCallbacks(): ShowQrCodeCallbacks | null;
}
/** A Verifier instance which is used to show and/or scan a QR code. */
export declare class RustQrCodeVerifier extends BaseRustVerifer<RustSdkCryptoJs.Qr> implements Verifier {
    private callbacks;
    constructor(inner: RustSdkCryptoJs.Qr, outgoingRequestProcessor: OutgoingRequestProcessor);
    protected onChange(): void;
    /**
     * Start the key verification, if it has not already been started.
     *
     * @returns Promise which resolves when the verification has completed, or rejects if the verification is cancelled
     *    or times out.
     */
    verify(): Promise<void>;
    /**
     * Calculate an appropriate VerificationPhase for a VerificationRequest where this is the verifier.
     *
     * This is abnormally complicated because a rust-side QR Code verifier can span several verification phases.
     */
    get verificationPhase(): VerificationPhase;
    /**
     * Get the details for reciprocating QR code verification, if one is in progress
     *
     * Returns `null`, unless this verifier is for reciprocating a QR-code-based verification (ie, the other user has
     * already scanned our QR code), and we are waiting for the user to confirm.
     */
    getReciprocateQrCodeCallbacks(): ShowQrCodeCallbacks | null;
    private confirmScanning;
}
/** A Verifier instance which is used if we are exchanging emojis */
export declare class RustSASVerifier extends BaseRustVerifer<RustSdkCryptoJs.Sas> implements Verifier {
    private callbacks;
    constructor(inner: RustSdkCryptoJs.Sas, _verificationRequest: RustVerificationRequest, outgoingRequestProcessor: OutgoingRequestProcessor);
    /**
     * Start the key verification, if it has not already been started.
     *
     * This means sending a `m.key.verification.start` if we are the first responder, or a `m.key.verification.accept`
     * if the other side has already sent a start event.
     *
     * @returns Promise which resolves when the verification has completed, or rejects if the verification is cancelled
     *    or times out.
     */
    verify(): Promise<void>;
    /**
     * Send the accept or start event, if it hasn't already been sent
     */
    private sendAccept;
    /** if we can now show the callbacks, do so */
    protected onChange(): void;
    /**
     * Calculate an appropriate VerificationPhase for a VerificationRequest where this is the verifier.
     */
    get verificationPhase(): VerificationPhase;
    /**
     * Get the details for an SAS verification, if one is in progress
     *
     * Returns `null`, unless this verifier is for a SAS-based verification and we are waiting for the user to confirm
     * the SAS matches.
     */
    getShowSasCallbacks(): ShowSasCallbacks | null;
    /**
     * Replace the inner Rust verifier with a different one.
     *
     * @param inner - the new Rust verifier
     * @internal
     */
    replaceInner(inner: RustSdkCryptoJs.Sas): void;
}
/**
 * Convert a specced verification method identifier into a rust-side `VerificationMethod`.
 *
 * @param method - specced method identifier, for example `m.sas.v1`.
 * @returns Rust-side `VerificationMethod` corresponding to `method`.
 * @throws An error if the method is unknown.
 *
 * @internal
 */
export declare function verificationMethodIdentifierToMethod(method: string): RustSdkCryptoJs.VerificationMethod;
/**
 * Return true if the event's type matches that of an in-room verification event
 *
 * @param event - MatrixEvent
 * @returns
 *
 * @internal
 */
export declare function isVerificationEvent(event: MatrixEvent): boolean;
export {};
//# sourceMappingURL=verification.d.ts.map