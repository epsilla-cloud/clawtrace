import { type Optional } from "matrix-events-sdk";
/**
 * Determines if the given optional was provided a value.
 * @param s - The optional to test.
 * @returns True if the value is defined.
 */
export declare function isProvided<T>(s: Optional<T>): s is T;
/**
 * Determines if the given optional string is a defined string.
 * @param s - The input string.
 * @returns True if the input is a defined string.
 */
export declare function isOptionalAString(s: Optional<string>): s is string;
//# sourceMappingURL=utilities.d.ts.map