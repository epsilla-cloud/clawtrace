import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { Ds as applyPluginAutoEnable, RN as loadOpenClawPlugins, f as loadConfig } from "./auth-profiles-B5ypC5S-.js";
import { m as resolveDefaultAgentId, p as resolveAgentWorkspaceDir } from "./agent-scope-BSOSJbA_.js";
//#region src/plugins/cli.ts
const log = createSubsystemLogger("plugins");
function loadPluginCliRegistry(cfg, env, loaderOptions) {
	const resolvedConfig = applyPluginAutoEnable({
		config: cfg ?? loadConfig(),
		env: env ?? process.env
	}).config;
	const workspaceDir = resolveAgentWorkspaceDir(resolvedConfig, resolveDefaultAgentId(resolvedConfig));
	const logger = {
		info: (msg) => log.info(msg),
		warn: (msg) => log.warn(msg),
		error: (msg) => log.error(msg),
		debug: (msg) => log.debug(msg)
	};
	return {
		config: resolvedConfig,
		workspaceDir,
		logger,
		registry: loadOpenClawPlugins({
			config: resolvedConfig,
			workspaceDir,
			env,
			logger,
			...loaderOptions
		})
	};
}
function registerPluginCliCommands(program, cfg, env, loaderOptions) {
	const { config, workspaceDir, logger, registry } = loadPluginCliRegistry(cfg, env, loaderOptions);
	const existingCommands = new Set(program.commands.map((cmd) => cmd.name()));
	for (const entry of registry.cliRegistrars) {
		if (entry.commands.length > 0) {
			const overlaps = entry.commands.filter((command) => existingCommands.has(command));
			if (overlaps.length > 0) {
				log.debug(`plugin CLI register skipped (${entry.pluginId}): command already registered (${overlaps.join(", ")})`);
				continue;
			}
		}
		try {
			const result = entry.register({
				program,
				config,
				workspaceDir,
				logger
			});
			if (result && typeof result.then === "function") result.catch((err) => {
				log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
			});
			for (const command of entry.commands) existingCommands.add(command);
		} catch (err) {
			log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
		}
	}
}
//#endregion
export { registerPluginCliCommands };
