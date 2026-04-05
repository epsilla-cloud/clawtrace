/**
 * Derive a recovery key from a passphrase and salt using PBKDF2.
 * @see https://spec.matrix.org/v1.11/client-server-api/#deriving-keys-from-passphrases
 *
 * @param passphrase - The passphrase to derive the key from
 * @param salt - The salt to use in the derivation
 * @param iterations - The number of iterations to use in the derivation
 * @param numBits - The number of bits to derive
 */
export declare function deriveRecoveryKeyFromPassphrase(passphrase: string, salt: string, iterations: number, numBits?: number): Promise<Uint8Array<ArrayBuffer>>;
//# sourceMappingURL=key-passphrase.d.ts.map