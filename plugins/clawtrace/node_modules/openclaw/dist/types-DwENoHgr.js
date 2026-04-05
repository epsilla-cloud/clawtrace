//#region src/flows/types.ts
function mergeFlowContributions(params) {
	const contributionByValue = /* @__PURE__ */ new Map();
	for (const contribution of params.primary) contributionByValue.set(contribution.option.value, contribution);
	for (const contribution of params.fallbacks ?? []) if (!contributionByValue.has(contribution.option.value)) contributionByValue.set(contribution.option.value, contribution);
	return [...contributionByValue.values()];
}
function sortFlowContributionsByLabel(contributions) {
	return [...contributions].toSorted((left, right) => left.option.label.localeCompare(right.option.label) || left.option.value.localeCompare(right.option.value));
}
//#endregion
export { sortFlowContributionsByLabel as n, mergeFlowContributions as t };
