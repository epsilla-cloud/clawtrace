import { Vf as resolveAuthProfileOrder, t as resolveApiKeyForProfile } from "./auth-profiles-B5ypC5S-.js";
import { n as ensureAuthProfileStore } from "./store-BpAvd-ka.js";
import { a as resolveAgentDir, m as resolveDefaultAgentId, p as resolveAgentWorkspaceDir } from "./agent-scope-BSOSJbA_.js";
import { g as resolveDefaultAgentWorkspaceDir } from "./workspace-CFIQ0-q3.js";
import { t as resolveEnvApiKey } from "./model-auth-env-QeMWu7zp.js";
import { n as enablePluginInConfig } from "./provider-web-search-I-919IKa.js";
import { l as resolveDefaultSecretProviderAlias } from "./ref-contract-DQ4e7rf7.js";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-D7Gi17j0.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Caby3smH.js";
import { s as normalizeSecretInputModeInput } from "./provider-auth-helpers-Cn7_lVDp.js";
import { t as resolveManifestDeprecatedProviderAuthChoice } from "./provider-auth-choices-CHjie4bD.js";
import { n as isDeprecatedAuthChoice, t as formatDeprecatedNonInteractiveAuthChoiceError } from "./auth-choice-legacy-BxgA06M4.js";
import "./auth-choice.apply-helpers-N0X9l_6R.js";
import { r as normalizeApiKeyTokenProviderAuthChoice, t as resolvePreferredProviderForAuthChoice } from "./provider-auth-choice-preference-B3m2WuIN.js";
import { a as resolveCustomProviderId, n as applyCustomApiConfig, r as parseNonInteractiveCustomApiFlags, t as CustomApiError } from "./onboard-custom-DY0XuRoF.js";
//#region src/commands/onboard-non-interactive/api-keys.ts
function parseEnvVarNameFromSourceLabel(source) {
	if (!source) return;
	return /^(?:shell env: |env: )([A-Z][A-Z0-9_]*)$/.exec(source.trim())?.[1];
}
async function resolveApiKeyFromProfiles(params) {
	const store = ensureAuthProfileStore(params.agentDir);
	const order = resolveAuthProfileOrder({
		cfg: params.cfg,
		store,
		provider: params.provider
	});
	for (const profileId of order) {
		if (store.profiles[profileId]?.type !== "api_key") continue;
		const resolved = await resolveApiKeyForProfile({
			cfg: params.cfg,
			store,
			profileId,
			agentDir: params.agentDir
		});
		if (resolved?.apiKey) return resolved.apiKey;
	}
	return null;
}
async function resolveNonInteractiveApiKey(params) {
	const flagKey = normalizeOptionalSecretInput(params.flagValue);
	const envResolved = resolveEnvApiKey(params.provider);
	const explicitEnvVar = params.envVarName?.trim();
	const explicitEnvKey = explicitEnvVar ? normalizeOptionalSecretInput(process.env[explicitEnvVar]) : void 0;
	const resolvedEnvKey = envResolved?.apiKey ?? explicitEnvKey;
	const resolvedEnvVarName = parseEnvVarNameFromSourceLabel(envResolved?.source) ?? explicitEnvVar;
	if (params.secretInputMode === "ref") {
		if (!resolvedEnvKey && flagKey) {
			params.runtime.error([`${params.flagName} cannot be used with --secret-input-mode ref unless ${params.envVar} is set in env.`, `Set ${params.envVar} in env and omit ${params.flagName}, or use --secret-input-mode plaintext.`].join("\n"));
			params.runtime.exit(1);
			return null;
		}
		if (resolvedEnvKey) {
			if (!resolvedEnvVarName) {
				params.runtime.error([`--secret-input-mode ref requires an explicit environment variable for provider "${params.provider}".`, `Set ${params.envVar} in env and retry, or use --secret-input-mode plaintext.`].join("\n"));
				params.runtime.exit(1);
				return null;
			}
			return {
				key: resolvedEnvKey,
				source: "env",
				envVarName: resolvedEnvVarName
			};
		}
	}
	if (flagKey) return {
		key: flagKey,
		source: "flag"
	};
	if (resolvedEnvKey) return {
		key: resolvedEnvKey,
		source: "env",
		envVarName: resolvedEnvVarName
	};
	if (params.allowProfile ?? true) {
		const profileKey = await resolveApiKeyFromProfiles({
			provider: params.provider,
			cfg: params.cfg,
			agentDir: params.agentDir
		});
		if (profileKey) return {
			key: profileKey,
			source: "profile"
		};
	}
	if (params.required === false) return null;
	const profileHint = params.allowProfile === false ? "" : `, or existing ${params.provider} API-key profile`;
	params.runtime.error(`Missing ${params.flagName} (or ${params.envVar} in env${profileHint}).`);
	params.runtime.exit(1);
	return null;
}
//#endregion
//#region src/commands/onboard-non-interactive/local/auth-choice.plugin-providers.ts
const PROVIDER_PLUGIN_CHOICE_PREFIX = "provider-plugin:";
async function loadPluginProviderRuntime() {
	return import("./auth-choice.plugin-providers.runtime-CdSfZJbc.js");
}
const loadAuthChoicePluginProvidersRuntime = createLazyRuntimeSurface(loadPluginProviderRuntime, ({ authChoicePluginProvidersRuntime }) => authChoicePluginProvidersRuntime);
function buildIsolatedProviderResolutionConfig(cfg, ids) {
	const allow = new Set(cfg.plugins?.allow ?? []);
	const entries = { ...cfg.plugins?.entries };
	let changed = false;
	for (const rawId of ids) {
		const id = rawId?.trim();
		if (!id) continue;
		allow.add(id);
		entries[id] = {
			...cfg.plugins?.entries?.[id],
			enabled: true
		};
		changed = true;
	}
	if (!changed) return cfg;
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			allow: Array.from(allow),
			entries
		}
	};
}
async function applyNonInteractivePluginProviderChoice(params) {
	const agentId = resolveDefaultAgentId(params.nextConfig);
	const agentDir = resolveAgentDir(params.nextConfig, agentId);
	const workspaceDir = resolveAgentWorkspaceDir(params.nextConfig, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const preferredProviderId = (params.authChoice.startsWith(PROVIDER_PLUGIN_CHOICE_PREFIX) ? params.authChoice.slice(16).split(":", 1)[0]?.trim() : void 0) || await resolvePreferredProviderForAuthChoice({
		choice: params.authChoice,
		config: params.nextConfig,
		workspaceDir
	});
	const { resolveOwningPluginIdsForProvider, resolveProviderPluginChoice, resolvePluginProviders } = await loadAuthChoicePluginProvidersRuntime();
	const owningPluginIds = preferredProviderId ? resolveOwningPluginIdsForProvider({
		provider: preferredProviderId,
		config: params.nextConfig,
		workspaceDir
	}) : void 0;
	const providerChoice = resolveProviderPluginChoice({
		providers: resolvePluginProviders({
			config: buildIsolatedProviderResolutionConfig(params.nextConfig, [preferredProviderId, ...owningPluginIds ?? []]),
			workspaceDir,
			onlyPluginIds: owningPluginIds,
			bundledProviderAllowlistCompat: true,
			bundledProviderVitestCompat: true
		}),
		choice: params.authChoice
	});
	if (!providerChoice) return;
	const enableResult = enablePluginInConfig(params.nextConfig, providerChoice.provider.pluginId ?? providerChoice.provider.id);
	if (!enableResult.enabled) {
		params.runtime.error(`${providerChoice.provider.label} plugin is disabled (${enableResult.reason ?? "blocked"}).`);
		params.runtime.exit(1);
		return null;
	}
	const method = providerChoice.method;
	if (!method.runNonInteractive) {
		params.runtime.error([`Auth choice "${params.authChoice}" requires interactive mode.`, `The ${providerChoice.provider.label} provider plugin does not implement non-interactive setup.`].join("\n"));
		params.runtime.exit(1);
		return null;
	}
	return method.runNonInteractive({
		authChoice: params.authChoice,
		config: enableResult.config,
		baseConfig: params.baseConfig,
		opts: params.opts,
		runtime: params.runtime,
		agentDir,
		workspaceDir,
		resolveApiKey: params.resolveApiKey,
		toApiKeyCredential: params.toApiKeyCredential
	});
}
//#endregion
//#region src/commands/onboard-non-interactive/local/auth-choice.ts
async function applyNonInteractiveAuthChoice(params) {
	const { opts, runtime, baseConfig } = params;
	const authChoice = normalizeApiKeyTokenProviderAuthChoice({
		authChoice: params.authChoice,
		tokenProvider: opts.tokenProvider,
		config: params.nextConfig,
		env: process.env
	});
	let nextConfig = params.nextConfig;
	const requestedSecretInputMode = normalizeSecretInputModeInput(opts.secretInputMode);
	if (opts.secretInputMode && !requestedSecretInputMode) {
		runtime.error("Invalid --secret-input-mode. Use \"plaintext\" or \"ref\".");
		runtime.exit(1);
		return null;
	}
	const toStoredSecretInput = (resolved) => {
		if (requestedSecretInputMode !== "ref") return resolved.key;
		if (resolved.source !== "env") return resolved.key;
		if (!resolved.envVarName) {
			runtime.error([`Unable to determine which environment variable to store as a ref for provider "${authChoice}".`, "Set an explicit provider env var and retry, or use --secret-input-mode plaintext."].join("\n"));
			runtime.exit(1);
			return null;
		}
		return {
			source: "env",
			provider: resolveDefaultSecretProviderAlias(baseConfig, "env", { preferFirstProviderForSource: true }),
			id: resolved.envVarName
		};
	};
	const resolveApiKey = (input) => resolveNonInteractiveApiKey({
		...input,
		secretInputMode: requestedSecretInputMode
	});
	const toApiKeyCredential = (params) => {
		if (requestedSecretInputMode === "ref" && params.resolved.source === "env") {
			if (!params.resolved.envVarName) {
				runtime.error([`--secret-input-mode ref requires an explicit environment variable for provider "${params.provider}".`, "Set the provider API key env var and retry, or use --secret-input-mode plaintext."].join("\n"));
				runtime.exit(1);
				return null;
			}
			return {
				type: "api_key",
				provider: params.provider,
				keyRef: {
					source: "env",
					provider: resolveDefaultSecretProviderAlias(baseConfig, "env", { preferFirstProviderForSource: true }),
					id: params.resolved.envVarName
				},
				...params.email ? { email: params.email } : {},
				...params.metadata ? { metadata: params.metadata } : {}
			};
		}
		return {
			type: "api_key",
			provider: params.provider,
			key: params.resolved.key,
			...params.email ? { email: params.email } : {},
			...params.metadata ? { metadata: params.metadata } : {}
		};
	};
	if (isDeprecatedAuthChoice(authChoice, {
		config: nextConfig,
		env: process.env
	})) {
		runtime.error(formatDeprecatedNonInteractiveAuthChoiceError(authChoice, {
			config: nextConfig,
			env: process.env
		}));
		runtime.exit(1);
		return null;
	}
	if (authChoice === "setup-token") {
		runtime.error(["Auth choice \"setup-token\" requires interactive mode.", "Use \"--auth-choice token\" with --token and --token-provider anthropic."].join("\n"));
		runtime.exit(1);
		return null;
	}
	const pluginProviderChoice = await applyNonInteractivePluginProviderChoice({
		nextConfig,
		authChoice,
		opts,
		runtime,
		baseConfig,
		resolveApiKey: (input) => resolveApiKey({
			...input,
			cfg: baseConfig,
			runtime
		}),
		toApiKeyCredential
	});
	if (pluginProviderChoice !== void 0) return pluginProviderChoice;
	const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, {
		config: nextConfig,
		env: process.env
	});
	if (deprecatedChoice) {
		runtime.error(`"${authChoice}" is no longer supported. Use --auth-choice ${deprecatedChoice.choiceId} instead.`);
		runtime.exit(1);
		return null;
	}
	if (authChoice === "custom-api-key") try {
		const customAuth = parseNonInteractiveCustomApiFlags({
			baseUrl: opts.customBaseUrl,
			modelId: opts.customModelId,
			compatibility: opts.customCompatibility,
			apiKey: opts.customApiKey,
			providerId: opts.customProviderId
		});
		const resolvedCustomApiKey = await resolveApiKey({
			provider: resolveCustomProviderId({
				config: nextConfig,
				baseUrl: customAuth.baseUrl,
				providerId: customAuth.providerId
			}).providerId,
			cfg: baseConfig,
			flagValue: customAuth.apiKey,
			flagName: "--custom-api-key",
			envVar: "CUSTOM_API_KEY",
			envVarName: "CUSTOM_API_KEY",
			runtime,
			required: false
		});
		let customApiKeyInput;
		if (resolvedCustomApiKey) if (requestedSecretInputMode === "ref") {
			const stored = toStoredSecretInput(resolvedCustomApiKey);
			if (!stored) return null;
			customApiKeyInput = stored;
		} else customApiKeyInput = resolvedCustomApiKey.key;
		const result = applyCustomApiConfig({
			config: nextConfig,
			baseUrl: customAuth.baseUrl,
			modelId: customAuth.modelId,
			compatibility: customAuth.compatibility,
			apiKey: customApiKeyInput,
			providerId: customAuth.providerId
		});
		if (result.providerIdRenamedFrom && result.providerId) runtime.log(`Custom provider ID "${result.providerIdRenamedFrom}" already exists for a different base URL. Using "${result.providerId}".`);
		return result.config;
	} catch (err) {
		if (err instanceof CustomApiError) {
			switch (err.code) {
				case "missing_required":
				case "invalid_compatibility":
					runtime.error(err.message);
					break;
				default:
					runtime.error(`Invalid custom provider config: ${err.message}`);
					break;
			}
			runtime.exit(1);
			return null;
		}
		const reason = err instanceof Error ? err.message : String(err);
		runtime.error(`Invalid custom provider config: ${reason}`);
		runtime.exit(1);
		return null;
	}
	if (authChoice === "oauth" || authChoice === "chutes" || authChoice === "minimax-global-oauth" || authChoice === "minimax-cn-oauth") {
		runtime.error("OAuth requires interactive mode.");
		runtime.exit(1);
		return null;
	}
	return nextConfig;
}
//#endregion
export { applyNonInteractiveAuthChoice };
