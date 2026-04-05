import { i as CLAUDE_CLI_SESSION_ID_FIELDS, n as CLAUDE_CLI_CLEAR_ENV, o as normalizeClaudeBackendConfig, r as CLAUDE_CLI_MODEL_ALIASES, t as CLAUDE_CLI_BACKEND_ID } from "./cli-shared-CMU1W6oo.js";
import { n as CLI_RESUME_WATCHDOG_DEFAULTS, t as CLI_FRESH_WATCHDOG_DEFAULTS } from "./cli-watchdog-defaults-ay_R4q8w.js";
//#region extensions/anthropic/cli-backend.ts
function buildAnthropicCliBackend() {
	return {
		id: CLAUDE_CLI_BACKEND_ID,
		bundleMcp: true,
		config: {
			command: "claude",
			args: [
				"-p",
				"--output-format",
				"stream-json",
				"--verbose",
				"--permission-mode",
				"bypassPermissions"
			],
			resumeArgs: [
				"-p",
				"--output-format",
				"stream-json",
				"--verbose",
				"--permission-mode",
				"bypassPermissions",
				"--resume",
				"{sessionId}"
			],
			output: "jsonl",
			input: "arg",
			modelArg: "--model",
			modelAliases: CLAUDE_CLI_MODEL_ALIASES,
			sessionArg: "--session-id",
			sessionMode: "always",
			sessionIdFields: [...CLAUDE_CLI_SESSION_ID_FIELDS],
			systemPromptArg: "--append-system-prompt",
			systemPromptMode: "append",
			systemPromptWhen: "first",
			clearEnv: [...CLAUDE_CLI_CLEAR_ENV],
			reliability: { watchdog: {
				fresh: { ...CLI_FRESH_WATCHDOG_DEFAULTS },
				resume: { ...CLI_RESUME_WATCHDOG_DEFAULTS }
			} },
			serialize: true
		},
		normalizeConfig: normalizeClaudeBackendConfig
	};
}
//#endregion
export { buildAnthropicCliBackend as t };
