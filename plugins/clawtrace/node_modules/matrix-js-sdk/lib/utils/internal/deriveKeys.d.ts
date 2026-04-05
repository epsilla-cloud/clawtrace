/**
 * Derive AES and HMAC keys from a master key.
 *
 * This is used for deriving secret storage keys: see https://spec.matrix.org/v1.11/client-server-api/#msecret_storagev1aes-hmac-sha2 (step 1).
 *
 * @param key
 * @param name
 */
export declare function deriveKeys(key: Uint8Array<ArrayBuffer>, name: string): Promise<[CryptoKey, CryptoKey]>;
//# sourceMappingURL=deriveKeys.d.ts.map