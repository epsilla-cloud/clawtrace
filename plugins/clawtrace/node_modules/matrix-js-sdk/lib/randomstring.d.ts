/**
 * String representing the lowercase latin alphabet for use in {@link secureRandomStringFrom}
 * (can be combined with other such exports or other characters by appending strings)
 */
export declare const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
/**
 * String representing the uppercase latin alphabet for use in secureRandomStringFrom
 * (can be combined with other such exports or other characters by appending strings)
 */
export declare const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/**
 * String representing the arabic numerals for use in secureRandomStringFrom
 * (can be combined with other such exports or other characters by appending strings)
 */
export declare const DIGITS = "0123456789";
export declare function secureRandomBase64Url(len: number): string;
/**
 * Generates a random string of uppercase and lowercase letters plus digits using a
 * cryptographically secure random number generator.
 * @param len The length of the string to generate
 * @returns Random string of uppercase and lowercase letters plus digits of length `len`
 */
export declare function secureRandomString(len: number): string;
/**
 * Generate a cryptographically secure random string using characters given.
 *
 * @param len - The length of the string to generate (must be positive and less than 32768).
 * @param chars - The characters to use in the random string (between 2 and 256 characters long).
 * @returns Random string of characters of length `len`.
 */
export declare function secureRandomStringFrom(len: number, chars: string): string;
//# sourceMappingURL=randomstring.d.ts.map