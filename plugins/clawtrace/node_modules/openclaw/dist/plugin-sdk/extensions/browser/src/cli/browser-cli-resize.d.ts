import { type BrowserParentOpts } from "./browser-cli-shared.js";
export declare function runBrowserResizeWithOutput(params: {
    parent: BrowserParentOpts;
    profile?: string;
    width: number;
    height: number;
    targetId?: string;
    timeoutMs?: number;
    successMessage: string;
}): Promise<void>;
