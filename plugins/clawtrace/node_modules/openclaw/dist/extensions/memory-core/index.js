import { t as formatDocsLink } from "../../links-CNsP_rfF.js";
import { r as theme } from "../../theme-D-TumEpz.js";
import { Gy as formatHelpExamples, R as parseNonNegativeByteSize, SL as resolveCronStyleNow } from "../../auth-profiles-B5ypC5S-.js";
import { T as parseAgentSessionKey } from "../../session-key-BhxcMJEE.js";
import { v as resolveSessionAgentId } from "../../agent-scope-BSOSJbA_.js";
import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { c as jsonResult, d as readNumberParam, h as readStringParam } from "../../common-B7JFWTj2.js";
import { g as SILENT_REPLY_TOKEN } from "../../system-events-BdYO0Ful.js";
import { t as resolveMemorySearchConfig } from "../../memory-search-C7gfehPk.js";
import { t as resolveMemoryBackendConfig } from "../../backend-config-Bw8hjn_C.js";
import { a as registerBuiltInMemoryEmbeddingProviders } from "../../manager-DfZJHLNC.js";
import { n as getMemorySearchManager, t as closeAllMemorySearchManagers } from "../../memory-DyCqaz7n.js";
import "../../memory-core-host-runtime-core-CaBvSqfE.js";
import "../../memory-core-host-runtime-cli-DXXrxisG.js";
import "../../memory-core-host-runtime-files-CDXkQIX2.js";
import { Type } from "@sinclair/typebox";
//#region extensions/memory-core/src/cli.ts
let memoryCliRuntimePromise = null;
async function loadMemoryCliRuntime() {
	memoryCliRuntimePromise ??= import("../../cli.runtime-C75zQITe.js");
	return await memoryCliRuntimePromise;
}
async function runMemoryStatus(opts) {
	await (await loadMemoryCliRuntime()).runMemoryStatus(opts);
}
async function runMemoryIndex(opts) {
	await (await loadMemoryCliRuntime()).runMemoryIndex(opts);
}
async function runMemorySearch(queryArg, opts) {
	await (await loadMemoryCliRuntime()).runMemorySearch(queryArg, opts);
}
function registerMemoryCli(program) {
	const memory = program.command("memory").description("Search, inspect, and reindex memory files").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw memory status", "Show index and provider status."],
		["openclaw memory status --deep", "Probe embedding provider readiness."],
		["openclaw memory index --force", "Force a full reindex."],
		["openclaw memory search \"meeting notes\"", "Quick search using positional query."],
		["openclaw memory search --query \"deployment\" --max-results 20", "Limit results for focused troubleshooting."],
		["openclaw memory status --json", "Output machine-readable JSON (good for scripts)."]
	])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/memory", "docs.openclaw.ai/cli/memory")}\n`);
	memory.command("status").description("Show memory search index status").option("--agent <id>", "Agent id (default: default agent)").option("--json", "Print JSON").option("--deep", "Probe embedding provider availability").option("--index", "Reindex if dirty (implies --deep)").option("--verbose", "Verbose logging", false).action(async (opts) => {
		await runMemoryStatus(opts);
	});
	memory.command("index").description("Reindex memory files").option("--agent <id>", "Agent id (default: default agent)").option("--force", "Force full reindex", false).option("--verbose", "Verbose logging", false).action(async (opts) => {
		await runMemoryIndex(opts);
	});
	memory.command("search").description("Search memory files").argument("[query]", "Search query").option("--query <text>", "Search query (alternative to positional argument)").option("--agent <id>", "Agent id (default: default agent)").option("--max-results <n>", "Max results", (value) => Number(value)).option("--min-score <n>", "Minimum score", (value) => Number(value)).option("--json", "Print JSON").action(async (queryArg, opts) => {
		await runMemorySearch(queryArg, opts);
	});
}
//#endregion
//#region extensions/memory-core/src/flush-plan.ts
const DEFAULT_MEMORY_FLUSH_SOFT_TOKENS = 4e3;
const DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES = 2 * 1024 * 1024;
const MEMORY_FLUSH_TARGET_HINT = "Store durable memories only in memory/YYYY-MM-DD.md (create memory/ if needed).";
const MEMORY_FLUSH_APPEND_ONLY_HINT = "If memory/YYYY-MM-DD.md already exists, APPEND new content only and do not overwrite existing entries.";
const MEMORY_FLUSH_READ_ONLY_HINT = "Treat workspace bootstrap/reference files such as MEMORY.md, SOUL.md, TOOLS.md, and AGENTS.md as read-only during this flush; never overwrite, replace, or edit them.";
const MEMORY_FLUSH_REQUIRED_HINTS = [
	MEMORY_FLUSH_TARGET_HINT,
	MEMORY_FLUSH_APPEND_ONLY_HINT,
	MEMORY_FLUSH_READ_ONLY_HINT
];
const DEFAULT_MEMORY_FLUSH_PROMPT = [
	"Pre-compaction memory flush.",
	MEMORY_FLUSH_TARGET_HINT,
	MEMORY_FLUSH_READ_ONLY_HINT,
	MEMORY_FLUSH_APPEND_ONLY_HINT,
	"Do NOT create timestamped variant files (e.g., YYYY-MM-DD-HHMM.md); always use the canonical YYYY-MM-DD.md filename.",
	`If nothing to store, reply with ${SILENT_REPLY_TOKEN}.`
].join(" ");
const DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT = [
	"Pre-compaction memory flush turn.",
	"The session is near auto-compaction; capture durable memories to disk.",
	MEMORY_FLUSH_TARGET_HINT,
	MEMORY_FLUSH_READ_ONLY_HINT,
	MEMORY_FLUSH_APPEND_ONLY_HINT,
	`You may reply, but usually ${SILENT_REPLY_TOKEN} is correct.`
].join(" ");
function formatDateStampInTimezone(nowMs, timezone) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(new Date(nowMs));
	const year = parts.find((part) => part.type === "year")?.value;
	const month = parts.find((part) => part.type === "month")?.value;
	const day = parts.find((part) => part.type === "day")?.value;
	if (year && month && day) return `${year}-${month}-${day}`;
	return new Date(nowMs).toISOString().slice(0, 10);
}
function normalizeNonNegativeInt(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return null;
	const int = Math.floor(value);
	return int >= 0 ? int : null;
}
function ensureNoReplyHint(text) {
	if (text.includes("NO_REPLY")) return text;
	return `${text}\n\nIf no user-visible reply is needed, start with ${SILENT_REPLY_TOKEN}.`;
}
function ensureMemoryFlushSafetyHints(text) {
	let next = text.trim();
	for (const hint of MEMORY_FLUSH_REQUIRED_HINTS) if (!next.includes(hint)) next = next ? `${next}\n\n${hint}` : hint;
	return next;
}
function appendCurrentTimeLine(text, timeLine) {
	const trimmed = text.trimEnd();
	if (!trimmed) return timeLine;
	if (trimmed.includes("Current time:")) return trimmed;
	return `${trimmed}\n${timeLine}`;
}
function buildMemoryFlushPlan(params = {}) {
	const resolved = params;
	const nowMs = Number.isFinite(resolved.nowMs) ? resolved.nowMs : Date.now();
	const cfg = resolved.cfg;
	const defaults = cfg?.agents?.defaults?.compaction?.memoryFlush;
	if (defaults?.enabled === false) return null;
	const softThresholdTokens = normalizeNonNegativeInt(defaults?.softThresholdTokens) ?? 4e3;
	const forceFlushTranscriptBytes = parseNonNegativeByteSize(defaults?.forceFlushTranscriptBytes) ?? 2097152;
	const reserveTokensFloor = normalizeNonNegativeInt(cfg?.agents?.defaults?.compaction?.reserveTokensFloor) ?? 2e4;
	const { timeLine, userTimezone } = resolveCronStyleNow(cfg ?? {}, nowMs);
	const dateStamp = formatDateStampInTimezone(nowMs, userTimezone);
	const relativePath = `memory/${dateStamp}.md`;
	const promptBase = ensureNoReplyHint(ensureMemoryFlushSafetyHints(defaults?.prompt?.trim() || DEFAULT_MEMORY_FLUSH_PROMPT));
	const systemPrompt = ensureNoReplyHint(ensureMemoryFlushSafetyHints(defaults?.systemPrompt?.trim() || DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT));
	return {
		softThresholdTokens,
		forceFlushTranscriptBytes,
		reserveTokensFloor,
		prompt: appendCurrentTimeLine(promptBase.replaceAll("YYYY-MM-DD", dateStamp), timeLine),
		systemPrompt: systemPrompt.replaceAll("YYYY-MM-DD", dateStamp),
		relativePath
	};
}
//#endregion
//#region extensions/memory-core/src/prompt-section.ts
const buildPromptSection = ({ availableTools, citationsMode }) => {
	const hasMemorySearch = availableTools.has("memory_search");
	const hasMemoryGet = availableTools.has("memory_get");
	if (!hasMemorySearch && !hasMemoryGet) return [];
	let toolGuidance;
	if (hasMemorySearch && hasMemoryGet) toolGuidance = "Before answering anything about prior work, decisions, dates, people, preferences, or todos: run memory_search on MEMORY.md + memory/*.md; then use memory_get to pull only the needed lines. If low confidence after search, say you checked.";
	else if (hasMemorySearch) toolGuidance = "Before answering anything about prior work, decisions, dates, people, preferences, or todos: run memory_search on MEMORY.md + memory/*.md and answer from the matching results. If low confidence after search, say you checked.";
	else toolGuidance = "Before answering anything about prior work, decisions, dates, people, preferences, or todos that already point to a specific memory file or note: run memory_get to pull only the needed lines. If low confidence after reading them, say you checked.";
	const lines = ["## Memory Recall", toolGuidance];
	if (citationsMode === "off") lines.push("Citations are disabled: do not mention file paths or line numbers in replies unless the user explicitly asks.");
	else lines.push("Citations: include Source: <path#line> when it helps the user verify memory snippets.");
	lines.push("");
	return lines;
};
//#endregion
//#region extensions/memory-core/src/runtime-provider.ts
const memoryRuntime = {
	async getMemorySearchManager(params) {
		const { manager, error } = await getMemorySearchManager(params);
		return {
			manager,
			error
		};
	},
	resolveMemoryBackendConfig(params) {
		return resolveMemoryBackendConfig(params);
	},
	async closeAllMemorySearchManagers() {
		await closeAllMemorySearchManagers();
	}
};
//#endregion
//#region extensions/memory-core/src/tools.citations.ts
function resolveMemoryCitationsMode(cfg) {
	const mode = cfg.memory?.citations;
	if (mode === "on" || mode === "off" || mode === "auto") return mode;
	return "auto";
}
function decorateCitations(results, include) {
	if (!include) return results.map((entry) => ({
		...entry,
		citation: void 0
	}));
	return results.map((entry) => {
		const citation = formatCitation(entry);
		const snippet = `${entry.snippet.trim()}\n\nSource: ${citation}`;
		return {
			...entry,
			citation,
			snippet
		};
	});
}
function formatCitation(entry) {
	const lineRange = entry.startLine === entry.endLine ? `#L${entry.startLine}` : `#L${entry.startLine}-L${entry.endLine}`;
	return `${entry.path}${lineRange}`;
}
function clampResultsByInjectedChars(results, budget) {
	if (!budget || budget <= 0) return results;
	let remaining = budget;
	const clamped = [];
	for (const entry of results) {
		if (remaining <= 0) break;
		const snippet = entry.snippet ?? "";
		if (snippet.length <= remaining) {
			clamped.push(entry);
			remaining -= snippet.length;
		} else {
			const trimmed = snippet.slice(0, Math.max(0, remaining));
			clamped.push({
				...entry,
				snippet: trimmed
			});
			break;
		}
	}
	return clamped;
}
function shouldIncludeCitations(params) {
	if (params.mode === "on") return true;
	if (params.mode === "off") return false;
	return deriveChatTypeFromSessionKey(params.sessionKey) === "direct";
}
function deriveChatTypeFromSessionKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed?.rest) return "direct";
	const tokens = new Set(parsed.rest.toLowerCase().split(":").filter(Boolean));
	if (tokens.has("channel")) return "channel";
	if (tokens.has("group")) return "group";
	return "direct";
}
//#endregion
//#region extensions/memory-core/src/tools.shared.ts
let memoryToolRuntimePromise = null;
async function loadMemoryToolRuntime() {
	memoryToolRuntimePromise ??= import("../../tools.runtime-k5q3aM_l.js");
	return await memoryToolRuntimePromise;
}
const MemorySearchSchema = Type.Object({
	query: Type.String(),
	maxResults: Type.Optional(Type.Number()),
	minScore: Type.Optional(Type.Number())
});
const MemoryGetSchema = Type.Object({
	path: Type.String(),
	from: Type.Optional(Type.Number()),
	lines: Type.Optional(Type.Number())
});
function resolveMemoryToolContext(options) {
	const cfg = options.config;
	if (!cfg) return null;
	const agentId = resolveSessionAgentId({
		sessionKey: options.agentSessionKey,
		config: cfg
	});
	if (!resolveMemorySearchConfig(cfg, agentId)) return null;
	return {
		cfg,
		agentId
	};
}
async function getMemoryManagerContext(params) {
	return await getMemoryManagerContextWithPurpose({
		...params,
		purpose: void 0
	});
}
async function getMemoryManagerContextWithPurpose(params) {
	const { getMemorySearchManager } = await loadMemoryToolRuntime();
	const { manager, error } = await getMemorySearchManager({
		cfg: params.cfg,
		agentId: params.agentId,
		purpose: params.purpose
	});
	return manager ? { manager } : { error };
}
function createMemoryTool(params) {
	const ctx = resolveMemoryToolContext(params.options);
	if (!ctx) return null;
	return {
		label: params.label,
		name: params.name,
		description: params.description,
		parameters: params.parameters,
		execute: params.execute(ctx)
	};
}
function buildMemorySearchUnavailableResult(error) {
	const reason = (error ?? "memory search unavailable").trim() || "memory search unavailable";
	const isQuotaError = /insufficient_quota|quota|429/.test(reason.toLowerCase());
	return {
		results: [],
		disabled: true,
		unavailable: true,
		error: reason,
		warning: isQuotaError ? "Memory search is unavailable because the embedding provider quota is exhausted." : "Memory search is unavailable due to an embedding/provider error.",
		action: isQuotaError ? "Top up or switch embedding provider, then retry memory_search." : "Check embedding provider configuration and retry memory_search."
	};
}
//#endregion
//#region extensions/memory-core/src/tools.ts
function createMemorySearchTool(options) {
	return createMemoryTool({
		options,
		label: "Memory Search",
		name: "memory_search",
		description: "Mandatory recall step: semantically search MEMORY.md + memory/*.md (and optional session transcripts) before answering questions about prior work, decisions, dates, people, preferences, or todos; returns top snippets with path + lines. If response has disabled=true, memory retrieval is unavailable and should be surfaced to the user.",
		parameters: MemorySearchSchema,
		execute: ({ cfg, agentId }) => async (_toolCallId, params) => {
			const query = readStringParam(params, "query", { required: true });
			const maxResults = readNumberParam(params, "maxResults");
			const minScore = readNumberParam(params, "minScore");
			const { resolveMemoryBackendConfig } = await loadMemoryToolRuntime();
			const memory = await getMemoryManagerContext({
				cfg,
				agentId
			});
			if ("error" in memory) return jsonResult(buildMemorySearchUnavailableResult(memory.error));
			try {
				const citationsMode = resolveMemoryCitationsMode(cfg);
				const includeCitations = shouldIncludeCitations({
					mode: citationsMode,
					sessionKey: options.agentSessionKey
				});
				const rawResults = await memory.manager.search(query, {
					maxResults,
					minScore,
					sessionKey: options.agentSessionKey
				});
				const status = memory.manager.status();
				const decorated = decorateCitations(rawResults, includeCitations);
				const resolved = resolveMemoryBackendConfig({
					cfg,
					agentId
				});
				const results = status.backend === "qmd" ? clampResultsByInjectedChars(decorated, resolved.qmd?.limits.maxInjectedChars) : decorated;
				const searchMode = status.custom?.searchMode;
				return jsonResult({
					results,
					provider: status.provider,
					model: status.model,
					fallback: status.fallback,
					citations: citationsMode,
					mode: searchMode
				});
			} catch (err) {
				return jsonResult(buildMemorySearchUnavailableResult(err instanceof Error ? err.message : String(err)));
			}
		}
	});
}
function createMemoryGetTool(options) {
	return createMemoryTool({
		options,
		label: "Memory Get",
		name: "memory_get",
		description: "Safe snippet read from MEMORY.md or memory/*.md with optional from/lines; use after memory_search to pull only the needed lines and keep context small.",
		parameters: MemoryGetSchema,
		execute: ({ cfg, agentId }) => async (_toolCallId, params) => {
			const relPath = readStringParam(params, "path", { required: true });
			const from = readNumberParam(params, "from", { integer: true });
			const lines = readNumberParam(params, "lines", { integer: true });
			const { readAgentMemoryFile, resolveMemoryBackendConfig } = await loadMemoryToolRuntime();
			if (resolveMemoryBackendConfig({
				cfg,
				agentId
			}).backend === "builtin") try {
				return jsonResult(await readAgentMemoryFile({
					cfg,
					agentId,
					relPath,
					from: from ?? void 0,
					lines: lines ?? void 0
				}));
			} catch (err) {
				return jsonResult({
					path: relPath,
					text: "",
					disabled: true,
					error: err instanceof Error ? err.message : String(err)
				});
			}
			const memory = await getMemoryManagerContextWithPurpose({
				cfg,
				agentId,
				purpose: "status"
			});
			if ("error" in memory) return jsonResult({
				path: relPath,
				text: "",
				disabled: true,
				error: memory.error
			});
			try {
				return jsonResult(await memory.manager.readFile({
					relPath,
					from: from ?? void 0,
					lines: lines ?? void 0
				}));
			} catch (err) {
				return jsonResult({
					path: relPath,
					text: "",
					disabled: true,
					error: err instanceof Error ? err.message : String(err)
				});
			}
		}
	});
}
//#endregion
//#region extensions/memory-core/index.ts
var memory_core_default = definePluginEntry({
	id: "memory-core",
	name: "Memory (Core)",
	description: "File-backed memory search tools and CLI",
	kind: "memory",
	register(api) {
		registerBuiltInMemoryEmbeddingProviders(api);
		api.registerMemoryPromptSection(buildPromptSection);
		api.registerMemoryFlushPlan(buildMemoryFlushPlan);
		api.registerMemoryRuntime(memoryRuntime);
		api.registerTool((ctx) => createMemorySearchTool({
			config: ctx.config,
			agentSessionKey: ctx.sessionKey
		}), { names: ["memory_search"] });
		api.registerTool((ctx) => createMemoryGetTool({
			config: ctx.config,
			agentSessionKey: ctx.sessionKey
		}), { names: ["memory_get"] });
		api.registerCli(({ program }) => {
			registerMemoryCli(program);
		}, { descriptors: [{
			name: "memory",
			description: "Search, inspect, and reindex memory files",
			hasSubcommands: true
		}] });
	}
});
//#endregion
export { DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES, DEFAULT_MEMORY_FLUSH_PROMPT, DEFAULT_MEMORY_FLUSH_SOFT_TOKENS, buildMemoryFlushPlan, buildPromptSection, memory_core_default as default };
