import { f as readClaudeCliCredentialsCached } from "./store-BpAvd-ka.js";
import "./provider-auth-Bd38MUDZ.js";
//#region extensions/anthropic/cli-migration.ts
const DEFAULT_CLAUDE_CLI_MODEL = "claude-cli/claude-sonnet-4-6";
function toClaudeCliModelRef(raw) {
	const trimmed = raw.trim();
	if (!trimmed.toLowerCase().startsWith("anthropic/")) return null;
	const modelId = trimmed.slice(10).trim();
	if (!modelId.toLowerCase().startsWith("claude-")) return null;
	return `claude-cli/${modelId}`;
}
function rewriteModelSelection(model) {
	if (typeof model === "string") {
		const converted = toClaudeCliModelRef(model);
		return converted ? {
			value: converted,
			primary: converted,
			changed: true
		} : {
			value: model,
			changed: false
		};
	}
	if (!model || typeof model !== "object" || Array.isArray(model)) return {
		value: model,
		changed: false
	};
	const current = model;
	const next = { ...current };
	let changed = false;
	let primary;
	if (typeof current.primary === "string") {
		const converted = toClaudeCliModelRef(current.primary);
		if (converted) {
			next.primary = converted;
			primary = converted;
			changed = true;
		}
	}
	const currentFallbacks = current.fallbacks;
	if (Array.isArray(currentFallbacks)) {
		const nextFallbacks = currentFallbacks.map((entry) => typeof entry === "string" ? toClaudeCliModelRef(entry) ?? entry : entry);
		if (nextFallbacks.some((entry, index) => entry !== currentFallbacks[index])) {
			next.fallbacks = nextFallbacks;
			changed = true;
		}
	}
	return {
		value: changed ? next : model,
		...primary ? { primary } : {},
		changed
	};
}
function rewriteModelEntryMap(models) {
	if (!models) return {
		value: models,
		migrated: []
	};
	const next = { ...models };
	const migrated = [];
	for (const [rawKey, value] of Object.entries(models)) {
		const converted = toClaudeCliModelRef(rawKey);
		if (!converted) continue;
		if (!(converted in next)) next[converted] = value;
		delete next[rawKey];
		migrated.push(converted);
	}
	return {
		value: migrated.length > 0 ? next : models,
		migrated
	};
}
function hasClaudeCliAuth() {
	return Boolean(readClaudeCliCredentialsCached());
}
function buildAnthropicCliMigrationResult(config) {
	const defaults = config.agents?.defaults;
	const rewrittenModel = rewriteModelSelection(defaults?.model);
	const rewrittenModels = rewriteModelEntryMap(defaults?.models);
	const existingModels = rewrittenModels.value ?? defaults?.models ?? {};
	const defaultModel = rewrittenModel.primary ?? DEFAULT_CLAUDE_CLI_MODEL;
	return {
		profiles: [],
		configPatch: { agents: { defaults: {
			...rewrittenModel.changed ? { model: rewrittenModel.value } : {},
			models: {
				...existingModels,
				[defaultModel]: existingModels[defaultModel] ?? {}
			}
		} } },
		defaultModel,
		notes: [
			"Claude CLI auth detected; switched Anthropic model selection to the local Claude CLI backend.",
			"Existing Anthropic auth profiles are kept for rollback.",
			...rewrittenModels.migrated.length > 0 ? [`Migrated allowlist entries: ${rewrittenModels.migrated.join(", ")}.`] : []
		]
	};
}
//#endregion
export { hasClaudeCliAuth as n, buildAnthropicCliMigrationResult as t };
