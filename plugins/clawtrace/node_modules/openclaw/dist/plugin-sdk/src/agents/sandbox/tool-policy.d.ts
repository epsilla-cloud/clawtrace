import type { OpenClawConfig } from "../../config/config.js";
import type { SandboxToolPolicy, SandboxToolPolicyResolved } from "./types.js";
export declare function classifyToolAgainstSandboxToolPolicy(name: string, policy?: SandboxToolPolicy): {
    blockedByDeny: boolean;
    blockedByAllow: boolean;
};
export declare function isToolAllowed(policy: SandboxToolPolicy, name: string): boolean;
export declare function resolveSandboxToolPolicyForAgent(cfg?: OpenClawConfig, agentId?: string): SandboxToolPolicyResolved;
