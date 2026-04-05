export { signalPlugin } from "./src/channel.js";
export { setSignalRuntime } from "./src/runtime.js";
declare const _default: {
    id: string;
    name: string;
    description: string;
    configSchema: import("openclaw/plugin-sdk/core").OpenClawPluginConfigSchema;
    register: (api: import("openclaw/plugin-sdk/core").OpenClawPluginApi) => void;
    channelPlugin: import("openclaw/plugin-sdk/core").ChannelPlugin<import("openclaw/plugin-sdk/signal-surface").ResolvedSignalAccount, import("openclaw/plugin-sdk/signal-surface").SignalProbe>;
    setChannelRuntime?: (runtime: import("openclaw/plugin-sdk/core").PluginRuntime) => void;
};
export default _default;
