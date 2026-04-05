/**
 * Encode a recovery key using the Matrix {@link https://spec.matrix.org/v1.11/appendices/#cryptographic-key-representation | Cryptographic key representation}
 * @param key
 */
export declare function encodeRecoveryKey(key: ArrayLike<number>): string | undefined;
/**
 * Decode a recovery key encoded with the Matrix {@link https://spec.matrix.org/v1.11/appendices/#cryptographic-key-representation | Cryptographic key representation} encoding.
 * @param recoveryKey
 */
export declare function decodeRecoveryKey(recoveryKey: string): Uint8Array<ArrayBuffer>;
//# sourceMappingURL=recovery-key.d.ts.map