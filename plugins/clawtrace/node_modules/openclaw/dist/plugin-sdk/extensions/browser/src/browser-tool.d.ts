import { type AnyAgentTool, browserAct, browserArmDialog, browserArmFileChooser, browserCloseTab, browserFocusTab, browserNavigate, browserOpenTab, browserPdfSave, browserProfiles, browserScreenshotAction, browserStart, browserStatus, browserStop, imageResultFromFile, listNodes, loadConfig, trackSessionBrowserTab, untrackSessionBrowserTab } from "./core-api.js";
import { callGatewayTool } from "./core-api.js";
export declare const __testing: {
    setDepsForTest(overrides: Partial<{
        browserAct: typeof browserAct;
        browserArmDialog: typeof browserArmDialog;
        browserArmFileChooser: typeof browserArmFileChooser;
        browserCloseTab: typeof browserCloseTab;
        browserFocusTab: typeof browserFocusTab;
        browserNavigate: typeof browserNavigate;
        browserOpenTab: typeof browserOpenTab;
        browserPdfSave: typeof browserPdfSave;
        browserProfiles: typeof browserProfiles;
        browserScreenshotAction: typeof browserScreenshotAction;
        browserStart: typeof browserStart;
        browserStatus: typeof browserStatus;
        browserStop: typeof browserStop;
        imageResultFromFile: typeof imageResultFromFile;
        loadConfig: typeof loadConfig;
        listNodes: typeof listNodes;
        callGatewayTool: typeof callGatewayTool;
        trackSessionBrowserTab: typeof trackSessionBrowserTab;
        untrackSessionBrowserTab: typeof untrackSessionBrowserTab;
    }> | null): void;
};
export declare function createBrowserTool(opts?: {
    sandboxBridgeUrl?: string;
    allowHostControl?: boolean;
    agentSessionKey?: string;
}): AnyAgentTool;
