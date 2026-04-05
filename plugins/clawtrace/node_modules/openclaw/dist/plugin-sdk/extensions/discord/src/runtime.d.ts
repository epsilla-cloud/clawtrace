import type { PluginRuntime } from "openclaw/plugin-sdk/core";
declare const setDiscordRuntime: (next: PluginRuntime) => void, getDiscordRuntime: () => PluginRuntime;
export { getDiscordRuntime, setDiscordRuntime };
