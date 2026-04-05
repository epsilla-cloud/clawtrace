//#region src/plugins/memory-state.ts
const memoryPluginState = {};
function registerMemoryPromptSection(builder) {
	memoryPluginState.promptBuilder = builder;
}
function buildMemoryPromptSection(params) {
	return memoryPluginState.promptBuilder?.(params) ?? [];
}
function getMemoryPromptSectionBuilder() {
	return memoryPluginState.promptBuilder;
}
function registerMemoryFlushPlanResolver(resolver) {
	memoryPluginState.flushPlanResolver = resolver;
}
function resolveMemoryFlushPlan(params) {
	return memoryPluginState.flushPlanResolver?.(params) ?? null;
}
function getMemoryFlushPlanResolver() {
	return memoryPluginState.flushPlanResolver;
}
function registerMemoryRuntime(runtime) {
	memoryPluginState.runtime = runtime;
}
function getMemoryRuntime() {
	return memoryPluginState.runtime;
}
function hasMemoryRuntime() {
	return memoryPluginState.runtime !== void 0;
}
function restoreMemoryPluginState(state) {
	memoryPluginState.promptBuilder = state.promptBuilder;
	memoryPluginState.flushPlanResolver = state.flushPlanResolver;
	memoryPluginState.runtime = state.runtime;
}
function clearMemoryPluginState() {
	memoryPluginState.promptBuilder = void 0;
	memoryPluginState.flushPlanResolver = void 0;
	memoryPluginState.runtime = void 0;
}
//#endregion
export { getMemoryRuntime as a, registerMemoryPromptSection as c, restoreMemoryPluginState as d, getMemoryPromptSectionBuilder as i, registerMemoryRuntime as l, clearMemoryPluginState as n, hasMemoryRuntime as o, getMemoryFlushPlanResolver as r, registerMemoryFlushPlanResolver as s, buildMemoryPromptSection as t, resolveMemoryFlushPlan as u };
