export type RendezvousFailureListener = (reason: RendezvousFailureReason) => void;
export type RendezvousFailureReason = MSC4108FailureReason | ClientRendezvousFailureReason;
export declare enum MSC4108FailureReason {
    AuthorizationExpired = "authorization_expired",
    DeviceAlreadyExists = "device_already_exists",
    DeviceNotFound = "device_not_found",
    UnexpectedMessageReceived = "unexpected_message_received",
    UnsupportedProtocol = "unsupported_protocol",
    UserCancelled = "user_cancelled"
}
export declare enum ClientRendezvousFailureReason {
    /** The sign in request has expired */
    Expired = "expired",
    /** The homeserver is lacking support for the required features */
    HomeserverLacksSupport = "homeserver_lacks_support",
    /** The secure channel verification failed meaning that it might be compromised */
    InsecureChannelDetected = "insecure_channel_detected",
    /** An invalid/incompatible QR code was scanned */
    InvalidCode = "invalid_code",
    /** The other device is not signed in */
    OtherDeviceNotSignedIn = "other_device_not_signed_in",
    /** The other device is already signed in */
    OtherDeviceAlreadySignedIn = "other_device_already_signed_in",
    /** Other */
    Unknown = "unknown",
    /** The user declined the sign in request */
    UserDeclined = "user_declined",
    /** The rendezvous request is missing an ETag header */
    ETagMissing = "etag_missing"
}
//# sourceMappingURL=RendezvousFailureReason.d.ts.map