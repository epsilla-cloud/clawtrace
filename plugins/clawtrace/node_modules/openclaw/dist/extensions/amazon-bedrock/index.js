import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import { a as resolveImplicitBedrockProvider, i as resolveBedrockConfigApiKey, n as mergeImplicitBedrockProvider } from "../../discovery-BHiPq_3d.js";
import "../../api-DNLeUi1u.js";
import { b as createBedrockNoCacheWrapper, x as isAnthropicBedrockModel } from "../../provider-stream-B9iIzaRT.js";
//#region extensions/amazon-bedrock/index.ts
const PROVIDER_ID = "amazon-bedrock";
const CLAUDE_46_MODEL_RE = /claude-(?:opus|sonnet)-4(?:\.|-)6(?:$|[-.])/i;
var amazon_bedrock_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "Amazon Bedrock Provider",
	description: "Bundled Amazon Bedrock provider policy plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "Amazon Bedrock",
			docsPath: "/providers/models",
			auth: [],
			catalog: {
				order: "simple",
				run: async (ctx) => {
					const implicit = await resolveImplicitBedrockProvider({
						config: ctx.config,
						env: ctx.env
					});
					if (!implicit) return null;
					return { provider: mergeImplicitBedrockProvider({
						existing: ctx.config.models?.providers?.[PROVIDER_ID],
						implicit
					}) };
				}
			},
			resolveConfigApiKey: ({ env }) => resolveBedrockConfigApiKey(env),
			wrapStreamFn: ({ modelId, streamFn }) => isAnthropicBedrockModel(modelId) ? streamFn : createBedrockNoCacheWrapper(streamFn),
			resolveDefaultThinkingLevel: ({ modelId }) => CLAUDE_46_MODEL_RE.test(modelId.trim()) ? "adaptive" : void 0
		});
	}
});
//#endregion
export { amazon_bedrock_default as default };
