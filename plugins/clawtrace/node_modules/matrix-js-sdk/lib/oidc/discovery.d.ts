import { type OidcClientConfig } from "./index.ts";
/**
 * @experimental
 * Discover and validate delegated auth configuration
 * - delegated auth issuer openid-configuration is reachable
 * - delegated auth issuer openid-configuration is configured correctly for us
 * Fetches https://oidc-issuer.example.com/.well-known/openid-configuration and other files linked therein.
 * When successful, validated metadata is returned
 * @param issuer - the OIDC issuer as returned by the /auth_issuer API
 * @returns validated authentication metadata and optionally signing keys
 * @throws when delegated auth config is invalid or unreachable
 * @deprecated in favour of {@link MatrixClient#getAuthMetadata}
 */
export declare const discoverAndValidateOIDCIssuerWellKnown: (issuer: string) => Promise<OidcClientConfig>;
/**
 * @experimental
 * Validate the authentication metadata and fetch the signing keys from the jwks_uri in the metadata
 * @param authMetadata - the authentication metadata to validate
 * @returns validated authentication metadata and signing keys
 */
export declare const validateAuthMetadataAndKeys: (authMetadata: unknown) => Promise<OidcClientConfig>;
//# sourceMappingURL=discovery.d.ts.map