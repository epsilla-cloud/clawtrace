/**
 * An AES-encrypted secret storage payload.
 * See https://spec.matrix.org/v1.11/client-server-api/#msecret_storagev1aes-hmac-sha2-1
 */
export interface AESEncryptedSecretStoragePayload {
    [key: string]: any;
    /** the initialization vector in base64 */
    iv: string;
    /** the ciphertext in base64 */
    ciphertext: string;
    /** the HMAC in base64 */
    mac: string;
}
//# sourceMappingURL=AESEncryptedSecretStoragePayload.d.ts.map