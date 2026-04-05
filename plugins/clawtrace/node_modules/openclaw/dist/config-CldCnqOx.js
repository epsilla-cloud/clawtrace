import fsSync from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
//#region extensions/memory-lancedb/config.ts
const MEMORY_CATEGORIES = [
	"preference",
	"fact",
	"decision",
	"entity",
	"other"
];
const DEFAULT_MODEL = "text-embedding-3-small";
const DEFAULT_CAPTURE_MAX_CHARS = 500;
const LEGACY_STATE_DIRS = [];
function resolveDefaultDbPath() {
	const home = homedir();
	const preferred = join(home, ".openclaw", "memory", "lancedb");
	try {
		if (fsSync.existsSync(preferred)) return preferred;
	} catch {}
	for (const legacy of LEGACY_STATE_DIRS) {
		const candidate = join(home, legacy, "memory", "lancedb");
		try {
			if (fsSync.existsSync(candidate)) return candidate;
		} catch {}
	}
	return preferred;
}
const DEFAULT_DB_PATH = resolveDefaultDbPath();
const EMBEDDING_DIMENSIONS = {
	"text-embedding-3-small": 1536,
	"text-embedding-3-large": 3072
};
function assertAllowedKeys(value, allowed, label) {
	const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
	if (unknown.length === 0) return;
	throw new Error(`${label} has unknown keys: ${unknown.join(", ")}`);
}
function vectorDimsForModel(model) {
	const dims = EMBEDDING_DIMENSIONS[model];
	if (!dims) throw new Error(`Unsupported embedding model: ${model}`);
	return dims;
}
function resolveEnvVars(value) {
	return value.replace(/\$\{([^}]+)\}/g, (_, envVar) => {
		const envValue = process.env[envVar];
		if (!envValue) throw new Error(`Environment variable ${envVar} is not set`);
		return envValue;
	});
}
function resolveEmbeddingModel(embedding) {
	const model = typeof embedding.model === "string" ? embedding.model : DEFAULT_MODEL;
	if (typeof embedding.dimensions !== "number") vectorDimsForModel(model);
	return model;
}
const memoryConfigSchema = {
	parse(value) {
		if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("memory config required");
		const cfg = value;
		assertAllowedKeys(cfg, [
			"embedding",
			"dbPath",
			"autoCapture",
			"autoRecall",
			"captureMaxChars"
		], "memory config");
		const embedding = cfg.embedding;
		if (!embedding || typeof embedding.apiKey !== "string") throw new Error("embedding.apiKey is required");
		assertAllowedKeys(embedding, [
			"apiKey",
			"model",
			"baseUrl",
			"dimensions"
		], "embedding config");
		const model = resolveEmbeddingModel(embedding);
		const captureMaxChars = typeof cfg.captureMaxChars === "number" ? Math.floor(cfg.captureMaxChars) : void 0;
		if (typeof captureMaxChars === "number" && (captureMaxChars < 100 || captureMaxChars > 1e4)) throw new Error("captureMaxChars must be between 100 and 10000");
		return {
			embedding: {
				provider: "openai",
				model,
				apiKey: resolveEnvVars(embedding.apiKey),
				baseUrl: typeof embedding.baseUrl === "string" ? resolveEnvVars(embedding.baseUrl) : void 0,
				dimensions: typeof embedding.dimensions === "number" ? embedding.dimensions : void 0
			},
			dbPath: typeof cfg.dbPath === "string" ? cfg.dbPath : DEFAULT_DB_PATH,
			autoCapture: cfg.autoCapture === true,
			autoRecall: cfg.autoRecall !== false,
			captureMaxChars: captureMaxChars ?? 500
		};
	},
	uiHints: {
		"embedding.apiKey": {
			label: "OpenAI API Key",
			sensitive: true,
			placeholder: "sk-proj-...",
			help: "API key for OpenAI embeddings (or use ${OPENAI_API_KEY})"
		},
		"embedding.baseUrl": {
			label: "Base URL",
			placeholder: "https://api.openai.com/v1",
			help: "Base URL for compatible providers (e.g. http://localhost:11434/v1)",
			advanced: true
		},
		"embedding.dimensions": {
			label: "Dimensions",
			placeholder: "1536",
			help: "Vector dimensions for custom models (required for non-standard models)",
			advanced: true
		},
		"embedding.model": {
			label: "Embedding Model",
			placeholder: DEFAULT_MODEL,
			help: "OpenAI embedding model to use"
		},
		dbPath: {
			label: "Database Path",
			placeholder: "~/.openclaw/memory/lancedb",
			advanced: true
		},
		autoCapture: {
			label: "Auto-Capture",
			help: "Automatically capture important information from conversations"
		},
		autoRecall: {
			label: "Auto-Recall",
			help: "Automatically inject relevant memories into context"
		},
		captureMaxChars: {
			label: "Capture Max Chars",
			help: "Maximum message length eligible for auto-capture",
			advanced: true,
			placeholder: String(500)
		}
	}
};
//#endregion
export { vectorDimsForModel as i, MEMORY_CATEGORIES as n, memoryConfigSchema as r, DEFAULT_CAPTURE_MAX_CHARS as t };
