import { x as shortenHomePath } from "./utils-BfvDpbwh.js";
import { Jh as resolveFastModeState, Kf as isProfileInCooldown, Mo as applyVerboseOverride, Vf as resolveAuthProfileOrder, fh as resolveSelectedAndActiveModel, kx as buildBrowseProvidersButton, qL as resolveAuthProfileDisplayLabel, qo as resolveUsableCustomProviderApiKey, rp as resolveModelsCommandReply, vN as updateSessionStore, xh as resolveQueueSettings, zI as applyModelOverrideToSessionEntry, zh as requestLiveSessionModelSwitch } from "./auth-profiles-B5ypC5S-.js";
import { d as resolveAuthStorePathForDisplay, n as ensureAuthProfileStore } from "./store-BpAvd-ka.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-Bd9aU9Z8.js";
import { n as formatXHighModelHint } from "./thinking.shared-CA9NbpNW.js";
import { a as resolveAgentDir, i as resolveAgentConfig, v as resolveSessionAgentId } from "./agent-scope-BSOSJbA_.js";
import { h as resolveConfiguredModelRef, l as modelKey, v as resolveModelRefFromString } from "./model-selection-CMtvxDDg.js";
import { t as resolveEnvApiKey } from "./model-auth-env-QeMWu7zp.js";
import { i as coerceSecretRef } from "./types.secrets-Rqz2qv-w.js";
import { r as enqueueSystemEvent } from "./system-events-BdYO0Ful.js";
import { K as resolveSandboxRuntimeStatus } from "./reply-payloads-dedupe-DO7H6ZY3.js";
import { i as supportsXHighThinking, t as formatThinkingLevels } from "./thinking-BIe_TekB.js";
import { a as formatElevatedRuntimeHint, c as formatInternalVerboseCurrentReplyOnlyText, d as resolveModelSelectionFromDirective, i as formatDirectiveAck, l as formatInternalVerbosePersistenceDeniedText, n as canPersistInternalVerboseDirective, o as formatElevatedUnavailableText, r as enqueueModeSwitchEvents, s as formatInternalExecPersistenceDeniedText, t as canPersistInternalExecDirective, u as withOptions } from "./directive-handling.shared-sWLfMxY4.js";
import { r as formatRemainingShort } from "./auth-health-BFEKDCTt.js";
import { t as maskApiKey } from "./mask-api-key-Bg4CgGMy.js";
//#region src/auto-reply/reply/directive-handling.auth.ts
function resolveStoredCredentialLabel(params) {
	const masked = maskApiKey(typeof params.value === "string" ? params.value : "");
	if (masked !== "missing") return masked;
	if (coerceSecretRef(params.refValue)) return params.mode === "compact" ? "(ref)" : "ref";
	return "missing";
}
function formatExpirationLabel(expires, now, formatUntil, compactExpiredPrefix = " expired") {
	if (typeof expires !== "number" || !Number.isFinite(expires) || expires <= 0) return "";
	return expires <= now ? compactExpiredPrefix : ` exp ${formatUntil(expires)}`;
}
function formatFlagsSuffix(flags) {
	return flags.length > 0 ? ` (${flags.join(", ")})` : "";
}
const resolveAuthLabel = async (provider, cfg, modelsPath, agentDir, mode = "compact") => {
	const formatPath = (value) => shortenHomePath(value);
	const store = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
	const order = resolveAuthProfileOrder({
		cfg,
		store,
		provider
	});
	const providerKey = normalizeProviderId(provider);
	const lastGood = findNormalizedProviderValue(store.lastGood, providerKey);
	const nextProfileId = order[0];
	const now = Date.now();
	const formatUntil = (timestampMs) => formatRemainingShort(timestampMs - now, { underMinuteLabel: "soon" });
	if (order.length > 0) {
		if (mode === "compact") {
			const profileId = nextProfileId;
			if (!profileId) return {
				label: "missing",
				source: "missing"
			};
			const profile = store.profiles[profileId];
			const configProfile = cfg.auth?.profiles?.[profileId];
			const missing = !profile || configProfile?.provider && configProfile.provider !== profile.provider || configProfile?.mode && configProfile.mode !== profile.type && !(configProfile.mode === "oauth" && profile.type === "token");
			const more = order.length > 1 ? ` (+${order.length - 1})` : "";
			if (missing) return {
				label: `${profileId} missing${more}`,
				source: ""
			};
			if (profile.type === "api_key") return {
				label: `${profileId} api-key ${resolveStoredCredentialLabel({
					value: profile.key,
					refValue: profile.keyRef,
					mode
				})}${more}`,
				source: ""
			};
			if (profile.type === "token") return {
				label: `${profileId} token ${resolveStoredCredentialLabel({
					value: profile.token,
					refValue: profile.tokenRef,
					mode
				})}${formatExpirationLabel(profile.expires, now, formatUntil)}${more}`,
				source: ""
			};
			const display = resolveAuthProfileDisplayLabel({
				cfg,
				store,
				profileId
			});
			return {
				label: `${display === profileId ? profileId : display} oauth${formatExpirationLabel(profile.expires, now, formatUntil)}${more}`,
				source: ""
			};
		}
		return {
			label: order.map((profileId) => {
				const profile = store.profiles[profileId];
				const configProfile = cfg.auth?.profiles?.[profileId];
				const flags = [];
				if (profileId === nextProfileId) flags.push("next");
				if (lastGood && profileId === lastGood) flags.push("lastGood");
				if (isProfileInCooldown(store, profileId)) {
					const until = store.usageStats?.[profileId]?.cooldownUntil;
					if (typeof until === "number" && Number.isFinite(until) && until > now) flags.push(`cooldown ${formatUntil(until)}`);
					else flags.push("cooldown");
				}
				if (!profile || configProfile?.provider && configProfile.provider !== profile.provider || configProfile?.mode && configProfile.mode !== profile.type && !(configProfile.mode === "oauth" && profile.type === "token")) return `${profileId}=missing${formatFlagsSuffix(flags)}`;
				if (profile.type === "api_key") return `${profileId}=${resolveStoredCredentialLabel({
					value: profile.key,
					refValue: profile.keyRef,
					mode
				})}${formatFlagsSuffix(flags)}`;
				if (profile.type === "token") {
					const tokenLabel = resolveStoredCredentialLabel({
						value: profile.token,
						refValue: profile.tokenRef,
						mode
					});
					const expirationFlag = formatExpirationLabel(profile.expires, now, formatUntil, "expired");
					if (expirationFlag) flags.push(expirationFlag);
					return `${profileId}=token:${tokenLabel}${formatFlagsSuffix(flags)}`;
				}
				const display = resolveAuthProfileDisplayLabel({
					cfg,
					store,
					profileId
				});
				const suffix = display === profileId ? "" : display.startsWith(profileId) ? display.slice(profileId.length).trim() : `(${display})`;
				const expirationFlag = formatExpirationLabel(profile.expires, now, formatUntil, "expired");
				if (expirationFlag) flags.push(expirationFlag);
				return `${profileId}=OAuth${suffix ? ` ${suffix}` : ""}${formatFlagsSuffix(flags)}`;
			}).join(", "),
			source: `auth-profiles.json: ${formatPath(resolveAuthStorePathForDisplay(agentDir))}`
		};
	}
	const envKey = resolveEnvApiKey(provider);
	if (envKey) return {
		label: envKey.source.includes("ANTHROPIC_OAUTH_TOKEN") || envKey.source.toLowerCase().includes("oauth") ? "OAuth (env)" : maskApiKey(envKey.apiKey),
		source: mode === "verbose" ? envKey.source : ""
	};
	const customKey = resolveUsableCustomProviderApiKey({
		cfg,
		provider
	})?.apiKey;
	if (customKey) return {
		label: maskApiKey(customKey),
		source: mode === "verbose" ? `models.json: ${formatPath(modelsPath)}` : ""
	};
	return {
		label: "missing",
		source: "missing"
	};
};
const formatAuthLabel = (auth) => {
	if (!auth.source || auth.source === auth.label || auth.source === "missing") return auth.label;
	return `${auth.label} (${auth.source})`;
};
new Map([
	"anthropic",
	"openai",
	"openai-codex",
	"minimax",
	"synthetic",
	"google",
	"zai",
	"openrouter",
	"opencode",
	"opencode-go",
	"github-copilot",
	"groq",
	"cerebras",
	"mistral",
	"xai",
	"lmstudio"
].map((provider, idx) => [provider, idx]));
function resolveProviderEndpointLabel(provider, cfg) {
	const normalized = normalizeProviderId(provider);
	const entry = findNormalizedProviderValue(cfg.models?.providers ?? {}, normalized);
	const endpoint = entry?.baseUrl?.trim();
	const api = entry?.api?.trim();
	return {
		endpoint: endpoint || void 0,
		api: api || void 0
	};
}
//#endregion
//#region src/auto-reply/reply/directive-handling.model.ts
function pushUniqueCatalogEntry(params) {
	const provider = normalizeProviderId(params.provider);
	const id = String(params.id ?? "").trim();
	if (!provider || !id) return;
	const key = modelKey(provider, id);
	if (params.keys.has(key)) return;
	params.keys.add(key);
	params.out.push({
		provider,
		id,
		name: params.fallbackNameToId ? params.name ?? id : params.name
	});
}
function buildModelPickerCatalog(params) {
	const resolvedDefault = resolveConfiguredModelRef({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel
	});
	const buildConfiguredCatalog = () => {
		const out = [];
		const keys = /* @__PURE__ */ new Set();
		const pushRef = (ref, name) => {
			pushUniqueCatalogEntry({
				keys,
				out,
				provider: ref.provider,
				id: ref.model,
				name,
				fallbackNameToId: true
			});
		};
		const pushRaw = (raw) => {
			const value = String(raw ?? "").trim();
			if (!value) return;
			const resolved = resolveModelRefFromString({
				raw: value,
				defaultProvider: params.defaultProvider,
				aliasIndex: params.aliasIndex
			});
			if (!resolved) return;
			pushRef(resolved.ref);
		};
		pushRef(resolvedDefault);
		const modelConfig = params.cfg.agents?.defaults?.model;
		const modelFallbacks = modelConfig && typeof modelConfig === "object" ? modelConfig.fallbacks ?? [] : [];
		for (const fallback of modelFallbacks) pushRaw(String(fallback ?? ""));
		const imageConfig = params.cfg.agents?.defaults?.imageModel;
		if (imageConfig && typeof imageConfig === "object") {
			pushRaw(imageConfig.primary);
			for (const fallback of imageConfig.fallbacks ?? []) pushRaw(String(fallback ?? ""));
		}
		for (const raw of Object.keys(params.cfg.agents?.defaults?.models ?? {})) pushRaw(raw);
		return out;
	};
	const keys = /* @__PURE__ */ new Set();
	const out = [];
	const push = (entry) => {
		pushUniqueCatalogEntry({
			keys,
			out,
			provider: entry.provider,
			id: String(entry.id ?? ""),
			name: entry.name,
			fallbackNameToId: false
		});
	};
	if (!(Object.keys(params.cfg.agents?.defaults?.models ?? {}).length > 0)) {
		for (const entry of params.allowedModelCatalog) push({
			provider: entry.provider,
			id: entry.id ?? "",
			name: entry.name
		});
		for (const entry of buildConfiguredCatalog()) push(entry);
		return out;
	}
	for (const entry of params.allowedModelCatalog) push({
		provider: entry.provider,
		id: entry.id ?? "",
		name: entry.name
	});
	for (const raw of Object.keys(params.cfg.agents?.defaults?.models ?? {})) {
		const resolved = resolveModelRefFromString({
			raw: String(raw),
			defaultProvider: params.defaultProvider,
			aliasIndex: params.aliasIndex
		});
		if (!resolved) continue;
		push({
			provider: resolved.ref.provider,
			id: resolved.ref.model,
			name: resolved.ref.model
		});
	}
	if (resolvedDefault.model) push({
		provider: resolvedDefault.provider,
		id: resolvedDefault.model,
		name: resolvedDefault.model
	});
	return out;
}
async function maybeHandleModelDirectiveInfo(params) {
	if (!params.directives.hasModelDirective) return;
	const rawDirective = params.directives.rawModelDirective?.trim();
	const directive = rawDirective?.toLowerCase();
	const wantsStatus = directive === "status";
	const wantsSummary = !rawDirective;
	const wantsLegacyList = directive === "list";
	if (!wantsSummary && !wantsStatus && !wantsLegacyList) return;
	if (params.directives.rawModelProfile) return { text: "Auth profile override requires a model selection." };
	const pickerCatalog = buildModelPickerCatalog({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		aliasIndex: params.aliasIndex,
		allowedModelCatalog: params.allowedModelCatalog
	});
	if (wantsLegacyList) return await resolveModelsCommandReply({
		cfg: params.cfg,
		commandBodyNormalized: "/models"
	}) ?? { text: "No models available." };
	if (wantsSummary) {
		const modelRefs = resolveSelectedAndActiveModel({
			selectedProvider: params.provider,
			selectedModel: params.model,
			sessionEntry: params.sessionEntry
		});
		const current = modelRefs.selected.label;
		const isTelegram = params.surface === "telegram";
		const activeRuntimeLine = modelRefs.activeDiffers ? `Active: ${modelRefs.active.label} (runtime)` : null;
		if (isTelegram) {
			const buttons = buildBrowseProvidersButton();
			return {
				text: [
					`Current: ${current}${modelRefs.activeDiffers ? " (selected)" : ""}`,
					activeRuntimeLine,
					"",
					"Tap below to browse models, or use:",
					"/model <provider/model> to switch",
					"/model status for details"
				].filter(Boolean).join("\n"),
				channelData: { telegram: { buttons } }
			};
		}
		return { text: [
			`Current: ${current}${modelRefs.activeDiffers ? " (selected)" : ""}`,
			activeRuntimeLine,
			"",
			"Switch: /model <provider/model>",
			"Browse: /models (providers) or /models <provider> (models)",
			"More: /model status"
		].filter(Boolean).join("\n") };
	}
	const modelsPath = `${params.agentDir}/models.json`;
	const formatPath = (value) => shortenHomePath(value);
	const authMode = "verbose";
	if (pickerCatalog.length === 0) return { text: "No models available." };
	const authByProvider = /* @__PURE__ */ new Map();
	for (const entry of pickerCatalog) {
		const provider = normalizeProviderId(entry.provider);
		if (authByProvider.has(provider)) continue;
		const auth = await resolveAuthLabel(provider, params.cfg, modelsPath, params.agentDir, authMode);
		authByProvider.set(provider, formatAuthLabel(auth));
	}
	const modelRefs = resolveSelectedAndActiveModel({
		selectedProvider: params.provider,
		selectedModel: params.model,
		sessionEntry: params.sessionEntry
	});
	const current = modelRefs.selected.label;
	const defaultLabel = `${params.defaultProvider}/${params.defaultModel}`;
	const lines = [
		`Current: ${current}${modelRefs.activeDiffers ? " (selected)" : ""}`,
		modelRefs.activeDiffers ? `Active: ${modelRefs.active.label} (runtime)` : null,
		`Default: ${defaultLabel}`,
		`Agent: ${params.activeAgentId}`,
		`Auth file: ${formatPath(resolveAuthStorePathForDisplay(params.agentDir))}`
	].filter((line) => Boolean(line));
	if (params.resetModelOverride) lines.push(`(previous selection reset to default)`);
	const byProvider = /* @__PURE__ */ new Map();
	for (const entry of pickerCatalog) {
		const provider = normalizeProviderId(entry.provider);
		const models = byProvider.get(provider);
		if (models) {
			models.push(entry);
			continue;
		}
		byProvider.set(provider, [entry]);
	}
	for (const provider of byProvider.keys()) {
		const models = byProvider.get(provider);
		if (!models) continue;
		const authLabel = authByProvider.get(provider) ?? "missing";
		const endpoint = resolveProviderEndpointLabel(provider, params.cfg);
		const endpointSuffix = endpoint.endpoint ? ` endpoint: ${endpoint.endpoint}` : " endpoint: default";
		const apiSuffix = endpoint.api ? ` api: ${endpoint.api}` : "";
		lines.push("");
		lines.push(`[${provider}]${endpointSuffix}${apiSuffix} auth: ${authLabel}`);
		for (const entry of models) {
			const label = `${provider}/${entry.id}`;
			const aliases = params.aliasIndex.byKey.get(label);
			const aliasSuffix = aliases && aliases.length > 0 ? ` (${aliases.join(", ")})` : "";
			lines.push(`  • ${label}${aliasSuffix}`);
		}
	}
	return { text: lines.join("\n") };
}
//#endregion
//#region src/auto-reply/reply/directive-handling.queue-validation.ts
function maybeHandleQueueDirective(params) {
	const { directives } = params;
	if (!directives.hasQueueDirective) return;
	if (!directives.queueMode && !directives.queueReset && !directives.hasQueueOptions && directives.rawQueueMode === void 0 && directives.rawDebounce === void 0 && directives.rawCap === void 0 && directives.rawDrop === void 0) {
		const settings = resolveQueueSettings({
			cfg: params.cfg,
			channel: params.channel,
			sessionEntry: params.sessionEntry
		});
		const debounceLabel = typeof settings.debounceMs === "number" ? `${settings.debounceMs}ms` : "default";
		const capLabel = typeof settings.cap === "number" ? String(settings.cap) : "default";
		const dropLabel = settings.dropPolicy ?? "default";
		return { text: withOptions(`Current queue settings: mode=${settings.mode}, debounce=${debounceLabel}, cap=${capLabel}, drop=${dropLabel}.`, "modes steer, followup, collect, steer+backlog, interrupt; debounce:<ms|s|m>, cap:<n>, drop:old|new|summarize") };
	}
	const queueModeInvalid = !directives.queueMode && !directives.queueReset && Boolean(directives.rawQueueMode);
	const queueDebounceInvalid = directives.rawDebounce !== void 0 && typeof directives.debounceMs !== "number";
	const queueCapInvalid = directives.rawCap !== void 0 && typeof directives.cap !== "number";
	const queueDropInvalid = directives.rawDrop !== void 0 && !directives.dropPolicy;
	if (queueModeInvalid || queueDebounceInvalid || queueCapInvalid || queueDropInvalid) {
		const errors = [];
		if (queueModeInvalid) errors.push(`Unrecognized queue mode "${directives.rawQueueMode ?? ""}". Valid modes: steer, followup, collect, steer+backlog, interrupt.`);
		if (queueDebounceInvalid) errors.push(`Invalid debounce "${directives.rawDebounce ?? ""}". Use ms/s/m (e.g. debounce:1500ms, debounce:2s).`);
		if (queueCapInvalid) errors.push(`Invalid cap "${directives.rawCap ?? ""}". Use a positive integer (e.g. cap:10).`);
		if (queueDropInvalid) errors.push(`Invalid drop policy "${directives.rawDrop ?? ""}". Use drop:old, drop:new, or drop:summarize.`);
		return { text: errors.join(" ") };
	}
}
//#endregion
//#region src/auto-reply/reply/directive-handling.impl.ts
function resolveExecDefaults(params) {
	const globalExec = params.cfg.tools?.exec;
	const agentExec = params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.tools?.exec : void 0;
	return {
		host: params.sessionEntry?.execHost ?? agentExec?.host ?? globalExec?.host ?? "sandbox",
		security: params.sessionEntry?.execSecurity ?? agentExec?.security ?? globalExec?.security ?? "deny",
		ask: params.sessionEntry?.execAsk ?? agentExec?.ask ?? globalExec?.ask ?? "on-miss",
		node: params.sessionEntry?.execNode ?? agentExec?.node ?? globalExec?.node
	};
}
async function handleDirectiveOnly(params) {
	const { directives, sessionEntry, sessionStore, sessionKey, storePath, elevatedEnabled, elevatedAllowed, defaultProvider, defaultModel, aliasIndex, allowedModelKeys, allowedModelCatalog, resetModelOverride, provider, model, initialModelLabel, formatModelSwitchEvent, currentThinkLevel, currentFastMode, currentVerboseLevel, currentReasoningLevel, currentElevatedLevel } = params;
	const activeAgentId = resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const agentDir = resolveAgentDir(params.cfg, activeAgentId);
	const runtimeIsSandboxed = resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey
	}).sandboxed;
	const shouldHintDirectRuntime = directives.hasElevatedDirective && !runtimeIsSandboxed;
	const allowInternalExecPersistence = canPersistInternalExecDirective({
		messageProvider: params.messageProvider,
		surface: params.surface,
		gatewayClientScopes: params.gatewayClientScopes
	});
	const allowInternalVerbosePersistence = canPersistInternalVerboseDirective({
		messageProvider: params.messageProvider,
		surface: params.surface,
		gatewayClientScopes: params.gatewayClientScopes
	});
	const modelInfo = await maybeHandleModelDirectiveInfo({
		directives,
		cfg: params.cfg,
		agentDir,
		activeAgentId,
		provider,
		model,
		defaultProvider,
		defaultModel,
		aliasIndex,
		allowedModelCatalog,
		resetModelOverride,
		surface: params.surface,
		sessionEntry
	});
	if (modelInfo) return modelInfo;
	const modelResolution = resolveModelSelectionFromDirective({
		directives,
		cfg: params.cfg,
		agentDir,
		defaultProvider,
		defaultModel,
		aliasIndex,
		allowedModelKeys,
		allowedModelCatalog,
		provider
	});
	if (modelResolution.errorText) return { text: modelResolution.errorText };
	const modelSelection = modelResolution.modelSelection;
	const profileOverride = modelResolution.profileOverride;
	const resolvedProvider = modelSelection?.provider ?? provider;
	const resolvedModel = modelSelection?.model ?? model;
	const fastModeState = resolveFastModeState({
		cfg: params.cfg,
		provider: resolvedProvider,
		model: resolvedModel,
		agentId: activeAgentId,
		sessionEntry
	});
	const effectiveFastMode = directives.fastMode ?? currentFastMode ?? fastModeState.enabled;
	const effectiveFastModeSource = directives.fastMode !== void 0 ? "session" : fastModeState.source;
	if (directives.hasThinkDirective && !directives.thinkLevel) {
		if (!directives.rawThinkLevel) return { text: withOptions(`Current thinking level: ${currentThinkLevel ?? "off"}.`, formatThinkingLevels(resolvedProvider, resolvedModel)) };
		return { text: `Unrecognized thinking level "${directives.rawThinkLevel}". Valid levels: ${formatThinkingLevels(resolvedProvider, resolvedModel)}.` };
	}
	if (directives.hasVerboseDirective && !directives.verboseLevel) {
		if (!directives.rawVerboseLevel) return { text: withOptions(`Current verbose level: ${currentVerboseLevel ?? "off"}.`, "on, full, off") };
		return { text: `Unrecognized verbose level "${directives.rawVerboseLevel}". Valid levels: off, on, full.` };
	}
	if (directives.hasFastDirective && directives.fastMode === void 0) {
		if (!directives.rawFastMode) return { text: withOptions(`Current fast mode: ${effectiveFastMode ? "on" : "off"}${effectiveFastModeSource === "config" ? " (config)" : effectiveFastModeSource === "default" ? " (default)" : ""}.`, "on, off") };
		return { text: `Unrecognized fast mode "${directives.rawFastMode}". Valid levels: on, off.` };
	}
	if (directives.hasReasoningDirective && !directives.reasoningLevel) {
		if (!directives.rawReasoningLevel) return { text: withOptions(`Current reasoning level: ${currentReasoningLevel ?? "off"}.`, "on, off, stream") };
		return { text: `Unrecognized reasoning level "${directives.rawReasoningLevel}". Valid levels: on, off, stream.` };
	}
	if (directives.hasElevatedDirective && !directives.elevatedLevel) {
		if (!directives.rawElevatedLevel) {
			if (!elevatedEnabled || !elevatedAllowed) return { text: formatElevatedUnavailableText({
				runtimeSandboxed: runtimeIsSandboxed,
				failures: params.elevatedFailures,
				sessionKey: params.sessionKey
			}) };
			return { text: [withOptions(`Current elevated level: ${currentElevatedLevel ?? "off"}.`, "on, off, ask, full"), shouldHintDirectRuntime ? formatElevatedRuntimeHint() : null].filter(Boolean).join("\n") };
		}
		return { text: `Unrecognized elevated level "${directives.rawElevatedLevel}". Valid levels: off, on, ask, full.` };
	}
	if (directives.hasElevatedDirective && (!elevatedEnabled || !elevatedAllowed)) return { text: formatElevatedUnavailableText({
		runtimeSandboxed: runtimeIsSandboxed,
		failures: params.elevatedFailures,
		sessionKey: params.sessionKey
	}) };
	if (directives.hasExecDirective) {
		if (directives.invalidExecHost) return { text: `Unrecognized exec host "${directives.rawExecHost ?? ""}". Valid hosts: sandbox, gateway, node.` };
		if (directives.invalidExecSecurity) return { text: `Unrecognized exec security "${directives.rawExecSecurity ?? ""}". Valid: deny, allowlist, full.` };
		if (directives.invalidExecAsk) return { text: `Unrecognized exec ask "${directives.rawExecAsk ?? ""}". Valid: off, on-miss, always.` };
		if (directives.invalidExecNode) return { text: "Exec node requires a value." };
		if (!directives.hasExecOptions) {
			const execDefaults = resolveExecDefaults({
				cfg: params.cfg,
				sessionEntry,
				agentId: activeAgentId
			});
			const nodeLabel = execDefaults.node ? `node=${execDefaults.node}` : "node=(unset)";
			return { text: withOptions(`Current exec defaults: host=${execDefaults.host}, security=${execDefaults.security}, ask=${execDefaults.ask}, ${nodeLabel}.`, "host=sandbox|gateway|node, security=deny|allowlist|full, ask=off|on-miss|always, node=<id>") };
		}
	}
	const queueAck = maybeHandleQueueDirective({
		directives,
		cfg: params.cfg,
		channel: provider,
		sessionEntry
	});
	if (queueAck) return queueAck;
	if (directives.hasThinkDirective && directives.thinkLevel === "xhigh" && !supportsXHighThinking(resolvedProvider, resolvedModel)) return { text: `Thinking level "xhigh" is only supported for ${formatXHighModelHint()}.` };
	const nextThinkLevel = directives.hasThinkDirective ? directives.thinkLevel : sessionEntry?.thinkingLevel ?? currentThinkLevel;
	const shouldDowngradeXHigh = !directives.hasThinkDirective && nextThinkLevel === "xhigh" && !supportsXHighThinking(resolvedProvider, resolvedModel);
	const prevElevatedLevel = currentElevatedLevel ?? sessionEntry.elevatedLevel ?? (elevatedAllowed ? "on" : "off");
	const prevReasoningLevel = currentReasoningLevel ?? sessionEntry.reasoningLevel ?? "off";
	let elevatedChanged = directives.hasElevatedDirective && directives.elevatedLevel !== void 0 && elevatedEnabled && elevatedAllowed;
	let modelSelectionUpdated = false;
	const shouldPersistSessionEntry = directives.hasThinkDirective && Boolean(directives.thinkLevel) || directives.hasFastDirective && directives.fastMode !== void 0 || directives.hasVerboseDirective && Boolean(directives.verboseLevel) && allowInternalVerbosePersistence || directives.hasReasoningDirective && Boolean(directives.reasoningLevel) || directives.hasElevatedDirective && Boolean(directives.elevatedLevel) || directives.hasExecDirective && directives.hasExecOptions && allowInternalExecPersistence || Boolean(modelSelection) || directives.hasQueueDirective || shouldDowngradeXHigh;
	const fastModeChanged = directives.hasFastDirective && directives.fastMode !== void 0 && directives.fastMode !== currentFastMode;
	let reasoningChanged = directives.hasReasoningDirective && directives.reasoningLevel !== void 0;
	if (shouldPersistSessionEntry) {
		if (directives.hasThinkDirective && directives.thinkLevel) sessionEntry.thinkingLevel = directives.thinkLevel;
		if (directives.hasFastDirective && directives.fastMode !== void 0) sessionEntry.fastMode = directives.fastMode;
		if (shouldDowngradeXHigh) sessionEntry.thinkingLevel = "high";
		if (directives.hasVerboseDirective && directives.verboseLevel && allowInternalVerbosePersistence) applyVerboseOverride(sessionEntry, directives.verboseLevel);
		if (directives.hasReasoningDirective && directives.reasoningLevel) {
			if (directives.reasoningLevel === "off") sessionEntry.reasoningLevel = "off";
			else sessionEntry.reasoningLevel = directives.reasoningLevel;
			reasoningChanged = directives.reasoningLevel !== prevReasoningLevel && directives.reasoningLevel !== void 0;
		}
		if (directives.hasElevatedDirective && directives.elevatedLevel) {
			sessionEntry.elevatedLevel = directives.elevatedLevel;
			elevatedChanged = elevatedChanged || directives.elevatedLevel !== prevElevatedLevel && directives.elevatedLevel !== void 0;
		}
		if (directives.hasExecDirective && directives.hasExecOptions && allowInternalExecPersistence) {
			if (directives.execHost) sessionEntry.execHost = directives.execHost;
			if (directives.execSecurity) sessionEntry.execSecurity = directives.execSecurity;
			if (directives.execAsk) sessionEntry.execAsk = directives.execAsk;
			if (directives.execNode) sessionEntry.execNode = directives.execNode;
		}
		if (modelSelection) modelSelectionUpdated = applyModelOverrideToSessionEntry({
			entry: sessionEntry,
			selection: modelSelection,
			profileOverride
		}).updated;
		if (directives.hasQueueDirective && directives.queueReset) {
			delete sessionEntry.queueMode;
			delete sessionEntry.queueDebounceMs;
			delete sessionEntry.queueCap;
			delete sessionEntry.queueDrop;
		} else if (directives.hasQueueDirective) {
			if (directives.queueMode) sessionEntry.queueMode = directives.queueMode;
			if (typeof directives.debounceMs === "number") sessionEntry.queueDebounceMs = directives.debounceMs;
			if (typeof directives.cap === "number") sessionEntry.queueCap = directives.cap;
			if (directives.dropPolicy) sessionEntry.queueDrop = directives.dropPolicy;
		}
		sessionEntry.updatedAt = Date.now();
		sessionStore[sessionKey] = sessionEntry;
		if (storePath) await updateSessionStore(storePath, (store) => {
			store[sessionKey] = sessionEntry;
		});
		if (modelSelection && modelSelectionUpdated) requestLiveSessionModelSwitch({
			sessionEntry,
			selection: {
				provider: modelSelection.provider,
				model: modelSelection.model,
				authProfileId: profileOverride,
				authProfileIdSource: profileOverride ? "user" : void 0
			}
		});
	}
	if (modelSelection) {
		const nextLabel = `${modelSelection.provider}/${modelSelection.model}`;
		if (nextLabel !== initialModelLabel) enqueueSystemEvent(formatModelSwitchEvent(nextLabel, modelSelection.alias), {
			sessionKey,
			contextKey: `model:${nextLabel}`
		});
	}
	enqueueModeSwitchEvents({
		enqueueSystemEvent,
		sessionEntry,
		sessionKey,
		elevatedChanged,
		reasoningChanged
	});
	const parts = [];
	if (directives.hasThinkDirective && directives.thinkLevel) parts.push(directives.thinkLevel === "off" ? "Thinking disabled." : `Thinking level set to ${directives.thinkLevel}.`);
	if (directives.hasFastDirective && directives.fastMode !== void 0) parts.push(directives.fastMode ? formatDirectiveAck("Fast mode enabled.") : formatDirectiveAck("Fast mode disabled."));
	if (directives.hasVerboseDirective && directives.verboseLevel) parts.push(!allowInternalVerbosePersistence ? formatDirectiveAck(formatInternalVerboseCurrentReplyOnlyText()) : directives.verboseLevel === "off" ? formatDirectiveAck("Verbose logging disabled.") : directives.verboseLevel === "full" ? formatDirectiveAck("Verbose logging set to full.") : formatDirectiveAck("Verbose logging enabled."));
	if (directives.hasVerboseDirective && directives.verboseLevel && !allowInternalVerbosePersistence) parts.push(formatDirectiveAck(formatInternalVerbosePersistenceDeniedText()));
	if (directives.hasReasoningDirective && directives.reasoningLevel) parts.push(directives.reasoningLevel === "off" ? formatDirectiveAck("Reasoning visibility disabled.") : directives.reasoningLevel === "stream" ? formatDirectiveAck("Reasoning stream enabled (Telegram only).") : formatDirectiveAck("Reasoning visibility enabled."));
	if (directives.hasElevatedDirective && directives.elevatedLevel) {
		parts.push(directives.elevatedLevel === "off" ? formatDirectiveAck("Elevated mode disabled.") : directives.elevatedLevel === "full" ? formatDirectiveAck("Elevated mode set to full (auto-approve).") : formatDirectiveAck("Elevated mode set to ask (approvals may still apply)."));
		if (shouldHintDirectRuntime) parts.push(formatElevatedRuntimeHint());
	}
	if (directives.hasExecDirective && directives.hasExecOptions && allowInternalExecPersistence) {
		const execParts = [];
		if (directives.execHost) execParts.push(`host=${directives.execHost}`);
		if (directives.execSecurity) execParts.push(`security=${directives.execSecurity}`);
		if (directives.execAsk) execParts.push(`ask=${directives.execAsk}`);
		if (directives.execNode) execParts.push(`node=${directives.execNode}`);
		if (execParts.length > 0) parts.push(formatDirectiveAck(`Exec defaults set (${execParts.join(", ")}).`));
	}
	if (directives.hasExecDirective && directives.hasExecOptions && !allowInternalExecPersistence) parts.push(formatDirectiveAck(formatInternalExecPersistenceDeniedText()));
	if (shouldDowngradeXHigh) parts.push(`Thinking level set to high (xhigh not supported for ${resolvedProvider}/${resolvedModel}).`);
	if (modelSelection) {
		const label = `${modelSelection.provider}/${modelSelection.model}`;
		const labelWithAlias = modelSelection.alias ? `${modelSelection.alias} (${label})` : label;
		parts.push(modelSelection.isDefault ? `Model reset to default (${labelWithAlias}).` : `Model set to ${labelWithAlias}.`);
		if (profileOverride) parts.push(`Auth profile set to ${profileOverride}.`);
	}
	if (directives.hasQueueDirective && directives.queueMode) parts.push(formatDirectiveAck(`Queue mode set to ${directives.queueMode}.`));
	else if (directives.hasQueueDirective && directives.queueReset) parts.push(formatDirectiveAck("Queue mode reset to default."));
	if (directives.hasQueueDirective && typeof directives.debounceMs === "number") parts.push(formatDirectiveAck(`Queue debounce set to ${directives.debounceMs}ms.`));
	if (directives.hasQueueDirective && typeof directives.cap === "number") parts.push(formatDirectiveAck(`Queue cap set to ${directives.cap}.`));
	if (directives.hasQueueDirective && directives.dropPolicy) parts.push(formatDirectiveAck(`Queue drop set to ${directives.dropPolicy}.`));
	if (fastModeChanged) enqueueSystemEvent(`Fast mode ${sessionEntry.fastMode ? "enabled" : "disabled"}.`, {
		sessionKey,
		contextKey: `fast:${sessionEntry.fastMode ? "on" : "off"}`
	});
	const ack = parts.join(" ").trim();
	if (!ack && directives.hasStatusDirective) return;
	return { text: ack || "OK." };
}
//#endregion
export { handleDirectiveOnly as t };
