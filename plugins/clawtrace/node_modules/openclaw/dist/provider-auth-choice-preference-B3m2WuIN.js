import { c as normalizeTokenProviderInput } from "./provider-auth-helpers-Cn7_lVDp.js";
import { n as resolveManifestProviderApiKeyChoice, r as resolveManifestProviderAuthChoice } from "./provider-auth-choices-CHjie4bD.js";
import { r as normalizeLegacyOnboardAuthChoice } from "./auth-choice-legacy-BxgA06M4.js";
import "./auth-choice.apply-helpers-N0X9l_6R.js";
//#region src/commands/auth-choice.apply.api-providers.ts
function normalizeApiKeyTokenProviderAuthChoice(params) {
	if (params.authChoice !== "apiKey" || !params.tokenProvider) return params.authChoice;
	const normalizedTokenProvider = normalizeTokenProviderInput(params.tokenProvider);
	if (!normalizedTokenProvider) return params.authChoice;
	return resolveManifestProviderApiKeyChoice({
		providerId: normalizedTokenProvider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	})?.choiceId ?? params.authChoice;
}
async function applyAuthChoiceApiProviders(_params) {
	return null;
}
//#endregion
//#region src/plugins/provider-auth-choice-preference.ts
function normalizeLegacyAuthChoice(choice, env) {
	return normalizeLegacyOnboardAuthChoice(choice, { env }) ?? choice;
}
async function resolvePreferredProviderForAuthChoice(params) {
	const choice = normalizeLegacyAuthChoice(params.choice, params.env) ?? params.choice;
	const manifestResolved = resolveManifestProviderAuthChoice(choice, params);
	if (manifestResolved) return manifestResolved.providerId;
	const { resolveProviderPluginChoice, resolvePluginProviders } = await import("./provider-auth-choice.runtime-CmEglGfi.js");
	const pluginResolved = resolveProviderPluginChoice({
		providers: resolvePluginProviders({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			bundledProviderAllowlistCompat: true,
			bundledProviderVitestCompat: true
		}),
		choice
	});
	if (pluginResolved) return pluginResolved.provider.id;
	if (choice === "custom-api-key") return "custom";
}
//#endregion
export { applyAuthChoiceApiProviders as n, normalizeApiKeyTokenProviderAuthChoice as r, resolvePreferredProviderForAuthChoice as t };
