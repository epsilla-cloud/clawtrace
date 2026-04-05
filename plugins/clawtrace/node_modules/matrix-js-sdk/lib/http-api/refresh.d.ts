import { type IHttpOpts } from "./interface.ts";
/**
 * This is an internal module. See {@link MatrixHttpApi} for the public class.
 */
export declare const enum TokenRefreshOutcome {
    Success = "success",
    Failure = "failure",
    Logout = "logout"
}
interface Snapshot {
    accessToken: string;
    refreshToken?: string;
    expiry?: Date;
}
type Opts = Pick<IHttpOpts, "tokenRefreshFunction" | "logger" | "refreshToken" | "accessToken">;
/**
 * This class is responsible for managing the access token and refresh token for authenticated requests.
 * It will automatically refresh the access token when it is about to expire, and will handle unknown token errors.
 */
export declare class TokenRefresher {
    private readonly opts;
    constructor(opts: Opts);
    /**
     * Promise used to block authenticated requests during a token refresh to avoid repeated expected errors.
     * @private
     */
    private tokenRefreshPromise?;
    private latestTokenRefreshExpiry?;
    /**
     * This function is called before every request to ensure that the access token is valid.
     * @returns a snapshot containing the access token and other properties which must be passed to the handleUnknownToken
     *     handler if an M_UNKNOWN_TOKEN error is encountered.
     */
    prepareForRequest(): Promise<Snapshot>;
    private refreshIfNeeded;
    /**
     * This function is called when an M_UNKNOWN_TOKEN error is encountered.
     * It will attempt to refresh the access token if it is unknown, and will return a TokenRefreshOutcome.
     * @param snapshot - the snapshot returned by prepareForRequest
     * @param attempt - the number of attempts made for this request so far
     * @returns a TokenRefreshOutcome indicating the result of the refresh attempt
     */
    handleUnknownToken(snapshot: Snapshot, attempt: number): Promise<TokenRefreshOutcome>;
    private _handleUnknownToken;
    /**
     * Attempt to refresh access tokens.
     * On success, sets new access and refresh tokens in opts.
     * @returns Promise that resolves to a boolean - true when token was refreshed successfully
     */
    private doTokenRefresh;
}
export {};
//# sourceMappingURL=refresh.d.ts.map