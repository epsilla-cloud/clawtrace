import type { ResolvedMattermostAccount } from "./accounts.js";
import { type MattermostClient } from "./client.js";
import { type OpenClawConfig, type RuntimeEnv } from "./runtime-api.js";
export declare function registerMattermostMonitorSlashCommands(params: {
    client: MattermostClient;
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
    account: ResolvedMattermostAccount;
    baseUrl: string;
    botUserId: string;
}): Promise<void>;
