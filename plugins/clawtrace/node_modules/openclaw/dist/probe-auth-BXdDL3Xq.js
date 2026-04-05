import { $O as resolveGatewayCredentialsWithSecretInputs, ek as isGatewaySecretRefUnavailableError, nk as resolveGatewayProbeCredentialsFromConfig } from "./auth-profiles-B5ypC5S-.js";
//#region src/gateway/probe-auth.ts
function buildGatewayProbeCredentialPolicy(params) {
	return {
		config: params.cfg,
		cfg: params.cfg,
		env: params.env,
		explicitAuth: params.explicitAuth,
		modeOverride: params.mode,
		mode: params.mode,
		remoteTokenFallback: "remote-only"
	};
}
function resolveGatewayProbeAuth(params) {
	return resolveGatewayProbeCredentialsFromConfig(buildGatewayProbeCredentialPolicy(params));
}
async function resolveGatewayProbeAuthWithSecretInputs(params) {
	const policy = buildGatewayProbeCredentialPolicy(params);
	return await resolveGatewayCredentialsWithSecretInputs({
		config: policy.config,
		env: policy.env,
		explicitAuth: policy.explicitAuth,
		modeOverride: policy.modeOverride,
		remoteTokenFallback: policy.remoteTokenFallback
	});
}
async function resolveGatewayProbeAuthSafeWithSecretInputs(params) {
	const explicitToken = params.explicitAuth?.token?.trim();
	const explicitPassword = params.explicitAuth?.password?.trim();
	if (explicitToken || explicitPassword) return { auth: {
		...explicitToken ? { token: explicitToken } : {},
		...explicitPassword ? { password: explicitPassword } : {}
	} };
	try {
		return { auth: await resolveGatewayProbeAuthWithSecretInputs(params) };
	} catch (error) {
		if (!isGatewaySecretRefUnavailableError(error)) throw error;
		return {
			auth: {},
			warning: `${error.path} SecretRef is unresolved in this command path; probing without configured auth credentials.`
		};
	}
}
function resolveGatewayProbeAuthSafe(params) {
	const explicitToken = params.explicitAuth?.token?.trim();
	const explicitPassword = params.explicitAuth?.password?.trim();
	if (explicitToken || explicitPassword) return { auth: {
		...explicitToken ? { token: explicitToken } : {},
		...explicitPassword ? { password: explicitPassword } : {}
	} };
	try {
		return { auth: resolveGatewayProbeAuth(params) };
	} catch (error) {
		if (!isGatewaySecretRefUnavailableError(error)) throw error;
		return {
			auth: {},
			warning: `${error.path} SecretRef is unresolved in this command path; probing without configured auth credentials.`
		};
	}
}
//#endregion
export { resolveGatewayProbeAuthWithSecretInputs as i, resolveGatewayProbeAuthSafe as n, resolveGatewayProbeAuthSafeWithSecretInputs as r, resolveGatewayProbeAuth as t };
