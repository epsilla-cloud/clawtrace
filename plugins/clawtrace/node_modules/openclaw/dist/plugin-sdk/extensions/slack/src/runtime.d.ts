import type { PluginRuntime } from "openclaw/plugin-sdk/core";
declare const setSlackRuntime: (next: PluginRuntime) => void, clearSlackRuntime: () => void, getSlackRuntime: () => PluginRuntime;
export { clearSlackRuntime, getSlackRuntime, setSlackRuntime };
