import { callGateway } from "../../gateway/call.js";
type GatewayCaller = typeof callGateway;
export declare function readLatestAssistantReply(params: {
    sessionKey: string;
    limit?: number;
}): Promise<string | undefined>;
export declare function runAgentStep(params: {
    sessionKey: string;
    message: string;
    extraSystemPrompt: string;
    timeoutMs: number;
    channel?: string;
    lane?: string;
    sourceSessionKey?: string;
    sourceChannel?: string;
    sourceTool?: string;
}): Promise<string | undefined>;
export declare const __testing: {
    setDepsForTest(overrides?: Partial<{
        callGateway: GatewayCaller;
    }>): void;
};
export {};
