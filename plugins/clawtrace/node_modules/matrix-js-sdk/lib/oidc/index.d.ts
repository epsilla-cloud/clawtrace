import type { SigningKey } from "oidc-client-ts";
import { type ValidatedAuthMetadata } from "./validate.ts";
export * from "./authorize.ts";
export * from "./discovery.ts";
export * from "./error.ts";
export * from "./register.ts";
export * from "./tokenRefresher.ts";
export * from "./validate.ts";
/**
 * Validated config for native OIDC authentication, as returned by {@link discoverAndValidateOIDCIssuerWellKnown}.
 * Contains metadata and signing keys from the issuer's well-known (https://oidc-issuer.example.com/.well-known/openid-configuration).
 */
export interface OidcClientConfig extends ValidatedAuthMetadata {
    signingKeys: SigningKey[] | null;
}
//# sourceMappingURL=index.d.ts.map