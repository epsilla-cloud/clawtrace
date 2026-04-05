import { type BrowserServerState } from "./browser/server-context.js";
export declare function getBrowserControlState(): BrowserServerState | null;
export declare function createBrowserControlContext(): import("./browser/server-context.types.ts").BrowserRouteContext;
export declare function startBrowserControlServiceFromConfig(): Promise<BrowserServerState | null>;
export declare function stopBrowserControlService(): Promise<void>;
