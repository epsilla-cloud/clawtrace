import { t as createSubsystemLogger } from "./subsystem-CJEvHE2o.js";
import { n as resolveGlobalSingleton } from "./global-singleton-BuWJMSMa.js";
import { T as truncateUtf16Safe, v as resolveUserPath } from "./utils-BfvDpbwh.js";
import { fg as onSessionTranscriptUpdate } from "./auth-profiles-B5ypC5S-.js";
import { a as resolveAgentDir, p as resolveAgentWorkspaceDir } from "./agent-scope-BSOSJbA_.js";
import { n as getProviderEnvVars } from "./provider-env-vars-DRNd-hHT.js";
import { c as resolveSessionTranscriptsDirForAgent } from "./paths-CFxPq48L.js";
import { i as listMemoryEmbeddingProviders, n as getMemoryEmbeddingProvider, t as resolveMemorySearchConfig } from "./memory-search-C7gfehPk.js";
import { i as getMemoryMultimodalExtensions, r as classifyMemoryMultimodalPath, t as buildCaseInsensitiveExtensionGlob } from "./multimodal-Dg5vpDs3.js";
import { t as extractKeywords } from "./query-expansion-nDVFHLyo.js";
import "./memory-core-host-engine-foundation-BnmuFCN-.js";
import { _ as estimateUtf8Bytes, a as ensureDir, c as listMemoryFiles, d as remapChunkLines, f as runWithConcurrency, g as estimateStructuredEmbeddingInputBytes, h as hasNonTextEmbeddingParts, i as cosineSimilarity, l as normalizeExtraMemoryPaths, n as buildMultimodalChunkForIndexing, o as hashText, p as isFileMissingError, r as chunkMarkdown, t as buildFileEntry, u as parseEmbedding } from "./internal-Bnt1j4hp.js";
import { c as listSessionFilesForAgent, l as sessionPathForFile, s as buildSessionEntry } from "./memory-core-host-engine-qmd-C4i1wMqd.js";
import { r as readMemoryFile } from "./backend-config-Bw8hjn_C.js";
import { n as loadSqliteVecExtension, r as ensureMemoryIndexSchema, t as requireNodeSqlite } from "./memory-core-host-engine-storage-C3DUzgCl.js";
import { a as runGeminiEmbeddingBatches, c as DEFAULT_VOYAGE_EMBEDDING_MODEL, d as createOpenAiEmbeddingProvider, f as DEFAULT_MISTRAL_EMBEDDING_MODEL, g as createGeminiEmbeddingProvider, h as buildGeminiEmbeddingRequest, i as runOpenAiEmbeddingBatches, l as createVoyageEmbeddingProvider, m as DEFAULT_GEMINI_EMBEDDING_MODEL, n as runVoyageEmbeddingBatches, o as DEFAULT_LOCAL_MODEL, p as createMistralEmbeddingProvider, r as OPENAI_BATCH_ENDPOINT, s as createLocalEmbeddingProvider, t as enforceEmbeddingMaxInputTokens, u as DEFAULT_OPENAI_EMBEDDING_MODEL } from "./memory-core-host-engine-embeddings-BwxuPjnM.js";
import { n as createOllamaEmbeddingProvider, t as DEFAULT_OLLAMA_EMBEDDING_MODEL } from "./embedding-provider-DrjVlswj.js";
import "./provider-env-vars-CqmjX32t.js";
import fsSync from "node:fs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import chokidar from "chokidar";
//#region extensions/memory-core/src/memory/provider-adapters.ts
function formatErrorMessage$1(err) {
	return err instanceof Error ? err.message : String(err);
}
function isMissingApiKeyError(err) {
	return formatErrorMessage$1(err).includes("No API key found for provider");
}
function sanitizeHeaders(headers, excludedHeaderNames) {
	const excluded = new Set(excludedHeaderNames.map((name) => name.toLowerCase()));
	return Object.entries(headers).filter(([key]) => !excluded.has(key.toLowerCase())).toSorted(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, value]);
}
function mapBatchEmbeddingsByIndex(byCustomId, count) {
	const embeddings = [];
	for (let index = 0; index < count; index += 1) embeddings.push(byCustomId.get(String(index)) ?? []);
	return embeddings;
}
function isNodeLlamaCppMissing(err) {
	if (!(err instanceof Error)) return false;
	return err.code === "ERR_MODULE_NOT_FOUND" && err.message.includes("node-llama-cpp");
}
function formatLocalSetupError(err) {
	const detail = formatErrorMessage$1(err);
	const missing = isNodeLlamaCppMissing(err);
	return [
		"Local embeddings unavailable.",
		missing ? "Reason: optional dependency node-llama-cpp is missing (or failed to install)." : detail ? `Reason: ${detail}` : void 0,
		missing && detail ? `Detail: ${detail}` : null,
		"To enable local embeddings:",
		"1) Use Node 24 (recommended for installs/updates; Node 22 LTS, currently 22.14+, remains supported)",
		missing ? "2) Reinstall OpenClaw (this should install node-llama-cpp): npm i -g openclaw@latest" : null,
		"3) If you use pnpm: pnpm approve-builds (select node-llama-cpp), then pnpm rebuild node-llama-cpp",
		...[
			"openai",
			"gemini",
			"voyage",
			"mistral"
		].map((provider) => `Or set agents.defaults.memorySearch.provider = "${provider}" (remote).`)
	].filter(Boolean).join("\n");
}
function canAutoSelectLocal(modelPath) {
	const trimmed = modelPath?.trim();
	if (!trimmed) return false;
	if (/^(hf:|https?:)/i.test(trimmed)) return false;
	const resolved = resolveUserPath(trimmed);
	try {
		return fsSync.statSync(resolved).isFile();
	} catch {
		return false;
	}
}
function supportsGeminiMultimodalEmbeddings(model) {
	return model.trim().replace(/^models\//, "").replace(/^(gemini|google)\//, "") === "gemini-embedding-2-preview";
}
function resolveMemoryEmbeddingAuthProviderId(providerId) {
	return providerId === "gemini" ? "google" : providerId;
}
const builtinMemoryEmbeddingProviderAdapters = [
	{
		id: "local",
		defaultModel: DEFAULT_LOCAL_MODEL,
		transport: "local",
		autoSelectPriority: 10,
		formatSetupError: formatLocalSetupError,
		shouldContinueAutoSelection: () => true,
		create: async (options) => {
			const provider = await createLocalEmbeddingProvider({
				...options,
				provider: "local",
				fallback: "none"
			});
			return {
				provider,
				runtime: {
					id: "local",
					cacheKeyData: {
						provider: "local",
						model: provider.model
					}
				}
			};
		}
	},
	{
		id: "openai",
		defaultModel: DEFAULT_OPENAI_EMBEDDING_MODEL,
		transport: "remote",
		autoSelectPriority: 20,
		allowExplicitWhenConfiguredAuto: true,
		shouldContinueAutoSelection: isMissingApiKeyError,
		create: async (options) => {
			const { provider, client } = await createOpenAiEmbeddingProvider({
				...options,
				provider: "openai",
				fallback: "none"
			});
			return {
				provider,
				runtime: {
					id: "openai",
					cacheKeyData: {
						provider: "openai",
						baseUrl: client.baseUrl,
						model: client.model,
						headers: sanitizeHeaders(client.headers, ["authorization"])
					},
					batchEmbed: async (batch) => {
						return mapBatchEmbeddingsByIndex(await runOpenAiEmbeddingBatches({
							openAi: client,
							agentId: batch.agentId,
							requests: batch.chunks.map((chunk, index) => ({
								custom_id: String(index),
								method: "POST",
								url: OPENAI_BATCH_ENDPOINT,
								body: {
									model: client.model,
									input: chunk.text
								}
							})),
							wait: batch.wait,
							concurrency: batch.concurrency,
							pollIntervalMs: batch.pollIntervalMs,
							timeoutMs: batch.timeoutMs,
							debug: batch.debug
						}), batch.chunks.length);
					}
				}
			};
		}
	},
	{
		id: "gemini",
		defaultModel: DEFAULT_GEMINI_EMBEDDING_MODEL,
		transport: "remote",
		autoSelectPriority: 30,
		allowExplicitWhenConfiguredAuto: true,
		supportsMultimodalEmbeddings: ({ model }) => supportsGeminiMultimodalEmbeddings(model),
		shouldContinueAutoSelection: isMissingApiKeyError,
		create: async (options) => {
			const { provider, client } = await createGeminiEmbeddingProvider({
				...options,
				provider: "gemini",
				fallback: "none"
			});
			return {
				provider,
				runtime: {
					id: "gemini",
					cacheKeyData: {
						provider: "gemini",
						baseUrl: client.baseUrl,
						model: client.model,
						outputDimensionality: client.outputDimensionality,
						headers: sanitizeHeaders(client.headers, ["authorization", "x-goog-api-key"])
					},
					batchEmbed: async (batch) => {
						if (batch.chunks.some((chunk) => hasNonTextEmbeddingParts(chunk.embeddingInput))) return null;
						return mapBatchEmbeddingsByIndex(await runGeminiEmbeddingBatches({
							gemini: client,
							agentId: batch.agentId,
							requests: batch.chunks.map((chunk, index) => ({
								custom_id: String(index),
								request: buildGeminiEmbeddingRequest({
									input: chunk.embeddingInput ?? { text: chunk.text },
									taskType: "RETRIEVAL_DOCUMENT",
									modelPath: client.modelPath,
									outputDimensionality: client.outputDimensionality
								})
							})),
							wait: batch.wait,
							concurrency: batch.concurrency,
							pollIntervalMs: batch.pollIntervalMs,
							timeoutMs: batch.timeoutMs,
							debug: batch.debug
						}), batch.chunks.length);
					}
				}
			};
		}
	},
	{
		id: "voyage",
		defaultModel: DEFAULT_VOYAGE_EMBEDDING_MODEL,
		transport: "remote",
		autoSelectPriority: 40,
		allowExplicitWhenConfiguredAuto: true,
		shouldContinueAutoSelection: isMissingApiKeyError,
		create: async (options) => {
			const { provider, client } = await createVoyageEmbeddingProvider({
				...options,
				provider: "voyage",
				fallback: "none"
			});
			return {
				provider,
				runtime: {
					id: "voyage",
					batchEmbed: async (batch) => {
						return mapBatchEmbeddingsByIndex(await runVoyageEmbeddingBatches({
							client,
							agentId: batch.agentId,
							requests: batch.chunks.map((chunk, index) => ({
								custom_id: String(index),
								body: { input: chunk.text }
							})),
							wait: batch.wait,
							concurrency: batch.concurrency,
							pollIntervalMs: batch.pollIntervalMs,
							timeoutMs: batch.timeoutMs,
							debug: batch.debug
						}), batch.chunks.length);
					}
				}
			};
		}
	},
	{
		id: "mistral",
		defaultModel: DEFAULT_MISTRAL_EMBEDDING_MODEL,
		transport: "remote",
		autoSelectPriority: 50,
		allowExplicitWhenConfiguredAuto: true,
		shouldContinueAutoSelection: isMissingApiKeyError,
		create: async (options) => {
			const { provider, client } = await createMistralEmbeddingProvider({
				...options,
				provider: "mistral",
				fallback: "none"
			});
			return {
				provider,
				runtime: {
					id: "mistral",
					cacheKeyData: {
						provider: "mistral",
						model: client.model
					}
				}
			};
		}
	},
	{
		id: "ollama",
		defaultModel: DEFAULT_OLLAMA_EMBEDDING_MODEL,
		transport: "remote",
		create: async (options) => {
			const { provider, client } = await createOllamaEmbeddingProvider({
				...options,
				provider: "ollama",
				fallback: "none"
			});
			return {
				provider,
				runtime: {
					id: "ollama",
					cacheKeyData: {
						provider: "ollama",
						model: client.model
					}
				}
			};
		}
	}
];
const builtinMemoryEmbeddingProviderAdapterById = new Map(builtinMemoryEmbeddingProviderAdapters.map((adapter) => [adapter.id, adapter]));
function getBuiltinMemoryEmbeddingProviderAdapter(id) {
	return builtinMemoryEmbeddingProviderAdapterById.get(id);
}
function registerBuiltInMemoryEmbeddingProviders(register) {
	const existingIds = new Set(listMemoryEmbeddingProviders().map((adapter) => adapter.id));
	for (const adapter of builtinMemoryEmbeddingProviderAdapters) {
		if (existingIds.has(adapter.id)) continue;
		register.registerMemoryEmbeddingProvider(adapter);
	}
}
function getBuiltinMemoryEmbeddingProviderDoctorMetadata(providerId) {
	const adapter = getBuiltinMemoryEmbeddingProviderAdapter(providerId);
	if (!adapter) return null;
	const authProviderId = resolveMemoryEmbeddingAuthProviderId(adapter.id);
	return {
		providerId: adapter.id,
		authProviderId,
		envVars: getProviderEnvVars(authProviderId),
		transport: adapter.transport === "local" ? "local" : "remote",
		autoSelectPriority: adapter.autoSelectPriority
	};
}
function listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata() {
	return builtinMemoryEmbeddingProviderAdapters.filter((adapter) => typeof adapter.autoSelectPriority === "number").toSorted((a, b) => (a.autoSelectPriority ?? 0) - (b.autoSelectPriority ?? 0)).map((adapter) => ({
		providerId: adapter.id,
		authProviderId: resolveMemoryEmbeddingAuthProviderId(adapter.id),
		envVars: getProviderEnvVars(resolveMemoryEmbeddingAuthProviderId(adapter.id)),
		transport: adapter.transport === "local" ? "local" : "remote",
		autoSelectPriority: adapter.autoSelectPriority
	}));
}
//#endregion
//#region extensions/memory-core/src/memory/embeddings.ts
function formatErrorMessage(err) {
	return err instanceof Error ? err.message : String(err);
}
function formatProviderError(adapter, err) {
	return adapter.formatSetupError?.(err) ?? formatErrorMessage(err);
}
function shouldContinueAutoSelection(adapter, err) {
	return adapter.shouldContinueAutoSelection?.(err) ?? false;
}
function getAdapter(id) {
	const adapter = getMemoryEmbeddingProvider(id);
	if (!adapter) throw new Error(`Unknown memory embedding provider: ${id}`);
	return adapter;
}
function listAutoSelectAdapters(options) {
	return listMemoryEmbeddingProviders().filter((adapter) => typeof adapter.autoSelectPriority === "number").filter((adapter) => adapter.id === "local" ? canAutoSelectLocal(options.local?.modelPath) : true).toSorted((a, b) => (a.autoSelectPriority ?? Number.MAX_SAFE_INTEGER) - (b.autoSelectPriority ?? Number.MAX_SAFE_INTEGER));
}
function resolveProviderModel(adapter, requestedModel) {
	const trimmed = requestedModel.trim();
	if (trimmed) return trimmed;
	return adapter.defaultModel ?? "";
}
function resolveEmbeddingProviderFallbackModel(providerId, fallbackSourceModel) {
	return (getMemoryEmbeddingProvider(providerId) ?? getBuiltinMemoryEmbeddingProviderAdapter(providerId))?.defaultModel ?? fallbackSourceModel;
}
async function createWithAdapter(adapter, options) {
	const result = await adapter.create({
		...options,
		model: resolveProviderModel(adapter, options.model)
	});
	return {
		provider: result.provider,
		requestedProvider: options.provider,
		runtime: result.runtime
	};
}
async function createEmbeddingProvider(options) {
	if (options.provider === "auto") {
		const reasons = [];
		for (const adapter of listAutoSelectAdapters(options)) try {
			return {
				...await createWithAdapter(adapter, {
					...options,
					provider: adapter.id
				}),
				requestedProvider: "auto"
			};
		} catch (err) {
			const message = formatProviderError(adapter, err);
			if (shouldContinueAutoSelection(adapter, err)) {
				reasons.push(message);
				continue;
			}
			const wrapped = new Error(message);
			wrapped.cause = err;
			throw wrapped;
		}
		return {
			provider: null,
			requestedProvider: "auto",
			providerUnavailableReason: reasons.length > 0 ? reasons.join("\n\n") : "No embeddings provider available."
		};
	}
	const primaryAdapter = getAdapter(options.provider);
	try {
		return await createWithAdapter(primaryAdapter, options);
	} catch (primaryErr) {
		const reason = formatProviderError(primaryAdapter, primaryErr);
		if (options.fallback && options.fallback !== "none" && options.fallback !== options.provider) {
			const fallbackAdapter = getAdapter(options.fallback);
			try {
				return {
					...await createWithAdapter(fallbackAdapter, {
						...options,
						provider: options.fallback
					}),
					requestedProvider: options.provider,
					fallbackFrom: options.provider,
					fallbackReason: reason
				};
			} catch (fallbackErr) {
				const fallbackReason = formatProviderError(fallbackAdapter, fallbackErr);
				const wrapped = /* @__PURE__ */ new Error(`${reason}\n\nFallback to ${options.fallback} failed: ${fallbackReason}`);
				wrapped.cause = primaryErr;
				throw wrapped;
			}
		}
		const wrapped = new Error(reason);
		wrapped.cause = primaryErr;
		throw wrapped;
	}
}
//#endregion
//#region extensions/memory-core/src/memory/mmr.ts
const DEFAULT_MMR_CONFIG = {
	enabled: false,
	lambda: .7
};
/**
* Regex matching CJK-family characters that lack whitespace word boundaries:
* - CJK Unified Ideographs (Chinese hanzi, Japanese kanji, Korean hanja)
* - CJK Extension A
* - Hiragana & Katakana (Japanese)
* - Hangul Syllables & Jamo (Korean)
*/
const CJK_RE = /[\u3040-\u309f\u30a0-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af\u1100-\u11ff]/;
/**
* Tokenize text for Jaccard similarity computation.
* Extracts alphanumeric tokens, CJK-family characters (unigrams),
* and consecutive CJK character pairs (bigrams).
*
* Bigrams are only created from characters that are adjacent in the
* original text, so mixed content like "我喜欢hello你好" will NOT
* produce the spurious bigram "欢你".
*/
function tokenize(text) {
	const lower = text.toLowerCase();
	const ascii = lower.match(/[a-z0-9_]+/g) ?? [];
	const chars = Array.from(lower);
	const cjkData = [];
	for (let i = 0; i < chars.length; i++) if (CJK_RE.test(chars[i])) cjkData.push({
		char: chars[i],
		index: i
	});
	const bigrams = [];
	for (let i = 0; i < cjkData.length - 1; i++) if (cjkData[i + 1].index === cjkData[i].index + 1) bigrams.push(cjkData[i].char + cjkData[i + 1].char);
	const unigrams = cjkData.map((d) => d.char);
	return new Set([
		...ascii,
		...bigrams,
		...unigrams
	]);
}
/**
* Compute Jaccard similarity between two token sets.
* Returns a value in [0, 1] where 1 means identical sets.
*/
function jaccardSimilarity(setA, setB) {
	if (setA.size === 0 && setB.size === 0) return 1;
	if (setA.size === 0 || setB.size === 0) return 0;
	let intersectionSize = 0;
	const smaller = setA.size <= setB.size ? setA : setB;
	const larger = setA.size <= setB.size ? setB : setA;
	for (const token of smaller) if (larger.has(token)) intersectionSize++;
	const unionSize = setA.size + setB.size - intersectionSize;
	return unionSize === 0 ? 0 : intersectionSize / unionSize;
}
/**
* Compute the maximum similarity between an item and all selected items.
*/
function maxSimilarityToSelected(item, selectedItems, tokenCache) {
	if (selectedItems.length === 0) return 0;
	let maxSim = 0;
	const itemTokens = tokenCache.get(item.id) ?? tokenize(item.content);
	for (const selected of selectedItems) {
		const sim = jaccardSimilarity(itemTokens, tokenCache.get(selected.id) ?? tokenize(selected.content));
		if (sim > maxSim) maxSim = sim;
	}
	return maxSim;
}
/**
* Compute MMR score for a candidate item.
* MMR = λ * relevance - (1-λ) * max_similarity_to_selected
*/
function computeMMRScore(relevance, maxSimilarity, lambda) {
	return lambda * relevance - (1 - lambda) * maxSimilarity;
}
/**
* Re-rank items using Maximal Marginal Relevance (MMR).
*
* The algorithm iteratively selects items that balance relevance with diversity:
* 1. Start with the highest-scoring item
* 2. For each remaining slot, select the item that maximizes the MMR score
* 3. MMR score = λ * relevance - (1-λ) * max_similarity_to_already_selected
*
* @param items - Items to re-rank, must have score and content
* @param config - MMR configuration (lambda, enabled)
* @returns Re-ranked items in MMR order
*/
function mmrRerank(items, config = {}) {
	const { enabled = DEFAULT_MMR_CONFIG.enabled, lambda = DEFAULT_MMR_CONFIG.lambda } = config;
	if (!enabled || items.length <= 1) return [...items];
	const clampedLambda = Math.max(0, Math.min(1, lambda));
	if (clampedLambda === 1) return [...items].toSorted((a, b) => b.score - a.score);
	const tokenCache = /* @__PURE__ */ new Map();
	for (const item of items) tokenCache.set(item.id, tokenize(item.content));
	const maxScore = Math.max(...items.map((i) => i.score));
	const minScore = Math.min(...items.map((i) => i.score));
	const scoreRange = maxScore - minScore;
	const normalizeScore = (score) => {
		if (scoreRange === 0) return 1;
		return (score - minScore) / scoreRange;
	};
	const selected = [];
	const remaining = new Set(items);
	while (remaining.size > 0) {
		let bestItem = null;
		let bestMMRScore = -Infinity;
		for (const candidate of remaining) {
			const mmrScore = computeMMRScore(normalizeScore(candidate.score), maxSimilarityToSelected(candidate, selected, tokenCache), clampedLambda);
			if (mmrScore > bestMMRScore || mmrScore === bestMMRScore && candidate.score > (bestItem?.score ?? -Infinity)) {
				bestMMRScore = mmrScore;
				bestItem = candidate;
			}
		}
		if (bestItem) {
			selected.push(bestItem);
			remaining.delete(bestItem);
		} else break;
	}
	return selected;
}
/**
* Apply MMR re-ranking to hybrid search results.
* Adapts the generic MMR function to work with the hybrid search result format.
*/
function applyMMRToHybridResults(results, config = {}) {
	if (results.length === 0) return results;
	const itemById = /* @__PURE__ */ new Map();
	return mmrRerank(results.map((r, index) => {
		const id = `${r.path}:${r.startLine}:${index}`;
		itemById.set(id, r);
		return {
			id,
			score: r.score,
			content: r.snippet
		};
	}), config).map((item) => itemById.get(item.id));
}
//#endregion
//#region extensions/memory-core/src/memory/temporal-decay.ts
const DEFAULT_TEMPORAL_DECAY_CONFIG = {
	enabled: false,
	halfLifeDays: 30
};
const DAY_MS = 1440 * 60 * 1e3;
const DATED_MEMORY_PATH_RE = /(?:^|\/)memory\/(\d{4})-(\d{2})-(\d{2})\.md$/;
function toDecayLambda(halfLifeDays) {
	if (!Number.isFinite(halfLifeDays) || halfLifeDays <= 0) return 0;
	return Math.LN2 / halfLifeDays;
}
function calculateTemporalDecayMultiplier(params) {
	const lambda = toDecayLambda(params.halfLifeDays);
	const clampedAge = Math.max(0, params.ageInDays);
	if (lambda <= 0 || !Number.isFinite(clampedAge)) return 1;
	return Math.exp(-lambda * clampedAge);
}
function applyTemporalDecayToScore(params) {
	return params.score * calculateTemporalDecayMultiplier(params);
}
function parseMemoryDateFromPath(filePath) {
	const normalized = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
	const match = DATED_MEMORY_PATH_RE.exec(normalized);
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
	const timestamp = Date.UTC(year, month - 1, day);
	const parsed = new Date(timestamp);
	if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
	return parsed;
}
function isEvergreenMemoryPath(filePath) {
	const normalized = filePath.replaceAll("\\", "/").replace(/^\.\//, "");
	if (normalized === "MEMORY.md" || normalized === "memory.md") return true;
	if (!normalized.startsWith("memory/")) return false;
	return !DATED_MEMORY_PATH_RE.test(normalized);
}
async function extractTimestamp(params) {
	const fromPath = parseMemoryDateFromPath(params.filePath);
	if (fromPath) return fromPath;
	if (params.source === "memory" && isEvergreenMemoryPath(params.filePath)) return null;
	if (!params.workspaceDir) return null;
	const absolutePath = path.isAbsolute(params.filePath) ? params.filePath : path.resolve(params.workspaceDir, params.filePath);
	try {
		const stat = await fs.stat(absolutePath);
		if (!Number.isFinite(stat.mtimeMs)) return null;
		return new Date(stat.mtimeMs);
	} catch {
		return null;
	}
}
function ageInDaysFromTimestamp(timestamp, nowMs) {
	return Math.max(0, nowMs - timestamp.getTime()) / DAY_MS;
}
async function applyTemporalDecayToHybridResults(params) {
	const config = {
		...DEFAULT_TEMPORAL_DECAY_CONFIG,
		...params.temporalDecay
	};
	if (!config.enabled) return [...params.results];
	const nowMs = params.nowMs ?? Date.now();
	const timestampPromiseCache = /* @__PURE__ */ new Map();
	return Promise.all(params.results.map(async (entry) => {
		const cacheKey = `${entry.source}:${entry.path}`;
		let timestampPromise = timestampPromiseCache.get(cacheKey);
		if (!timestampPromise) {
			timestampPromise = extractTimestamp({
				filePath: entry.path,
				source: entry.source,
				workspaceDir: params.workspaceDir
			});
			timestampPromiseCache.set(cacheKey, timestampPromise);
		}
		const timestamp = await timestampPromise;
		if (!timestamp) return entry;
		const decayedScore = applyTemporalDecayToScore({
			score: entry.score,
			ageInDays: ageInDaysFromTimestamp(timestamp, nowMs),
			halfLifeDays: config.halfLifeDays
		});
		return {
			...entry,
			score: decayedScore
		};
	}));
}
//#endregion
//#region extensions/memory-core/src/memory/hybrid.ts
function buildFtsQuery(raw) {
	const tokens = raw.match(/[\p{L}\p{N}_]+/gu)?.map((t) => t.trim()).filter(Boolean) ?? [];
	if (tokens.length === 0) return null;
	return tokens.map((t) => `"${t.replaceAll("\"", "")}"`).join(" AND ");
}
function bm25RankToScore(rank) {
	if (!Number.isFinite(rank)) return 1 / 1e3;
	if (rank < 0) {
		const relevance = -rank;
		return relevance / (1 + relevance);
	}
	return 1 / (1 + rank);
}
async function mergeHybridResults(params) {
	const byId = /* @__PURE__ */ new Map();
	for (const r of params.vector) byId.set(r.id, {
		id: r.id,
		path: r.path,
		startLine: r.startLine,
		endLine: r.endLine,
		source: r.source,
		snippet: r.snippet,
		vectorScore: r.vectorScore,
		textScore: 0
	});
	for (const r of params.keyword) {
		const existing = byId.get(r.id);
		if (existing) {
			existing.textScore = r.textScore;
			if (r.snippet && r.snippet.length > 0) existing.snippet = r.snippet;
		} else byId.set(r.id, {
			id: r.id,
			path: r.path,
			startLine: r.startLine,
			endLine: r.endLine,
			source: r.source,
			snippet: r.snippet,
			vectorScore: 0,
			textScore: r.textScore
		});
	}
	const sorted = (await applyTemporalDecayToHybridResults({
		results: Array.from(byId.values()).map((entry) => {
			const score = params.vectorWeight * entry.vectorScore + params.textWeight * entry.textScore;
			return {
				path: entry.path,
				startLine: entry.startLine,
				endLine: entry.endLine,
				score,
				snippet: entry.snippet,
				source: entry.source
			};
		}),
		temporalDecay: {
			...DEFAULT_TEMPORAL_DECAY_CONFIG,
			...params.temporalDecay
		},
		workspaceDir: params.workspaceDir,
		nowMs: params.nowMs
	})).toSorted((a, b) => b.score - a.score);
	const mmrConfig = {
		...DEFAULT_MMR_CONFIG,
		...params.mmr
	};
	if (mmrConfig.enabled) return applyMMRToHybridResults(sorted, mmrConfig);
	return sorted;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-ops.ts
const META_KEY = "memory_index_meta_v1";
const VECTOR_TABLE$2 = "chunks_vec";
const FTS_TABLE$2 = "chunks_fts";
const EMBEDDING_CACHE_TABLE$2 = "embedding_cache";
const SESSION_DIRTY_DEBOUNCE_MS = 5e3;
const SESSION_DELTA_READ_CHUNK_BYTES = 64 * 1024;
const VECTOR_LOAD_TIMEOUT_MS = 3e4;
const IGNORED_MEMORY_WATCH_DIR_NAMES = new Set([
	".git",
	"node_modules",
	".pnpm-store",
	".venv",
	"venv",
	".tox",
	"__pycache__"
]);
const log$2 = createSubsystemLogger("memory");
function shouldIgnoreMemoryWatchPath(watchPath) {
	return path.normalize(watchPath).split(path.sep).map((segment) => segment.trim().toLowerCase()).some((segment) => IGNORED_MEMORY_WATCH_DIR_NAMES.has(segment));
}
function runDetachedMemorySync(sync, reason) {
	sync().catch((err) => {
		log$2.warn(`memory sync failed (${reason}): ${String(err)}`);
	});
}
var MemoryManagerSyncOps = class {
	constructor() {
		this.provider = null;
		this.sources = /* @__PURE__ */ new Set();
		this.providerKey = null;
		this.fts = {
			enabled: false,
			available: false
		};
		this.vectorReady = null;
		this.watcher = null;
		this.watchTimer = null;
		this.sessionWatchTimer = null;
		this.sessionUnsubscribe = null;
		this.intervalTimer = null;
		this.closed = false;
		this.dirty = false;
		this.sessionsDirty = false;
		this.sessionsDirtyFiles = /* @__PURE__ */ new Set();
		this.sessionPendingFiles = /* @__PURE__ */ new Set();
		this.sessionDeltas = /* @__PURE__ */ new Map();
		this.lastMetaSerialized = null;
	}
	async ensureVectorReady(dimensions) {
		if (!this.vector.enabled) return false;
		if (!this.vectorReady) this.vectorReady = this.withTimeout(this.loadVectorExtension(), VECTOR_LOAD_TIMEOUT_MS, `sqlite-vec load timed out after ${Math.round(VECTOR_LOAD_TIMEOUT_MS / 1e3)}s`);
		let ready = false;
		try {
			ready = await this.vectorReady || false;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			this.vector.available = false;
			this.vector.loadError = message;
			this.vectorReady = null;
			log$2.warn(`sqlite-vec unavailable: ${message}`);
			return false;
		}
		if (ready && typeof dimensions === "number" && dimensions > 0) this.ensureVectorTable(dimensions);
		return ready;
	}
	async loadVectorExtension() {
		if (this.vector.available !== null) return this.vector.available;
		if (!this.vector.enabled) {
			this.vector.available = false;
			return false;
		}
		try {
			const resolvedPath = this.vector.extensionPath?.trim() ? resolveUserPath(this.vector.extensionPath) : void 0;
			const loaded = await loadSqliteVecExtension({
				db: this.db,
				extensionPath: resolvedPath
			});
			if (!loaded.ok) throw new Error(loaded.error ?? "unknown sqlite-vec load error");
			this.vector.extensionPath = loaded.extensionPath;
			this.vector.available = true;
			return true;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			this.vector.available = false;
			this.vector.loadError = message;
			log$2.warn(`sqlite-vec unavailable: ${message}`);
			return false;
		}
	}
	ensureVectorTable(dimensions) {
		if (this.vector.dims === dimensions) return;
		if (this.vector.dims && this.vector.dims !== dimensions) this.dropVectorTable();
		this.db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS ${VECTOR_TABLE$2} USING vec0(\n  id TEXT PRIMARY KEY,\n  embedding FLOAT[${dimensions}]\n)`);
		this.vector.dims = dimensions;
	}
	dropVectorTable() {
		try {
			this.db.exec(`DROP TABLE IF EXISTS ${VECTOR_TABLE$2}`);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			log$2.debug(`Failed to drop ${VECTOR_TABLE$2}: ${message}`);
		}
	}
	buildSourceFilter(alias) {
		const sources = Array.from(this.sources);
		if (sources.length === 0) return {
			sql: "",
			params: []
		};
		return {
			sql: ` AND ${alias ? `${alias}.source` : "source"} IN (${sources.map(() => "?").join(", ")})`,
			params: sources
		};
	}
	openDatabase() {
		const dbPath = resolveUserPath(this.settings.store.path);
		return this.openDatabaseAtPath(dbPath);
	}
	openDatabaseAtPath(dbPath) {
		ensureDir(path.dirname(dbPath));
		const { DatabaseSync } = requireNodeSqlite();
		const db = new DatabaseSync(dbPath, { allowExtension: this.settings.store.vector.enabled });
		db.exec("PRAGMA busy_timeout = 5000");
		return db;
	}
	seedEmbeddingCache(sourceDb) {
		if (!this.cache.enabled) return;
		try {
			const rows = sourceDb.prepare(`SELECT provider, model, provider_key, hash, embedding, dims, updated_at FROM ${EMBEDDING_CACHE_TABLE$2}`).all();
			if (!rows.length) return;
			const insert = this.db.prepare(`INSERT INTO ${EMBEDDING_CACHE_TABLE$2} (provider, model, provider_key, hash, embedding, dims, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(provider, model, provider_key, hash) DO UPDATE SET
           embedding=excluded.embedding,
           dims=excluded.dims,
           updated_at=excluded.updated_at`);
			this.db.exec("BEGIN");
			for (const row of rows) insert.run(row.provider, row.model, row.provider_key, row.hash, row.embedding, row.dims, row.updated_at);
			this.db.exec("COMMIT");
		} catch (err) {
			try {
				this.db.exec("ROLLBACK");
			} catch {}
			throw err;
		}
	}
	async swapIndexFiles(targetPath, tempPath) {
		const backupPath = `${targetPath}.backup-${randomUUID()}`;
		await this.moveIndexFiles(targetPath, backupPath);
		try {
			await this.moveIndexFiles(tempPath, targetPath);
		} catch (err) {
			await this.moveIndexFiles(backupPath, targetPath);
			throw err;
		}
		await this.removeIndexFiles(backupPath);
	}
	async moveIndexFiles(sourceBase, targetBase) {
		for (const suffix of [
			"",
			"-wal",
			"-shm"
		]) {
			const source = `${sourceBase}${suffix}`;
			const target = `${targetBase}${suffix}`;
			try {
				await fs.rename(source, target);
			} catch (err) {
				if (err.code !== "ENOENT") throw err;
			}
		}
	}
	async removeIndexFiles(basePath) {
		await Promise.all([
			"",
			"-wal",
			"-shm"
		].map((suffix) => fs.rm(`${basePath}${suffix}`, { force: true })));
	}
	ensureSchema() {
		const result = ensureMemoryIndexSchema({
			db: this.db,
			embeddingCacheTable: EMBEDDING_CACHE_TABLE$2,
			cacheEnabled: this.cache.enabled,
			ftsTable: FTS_TABLE$2,
			ftsEnabled: this.fts.enabled
		});
		this.fts.available = result.ftsAvailable;
		if (result.ftsError) {
			this.fts.loadError = result.ftsError;
			if (this.fts.enabled) log$2.warn(`fts unavailable: ${result.ftsError}`);
		}
	}
	ensureWatcher() {
		if (!this.sources.has("memory") || !this.settings.sync.watch || this.watcher) return;
		const watchPaths = new Set([
			path.join(this.workspaceDir, "MEMORY.md"),
			path.join(this.workspaceDir, "memory.md"),
			path.join(this.workspaceDir, "memory", "**", "*.md")
		]);
		const additionalPaths = normalizeExtraMemoryPaths(this.workspaceDir, this.settings.extraPaths);
		for (const entry of additionalPaths) try {
			const stat = fsSync.lstatSync(entry);
			if (stat.isSymbolicLink()) continue;
			if (stat.isDirectory()) {
				watchPaths.add(path.join(entry, "**", "*.md"));
				if (this.settings.multimodal.enabled) for (const modality of this.settings.multimodal.modalities) for (const extension of getMemoryMultimodalExtensions(modality)) watchPaths.add(path.join(entry, "**", buildCaseInsensitiveExtensionGlob(extension)));
				continue;
			}
			if (stat.isFile() && (entry.toLowerCase().endsWith(".md") || classifyMemoryMultimodalPath(entry, this.settings.multimodal) !== null)) watchPaths.add(entry);
		} catch {}
		this.watcher = chokidar.watch(Array.from(watchPaths), {
			ignoreInitial: true,
			ignored: (watchPath) => shouldIgnoreMemoryWatchPath(String(watchPath)),
			awaitWriteFinish: {
				stabilityThreshold: this.settings.sync.watchDebounceMs,
				pollInterval: 100
			}
		});
		const markDirty = () => {
			this.dirty = true;
			this.scheduleWatchSync();
		};
		this.watcher.on("add", markDirty);
		this.watcher.on("change", markDirty);
		this.watcher.on("unlink", markDirty);
	}
	ensureSessionListener() {
		if (!this.sources.has("sessions") || this.sessionUnsubscribe) return;
		this.sessionUnsubscribe = onSessionTranscriptUpdate((update) => {
			if (this.closed) return;
			const sessionFile = update.sessionFile;
			if (!this.isSessionFileForAgent(sessionFile)) return;
			this.scheduleSessionDirty(sessionFile);
		});
	}
	scheduleSessionDirty(sessionFile) {
		this.sessionPendingFiles.add(sessionFile);
		if (this.sessionWatchTimer) return;
		this.sessionWatchTimer = setTimeout(() => {
			this.sessionWatchTimer = null;
			this.processSessionDeltaBatch().catch((err) => {
				log$2.warn(`memory session delta failed: ${String(err)}`);
			});
		}, SESSION_DIRTY_DEBOUNCE_MS);
	}
	async processSessionDeltaBatch() {
		if (this.sessionPendingFiles.size === 0) return;
		const pending = Array.from(this.sessionPendingFiles);
		this.sessionPendingFiles.clear();
		let shouldSync = false;
		for (const sessionFile of pending) {
			const delta = await this.updateSessionDelta(sessionFile);
			if (!delta) continue;
			const bytesThreshold = delta.deltaBytes;
			const messagesThreshold = delta.deltaMessages;
			const bytesHit = bytesThreshold <= 0 ? delta.pendingBytes > 0 : delta.pendingBytes >= bytesThreshold;
			const messagesHit = messagesThreshold <= 0 ? delta.pendingMessages > 0 : delta.pendingMessages >= messagesThreshold;
			if (!bytesHit && !messagesHit) continue;
			this.sessionsDirtyFiles.add(sessionFile);
			this.sessionsDirty = true;
			delta.pendingBytes = bytesThreshold > 0 ? Math.max(0, delta.pendingBytes - bytesThreshold) : 0;
			delta.pendingMessages = messagesThreshold > 0 ? Math.max(0, delta.pendingMessages - messagesThreshold) : 0;
			shouldSync = true;
		}
		if (shouldSync) this.sync({ reason: "session-delta" }).catch((err) => {
			log$2.warn(`memory sync failed (session-delta): ${String(err)}`);
		});
	}
	async updateSessionDelta(sessionFile) {
		const thresholds = this.settings.sync.sessions;
		if (!thresholds) return null;
		let stat;
		try {
			stat = await fs.stat(sessionFile);
		} catch {
			return null;
		}
		const size = stat.size;
		let state = this.sessionDeltas.get(sessionFile);
		if (!state) {
			state = {
				lastSize: 0,
				pendingBytes: 0,
				pendingMessages: 0
			};
			this.sessionDeltas.set(sessionFile, state);
		}
		const deltaBytes = Math.max(0, size - state.lastSize);
		if (deltaBytes === 0 && size === state.lastSize) return {
			deltaBytes: thresholds.deltaBytes,
			deltaMessages: thresholds.deltaMessages,
			pendingBytes: state.pendingBytes,
			pendingMessages: state.pendingMessages
		};
		if (size < state.lastSize) {
			state.lastSize = size;
			state.pendingBytes += size;
			if (thresholds.deltaMessages > 0 && (thresholds.deltaBytes <= 0 || state.pendingBytes < thresholds.deltaBytes)) state.pendingMessages += await this.countNewlines(sessionFile, 0, size);
		} else {
			state.pendingBytes += deltaBytes;
			if (thresholds.deltaMessages > 0 && (thresholds.deltaBytes <= 0 || state.pendingBytes < thresholds.deltaBytes)) state.pendingMessages += await this.countNewlines(sessionFile, state.lastSize, size);
			state.lastSize = size;
		}
		this.sessionDeltas.set(sessionFile, state);
		return {
			deltaBytes: thresholds.deltaBytes,
			deltaMessages: thresholds.deltaMessages,
			pendingBytes: state.pendingBytes,
			pendingMessages: state.pendingMessages
		};
	}
	async countNewlines(absPath, start, end) {
		if (end <= start) return 0;
		let handle;
		try {
			handle = await fs.open(absPath, "r");
		} catch (err) {
			if (isFileMissingError(err)) return 0;
			throw err;
		}
		try {
			let offset = start;
			let count = 0;
			const buffer = Buffer.alloc(SESSION_DELTA_READ_CHUNK_BYTES);
			while (offset < end) {
				const toRead = Math.min(buffer.length, end - offset);
				const { bytesRead } = await handle.read(buffer, 0, toRead, offset);
				if (bytesRead <= 0) break;
				for (let i = 0; i < bytesRead; i += 1) if (buffer[i] === 10) count += 1;
				offset += bytesRead;
			}
			return count;
		} finally {
			await handle.close();
		}
	}
	resetSessionDelta(absPath, size) {
		const state = this.sessionDeltas.get(absPath);
		if (!state) return;
		state.lastSize = size;
		state.pendingBytes = 0;
		state.pendingMessages = 0;
	}
	isSessionFileForAgent(sessionFile) {
		if (!sessionFile) return false;
		const sessionsDir = resolveSessionTranscriptsDirForAgent(this.agentId);
		const resolvedFile = path.resolve(sessionFile);
		const resolvedDir = path.resolve(sessionsDir);
		return resolvedFile.startsWith(`${resolvedDir}${path.sep}`);
	}
	normalizeTargetSessionFiles(sessionFiles) {
		if (!sessionFiles || sessionFiles.length === 0) return null;
		const normalized = /* @__PURE__ */ new Set();
		for (const sessionFile of sessionFiles) {
			const trimmed = sessionFile.trim();
			if (!trimmed) continue;
			const resolved = path.resolve(trimmed);
			if (this.isSessionFileForAgent(resolved)) normalized.add(resolved);
		}
		return normalized.size > 0 ? normalized : null;
	}
	clearSyncedSessionFiles(targetSessionFiles) {
		if (!targetSessionFiles) this.sessionsDirtyFiles.clear();
		else for (const targetSessionFile of targetSessionFiles) this.sessionsDirtyFiles.delete(targetSessionFile);
		this.sessionsDirty = this.sessionsDirtyFiles.size > 0;
	}
	ensureIntervalSync() {
		const minutes = this.settings.sync.intervalMinutes;
		if (!minutes || minutes <= 0 || this.intervalTimer) return;
		const ms = minutes * 60 * 1e3;
		this.intervalTimer = setInterval(() => {
			runDetachedMemorySync(() => this.sync({ reason: "interval" }), "interval");
		}, ms);
	}
	scheduleWatchSync() {
		if (!this.sources.has("memory") || !this.settings.sync.watch) return;
		if (this.watchTimer) clearTimeout(this.watchTimer);
		this.watchTimer = setTimeout(() => {
			this.watchTimer = null;
			runDetachedMemorySync(() => this.sync({ reason: "watch" }), "watch");
		}, this.settings.sync.watchDebounceMs);
	}
	shouldSyncSessions(params, needsFullReindex = false) {
		if (!this.sources.has("sessions")) return false;
		if (params?.sessionFiles?.some((sessionFile) => sessionFile.trim().length > 0)) return true;
		if (params?.force) return true;
		const reason = params?.reason;
		if (reason === "session-start" || reason === "watch") return false;
		if (needsFullReindex) return true;
		return this.sessionsDirty && this.sessionsDirtyFiles.size > 0;
	}
	async syncMemoryFiles(params) {
		if (!this.provider) {
			log$2.debug("Skipping memory file sync in FTS-only mode (no embedding provider)");
			return;
		}
		const selectSourceFileState = this.db.prepare(`SELECT path, hash FROM files WHERE source = ?`);
		const deleteFileByPathAndSource = this.db.prepare(`DELETE FROM files WHERE path = ? AND source = ?`);
		const deleteChunksByPathAndSource = this.db.prepare(`DELETE FROM chunks WHERE path = ? AND source = ?`);
		const deleteVectorRowsByPathAndSource = this.vector.enabled && this.vector.available ? this.db.prepare(`DELETE FROM ${VECTOR_TABLE$2} WHERE id IN (SELECT id FROM chunks WHERE path = ? AND source = ?)`) : null;
		const deleteFtsRowsByPathSourceAndModel = this.fts.enabled && this.fts.available ? this.db.prepare(`DELETE FROM ${FTS_TABLE$2} WHERE path = ? AND source = ? AND model = ?`) : null;
		const fileEntries = (await runWithConcurrency((await listMemoryFiles(this.workspaceDir, this.settings.extraPaths, this.settings.multimodal)).map((file) => async () => await buildFileEntry(file, this.workspaceDir, this.settings.multimodal)), this.getIndexConcurrency())).filter((entry) => entry !== null);
		log$2.debug("memory sync: indexing memory files", {
			files: fileEntries.length,
			needsFullReindex: params.needsFullReindex,
			batch: this.batch.enabled,
			concurrency: this.getIndexConcurrency()
		});
		const existingRows = selectSourceFileState.all("memory");
		const existingHashes = new Map(existingRows.map((row) => [row.path, row.hash]));
		const activePaths = new Set(fileEntries.map((entry) => entry.path));
		if (params.progress) {
			params.progress.total += fileEntries.length;
			params.progress.report({
				completed: params.progress.completed,
				total: params.progress.total,
				label: this.batch.enabled ? "Indexing memory files (batch)..." : "Indexing memory files…"
			});
		}
		await runWithConcurrency(fileEntries.map((entry) => async () => {
			if (!params.needsFullReindex && existingHashes.get(entry.path) === entry.hash) {
				if (params.progress) {
					params.progress.completed += 1;
					params.progress.report({
						completed: params.progress.completed,
						total: params.progress.total
					});
				}
				return;
			}
			await this.indexFile(entry, { source: "memory" });
			if (params.progress) {
				params.progress.completed += 1;
				params.progress.report({
					completed: params.progress.completed,
					total: params.progress.total
				});
			}
		}), this.getIndexConcurrency());
		for (const stale of existingRows) {
			if (activePaths.has(stale.path)) continue;
			deleteFileByPathAndSource.run(stale.path, "memory");
			if (deleteVectorRowsByPathAndSource) try {
				deleteVectorRowsByPathAndSource.run(stale.path, "memory");
			} catch {}
			deleteChunksByPathAndSource.run(stale.path, "memory");
			if (deleteFtsRowsByPathSourceAndModel) try {
				deleteFtsRowsByPathSourceAndModel.run(stale.path, "memory", this.provider.model);
			} catch {}
		}
	}
	async syncSessionFiles(params) {
		if (!this.provider) {
			log$2.debug("Skipping session file sync in FTS-only mode (no embedding provider)");
			return;
		}
		const selectFileHash = this.db.prepare(`SELECT hash FROM files WHERE path = ? AND source = ?`);
		const selectSourceFileState = this.db.prepare(`SELECT path, hash FROM files WHERE source = ?`);
		const deleteFileByPathAndSource = this.db.prepare(`DELETE FROM files WHERE path = ? AND source = ?`);
		const deleteChunksByPathAndSource = this.db.prepare(`DELETE FROM chunks WHERE path = ? AND source = ?`);
		const deleteVectorRowsByPathAndSource = this.vector.enabled && this.vector.available ? this.db.prepare(`DELETE FROM ${VECTOR_TABLE$2} WHERE id IN (SELECT id FROM chunks WHERE path = ? AND source = ?)`) : null;
		const deleteFtsRowsByPathSourceAndModel = this.fts.enabled && this.fts.available ? this.db.prepare(`DELETE FROM ${FTS_TABLE$2} WHERE path = ? AND source = ? AND model = ?`) : null;
		const targetSessionFiles = params.needsFullReindex ? null : this.normalizeTargetSessionFiles(params.targetSessionFiles);
		const files = targetSessionFiles ? Array.from(targetSessionFiles) : await listSessionFilesForAgent(this.agentId);
		const activePaths = targetSessionFiles ? null : new Set(files.map((file) => sessionPathForFile(file)));
		const existingRows = activePaths === null ? null : selectSourceFileState.all("sessions");
		const existingHashes = existingRows === null ? null : new Map(existingRows.map((row) => [row.path, row.hash]));
		const indexAll = params.needsFullReindex || Boolean(targetSessionFiles) || this.sessionsDirtyFiles.size === 0;
		log$2.debug("memory sync: indexing session files", {
			files: files.length,
			indexAll,
			dirtyFiles: this.sessionsDirtyFiles.size,
			targetedFiles: targetSessionFiles?.size ?? 0,
			batch: this.batch.enabled,
			concurrency: this.getIndexConcurrency()
		});
		if (params.progress) {
			params.progress.total += files.length;
			params.progress.report({
				completed: params.progress.completed,
				total: params.progress.total,
				label: this.batch.enabled ? "Indexing session files (batch)..." : "Indexing session files…"
			});
		}
		await runWithConcurrency(files.map((absPath) => async () => {
			if (!indexAll && !this.sessionsDirtyFiles.has(absPath)) {
				if (params.progress) {
					params.progress.completed += 1;
					params.progress.report({
						completed: params.progress.completed,
						total: params.progress.total
					});
				}
				return;
			}
			const entry = await buildSessionEntry(absPath);
			if (!entry) {
				if (params.progress) {
					params.progress.completed += 1;
					params.progress.report({
						completed: params.progress.completed,
						total: params.progress.total
					});
				}
				return;
			}
			const existingHash = existingHashes?.get(entry.path) ?? selectFileHash.get(entry.path, "sessions")?.hash;
			if (!params.needsFullReindex && existingHash === entry.hash) {
				if (params.progress) {
					params.progress.completed += 1;
					params.progress.report({
						completed: params.progress.completed,
						total: params.progress.total
					});
				}
				this.resetSessionDelta(absPath, entry.size);
				return;
			}
			await this.indexFile(entry, {
				source: "sessions",
				content: entry.content
			});
			this.resetSessionDelta(absPath, entry.size);
			if (params.progress) {
				params.progress.completed += 1;
				params.progress.report({
					completed: params.progress.completed,
					total: params.progress.total
				});
			}
		}), this.getIndexConcurrency());
		if (activePaths === null) return;
		for (const stale of existingRows ?? []) {
			if (activePaths.has(stale.path)) continue;
			deleteFileByPathAndSource.run(stale.path, "sessions");
			if (deleteVectorRowsByPathAndSource) try {
				deleteVectorRowsByPathAndSource.run(stale.path, "sessions");
			} catch {}
			deleteChunksByPathAndSource.run(stale.path, "sessions");
			if (deleteFtsRowsByPathSourceAndModel) try {
				deleteFtsRowsByPathSourceAndModel.run(stale.path, "sessions", this.provider.model);
			} catch {}
		}
	}
	createSyncProgress(onProgress) {
		const state = {
			completed: 0,
			total: 0,
			label: void 0,
			report: (update) => {
				if (update.label) state.label = update.label;
				const label = update.total > 0 && state.label ? `${state.label} ${update.completed}/${update.total}` : state.label;
				onProgress({
					completed: update.completed,
					total: update.total,
					label
				});
			}
		};
		return state;
	}
	async runSync(params) {
		const progress = params?.progress ? this.createSyncProgress(params.progress) : void 0;
		if (progress) progress.report({
			completed: progress.completed,
			total: progress.total,
			label: "Loading vector extension…"
		});
		const vectorReady = await this.ensureVectorReady();
		const meta = this.readMeta();
		const configuredSources = this.resolveConfiguredSourcesForMeta();
		const configuredScopeHash = this.resolveConfiguredScopeHash();
		const targetSessionFiles = this.normalizeTargetSessionFiles(params?.sessionFiles);
		const hasTargetSessionFiles = targetSessionFiles !== null;
		if (hasTargetSessionFiles && targetSessionFiles && this.sources.has("sessions")) {
			try {
				await this.syncSessionFiles({
					needsFullReindex: false,
					targetSessionFiles: Array.from(targetSessionFiles),
					progress: progress ?? void 0
				});
				this.clearSyncedSessionFiles(targetSessionFiles);
			} catch (err) {
				const reason = err instanceof Error ? err.message : String(err);
				if (this.shouldFallbackOnError(reason) && await this.activateFallbackProvider(reason)) {
					if (process.env.OPENCLAW_TEST_FAST === "1" && process.env.OPENCLAW_TEST_MEMORY_UNSAFE_REINDEX === "1") await this.runUnsafeReindex({
						reason: params?.reason,
						force: true,
						progress: progress ?? void 0
					});
					else await this.runSafeReindex({
						reason: params?.reason,
						force: true,
						progress: progress ?? void 0
					});
					return;
				}
				throw err;
			}
			return;
		}
		const needsFullReindex = params?.force && !hasTargetSessionFiles || !meta || this.provider && meta.model !== this.provider.model || this.provider && meta.provider !== this.provider.id || meta.providerKey !== this.providerKey || this.metaSourcesDiffer(meta, configuredSources) || meta.scopeHash !== configuredScopeHash || meta.chunkTokens !== this.settings.chunking.tokens || meta.chunkOverlap !== this.settings.chunking.overlap || vectorReady && !meta?.vectorDims;
		try {
			if (needsFullReindex) {
				if (process.env.OPENCLAW_TEST_FAST === "1" && process.env.OPENCLAW_TEST_MEMORY_UNSAFE_REINDEX === "1") await this.runUnsafeReindex({
					reason: params?.reason,
					force: params?.force,
					progress: progress ?? void 0
				});
				else await this.runSafeReindex({
					reason: params?.reason,
					force: params?.force,
					progress: progress ?? void 0
				});
				return;
			}
			const shouldSyncMemory = this.sources.has("memory") && (!hasTargetSessionFiles && params?.force || needsFullReindex || this.dirty);
			const shouldSyncSessions = this.shouldSyncSessions(params, needsFullReindex);
			if (shouldSyncMemory) {
				await this.syncMemoryFiles({
					needsFullReindex,
					progress: progress ?? void 0
				});
				this.dirty = false;
			}
			if (shouldSyncSessions) {
				await this.syncSessionFiles({
					needsFullReindex,
					targetSessionFiles: targetSessionFiles ? Array.from(targetSessionFiles) : void 0,
					progress: progress ?? void 0
				});
				this.sessionsDirty = false;
				this.sessionsDirtyFiles.clear();
			} else if (this.sessionsDirtyFiles.size > 0) this.sessionsDirty = true;
			else this.sessionsDirty = false;
		} catch (err) {
			const reason = err instanceof Error ? err.message : String(err);
			if (this.shouldFallbackOnError(reason) && await this.activateFallbackProvider(reason)) {
				await this.runSafeReindex({
					reason: params?.reason ?? "fallback",
					force: true,
					progress: progress ?? void 0
				});
				return;
			}
			throw err;
		}
	}
	shouldFallbackOnError(message) {
		return /embedding|embeddings|batch/i.test(message);
	}
	resolveBatchConfig() {
		const batch = this.settings.remote?.batch;
		return {
			enabled: Boolean(batch?.enabled && this.provider && this.providerRuntime?.batchEmbed),
			wait: batch?.wait ?? true,
			concurrency: Math.max(1, batch?.concurrency ?? 2),
			pollIntervalMs: batch?.pollIntervalMs ?? 2e3,
			timeoutMs: (batch?.timeoutMinutes ?? 60) * 60 * 1e3
		};
	}
	async activateFallbackProvider(reason) {
		const fallback = this.settings.fallback;
		if (!fallback || fallback === "none" || !this.provider || fallback === this.provider.id) return false;
		if (this.fallbackFrom) return false;
		const fallbackFrom = this.provider.id;
		const fallbackModel = resolveEmbeddingProviderFallbackModel(fallback, this.settings.model);
		const fallbackResult = await createEmbeddingProvider({
			config: this.cfg,
			agentDir: resolveAgentDir(this.cfg, this.agentId),
			provider: fallback,
			remote: this.settings.remote,
			model: fallbackModel,
			outputDimensionality: this.settings.outputDimensionality,
			fallback: "none",
			local: this.settings.local
		});
		this.fallbackFrom = fallbackFrom;
		this.fallbackReason = reason;
		this.provider = fallbackResult.provider;
		this.providerRuntime = fallbackResult.runtime;
		this.providerKey = this.computeProviderKey();
		this.batch = this.resolveBatchConfig();
		log$2.warn(`memory embeddings: switched to fallback provider (${fallback})`, { reason });
		return true;
	}
	async runSafeReindex(params) {
		const dbPath = resolveUserPath(this.settings.store.path);
		const tempDbPath = `${dbPath}.tmp-${randomUUID()}`;
		const tempDb = this.openDatabaseAtPath(tempDbPath);
		const originalDb = this.db;
		let originalDbClosed = false;
		const originalState = {
			ftsAvailable: this.fts.available,
			ftsError: this.fts.loadError,
			vectorAvailable: this.vector.available,
			vectorLoadError: this.vector.loadError,
			vectorDims: this.vector.dims,
			vectorReady: this.vectorReady
		};
		const restoreOriginalState = () => {
			if (originalDbClosed) this.db = this.openDatabaseAtPath(dbPath);
			else this.db = originalDb;
			this.fts.available = originalState.ftsAvailable;
			this.fts.loadError = originalState.ftsError;
			this.vector.available = originalDbClosed ? null : originalState.vectorAvailable;
			this.vector.loadError = originalState.vectorLoadError;
			this.vector.dims = originalState.vectorDims;
			this.vectorReady = originalDbClosed ? null : originalState.vectorReady;
		};
		this.db = tempDb;
		this.vectorReady = null;
		this.vector.available = null;
		this.vector.loadError = void 0;
		this.vector.dims = void 0;
		this.fts.available = false;
		this.fts.loadError = void 0;
		this.ensureSchema();
		let nextMeta = null;
		try {
			this.seedEmbeddingCache(originalDb);
			const shouldSyncMemory = this.sources.has("memory");
			const shouldSyncSessions = this.shouldSyncSessions({
				reason: params.reason,
				force: params.force
			}, true);
			if (shouldSyncMemory) {
				await this.syncMemoryFiles({
					needsFullReindex: true,
					progress: params.progress
				});
				this.dirty = false;
			}
			if (shouldSyncSessions) {
				await this.syncSessionFiles({
					needsFullReindex: true,
					progress: params.progress
				});
				this.sessionsDirty = false;
				this.sessionsDirtyFiles.clear();
			} else if (this.sessionsDirtyFiles.size > 0) this.sessionsDirty = true;
			else this.sessionsDirty = false;
			nextMeta = {
				model: this.provider?.model ?? "fts-only",
				provider: this.provider?.id ?? "none",
				providerKey: this.providerKey,
				sources: this.resolveConfiguredSourcesForMeta(),
				scopeHash: this.resolveConfiguredScopeHash(),
				chunkTokens: this.settings.chunking.tokens,
				chunkOverlap: this.settings.chunking.overlap
			};
			if (!nextMeta) throw new Error("Failed to compute memory index metadata for reindexing.");
			if (this.vector.available && this.vector.dims) nextMeta.vectorDims = this.vector.dims;
			this.writeMeta(nextMeta);
			this.pruneEmbeddingCacheIfNeeded?.();
			this.db.close();
			originalDb.close();
			originalDbClosed = true;
			await this.swapIndexFiles(dbPath, tempDbPath);
			this.db = this.openDatabaseAtPath(dbPath);
			this.vectorReady = null;
			this.vector.available = null;
			this.vector.loadError = void 0;
			this.ensureSchema();
			this.vector.dims = nextMeta?.vectorDims;
		} catch (err) {
			try {
				this.db.close();
			} catch {}
			await this.removeIndexFiles(tempDbPath);
			restoreOriginalState();
			throw err;
		}
	}
	async runUnsafeReindex(params) {
		this.resetIndex();
		const shouldSyncMemory = this.sources.has("memory");
		const shouldSyncSessions = this.shouldSyncSessions({
			reason: params.reason,
			force: params.force
		}, true);
		if (shouldSyncMemory) {
			await this.syncMemoryFiles({
				needsFullReindex: true,
				progress: params.progress
			});
			this.dirty = false;
		}
		if (shouldSyncSessions) {
			await this.syncSessionFiles({
				needsFullReindex: true,
				progress: params.progress
			});
			this.sessionsDirty = false;
			this.sessionsDirtyFiles.clear();
		} else if (this.sessionsDirtyFiles.size > 0) this.sessionsDirty = true;
		else this.sessionsDirty = false;
		const nextMeta = {
			model: this.provider?.model ?? "fts-only",
			provider: this.provider?.id ?? "none",
			providerKey: this.providerKey,
			sources: this.resolveConfiguredSourcesForMeta(),
			scopeHash: this.resolveConfiguredScopeHash(),
			chunkTokens: this.settings.chunking.tokens,
			chunkOverlap: this.settings.chunking.overlap
		};
		if (this.vector.available && this.vector.dims) nextMeta.vectorDims = this.vector.dims;
		this.writeMeta(nextMeta);
		this.pruneEmbeddingCacheIfNeeded?.();
	}
	resetIndex() {
		this.db.exec(`DELETE FROM files`);
		this.db.exec(`DELETE FROM chunks`);
		if (this.fts.enabled && this.fts.available) try {
			this.db.exec(`DELETE FROM ${FTS_TABLE$2}`);
		} catch {}
		this.dropVectorTable();
		this.vector.dims = void 0;
		this.sessionsDirtyFiles.clear();
	}
	readMeta() {
		const row = this.db.prepare(`SELECT value FROM meta WHERE key = ?`).get(META_KEY);
		if (!row?.value) {
			this.lastMetaSerialized = null;
			return null;
		}
		try {
			const parsed = JSON.parse(row.value);
			this.lastMetaSerialized = row.value;
			return parsed;
		} catch {
			this.lastMetaSerialized = null;
			return null;
		}
	}
	writeMeta(meta) {
		const value = JSON.stringify(meta);
		if (this.lastMetaSerialized === value) return;
		this.db.prepare(`INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(META_KEY, value);
		this.lastMetaSerialized = value;
	}
	resolveConfiguredSourcesForMeta() {
		const normalized = Array.from(this.sources).filter((source) => source === "memory" || source === "sessions").toSorted();
		return normalized.length > 0 ? normalized : ["memory"];
	}
	normalizeMetaSources(meta) {
		if (!Array.isArray(meta.sources)) return ["memory"];
		const normalized = Array.from(new Set(meta.sources.filter((source) => source === "memory" || source === "sessions"))).toSorted();
		return normalized.length > 0 ? normalized : ["memory"];
	}
	resolveConfiguredScopeHash() {
		const extraPaths = normalizeExtraMemoryPaths(this.workspaceDir, this.settings.extraPaths).map((value) => value.replace(/\\/g, "/")).toSorted();
		return hashText(JSON.stringify({
			extraPaths,
			multimodal: {
				enabled: this.settings.multimodal.enabled,
				modalities: [...this.settings.multimodal.modalities].toSorted(),
				maxFileBytes: this.settings.multimodal.maxFileBytes
			}
		}));
	}
	metaSourcesDiffer(meta, configuredSources) {
		const metaSources = this.normalizeMetaSources(meta);
		if (metaSources.length !== configuredSources.length) return true;
		return metaSources.some((source, index) => source !== configuredSources[index]);
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-ops.ts
const VECTOR_TABLE$1 = "chunks_vec";
const FTS_TABLE$1 = "chunks_fts";
const EMBEDDING_CACHE_TABLE$1 = "embedding_cache";
const EMBEDDING_BATCH_MAX_TOKENS = 8e3;
const EMBEDDING_INDEX_CONCURRENCY = 4;
const EMBEDDING_RETRY_MAX_ATTEMPTS = 3;
const EMBEDDING_RETRY_BASE_DELAY_MS = 500;
const EMBEDDING_RETRY_MAX_DELAY_MS = 8e3;
const BATCH_FAILURE_LIMIT$1 = 2;
const EMBEDDING_QUERY_TIMEOUT_REMOTE_MS = 6e4;
const EMBEDDING_QUERY_TIMEOUT_LOCAL_MS = 5 * 6e4;
const EMBEDDING_BATCH_TIMEOUT_REMOTE_MS = 2 * 6e4;
const EMBEDDING_BATCH_TIMEOUT_LOCAL_MS = 10 * 6e4;
const vectorToBlob$1 = (embedding) => Buffer.from(new Float32Array(embedding).buffer);
const log$1 = createSubsystemLogger("memory");
var MemoryManagerEmbeddingOps = class extends MemoryManagerSyncOps {
	buildEmbeddingBatches(chunks) {
		const batches = [];
		let current = [];
		let currentTokens = 0;
		for (const chunk of chunks) {
			const estimate = chunk.embeddingInput ? estimateStructuredEmbeddingInputBytes(chunk.embeddingInput) : estimateUtf8Bytes(chunk.text);
			if (current.length > 0 && currentTokens + estimate > EMBEDDING_BATCH_MAX_TOKENS) {
				batches.push(current);
				current = [];
				currentTokens = 0;
			}
			if (current.length === 0 && estimate > EMBEDDING_BATCH_MAX_TOKENS) {
				batches.push([chunk]);
				continue;
			}
			current.push(chunk);
			currentTokens += estimate;
		}
		if (current.length > 0) batches.push(current);
		return batches;
	}
	loadEmbeddingCache(hashes) {
		if (!this.cache.enabled || !this.provider) return /* @__PURE__ */ new Map();
		if (hashes.length === 0) return /* @__PURE__ */ new Map();
		const unique = [];
		const seen = /* @__PURE__ */ new Set();
		for (const hash of hashes) {
			if (!hash) continue;
			if (seen.has(hash)) continue;
			seen.add(hash);
			unique.push(hash);
		}
		if (unique.length === 0) return /* @__PURE__ */ new Map();
		const out = /* @__PURE__ */ new Map();
		const baseParams = [
			this.provider.id,
			this.provider.model,
			this.providerKey
		];
		const batchSize = 400;
		for (let start = 0; start < unique.length; start += batchSize) {
			const batch = unique.slice(start, start + batchSize);
			const placeholders = batch.map(() => "?").join(", ");
			const rows = this.db.prepare(`SELECT hash, embedding FROM ${EMBEDDING_CACHE_TABLE$1}\n WHERE provider = ? AND model = ? AND provider_key = ? AND hash IN (${placeholders})`).all(...baseParams, ...batch);
			for (const row of rows) out.set(row.hash, parseEmbedding(row.embedding));
		}
		return out;
	}
	upsertEmbeddingCache(entries) {
		if (!this.cache.enabled || !this.provider) return;
		if (entries.length === 0) return;
		const now = Date.now();
		const stmt = this.db.prepare(`INSERT INTO ${EMBEDDING_CACHE_TABLE$1} (provider, model, provider_key, hash, embedding, dims, updated_at)\n VALUES (?, ?, ?, ?, ?, ?, ?)\n ON CONFLICT(provider, model, provider_key, hash) DO UPDATE SET\n   embedding=excluded.embedding,\n   dims=excluded.dims,\n   updated_at=excluded.updated_at`);
		for (const entry of entries) {
			const embedding = entry.embedding ?? [];
			stmt.run(this.provider.id, this.provider.model, this.providerKey, entry.hash, JSON.stringify(embedding), embedding.length, now);
		}
	}
	pruneEmbeddingCacheIfNeeded() {
		if (!this.cache.enabled) return;
		const max = this.cache.maxEntries;
		if (!max || max <= 0) return;
		const count = this.db.prepare(`SELECT COUNT(*) as c FROM ${EMBEDDING_CACHE_TABLE$1}`).get()?.c ?? 0;
		if (count <= max) return;
		const excess = count - max;
		this.db.prepare(`DELETE FROM ${EMBEDDING_CACHE_TABLE$1}\n WHERE rowid IN (\n   SELECT rowid FROM ${EMBEDDING_CACHE_TABLE$1}\n   ORDER BY updated_at ASC\n   LIMIT ?\n )`).run(excess);
	}
	async embedChunksInBatches(chunks) {
		if (chunks.length === 0) return [];
		const { embeddings, missing } = this.collectCachedEmbeddings(chunks);
		if (missing.length === 0) return embeddings;
		const missingChunks = missing.map((m) => m.chunk);
		const batches = this.buildEmbeddingBatches(missingChunks);
		const toCache = [];
		const provider = this.provider;
		if (!provider) throw new Error("Cannot embed batch in FTS-only mode (no embedding provider)");
		let cursor = 0;
		for (const batch of batches) {
			const inputs = batch.map((chunk) => chunk.embeddingInput ?? { text: chunk.text });
			const hasStructuredInputs = inputs.some((input) => hasNonTextEmbeddingParts(input));
			if (hasStructuredInputs && !provider.embedBatchInputs) throw new Error(`Embedding provider "${provider.id}" does not support multimodal memory inputs.`);
			const batchEmbeddings = hasStructuredInputs ? await this.embedBatchInputsWithRetry(inputs) : await this.embedBatchWithRetry(batch.map((chunk) => chunk.text));
			for (let i = 0; i < batch.length; i += 1) {
				const item = missing[cursor + i];
				const embedding = batchEmbeddings[i] ?? [];
				if (item) {
					embeddings[item.index] = embedding;
					toCache.push({
						hash: item.chunk.hash,
						embedding
					});
				}
			}
			cursor += batch.length;
		}
		this.upsertEmbeddingCache(toCache);
		return embeddings;
	}
	computeProviderKey() {
		if (!this.provider) return hashText(JSON.stringify({
			provider: "none",
			model: "fts-only"
		}));
		if (this.providerRuntime?.cacheKeyData) return hashText(JSON.stringify(this.providerRuntime.cacheKeyData));
		return hashText(JSON.stringify({
			provider: this.provider.id,
			model: this.provider.model
		}));
	}
	buildBatchDebug(source, chunks) {
		return (message, data) => log$1.debug(message, data ? {
			...data,
			source,
			chunks: chunks.length
		} : {
			source,
			chunks: chunks.length
		});
	}
	async embedChunksWithBatch(chunks, _entry, source) {
		const batchEmbed = this.providerRuntime?.batchEmbed;
		if (!this.provider || !batchEmbed) return this.embedChunksInBatches(chunks);
		if (chunks.length === 0) return [];
		const { embeddings, missing } = this.collectCachedEmbeddings(chunks);
		if (missing.length === 0) return embeddings;
		const missingChunks = missing.map((item) => item.chunk);
		const batchResult = await this.runBatchWithFallback({
			provider: this.provider.id,
			run: async () => await batchEmbed({
				agentId: this.agentId,
				chunks: missingChunks,
				wait: this.batch.wait,
				concurrency: this.batch.concurrency,
				pollIntervalMs: this.batch.pollIntervalMs,
				timeoutMs: this.batch.timeoutMs,
				debug: this.buildBatchDebug(source, chunks)
			}),
			fallback: async () => await this.embedChunksInBatches(chunks)
		});
		if (!batchResult) return this.embedChunksInBatches(chunks);
		const toCache = [];
		for (let index = 0; index < missing.length; index += 1) {
			const item = missing[index];
			const embedding = batchResult[index] ?? [];
			if (!item) continue;
			embeddings[item.index] = embedding;
			toCache.push({
				hash: item.chunk.hash,
				embedding
			});
		}
		this.upsertEmbeddingCache(toCache);
		return embeddings;
	}
	collectCachedEmbeddings(chunks) {
		const cached = this.loadEmbeddingCache(chunks.map((chunk) => chunk.hash));
		const embeddings = Array.from({ length: chunks.length }, () => []);
		const missing = [];
		for (let i = 0; i < chunks.length; i += 1) {
			const chunk = chunks[i];
			const hit = chunk?.hash ? cached.get(chunk.hash) : void 0;
			if (hit && hit.length > 0) embeddings[i] = hit;
			else if (chunk) missing.push({
				index: i,
				chunk
			});
		}
		return {
			embeddings,
			missing
		};
	}
	async embedBatchWithRetry(texts) {
		if (texts.length === 0) return [];
		if (!this.provider) throw new Error("Cannot embed batch in FTS-only mode (no embedding provider)");
		let attempt = 0;
		let delayMs = EMBEDDING_RETRY_BASE_DELAY_MS;
		while (true) try {
			const timeoutMs = this.resolveEmbeddingTimeout("batch");
			log$1.debug("memory embeddings: batch start", {
				provider: this.provider.id,
				items: texts.length,
				timeoutMs
			});
			return await this.withTimeout(this.provider.embedBatch(texts), timeoutMs, `memory embeddings batch timed out after ${Math.round(timeoutMs / 1e3)}s`);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			if (!this.isRetryableEmbeddingError(message) || attempt >= EMBEDDING_RETRY_MAX_ATTEMPTS) throw err;
			await this.waitForEmbeddingRetry(delayMs, "retrying");
			delayMs *= 2;
			attempt += 1;
		}
	}
	async embedBatchInputsWithRetry(inputs) {
		if (inputs.length === 0) return [];
		if (!this.provider?.embedBatchInputs) return await this.embedBatchWithRetry(inputs.map((input) => input.text));
		let attempt = 0;
		let delayMs = EMBEDDING_RETRY_BASE_DELAY_MS;
		while (true) try {
			const timeoutMs = this.resolveEmbeddingTimeout("batch");
			log$1.debug("memory embeddings: structured batch start", {
				provider: this.provider.id,
				items: inputs.length,
				timeoutMs
			});
			return await this.withTimeout(this.provider.embedBatchInputs(inputs), timeoutMs, `memory embeddings batch timed out after ${Math.round(timeoutMs / 1e3)}s`);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			if (!this.isRetryableEmbeddingError(message) || attempt >= EMBEDDING_RETRY_MAX_ATTEMPTS) throw err;
			await this.waitForEmbeddingRetry(delayMs, "retrying structured batch");
			delayMs *= 2;
			attempt += 1;
		}
	}
	async waitForEmbeddingRetry(delayMs, action) {
		const waitMs = Math.min(EMBEDDING_RETRY_MAX_DELAY_MS, Math.round(delayMs * (1 + Math.random() * .2)));
		log$1.warn(`memory embeddings rate limited; ${action} in ${waitMs}ms`);
		await new Promise((resolve) => setTimeout(resolve, waitMs));
	}
	isRetryableEmbeddingError(message) {
		return /(rate[_ ]limit|too many requests|429|resource has been exhausted|5\d\d|cloudflare|tokens per day)/i.test(message);
	}
	resolveEmbeddingTimeout(kind) {
		const isLocal = this.provider?.id === "local";
		if (kind === "query") return isLocal ? EMBEDDING_QUERY_TIMEOUT_LOCAL_MS : EMBEDDING_QUERY_TIMEOUT_REMOTE_MS;
		return isLocal ? EMBEDDING_BATCH_TIMEOUT_LOCAL_MS : EMBEDDING_BATCH_TIMEOUT_REMOTE_MS;
	}
	async embedQueryWithTimeout(text) {
		if (!this.provider) throw new Error("Cannot embed query in FTS-only mode (no embedding provider)");
		const timeoutMs = this.resolveEmbeddingTimeout("query");
		log$1.debug("memory embeddings: query start", {
			provider: this.provider.id,
			timeoutMs
		});
		return await this.withTimeout(this.provider.embedQuery(text), timeoutMs, `memory embeddings query timed out after ${Math.round(timeoutMs / 1e3)}s`);
	}
	async withTimeout(promise, timeoutMs, message) {
		if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return await promise;
		let timer = null;
		const timeoutPromise = new Promise((_, reject) => {
			timer = setTimeout(() => reject(new Error(message)), timeoutMs);
		});
		try {
			return await Promise.race([promise, timeoutPromise]);
		} finally {
			if (timer) clearTimeout(timer);
		}
	}
	async withBatchFailureLock(fn) {
		let release;
		const wait = this.batchFailureLock;
		this.batchFailureLock = new Promise((resolve) => {
			release = resolve;
		});
		await wait;
		try {
			return await fn();
		} finally {
			release();
		}
	}
	async resetBatchFailureCount() {
		await this.withBatchFailureLock(async () => {
			if (this.batchFailureCount > 0) log$1.debug("memory embeddings: batch recovered; resetting failure count");
			this.batchFailureCount = 0;
			this.batchFailureLastError = void 0;
			this.batchFailureLastProvider = void 0;
		});
	}
	async recordBatchFailure(params) {
		return await this.withBatchFailureLock(async () => {
			if (!this.batch.enabled) return {
				disabled: true,
				count: this.batchFailureCount
			};
			const increment = params.forceDisable ? BATCH_FAILURE_LIMIT$1 : Math.max(1, params.attempts ?? 1);
			this.batchFailureCount += increment;
			this.batchFailureLastError = params.message;
			this.batchFailureLastProvider = params.provider;
			const disabled = params.forceDisable || this.batchFailureCount >= BATCH_FAILURE_LIMIT$1;
			if (disabled) this.batch.enabled = false;
			return {
				disabled,
				count: this.batchFailureCount
			};
		});
	}
	isBatchTimeoutError(message) {
		return /timed out|timeout/i.test(message);
	}
	async runBatchWithTimeoutRetry(params) {
		try {
			return await params.run();
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			if (this.isBatchTimeoutError(message)) {
				log$1.warn(`memory embeddings: ${params.provider} batch timed out; retrying once`);
				try {
					return await params.run();
				} catch (retryErr) {
					retryErr.batchAttempts = 2;
					throw retryErr;
				}
			}
			throw err;
		}
	}
	async runBatchWithFallback(params) {
		if (!this.batch.enabled) return await params.fallback();
		try {
			const result = await this.runBatchWithTimeoutRetry({
				provider: params.provider,
				run: params.run
			});
			await this.resetBatchFailureCount();
			return result;
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			const attempts = err.batchAttempts ?? 1;
			const forceDisable = /asyncBatchEmbedContent not available/i.test(message);
			const failure = await this.recordBatchFailure({
				provider: params.provider,
				message,
				attempts,
				forceDisable
			});
			const suffix = failure.disabled ? "disabling batch" : "keeping batch enabled";
			log$1.warn(`memory embeddings: ${params.provider} batch failed (${failure.count}/${BATCH_FAILURE_LIMIT$1}); ${suffix}; falling back to non-batch embeddings: ${message}`);
			return await params.fallback();
		}
	}
	getIndexConcurrency() {
		return this.batch.enabled ? this.batch.concurrency : EMBEDDING_INDEX_CONCURRENCY;
	}
	clearIndexedFileData(pathname, source) {
		if (this.vector.enabled) try {
			this.db.prepare(`DELETE FROM ${VECTOR_TABLE$1} WHERE id IN (SELECT id FROM chunks WHERE path = ? AND source = ?)`).run(pathname, source);
		} catch {}
		if (this.fts.enabled && this.fts.available && this.provider) try {
			this.db.prepare(`DELETE FROM ${FTS_TABLE$1} WHERE path = ? AND source = ? AND model = ?`).run(pathname, source, this.provider.model);
		} catch {}
		this.db.prepare(`DELETE FROM chunks WHERE path = ? AND source = ?`).run(pathname, source);
	}
	upsertFileRecord(entry, source) {
		this.db.prepare(`INSERT INTO files (path, source, hash, mtime, size) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(path) DO UPDATE SET
           source=excluded.source,
           hash=excluded.hash,
           mtime=excluded.mtime,
           size=excluded.size`).run(entry.path, source, entry.hash, entry.mtimeMs, entry.size);
	}
	deleteFileRecord(pathname, source) {
		this.db.prepare(`DELETE FROM files WHERE path = ? AND source = ?`).run(pathname, source);
	}
	isStructuredInputTooLargeError(message) {
		return /(413|payload too large|request too large|input too large|too many tokens|input limit|request size)/i.test(message);
	}
	async indexFile(entry, options) {
		if (!this.provider) {
			log$1.debug("Skipping embedding indexing in FTS-only mode", {
				path: entry.path,
				source: options.source
			});
			return;
		}
		let chunks;
		let structuredInputBytes;
		if ("kind" in entry && entry.kind === "multimodal") {
			const multimodalChunk = await buildMultimodalChunkForIndexing(entry);
			if (!multimodalChunk) {
				this.clearIndexedFileData(entry.path, options.source);
				this.deleteFileRecord(entry.path, options.source);
				return;
			}
			structuredInputBytes = multimodalChunk.structuredInputBytes;
			chunks = [multimodalChunk.chunk];
		} else {
			const content = options.content ?? await fs.readFile(entry.absPath, "utf-8");
			chunks = enforceEmbeddingMaxInputTokens(this.provider, chunkMarkdown(content, this.settings.chunking).filter((chunk) => chunk.text.trim().length > 0), EMBEDDING_BATCH_MAX_TOKENS);
			if (options.source === "sessions" && "lineMap" in entry) remapChunkLines(chunks, entry.lineMap);
		}
		let embeddings;
		try {
			embeddings = this.batch.enabled ? await this.embedChunksWithBatch(chunks, entry, options.source) : await this.embedChunksInBatches(chunks);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			if ("kind" in entry && entry.kind === "multimodal" && this.isStructuredInputTooLargeError(message)) {
				log$1.warn("memory embeddings: skipping multimodal file rejected as too large", {
					path: entry.path,
					bytes: structuredInputBytes,
					provider: this.provider.id,
					model: this.provider.model,
					error: message
				});
				this.clearIndexedFileData(entry.path, options.source);
				this.upsertFileRecord(entry, options.source);
				return;
			}
			throw err;
		}
		const sample = embeddings.find((embedding) => embedding.length > 0);
		const vectorReady = sample ? await this.ensureVectorReady(sample.length) : false;
		const now = Date.now();
		this.clearIndexedFileData(entry.path, options.source);
		for (let i = 0; i < chunks.length; i++) {
			const chunk = chunks[i];
			const embedding = embeddings[i] ?? [];
			const id = hashText(`${options.source}:${entry.path}:${chunk.startLine}:${chunk.endLine}:${chunk.hash}:${this.provider.model}`);
			this.db.prepare(`INSERT INTO chunks (id, path, source, start_line, end_line, hash, model, text, embedding, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             hash=excluded.hash,
             model=excluded.model,
             text=excluded.text,
             embedding=excluded.embedding,
             updated_at=excluded.updated_at`).run(id, entry.path, options.source, chunk.startLine, chunk.endLine, chunk.hash, this.provider.model, chunk.text, JSON.stringify(embedding), now);
			if (vectorReady && embedding.length > 0) {
				try {
					this.db.prepare(`DELETE FROM ${VECTOR_TABLE$1} WHERE id = ?`).run(id);
				} catch {}
				this.db.prepare(`INSERT INTO ${VECTOR_TABLE$1} (id, embedding) VALUES (?, ?)`).run(id, vectorToBlob$1(embedding));
			}
			if (this.fts.enabled && this.fts.available) this.db.prepare(`INSERT INTO ${FTS_TABLE$1} (text, id, path, source, model, start_line, end_line)\n VALUES (?, ?, ?, ?, ?, ?, ?)`).run(chunk.text, id, entry.path, options.source, this.provider.model, chunk.startLine, chunk.endLine);
		}
		this.upsertFileRecord(entry, options.source);
	}
};
//#endregion
//#region extensions/memory-core/src/memory/manager-search.ts
const vectorToBlob = (embedding) => Buffer.from(new Float32Array(embedding).buffer);
async function searchVector(params) {
	if (params.queryVec.length === 0 || params.limit <= 0) return [];
	if (await params.ensureVectorReady(params.queryVec.length)) return params.db.prepare(`SELECT c.id, c.path, c.start_line, c.end_line, c.text,
       c.source,
       vec_distance_cosine(v.embedding, ?) AS dist
  FROM ${params.vectorTable} v\n  JOIN chunks c ON c.id = v.id\n WHERE c.model = ?${params.sourceFilterVec.sql}\n ORDER BY dist ASC\n LIMIT ?`).all(vectorToBlob(params.queryVec), params.providerModel, ...params.sourceFilterVec.params, params.limit).map((row) => ({
		id: row.id,
		path: row.path,
		startLine: row.start_line,
		endLine: row.end_line,
		score: 1 - row.dist,
		snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
		source: row.source
	}));
	return listChunks({
		db: params.db,
		providerModel: params.providerModel,
		sourceFilter: params.sourceFilterChunks
	}).map((chunk) => ({
		chunk,
		score: cosineSimilarity(params.queryVec, chunk.embedding)
	})).filter((entry) => Number.isFinite(entry.score)).toSorted((a, b) => b.score - a.score).slice(0, params.limit).map((entry) => ({
		id: entry.chunk.id,
		path: entry.chunk.path,
		startLine: entry.chunk.startLine,
		endLine: entry.chunk.endLine,
		score: entry.score,
		snippet: truncateUtf16Safe(entry.chunk.text, params.snippetMaxChars),
		source: entry.chunk.source
	}));
}
function listChunks(params) {
	return params.db.prepare(`SELECT id, path, start_line, end_line, text, embedding, source
  FROM chunks
 WHERE model = ?${params.sourceFilter.sql}`).all(params.providerModel, ...params.sourceFilter.params).map((row) => ({
		id: row.id,
		path: row.path,
		startLine: row.start_line,
		endLine: row.end_line,
		text: row.text,
		embedding: parseEmbedding(row.embedding),
		source: row.source
	}));
}
async function searchKeyword(params) {
	if (params.limit <= 0) return [];
	const ftsQuery = params.buildFtsQuery(params.query);
	if (!ftsQuery) return [];
	const modelClause = params.providerModel ? " AND model = ?" : "";
	const modelParams = params.providerModel ? [params.providerModel] : [];
	return params.db.prepare(`SELECT id, path, source, start_line, end_line, text,\n       bm25(${params.ftsTable}) AS rank\n  FROM ${params.ftsTable}\n WHERE ${params.ftsTable} MATCH ?${modelClause}${params.sourceFilter.sql}\n ORDER BY rank ASC\n LIMIT ?`).all(ftsQuery, ...modelParams, ...params.sourceFilter.params, params.limit).map((row) => {
		const textScore = params.bm25RankToScore(row.rank);
		return {
			id: row.id,
			path: row.path,
			startLine: row.start_line,
			endLine: row.end_line,
			score: textScore,
			textScore,
			snippet: truncateUtf16Safe(row.text, params.snippetMaxChars),
			source: row.source
		};
	});
}
//#endregion
//#region extensions/memory-core/src/memory/manager.ts
const SNIPPET_MAX_CHARS = 700;
const VECTOR_TABLE = "chunks_vec";
const FTS_TABLE = "chunks_fts";
const EMBEDDING_CACHE_TABLE = "embedding_cache";
const BATCH_FAILURE_LIMIT = 2;
const MEMORY_INDEX_MANAGER_CACHE_KEY = Symbol.for("openclaw.memoryIndexManagerCache");
function getMemoryIndexManagerCacheStore() {
	return resolveGlobalSingleton(MEMORY_INDEX_MANAGER_CACHE_KEY, () => ({
		indexCache: /* @__PURE__ */ new Map(),
		indexCachePending: /* @__PURE__ */ new Map()
	}));
}
const log = createSubsystemLogger("memory");
const { indexCache: INDEX_CACHE, indexCachePending: INDEX_CACHE_PENDING } = getMemoryIndexManagerCacheStore();
async function closeAllMemoryIndexManagers() {
	const pending = Array.from(INDEX_CACHE_PENDING.values());
	if (pending.length > 0) await Promise.allSettled(pending);
	const managers = Array.from(INDEX_CACHE.values());
	INDEX_CACHE.clear();
	for (const manager of managers) try {
		await manager.close();
	} catch (err) {
		log.warn(`failed to close memory index manager: ${String(err)}`);
	}
}
var MemoryIndexManager = class MemoryIndexManager extends MemoryManagerEmbeddingOps {
	static async loadProviderResult(params) {
		return await createEmbeddingProvider({
			config: params.cfg,
			agentDir: resolveAgentDir(params.cfg, params.agentId),
			provider: params.settings.provider,
			remote: params.settings.remote,
			model: params.settings.model,
			outputDimensionality: params.settings.outputDimensionality,
			fallback: params.settings.fallback,
			local: params.settings.local
		});
	}
	static async get(params) {
		const { cfg, agentId } = params;
		const settings = resolveMemorySearchConfig(cfg, agentId);
		if (!settings) return null;
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		const purpose = params.purpose === "status" ? "status" : "default";
		const key = `${agentId}:${workspaceDir}:${JSON.stringify(settings)}:${purpose}`;
		if (params.purpose === "status") return new MemoryIndexManager({
			cacheKey: key,
			cfg,
			agentId,
			workspaceDir,
			settings,
			purpose: params.purpose
		});
		const existing = INDEX_CACHE.get(key);
		if (existing) return existing;
		const pending = INDEX_CACHE_PENDING.get(key);
		if (pending) return pending;
		const createPromise = (async () => {
			const refreshed = INDEX_CACHE.get(key);
			if (refreshed) return refreshed;
			const manager = new MemoryIndexManager({
				cacheKey: key,
				cfg,
				agentId,
				workspaceDir,
				settings,
				purpose: params.purpose
			});
			INDEX_CACHE.set(key, manager);
			return manager;
		})();
		INDEX_CACHE_PENDING.set(key, createPromise);
		try {
			return await createPromise;
		} finally {
			if (INDEX_CACHE_PENDING.get(key) === createPromise) INDEX_CACHE_PENDING.delete(key);
		}
	}
	constructor(params) {
		super();
		this.providerInitPromise = null;
		this.providerInitialized = false;
		this.batchFailureCount = 0;
		this.batchFailureLock = Promise.resolve();
		this.vectorReady = null;
		this.watcher = null;
		this.watchTimer = null;
		this.sessionWatchTimer = null;
		this.sessionUnsubscribe = null;
		this.intervalTimer = null;
		this.closed = false;
		this.dirty = false;
		this.sessionsDirty = false;
		this.sessionsDirtyFiles = /* @__PURE__ */ new Set();
		this.sessionPendingFiles = /* @__PURE__ */ new Set();
		this.sessionDeltas = /* @__PURE__ */ new Map();
		this.sessionWarm = /* @__PURE__ */ new Set();
		this.syncing = null;
		this.queuedSessionFiles = /* @__PURE__ */ new Set();
		this.queuedSessionSync = null;
		this.readonlyRecoveryAttempts = 0;
		this.readonlyRecoverySuccesses = 0;
		this.readonlyRecoveryFailures = 0;
		this.cacheKey = params.cacheKey;
		this.cfg = params.cfg;
		this.agentId = params.agentId;
		this.workspaceDir = params.workspaceDir;
		this.settings = params.settings;
		this.provider = null;
		this.requestedProvider = params.settings.provider;
		if (params.providerResult) this.applyProviderResult(params.providerResult);
		this.sources = new Set(params.settings.sources);
		this.db = this.openDatabase();
		this.providerKey = this.computeProviderKey();
		this.cache = {
			enabled: params.settings.cache.enabled,
			maxEntries: params.settings.cache.maxEntries
		};
		this.fts = {
			enabled: params.settings.query.hybrid.enabled,
			available: false
		};
		this.ensureSchema();
		this.vector = {
			enabled: params.settings.store.vector.enabled,
			available: null,
			extensionPath: params.settings.store.vector.extensionPath
		};
		const meta = this.readMeta();
		if (meta?.vectorDims) this.vector.dims = meta.vectorDims;
		const statusOnly = params.purpose === "status";
		if (!statusOnly) {
			this.ensureWatcher();
			this.ensureSessionListener();
			this.ensureIntervalSync();
		}
		this.dirty = this.sources.has("memory") && (statusOnly ? !meta : true);
		this.batch = this.resolveBatchConfig();
	}
	applyProviderResult(providerResult) {
		this.provider = providerResult.provider;
		this.fallbackFrom = providerResult.fallbackFrom;
		this.fallbackReason = providerResult.fallbackReason;
		this.providerUnavailableReason = providerResult.providerUnavailableReason;
		this.providerRuntime = providerResult.runtime;
		this.providerInitialized = true;
	}
	async ensureProviderInitialized() {
		if (this.providerInitialized) return;
		if (!this.providerInitPromise) this.providerInitPromise = (async () => {
			const providerResult = await MemoryIndexManager.loadProviderResult({
				cfg: this.cfg,
				agentId: this.agentId,
				settings: this.settings
			});
			this.applyProviderResult(providerResult);
			this.providerKey = this.computeProviderKey();
			this.batch = this.resolveBatchConfig();
		})();
		try {
			await this.providerInitPromise;
		} finally {
			if (this.providerInitialized) this.providerInitPromise = null;
		}
	}
	async warmSession(sessionKey) {
		if (!this.settings.sync.onSessionStart) return;
		const key = sessionKey?.trim() || "";
		if (key && this.sessionWarm.has(key)) return;
		this.sync({ reason: "session-start" }).catch((err) => {
			log.warn(`memory sync failed (session-start): ${String(err)}`);
		});
		if (key) this.sessionWarm.add(key);
	}
	async search(query, opts) {
		const cleaned = query.trim();
		if (!cleaned) return [];
		this.warmSession(opts?.sessionKey);
		if (this.settings.sync.onSearch && (this.dirty || this.sessionsDirty)) this.sync({ reason: "search" }).catch((err) => {
			log.warn(`memory sync failed (search): ${String(err)}`);
		});
		if (!this.hasIndexedContent()) return [];
		await this.ensureProviderInitialized();
		const minScore = opts?.minScore ?? this.settings.query.minScore;
		const maxResults = opts?.maxResults ?? this.settings.query.maxResults;
		const hybrid = this.settings.query.hybrid;
		const candidates = Math.min(200, Math.max(1, Math.floor(maxResults * hybrid.candidateMultiplier)));
		if (!this.provider) {
			if (!this.fts.enabled || !this.fts.available) {
				log.warn("memory search: no provider and FTS unavailable");
				return [];
			}
			const keywords = extractKeywords(cleaned);
			const searchTerms = keywords.length > 0 ? keywords : [cleaned];
			const resultSets = await Promise.all(searchTerms.map((term) => this.searchKeyword(term, candidates).catch(() => [])));
			const seenIds = /* @__PURE__ */ new Map();
			for (const results of resultSets) for (const result of results) {
				const existing = seenIds.get(result.id);
				if (!existing || result.score > existing.score) seenIds.set(result.id, result);
			}
			return [...seenIds.values()].toSorted((a, b) => b.score - a.score).filter((entry) => entry.score >= minScore).slice(0, maxResults);
		}
		const keywordResults = hybrid.enabled && this.fts.enabled && this.fts.available ? await this.searchKeyword(cleaned, candidates).catch(() => []) : [];
		const queryVec = await this.embedQueryWithTimeout(cleaned);
		const vectorResults = queryVec.some((v) => v !== 0) ? await this.searchVector(queryVec, candidates).catch(() => []) : [];
		if (!hybrid.enabled || !this.fts.enabled || !this.fts.available) return vectorResults.filter((entry) => entry.score >= minScore).slice(0, maxResults);
		const merged = await this.mergeHybridResults({
			vector: vectorResults,
			keyword: keywordResults,
			vectorWeight: hybrid.vectorWeight,
			textWeight: hybrid.textWeight,
			mmr: hybrid.mmr,
			temporalDecay: hybrid.temporalDecay
		});
		const strict = merged.filter((entry) => entry.score >= minScore);
		if (strict.length > 0 || keywordResults.length === 0) return strict.slice(0, maxResults);
		const relaxedMinScore = Math.min(minScore, hybrid.textWeight);
		const keywordKeys = new Set(keywordResults.map((entry) => `${entry.source}:${entry.path}:${entry.startLine}:${entry.endLine}`));
		return merged.filter((entry) => keywordKeys.has(`${entry.source}:${entry.path}:${entry.startLine}:${entry.endLine}`) && entry.score >= relaxedMinScore).slice(0, maxResults);
	}
	hasIndexedContent() {
		if (this.db.prepare(`SELECT 1 as found FROM chunks LIMIT 1`).get()?.found === 1) return true;
		if (!this.fts.enabled || !this.fts.available) return false;
		return this.db.prepare(`SELECT 1 as found FROM ${FTS_TABLE} LIMIT 1`).get()?.found === 1;
	}
	async searchVector(queryVec, limit) {
		if (!this.provider) return [];
		return (await searchVector({
			db: this.db,
			vectorTable: VECTOR_TABLE,
			providerModel: this.provider.model,
			queryVec,
			limit,
			snippetMaxChars: SNIPPET_MAX_CHARS,
			ensureVectorReady: async (dimensions) => await this.ensureVectorReady(dimensions),
			sourceFilterVec: this.buildSourceFilter("c"),
			sourceFilterChunks: this.buildSourceFilter()
		})).map((entry) => entry);
	}
	buildFtsQuery(raw) {
		return buildFtsQuery(raw);
	}
	async searchKeyword(query, limit) {
		if (!this.fts.enabled || !this.fts.available) return [];
		const sourceFilter = this.buildSourceFilter();
		const providerModel = this.provider?.model;
		return (await searchKeyword({
			db: this.db,
			ftsTable: FTS_TABLE,
			providerModel,
			query,
			limit,
			snippetMaxChars: SNIPPET_MAX_CHARS,
			sourceFilter,
			buildFtsQuery: (raw) => this.buildFtsQuery(raw),
			bm25RankToScore
		})).map((entry) => entry);
	}
	mergeHybridResults(params) {
		return mergeHybridResults({
			vector: params.vector.map((r) => ({
				id: r.id,
				path: r.path,
				startLine: r.startLine,
				endLine: r.endLine,
				source: r.source,
				snippet: r.snippet,
				vectorScore: r.score
			})),
			keyword: params.keyword.map((r) => ({
				id: r.id,
				path: r.path,
				startLine: r.startLine,
				endLine: r.endLine,
				source: r.source,
				snippet: r.snippet,
				textScore: r.textScore
			})),
			vectorWeight: params.vectorWeight,
			textWeight: params.textWeight,
			mmr: params.mmr,
			temporalDecay: params.temporalDecay,
			workspaceDir: this.workspaceDir
		}).then((entries) => entries.map((entry) => entry));
	}
	async sync(params) {
		if (this.closed) return;
		await this.ensureProviderInitialized();
		if (this.syncing) {
			if (params?.sessionFiles?.some((sessionFile) => sessionFile.trim().length > 0)) return this.enqueueTargetedSessionSync(params.sessionFiles);
			return this.syncing;
		}
		this.syncing = this.runSyncWithReadonlyRecovery(params).finally(() => {
			this.syncing = null;
		});
		return this.syncing ?? Promise.resolve();
	}
	enqueueTargetedSessionSync(sessionFiles) {
		for (const sessionFile of sessionFiles ?? []) {
			const trimmed = sessionFile.trim();
			if (trimmed) this.queuedSessionFiles.add(trimmed);
		}
		if (this.queuedSessionFiles.size === 0) return this.syncing ?? Promise.resolve();
		if (!this.queuedSessionSync) this.queuedSessionSync = (async () => {
			try {
				await this.syncing?.catch(() => void 0);
				while (!this.closed && this.queuedSessionFiles.size > 0) {
					const queuedSessionFiles = Array.from(this.queuedSessionFiles);
					this.queuedSessionFiles.clear();
					await this.sync({
						reason: "queued-session-files",
						sessionFiles: queuedSessionFiles
					});
				}
			} finally {
				this.queuedSessionSync = null;
			}
		})();
		return this.queuedSessionSync;
	}
	isReadonlyDbError(err) {
		const readonlyPattern = /attempt to write a readonly database|database is read-only|SQLITE_READONLY/i;
		const messages = /* @__PURE__ */ new Set();
		const pushValue = (value) => {
			if (typeof value !== "string") return;
			const normalized = value.trim();
			if (!normalized) return;
			messages.add(normalized);
		};
		pushValue(err instanceof Error ? err.message : String(err));
		if (err && typeof err === "object") {
			const record = err;
			pushValue(record.message);
			pushValue(record.code);
			pushValue(record.name);
			if (record.cause && typeof record.cause === "object") {
				const cause = record.cause;
				pushValue(cause.message);
				pushValue(cause.code);
				pushValue(cause.name);
			}
		}
		return [...messages].some((value) => readonlyPattern.test(value));
	}
	extractErrorReason(err) {
		if (err instanceof Error && err.message.trim()) return err.message;
		if (err && typeof err === "object") {
			const record = err;
			if (typeof record.message === "string" && record.message.trim()) return record.message;
			if (typeof record.code === "string" && record.code.trim()) return record.code;
		}
		return String(err);
	}
	async runSyncWithReadonlyRecovery(params) {
		try {
			await this.runSync(params);
			return;
		} catch (err) {
			if (!this.isReadonlyDbError(err) || this.closed) throw err;
			const reason = this.extractErrorReason(err);
			this.readonlyRecoveryAttempts += 1;
			this.readonlyRecoveryLastError = reason;
			log.warn(`memory sync readonly handle detected; reopening sqlite connection`, { reason });
			try {
				this.db.close();
			} catch {}
			this.db = this.openDatabase();
			this.vectorReady = null;
			this.vector.available = null;
			this.vector.loadError = void 0;
			this.ensureSchema();
			const meta = this.readMeta();
			this.vector.dims = meta?.vectorDims;
			try {
				await this.runSync(params);
				this.readonlyRecoverySuccesses += 1;
			} catch (retryErr) {
				this.readonlyRecoveryFailures += 1;
				throw retryErr;
			}
		}
	}
	async readFile(params) {
		return await readMemoryFile({
			workspaceDir: this.workspaceDir,
			extraPaths: this.settings.extraPaths,
			relPath: params.relPath,
			from: params.from,
			lines: params.lines
		});
	}
	status() {
		const sourceFilter = this.buildSourceFilter();
		const aggregateRows = this.db.prepare(`SELECT 'files' AS kind, source, COUNT(*) as c FROM files WHERE 1=1${sourceFilter.sql} GROUP BY source\nUNION ALL\nSELECT 'chunks' AS kind, source, COUNT(*) as c FROM chunks WHERE 1=1${sourceFilter.sql} GROUP BY source`).all(...sourceFilter.params, ...sourceFilter.params);
		const aggregateState = (() => {
			const sources = Array.from(this.sources);
			const bySource = /* @__PURE__ */ new Map();
			for (const source of sources) bySource.set(source, {
				files: 0,
				chunks: 0
			});
			let files = 0;
			let chunks = 0;
			for (const row of aggregateRows) {
				const count = row.c ?? 0;
				const entry = bySource.get(row.source) ?? {
					files: 0,
					chunks: 0
				};
				if (row.kind === "files") {
					entry.files = count;
					files += count;
				} else {
					entry.chunks = count;
					chunks += count;
				}
				bySource.set(row.source, entry);
			}
			return {
				files,
				chunks,
				sourceCounts: sources.map((source) => Object.assign({ source }, bySource.get(source)))
			};
		})();
		const searchMode = this.provider || !this.providerInitialized ? "hybrid" : "fts-only";
		const providerInfo = this.provider ? {
			provider: this.provider.id,
			model: this.provider.model
		} : this.providerInitialized ? {
			provider: "none",
			model: void 0
		} : {
			provider: this.requestedProvider,
			model: this.settings.model || void 0
		};
		return {
			backend: "builtin",
			files: aggregateState.files,
			chunks: aggregateState.chunks,
			dirty: this.dirty || this.sessionsDirty,
			workspaceDir: this.workspaceDir,
			dbPath: this.settings.store.path,
			provider: providerInfo.provider,
			model: providerInfo.model,
			requestedProvider: this.requestedProvider,
			sources: Array.from(this.sources),
			extraPaths: this.settings.extraPaths,
			sourceCounts: aggregateState.sourceCounts,
			cache: this.cache.enabled ? {
				enabled: true,
				entries: this.db.prepare(`SELECT COUNT(*) as c FROM ${EMBEDDING_CACHE_TABLE}`).get()?.c ?? 0,
				maxEntries: this.cache.maxEntries
			} : {
				enabled: false,
				maxEntries: this.cache.maxEntries
			},
			fts: {
				enabled: this.fts.enabled,
				available: this.fts.available,
				error: this.fts.loadError
			},
			fallback: this.fallbackReason ? {
				from: this.fallbackFrom ?? "local",
				reason: this.fallbackReason
			} : void 0,
			vector: {
				enabled: this.vector.enabled,
				available: this.vector.available ?? void 0,
				extensionPath: this.vector.extensionPath,
				loadError: this.vector.loadError,
				dims: this.vector.dims
			},
			batch: {
				enabled: this.batch.enabled,
				failures: this.batchFailureCount,
				limit: BATCH_FAILURE_LIMIT,
				wait: this.batch.wait,
				concurrency: this.batch.concurrency,
				pollIntervalMs: this.batch.pollIntervalMs,
				timeoutMs: this.batch.timeoutMs,
				lastError: this.batchFailureLastError,
				lastProvider: this.batchFailureLastProvider
			},
			custom: {
				searchMode,
				providerUnavailableReason: this.providerUnavailableReason,
				readonlyRecovery: {
					attempts: this.readonlyRecoveryAttempts,
					successes: this.readonlyRecoverySuccesses,
					failures: this.readonlyRecoveryFailures,
					lastError: this.readonlyRecoveryLastError
				}
			}
		};
	}
	async probeVectorAvailability() {
		if (!this.vector.enabled) return false;
		await this.ensureProviderInitialized();
		if (!this.provider) return false;
		return this.ensureVectorReady();
	}
	async probeEmbeddingAvailability() {
		await this.ensureProviderInitialized();
		if (!this.provider) return {
			ok: false,
			error: this.providerUnavailableReason ?? "No embedding provider available (FTS-only mode)"
		};
		try {
			await this.embedBatchWithRetry(["ping"]);
			return { ok: true };
		} catch (err) {
			return {
				ok: false,
				error: err instanceof Error ? err.message : String(err)
			};
		}
	}
	async close() {
		if (this.closed) return;
		this.closed = true;
		const pendingSync = this.syncing;
		const pendingProviderInit = this.providerInitPromise;
		if (this.watchTimer) {
			clearTimeout(this.watchTimer);
			this.watchTimer = null;
		}
		if (this.sessionWatchTimer) {
			clearTimeout(this.sessionWatchTimer);
			this.sessionWatchTimer = null;
		}
		if (this.intervalTimer) {
			clearInterval(this.intervalTimer);
			this.intervalTimer = null;
		}
		if (this.watcher) {
			await this.watcher.close();
			this.watcher = null;
		}
		if (this.sessionUnsubscribe) {
			this.sessionUnsubscribe();
			this.sessionUnsubscribe = null;
		}
		if (pendingSync) try {
			await pendingSync;
		} catch {}
		if (pendingProviderInit) try {
			await pendingProviderInit;
		} catch {}
		this.db.close();
		INDEX_CACHE.delete(this.cacheKey);
	}
};
//#endregion
export { registerBuiltInMemoryEmbeddingProviders as a, listBuiltinAutoSelectMemoryEmbeddingProviderDoctorMetadata as i, closeAllMemoryIndexManagers as n, getBuiltinMemoryEmbeddingProviderDoctorMetadata as r, MemoryIndexManager as t };
