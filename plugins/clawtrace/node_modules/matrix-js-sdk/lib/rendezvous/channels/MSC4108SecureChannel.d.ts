import { type Curve25519PublicKey, QrCodeIntent } from "@matrix-org/matrix-sdk-crypto-wasm";
import { ClientRendezvousFailureReason, MSC4108FailureReason, type MSC4108Payload, type RendezvousFailureListener } from "../index.ts";
import { type MSC4108RendezvousSession } from "../transports/MSC4108RendezvousSession.ts";
/**
 * Prototype of the unstable [MSC4108](https://github.com/matrix-org/matrix-spec-proposals/pull/4108)
 * secure rendezvous session protocol.
 * @experimental Note that this is UNSTABLE and may have breaking changes without notice.
 * Imports @matrix-org/matrix-sdk-crypto-wasm so should be async-imported to avoid bundling the WASM into the main bundle.
 */
export declare class MSC4108SecureChannel {
    private rendezvousSession;
    private theirPublicKey?;
    onFailure?: RendezvousFailureListener | undefined;
    private readonly secureChannel;
    private establishedChannel?;
    private connected;
    constructor(rendezvousSession: MSC4108RendezvousSession, theirPublicKey?: Curve25519PublicKey | undefined, onFailure?: RendezvousFailureListener | undefined);
    /**
     * Generate a QR code for the current session.
     * @param mode the mode to generate the QR code in, either `Login` or `Reciprocate`.
     * @param serverName the name of the homeserver to connect to, as defined by server discovery in the spec, required for `Reciprocate` mode.
     */
    generateCode(mode: QrCodeIntent.Login): Promise<Uint8Array>;
    generateCode(mode: QrCodeIntent.Reciprocate, serverName: string): Promise<Uint8Array>;
    /**
     * Returns the check code for the secure channel or undefined if not generated yet.
     */
    getCheckCode(): string | undefined;
    /**
     * Connects and establishes a secure channel with the other device.
     */
    connect(): Promise<void>;
    private decrypt;
    private encrypt;
    /**
     * Sends a payload securely to the other device.
     * @param payload the payload to encrypt and send
     */
    secureSend<T extends MSC4108Payload>(payload: T): Promise<void>;
    /**
     * Receives an encrypted payload from the other device and decrypts it.
     */
    secureReceive<T extends MSC4108Payload>(): Promise<Partial<T> | undefined>;
    /**
     * Closes the secure channel.
     */
    close(): Promise<void>;
    /**
     * Cancels the secure channel.
     * @param reason the reason for the cancellation
     */
    cancel(reason: MSC4108FailureReason | ClientRendezvousFailureReason): Promise<void>;
    /**
     * Returns whether the rendezvous session has been cancelled.
     */
    get cancelled(): boolean;
}
//# sourceMappingURL=MSC4108SecureChannel.d.ts.map