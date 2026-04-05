import { r as STATE_DIR } from "./paths-Y4UT24Of.js";
import { i as resolveAgentConfig } from "./agent-scope-BSOSJbA_.js";
import { l as normalizeSecretInputString } from "./types.secrets-Rqz2qv-w.js";
import { i as CHANNEL_IDS } from "./chat-meta-xAV2SRO1.js";
import { c as normalizeToolName, h as matchesAnyGlobPattern, m as compileGlobPatterns, s as expandToolGroups } from "./tool-policy-DG7GGbxQ.js";
import path from "node:path";
//#region src/agents/sandbox/constants.ts
const DEFAULT_SANDBOX_WORKSPACE_ROOT = path.join(STATE_DIR, "sandboxes");
const DEFAULT_SANDBOX_IMAGE = "openclaw-sandbox:bookworm-slim";
const DEFAULT_TOOL_ALLOW = [
	"exec",
	"process",
	"read",
	"write",
	"edit",
	"apply_patch",
	"image",
	"sessions_list",
	"sessions_history",
	"sessions_send",
	"sessions_spawn",
	"sessions_yield",
	"subagents",
	"session_status"
];
const DEFAULT_TOOL_DENY = [
	"browser",
	"canvas",
	"nodes",
	"cron",
	"gateway",
	...CHANNEL_IDS
];
const DEFAULT_SANDBOX_BROWSER_IMAGE = "openclaw-sandbox-browser:bookworm-slim";
const DEFAULT_SANDBOX_COMMON_IMAGE = "openclaw-sandbox-common:bookworm-slim";
const SANDBOX_BROWSER_SECURITY_HASH_EPOCH = "2026-02-28-no-sandbox-env";
const SANDBOX_AGENT_WORKSPACE_MOUNT = "/agent";
const SANDBOX_STATE_DIR = path.join(STATE_DIR, "sandbox");
const SANDBOX_REGISTRY_PATH = path.join(SANDBOX_STATE_DIR, "containers.json");
const SANDBOX_BROWSER_REGISTRY_PATH = path.join(SANDBOX_STATE_DIR, "browsers.json");
//#endregion
//#region src/agents/sandbox/tool-policy.ts
function buildSource(params) {
	return {
		source: params.scope,
		key: params.key
	};
}
function pickConfiguredList(params) {
	if (Array.isArray(params.agent)) return {
		values: params.agent,
		source: buildSource({
			scope: "agent",
			key: "agents.list[].tools.sandbox.tools.allow"
		})
	};
	if (Array.isArray(params.global)) return {
		values: params.global,
		source: buildSource({
			scope: "global",
			key: "tools.sandbox.tools.allow"
		})
	};
	return {
		values: void 0,
		source: buildSource({
			scope: "default",
			key: "tools.sandbox.tools.allow"
		})
	};
}
function pickConfiguredDeny(params) {
	if (Array.isArray(params.agent)) return {
		values: params.agent,
		source: buildSource({
			scope: "agent",
			key: "agents.list[].tools.sandbox.tools.deny"
		})
	};
	if (Array.isArray(params.global)) return {
		values: params.global,
		source: buildSource({
			scope: "global",
			key: "tools.sandbox.tools.deny"
		})
	};
	return {
		values: void 0,
		source: buildSource({
			scope: "default",
			key: "tools.sandbox.tools.deny"
		})
	};
}
function pickConfiguredAlsoAllow(params) {
	if (Array.isArray(params.agent)) return {
		values: params.agent,
		source: buildSource({
			scope: "agent",
			key: "agents.list[].tools.sandbox.tools.alsoAllow"
		})
	};
	if (Array.isArray(params.global)) return {
		values: params.global,
		source: buildSource({
			scope: "global",
			key: "tools.sandbox.tools.alsoAllow"
		})
	};
	return {
		values: void 0,
		source: void 0
	};
}
function mergeAllowlist(base, extra) {
	if (Array.isArray(base)) {
		if (base.length === 0) return [];
		if (!Array.isArray(extra) || extra.length === 0) return [...base];
		return Array.from(new Set([...base, ...extra]));
	}
	if (Array.isArray(extra) && extra.length > 0) return Array.from(new Set([...DEFAULT_TOOL_ALLOW, ...extra]));
	return [...DEFAULT_TOOL_ALLOW];
}
function pickAllowSource(params) {
	if (params.allowDefined && params.allow.source === "agent") return params.allow;
	if (params.alsoAllow?.source === "agent") return params.alsoAllow;
	if (params.allowDefined && params.allow.source === "global") return params.allow;
	if (params.alsoAllow?.source === "global") return params.alsoAllow;
	return params.allow;
}
function resolveExplicitSandboxReAllowPatterns(params) {
	return Array.from(new Set([...params.allow ?? [], ...params.alsoAllow ?? []]));
}
function filterDefaultDenyForExplicitAllows(params) {
	if (params.explicitAllowPatterns.length === 0) return [...params.deny];
	const allowPatterns = compileGlobPatterns({
		raw: expandToolGroups(params.explicitAllowPatterns),
		normalize: normalizeToolName
	});
	if (allowPatterns.length === 0) return [...params.deny];
	return params.deny.filter((toolName) => !matchesAnyGlobPattern(normalizeToolName(toolName), allowPatterns));
}
function expandResolvedPolicy(policy) {
	const expandedDeny = expandToolGroups(policy.deny ?? []);
	let expandedAllow = expandToolGroups(policy.allow ?? []);
	if (expandedAllow.length > 0 && !expandedDeny.map((value) => value.toLowerCase()).includes("image") && !expandedAllow.map((value) => value.toLowerCase()).includes("image")) expandedAllow = [...expandedAllow, "image"];
	return {
		allow: expandedAllow,
		deny: expandedDeny
	};
}
function classifyToolAgainstSandboxToolPolicy(name, policy) {
	if (!policy) return {
		blockedByDeny: false,
		blockedByAllow: false
	};
	const normalized = normalizeToolName(name);
	const blockedByDeny = matchesAnyGlobPattern(normalized, compileGlobPatterns({
		raw: expandToolGroups(policy.deny ?? []),
		normalize: normalizeToolName
	}));
	const allow = compileGlobPatterns({
		raw: expandToolGroups(policy.allow ?? []),
		normalize: normalizeToolName
	});
	return {
		blockedByDeny,
		blockedByAllow: !blockedByDeny && allow.length > 0 && !matchesAnyGlobPattern(normalized, allow)
	};
}
function isToolAllowed(policy, name) {
	const { blockedByDeny, blockedByAllow } = classifyToolAgainstSandboxToolPolicy(name, policy);
	return !blockedByDeny && !blockedByAllow;
}
function resolveSandboxToolPolicyForAgent(cfg, agentId) {
	const agentPolicy = (cfg && agentId ? resolveAgentConfig(cfg, agentId) : void 0)?.tools?.sandbox?.tools;
	const globalPolicy = cfg?.tools?.sandbox?.tools;
	const allowConfig = pickConfiguredList({
		agent: agentPolicy?.allow,
		global: globalPolicy?.allow
	});
	const alsoAllowConfig = pickConfiguredAlsoAllow({
		agent: agentPolicy?.alsoAllow,
		global: globalPolicy?.alsoAllow
	});
	const denyConfig = pickConfiguredDeny({
		agent: agentPolicy?.deny,
		global: globalPolicy?.deny
	});
	const explicitAllowPatterns = resolveExplicitSandboxReAllowPatterns({
		allow: allowConfig.values,
		alsoAllow: alsoAllowConfig.values
	});
	const expanded = expandResolvedPolicy({
		allow: mergeAllowlist(allowConfig.values, alsoAllowConfig.values),
		deny: Array.isArray(denyConfig.values) ? [...denyConfig.values] : filterDefaultDenyForExplicitAllows({
			deny: [...DEFAULT_TOOL_DENY],
			explicitAllowPatterns
		})
	});
	return {
		allow: expanded.allow ?? [],
		deny: expanded.deny ?? [],
		sources: {
			allow: pickAllowSource({
				allow: allowConfig.source,
				allowDefined: Array.isArray(allowConfig.values),
				alsoAllow: alsoAllowConfig.source
			}),
			deny: denyConfig.source
		}
	};
}
//#endregion
//#region src/agents/sandbox/config.ts
const DANGEROUS_SANDBOX_DOCKER_BOOLEAN_KEYS = [
	"dangerouslyAllowReservedContainerTargets",
	"dangerouslyAllowExternalBindSources",
	"dangerouslyAllowContainerNamespaceJoin"
];
const DEFAULT_SANDBOX_SSH_COMMAND = "ssh";
const DEFAULT_SANDBOX_SSH_WORKSPACE_ROOT = "/tmp/openclaw-sandboxes";
function resolveDangerousSandboxDockerBooleans(agentDocker, globalDocker) {
	const resolved = {};
	for (const key of DANGEROUS_SANDBOX_DOCKER_BOOLEAN_KEYS) resolved[key] = agentDocker?.[key] ?? globalDocker?.[key];
	return resolved;
}
function resolveSandboxBrowserDockerCreateConfig(params) {
	const browserNetwork = params.browser.network.trim();
	const base = {
		...params.docker,
		network: browserNetwork || "openclaw-sandbox-browser",
		image: params.browser.image
	};
	return params.browser.binds !== void 0 ? {
		...base,
		binds: params.browser.binds
	} : base;
}
function resolveSandboxScope(params) {
	if (params.scope) return params.scope;
	if (typeof params.perSession === "boolean") return params.perSession ? "session" : "shared";
	return "agent";
}
function resolveSandboxDockerConfig(params) {
	const agentDocker = params.scope === "shared" ? void 0 : params.agentDocker;
	const globalDocker = params.globalDocker;
	const env = agentDocker?.env ? {
		...globalDocker?.env ?? { LANG: "C.UTF-8" },
		...agentDocker.env
	} : globalDocker?.env ?? { LANG: "C.UTF-8" };
	const ulimits = agentDocker?.ulimits ? {
		...globalDocker?.ulimits,
		...agentDocker.ulimits
	} : globalDocker?.ulimits;
	const binds = [...globalDocker?.binds ?? [], ...agentDocker?.binds ?? []];
	return {
		image: agentDocker?.image ?? globalDocker?.image ?? "openclaw-sandbox:bookworm-slim",
		containerPrefix: agentDocker?.containerPrefix ?? globalDocker?.containerPrefix ?? "openclaw-sbx-",
		workdir: agentDocker?.workdir ?? globalDocker?.workdir ?? "/workspace",
		readOnlyRoot: agentDocker?.readOnlyRoot ?? globalDocker?.readOnlyRoot ?? true,
		tmpfs: agentDocker?.tmpfs ?? globalDocker?.tmpfs ?? [
			"/tmp",
			"/var/tmp",
			"/run"
		],
		network: agentDocker?.network ?? globalDocker?.network ?? "none",
		user: agentDocker?.user ?? globalDocker?.user,
		capDrop: agentDocker?.capDrop ?? globalDocker?.capDrop ?? ["ALL"],
		env,
		setupCommand: agentDocker?.setupCommand ?? globalDocker?.setupCommand,
		pidsLimit: agentDocker?.pidsLimit ?? globalDocker?.pidsLimit,
		memory: agentDocker?.memory ?? globalDocker?.memory,
		memorySwap: agentDocker?.memorySwap ?? globalDocker?.memorySwap,
		cpus: agentDocker?.cpus ?? globalDocker?.cpus,
		ulimits,
		seccompProfile: agentDocker?.seccompProfile ?? globalDocker?.seccompProfile,
		apparmorProfile: agentDocker?.apparmorProfile ?? globalDocker?.apparmorProfile,
		dns: agentDocker?.dns ?? globalDocker?.dns,
		extraHosts: agentDocker?.extraHosts ?? globalDocker?.extraHosts,
		binds: binds.length ? binds : void 0,
		...resolveDangerousSandboxDockerBooleans(agentDocker, globalDocker)
	};
}
function resolveSandboxBrowserConfig(params) {
	const agentBrowser = params.scope === "shared" ? void 0 : params.agentBrowser;
	const globalBrowser = params.globalBrowser;
	const binds = [...globalBrowser?.binds ?? [], ...agentBrowser?.binds ?? []];
	const bindsConfigured = globalBrowser?.binds !== void 0 || agentBrowser?.binds !== void 0;
	return {
		enabled: agentBrowser?.enabled ?? globalBrowser?.enabled ?? false,
		image: agentBrowser?.image ?? globalBrowser?.image ?? "openclaw-sandbox-browser:bookworm-slim",
		containerPrefix: agentBrowser?.containerPrefix ?? globalBrowser?.containerPrefix ?? "openclaw-sbx-browser-",
		network: agentBrowser?.network ?? globalBrowser?.network ?? "openclaw-sandbox-browser",
		cdpPort: agentBrowser?.cdpPort ?? globalBrowser?.cdpPort ?? 9222,
		cdpSourceRange: agentBrowser?.cdpSourceRange ?? globalBrowser?.cdpSourceRange,
		vncPort: agentBrowser?.vncPort ?? globalBrowser?.vncPort ?? 5900,
		noVncPort: agentBrowser?.noVncPort ?? globalBrowser?.noVncPort ?? 6080,
		headless: agentBrowser?.headless ?? globalBrowser?.headless ?? false,
		enableNoVnc: agentBrowser?.enableNoVnc ?? globalBrowser?.enableNoVnc ?? true,
		allowHostControl: agentBrowser?.allowHostControl ?? globalBrowser?.allowHostControl ?? false,
		autoStart: agentBrowser?.autoStart ?? globalBrowser?.autoStart ?? true,
		autoStartTimeoutMs: agentBrowser?.autoStartTimeoutMs ?? globalBrowser?.autoStartTimeoutMs ?? 12e3,
		binds: bindsConfigured ? binds : void 0
	};
}
function resolveSandboxPruneConfig(params) {
	const agentPrune = params.scope === "shared" ? void 0 : params.agentPrune;
	const globalPrune = params.globalPrune;
	return {
		idleHours: agentPrune?.idleHours ?? globalPrune?.idleHours ?? 24,
		maxAgeDays: agentPrune?.maxAgeDays ?? globalPrune?.maxAgeDays ?? 7
	};
}
function normalizeOptionalString(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
function normalizeRemoteRoot(value, fallback) {
	const normalized = normalizeOptionalString(value) ?? fallback;
	const posix = normalized.replaceAll("\\", "/");
	if (!posix.startsWith("/")) throw new Error(`Sandbox SSH workspaceRoot must be an absolute POSIX path: ${normalized}`);
	return posix.replace(/\/+$/g, "") || "/";
}
function resolveSandboxSshConfig(params) {
	const agentSsh = params.scope === "shared" ? void 0 : params.agentSsh;
	const globalSsh = params.globalSsh;
	return {
		target: normalizeOptionalString(agentSsh?.target ?? globalSsh?.target),
		command: normalizeOptionalString(agentSsh?.command ?? globalSsh?.command) ?? DEFAULT_SANDBOX_SSH_COMMAND,
		workspaceRoot: normalizeRemoteRoot(agentSsh?.workspaceRoot ?? globalSsh?.workspaceRoot, DEFAULT_SANDBOX_SSH_WORKSPACE_ROOT),
		strictHostKeyChecking: agentSsh?.strictHostKeyChecking ?? globalSsh?.strictHostKeyChecking ?? true,
		updateHostKeys: agentSsh?.updateHostKeys ?? globalSsh?.updateHostKeys ?? true,
		identityFile: normalizeOptionalString(agentSsh?.identityFile ?? globalSsh?.identityFile),
		certificateFile: normalizeOptionalString(agentSsh?.certificateFile ?? globalSsh?.certificateFile),
		knownHostsFile: normalizeOptionalString(agentSsh?.knownHostsFile ?? globalSsh?.knownHostsFile),
		identityData: normalizeSecretInputString(agentSsh?.identityData ?? globalSsh?.identityData),
		certificateData: normalizeSecretInputString(agentSsh?.certificateData ?? globalSsh?.certificateData),
		knownHostsData: normalizeSecretInputString(agentSsh?.knownHostsData ?? globalSsh?.knownHostsData)
	};
}
function resolveSandboxConfigForAgent(cfg, agentId) {
	const agent = cfg?.agents?.defaults?.sandbox;
	let agentSandbox;
	const agentConfig = cfg && agentId ? resolveAgentConfig(cfg, agentId) : void 0;
	if (agentConfig?.sandbox) agentSandbox = agentConfig.sandbox;
	const scope = resolveSandboxScope({
		scope: agentSandbox?.scope ?? agent?.scope,
		perSession: agentSandbox?.perSession ?? agent?.perSession
	});
	const toolPolicy = resolveSandboxToolPolicyForAgent(cfg, agentId);
	return {
		mode: agentSandbox?.mode ?? agent?.mode ?? "off",
		backend: agentSandbox?.backend?.trim() || agent?.backend?.trim() || "docker",
		scope,
		workspaceAccess: agentSandbox?.workspaceAccess ?? agent?.workspaceAccess ?? "none",
		workspaceRoot: agentSandbox?.workspaceRoot ?? agent?.workspaceRoot ?? DEFAULT_SANDBOX_WORKSPACE_ROOT,
		docker: resolveSandboxDockerConfig({
			scope,
			globalDocker: agent?.docker,
			agentDocker: agentSandbox?.docker
		}),
		ssh: resolveSandboxSshConfig({
			scope,
			globalSsh: agent?.ssh,
			agentSsh: agentSandbox?.ssh
		}),
		browser: resolveSandboxBrowserConfig({
			scope,
			globalBrowser: agent?.browser,
			agentBrowser: agentSandbox?.browser
		}),
		tools: {
			allow: toolPolicy.allow,
			deny: toolPolicy.deny
		},
		prune: resolveSandboxPruneConfig({
			scope,
			globalPrune: agent?.prune,
			agentPrune: agentSandbox?.prune
		})
	};
}
//#endregion
export { isToolAllowed as a, DEFAULT_SANDBOX_COMMON_IMAGE as c, SANDBOX_BROWSER_REGISTRY_PATH as d, SANDBOX_BROWSER_SECURITY_HASH_EPOCH as f, classifyToolAgainstSandboxToolPolicy as i, DEFAULT_SANDBOX_IMAGE as l, resolveSandboxConfigForAgent as n, resolveSandboxToolPolicyForAgent as o, SANDBOX_REGISTRY_PATH as p, resolveSandboxScope as r, DEFAULT_SANDBOX_BROWSER_IMAGE as s, resolveSandboxBrowserDockerCreateConfig as t, SANDBOX_AGENT_WORKSPACE_MOUNT as u };
