import { v as resolveUserPath } from "./utils-BfvDpbwh.js";
import { f as resolveFileNpmSpecToLocalPath } from "./plugins-command-helpers-Cp3O_xvW.js";
import path from "node:path";
//#region src/cli/plugin-install-config-policy.ts
function isPluginInstallCommand(commandPath) {
	return commandPath[0] === "plugins" && commandPath[1] === "install";
}
function isExplicitMatrixInstallRequest(request) {
	if (request.marketplace) return false;
	if ([request.rawSpec.trim(), request.normalizedSpec.trim()].includes("@openclaw/matrix")) return true;
	if (!request.resolvedPath) return false;
	return path.basename(request.resolvedPath) === "matrix" && path.basename(path.dirname(request.resolvedPath)) === "extensions";
}
function resolvePluginInstallArgvTokens(commandPath, argv) {
	const args = argv.slice(2);
	let cursor = 0;
	for (const segment of commandPath) {
		while (cursor < args.length && args[cursor] !== segment) cursor += 1;
		if (cursor >= args.length) return [];
		cursor += 1;
	}
	return args.slice(cursor);
}
function resolvePluginInstallArgvRequest(commandPath, argv) {
	if (!isPluginInstallCommand(commandPath)) return null;
	const tokens = resolvePluginInstallArgvTokens(commandPath, argv);
	let rawSpec = null;
	let marketplace;
	for (let index = 0; index < tokens.length; index += 1) {
		const token = tokens[index];
		if (token.startsWith("--marketplace=")) {
			marketplace = token.slice(14);
			continue;
		}
		if (token === "--marketplace") {
			const value = tokens[index + 1];
			if (typeof value === "string") {
				marketplace = value;
				index += 1;
			}
			continue;
		}
		if (token.startsWith("-")) continue;
		rawSpec ??= token;
	}
	return rawSpec ? {
		rawSpec,
		marketplace
	} : null;
}
function resolvePluginInstallRequestContext(params) {
	if (params.marketplace) return {
		ok: true,
		request: {
			rawSpec: params.rawSpec,
			normalizedSpec: params.rawSpec,
			marketplace: params.marketplace
		}
	};
	const fileSpec = resolveFileNpmSpecToLocalPath(params.rawSpec);
	if (fileSpec && !fileSpec.ok) return {
		ok: false,
		error: fileSpec.error
	};
	const normalizedSpec = fileSpec && fileSpec.ok ? fileSpec.path : params.rawSpec;
	return {
		ok: true,
		request: {
			rawSpec: params.rawSpec,
			normalizedSpec,
			resolvedPath: resolveUserPath(normalizedSpec)
		}
	};
}
function resolvePluginInstallPreactionRequest(params) {
	if (!isPluginInstallCommand(params.commandPath)) return null;
	const argvRequest = resolvePluginInstallArgvRequest(params.commandPath, params.argv);
	const opts = params.actionCommand.opts();
	const marketplace = (typeof opts.marketplace === "string" && opts.marketplace.trim() ? opts.marketplace : argvRequest?.marketplace) || void 0;
	const rawSpec = (typeof params.actionCommand.processedArgs?.[0] === "string" ? params.actionCommand.processedArgs[0] : argvRequest?.rawSpec) ?? null;
	if (!rawSpec) return null;
	const request = resolvePluginInstallRequestContext({
		rawSpec,
		marketplace
	});
	return request.ok ? request.request : null;
}
function resolvePluginInstallInvalidConfigPolicy(request) {
	if (!request) return "deny";
	return isExplicitMatrixInstallRequest(request) ? "recover-matrix-only" : "deny";
}
//#endregion
export { resolvePluginInstallPreactionRequest as n, resolvePluginInstallRequestContext as r, resolvePluginInstallInvalidConfigPolicy as t };
