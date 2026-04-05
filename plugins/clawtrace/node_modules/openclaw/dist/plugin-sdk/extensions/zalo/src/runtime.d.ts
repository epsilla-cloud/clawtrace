import type { PluginRuntime } from "./runtime-api.js";
declare const setZaloRuntime: (next: PluginRuntime) => void, getZaloRuntime: () => PluginRuntime;
export { getZaloRuntime, setZaloRuntime };
