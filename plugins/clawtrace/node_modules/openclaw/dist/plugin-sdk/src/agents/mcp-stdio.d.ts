type StdioMcpServerLaunchConfig = {
    command: string;
    args?: string[];
    env?: Record<string, string>;
    cwd?: string;
};
type StdioMcpServerLaunchResult = {
    ok: true;
    config: StdioMcpServerLaunchConfig;
} | {
    ok: false;
    reason: string;
};
export declare function resolveStdioMcpServerLaunchConfig(raw: unknown): StdioMcpServerLaunchResult;
export declare function describeStdioMcpServerLaunchConfig(config: StdioMcpServerLaunchConfig): string;
export type { StdioMcpServerLaunchConfig, StdioMcpServerLaunchResult };
