/** Encode a flat object as application/x-www-form-urlencoded form data. */
export declare function toFormUrlEncoded(data: Record<string, string>): string;
/** Generate a PKCE verifier/challenge pair suitable for OAuth authorization flows. */
export declare function generatePkceVerifierChallenge(): {
    verifier: string;
    challenge: string;
};
