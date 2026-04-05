import { type BrowserServerState } from "./browser/server-context.js";
export declare function startBrowserControlServerFromConfig(): Promise<BrowserServerState | null>;
export declare function stopBrowserControlServer(): Promise<void>;
