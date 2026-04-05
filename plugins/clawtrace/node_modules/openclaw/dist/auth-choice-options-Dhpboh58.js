import { i as resolveProviderSetupFlowContributions, t as resolveManifestProviderSetupFlowContributions } from "./provider-flow-DEDFQCTK.js";
import { a as resolveLegacyAuthChoiceAliasesForCli } from "./auth-choice-legacy-BxgA06M4.js";
//#region src/commands/auth-choice-options.static.ts
const CORE_AUTH_CHOICE_OPTIONS = [{
	value: "custom-api-key",
	label: "Custom Provider",
	hint: "Any OpenAI or Anthropic compatible endpoint",
	groupId: "custom",
	groupLabel: "Custom Provider",
	groupHint: "Any OpenAI or Anthropic compatible endpoint"
}];
function formatStaticAuthChoiceChoicesForCli(params) {
	const includeSkip = params?.includeSkip ?? true;
	const includeLegacyAliases = params?.includeLegacyAliases ?? false;
	const values = CORE_AUTH_CHOICE_OPTIONS.map((opt) => opt.value);
	if (includeSkip) values.push("skip");
	if (includeLegacyAliases) values.push(...resolveLegacyAuthChoiceAliasesForCli(params));
	return values.join("|");
}
//#endregion
//#region src/commands/auth-choice-options.ts
function compareOptionLabels(a, b) {
	return a.label.localeCompare(b.label);
}
function compareGroupLabels(a, b) {
	return a.label.localeCompare(b.label);
}
function resolveProviderChoiceOptions(params) {
	return resolveProviderSetupFlowContributions({
		...params,
		scope: "text-inference"
	}).map((contribution) => ({
		value: contribution.option.value,
		label: contribution.option.label,
		...contribution.option.hint ? { hint: contribution.option.hint } : {},
		...contribution.option.group ? {
			groupId: contribution.option.group.id,
			groupLabel: contribution.option.group.label,
			...contribution.option.group.hint ? { groupHint: contribution.option.group.hint } : {}
		} : {}
	}));
}
function formatAuthChoiceChoicesForCli(params) {
	const values = [...formatStaticAuthChoiceChoicesForCli(params).split("|"), ...resolveManifestProviderSetupFlowContributions({
		...params,
		scope: "text-inference"
	}).map((contribution) => contribution.option.value)];
	return [...new Set(values)].join("|");
}
function buildAuthChoiceOptions(params) {
	params.store;
	const optionByValue = /* @__PURE__ */ new Map();
	for (const option of CORE_AUTH_CHOICE_OPTIONS) optionByValue.set(option.value, option);
	for (const option of resolveProviderChoiceOptions({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	})) optionByValue.set(option.value, option);
	const options = Array.from(optionByValue.values()).toSorted(compareOptionLabels);
	if (params.includeSkip) options.push({
		value: "skip",
		label: "Skip for now"
	});
	return options;
}
function buildAuthChoiceGroups(params) {
	const options = buildAuthChoiceOptions({
		...params,
		includeSkip: false
	});
	const groupsById = /* @__PURE__ */ new Map();
	for (const option of options) {
		if (!option.groupId || !option.groupLabel) continue;
		const existing = groupsById.get(option.groupId);
		if (existing) {
			existing.options.push(option);
			continue;
		}
		groupsById.set(option.groupId, {
			value: option.groupId,
			label: option.groupLabel,
			...option.groupHint ? { hint: option.groupHint } : {},
			options: [option]
		});
	}
	return {
		groups: Array.from(groupsById.values()).map((group) => ({
			...group,
			options: [...group.options].toSorted(compareOptionLabels)
		})).toSorted(compareGroupLabels),
		skipOption: params.includeSkip ? {
			value: "skip",
			label: "Skip for now"
		} : void 0
	};
}
//#endregion
export { formatAuthChoiceChoicesForCli as n, buildAuthChoiceGroups as t };
