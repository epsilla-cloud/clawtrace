import type { OpenClawConfig } from "../config/config.js";
import type { AnyAgentTool } from "./tools/common.js";
type BundleMcpToolRuntime = {
    tools: AnyAgentTool[];
    dispose: () => Promise<void>;
};
export declare function createBundleMcpToolRuntime(params: {
    workspaceDir: string;
    cfg?: OpenClawConfig;
    reservedToolNames?: Iterable<string>;
}): Promise<BundleMcpToolRuntime>;
export {};
