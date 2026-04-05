import { n as CLI_RESUME_WATCHDOG_DEFAULTS, t as CLI_FRESH_WATCHDOG_DEFAULTS } from "./cli-watchdog-defaults-ay_R4q8w.js";
//#region extensions/google/cli-backend.ts
const GEMINI_MODEL_ALIASES = {
	pro: "gemini-3.1-pro-preview",
	flash: "gemini-3.1-flash-preview",
	"flash-lite": "gemini-3.1-flash-lite-preview"
};
function buildGoogleGeminiCliBackend() {
	return {
		id: "google-gemini-cli",
		config: {
			command: "gemini",
			args: [
				"--prompt",
				"--output-format",
				"json"
			],
			resumeArgs: [
				"--resume",
				"{sessionId}",
				"--prompt",
				"--output-format",
				"json"
			],
			output: "json",
			input: "arg",
			modelArg: "--model",
			modelAliases: GEMINI_MODEL_ALIASES,
			sessionMode: "existing",
			sessionIdFields: ["session_id", "sessionId"],
			reliability: { watchdog: {
				fresh: { ...CLI_FRESH_WATCHDOG_DEFAULTS },
				resume: { ...CLI_RESUME_WATCHDOG_DEFAULTS }
			} },
			serialize: true
		}
	};
}
//#endregion
export { buildGoogleGeminiCliBackend as t };
