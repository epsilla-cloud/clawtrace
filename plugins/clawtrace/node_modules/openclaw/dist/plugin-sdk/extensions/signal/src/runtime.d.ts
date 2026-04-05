import type { PluginRuntime } from "openclaw/plugin-sdk/core";
declare const setSignalRuntime: (next: PluginRuntime) => void, clearSignalRuntime: () => void, getSignalRuntime: () => PluginRuntime;
export { clearSignalRuntime, getSignalRuntime, setSignalRuntime };
