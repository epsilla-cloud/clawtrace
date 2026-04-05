export { isVerbose, isYes, setVerbose, setYes } from "./global-state.js";
export declare function shouldLogVerbose(): boolean;
export declare function logVerbose(message: string): void;
export declare function logVerboseConsole(message: string): void;
export declare const success: import("chalk").ChalkInstance;
export declare const warn: import("chalk").ChalkInstance;
export declare const info: import("chalk").ChalkInstance;
export declare const danger: import("chalk").ChalkInstance;
