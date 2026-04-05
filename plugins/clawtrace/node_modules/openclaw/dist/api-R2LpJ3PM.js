import { t as applyAgentDefaultModelPrimary } from "./provider-onboard-B0AuPavZ.js";
import { o as upsertAuthProfileWithLock } from "./profiles-BPdDUT-J.js";
import { n as WizardCancelledError } from "./setup-Fad77i7o.js";
import "./provider-auth-Bd38MUDZ.js";
import { h as OLLAMA_DEFAULT_BASE_URL, y as OLLAMA_DEFAULT_MODEL } from "./stream-CBdzTVlm.js";
import { n as enrichOllamaModelsWithContext, o as resolveOllamaApiBase, r as fetchOllamaModels, t as buildOllamaModelDefinition } from "./provider-models-Dif3K415.js";
//#region extensions/ollama/src/setup.ts
const OLLAMA_SUGGESTED_MODELS_LOCAL = [OLLAMA_DEFAULT_MODEL];
const OLLAMA_SUGGESTED_MODELS_CLOUD = [
	"kimi-k2.5:cloud",
	"minimax-m2.5:cloud",
	"glm-5:cloud"
];
const OLLAMA_CONTEXT_ENRICH_LIMIT = 200;
function normalizeOllamaModelName(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	if (trimmed.toLowerCase().startsWith("ollama/")) return trimmed.slice(7).trim() || void 0;
	return trimmed;
}
function isOllamaCloudModel(modelName) {
	return Boolean(modelName?.trim().toLowerCase().endsWith(":cloud"));
}
function formatOllamaPullStatus(status) {
	const trimmed = status.trim();
	const partStatusMatch = trimmed.match(/^([a-z-]+)\s+(?:sha256:)?[a-f0-9]{8,}$/i);
	if (partStatusMatch) return {
		text: `${partStatusMatch[1]} part`,
		hidePercent: false
	};
	if (/^verifying\b.*\bdigest\b/i.test(trimmed)) return {
		text: "verifying digest",
		hidePercent: true
	};
	return {
		text: trimmed,
		hidePercent: false
	};
}
async function checkOllamaCloudAuth(baseUrl) {
	try {
		const apiBase = resolveOllamaApiBase(baseUrl);
		const response = await fetch(`${apiBase}/api/me`, {
			method: "POST",
			signal: AbortSignal.timeout(5e3)
		});
		if (response.status === 401) return {
			signedIn: false,
			signinUrl: (await response.json()).signin_url
		};
		if (!response.ok) return { signedIn: false };
		return { signedIn: true };
	} catch {
		return { signedIn: false };
	}
}
async function pullOllamaModelCore(params) {
	const baseUrl = resolveOllamaApiBase(params.baseUrl);
	const modelName = normalizeOllamaModelName(params.modelName) ?? params.modelName.trim();
	try {
		const response = await fetch(`${baseUrl}/api/pull`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: modelName })
		});
		if (!response.ok) return {
			ok: false,
			message: `Failed to download ${modelName} (HTTP ${response.status})`
		};
		if (!response.body) return {
			ok: false,
			message: `Failed to download ${modelName} (no response body)`
		};
		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let buffer = "";
		const layers = /* @__PURE__ */ new Map();
		const parseLine = (line) => {
			const trimmed = line.trim();
			if (!trimmed) return { ok: true };
			try {
				const chunk = JSON.parse(trimmed);
				if (chunk.error) return {
					ok: false,
					message: `Download failed: ${chunk.error}`
				};
				if (!chunk.status) return { ok: true };
				if (chunk.total && chunk.completed !== void 0) {
					layers.set(chunk.status, {
						total: chunk.total,
						completed: chunk.completed
					});
					let totalSum = 0;
					let completedSum = 0;
					for (const layer of layers.values()) {
						totalSum += layer.total;
						completedSum += layer.completed;
					}
					params.onStatus?.(chunk.status, totalSum > 0 ? Math.round(completedSum / totalSum * 100) : null);
				} else params.onStatus?.(chunk.status, null);
			} catch {}
			return { ok: true };
		};
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";
			for (const line of lines) {
				const parsed = parseLine(line);
				if (!parsed.ok) return parsed;
			}
		}
		const trailing = buffer.trim();
		if (trailing) {
			const parsed = parseLine(trailing);
			if (!parsed.ok) return parsed;
		}
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			message: `Failed to download ${modelName}: ${err instanceof Error ? err.message : String(err)}`
		};
	}
}
async function pullOllamaModel(baseUrl, modelName, prompter) {
	const spinner = prompter.progress(`Downloading ${modelName}...`);
	const result = await pullOllamaModelCore({
		baseUrl,
		modelName,
		onStatus: (status, percent) => {
			const displayStatus = formatOllamaPullStatus(status);
			if (displayStatus.hidePercent) spinner.update(`Downloading ${modelName} - ${displayStatus.text}`);
			else spinner.update(`Downloading ${modelName} - ${displayStatus.text} - ${percent ?? 0}%`);
		}
	});
	if (!result.ok) {
		spinner.stop(result.message);
		return false;
	}
	spinner.stop(`Downloaded ${modelName}`);
	return true;
}
async function pullOllamaModelNonInteractive(baseUrl, modelName, runtime) {
	runtime.log(`Downloading ${modelName}...`);
	const result = await pullOllamaModelCore({
		baseUrl,
		modelName
	});
	if (!result.ok) {
		runtime.error(result.message);
		return false;
	}
	runtime.log(`Downloaded ${modelName}`);
	return true;
}
function buildOllamaModelsConfig(modelNames, discoveredModelsByName) {
	return modelNames.map((name) => buildOllamaModelDefinition(name, discoveredModelsByName?.get(name)?.contextWindow));
}
function applyOllamaProviderConfig(cfg, baseUrl, modelNames, discoveredModelsByName) {
	return {
		...cfg,
		models: {
			...cfg.models,
			mode: cfg.models?.mode ?? "merge",
			providers: {
				...cfg.models?.providers,
				ollama: {
					baseUrl,
					api: "ollama",
					apiKey: "OLLAMA_API_KEY",
					models: buildOllamaModelsConfig(modelNames, discoveredModelsByName)
				}
			}
		}
	};
}
async function storeOllamaCredential(agentDir) {
	await upsertAuthProfileWithLock({
		profileId: "ollama:default",
		credential: {
			type: "api_key",
			provider: "ollama",
			key: "ollama-local"
		},
		agentDir
	});
}
async function buildOllamaProvider(configuredBaseUrl, opts) {
	const apiBase = resolveOllamaApiBase(configuredBaseUrl);
	const { reachable, models } = await fetchOllamaModels(apiBase);
	if (!reachable && !opts?.quiet) console.warn(`Ollama could not be reached at ${apiBase}.`);
	return {
		baseUrl: apiBase,
		api: "ollama",
		models: (await enrichOllamaModelsWithContext(apiBase, models.slice(0, OLLAMA_CONTEXT_ENRICH_LIMIT))).map((model) => buildOllamaModelDefinition(model.name, model.contextWindow))
	};
}
async function promptAndConfigureOllama(params) {
	const baseUrlRaw = await params.prompter.text({
		message: "Ollama base URL",
		initialValue: OLLAMA_DEFAULT_BASE_URL,
		placeholder: OLLAMA_DEFAULT_BASE_URL,
		validate: (value) => value?.trim() ? void 0 : "Required"
	});
	const baseUrl = resolveOllamaApiBase(String(baseUrlRaw ?? "").trim().replace(/\/+$/, ""));
	const { reachable, models } = await fetchOllamaModels(baseUrl);
	if (!reachable) {
		await params.prompter.note([
			`Ollama could not be reached at ${baseUrl}.`,
			"Download it at https://ollama.com/download",
			"",
			"Start Ollama and re-run setup."
		].join("\n"), "Ollama");
		throw new WizardCancelledError("Ollama not reachable");
	}
	const enrichedModels = await enrichOllamaModelsWithContext(baseUrl, models.slice(0, OLLAMA_CONTEXT_ENRICH_LIMIT));
	const discoveredModelsByName = new Map(enrichedModels.map((model) => [model.name, model]));
	const modelNames = models.map((model) => model.name);
	const mode = await params.prompter.select({
		message: "Ollama mode",
		options: [{
			value: "remote",
			label: "Cloud + Local",
			hint: "Ollama cloud models + local models"
		}, {
			value: "local",
			label: "Local",
			hint: "Local models only"
		}]
	});
	let cloudAuthVerified = false;
	if (mode === "remote") {
		const authResult = await checkOllamaCloudAuth(baseUrl);
		if (!authResult.signedIn) if (authResult.signinUrl) {
			if (!params.isRemote) await params.openUrl(authResult.signinUrl);
			await params.prompter.note(["Sign in to Ollama Cloud:", authResult.signinUrl].join("\n"), "Ollama Cloud");
			if (!await params.prompter.confirm({ message: "Have you signed in?" })) throw new WizardCancelledError("Ollama cloud sign-in cancelled");
			if (!(await checkOllamaCloudAuth(baseUrl)).signedIn) throw new WizardCancelledError("Ollama cloud sign-in required");
			cloudAuthVerified = true;
		} else {
			await params.prompter.note(["Could not verify Ollama Cloud authentication.", "Cloud models may not work until you sign in at https://ollama.com."].join("\n"), "Ollama Cloud");
			if (!await params.prompter.confirm({ message: "Continue without cloud auth?" })) throw new WizardCancelledError("Ollama cloud auth could not be verified");
		}
		else cloudAuthVerified = true;
	}
	const suggestedModels = mode === "local" || !cloudAuthVerified ? OLLAMA_SUGGESTED_MODELS_LOCAL : OLLAMA_SUGGESTED_MODELS_CLOUD;
	const orderedModelNames = [...suggestedModels, ...modelNames.filter((name) => !suggestedModels.includes(name))];
	return { config: applyOllamaProviderConfig(params.cfg, baseUrl, orderedModelNames, discoveredModelsByName) };
}
async function configureOllamaNonInteractive(params) {
	const baseUrl = resolveOllamaApiBase((params.opts.customBaseUrl?.trim() || "http://127.0.0.1:11434").replace(/\/+$/, ""));
	const { reachable, models } = await fetchOllamaModels(baseUrl);
	const explicitModel = normalizeOllamaModelName(params.opts.customModelId);
	if (!reachable) {
		params.runtime.error([`Ollama could not be reached at ${baseUrl}.`, "Download it at https://ollama.com/download"].join("\n"));
		params.runtime.exit(1);
		return params.nextConfig;
	}
	await storeOllamaCredential(params.agentDir);
	const enrichedModels = await enrichOllamaModelsWithContext(baseUrl, models.slice(0, OLLAMA_CONTEXT_ENRICH_LIMIT));
	const discoveredModelsByName = new Map(enrichedModels.map((model) => [model.name, model]));
	const modelNames = models.map((model) => model.name);
	const orderedModelNames = [...OLLAMA_SUGGESTED_MODELS_LOCAL, ...modelNames.filter((name) => !OLLAMA_SUGGESTED_MODELS_LOCAL.includes(name))];
	const requestedDefaultModelId = explicitModel ?? OLLAMA_SUGGESTED_MODELS_LOCAL[0];
	const availableModelNames = new Set(modelNames);
	const requestedCloudModel = isOllamaCloudModel(requestedDefaultModelId);
	let pulledRequestedModel = false;
	if (requestedCloudModel) availableModelNames.add(requestedDefaultModelId);
	else if (!modelNames.includes(requestedDefaultModelId)) {
		pulledRequestedModel = await pullOllamaModelNonInteractive(baseUrl, requestedDefaultModelId, params.runtime);
		if (pulledRequestedModel) availableModelNames.add(requestedDefaultModelId);
	}
	let allModelNames = orderedModelNames;
	let defaultModelId = requestedDefaultModelId;
	if ((pulledRequestedModel || requestedCloudModel) && !allModelNames.includes(requestedDefaultModelId)) allModelNames = [...allModelNames, requestedDefaultModelId];
	if (!availableModelNames.has(requestedDefaultModelId)) {
		if (availableModelNames.size === 0) {
			params.runtime.error([`No Ollama models are available at ${baseUrl}.`, "Pull a model first, then re-run setup."].join("\n"));
			params.runtime.exit(1);
			return params.nextConfig;
		}
		defaultModelId = allModelNames.find((name) => availableModelNames.has(name)) ?? Array.from(availableModelNames)[0];
		params.runtime.log(`Ollama model ${requestedDefaultModelId} was not available; using ${defaultModelId} instead.`);
	}
	const config = applyOllamaProviderConfig(params.nextConfig, baseUrl, allModelNames, discoveredModelsByName);
	params.runtime.log(`Default Ollama model: ${defaultModelId}`);
	return applyAgentDefaultModelPrimary(config, `ollama/${defaultModelId}`);
}
async function ensureOllamaModelPulled(params) {
	if (!params.model.startsWith("ollama/")) return;
	const baseUrl = params.config.models?.providers?.ollama?.baseUrl ?? "http://127.0.0.1:11434";
	const modelName = params.model.slice(7);
	if (isOllamaCloudModel(modelName)) return;
	const { models } = await fetchOllamaModels(baseUrl);
	if (models.some((model) => model.name === modelName)) return;
	if (!await pullOllamaModel(baseUrl, modelName, params.prompter)) throw new WizardCancelledError("Failed to download selected Ollama model");
}
//#endregion
export { promptAndConfigureOllama as i, configureOllamaNonInteractive as n, ensureOllamaModelPulled as r, buildOllamaProvider as t };
