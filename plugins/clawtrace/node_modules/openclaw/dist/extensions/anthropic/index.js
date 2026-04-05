import { h as CLAUDE_CLI_PROFILE_ID } from "../../store-BpAvd-ka.js";
import { t as cloneFirstTemplateModel } from "../../provider-model-shared-Bzdvns2r.js";
import { t as formatCliCommand } from "../../command-format-CR4nOXgc.js";
import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { n as normalizeSecretInput } from "../../normalize-secret-input-Caby3smH.js";
import { t as parseDurationMs } from "../../parse-duration-f4UWaeq0.js";
import { a as upsertAuthProfile, n as listProfilesForProvider } from "../../profiles-BPdDUT-J.js";
import { t as resolveSecretInputModeForEnvSelection } from "../../provider-auth-mode-DdP_8HfA.js";
import { n as promptSecretRefForSetup } from "../../provider-auth-ref-CuMJFGCB.js";
import { s as normalizeSecretInputModeInput, t as applyAuthProfileConfig } from "../../provider-auth-helpers-Cn7_lVDp.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-dVvNnCb0.js";
import "../../provider-auth-api-key-A3ylU4FZ.js";
import { i as validateAnthropicSetupToken, o as suggestOAuthProfileIdForLegacyDefault, r as buildTokenProfileId } from "../../provider-auth-Bd38MUDZ.js";
import { a as fetchClaudeUsage } from "../../provider-usage.fetch-8FvUl8iv.js";
import "../../cli-runtime-BnYvpUgb.js";
import "../../provider-usage-Cj3kwOGM.js";
import { t as buildAnthropicCliBackend } from "../../cli-backend-CbJ0xVDC.js";
import { n as hasClaudeCliAuth, t as buildAnthropicCliMigrationResult } from "../../cli-migration-C5NsZM4T.js";
import { t as anthropicMediaUnderstandingProvider } from "../../media-understanding-provider-Dc7zZwxO.js";
//#region extensions/anthropic/index.ts
const PROVIDER_ID = "anthropic";
const DEFAULT_ANTHROPIC_MODEL = "anthropic/claude-sonnet-4-6";
const ANTHROPIC_OPUS_46_MODEL_ID = "claude-opus-4-6";
const ANTHROPIC_OPUS_46_DOT_MODEL_ID = "claude-opus-4.6";
const ANTHROPIC_OPUS_TEMPLATE_MODEL_IDS = ["claude-opus-4-5", "claude-opus-4.5"];
const ANTHROPIC_SONNET_46_MODEL_ID = "claude-sonnet-4-6";
const ANTHROPIC_SONNET_46_DOT_MODEL_ID = "claude-sonnet-4.6";
const ANTHROPIC_SONNET_TEMPLATE_MODEL_IDS = ["claude-sonnet-4-5", "claude-sonnet-4.5"];
const ANTHROPIC_MODERN_MODEL_PREFIXES = [
	"claude-opus-4-6",
	"claude-sonnet-4-6",
	"claude-opus-4-5",
	"claude-sonnet-4-5",
	"claude-haiku-4-5"
];
const ANTHROPIC_OAUTH_ALLOWLIST = [
	"anthropic/claude-sonnet-4-6",
	"anthropic/claude-opus-4-6",
	"anthropic/claude-opus-4-5",
	"anthropic/claude-sonnet-4-5",
	"anthropic/claude-haiku-4-5"
];
function resolveAnthropic46ForwardCompatModel(params) {
	const trimmedModelId = params.ctx.modelId.trim();
	const lower = trimmedModelId.toLowerCase();
	if (!(lower === params.dashModelId || lower === params.dotModelId || lower.startsWith(`${params.dashModelId}-`) || lower.startsWith(`${params.dotModelId}-`))) return;
	const templateIds = [];
	if (lower.startsWith(params.dashModelId)) templateIds.push(lower.replace(params.dashModelId, params.dashTemplateId));
	if (lower.startsWith(params.dotModelId)) templateIds.push(lower.replace(params.dotModelId, params.dotTemplateId));
	templateIds.push(...params.fallbackTemplateIds);
	return cloneFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId: trimmedModelId,
		templateIds,
		ctx: params.ctx
	});
}
function resolveAnthropicForwardCompatModel(ctx) {
	return resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_OPUS_46_MODEL_ID,
		dotModelId: ANTHROPIC_OPUS_46_DOT_MODEL_ID,
		dashTemplateId: "claude-opus-4-5",
		dotTemplateId: "claude-opus-4.5",
		fallbackTemplateIds: ANTHROPIC_OPUS_TEMPLATE_MODEL_IDS
	}) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_SONNET_46_MODEL_ID,
		dotModelId: ANTHROPIC_SONNET_46_DOT_MODEL_ID,
		dashTemplateId: "claude-sonnet-4-5",
		dotTemplateId: "claude-sonnet-4.5",
		fallbackTemplateIds: ANTHROPIC_SONNET_TEMPLATE_MODEL_IDS
	});
}
function matchesAnthropicModernModel(modelId) {
	const lower = modelId.trim().toLowerCase();
	return ANTHROPIC_MODERN_MODEL_PREFIXES.some((prefix) => lower.startsWith(prefix));
}
function buildAnthropicAuthDoctorHint(params) {
	const legacyProfileId = params.profileId ?? "anthropic:default";
	const suggested = suggestOAuthProfileIdForLegacyDefault({
		cfg: params.config,
		store: params.store,
		provider: PROVIDER_ID,
		legacyProfileId
	});
	if (!suggested || suggested === legacyProfileId) return "";
	const storeOauthProfiles = listProfilesForProvider(params.store, PROVIDER_ID).filter((id) => params.store.profiles[id]?.type === "oauth").join(", ");
	const cfgMode = params.config?.auth?.profiles?.[legacyProfileId]?.mode;
	const cfgProvider = params.config?.auth?.profiles?.[legacyProfileId]?.provider;
	return [
		"Doctor hint (for GitHub issue):",
		`- provider: ${PROVIDER_ID}`,
		`- config: ${legacyProfileId}${cfgProvider || cfgMode ? ` (provider=${cfgProvider ?? "?"}, mode=${cfgMode ?? "?"})` : ""}`,
		`- auth store oauth profiles: ${storeOauthProfiles || "(none)"}`,
		`- suggested profile: ${suggested}`,
		`Fix: run "${formatCliCommand("openclaw doctor --yes")}"`
	].join("\n");
}
async function runAnthropicSetupToken(ctx) {
	await ctx.prompter.note(["Run `claude setup-token` in your terminal.", "Then paste the generated token below."].join("\n"), "Anthropic setup-token");
	const requestedSecretInputMode = normalizeSecretInputModeInput(ctx.secretInputMode);
	const selectedMode = ctx.allowSecretRefPrompt ? await resolveSecretInputModeForEnvSelection({
		prompter: ctx.prompter,
		explicitMode: requestedSecretInputMode,
		copy: {
			modeMessage: "How do you want to provide this setup token?",
			plaintextLabel: "Paste setup token now",
			plaintextHint: "Stores the token directly in the auth profile"
		}
	}) : "plaintext";
	let token = "";
	let tokenRef;
	if (selectedMode === "ref") {
		const resolved = await promptSecretRefForSetup({
			provider: "anthropic-setup-token",
			config: ctx.config,
			prompter: ctx.prompter,
			preferredEnvVar: "ANTHROPIC_SETUP_TOKEN",
			copy: {
				sourceMessage: "Where is this Anthropic setup token stored?",
				envVarPlaceholder: "ANTHROPIC_SETUP_TOKEN"
			}
		});
		token = resolved.resolvedValue.trim();
		tokenRef = resolved.ref;
	} else {
		const tokenRaw = await ctx.prompter.text({
			message: "Paste Anthropic setup-token",
			validate: (value) => validateAnthropicSetupToken(String(value ?? ""))
		});
		token = String(tokenRaw ?? "").trim();
	}
	const tokenError = validateAnthropicSetupToken(token);
	if (tokenError) throw new Error(tokenError);
	const profileNameRaw = await ctx.prompter.text({
		message: "Token name (blank = default)",
		placeholder: "default"
	});
	return { profiles: [{
		profileId: buildTokenProfileId({
			provider: PROVIDER_ID,
			name: String(profileNameRaw ?? "")
		}),
		credential: {
			type: "token",
			provider: PROVIDER_ID,
			token,
			...tokenRef ? { tokenRef } : {}
		}
	}] };
}
async function runAnthropicSetupTokenNonInteractive(ctx) {
	const provider = ctx.opts.tokenProvider?.trim().toLowerCase();
	if (!provider) {
		ctx.runtime.error("Missing --token-provider for --auth-choice token.");
		ctx.runtime.exit(1);
		return null;
	}
	if (provider !== PROVIDER_ID) {
		ctx.runtime.error("Only --token-provider anthropic is supported for --auth-choice token.");
		ctx.runtime.exit(1);
		return null;
	}
	const token = normalizeSecretInput(ctx.opts.token);
	if (!token) {
		ctx.runtime.error("Missing --token for --auth-choice token.");
		ctx.runtime.exit(1);
		return null;
	}
	const tokenError = validateAnthropicSetupToken(token);
	if (tokenError) {
		ctx.runtime.error(tokenError);
		ctx.runtime.exit(1);
		return null;
	}
	let expires;
	const expiresInRaw = ctx.opts.tokenExpiresIn?.trim();
	if (expiresInRaw) try {
		expires = Date.now() + parseDurationMs(expiresInRaw, { defaultUnit: "d" });
	} catch (err) {
		ctx.runtime.error(`Invalid --token-expires-in: ${String(err)}`);
		ctx.runtime.exit(1);
		return null;
	}
	const profileId = ctx.opts.tokenProfileId?.trim() || buildTokenProfileId({
		provider: PROVIDER_ID,
		name: ""
	});
	upsertAuthProfile({
		profileId,
		agentDir: ctx.agentDir,
		credential: {
			type: "token",
			provider: PROVIDER_ID,
			token,
			...expires ? { expires } : {}
		}
	});
	return applyAuthProfileConfig(ctx.config, {
		profileId,
		provider: PROVIDER_ID,
		mode: "token"
	});
}
async function runAnthropicCliMigration(ctx) {
	if (!hasClaudeCliAuth()) throw new Error(["Claude CLI is not authenticated on this host.", `Run ${formatCliCommand("claude auth login")} first, then re-run this setup.`].join("\n"));
	return buildAnthropicCliMigrationResult(ctx.config);
}
async function runAnthropicCliMigrationNonInteractive(ctx) {
	if (!hasClaudeCliAuth()) {
		ctx.runtime.error(["Auth choice \"anthropic-cli\" requires Claude CLI auth on this host.", `Run ${formatCliCommand("claude auth login")} first.`].join("\n"));
		ctx.runtime.exit(1);
		return null;
	}
	const result = buildAnthropicCliMigrationResult(ctx.config);
	const currentDefaults = ctx.config.agents?.defaults;
	const currentModel = currentDefaults?.model;
	const currentFallbacks = currentModel && typeof currentModel === "object" && "fallbacks" in currentModel ? currentModel.fallbacks : void 0;
	return {
		...ctx.config,
		...result.configPatch,
		agents: {
			...ctx.config.agents,
			...result.configPatch?.agents,
			defaults: {
				...currentDefaults,
				...result.configPatch?.agents?.defaults,
				model: {
					...Array.isArray(currentFallbacks) ? { fallbacks: currentFallbacks } : {},
					primary: result.defaultModel
				}
			}
		}
	};
}
var anthropic_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "Anthropic Provider",
	description: "Bundled Anthropic provider plugin",
	register(api) {
		api.registerCliBackend(buildAnthropicCliBackend());
		api.registerProvider({
			id: PROVIDER_ID,
			label: "Anthropic",
			docsPath: "/providers/models",
			envVars: ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"],
			deprecatedProfileIds: [CLAUDE_CLI_PROFILE_ID],
			oauthProfileIdRepairs: [{
				legacyProfileId: "anthropic:default",
				promptLabel: "Anthropic"
			}],
			auth: [
				{
					id: "cli",
					label: "Claude CLI",
					hint: "Reuse a local Claude CLI login and switch model selection to claude-cli/*",
					kind: "custom",
					wizard: {
						choiceId: "anthropic-cli",
						choiceLabel: "Anthropic Claude CLI",
						choiceHint: "Reuse a local Claude CLI login on this host",
						groupId: "anthropic",
						groupLabel: "Anthropic",
						groupHint: "Claude CLI + setup-token + API key",
						modelAllowlist: {
							allowedKeys: [...ANTHROPIC_OAUTH_ALLOWLIST].map((model) => model.replace(/^anthropic\//, "claude-cli/")),
							initialSelections: ["claude-cli/claude-sonnet-4-6"],
							message: "Claude CLI models"
						}
					},
					run: async (ctx) => await runAnthropicCliMigration(ctx),
					runNonInteractive: async (ctx) => await runAnthropicCliMigrationNonInteractive({
						config: ctx.config,
						runtime: ctx.runtime
					})
				},
				{
					id: "setup-token",
					label: "setup-token (claude)",
					hint: "Paste a setup-token from `claude setup-token`",
					kind: "token",
					wizard: {
						choiceId: "token",
						choiceLabel: "Anthropic token (paste setup-token)",
						choiceHint: "Run `claude setup-token` elsewhere, then paste the token here",
						groupId: "anthropic",
						groupLabel: "Anthropic",
						groupHint: "Claude CLI + setup-token + API key",
						modelAllowlist: {
							allowedKeys: [...ANTHROPIC_OAUTH_ALLOWLIST],
							initialSelections: ["anthropic/claude-sonnet-4-6"],
							message: "Anthropic OAuth models"
						}
					},
					run: async (ctx) => await runAnthropicSetupToken(ctx),
					runNonInteractive: async (ctx) => await runAnthropicSetupTokenNonInteractive({
						config: ctx.config,
						opts: ctx.opts,
						runtime: ctx.runtime,
						agentDir: ctx.agentDir
					})
				},
				createProviderApiKeyAuthMethod({
					providerId: PROVIDER_ID,
					methodId: "api-key",
					label: "Anthropic API key",
					hint: "Direct Anthropic API key",
					optionKey: "anthropicApiKey",
					flagName: "--anthropic-api-key",
					envVar: "ANTHROPIC_API_KEY",
					promptMessage: "Enter Anthropic API key",
					defaultModel: DEFAULT_ANTHROPIC_MODEL,
					expectedProviders: ["anthropic"],
					wizard: {
						choiceId: "apiKey",
						choiceLabel: "Anthropic API key",
						groupId: "anthropic",
						groupLabel: "Anthropic",
						groupHint: "Claude CLI + setup-token + API key"
					}
				})
			],
			resolveDynamicModel: (ctx) => resolveAnthropicForwardCompatModel(ctx),
			capabilities: {
				providerFamily: "anthropic",
				dropThinkingBlockModelHints: ["claude"]
			},
			isModernModelRef: ({ modelId }) => matchesAnthropicModernModel(modelId),
			resolveDefaultThinkingLevel: ({ modelId }) => matchesAnthropicModernModel(modelId) && (modelId.toLowerCase().startsWith(ANTHROPIC_OPUS_46_MODEL_ID) || modelId.toLowerCase().startsWith(ANTHROPIC_OPUS_46_DOT_MODEL_ID) || modelId.toLowerCase().startsWith(ANTHROPIC_SONNET_46_MODEL_ID) || modelId.toLowerCase().startsWith(ANTHROPIC_SONNET_46_DOT_MODEL_ID)) ? "adaptive" : void 0,
			resolveUsageAuth: async (ctx) => await ctx.resolveOAuthToken(),
			fetchUsageSnapshot: async (ctx) => await fetchClaudeUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn),
			isCacheTtlEligible: () => true,
			buildAuthDoctorHint: (ctx) => buildAnthropicAuthDoctorHint({
				config: ctx.config,
				store: ctx.store,
				profileId: ctx.profileId
			})
		});
		api.registerMediaUnderstandingProvider(anthropicMediaUnderstandingProvider);
	}
});
//#endregion
export { anthropic_default as default };
