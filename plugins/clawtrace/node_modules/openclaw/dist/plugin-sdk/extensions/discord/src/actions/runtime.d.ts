import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import { type OpenClawConfig } from "../runtime-api.js";
export declare function handleDiscordAction(params: Record<string, unknown>, cfg: OpenClawConfig, options?: {
    mediaLocalRoots?: readonly string[];
}): Promise<AgentToolResult<unknown>>;
