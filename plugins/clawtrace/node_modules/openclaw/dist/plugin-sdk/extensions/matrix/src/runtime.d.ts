import type { PluginRuntime } from "./runtime-api.js";
declare const setMatrixRuntime: (next: PluginRuntime) => void, getMatrixRuntime: () => PluginRuntime;
export { getMatrixRuntime, setMatrixRuntime };
