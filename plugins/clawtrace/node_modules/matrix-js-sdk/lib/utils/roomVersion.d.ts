/**
 * Checks if the given room version is one where new "hydra" power level
 * semantics (ie. room version 12 or later) should be used
 * (see https://github.com/matrix-org/matrix-spec-proposals/pull/4289).
 * This will return `false` for versions that are known to the js-sdk and
 * do not use hydra: any room versions unknown to the js-sdk (experimental or
 * otherwise) will cause the function to return true.
 *
 * @param roomVersion - The version of the room to check.
 * @returns `true` if hydra semantics should be used for the room version, `false` otherwise.
 */
export declare function shouldUseHydraForRoomVersion(roomVersion: string): boolean;
//# sourceMappingURL=roomVersion.d.ts.map