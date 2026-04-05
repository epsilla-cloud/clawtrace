import { t as resolveApiKeyForProvider } from "./provider-auth-runtime-DQXKSr5V.js";
import { i as OPENAI_DEFAULT_IMAGE_MODEL } from "./default-models-DFs7K_6q.js";
//#region extensions/openai/image-generation-provider.ts
const DEFAULT_OPENAI_IMAGE_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OUTPUT_MIME = "image/png";
const DEFAULT_SIZE = "1024x1024";
const OPENAI_SUPPORTED_SIZES = [
	"1024x1024",
	"1024x1536",
	"1536x1024"
];
function resolveOpenAIBaseUrl(cfg) {
	return cfg?.models?.providers?.openai?.baseUrl?.trim() || DEFAULT_OPENAI_IMAGE_BASE_URL;
}
function buildOpenAIImageGenerationProvider() {
	return {
		id: "openai",
		label: "OpenAI",
		defaultModel: OPENAI_DEFAULT_IMAGE_MODEL,
		models: [OPENAI_DEFAULT_IMAGE_MODEL],
		capabilities: {
			generate: {
				maxCount: 4,
				supportsSize: true,
				supportsAspectRatio: false,
				supportsResolution: false
			},
			edit: {
				enabled: false,
				maxCount: 0,
				maxInputImages: 0,
				supportsSize: false,
				supportsAspectRatio: false,
				supportsResolution: false
			},
			geometry: { sizes: [...OPENAI_SUPPORTED_SIZES] }
		},
		async generateImage(req) {
			if ((req.inputImages?.length ?? 0) > 0) throw new Error("OpenAI image generation provider does not support reference-image edits");
			const auth = await resolveApiKeyForProvider({
				provider: "openai",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("OpenAI API key missing");
			const controller = new AbortController();
			const timeoutMs = req.timeoutMs;
			const timeout = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : void 0;
			const response = await fetch(`${resolveOpenAIBaseUrl(req.cfg)}/images/generations`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${auth.apiKey}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model: req.model || "gpt-image-1",
					prompt: req.prompt,
					n: req.count ?? 1,
					size: req.size ?? DEFAULT_SIZE
				}),
				signal: controller.signal
			}).finally(() => {
				clearTimeout(timeout);
			});
			if (!response.ok) {
				const text = await response.text().catch(() => "");
				throw new Error(`OpenAI image generation failed (${response.status}): ${text || response.statusText}`);
			}
			return {
				images: ((await response.json()).data ?? []).map((entry, index) => {
					if (!entry.b64_json) return null;
					return {
						buffer: Buffer.from(entry.b64_json, "base64"),
						mimeType: DEFAULT_OUTPUT_MIME,
						fileName: `image-${index + 1}.png`,
						...entry.revised_prompt ? { revisedPrompt: entry.revised_prompt } : {}
					};
				}).filter((entry) => entry !== null),
				model: req.model || "gpt-image-1"
			};
		}
	};
}
//#endregion
export { buildOpenAIImageGenerationProvider as t };
