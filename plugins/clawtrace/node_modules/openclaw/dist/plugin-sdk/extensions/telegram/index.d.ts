import type { ChannelPlugin } from "openclaw/plugin-sdk/core";
export { telegramPlugin } from "./src/channel.js";
export { setTelegramRuntime } from "./src/runtime.js";
declare const _default: {
    id: string;
    name: string;
    description: string;
    configSchema: import("openclaw/plugin-sdk/core").OpenClawPluginConfigSchema;
    register: (api: import("openclaw/plugin-sdk/core").OpenClawPluginApi) => void;
    channelPlugin: ChannelPlugin;
    setChannelRuntime?: (runtime: import("openclaw/plugin-sdk/core").PluginRuntime) => void;
};
export default _default;
