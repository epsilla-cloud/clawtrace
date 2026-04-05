import type { MatrixDeviceVerificationStatusLike } from "./types.js";
export declare function isMatrixDeviceLocallyVerified(status: MatrixDeviceVerificationStatusLike | null | undefined): boolean;
export declare function isMatrixDeviceOwnerVerified(status: MatrixDeviceVerificationStatusLike | null | undefined): boolean;
export declare function isMatrixDeviceVerifiedInCurrentClient(status: MatrixDeviceVerificationStatusLike | null | undefined): boolean;
