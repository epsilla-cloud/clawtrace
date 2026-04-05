import type { CliBackendConfig } from "openclaw/plugin-sdk/cli-backend";
export declare const CLAUDE_CLI_BACKEND_ID = "claude-cli";
export declare const CLAUDE_CLI_MODEL_ALIASES: Record<string, string>;
export declare const CLAUDE_CLI_SESSION_ID_FIELDS: readonly ["session_id", "sessionId", "conversation_id", "conversationId"];
export declare const CLAUDE_CLI_CLEAR_ENV: readonly ["ANTHROPIC_API_KEY", "ANTHROPIC_API_KEY_OLD"];
export declare function isClaudeCliProvider(providerId: string): boolean;
export declare function normalizeClaudePermissionArgs(args?: string[]): string[] | undefined;
export declare function normalizeClaudeBackendConfig(config: CliBackendConfig): CliBackendConfig;
