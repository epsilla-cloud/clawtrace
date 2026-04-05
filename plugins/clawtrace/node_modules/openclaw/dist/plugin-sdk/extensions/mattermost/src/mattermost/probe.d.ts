import { type MattermostUser } from "./client.js";
import type { BaseProbeResult } from "./runtime-api.js";
export type MattermostProbe = BaseProbeResult & {
    status?: number | null;
    elapsedMs?: number | null;
    bot?: MattermostUser;
};
export declare function probeMattermost(baseUrl: string, botToken: string, timeoutMs?: number): Promise<MattermostProbe>;
