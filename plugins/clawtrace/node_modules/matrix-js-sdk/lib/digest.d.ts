/**
 * Computes a SHA-256 hash of a string (after utf-8 encoding) and returns it as an ArrayBuffer.
 *
 * @param plaintext The string to hash
 * @returns An Uint8Array containing the SHA-256 hash of the input string
 * @throws If the subtle crypto API is not available, for example if the code is running
 *         in a web page with an insecure context (eg. served over plain HTTP).
 */
export declare function sha256(plaintext: string): Promise<Uint8Array>;
//# sourceMappingURL=digest.d.ts.map