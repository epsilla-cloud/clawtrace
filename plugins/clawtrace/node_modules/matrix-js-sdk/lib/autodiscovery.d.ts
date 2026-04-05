import { type IClientWellKnown, type IWellKnownConfig } from "./client.ts";
export declare enum AutoDiscoveryAction {
    SUCCESS = "SUCCESS",
    IGNORE = "IGNORE",
    PROMPT = "PROMPT",
    FAIL_PROMPT = "FAIL_PROMPT",
    FAIL_ERROR = "FAIL_ERROR"
}
export declare enum AutoDiscoveryError {
    Invalid = "Invalid homeserver discovery response",
    GenericFailure = "Failed to get autodiscovery configuration from server",
    InvalidHsBaseUrl = "Invalid base_url for m.homeserver",
    InvalidHomeserver = "Homeserver URL does not appear to be a valid Matrix homeserver",
    InvalidIsBaseUrl = "Invalid base_url for m.identity_server",
    InvalidIdentityServer = "Identity server URL does not appear to be a valid identity server",
    InvalidIs = "Invalid identity server discovery response",
    MissingWellknown = "No .well-known JSON file found",
    InvalidJson = "Invalid JSON",
    UnsupportedHomeserverSpecVersion = "The homeserver does not meet the version requirements"
}
interface AutoDiscoveryState {
    state: AutoDiscoveryAction;
    error?: IWellKnownConfig["error"] | null;
}
interface WellKnownConfig extends Omit<IWellKnownConfig, "error">, AutoDiscoveryState {
}
export interface ClientConfig extends Omit<IClientWellKnown, "m.homeserver" | "m.identity_server"> {
    "m.homeserver": WellKnownConfig;
    "m.identity_server": WellKnownConfig;
}
/**
 * Utilities for automatically discovery resources, such as homeservers
 * for users to log in to.
 */
export declare class AutoDiscovery {
    static readonly ERROR_INVALID = AutoDiscoveryError.Invalid;
    static readonly ERROR_GENERIC_FAILURE = AutoDiscoveryError.GenericFailure;
    static readonly ERROR_INVALID_HS_BASE_URL = AutoDiscoveryError.InvalidHsBaseUrl;
    static readonly ERROR_INVALID_HOMESERVER = AutoDiscoveryError.InvalidHomeserver;
    static readonly ERROR_INVALID_IS_BASE_URL = AutoDiscoveryError.InvalidIsBaseUrl;
    static readonly ERROR_INVALID_IDENTITY_SERVER = AutoDiscoveryError.InvalidIdentityServer;
    static readonly ERROR_INVALID_IS = AutoDiscoveryError.InvalidIs;
    static readonly ERROR_MISSING_WELLKNOWN = AutoDiscoveryError.MissingWellknown;
    static readonly ERROR_INVALID_JSON = AutoDiscoveryError.InvalidJson;
    static readonly ERROR_UNSUPPORTED_HOMESERVER_SPEC_VERSION = AutoDiscoveryError.UnsupportedHomeserverSpecVersion;
    static readonly ALL_ERRORS: AutoDiscoveryError[];
    /**
     * The auto discovery failed. The client is expected to communicate
     * the error to the user and refuse logging in.
     */
    static readonly FAIL_ERROR = AutoDiscoveryAction.FAIL_ERROR;
    /**
     * The auto discovery failed, however the client may still recover
     * from the problem. The client is recommended to that the same
     * action it would for PROMPT while also warning the user about
     * what went wrong. The client may also treat this the same as
     * a FAIL_ERROR state.
     */
    static readonly FAIL_PROMPT = AutoDiscoveryAction.FAIL_PROMPT;
    /**
     * The auto discovery didn't fail but did not find anything of
     * interest. The client is expected to prompt the user for more
     * information, or fail if it prefers.
     */
    static readonly PROMPT = AutoDiscoveryAction.PROMPT;
    /**
     * The auto discovery was successful.
     */
    static readonly SUCCESS = AutoDiscoveryAction.SUCCESS;
    /**
     * Validates and verifies client configuration information for purposes
     * of logging in. Such information includes the homeserver URL
     * and identity server URL the client would want. Additional details
     * may also be included, and will be transparently brought into the
     * response object unaltered.
     * @param wellknown - The configuration object itself, as returned
     * by the .well-known auto-discovery endpoint.
     * @returns Promise which resolves to the verified
     * configuration, which may include error states. Rejects on unexpected
     * failure, not when verification fails.
     */
    static fromDiscoveryConfig(wellknown?: IClientWellKnown): Promise<ClientConfig>;
    /**
     * Attempts to automatically discover client configuration information
     * prior to logging in. Such information includes the homeserver URL
     * and identity server URL the client would want. Additional details
     * may also be discovered, and will be transparently included in the
     * response object unaltered.
     * @param domain - The homeserver domain to perform discovery
     * on. For example, "matrix.org".
     * @returns Promise which resolves to the discovered
     * configuration, which may include error states. Rejects on unexpected
     * failure, not when discovery fails.
     */
    static findClientConfig(domain: string): Promise<ClientConfig>;
    /**
     * Gets the raw discovery client configuration for the given domain name.
     * Should only be used if there's no validation to be done on the resulting
     * object, otherwise use findClientConfig().
     * @param domain - The domain to get the client config for.
     * @returns Promise which resolves to the domain's client config. Can
     * be an empty object.
     */
    static getRawClientConfig(domain?: string): Promise<IClientWellKnown>;
    /**
     * Sanitizes a given URL to ensure it is either an HTTP or HTTP URL and
     * is suitable for the requirements laid out by .well-known auto discovery.
     * If valid, the URL will also be stripped of any trailing slashes.
     * @param url - The potentially invalid URL to sanitize.
     * @returns The sanitized URL or a falsey value if the URL is invalid.
     * @internal
     */
    private static sanitizeWellKnownUrl;
    private static fetch;
    private static fetchFn?;
    static setFetchFn(fetchFn: typeof globalThis.fetch): void;
    /**
     * Fetches a JSON object from a given URL, as expected by all .well-known
     * related lookups. If the server gives a 404 then the `action` will be
     * IGNORE. If the server returns something that isn't JSON, the `action`
     * will be FAIL_PROMPT. For any other failure the `action` will be FAIL_PROMPT.
     *
     * The returned object will be a result of the call in object form with
     * the following properties:
     *   raw: The JSON object returned by the server.
     *   action: One of SUCCESS, IGNORE, or FAIL_PROMPT.
     *   reason: Relatively human-readable description of what went wrong.
     *   error: The actual Error, if one exists.
     * @param url - The URL to fetch a JSON object from.
     * @returns Promise which resolves to the returned state.
     * @internal
     */
    private static fetchWellKnownObject;
}
export {};
//# sourceMappingURL=autodiscovery.d.ts.map