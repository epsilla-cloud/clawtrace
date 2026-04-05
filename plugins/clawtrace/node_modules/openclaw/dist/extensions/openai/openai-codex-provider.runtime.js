import { n as ensureGlobalUndiciEnvProxyDispatcher } from "../../runtime-env-5bDkE44b.js";
import { getOAuthApiKey as getOAuthApiKey$1, refreshOpenAICodexToken as refreshOpenAICodexToken$1 } from "@mariozechner/pi-ai/oauth";
//#region extensions/openai/openai-codex-provider.runtime.ts
async function getOAuthApiKey(...args) {
	ensureGlobalUndiciEnvProxyDispatcher();
	return await getOAuthApiKey$1(...args);
}
async function refreshOpenAICodexToken(...args) {
	ensureGlobalUndiciEnvProxyDispatcher();
	return await refreshOpenAICodexToken$1(...args);
}
//#endregion
export { getOAuthApiKey, refreshOpenAICodexToken };
