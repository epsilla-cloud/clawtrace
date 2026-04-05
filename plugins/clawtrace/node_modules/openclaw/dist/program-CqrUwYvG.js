import { g as loggingState, j as hasHelpOrVersion, k as getVerboseFlag, w as getCommandPathWithRootOptions } from "./logger-BCzP_yik.js";
import { r as setVerbose } from "./global-state-DUuMGgts.js";
import { c as routeLogsToStderr, m as defaultRuntime } from "./subsystem-CJEvHE2o.js";
import { t as isTruthyEnvValue } from "./env-CjUKd1aw.js";
import "./globals-0H99T-Tx.js";
import { n as VERSION } from "./version-CIMrqUx3.js";
import { r as resolveCliName } from "./command-format-CR4nOXgc.js";
import { t as emitCliBanner } from "./banner-BUHAc8rB.js";
import { n as resolveCliChannelOptions } from "./channel-options-hbpgbk0p.js";
import { i as registerProgramCommands } from "./command-registry-BM_cv4xH.js";
import { n as setProgramContext } from "./program-context-DMho45Es.js";
import { t as isCommandJsonOutputMode } from "./json-mode-CG1GxN1s.js";
import "./ports-DtHRHtKx.js";
import { n as resolvePluginInstallPreactionRequest, t as resolvePluginInstallInvalidConfigPolicy } from "./plugin-install-config-policy-CS7xqjTN.js";
import { t as configureProgramHelp } from "./help-0Rgp1tTO.js";
import { Command } from "commander";
//#region src/cli/program/context.ts
function createProgramContext() {
	let cachedChannelOptions;
	const getChannelOptions = () => {
		if (cachedChannelOptions === void 0) cachedChannelOptions = resolveCliChannelOptions();
		return cachedChannelOptions;
	};
	return {
		programVersion: VERSION,
		get channelOptions() {
			return getChannelOptions();
		},
		get messageChannelOptions() {
			return getChannelOptions().join("|");
		},
		get agentChannelOptions() {
			return ["last", ...getChannelOptions()].join("|");
		}
	};
}
//#endregion
//#region src/cli/program/preaction.ts
function setProcessTitleForCommand(actionCommand) {
	let current = actionCommand;
	while (current.parent && current.parent.parent) current = current.parent;
	const name = current.name();
	const cliName = resolveCliName();
	if (!name || name === cliName) return;
	process.title = `${cliName}-${name}`;
}
const PLUGIN_REQUIRED_COMMANDS = new Set([
	"message",
	"channels",
	"directory",
	"agents",
	"configure",
	"status",
	"health"
]);
const CONFIG_GUARD_BYPASS_COMMANDS = new Set([
	"backup",
	"doctor",
	"completion",
	"secrets"
]);
let configGuardModulePromise;
let pluginRegistryModulePromise;
function shouldBypassConfigGuard(commandPath) {
	const [primary, secondary] = commandPath;
	if (!primary) return false;
	if (CONFIG_GUARD_BYPASS_COMMANDS.has(primary)) return true;
	if (primary === "config" && (secondary === "validate" || secondary === "schema")) return true;
	return false;
}
function loadConfigGuardModule() {
	configGuardModulePromise ??= import("./config-guard-mTFVFLiI.js");
	return configGuardModulePromise;
}
function loadPluginRegistryModule() {
	pluginRegistryModulePromise ??= import("./plugin-registry-BoB3QTNs.js");
	return pluginRegistryModulePromise;
}
function resolvePluginRegistryScope(commandPath) {
	return commandPath[0] === "status" || commandPath[0] === "health" ? "channels" : "all";
}
function shouldLoadPluginsForCommand(commandPath, jsonOutputMode) {
	const [primary, secondary] = commandPath;
	if (!primary || !PLUGIN_REQUIRED_COMMANDS.has(primary)) return false;
	if ((primary === "status" || primary === "health") && jsonOutputMode) return false;
	if (primary === "onboard" || primary === "channels" && secondary === "add") return false;
	return true;
}
function shouldAllowInvalidConfigForAction(actionCommand, commandPath) {
	return resolvePluginInstallInvalidConfigPolicy(resolvePluginInstallPreactionRequest({
		actionCommand,
		commandPath,
		argv: process.argv
	})) === "recover-matrix-only";
}
function getRootCommand(command) {
	let current = command;
	while (current.parent) current = current.parent;
	return current;
}
function getCliLogLevel(actionCommand) {
	const root = getRootCommand(actionCommand);
	if (typeof root.getOptionValueSource !== "function") return;
	if (root.getOptionValueSource("logLevel") !== "cli") return;
	const logLevel = root.opts().logLevel;
	return typeof logLevel === "string" ? logLevel : void 0;
}
function registerPreActionHooks(program, programVersion) {
	program.hook("preAction", async (_thisCommand, actionCommand) => {
		setProcessTitleForCommand(actionCommand);
		const argv = process.argv;
		if (hasHelpOrVersion(argv)) return;
		const commandPath = getCommandPathWithRootOptions(argv, 2);
		const jsonOutputMode = isCommandJsonOutputMode(actionCommand, argv);
		if (jsonOutputMode) routeLogsToStderr();
		if (!(isTruthyEnvValue(process.env.OPENCLAW_HIDE_BANNER) || commandPath[0] === "update" || commandPath[0] === "completion" || commandPath[0] === "plugins" && commandPath[1] === "update")) emitCliBanner(programVersion);
		const verbose = getVerboseFlag(argv, { includeDebug: true });
		setVerbose(verbose);
		const cliLogLevel = getCliLogLevel(actionCommand);
		if (cliLogLevel) process.env.OPENCLAW_LOG_LEVEL = cliLogLevel;
		if (!verbose) process.env.NODE_NO_WARNINGS ??= "1";
		if (shouldBypassConfigGuard(commandPath)) return;
		const allowInvalid = shouldAllowInvalidConfigForAction(actionCommand, commandPath);
		const { ensureConfigReady } = await loadConfigGuardModule();
		await ensureConfigReady({
			runtime: defaultRuntime,
			commandPath,
			...allowInvalid ? { allowInvalid: true } : {},
			...jsonOutputMode ? { suppressDoctorStdout: true } : {}
		});
		if (shouldLoadPluginsForCommand(commandPath, jsonOutputMode)) {
			const { ensurePluginRegistryLoaded } = await loadPluginRegistryModule();
			const prev = loggingState.forceConsoleToStderr;
			if (jsonOutputMode) loggingState.forceConsoleToStderr = true;
			try {
				ensurePluginRegistryLoaded({ scope: resolvePluginRegistryScope(commandPath) });
			} finally {
				loggingState.forceConsoleToStderr = prev;
			}
		}
	});
}
//#endregion
//#region src/cli/program/build-program.ts
function buildProgram() {
	const program = new Command();
	program.enablePositionalOptions();
	const ctx = createProgramContext();
	const argv = process.argv;
	setProgramContext(program, ctx);
	configureProgramHelp(program, ctx);
	registerPreActionHooks(program, ctx.programVersion);
	registerProgramCommands(program, ctx, argv);
	return program;
}
//#endregion
export { buildProgram };
