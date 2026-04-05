import { t as resolveApiKeyForProvider } from "./provider-auth-runtime-DQXKSr5V.js";
//#region extensions/minimax/image-generation-provider.ts
const DEFAULT_MINIMAX_IMAGE_BASE_URL = "https://api.minimax.io";
const DEFAULT_MODEL = "image-01";
const DEFAULT_OUTPUT_MIME = "image/png";
const MINIMAX_SUPPORTED_ASPECT_RATIOS = [
	"1:1",
	"16:9",
	"4:3",
	"3:2",
	"2:3",
	"3:4",
	"9:16",
	"21:9"
];
function resolveMinimaxImageBaseUrl(cfg, providerId) {
	const direct = cfg?.models?.providers?.[providerId]?.baseUrl?.trim();
	if (!direct) return DEFAULT_MINIMAX_IMAGE_BASE_URL;
	try {
		return new URL(direct).origin;
	} catch {
		return DEFAULT_MINIMAX_IMAGE_BASE_URL;
	}
}
function buildMinimaxImageProvider(providerId) {
	return {
		id: providerId,
		label: "MiniMax",
		defaultModel: DEFAULT_MODEL,
		models: [DEFAULT_MODEL],
		capabilities: {
			generate: {
				maxCount: 9,
				supportsSize: false,
				supportsAspectRatio: true,
				supportsResolution: false
			},
			edit: {
				enabled: true,
				maxCount: 9,
				maxInputImages: 1,
				supportsSize: false,
				supportsAspectRatio: true,
				supportsResolution: false
			},
			geometry: { aspectRatios: [...MINIMAX_SUPPORTED_ASPECT_RATIOS] }
		},
		async generateImage(req) {
			const auth = await resolveApiKeyForProvider({
				provider: providerId,
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("MiniMax API key missing");
			const baseUrl = resolveMinimaxImageBaseUrl(req.cfg, providerId);
			const body = {
				model: req.model || DEFAULT_MODEL,
				prompt: req.prompt,
				response_format: "base64",
				n: req.count ?? 1
			};
			if (req.aspectRatio?.trim()) body.aspect_ratio = req.aspectRatio.trim();
			if (req.inputImages && req.inputImages.length > 0) {
				const ref = req.inputImages[0];
				body.subject_reference = [{
					type: "character",
					image_file: `data:${ref.mimeType || "image/jpeg"};base64,${ref.buffer.toString("base64")}`
				}];
			}
			const controller = new AbortController();
			const timeoutMs = req.timeoutMs;
			const timeout = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : void 0;
			const response = await fetch(`${baseUrl}/v1/image_generation`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body),
				signal: controller.signal
			}).finally(() => {
				clearTimeout(timeout);
			});
			if (!response.ok) {
				const text = await response.text().catch(() => "");
				throw new Error(`MiniMax image generation failed (${response.status}): ${text || response.statusText}`);
			}
			const data = await response.json();
			const baseResp = data.base_resp;
			if (baseResp && typeof baseResp.status_code === "number" && baseResp.status_code !== 0) {
				const msg = baseResp.status_msg ?? "";
				throw new Error(`MiniMax image generation API error (${baseResp.status_code}): ${msg}`);
			}
			const base64Images = data.data?.image_base64 ?? [];
			const failedCount = data.metadata?.failed_count ?? 0;
			if (base64Images.length === 0) {
				const reason = failedCount > 0 ? `${failedCount} image(s) failed to generate` : "no images returned";
				throw new Error(`MiniMax image generation returned no images: ${reason}`);
			}
			return {
				images: base64Images.map((b64, index) => {
					if (!b64) return null;
					return {
						buffer: Buffer.from(b64, "base64"),
						mimeType: DEFAULT_OUTPUT_MIME,
						fileName: `image-${index + 1}.png`
					};
				}).filter((entry) => entry !== null),
				model: req.model || DEFAULT_MODEL
			};
		}
	};
}
function buildMinimaxImageGenerationProvider() {
	return buildMinimaxImageProvider("minimax");
}
function buildMinimaxPortalImageGenerationProvider() {
	return buildMinimaxImageProvider("minimax-portal");
}
//#endregion
export { buildMinimaxPortalImageGenerationProvider as n, buildMinimaxImageGenerationProvider as t };
