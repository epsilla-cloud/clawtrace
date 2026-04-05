/**
 * Encode a typed array of uint8 as base64.
 * @param uint8Array - The data to encode.
 * @returns The base64.
 */
export declare function encodeBase64(uint8Array: Uint8Array): string;
/**
 * Encode a typed array of uint8 as unpadded base64.
 * @param uint8Array - The data to encode.
 * @returns The unpadded base64.
 */
export declare function encodeUnpaddedBase64(uint8Array: Uint8Array): string;
/**
 * Encode a typed array of uint8 as unpadded base64 using the URL-safe encoding.
 * @param uint8Array - The data to encode.
 * @returns The unpadded base64.
 */
export declare function encodeUnpaddedBase64Url(uint8Array: Uint8Array): string;
/**
 * Decode a base64 (or base64url) string to a typed array of uint8.
 * @param base64 - The base64 to decode.
 * @returns The decoded data.
 */
export declare function decodeBase64(base64: string): Uint8Array<ArrayBuffer>;
//# sourceMappingURL=base64.d.ts.map