import { n as fetchWithSsrFGuard } from "./fetch-guard-dgUzueSW.js";
import { t as resolveApiKeyForProvider } from "./provider-auth-runtime-DQXKSr5V.js";
import { a as ssrfPolicyFromAllowPrivateNetwork, n as buildHostnameAllowlistPolicyFromSuffixAllowlist } from "./ssrf-policy-BHnhX84O.js";
import "./ssrf-runtime-B5xa5qYU.js";
//#region extensions/fal/image-generation-provider.ts
const DEFAULT_FAL_BASE_URL = "https://fal.run";
const DEFAULT_FAL_IMAGE_MODEL = "fal-ai/flux/dev";
const DEFAULT_FAL_EDIT_SUBPATH = "image-to-image";
const DEFAULT_OUTPUT_FORMAT = "png";
const FAL_SUPPORTED_SIZES = [
	"1024x1024",
	"1024x1536",
	"1536x1024",
	"1024x1792",
	"1792x1024"
];
const FAL_SUPPORTED_ASPECT_RATIOS = [
	"1:1",
	"4:3",
	"3:4",
	"16:9",
	"9:16"
];
let falFetchGuard = fetchWithSsrFGuard;
function _setFalFetchGuardForTesting(impl) {
	falFetchGuard = impl ?? fetchWithSsrFGuard;
}
function mergeSsrFPolicies(...policies) {
	const merged = {};
	for (const policy of policies) {
		if (!policy) continue;
		if (policy.allowPrivateNetwork) merged.allowPrivateNetwork = true;
		if (policy.dangerouslyAllowPrivateNetwork) merged.dangerouslyAllowPrivateNetwork = true;
		if (policy.allowRfc2544BenchmarkRange) merged.allowRfc2544BenchmarkRange = true;
		if (policy.allowedHostnames?.length) merged.allowedHostnames = Array.from(new Set([...merged.allowedHostnames ?? [], ...policy.allowedHostnames]));
		if (policy.hostnameAllowlist?.length) merged.hostnameAllowlist = Array.from(new Set([...merged.hostnameAllowlist ?? [], ...policy.hostnameAllowlist]));
	}
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function matchesTrustedHostSuffix(hostname, trustedSuffix) {
	const normalizedHost = hostname.trim().toLowerCase();
	const normalizedSuffix = trustedSuffix.trim().toLowerCase();
	return normalizedHost === normalizedSuffix || normalizedHost.endsWith(`.${normalizedSuffix}`);
}
function resolveFalNetworkPolicy(cfg) {
	const baseUrl = resolveFalBaseUrl(cfg);
	const explicitBaseUrl = cfg?.models?.providers?.fal?.baseUrl?.trim();
	let parsedBaseUrl;
	try {
		parsedBaseUrl = new URL(baseUrl);
	} catch {
		return {};
	}
	const hostSuffix = parsedBaseUrl.hostname.trim().toLowerCase();
	if (!hostSuffix) return {};
	const trustedHostPolicy = mergeSsrFPolicies(buildHostnameAllowlistPolicyFromSuffixAllowlist([hostSuffix]), explicitBaseUrl ? ssrfPolicyFromAllowPrivateNetwork(true) : void 0);
	return {
		apiPolicy: trustedHostPolicy,
		trustedDownloadHostSuffix: explicitBaseUrl ? hostSuffix : void 0,
		trustedDownloadPolicy: explicitBaseUrl ? trustedHostPolicy : void 0
	};
}
function resolveFalBaseUrl(cfg) {
	return (cfg?.models?.providers?.fal?.baseUrl?.trim() || DEFAULT_FAL_BASE_URL).replace(/\/+$/u, "");
}
function ensureFalModelPath(model, hasInputImages) {
	const trimmed = model?.trim() || DEFAULT_FAL_IMAGE_MODEL;
	if (!hasInputImages) return trimmed;
	if (trimmed.endsWith(`/${DEFAULT_FAL_EDIT_SUBPATH}`) || trimmed.endsWith("/edit") || trimmed.includes("/image-to-image/")) return trimmed;
	return `${trimmed}/${DEFAULT_FAL_EDIT_SUBPATH}`;
}
function parseSize(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return null;
	const match = /^(\d{2,5})x(\d{2,5})$/iu.exec(trimmed);
	if (!match) return null;
	const width = Number.parseInt(match[1] ?? "", 10);
	const height = Number.parseInt(match[2] ?? "", 10);
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;
	return {
		width,
		height
	};
}
function mapResolutionToEdge(resolution) {
	if (!resolution) return;
	return resolution === "4K" ? 4096 : resolution === "2K" ? 2048 : 1024;
}
function aspectRatioToEnum(aspectRatio) {
	const normalized = aspectRatio?.trim();
	if (!normalized) return;
	if (normalized === "1:1") return "square_hd";
	if (normalized === "4:3") return "landscape_4_3";
	if (normalized === "3:4") return "portrait_4_3";
	if (normalized === "16:9") return "landscape_16_9";
	if (normalized === "9:16") return "portrait_16_9";
}
function aspectRatioToDimensions(aspectRatio, edge) {
	const match = /^(\d+):(\d+)$/u.exec(aspectRatio.trim());
	if (!match) throw new Error(`Invalid fal aspect ratio: ${aspectRatio}`);
	const widthRatio = Number.parseInt(match[1] ?? "", 10);
	const heightRatio = Number.parseInt(match[2] ?? "", 10);
	if (!Number.isFinite(widthRatio) || !Number.isFinite(heightRatio) || widthRatio <= 0 || heightRatio <= 0) throw new Error(`Invalid fal aspect ratio: ${aspectRatio}`);
	if (widthRatio >= heightRatio) return {
		width: edge,
		height: Math.max(1, Math.round(edge * heightRatio / widthRatio))
	};
	return {
		width: Math.max(1, Math.round(edge * widthRatio / heightRatio)),
		height: edge
	};
}
function resolveFalImageSize(params) {
	const parsed = parseSize(params.size);
	if (parsed) return parsed;
	const normalizedAspectRatio = params.aspectRatio?.trim();
	if (normalizedAspectRatio && params.hasInputImages) throw new Error("fal image edit endpoint does not support aspectRatio overrides");
	const edge = mapResolutionToEdge(params.resolution);
	if (normalizedAspectRatio && edge) return aspectRatioToDimensions(normalizedAspectRatio, edge);
	if (edge) return {
		width: edge,
		height: edge
	};
	if (normalizedAspectRatio) return aspectRatioToEnum(normalizedAspectRatio) ?? aspectRatioToDimensions(normalizedAspectRatio, 1024);
}
function toDataUri(buffer, mimeType) {
	return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
function fileExtensionForMimeType(mimeType) {
	const normalized = mimeType?.toLowerCase().trim();
	if (!normalized) return "png";
	if (normalized.includes("jpeg")) return "jpg";
	const slashIndex = normalized.indexOf("/");
	return slashIndex >= 0 ? normalized.slice(slashIndex + 1) || "png" : "png";
}
async function fetchImageBuffer(url, networkPolicy) {
	const downloadPolicy = (() => {
		const trustedSuffix = networkPolicy?.trustedDownloadHostSuffix;
		const trustedPolicy = networkPolicy?.trustedDownloadPolicy;
		if (!trustedSuffix || !trustedPolicy) return;
		try {
			return matchesTrustedHostSuffix(new URL(url).hostname, trustedSuffix) ? trustedPolicy : void 0;
		} catch {
			return;
		}
	})();
	const { response, release } = await falFetchGuard({
		url,
		policy: downloadPolicy,
		auditContext: "fal-image-download"
	});
	try {
		if (!response.ok) {
			const text = await response.text().catch(() => "");
			throw new Error(`fal image download failed (${response.status}): ${text || response.statusText}`);
		}
		const mimeType = response.headers.get("content-type")?.trim() || "image/png";
		const arrayBuffer = await response.arrayBuffer();
		return {
			buffer: Buffer.from(arrayBuffer),
			mimeType
		};
	} finally {
		await release();
	}
}
function buildFalImageGenerationProvider() {
	return {
		id: "fal",
		label: "fal",
		defaultModel: DEFAULT_FAL_IMAGE_MODEL,
		models: [DEFAULT_FAL_IMAGE_MODEL, `${DEFAULT_FAL_IMAGE_MODEL}/${DEFAULT_FAL_EDIT_SUBPATH}`],
		capabilities: {
			generate: {
				maxCount: 4,
				supportsSize: true,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			edit: {
				enabled: true,
				maxCount: 4,
				maxInputImages: 1,
				supportsSize: true,
				supportsAspectRatio: false,
				supportsResolution: true
			},
			geometry: {
				sizes: [...FAL_SUPPORTED_SIZES],
				aspectRatios: [...FAL_SUPPORTED_ASPECT_RATIOS],
				resolutions: [
					"1K",
					"2K",
					"4K"
				]
			}
		},
		async generateImage(req) {
			const auth = await resolveApiKeyForProvider({
				provider: "fal",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("fal API key missing");
			if ((req.inputImages?.length ?? 0) > 1) throw new Error("fal image generation currently supports at most one reference image");
			const hasInputImages = (req.inputImages?.length ?? 0) > 0;
			const imageSize = resolveFalImageSize({
				size: req.size,
				resolution: req.resolution,
				aspectRatio: req.aspectRatio,
				hasInputImages
			});
			const model = ensureFalModelPath(req.model, hasInputImages);
			const networkPolicy = resolveFalNetworkPolicy(req.cfg);
			const requestBody = {
				prompt: req.prompt,
				num_images: req.count ?? 1,
				output_format: DEFAULT_OUTPUT_FORMAT
			};
			if (imageSize !== void 0) requestBody.image_size = imageSize;
			if (hasInputImages) {
				const [input] = req.inputImages ?? [];
				if (!input) throw new Error("fal image edit request missing reference image");
				requestBody.image_url = toDataUri(input.buffer, input.mimeType);
			}
			const { response, release } = await falFetchGuard({
				url: `${resolveFalBaseUrl(req.cfg)}/${model}`,
				init: {
					method: "POST",
					headers: {
						Authorization: `Key ${auth.apiKey}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(requestBody)
				},
				policy: networkPolicy.apiPolicy,
				auditContext: "fal-image-generate"
			});
			try {
				if (!response.ok) {
					const text = await response.text().catch(() => "");
					throw new Error(`fal image generation failed (${response.status}): ${text || response.statusText}`);
				}
				const payload = await response.json();
				const images = [];
				let imageIndex = 0;
				for (const entry of payload.images ?? []) {
					const url = entry.url?.trim();
					if (!url) continue;
					const downloaded = await fetchImageBuffer(url, networkPolicy);
					imageIndex += 1;
					images.push({
						buffer: downloaded.buffer,
						mimeType: downloaded.mimeType,
						fileName: `image-${imageIndex}.${fileExtensionForMimeType(downloaded.mimeType || entry.content_type)}`
					});
				}
				if (images.length === 0) throw new Error("fal image generation response missing image data");
				return {
					images,
					model,
					metadata: payload.prompt ? { prompt: payload.prompt } : void 0
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildFalImageGenerationProvider as n, _setFalFetchGuardForTesting as t };
