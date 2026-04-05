import type { OpenClawConfig } from "../../config/config.js";
import type { CliBackendConfig } from "../../config/types.js";
type PreparedCliBundleMcpConfig = {
    backend: CliBackendConfig;
    cleanup?: () => Promise<void>;
    mcpConfigHash?: string;
};
export declare function prepareCliBundleMcpConfig(params: {
    enabled: boolean;
    backend: CliBackendConfig;
    workspaceDir: string;
    config?: OpenClawConfig;
    warn?: (message: string) => void;
}): Promise<PreparedCliBundleMcpConfig>;
export {};
