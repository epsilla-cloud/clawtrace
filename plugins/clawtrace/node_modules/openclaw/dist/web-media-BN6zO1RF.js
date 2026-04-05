import { n as redactSensitiveText } from "./redact-BDinS1q9.js";
import { r as formatErrorMessage } from "./errors-BxyFnvP3.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-Day5KPIY.js";
import { v as resolveUserPath } from "./utils-BfvDpbwh.js";
import { _ as resolveStateDir } from "./paths-Y4UT24Of.js";
import { a as shouldLogVerbose, r as logVerbose } from "./globals-0H99T-Tx.js";
import { i as resolveAgentConfig, p as resolveAgentWorkspaceDir } from "./agent-scope-BSOSJbA_.js";
import { n as extensionForMime, p as maxBytesForKind, s as kindFromMime, t as detectMime } from "./mime-BFjhBApy.js";
import { a as hasAlphaChannel, c as resizeToJpeg, r as convertHeicToJpeg, s as optimizeImageToPng } from "./image-ops-CdQKlwD6.js";
import { n as fetchWithSsrFGuard, r as withStrictGuardedFetchMode } from "./fetch-guard-dgUzueSW.js";
import { i as safeFileURLToPath, t as assertNoWindowsNetworkPath } from "./local-file-access-C4HbmpnT.js";
import { r as pickSandboxToolPolicy, t as isToolAllowedByPolicies } from "./tool-policy-match-qwLsTvyG.js";
import { a as mergeAlsoAllowPolicy, l as resolveToolProfilePolicy } from "./tool-policy-DG7GGbxQ.js";
import { c as readLocalFileSafely, t as SafeOpenError } from "./fs-safe-D9sbDNFI.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/media/read-response-with-limit.ts
async function readChunkWithIdleTimeout(reader, chunkTimeoutMs, onIdleTimeout) {
	let timeoutId;
	let timedOut = false;
	return await new Promise((resolve, reject) => {
		const clear = () => {
			if (timeoutId !== void 0) {
				clearTimeout(timeoutId);
				timeoutId = void 0;
			}
		};
		timeoutId = setTimeout(() => {
			timedOut = true;
			clear();
			reader.cancel().catch(() => void 0);
			reject(onIdleTimeout?.({ chunkTimeoutMs }) ?? /* @__PURE__ */ new Error(`Media download stalled: no data received for ${chunkTimeoutMs}ms`));
		}, chunkTimeoutMs);
		reader.read().then((result) => {
			clear();
			if (!timedOut) resolve(result);
		}, (err) => {
			clear();
			if (!timedOut) reject(err);
		});
	});
}
async function readResponsePrefix(res, maxBytes, opts) {
	const chunkTimeoutMs = opts?.chunkTimeoutMs;
	const body = res.body;
	if (!body || typeof body.getReader !== "function") {
		const fallback = Buffer.from(await res.arrayBuffer());
		if (fallback.length > maxBytes) return {
			buffer: fallback.subarray(0, maxBytes),
			size: fallback.length,
			truncated: true
		};
		return {
			buffer: fallback,
			size: fallback.length,
			truncated: false
		};
	}
	const reader = body.getReader();
	const chunks = [];
	let total = 0;
	let size = 0;
	let truncated = false;
	try {
		while (true) {
			const { done, value } = chunkTimeoutMs ? await readChunkWithIdleTimeout(reader, chunkTimeoutMs, opts?.onIdleTimeout) : await reader.read();
			if (done) {
				size = total;
				break;
			}
			if (!value?.length) continue;
			const nextTotal = total + value.length;
			if (nextTotal > maxBytes) {
				const remaining = maxBytes - total;
				if (remaining > 0) {
					chunks.push(value.subarray(0, remaining));
					total += remaining;
				}
				size = nextTotal;
				truncated = true;
				try {
					await reader.cancel();
				} catch {}
				break;
			}
			chunks.push(value);
			total = nextTotal;
			size = total;
		}
	} finally {
		try {
			reader.releaseLock();
		} catch {}
	}
	return {
		buffer: Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), total),
		size,
		truncated
	};
}
async function readResponseWithLimit(res, maxBytes, opts) {
	const onOverflow = opts?.onOverflow ?? ((params) => /* @__PURE__ */ new Error(`Content too large: ${params.size} bytes (limit: ${params.maxBytes} bytes)`));
	const prefix = await readResponsePrefix(res, maxBytes, {
		chunkTimeoutMs: opts?.chunkTimeoutMs,
		onIdleTimeout: opts?.onIdleTimeout
	});
	if (prefix.truncated) throw onOverflow({
		size: prefix.size,
		maxBytes,
		res
	});
	return prefix.buffer;
}
async function readResponseTextSnippet(res, opts) {
	const maxBytes = opts?.maxBytes ?? 8 * 1024;
	const maxChars = opts?.maxChars ?? 200;
	const prefix = await readResponsePrefix(res, maxBytes, {
		chunkTimeoutMs: opts?.chunkTimeoutMs,
		onIdleTimeout: opts?.onIdleTimeout
	});
	if (prefix.buffer.length === 0) return;
	const text = new TextDecoder().decode(prefix.buffer);
	if (!text) return;
	const collapsed = text.replace(/\s+/g, " ").trim();
	if (!collapsed) return;
	if (collapsed.length > maxChars) return `${collapsed.slice(0, maxChars)}…`;
	return prefix.truncated ? `${collapsed}…` : collapsed;
}
//#endregion
//#region src/media/fetch.ts
var MediaFetchError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "MediaFetchError";
	}
};
function stripQuotes(value) {
	return value.replace(/^["']|["']$/g, "");
}
function parseContentDispositionFileName(header) {
	if (!header) return;
	const starMatch = /filename\*\s*=\s*([^;]+)/i.exec(header);
	if (starMatch?.[1]) {
		const cleaned = stripQuotes(starMatch[1].trim());
		const encoded = cleaned.split("''").slice(1).join("''") || cleaned;
		try {
			return path.basename(decodeURIComponent(encoded));
		} catch {
			return path.basename(encoded);
		}
	}
	const match = /filename\s*=\s*([^;]+)/i.exec(header);
	if (match?.[1]) return path.basename(stripQuotes(match[1].trim()));
}
async function readErrorBodySnippet(res, opts) {
	try {
		return await readResponseTextSnippet(res, {
			maxBytes: 8 * 1024,
			maxChars: opts?.maxChars,
			chunkTimeoutMs: opts?.chunkTimeoutMs
		});
	} catch {
		return;
	}
}
function redactMediaUrl(url) {
	return redactSensitiveText(url);
}
async function fetchRemoteMedia(options) {
	const { url, fetchImpl, requestInit, filePathHint, maxBytes, maxRedirects, readIdleTimeoutMs, ssrfPolicy, lookupFn, dispatcherAttempts, shouldRetryFetchError } = options;
	const sourceUrl = redactMediaUrl(url);
	let res;
	let finalUrl = url;
	let release = null;
	const attempts = dispatcherAttempts && dispatcherAttempts.length > 0 ? dispatcherAttempts : [{
		dispatcherPolicy: void 0,
		lookupFn
	}];
	const runGuardedFetch = async (attempt) => await fetchWithSsrFGuard(withStrictGuardedFetchMode({
		url,
		fetchImpl,
		init: requestInit,
		maxRedirects,
		policy: ssrfPolicy,
		lookupFn: attempt.lookupFn ?? lookupFn,
		dispatcherPolicy: attempt.dispatcherPolicy
	}));
	try {
		let result;
		const attemptErrors = [];
		for (let i = 0; i < attempts.length; i += 1) try {
			result = await runGuardedFetch(attempts[i]);
			break;
		} catch (err) {
			if (typeof shouldRetryFetchError !== "function" || !shouldRetryFetchError(err) || i === attempts.length - 1) {
				if (attemptErrors.length > 0) {
					const combined = new Error(`Primary fetch failed and fallback fetch also failed for ${sourceUrl}`, { cause: err });
					combined.primaryError = attemptErrors[0];
					combined.attemptErrors = [...attemptErrors, err];
					throw combined;
				}
				throw err;
			}
			attemptErrors.push(err);
		}
		res = result.response;
		finalUrl = result.finalUrl;
		release = result.release;
	} catch (err) {
		throw new MediaFetchError("fetch_failed", `Failed to fetch media from ${sourceUrl}: ${formatErrorMessage(err)}`, { cause: err });
	}
	try {
		if (!res.ok) {
			const statusText = res.statusText ? ` ${res.statusText}` : "";
			const redirected = finalUrl !== url ? ` (redirected to ${redactMediaUrl(finalUrl)})` : "";
			let detail = `HTTP ${res.status}${statusText}`;
			if (!res.body) detail = `HTTP ${res.status}${statusText}; empty response body`;
			else {
				const snippet = await readErrorBodySnippet(res, { chunkTimeoutMs: readIdleTimeoutMs });
				if (snippet) detail += `; body: ${snippet}`;
			}
			throw new MediaFetchError("http_error", `Failed to fetch media from ${sourceUrl}${redirected}: ${redactSensitiveText(detail)}`);
		}
		const contentLength = res.headers.get("content-length");
		if (maxBytes && contentLength) {
			const length = Number(contentLength);
			if (Number.isFinite(length) && length > maxBytes) throw new MediaFetchError("max_bytes", `Failed to fetch media from ${sourceUrl}: content length ${length} exceeds maxBytes ${maxBytes}`);
		}
		let buffer;
		try {
			buffer = maxBytes ? await readResponseWithLimit(res, maxBytes, {
				onOverflow: ({ maxBytes, res }) => new MediaFetchError("max_bytes", `Failed to fetch media from ${redactMediaUrl(res.url || url)}: payload exceeds maxBytes ${maxBytes}`),
				chunkTimeoutMs: readIdleTimeoutMs
			}) : Buffer.from(await res.arrayBuffer());
		} catch (err) {
			if (err instanceof MediaFetchError) throw err;
			throw new MediaFetchError("fetch_failed", `Failed to fetch media from ${redactMediaUrl(res.url || url)}: ${formatErrorMessage(err)}`, { cause: err });
		}
		let fileNameFromUrl;
		try {
			const parsed = new URL(finalUrl);
			fileNameFromUrl = path.basename(parsed.pathname) || void 0;
		} catch {}
		const headerFileName = parseContentDispositionFileName(res.headers.get("content-disposition"));
		let fileName = headerFileName || fileNameFromUrl || (filePathHint ? path.basename(filePathHint) : void 0);
		const filePathForMime = headerFileName && path.extname(headerFileName) ? headerFileName : filePathHint ?? finalUrl;
		const contentType = await detectMime({
			buffer,
			headerMime: res.headers.get("content-type"),
			filePath: filePathForMime
		});
		if (fileName && !path.extname(fileName) && contentType) {
			const ext = extensionForMime(contentType);
			if (ext) fileName = `${fileName}${ext}`;
		}
		return {
			buffer,
			contentType: contentType ?? void 0,
			fileName
		};
	} finally {
		if (release) await release();
	}
}
//#endregion
//#region src/agents/tool-fs-policy.ts
function createToolFsPolicy(params) {
	return { workspaceOnly: params.workspaceOnly === true };
}
function resolveToolFsConfig(params) {
	const cfg = params.cfg;
	const globalFs = cfg?.tools?.fs;
	return { workspaceOnly: (cfg && params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools?.fs : void 0)?.workspaceOnly ?? globalFs?.workspaceOnly };
}
function resolveEffectiveToolFsWorkspaceOnly(params) {
	return resolveToolFsConfig(params).workspaceOnly === true;
}
function resolveEffectiveToolFsRootExpansionAllowed(params) {
	const cfg = params.cfg;
	if (!cfg) return true;
	const agentTools = params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools : void 0;
	const globalTools = cfg.tools;
	const profile = agentTools?.profile ?? globalTools?.profile;
	const profileAlsoAllow = new Set(agentTools?.alsoAllow ?? globalTools?.alsoAllow ?? []);
	const fsConfig = resolveToolFsConfig(params);
	const hasExplicitFsConfig = agentTools?.fs !== void 0 || globalTools?.fs !== void 0;
	if (fsConfig.workspaceOnly === true) return false;
	if (hasExplicitFsConfig) {
		profileAlsoAllow.add("read");
		profileAlsoAllow.add("write");
		profileAlsoAllow.add("edit");
	}
	return isToolAllowedByPolicies("read", [
		mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), profileAlsoAllow.size > 0 ? Array.from(profileAlsoAllow) : void 0),
		pickSandboxToolPolicy(globalTools),
		pickSandboxToolPolicy(agentTools)
	]);
}
//#endregion
//#region src/media/local-roots.ts
let cachedPreferredTmpDir;
const HTTP_URL_RE = /^https?:\/\//i;
const DATA_URL_RE = /^data:/i;
const WINDOWS_DRIVE_RE = /^[A-Za-z]:[\\/]/;
function resolveCachedPreferredTmpDir() {
	if (!cachedPreferredTmpDir) cachedPreferredTmpDir = resolvePreferredOpenClawTmpDir();
	return cachedPreferredTmpDir;
}
function buildMediaLocalRoots(stateDir, options = {}) {
	const resolvedStateDir = path.resolve(stateDir);
	return [
		options.preferredTmpDir ?? resolveCachedPreferredTmpDir(),
		path.join(resolvedStateDir, "media"),
		path.join(resolvedStateDir, "workspace"),
		path.join(resolvedStateDir, "sandboxes")
	];
}
function getDefaultMediaLocalRoots() {
	return buildMediaLocalRoots(resolveStateDir());
}
function getAgentScopedMediaLocalRoots(cfg, agentId) {
	const roots = buildMediaLocalRoots(resolveStateDir());
	if (!agentId?.trim()) return roots;
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	if (!workspaceDir) return roots;
	const normalizedWorkspaceDir = path.resolve(workspaceDir);
	if (!roots.includes(normalizedWorkspaceDir)) roots.push(normalizedWorkspaceDir);
	return roots;
}
function resolveLocalMediaPath(source) {
	const trimmed = source.trim();
	if (!trimmed || HTTP_URL_RE.test(trimmed) || DATA_URL_RE.test(trimmed)) return;
	if (trimmed.startsWith("file://")) try {
		return safeFileURLToPath(trimmed);
	} catch {
		return;
	}
	if (trimmed.startsWith("~")) return resolveUserPath(trimmed);
	if (path.isAbsolute(trimmed) || WINDOWS_DRIVE_RE.test(trimmed)) return path.resolve(trimmed);
}
function appendLocalMediaParentRoots(roots, mediaSources) {
	const appended = Array.from(new Set(roots.map((root) => path.resolve(root))));
	for (const source of mediaSources ?? []) {
		const localPath = resolveLocalMediaPath(source);
		if (!localPath) continue;
		const parentDir = path.dirname(localPath);
		if (parentDir === path.parse(parentDir).root) continue;
		const normalizedParent = path.resolve(parentDir);
		if (!appended.includes(normalizedParent)) appended.push(normalizedParent);
	}
	return appended;
}
function getAgentScopedMediaLocalRootsForSources(params) {
	const roots = getAgentScopedMediaLocalRoots(params.cfg, params.agentId);
	if (resolveEffectiveToolFsWorkspaceOnly({
		cfg: params.cfg,
		agentId: params.agentId
	})) return roots;
	if (!resolveEffectiveToolFsRootExpansionAllowed({
		cfg: params.cfg,
		agentId: params.agentId
	})) return roots;
	return appendLocalMediaParentRoots(roots, params.mediaSources);
}
//#endregion
//#region src/media/local-media-access.ts
var LocalMediaAccessError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "LocalMediaAccessError";
	}
};
function getDefaultLocalRoots() {
	return getDefaultMediaLocalRoots();
}
async function assertLocalMediaAllowed(mediaPath, localRoots) {
	if (localRoots === "any") return;
	try {
		assertNoWindowsNetworkPath(mediaPath, "Local media path");
	} catch (err) {
		throw new LocalMediaAccessError("network-path-not-allowed", err.message, { cause: err });
	}
	const roots = localRoots ?? getDefaultLocalRoots();
	let resolved;
	try {
		resolved = await fs.realpath(mediaPath);
	} catch {
		resolved = path.resolve(mediaPath);
	}
	if (localRoots === void 0) {
		const workspaceRoot = roots.find((root) => path.basename(root) === "workspace");
		if (workspaceRoot) {
			const stateDir = path.dirname(workspaceRoot);
			const rel = path.relative(stateDir, resolved);
			if (rel && !rel.startsWith("..") && !path.isAbsolute(rel)) {
				if ((rel.split(path.sep)[0] ?? "").startsWith("workspace-")) throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
			}
		}
	}
	for (const root of roots) {
		let resolvedRoot;
		try {
			resolvedRoot = await fs.realpath(root);
		} catch {
			resolvedRoot = path.resolve(root);
		}
		if (resolvedRoot === path.parse(resolvedRoot).root) throw new LocalMediaAccessError("invalid-root", `Invalid localRoots entry (refuses filesystem root): ${root}. Pass a narrower directory.`);
		if (resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep)) return;
	}
	throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
}
//#endregion
//#region src/media/web-media.ts
function resolveWebMediaOptions(params) {
	if (typeof params.maxBytesOrOptions === "number" || params.maxBytesOrOptions === void 0) return {
		maxBytes: params.maxBytesOrOptions,
		optimizeImages: params.optimizeImages,
		ssrfPolicy: params.options?.ssrfPolicy,
		localRoots: params.options?.localRoots
	};
	return {
		...params.maxBytesOrOptions,
		optimizeImages: params.optimizeImages ? params.maxBytesOrOptions.optimizeImages ?? true : false
	};
}
const HEIC_MIME_RE = /^image\/hei[cf]$/i;
const HEIC_EXT_RE = /\.(heic|heif)$/i;
const MB = 1024 * 1024;
function formatMb(bytes, digits = 2) {
	return (bytes / MB).toFixed(digits);
}
function formatCapLimit(label, cap, size) {
	return `${label} exceeds ${formatMb(cap, 0)}MB limit (got ${formatMb(size)}MB)`;
}
function formatCapReduce(label, cap, size) {
	return `${label} could not be reduced below ${formatMb(cap, 0)}MB (got ${formatMb(size)}MB)`;
}
function isHeicSource(opts) {
	if (opts.contentType && HEIC_MIME_RE.test(opts.contentType.trim())) return true;
	if (opts.fileName && HEIC_EXT_RE.test(opts.fileName.trim())) return true;
	return false;
}
function toJpegFileName(fileName) {
	if (!fileName) return;
	const trimmed = fileName.trim();
	if (!trimmed) return fileName;
	const parsed = path.parse(trimmed);
	if (!parsed.ext || HEIC_EXT_RE.test(parsed.ext)) return path.format({
		dir: parsed.dir,
		name: parsed.name || trimmed,
		ext: ".jpg"
	});
	return path.format({
		dir: parsed.dir,
		name: parsed.name,
		ext: ".jpg"
	});
}
function logOptimizedImage(params) {
	if (!shouldLogVerbose()) return;
	if (params.optimized.optimizedSize >= params.originalSize) return;
	if (params.optimized.format === "png") {
		logVerbose(`Optimized PNG (preserving alpha) from ${formatMb(params.originalSize)}MB to ${formatMb(params.optimized.optimizedSize)}MB (side<=${params.optimized.resizeSide}px)`);
		return;
	}
	logVerbose(`Optimized media from ${formatMb(params.originalSize)}MB to ${formatMb(params.optimized.optimizedSize)}MB (side<=${params.optimized.resizeSide}px, q=${params.optimized.quality})`);
}
async function optimizeImageWithFallback(params) {
	const { buffer, cap, meta } = params;
	if ((meta?.contentType === "image/png" || meta?.fileName?.toLowerCase().endsWith(".png")) && await hasAlphaChannel(buffer)) {
		const optimized = await optimizeImageToPng(buffer, cap);
		if (optimized.buffer.length <= cap) return {
			...optimized,
			format: "png"
		};
		if (shouldLogVerbose()) logVerbose(`PNG with alpha still exceeds ${formatMb(cap, 0)}MB after optimization; falling back to JPEG`);
	}
	return {
		...await optimizeImageToJpeg(buffer, cap, meta),
		format: "jpeg"
	};
}
async function loadWebMediaInternal(mediaUrl, options = {}) {
	const { maxBytes, optimizeImages = true, ssrfPolicy, localRoots, sandboxValidated = false, readFile: readFileOverride } = options;
	mediaUrl = mediaUrl.replace(/^\s*MEDIA\s*:\s*/i, "");
	if (mediaUrl.startsWith("file://")) try {
		mediaUrl = safeFileURLToPath(mediaUrl);
	} catch (err) {
		throw new LocalMediaAccessError("invalid-file-url", err.message, { cause: err });
	}
	const optimizeAndClampImage = async (buffer, cap, meta) => {
		const originalSize = buffer.length;
		const optimized = await optimizeImageWithFallback({
			buffer,
			cap,
			meta
		});
		logOptimizedImage({
			originalSize,
			optimized
		});
		if (optimized.buffer.length > cap) throw new Error(formatCapReduce("Media", cap, optimized.buffer.length));
		const contentType = optimized.format === "png" ? "image/png" : "image/jpeg";
		const fileName = optimized.format === "jpeg" && meta && isHeicSource(meta) ? toJpegFileName(meta.fileName) : meta?.fileName;
		return {
			buffer: optimized.buffer,
			contentType,
			kind: "image",
			fileName
		};
	};
	const clampAndFinalize = async (params) => {
		const cap = maxBytes !== void 0 ? maxBytes : maxBytesForKind(params.kind ?? "document");
		if (params.kind === "image") {
			const isGif = params.contentType === "image/gif";
			if (isGif || !optimizeImages) {
				if (params.buffer.length > cap) throw new Error(formatCapLimit(isGif ? "GIF" : "Media", cap, params.buffer.length));
				return {
					buffer: params.buffer,
					contentType: params.contentType,
					kind: params.kind,
					fileName: params.fileName
				};
			}
			return { ...await optimizeAndClampImage(params.buffer, cap, {
				contentType: params.contentType,
				fileName: params.fileName
			}) };
		}
		if (params.buffer.length > cap) throw new Error(formatCapLimit("Media", cap, params.buffer.length));
		return {
			buffer: params.buffer,
			contentType: params.contentType ?? void 0,
			kind: params.kind,
			fileName: params.fileName
		};
	};
	if (/^https?:\/\//i.test(mediaUrl)) {
		const defaultFetchCap = maxBytesForKind("document");
		const { buffer, contentType, fileName } = await fetchRemoteMedia({
			url: mediaUrl,
			maxBytes: maxBytes === void 0 ? defaultFetchCap : optimizeImages ? Math.max(maxBytes, defaultFetchCap) : maxBytes,
			ssrfPolicy
		});
		return await clampAndFinalize({
			buffer,
			contentType,
			kind: kindFromMime(contentType),
			fileName
		});
	}
	if (mediaUrl.startsWith("~")) mediaUrl = resolveUserPath(mediaUrl);
	try {
		assertNoWindowsNetworkPath(mediaUrl, "Local media path");
	} catch (err) {
		throw new LocalMediaAccessError("network-path-not-allowed", err.message, { cause: err });
	}
	if ((sandboxValidated || localRoots === "any") && !readFileOverride) throw new LocalMediaAccessError("unsafe-bypass", "Refusing localRoots bypass without readFile override. Use sandboxValidated with readFile, or pass explicit localRoots.");
	if (!(sandboxValidated || localRoots === "any")) await assertLocalMediaAllowed(mediaUrl, localRoots);
	let data;
	if (readFileOverride) data = await readFileOverride(mediaUrl);
	else try {
		data = (await readLocalFileSafely({ filePath: mediaUrl })).buffer;
	} catch (err) {
		if (err instanceof SafeOpenError) {
			if (err.code === "not-found") throw new LocalMediaAccessError("not-found", `Local media file not found: ${mediaUrl}`, { cause: err });
			if (err.code === "not-file") throw new LocalMediaAccessError("not-file", `Local media path is not a file: ${mediaUrl}`, { cause: err });
			throw new LocalMediaAccessError("invalid-path", `Local media path is not safe to read: ${mediaUrl}`, { cause: err });
		}
		throw err;
	}
	const mime = await detectMime({
		buffer: data,
		filePath: mediaUrl
	});
	const kind = kindFromMime(mime);
	let fileName = path.basename(mediaUrl) || void 0;
	if (fileName && !path.extname(fileName) && mime) {
		const ext = extensionForMime(mime);
		if (ext) fileName = `${fileName}${ext}`;
	}
	return await clampAndFinalize({
		buffer: data,
		contentType: mime,
		kind,
		fileName
	});
}
async function loadWebMedia(mediaUrl, maxBytesOrOptions, options) {
	return await loadWebMediaInternal(mediaUrl, resolveWebMediaOptions({
		maxBytesOrOptions,
		options,
		optimizeImages: true
	}));
}
async function loadWebMediaRaw(mediaUrl, maxBytesOrOptions, options) {
	return await loadWebMediaInternal(mediaUrl, resolveWebMediaOptions({
		maxBytesOrOptions,
		options,
		optimizeImages: false
	}));
}
async function optimizeImageToJpeg(buffer, maxBytes, opts = {}) {
	let source = buffer;
	if (isHeicSource(opts)) try {
		source = await convertHeicToJpeg(buffer);
	} catch (err) {
		throw new Error(`HEIC image conversion failed: ${String(err)}`, { cause: err });
	}
	const sides = [
		2048,
		1536,
		1280,
		1024,
		800
	];
	const qualities = [
		80,
		70,
		60,
		50,
		40
	];
	let smallest = null;
	for (const side of sides) for (const quality of qualities) try {
		const out = await resizeToJpeg({
			buffer: source,
			maxSide: side,
			quality,
			withoutEnlargement: true
		});
		const size = out.length;
		if (!smallest || size < smallest.size) smallest = {
			buffer: out,
			size,
			resizeSide: side,
			quality
		};
		if (size <= maxBytes) return {
			buffer: out,
			optimizedSize: size,
			resizeSide: side,
			quality
		};
	} catch {}
	if (smallest) return {
		buffer: smallest.buffer,
		optimizedSize: smallest.size,
		resizeSide: smallest.resizeSide,
		quality: smallest.quality
	};
	throw new Error("Failed to optimize image");
}
//#endregion
export { readResponseWithLimit as _, assertLocalMediaAllowed as a, getAgentScopedMediaLocalRoots as c, createToolFsPolicy as d, resolveEffectiveToolFsWorkspaceOnly as f, readResponseTextSnippet as g, fetchRemoteMedia as h, LocalMediaAccessError as i, getAgentScopedMediaLocalRootsForSources as l, MediaFetchError as m, loadWebMediaRaw as n, getDefaultLocalRoots as o, resolveToolFsConfig as p, optimizeImageToJpeg as r, appendLocalMediaParentRoots as s, loadWebMedia as t, getDefaultMediaLocalRoots as u };
