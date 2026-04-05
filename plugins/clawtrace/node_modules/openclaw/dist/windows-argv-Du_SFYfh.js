import { I as consumeRootOptionToken, L as isValueToken, O as getPrimaryCommand } from "./logger-BCzP_yik.js";
import { o as resolveRequiredHomeDir } from "./home-dir-BnP38vVl.js";
import { t as isValidProfileName } from "./profile-utils-C7uzTwgJ.js";
import fsSync from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import os from "node:os";
//#region src/cli/root-option-forward.ts
function forwardConsumedCliRootOption(args, index, out) {
	const consumedRootOption = consumeRootOptionToken(args, index);
	if (consumedRootOption <= 0) return 0;
	for (let offset = 0; offset < consumedRootOption; offset += 1) {
		const token = args[index + offset];
		if (token !== void 0) out.push(token);
	}
	return consumedRootOption;
}
//#endregion
//#region src/cli/root-option-value.ts
function takeCliRootOptionValue(raw, next) {
	if (raw.includes("=")) {
		const [, value] = raw.split("=", 2);
		return {
			value: (value ?? "").trim() || null,
			consumedNext: false
		};
	}
	const consumedNext = isValueToken(next);
	return {
		value: (consumedNext ? next.trim() : "") || null,
		consumedNext
	};
}
//#endregion
//#region src/cli/container-target.ts
function parseCliContainerArgs(argv) {
	if (argv.length < 2) return {
		ok: true,
		container: null,
		argv
	};
	const out = argv.slice(0, 2);
	let container = null;
	const args = argv.slice(2);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === void 0) continue;
		if (arg === "--") {
			out.push(arg, ...args.slice(i + 1));
			break;
		}
		if (arg === "--container" || arg.startsWith("--container=")) {
			const next = args[i + 1];
			const { value, consumedNext } = takeCliRootOptionValue(arg, next);
			if (consumedNext) i += 1;
			if (!value) return {
				ok: false,
				error: "--container requires a value"
			};
			container = value;
			continue;
		}
		const consumedRootOption = forwardConsumedCliRootOption(args, i, out);
		if (consumedRootOption > 0) {
			i += consumedRootOption - 1;
			continue;
		}
		out.push(arg);
	}
	return {
		ok: true,
		container,
		argv: out
	};
}
function resolveCliContainerTarget(argv, env = process.env) {
	const parsed = parseCliContainerArgs(argv);
	if (!parsed.ok) throw new Error(parsed.error);
	return parsed.container ?? env.OPENCLAW_CONTAINER?.trim() ?? null;
}
function isContainerRunning(params) {
	const result = params.deps.spawnSync(params.exec.command, [
		...params.exec.argsPrefix,
		"inspect",
		"--format",
		"{{.State.Running}}",
		params.containerName
	], params.exec.command === "sudo" ? {
		encoding: "utf8",
		stdio: [
			"inherit",
			"pipe",
			"inherit"
		]
	} : { encoding: "utf8" });
	return result.status === 0 && result.stdout.trim() === "true";
}
function candidateContainerRuntimes() {
	return [{
		runtime: "podman",
		command: "podman",
		argsPrefix: []
	}, {
		runtime: "docker",
		command: "docker",
		argsPrefix: []
	}];
}
function resolveRunningContainer(params) {
	const matches = [];
	const candidates = candidateContainerRuntimes();
	for (const exec of candidates) if (isContainerRunning({
		exec,
		containerName: params.containerName,
		deps: params.deps
	})) {
		matches.push({
			...exec,
			containerName: params.containerName
		});
		if (exec.runtime === "docker") break;
	}
	if (matches.length === 0) return null;
	if (matches.length > 1) {
		const runtimes = matches.map((match) => match.runtime).join(", ");
		throw new Error(`Container "${params.containerName}" is running under multiple runtimes (${runtimes}); use a unique container name.`);
	}
	return matches[0];
}
function buildContainerExecArgs(params) {
	const envFlag = params.exec.runtime === "docker" ? "-e" : "--env";
	const interactiveFlags = ["-i", ...params.stdinIsTTY && params.stdoutIsTTY ? ["-t"] : []];
	return [
		...params.exec.argsPrefix,
		"exec",
		...interactiveFlags,
		envFlag,
		`OPENCLAW_CONTAINER_HINT=${params.containerName}`,
		envFlag,
		"OPENCLAW_CLI_CONTAINER_BYPASS=1",
		params.containerName,
		"openclaw",
		...params.argv
	];
}
function buildContainerExecEnv(env) {
	const next = { ...env };
	delete next.OPENCLAW_PROFILE;
	delete next.OPENCLAW_GATEWAY_PORT;
	delete next.OPENCLAW_GATEWAY_URL;
	delete next.OPENCLAW_GATEWAY_TOKEN;
	delete next.OPENCLAW_GATEWAY_PASSWORD;
	next.OPENCLAW_CONTAINER = "";
	return next;
}
function isBlockedContainerCommand(argv) {
	if (getPrimaryCommand([
		"node",
		"openclaw",
		...argv
	]) === "update") return true;
	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];
		if (!arg || arg === "--") return false;
		if (arg === "--update") return true;
		const consumedRootOption = consumeRootOptionToken(argv, i);
		if (consumedRootOption > 0) {
			i += consumedRootOption - 1;
			continue;
		}
		if (!arg.startsWith("-")) return false;
	}
	return false;
}
function maybeRunCliInContainer(argv, deps) {
	const resolvedDeps = {
		env: deps?.env ?? process.env,
		spawnSync: deps?.spawnSync ?? spawnSync,
		stdinIsTTY: deps?.stdinIsTTY ?? Boolean(process.stdin.isTTY),
		stdoutIsTTY: deps?.stdoutIsTTY ?? Boolean(process.stdout.isTTY)
	};
	if (resolvedDeps.env.OPENCLAW_CLI_CONTAINER_BYPASS === "1") return {
		handled: false,
		argv
	};
	const parsed = parseCliContainerArgs(argv);
	if (!parsed.ok) throw new Error(parsed.error);
	const containerName = resolveCliContainerTarget(argv, resolvedDeps.env);
	if (!containerName) return {
		handled: false,
		argv: parsed.argv
	};
	if (isBlockedContainerCommand(parsed.argv.slice(2))) throw new Error("openclaw update is not supported with --container; rebuild or restart the container image instead.");
	const runningContainer = resolveRunningContainer({
		containerName,
		env: resolvedDeps.env,
		deps: resolvedDeps
	});
	if (!runningContainer) throw new Error(`No running container matched "${containerName}" under podman or docker.`);
	const result = resolvedDeps.spawnSync(runningContainer.command, buildContainerExecArgs({
		exec: runningContainer,
		containerName: runningContainer.containerName,
		argv: parsed.argv.slice(2),
		stdinIsTTY: resolvedDeps.stdinIsTTY,
		stdoutIsTTY: resolvedDeps.stdoutIsTTY
	}), {
		stdio: "inherit",
		env: buildContainerExecEnv(resolvedDeps.env)
	});
	return {
		handled: true,
		exitCode: typeof result.status === "number" ? result.status : 1
	};
}
//#endregion
//#region src/cli/profile.ts
function parseCliProfileArgs(argv) {
	if (argv.length < 2) return {
		ok: true,
		profile: null,
		argv
	};
	const out = argv.slice(0, 2);
	let profile = null;
	let sawDev = false;
	const args = argv.slice(2);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === void 0) continue;
		if (arg === "--") {
			out.push(arg, ...args.slice(i + 1));
			break;
		}
		if (arg === "--dev") {
			if (getPrimaryCommand(out) === "gateway") {
				out.push(arg);
				continue;
			}
			if (profile && profile !== "dev") return {
				ok: false,
				error: "Cannot combine --dev with --profile"
			};
			sawDev = true;
			profile = "dev";
			continue;
		}
		if (arg === "--profile" || arg.startsWith("--profile=")) {
			if (sawDev) return {
				ok: false,
				error: "Cannot combine --dev with --profile"
			};
			const next = args[i + 1];
			const { value, consumedNext } = takeCliRootOptionValue(arg, next);
			if (consumedNext) i += 1;
			if (!value) return {
				ok: false,
				error: "--profile requires a value"
			};
			if (!isValidProfileName(value)) return {
				ok: false,
				error: "Invalid --profile (use letters, numbers, \"_\", \"-\" only)"
			};
			profile = value;
			continue;
		}
		const consumedRootOption = forwardConsumedCliRootOption(args, i, out);
		if (consumedRootOption > 0) {
			i += consumedRootOption - 1;
			continue;
		}
		out.push(arg);
	}
	return {
		ok: true,
		profile,
		argv: out
	};
}
function resolveProfileStateDir(profile, env, homedir) {
	const suffix = profile.toLowerCase() === "default" ? "" : `-${profile}`;
	return path.join(resolveRequiredHomeDir(env, homedir), `.openclaw${suffix}`);
}
function applyCliProfileEnv(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const profile = params.profile.trim();
	if (!profile) return;
	env.OPENCLAW_PROFILE = profile;
	const stateDir = env.OPENCLAW_STATE_DIR?.trim() || resolveProfileStateDir(profile, env, homedir);
	if (!env.OPENCLAW_STATE_DIR?.trim()) env.OPENCLAW_STATE_DIR = stateDir;
	if (!env.OPENCLAW_CONFIG_PATH?.trim()) env.OPENCLAW_CONFIG_PATH = path.join(stateDir, "openclaw.json");
	if (profile === "dev" && !env.OPENCLAW_GATEWAY_PORT?.trim()) env.OPENCLAW_GATEWAY_PORT = "19001";
}
//#endregion
//#region src/cli/windows-argv.ts
function normalizeWindowsArgv(argv) {
	if (process.platform !== "win32") return argv;
	if (argv.length < 2) return argv;
	const stripControlChars = (value) => {
		let out = "";
		for (let i = 0; i < value.length; i += 1) {
			const code = value.charCodeAt(i);
			if (code >= 32 && code !== 127) out += value[i];
		}
		return out;
	};
	const normalizeArg = (value) => stripControlChars(value).replace(/^['"]+|['"]+$/g, "").trim();
	const normalizeCandidate = (value) => normalizeArg(value).replace(/^\\\\\\?\\/, "");
	const execPath = normalizeCandidate(process.execPath);
	const execPathLower = execPath.toLowerCase();
	const execBase = path.basename(execPath).toLowerCase();
	const isExecPath = (value) => {
		if (!value) return false;
		const normalized = normalizeCandidate(value);
		if (!normalized) return false;
		const lower = normalized.toLowerCase();
		return lower === execPathLower || path.basename(lower) === execBase || lower.endsWith("\\node.exe") || lower.endsWith("/node.exe") || lower.includes("node.exe") || path.basename(lower) === "node.exe" && fsSync.existsSync(normalized);
	};
	const next = [...argv];
	for (let i = 1; i <= 3 && i < next.length;) {
		if (isExecPath(next[i])) {
			next.splice(i, 1);
			continue;
		}
		i += 1;
	}
	const filtered = next.filter((arg, index) => index === 0 || !isExecPath(arg));
	if (filtered.length < 3) return filtered;
	const cleaned = [...filtered];
	for (let i = 2; i < cleaned.length;) {
		const arg = cleaned[i];
		if (!arg || arg.startsWith("-")) {
			i += 1;
			continue;
		}
		if (isExecPath(arg)) {
			cleaned.splice(i, 1);
			continue;
		}
		break;
	}
	return cleaned;
}
//#endregion
export { parseCliContainerArgs as a, maybeRunCliInContainer as i, applyCliProfileEnv as n, resolveCliContainerTarget as o, parseCliProfileArgs as r, normalizeWindowsArgv as t };
