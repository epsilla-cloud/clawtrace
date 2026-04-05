import { type CliDeps } from "../cli/deps.js";
import { type RuntimeEnv } from "../runtime.js";
import type { AgentCommandIngressOpts, AgentCommandOpts } from "./command/types.js";
export declare function agentCommand(opts: AgentCommandOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
    payloads: import("../infra/outbound/payloads.ts").OutboundPayloadJson[];
    meta: import("./pi-embedded-runner.ts").EmbeddedPiRunMeta;
}>;
export declare function agentCommandFromIngress(opts: AgentCommandIngressOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
    payloads: import("../infra/outbound/payloads.ts").OutboundPayloadJson[];
    meta: import("./pi-embedded-runner.ts").EmbeddedPiRunMeta;
}>;
