import type { PluginRuntime } from "./runtime-api.js";
declare const setIrcRuntime: (next: PluginRuntime) => void, getIrcRuntime: () => PluginRuntime;
export { getIrcRuntime, setIrcRuntime };
export declare function clearIrcRuntime(): void;
