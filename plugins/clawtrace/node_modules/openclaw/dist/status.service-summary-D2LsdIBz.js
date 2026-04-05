import { n as readGatewayServiceState } from "./service-6gftUGdu.js";
//#region src/commands/status.service-summary.ts
async function readServiceStatusSummary(service, fallbackLabel) {
	try {
		const state = await readGatewayServiceState(service, { env: process.env });
		const managedByOpenClaw = state.installed;
		const externallyManaged = !managedByOpenClaw && state.running;
		const installed = managedByOpenClaw || externallyManaged;
		const loadedText = externallyManaged ? "running (externally managed)" : state.loaded ? service.loadedText : service.notLoadedText;
		return {
			label: service.label,
			installed,
			loaded: state.loaded,
			managedByOpenClaw,
			externallyManaged,
			loadedText,
			runtime: state.runtime
		};
	} catch {
		return {
			label: fallbackLabel,
			installed: null,
			loaded: false,
			managedByOpenClaw: false,
			externallyManaged: false,
			loadedText: "unknown",
			runtime: void 0
		};
	}
}
//#endregion
export { readServiceStatusSummary as t };
