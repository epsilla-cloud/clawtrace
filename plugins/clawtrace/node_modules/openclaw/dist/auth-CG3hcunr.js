import { n as ensureAuthProfileStore } from "./store-BpAvd-ka.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Caby3smH.js";
import { i as ensureApiKeyFromOptionEnvOrPrompt, l as validateApiKeyInput, o as normalizeApiKeyInput } from "./provider-auth-helpers-Cn7_lVDp.js";
import "./provider-auth-Bd38MUDZ.js";
import { b as resolveFoundryApi, c as buildFoundryAuthResult, h as listConfiguredFoundryProfileIds, i as PROVIDER_ID, y as resolveConfiguredModelNameHint } from "./shared-x9RbOMks.js";
import { c as isAzCliInstalled, l as listSubscriptions, s as getLoggedInAccount } from "./cli-DZe1grdn.js";
import { c as promptApiKeyEndpointAndModel, d as selectFoundryDeployment, f as selectFoundryResource, l as promptEndpointAndModelManually, o as listResourceDeployments, p as testFoundryConnection, s as loginWithTenantFallback, u as promptTenantId } from "./onboard-iE_s6O7s.js";
//#region extensions/microsoft-foundry/auth.ts
const entraIdAuthMethod = {
	id: "entra-id",
	label: "Entra ID (az login)",
	hint: "Use your Azure login — no API key needed",
	kind: "custom",
	wizard: {
		choiceId: "microsoft-foundry-entra",
		choiceLabel: "Microsoft Foundry (Entra ID / az login)",
		choiceHint: "Use your Azure login — no API key needed",
		groupId: "microsoft-foundry",
		groupLabel: "Microsoft Foundry",
		groupHint: "Entra ID + API key"
	},
	run: async (ctx) => {
		if (!isAzCliInstalled()) throw new Error("Azure CLI (az) is not installed.\nInstall it from https://learn.microsoft.com/cli/azure/install-azure-cli");
		let account = getLoggedInAccount();
		let tenantId = account?.tenantId;
		if (account) {
			if (!await ctx.prompter.confirm({
				message: `Already logged in as ${account.user?.name ?? "unknown"} (${account.name}). Use this account?`,
				initialValue: true
			})) {
				const loginResult = await loginWithTenantFallback(ctx);
				account = loginResult.account;
				tenantId = loginResult.tenantId ?? loginResult.account?.tenantId;
			}
		} else {
			await ctx.prompter.note("You need to log in to Azure. A device code will be displayed - follow the instructions.", "Azure Login");
			const loginResult = await loginWithTenantFallback(ctx);
			account = loginResult.account;
			tenantId = loginResult.tenantId ?? loginResult.account?.tenantId;
		}
		const subs = listSubscriptions();
		let selectedSub = null;
		if (subs.length === 0) {
			tenantId ??= await promptTenantId(ctx, {
				required: true,
				reason: "No enabled Azure subscriptions were found. Continue with tenant-scoped Entra ID auth instead."
			});
			await ctx.prompter.note(`Continuing with tenant-scoped auth (${tenantId}).`, "Azure Tenant");
		} else if (subs.length === 1) {
			selectedSub = subs[0];
			tenantId ??= selectedSub.tenantId;
			await ctx.prompter.note(`Using subscription: ${selectedSub.name} (${selectedSub.id})`, "Subscription");
		} else {
			const selectedId = await ctx.prompter.select({
				message: "Select Azure subscription",
				options: subs.map((sub) => ({
					value: sub.id,
					label: `${sub.name} (${sub.id})`
				}))
			});
			selectedSub = subs.find((sub) => sub.id === selectedId);
			tenantId ??= selectedSub.tenantId;
		}
		let endpoint;
		let modelId;
		let modelNameHint;
		let api;
		let discoveredDeployments;
		if (selectedSub) if (await ctx.prompter.confirm({
			message: "Discover Microsoft Foundry resources from this subscription?",
			initialValue: true
		})) {
			const selectedResource = await selectFoundryResource(ctx, selectedSub);
			const resourceDeployments = listResourceDeployments(selectedResource, selectedSub.id);
			const selectedDeployment = await selectFoundryDeployment(ctx, selectedResource, resourceDeployments);
			discoveredDeployments = resourceDeployments.map((deployment) => ({
				name: deployment.name,
				...deployment.modelName ? { modelName: deployment.modelName } : {},
				api: resolveFoundryApi(deployment.name, deployment.modelName)
			}));
			endpoint = selectedResource.endpoint;
			modelId = selectedDeployment.name;
			modelNameHint = resolveConfiguredModelNameHint(modelId, selectedDeployment.modelName);
			api = resolveFoundryApi(modelId, modelNameHint);
			await ctx.prompter.note([
				`Resource: ${selectedResource.accountName}`,
				`Endpoint: ${endpoint}`,
				`Deployment: ${modelId}`,
				selectedDeployment.modelName ? `Model: ${selectedDeployment.modelName}` : void 0,
				`API: ${api === "openai-responses" ? "Responses" : "Chat Completions"}`
			].filter(Boolean).join("\n"), "Microsoft Foundry");
		} else ({endpoint, modelId, modelNameHint, api} = await promptEndpointAndModelManually(ctx));
		else ({endpoint, modelId, modelNameHint, api} = await promptEndpointAndModelManually(ctx));
		await testFoundryConnection({
			ctx,
			endpoint,
			modelId,
			modelNameHint,
			api,
			subscriptionId: selectedSub?.id,
			tenantId
		});
		return buildFoundryAuthResult({
			profileId: `${PROVIDER_ID}:entra`,
			apiKey: "__entra_id_dynamic__",
			endpoint,
			modelId,
			modelNameHint,
			api,
			authMethod: "entra-id",
			...selectedSub?.id ? { subscriptionId: selectedSub.id } : {},
			...selectedSub?.name ? { subscriptionName: selectedSub.name } : {},
			...tenantId ? { tenantId } : {},
			currentProviderProfileIds: listConfiguredFoundryProfileIds(ctx.config),
			currentPluginsAllow: ctx.config.plugins?.allow,
			...discoveredDeployments ? { deployments: discoveredDeployments } : {},
			notes: [
				...selectedSub?.name ? [`Subscription: ${selectedSub.name}`] : [],
				...tenantId ? [`Tenant: ${tenantId}`] : [],
				`Endpoint: ${endpoint}`,
				`Model: ${modelId}`,
				"Token is refreshed automatically via az CLI - keep az login active."
			]
		});
	}
};
const apiKeyAuthMethod = {
	id: "api-key",
	label: "Azure OpenAI API key",
	hint: "Direct Azure OpenAI API key",
	kind: "api_key",
	wizard: {
		choiceId: "microsoft-foundry-apikey",
		choiceLabel: "Microsoft Foundry (API key)",
		groupId: "microsoft-foundry",
		groupLabel: "Microsoft Foundry",
		groupHint: "Entra ID + API key"
	},
	run: async (ctx) => {
		const existing = ensureAuthProfileStore(ctx.agentDir, { allowKeychainPrompt: false }).profiles[`${PROVIDER_ID}:default`];
		const existingMetadata = existing?.type === "api_key" ? existing.metadata : void 0;
		let capturedSecretInput;
		let capturedCredential = false;
		let capturedMode;
		await ensureApiKeyFromOptionEnvOrPrompt({
			token: normalizeOptionalSecretInput(ctx.opts?.azureOpenaiApiKey),
			tokenProvider: PROVIDER_ID,
			secretInputMode: ctx.allowSecretRefPrompt === false ? ctx.secretInputMode ?? "plaintext" : ctx.secretInputMode,
			config: ctx.config,
			expectedProviders: [PROVIDER_ID],
			provider: PROVIDER_ID,
			envLabel: "AZURE_OPENAI_API_KEY",
			promptMessage: "Enter Azure OpenAI API key",
			normalize: normalizeApiKeyInput,
			validate: validateApiKeyInput,
			prompter: ctx.prompter,
			setCredential: async (apiKey, mode) => {
				capturedSecretInput = apiKey;
				capturedCredential = true;
				capturedMode = mode;
			}
		});
		if (!capturedCredential) throw new Error("Missing Azure OpenAI API key.");
		const selection = await promptApiKeyEndpointAndModel(ctx);
		return buildFoundryAuthResult({
			profileId: `${PROVIDER_ID}:default`,
			apiKey: capturedSecretInput ?? "",
			...capturedMode ? { secretInputMode: capturedMode } : {},
			endpoint: selection.endpoint,
			modelId: selection.modelId,
			modelNameHint: selection.modelNameHint ?? existingMetadata?.modelName ?? existingMetadata?.modelId,
			api: selection.api,
			authMethod: "api-key",
			currentProviderProfileIds: listConfiguredFoundryProfileIds(ctx.config),
			currentPluginsAllow: ctx.config.plugins?.allow,
			notes: [`Endpoint: ${selection.endpoint}`, `Model: ${selection.modelId}`]
		});
	}
};
//#endregion
export { entraIdAuthMethod as n, apiKeyAuthMethod as t };
