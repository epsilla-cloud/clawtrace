export { resolveEnvApiKey } from "../agents/model-auth-env.js";
export { requireApiKey, resolveAwsSdkEnvVarName, type ResolvedProviderAuth, } from "../agents/model-auth-runtime-shared.js";
type ResolveApiKeyForProvider = typeof import("../agents/model-auth.js").resolveApiKeyForProvider;
export declare function resolveApiKeyForProvider(params: Parameters<ResolveApiKeyForProvider>[0]): Promise<Awaited<ReturnType<ResolveApiKeyForProvider>>>;
