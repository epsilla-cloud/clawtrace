import { l as REDIRECT_URI, m as TOKEN_URL } from "./oauth.shared-BjYaMKe5.js";
import { r as resolveOAuthClientConfig } from "./oauth.credentials-B6sPxG71.js";
import { t as fetchWithTimeout } from "./oauth.http-BztJJNkE.js";
import { t as resolveGoogleOAuthIdentity } from "./oauth.project-DMuGF1Da.js";
//#region extensions/google/oauth.token.ts
async function exchangeCodeForTokens(code, verifier) {
	const { clientId, clientSecret } = resolveOAuthClientConfig();
	const body = new URLSearchParams({
		client_id: clientId,
		code,
		grant_type: "authorization_code",
		redirect_uri: REDIRECT_URI,
		code_verifier: verifier
	});
	if (clientSecret) body.set("client_secret", clientSecret);
	const response = await fetchWithTimeout(TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
			Accept: "*/*",
			"User-Agent": "google-api-nodejs-client/9.15.1"
		},
		body
	});
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Token exchange failed: ${errorText}`);
	}
	const data = await response.json();
	if (!data.refresh_token) throw new Error("No refresh token received. Please try again.");
	const identity = await resolveGoogleOAuthIdentity(data.access_token);
	const expiresAt = Date.now() + data.expires_in * 1e3 - 300 * 1e3;
	return {
		refresh: data.refresh_token,
		access: data.access_token,
		expires: expiresAt,
		projectId: identity.projectId,
		email: identity.email
	};
}
//#endregion
export { exchangeCodeForTokens as t };
