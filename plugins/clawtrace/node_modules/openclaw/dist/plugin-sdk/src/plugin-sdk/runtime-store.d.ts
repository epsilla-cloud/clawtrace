export type { PluginRuntime } from "../plugins/runtime/types.js";
/** Create a tiny mutable runtime slot with strict access when the runtime has not been initialized. */
export declare function createPluginRuntimeStore<T>(errorMessage: string): {
    setRuntime: (next: T) => void;
    clearRuntime: () => void;
    tryGetRuntime: () => T | null;
    getRuntime: () => T;
};
