import { ClientRendezvousFailureReason, MSC4108FailureReason, type RendezvousFailureListener } from "./index.ts";
import { type MatrixClient } from "../client.ts";
import { type MSC4108SecureChannel } from "./channels/MSC4108SecureChannel.ts";
import { type CryptoApi } from "../crypto-api/index.ts";
/**
 * Enum representing the payload types transmissible over [MSC4108](https://github.com/matrix-org/matrix-spec-proposals/pull/4108)
 * secure channels.
 * @experimental Note that this is UNSTABLE and may have breaking changes without notice.
 */
export declare enum PayloadType {
    Protocols = "m.login.protocols",
    Protocol = "m.login.protocol",
    Failure = "m.login.failure",
    Success = "m.login.success",
    Secrets = "m.login.secrets",
    ProtocolAccepted = "m.login.protocol_accepted",
    Declined = "m.login.declined"
}
/**
 * Type representing the base payload format for [MSC4108](https://github.com/matrix-org/matrix-spec-proposals/pull/4108)
 * messages sent over the secure channel.
 * @experimental Note that this is UNSTABLE and may have breaking changes without notice.
 */
export interface MSC4108Payload {
    type: PayloadType;
}
interface SecretsPayload extends MSC4108Payload, Awaited<ReturnType<NonNullable<CryptoApi["exportSecretsBundle"]>>> {
    type: PayloadType.Secrets;
}
/**
 * Prototype of the unstable [MSC4108](https://github.com/matrix-org/matrix-spec-proposals/pull/4108)
 * sign in with QR + OIDC flow.
 * @experimental Note that this is UNSTABLE and may have breaking changes without notice.
 */
export declare class MSC4108SignInWithQR {
    private readonly channel;
    private readonly didScanCode;
    private readonly client?;
    onFailure?: RendezvousFailureListener | undefined;
    private readonly ourIntent;
    private _code?;
    private expectingNewDeviceId?;
    /**
     * Returns the check code for the secure channel or undefined if not generated yet.
     */
    get checkCode(): string | undefined;
    /**
     * @param channel - The secure channel used for communication
     * @param client - The Matrix client in used on the device already logged in
     * @param didScanCode - Whether this side of the channel scanned the QR code from the other party
     * @param onFailure - Callback for when the rendezvous fails
     */
    constructor(channel: MSC4108SecureChannel, didScanCode: boolean, client?: MatrixClient | undefined, onFailure?: RendezvousFailureListener | undefined);
    /**
     * Returns the code representing the rendezvous suitable for rendering in a QR code or undefined if not generated yet.
     */
    get code(): Uint8Array | undefined;
    /**
     * Generate the code including doing partial set up of the channel where required.
     */
    generateCode(): Promise<void>;
    /**
     * Returns true if the device is the already logged in device reciprocating a new login on the other side of the channel.
     */
    get isExistingDevice(): boolean;
    /**
     * Returns true if the device is the new device logging in being reciprocated by the device on the other side of the channel.
     */
    get isNewDevice(): boolean;
    /**
     * The first step in the OIDC QR login process.
     * To be called after the QR code has been rendered or scanned.
     * The scanning device has to discover the homeserver details, if they scanned the code then they already have it.
     * If the new device is the one rendering the QR code then it has to wait be sent the homeserver details via the rendezvous channel.
     */
    negotiateProtocols(): Promise<{
        serverName?: string;
    }>;
    /**
     * The second & third step in the OIDC QR login process.
     * To be called after `negotiateProtocols` for the existing device.
     * To be called after OIDC negotiation for the new device. (Currently unsupported)
     */
    deviceAuthorizationGrant(): Promise<{
        verificationUri?: string;
        userCode?: string;
    }>;
    /**
     * The fifth (and final) step in the OIDC QR login process.
     * To be called after the new device has completed authentication.
     */
    shareSecrets(): Promise<{
        secrets?: Omit<SecretsPayload, "type">;
    }>;
    private receive;
    private send;
    /**
     * Decline the login on the existing device.
     */
    declineLoginOnExistingDevice(): Promise<void>;
    /**
     * Cancels the rendezvous session.
     * @param reason the reason for the cancellation
     */
    cancel(reason: MSC4108FailureReason | ClientRendezvousFailureReason): Promise<void>;
    /**
     * Closes the rendezvous session.
     */
    close(): Promise<void>;
}
export {};
//# sourceMappingURL=MSC4108SignInWithQR.d.ts.map