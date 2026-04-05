import type { PluginRuntime } from "../api.js";
declare const setLineRuntime: (next: PluginRuntime) => void, clearLineRuntime: () => void, getLineRuntime: () => PluginRuntime;
export { clearLineRuntime, getLineRuntime, setLineRuntime };
