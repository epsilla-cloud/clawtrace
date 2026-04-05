//#region src/plugins/bundled-provider-auth-env-vars.generated.ts
const BUNDLED_PROVIDER_AUTH_ENV_VAR_CANDIDATES = {
	anthropic: ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"],
	brave: ["BRAVE_API_KEY"],
	byteplus: ["BYTEPLUS_API_KEY"],
	chutes: ["CHUTES_API_KEY", "CHUTES_OAUTH_TOKEN"],
	"cloudflare-ai-gateway": ["CLOUDFLARE_AI_GATEWAY_API_KEY"],
	deepseek: ["DEEPSEEK_API_KEY"],
	exa: ["EXA_API_KEY"],
	fal: ["FAL_KEY"],
	firecrawl: ["FIRECRAWL_API_KEY"],
	"github-copilot": [
		"COPILOT_GITHUB_TOKEN",
		"GH_TOKEN",
		"GITHUB_TOKEN"
	],
	google: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
	huggingface: ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"],
	kilocode: ["KILOCODE_API_KEY"],
	kimi: ["KIMI_API_KEY", "KIMICODE_API_KEY"],
	"kimi-coding": ["KIMI_API_KEY", "KIMICODE_API_KEY"],
	litellm: ["LITELLM_API_KEY"],
	"microsoft-foundry": ["AZURE_OPENAI_API_KEY"],
	minimax: ["MINIMAX_API_KEY"],
	"minimax-portal": ["MINIMAX_OAUTH_TOKEN", "MINIMAX_API_KEY"],
	mistral: ["MISTRAL_API_KEY"],
	modelstudio: ["MODELSTUDIO_API_KEY"],
	moonshot: ["MOONSHOT_API_KEY"],
	nvidia: ["NVIDIA_API_KEY"],
	ollama: ["OLLAMA_API_KEY"],
	openai: ["OPENAI_API_KEY"],
	opencode: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
	"opencode-go": ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
	openrouter: ["OPENROUTER_API_KEY"],
	perplexity: ["PERPLEXITY_API_KEY", "OPENROUTER_API_KEY"],
	qianfan: ["QIANFAN_API_KEY"],
	sglang: ["SGLANG_API_KEY"],
	synthetic: ["SYNTHETIC_API_KEY"],
	tavily: ["TAVILY_API_KEY"],
	together: ["TOGETHER_API_KEY"],
	venice: ["VENICE_API_KEY"],
	"vercel-ai-gateway": ["AI_GATEWAY_API_KEY"],
	vllm: ["VLLM_API_KEY"],
	volcengine: ["VOLCANO_ENGINE_API_KEY"],
	xai: ["XAI_API_KEY"],
	xiaomi: ["XIAOMI_API_KEY"],
	zai: ["ZAI_API_KEY", "Z_AI_API_KEY"]
};
//#endregion
//#region src/secrets/provider-env-vars.ts
const CORE_PROVIDER_AUTH_ENV_VAR_CANDIDATES = {
	chutes: ["CHUTES_OAUTH_TOKEN", "CHUTES_API_KEY"],
	voyage: ["VOYAGE_API_KEY"],
	groq: ["GROQ_API_KEY"],
	deepgram: ["DEEPGRAM_API_KEY"],
	cerebras: ["CEREBRAS_API_KEY"],
	litellm: ["LITELLM_API_KEY"]
};
const CORE_PROVIDER_SETUP_ENV_VAR_OVERRIDES = {
	anthropic: ["ANTHROPIC_API_KEY", "ANTHROPIC_OAUTH_TOKEN"],
	chutes: ["CHUTES_API_KEY", "CHUTES_OAUTH_TOKEN"],
	"minimax-cn": ["MINIMAX_API_KEY"]
};
/**
* Provider auth env candidates used by generic auth resolution.
*
* Order matters: the first non-empty value wins for helpers such as
* `resolveEnvApiKey()`. Bundled providers source this from plugin manifest
* metadata so auth probes do not need to load plugin runtime.
*/
const PROVIDER_AUTH_ENV_VAR_CANDIDATES = {
	...BUNDLED_PROVIDER_AUTH_ENV_VAR_CANDIDATES,
	...CORE_PROVIDER_AUTH_ENV_VAR_CANDIDATES
};
/**
* Provider env vars used for setup/default secret refs and broad secret
* scrubbing. This can include non-model providers and may intentionally choose
* a different preferred first env var than auth resolution.
*
* Bundled provider auth envs come from plugin manifests. The override map here
* is only for true core/non-plugin providers and a few setup-specific ordering
* overrides where generic onboarding wants a different preferred env var.
*/
const PROVIDER_ENV_VARS = {
	...PROVIDER_AUTH_ENV_VAR_CANDIDATES,
	...CORE_PROVIDER_SETUP_ENV_VAR_OVERRIDES
};
function getProviderEnvVars(providerId) {
	const envVars = Object.hasOwn(PROVIDER_ENV_VARS, providerId) ? PROVIDER_ENV_VARS[providerId] : void 0;
	return Array.isArray(envVars) ? [...envVars] : [];
}
const EXTRA_PROVIDER_AUTH_ENV_VARS = ["MINIMAX_CODE_PLAN_KEY"];
const KNOWN_SECRET_ENV_VARS = [...new Set(Object.values(PROVIDER_ENV_VARS).flatMap((keys) => keys))];
const KNOWN_PROVIDER_AUTH_ENV_VARS = [...new Set([
	...Object.values(PROVIDER_AUTH_ENV_VAR_CANDIDATES).flatMap((keys) => keys),
	...KNOWN_SECRET_ENV_VARS,
	...EXTRA_PROVIDER_AUTH_ENV_VARS
])];
function listKnownProviderAuthEnvVarNames() {
	return [...KNOWN_PROVIDER_AUTH_ENV_VARS];
}
function listKnownSecretEnvVarNames() {
	return [...KNOWN_SECRET_ENV_VARS];
}
function omitEnvKeysCaseInsensitive(baseEnv, keys) {
	const env = { ...baseEnv };
	const denied = /* @__PURE__ */ new Set();
	for (const key of keys) {
		const normalizedKey = key.trim();
		if (normalizedKey) denied.add(normalizedKey.toUpperCase());
	}
	if (denied.size === 0) return env;
	for (const actualKey of Object.keys(env)) if (denied.has(actualKey.toUpperCase())) delete env[actualKey];
	return env;
}
//#endregion
export { omitEnvKeysCaseInsensitive as a, listKnownSecretEnvVarNames as i, getProviderEnvVars as n, listKnownProviderAuthEnvVarNames as r, PROVIDER_AUTH_ENV_VAR_CANDIDATES as t };
