export type NonEmptyArray<T> = [T, ...T[]];
export type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
export type Writeable<T> = {
    -readonly [P in keyof T]: T[P];
};
export type EmptyObject = Record<PropertyKey, never>;
//# sourceMappingURL=common.d.ts.map