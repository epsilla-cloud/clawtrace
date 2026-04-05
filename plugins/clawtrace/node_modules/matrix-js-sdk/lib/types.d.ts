export type * from "./@types/media.ts";
export * from "./@types/membership.ts";
export type * from "./@types/event.ts";
export type * from "./@types/events.ts";
export type * from "./@types/state_events.ts";
export type * from "./@types/AESEncryptedSecretStoragePayload.ts";
/** The different methods for device and user verification */
export declare enum VerificationMethod {
    /** Short authentication string (emoji or decimals).
     *
     * @see https://spec.matrix.org/v1.9/client-server-api/#short-authentication-string-sas-verification
     */
    Sas = "m.sas.v1",
    /**
     * Verification by showing a QR code which is scanned by the other device.
     *
     * @see https://spec.matrix.org/v1.9/client-server-api/#qr-codes
     */
    ShowQrCode = "m.qr_code.show.v1",
    /**
     * Verification by scanning a QR code that is shown by the other device.
     *
     * @see https://spec.matrix.org/v1.9/client-server-api/#qr-codes
     */
    ScanQrCode = "m.qr_code.scan.v1",
    /**
     * Verification by confirming that we have scanned a QR code.
     *
     * @see https://spec.matrix.org/v1.9/client-server-api/#qr-codes
     */
    Reciprocate = "m.reciprocate.v1"
}
//# sourceMappingURL=types.d.ts.map