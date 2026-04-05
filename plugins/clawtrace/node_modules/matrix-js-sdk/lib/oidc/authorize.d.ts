import { type IdTokenClaims } from "oidc-client-ts";
import { type BearerTokenResponse, type ValidatedAuthMetadata } from "./validate.ts";
export type { BearerTokenResponse };
/**
 * Authorization parameters which are used in the authentication request of an OIDC auth code flow.
 *
 * See https://openid.net/specs/openid-connect-basic-1_0.html#RequestParameters.
 */
export type AuthorizationParams = {
    state: string;
    scope: string;
    redirectUri: string;
    codeVerifier: string;
    nonce: string;
};
/**
 * @experimental
 * Generate the scope used in authorization request with OIDC OP
 * @returns scope
 */
export declare const generateScope: (deviceId?: string) => string;
/**
 * Generate authorization params to pass to {@link generateAuthorizationUrl}.
 *
 * Used as part of an authorization code OIDC flow: see https://openid.net/specs/openid-connect-basic-1_0.html#CodeFlow.
 *
 * @param redirectUri - absolute url for OP to redirect to after authorization
 * @returns AuthorizationParams
 */
export declare const generateAuthorizationParams: ({ redirectUri }: {
    redirectUri: string;
}) => AuthorizationParams;
/**
 * @deprecated use generateOidcAuthorizationUrl
 * Generate a URL to attempt authorization with the OP
 * See https://openid.net/specs/openid-connect-basic-1_0.html#CodeRequest
 * @param authorizationUrl - endpoint to attempt authorization with the OP
 * @param clientId - id of this client as registered with the OP
 * @param authorizationParams - params to be used in the url
 * @returns a Promise with the url as a string
 */
export declare const generateAuthorizationUrl: (authorizationUrl: string, clientId: string, { scope, redirectUri, state, nonce, codeVerifier }: AuthorizationParams) => Promise<string>;
/**
 * @experimental
 * Generate a URL to attempt authorization with the OP
 * See https://openid.net/specs/openid-connect-basic-1_0.html#CodeRequest
 * @param metadata - validated metadata from OP discovery
 * @param clientId - this client's id as registered with the OP
 * @param homeserverUrl - used to establish the session on return from the OP
 * @param identityServerUrl - used to establish the session on return from the OP
 * @param nonce - state
 * @param prompt - indicates to the OP which flow the user should see - eg login or registration
 *          See https://openid.net/specs/openid-connect-prompt-create-1_0.html#name-prompt-parameter
 * @param urlState - value to append to the opaque state identifier to uniquely identify the callback
 * @param loginHint - value to send as the `login_hint` to the OP, giving a hint about the login identifier the user might use to log in.
 *          See {@link https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest OIDC core 3.1.2.1}.
 * @returns a Promise with the url as a string
 */
export declare const generateOidcAuthorizationUrl: ({ metadata, redirectUri, clientId, homeserverUrl, identityServerUrl, nonce, prompt, urlState, loginHint, }: {
    clientId: string;
    metadata: ValidatedAuthMetadata;
    homeserverUrl: string;
    identityServerUrl?: string;
    redirectUri: string;
    nonce: string;
    prompt?: string;
    urlState?: string;
    loginHint?: string;
}) => Promise<string>;
/**
 * @experimental
 * Attempt to exchange authorization code for bearer token.
 *
 * Takes the authorization code returned by the OpenID Provider via the authorization URL, and makes a
 * request to the Token Endpoint, to obtain the access token, refresh token, etc.
 *
 * @param code - authorization code as returned by OP during authorization
 * @param storedAuthorizationParams - stored params from start of oidc login flow
 * @returns valid bearer token response
 * @throws An `Error` with `message` set to an entry in {@link OidcError},
 *      when the request fails, or the returned token response is invalid.
 */
export declare const completeAuthorizationCodeGrant: (code: string, state: string) => Promise<{
    oidcClientSettings: {
        clientId: string;
        issuer: string;
    };
    tokenResponse: BearerTokenResponse;
    homeserverUrl: string;
    idTokenClaims: IdTokenClaims;
    identityServerUrl?: string;
}>;
//# sourceMappingURL=authorize.d.ts.map