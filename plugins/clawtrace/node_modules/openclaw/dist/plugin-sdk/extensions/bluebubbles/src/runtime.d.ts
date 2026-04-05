import type { PluginRuntime } from "./runtime-api.js";
export declare const setBlueBubblesRuntime: (next: PluginRuntime) => void;
export declare function clearBlueBubblesRuntime(): void;
export declare function tryGetBlueBubblesRuntime(): PluginRuntime | null;
export declare function getBlueBubblesRuntime(): PluginRuntime;
export declare function warnBlueBubbles(message: string): void;
