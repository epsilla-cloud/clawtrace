import type { Command } from "commander";
export type GatewayRpcOpts = {
    url?: string;
    token?: string;
    timeout?: string;
    expectFinal?: boolean;
    json?: boolean;
};
export declare function addGatewayClientOptions(cmd: Command): Command;
export declare function callGatewayFromCli(method: string, opts: GatewayRpcOpts, params?: unknown, extra?: {
    expectFinal?: boolean;
    progress?: boolean;
}): Promise<Record<string, unknown>>;
