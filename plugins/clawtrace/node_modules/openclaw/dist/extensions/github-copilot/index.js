import { n as ensureAuthProfileStore } from "../../store-BpAvd-ka.js";
import { i as coerceSecretRef } from "../../types.secrets-Rqz2qv-w.js";
import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { n as listProfilesForProvider } from "../../profiles-BPdDUT-J.js";
import "../../provider-auth-Bd38MUDZ.js";
import { r as resolveCopilotApiToken, t as DEFAULT_COPILOT_API_BASE_URL } from "../../github-copilot-token-Be9GQ0Nm.js";
import { t as githubCopilotLoginCommand } from "../../provider-auth-login-NswR3Iwy.js";
import { n as resolveCopilotForwardCompatModel, t as PROVIDER_ID } from "../../models-DShoaYMg.js";
import "../../token-C8H8fI9Q.js";
import { t as fetchCopilotUsage } from "../../usage-DLRV_xyV.js";
//#region extensions/github-copilot/index.ts
const COPILOT_ENV_VARS = [
	"COPILOT_GITHUB_TOKEN",
	"GH_TOKEN",
	"GITHUB_TOKEN"
];
const COPILOT_XHIGH_MODEL_IDS = ["gpt-5.2", "gpt-5.2-codex"];
function resolveFirstGithubToken(params) {
	const authStore = ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false });
	const hasProfile = listProfilesForProvider(authStore, PROVIDER_ID).length > 0;
	const githubToken = (params.env.COPILOT_GITHUB_TOKEN ?? params.env.GH_TOKEN ?? params.env.GITHUB_TOKEN ?? "").trim();
	if (githubToken || !hasProfile) return {
		githubToken,
		hasProfile
	};
	const profileId = listProfilesForProvider(authStore, PROVIDER_ID)[0];
	const profile = profileId ? authStore.profiles[profileId] : void 0;
	if (profile?.type !== "token") return {
		githubToken: "",
		hasProfile
	};
	const directToken = profile.token?.trim() ?? "";
	if (directToken) return {
		githubToken: directToken,
		hasProfile
	};
	const tokenRef = coerceSecretRef(profile.tokenRef);
	if (tokenRef?.source === "env" && tokenRef.id.trim()) return {
		githubToken: (params.env[tokenRef.id] ?? process.env[tokenRef.id] ?? "").trim(),
		hasProfile
	};
	return {
		githubToken: "",
		hasProfile
	};
}
async function runGitHubCopilotAuth(ctx) {
	await ctx.prompter.note(["This will open a GitHub device login to authorize Copilot.", "Requires an active GitHub Copilot subscription."].join("\n"), "GitHub Copilot");
	if (!process.stdin.isTTY) {
		await ctx.prompter.note("GitHub Copilot login requires an interactive TTY.", "GitHub Copilot");
		return { profiles: [] };
	}
	try {
		await githubCopilotLoginCommand({
			yes: true,
			profileId: "github-copilot:github"
		}, ctx.runtime);
	} catch (err) {
		await ctx.prompter.note(`GitHub Copilot login failed: ${String(err)}`, "GitHub Copilot");
		return { profiles: [] };
	}
	const credential = ensureAuthProfileStore(void 0, { allowKeychainPrompt: false }).profiles["github-copilot:github"];
	if (!credential || credential.type !== "token") return { profiles: [] };
	return {
		profiles: [{
			profileId: "github-copilot:github",
			credential
		}],
		defaultModel: "github-copilot/gpt-4o"
	};
}
var github_copilot_default = definePluginEntry({
	id: "github-copilot",
	name: "GitHub Copilot Provider",
	description: "Bundled GitHub Copilot provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "GitHub Copilot",
			docsPath: "/providers/models",
			envVars: COPILOT_ENV_VARS,
			auth: [{
				id: "device",
				label: "GitHub device login",
				hint: "Browser device-code flow",
				kind: "device_code",
				run: async (ctx) => await runGitHubCopilotAuth(ctx)
			}],
			wizard: { setup: {
				choiceId: "github-copilot",
				choiceLabel: "GitHub Copilot",
				choiceHint: "Device login with your GitHub account",
				methodId: "device"
			} },
			catalog: {
				order: "late",
				run: async (ctx) => {
					const { githubToken, hasProfile } = resolveFirstGithubToken({
						agentDir: ctx.agentDir,
						env: ctx.env
					});
					if (!hasProfile && !githubToken) return null;
					let baseUrl = DEFAULT_COPILOT_API_BASE_URL;
					if (githubToken) try {
						baseUrl = (await resolveCopilotApiToken({
							githubToken,
							env: ctx.env
						})).baseUrl;
					} catch {
						baseUrl = DEFAULT_COPILOT_API_BASE_URL;
					}
					return { provider: {
						baseUrl,
						models: []
					} };
				}
			},
			resolveDynamicModel: (ctx) => resolveCopilotForwardCompatModel(ctx),
			capabilities: { dropThinkingBlockModelHints: ["claude"] },
			supportsXHighThinking: ({ modelId }) => COPILOT_XHIGH_MODEL_IDS.includes(modelId.trim().toLowerCase()),
			prepareRuntimeAuth: async (ctx) => {
				const token = await resolveCopilotApiToken({
					githubToken: ctx.apiKey,
					env: ctx.env
				});
				return {
					apiKey: token.token,
					baseUrl: token.baseUrl,
					expiresAt: token.expiresAt
				};
			},
			resolveUsageAuth: async (ctx) => await ctx.resolveOAuthToken(),
			fetchUsageSnapshot: async (ctx) => await fetchCopilotUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn)
		});
	}
});
//#endregion
export { github_copilot_default as default };
