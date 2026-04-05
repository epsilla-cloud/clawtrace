import { m as defaultRuntime } from "./subsystem-CJEvHE2o.js";
import { r as theme } from "./theme-D-TumEpz.js";
import { x as writeConfigFile } from "./auth-profiles-B5ypC5S-.js";
import { n as enablePluginInConfig } from "./provider-web-search-I-919IKa.js";
import { t as buildNpmResolutionFields } from "./install-source-utils-DICepj-h.js";
import { d as logSlotWarnings, o as enableInternalHookEntries, t as applySlotSelectionForPlugin, u as logHookPackRestartHint } from "./plugins-command-helpers-Cp3O_xvW.js";
import { n as recordPluginInstall } from "./installs-DN8Cz1b5.js";
//#region src/cli/npm-resolution.ts
function resolvePinnedNpmSpec(params) {
	const recordSpec = params.pin && params.resolvedSpec ? params.resolvedSpec : params.rawSpec;
	if (!params.pin) return { recordSpec };
	if (!params.resolvedSpec) return {
		recordSpec,
		pinWarning: "Could not resolve exact npm version for --pin; storing original npm spec."
	};
	return {
		recordSpec,
		pinNotice: `Pinned npm install record to ${params.resolvedSpec}.`
	};
}
function buildNpmInstallRecordFields(params) {
	return {
		source: "npm",
		spec: params.spec,
		installPath: params.installPath,
		version: params.version,
		...buildNpmResolutionFields(params.resolution)
	};
}
function resolvePinnedNpmInstallRecord(params) {
	const pinInfo = resolvePinnedNpmSpec({
		rawSpec: params.rawSpec,
		pin: params.pin,
		resolvedSpec: params.resolution?.resolvedSpec
	});
	logPinnedNpmSpecMessages(pinInfo, params.log, params.warn);
	return buildNpmInstallRecordFields({
		spec: pinInfo.recordSpec,
		installPath: params.installPath,
		version: params.version,
		resolution: params.resolution
	});
}
function resolvePinnedNpmInstallRecordForCli(rawSpec, pin, installPath, version, resolution, log, warnFormat) {
	return resolvePinnedNpmInstallRecord({
		rawSpec,
		pin,
		installPath,
		version,
		resolution,
		log,
		warn: (message) => log(warnFormat(message))
	});
}
function logPinnedNpmSpecMessages(pinInfo, log, logWarn) {
	if (pinInfo.pinWarning) logWarn(pinInfo.pinWarning);
	if (pinInfo.pinNotice) log(pinInfo.pinNotice);
}
//#endregion
//#region src/hooks/installs.ts
function recordHookInstall(cfg, update) {
	const { hookId, ...record } = update;
	const installs = {
		...cfg.hooks?.internal?.installs,
		[hookId]: {
			...cfg.hooks?.internal?.installs?.[hookId],
			...record,
			installedAt: record.installedAt ?? (/* @__PURE__ */ new Date()).toISOString()
		}
	};
	return {
		...cfg,
		hooks: {
			...cfg.hooks,
			internal: {
				...cfg.hooks?.internal,
				installs: {
					...installs,
					[hookId]: installs[hookId]
				}
			}
		}
	};
}
//#endregion
//#region src/cli/plugins-install-persist.ts
async function persistPluginInstall(params) {
	let next = enablePluginInConfig(params.config, params.pluginId).config;
	next = recordPluginInstall(next, {
		pluginId: params.pluginId,
		...params.install
	});
	const slotResult = applySlotSelectionForPlugin(next, params.pluginId);
	next = slotResult.config;
	await writeConfigFile(next);
	logSlotWarnings(slotResult.warnings);
	if (params.warningMessage) defaultRuntime.log(theme.warn(params.warningMessage));
	defaultRuntime.log(params.successMessage ?? `Installed plugin: ${params.pluginId}`);
	defaultRuntime.log("Restart the gateway to load plugins.");
	return next;
}
async function persistHookPackInstall(params) {
	let next = enableInternalHookEntries(params.config, params.hooks);
	next = recordHookInstall(next, {
		hookId: params.hookPackId,
		hooks: params.hooks,
		...params.install
	});
	await writeConfigFile(next);
	defaultRuntime.log(params.successMessage ?? `Installed hook pack: ${params.hookPackId}`);
	logHookPackRestartHint();
	return next;
}
//#endregion
export { resolvePinnedNpmInstallRecordForCli as a, buildNpmInstallRecordFields as i, persistPluginInstall as n, recordHookInstall as r, persistHookPackInstall as t };
