/**
 * Errors expected to be encountered during OIDC discovery, client registration, and authentication.
 * Not intended to be displayed directly to the user.
 */
export declare enum OidcError {
    NotSupported = "OIDC authentication not supported",
    Misconfigured = "OIDC is misconfigured",
    General = "Something went wrong with OIDC discovery",
    OpSupport = "Configured OIDC OP does not support required functions",
    DynamicRegistrationNotSupported = "Dynamic registration not supported",
    DynamicRegistrationFailed = "Dynamic registration failed",
    DynamicRegistrationInvalid = "Dynamic registration invalid response",
    CodeExchangeFailed = "Failed to exchange code for token",
    InvalidBearerTokenResponse = "Invalid bearer token response",
    InvalidIdToken = "Invalid ID token",
    MissingOrInvalidStoredState = "State required to finish logging in is not found in storage."
}
//# sourceMappingURL=error.d.ts.map