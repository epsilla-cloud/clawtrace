export { feishuPlugin } from "./src/channel.js";
export { setFeishuRuntime } from "./src/runtime.js";
export { sendMessageFeishu, sendCardFeishu, updateCardFeishu, editMessageFeishu, getMessageFeishu, } from "./src/send.js";
export { uploadImageFeishu, uploadFileFeishu, sendImageFeishu, sendFileFeishu, sendMediaFeishu, } from "./src/media.js";
export { probeFeishu } from "./src/probe.js";
export { addReactionFeishu, removeReactionFeishu, listReactionsFeishu, FeishuEmoji, } from "./src/reactions.js";
export { extractMentionTargets, extractMessageBody, isMentionForwardRequest, formatMentionForText, formatMentionForCard, formatMentionAllForText, formatMentionAllForCard, buildMentionedMessage, buildMentionedCardContent, type MentionTarget, } from "./src/mention.js";
type MonitorFeishuProvider = typeof import("./src/monitor.js").monitorFeishuProvider;
export declare function monitorFeishuProvider(...args: Parameters<MonitorFeishuProvider>): ReturnType<MonitorFeishuProvider>;
declare const _default: {
    id: string;
    name: string;
    description: string;
    configSchema: import("openclaw/plugin-sdk/core").OpenClawPluginConfigSchema;
    register: (api: import("openclaw/plugin-sdk/core").OpenClawPluginApi) => void;
    channelPlugin: import("openclaw/plugin-sdk/core").ChannelPlugin<import("./src/types.ts").ResolvedFeishuAccount, import("./src/types.ts").FeishuProbeResult>;
    setChannelRuntime?: (runtime: import("openclaw/plugin-sdk/core").PluginRuntime) => void;
};
export default _default;
