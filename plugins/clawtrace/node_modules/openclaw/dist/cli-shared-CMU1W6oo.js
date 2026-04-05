//#region extensions/anthropic/cli-shared.ts
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
const CLAUDE_CLI_MODEL_ALIASES = {
	opus: "opus",
	"opus-4.6": "opus",
	"opus-4.5": "opus",
	"opus-4": "opus",
	"claude-opus-4-6": "opus",
	"claude-opus-4-5": "opus",
	"claude-opus-4": "opus",
	sonnet: "sonnet",
	"sonnet-4.6": "sonnet",
	"sonnet-4.5": "sonnet",
	"sonnet-4.1": "sonnet",
	"sonnet-4.0": "sonnet",
	"claude-sonnet-4-6": "sonnet",
	"claude-sonnet-4-5": "sonnet",
	"claude-sonnet-4-1": "sonnet",
	"claude-sonnet-4-0": "sonnet",
	haiku: "haiku",
	"haiku-3.5": "haiku",
	"claude-haiku-3-5": "haiku"
};
const CLAUDE_CLI_SESSION_ID_FIELDS = [
	"session_id",
	"sessionId",
	"conversation_id",
	"conversationId"
];
const CLAUDE_CLI_CLEAR_ENV = ["ANTHROPIC_API_KEY", "ANTHROPIC_API_KEY_OLD"];
const CLAUDE_LEGACY_SKIP_PERMISSIONS_ARG = "--dangerously-skip-permissions";
const CLAUDE_PERMISSION_MODE_ARG = "--permission-mode";
const CLAUDE_BYPASS_PERMISSIONS_MODE = "bypassPermissions";
function isClaudeCliProvider(providerId) {
	return providerId.trim().toLowerCase() === CLAUDE_CLI_BACKEND_ID;
}
function normalizeClaudePermissionArgs(args) {
	if (!args) return args;
	const normalized = [];
	let sawLegacySkip = false;
	let hasPermissionMode = false;
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === CLAUDE_LEGACY_SKIP_PERMISSIONS_ARG) {
			sawLegacySkip = true;
			continue;
		}
		if (arg === CLAUDE_PERMISSION_MODE_ARG) {
			hasPermissionMode = true;
			normalized.push(arg);
			const maybeValue = args[i + 1];
			if (typeof maybeValue === "string") {
				normalized.push(maybeValue);
				i += 1;
			}
			continue;
		}
		if (arg.startsWith(`${CLAUDE_PERMISSION_MODE_ARG}=`)) hasPermissionMode = true;
		normalized.push(arg);
	}
	if (sawLegacySkip && !hasPermissionMode) normalized.push(CLAUDE_PERMISSION_MODE_ARG, CLAUDE_BYPASS_PERMISSIONS_MODE);
	return normalized;
}
function normalizeClaudeBackendConfig(config) {
	return {
		...config,
		args: normalizeClaudePermissionArgs(config.args),
		resumeArgs: normalizeClaudePermissionArgs(config.resumeArgs)
	};
}
//#endregion
export { isClaudeCliProvider as a, CLAUDE_CLI_SESSION_ID_FIELDS as i, CLAUDE_CLI_CLEAR_ENV as n, normalizeClaudeBackendConfig as o, CLAUDE_CLI_MODEL_ALIASES as r, normalizeClaudePermissionArgs as s, CLAUDE_CLI_BACKEND_ID as t };
