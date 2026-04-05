import type { CliBackendConfig } from "../config/types.js";
type CliUsage = {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
};
export type CliOutput = {
    text: string;
    sessionId?: string;
    usage?: CliUsage;
};
export declare function parseCliJson(raw: string, backend: CliBackendConfig): CliOutput | null;
export declare function parseCliJsonl(raw: string, backend: CliBackendConfig, providerId: string): CliOutput | null;
export declare function parseCliOutput(params: {
    raw: string;
    backend: CliBackendConfig;
    providerId: string;
    outputMode?: "json" | "jsonl" | "text";
    fallbackSessionId?: string;
}): CliOutput;
export {};
