import type { PluginRuntime } from "./runtime-api.js";
declare const setMattermostRuntime: (next: PluginRuntime) => void, getMattermostRuntime: () => PluginRuntime;
export { getMattermostRuntime, setMattermostRuntime };
