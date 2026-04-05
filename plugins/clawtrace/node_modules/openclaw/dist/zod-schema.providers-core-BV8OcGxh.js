import { _ as normalizeAccountId } from "./session-key-BhxcMJEE.js";
import { a as hasConfiguredSecretInput } from "./types.secrets-Rqz2qv-w.js";
import { A as TtsConfigSchema, F as requireOpenAllowFrom, P as requireAllowlistAllowFrom, S as SecretInputSchema, _ as ProviderCommandsSchema, a as DmPolicySchema, b as ReplyToModeSchema, c as GroupPolicySchema, i as DmConfigSchema, l as HexColorSchema, m as MarkdownConfigSchema, n as BlockStreamingCoalesceSchema, o as ExecutableTokenSchema, p as MSTeamsReplyStyleSchema, t as BlockStreamingChunkSchema, w as SecretRefSchema, x as RetryConfigSchema } from "./zod-schema.core-CGoKjdG2.js";
import { t as sensitive } from "./zod-schema.sensitive-DKxefNcr.js";
import { t as resolveAccountEntry } from "./account-lookup-DdMcO0BU.js";
import { o as ToolPolicySchema } from "./zod-schema.agent-runtime-CrOvVRbe.js";
import { t as isSafeScpRemoteHost } from "./scp-host-C8II1mmC.js";
import path from "node:path";
import { z } from "zod";
//#region src/config/discord-preview-streaming.ts
function normalizeStreamingMode(value) {
	if (typeof value !== "string") return null;
	return value.trim().toLowerCase() || null;
}
function parseStreamingMode(value) {
	const normalized = normalizeStreamingMode(value);
	if (normalized === "off" || normalized === "partial" || normalized === "block" || normalized === "progress") return normalized;
	return null;
}
function parseDiscordPreviewStreamMode(value) {
	const parsed = parseStreamingMode(value);
	if (!parsed) return null;
	return parsed === "progress" ? "partial" : parsed;
}
function parseSlackLegacyDraftStreamMode(value) {
	const normalized = normalizeStreamingMode(value);
	if (normalized === "replace" || normalized === "status_final" || normalized === "append") return normalized;
	return null;
}
function mapSlackLegacyDraftStreamModeToStreaming(mode) {
	if (mode === "append") return "block";
	if (mode === "status_final") return "progress";
	return "partial";
}
function mapStreamingModeToSlackLegacyDraftStreamMode(mode) {
	if (mode === "block") return "append";
	if (mode === "progress") return "status_final";
	return "replace";
}
function resolveTelegramPreviewStreamMode(params = {}) {
	const parsedStreaming = parseStreamingMode(params.streaming);
	if (parsedStreaming) {
		if (parsedStreaming === "progress") return "partial";
		return parsedStreaming;
	}
	const legacy = parseDiscordPreviewStreamMode(params.streamMode);
	if (legacy) return legacy;
	if (typeof params.streaming === "boolean") return params.streaming ? "partial" : "off";
	return "partial";
}
function resolveDiscordPreviewStreamMode(params = {}) {
	const parsedStreaming = parseDiscordPreviewStreamMode(params.streaming);
	if (parsedStreaming) return parsedStreaming;
	const legacy = parseDiscordPreviewStreamMode(params.streamMode);
	if (legacy) return legacy;
	if (typeof params.streaming === "boolean") return params.streaming ? "partial" : "off";
	return "off";
}
function resolveSlackStreamingMode(params = {}) {
	const parsedStreaming = parseStreamingMode(params.streaming);
	if (parsedStreaming) return parsedStreaming;
	const legacyStreamMode = parseSlackLegacyDraftStreamMode(params.streamMode);
	if (legacyStreamMode) return mapSlackLegacyDraftStreamModeToStreaming(legacyStreamMode);
	if (typeof params.streaming === "boolean") return params.streaming ? "partial" : "off";
	return "partial";
}
function resolveSlackNativeStreaming(params = {}) {
	if (typeof params.nativeStreaming === "boolean") return params.nativeStreaming;
	if (typeof params.streaming === "boolean") return params.streaming;
	return true;
}
function formatSlackStreamModeMigrationMessage(pathPrefix, resolvedStreaming) {
	return `Moved ${pathPrefix}.streamMode → ${pathPrefix}.streaming (${resolvedStreaming}).`;
}
function formatSlackStreamingBooleanMigrationMessage(pathPrefix, resolvedNativeStreaming) {
	return `Moved ${pathPrefix}.streaming (boolean) → ${pathPrefix}.nativeStreaming (${resolvedNativeStreaming}).`;
}
//#endregion
//#region src/config/zod-schema.channels.ts
const ChannelHeartbeatVisibilitySchema = z.object({
	showOk: z.boolean().optional(),
	showAlerts: z.boolean().optional(),
	useIndicator: z.boolean().optional()
}).strict().optional();
const ChannelHealthMonitorSchema = z.object({ enabled: z.boolean().optional() }).strict().optional();
//#endregion
//#region src/config/telegram-custom-commands.ts
const TELEGRAM_COMMAND_NAME_PATTERN = /^[a-z0-9_]{1,32}$/;
function normalizeTelegramCommandName(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	return (trimmed.startsWith("/") ? trimmed.slice(1) : trimmed).trim().toLowerCase().replace(/-/g, "_");
}
function normalizeTelegramCommandDescription(value) {
	return value.trim();
}
function resolveTelegramCustomCommands(params) {
	const entries = Array.isArray(params.commands) ? params.commands : [];
	const reserved = params.reservedCommands ?? /* @__PURE__ */ new Set();
	const checkReserved = params.checkReserved !== false;
	const checkDuplicates = params.checkDuplicates !== false;
	const seen = /* @__PURE__ */ new Set();
	const resolved = [];
	const issues = [];
	for (let index = 0; index < entries.length; index += 1) {
		const entry = entries[index];
		const normalized = normalizeTelegramCommandName(String(entry?.command ?? ""));
		if (!normalized) {
			issues.push({
				index,
				field: "command",
				message: "Telegram custom command is missing a command name."
			});
			continue;
		}
		if (!TELEGRAM_COMMAND_NAME_PATTERN.test(normalized)) {
			issues.push({
				index,
				field: "command",
				message: `Telegram custom command "/${normalized}" is invalid (use a-z, 0-9, underscore; max 32 chars).`
			});
			continue;
		}
		if (checkReserved && reserved.has(normalized)) {
			issues.push({
				index,
				field: "command",
				message: `Telegram custom command "/${normalized}" conflicts with a native command.`
			});
			continue;
		}
		if (checkDuplicates && seen.has(normalized)) {
			issues.push({
				index,
				field: "command",
				message: `Telegram custom command "/${normalized}" is duplicated.`
			});
			continue;
		}
		const description = normalizeTelegramCommandDescription(String(entry?.description ?? ""));
		if (!description) {
			issues.push({
				index,
				field: "description",
				message: `Telegram custom command "/${normalized}" is missing a description.`
			});
			continue;
		}
		if (checkDuplicates) seen.add(normalized);
		resolved.push({
			command: normalized,
			description
		});
	}
	return {
		commands: resolved,
		issues
	};
}
//#endregion
//#region src/media/inbound-path-policy.ts
const WILDCARD_SEGMENT = "*";
const WINDOWS_DRIVE_ABS_RE = /^[A-Za-z]:\//;
const WINDOWS_DRIVE_ROOT_RE = /^[A-Za-z]:$/;
const DEFAULT_IMESSAGE_ATTACHMENT_ROOTS = ["/Users/*/Library/Messages/Attachments"];
function normalizePosixAbsolutePath(value) {
	const trimmed = value.trim();
	if (!trimmed || trimmed.includes("\0")) return;
	const normalized = path.posix.normalize(trimmed.replaceAll("\\", "/"));
	if (!(normalized.startsWith("/") || WINDOWS_DRIVE_ABS_RE.test(normalized)) || normalized === "/") return;
	const withoutTrailingSlash = normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
	if (WINDOWS_DRIVE_ROOT_RE.test(withoutTrailingSlash)) return;
	return withoutTrailingSlash;
}
function splitPathSegments(value) {
	return value.split("/").filter(Boolean);
}
function matchesRootPattern(params) {
	const candidateSegments = splitPathSegments(params.candidatePath);
	const rootSegments = splitPathSegments(params.rootPattern);
	if (candidateSegments.length < rootSegments.length) return false;
	for (let idx = 0; idx < rootSegments.length; idx += 1) {
		const expected = rootSegments[idx];
		const actual = candidateSegments[idx];
		if (expected === WILDCARD_SEGMENT) continue;
		if (expected !== actual) return false;
	}
	return true;
}
function isValidInboundPathRootPattern(value) {
	const normalized = normalizePosixAbsolutePath(value);
	if (!normalized) return false;
	const segments = splitPathSegments(normalized);
	if (segments.length === 0) return false;
	return segments.every((segment) => segment === WILDCARD_SEGMENT || !segment.includes("*"));
}
function normalizeInboundPathRoots(roots) {
	const normalized = [];
	const seen = /* @__PURE__ */ new Set();
	for (const root of roots ?? []) {
		if (typeof root !== "string") continue;
		if (!isValidInboundPathRootPattern(root)) continue;
		const candidate = normalizePosixAbsolutePath(root);
		if (!candidate || seen.has(candidate)) continue;
		seen.add(candidate);
		normalized.push(candidate);
	}
	return normalized;
}
function mergeInboundPathRoots(...rootsLists) {
	const merged = [];
	const seen = /* @__PURE__ */ new Set();
	for (const roots of rootsLists) {
		const normalized = normalizeInboundPathRoots(roots);
		for (const root of normalized) {
			if (seen.has(root)) continue;
			seen.add(root);
			merged.push(root);
		}
	}
	return merged;
}
function isInboundPathAllowed(params) {
	const candidatePath = normalizePosixAbsolutePath(params.filePath);
	if (!candidatePath) return false;
	const roots = normalizeInboundPathRoots(params.roots);
	const effectiveRoots = roots.length > 0 ? roots : normalizeInboundPathRoots(params.fallbackRoots ?? void 0);
	if (effectiveRoots.length === 0) return false;
	return effectiveRoots.some((rootPattern) => matchesRootPattern({
		candidatePath,
		rootPattern
	}));
}
function resolveIMessageAccountConfig(params) {
	const accountId = normalizeAccountId(params.accountId);
	if (!params.accountId?.trim()) return;
	return resolveAccountEntry(params.cfg.channels?.imessage?.accounts, accountId);
}
function resolveIMessageAttachmentRoots(params) {
	return mergeInboundPathRoots(resolveIMessageAccountConfig(params)?.attachmentRoots, params.cfg.channels?.imessage?.attachmentRoots, DEFAULT_IMESSAGE_ATTACHMENT_ROOTS);
}
function resolveIMessageRemoteAttachmentRoots(params) {
	const accountConfig = resolveIMessageAccountConfig(params);
	return mergeInboundPathRoots(accountConfig?.remoteAttachmentRoots, params.cfg.channels?.imessage?.remoteAttachmentRoots, accountConfig?.attachmentRoots, params.cfg.channels?.imessage?.attachmentRoots, DEFAULT_IMESSAGE_ATTACHMENT_ROOTS);
}
//#endregion
//#region src/config/zod-schema.secret-input-validation.ts
function forEachEnabledAccount(accounts, run) {
	if (!accounts) return;
	for (const [accountId, account] of Object.entries(accounts)) {
		if (!account || account.enabled === false) continue;
		run(accountId, account);
	}
}
function validateTelegramWebhookSecretRequirements(value, ctx) {
	const baseWebhookUrl = typeof value.webhookUrl === "string" ? value.webhookUrl.trim() : "";
	const hasBaseWebhookSecret = hasConfiguredSecretInput(value.webhookSecret);
	if (baseWebhookUrl && !hasBaseWebhookSecret) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "channels.telegram.webhookUrl requires channels.telegram.webhookSecret",
		path: ["webhookSecret"]
	});
	forEachEnabledAccount(value.accounts, (accountId, account) => {
		if (!(typeof account.webhookUrl === "string" ? account.webhookUrl.trim() : "")) return;
		if (!hasConfiguredSecretInput(account.webhookSecret) && !hasBaseWebhookSecret) ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "channels.telegram.accounts.*.webhookUrl requires channels.telegram.webhookSecret or channels.telegram.accounts.*.webhookSecret",
			path: [
				"accounts",
				accountId,
				"webhookSecret"
			]
		});
	});
}
function validateSlackSigningSecretRequirements(value, ctx) {
	const baseMode = value.mode === "http" || value.mode === "socket" ? value.mode : "socket";
	if (baseMode === "http" && !hasConfiguredSecretInput(value.signingSecret)) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "channels.slack.mode=\"http\" requires channels.slack.signingSecret",
		path: ["signingSecret"]
	});
	forEachEnabledAccount(value.accounts, (accountId, account) => {
		if ((account.mode === "http" || account.mode === "socket" ? account.mode : baseMode) !== "http") return;
		if (!hasConfiguredSecretInput(account.signingSecret ?? value.signingSecret)) ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "channels.slack.accounts.*.mode=\"http\" requires channels.slack.signingSecret or channels.slack.accounts.*.signingSecret",
			path: [
				"accounts",
				accountId,
				"signingSecret"
			]
		});
	});
}
//#endregion
//#region src/config/zod-schema.providers-core.ts
const ToolPolicyBySenderSchema = z.record(z.string(), ToolPolicySchema).optional();
const DiscordIdSchema = z.union([z.string(), z.number()]).refine((value) => typeof value === "string", { message: "Discord IDs must be strings (wrap numeric IDs in quotes)." });
const DiscordIdListSchema = z.array(DiscordIdSchema);
const TelegramInlineButtonsScopeSchema = z.enum([
	"off",
	"dm",
	"group",
	"all",
	"allowlist"
]);
const TelegramIdListSchema = z.array(z.union([z.string(), z.number()]));
const TelegramCapabilitiesSchema = z.union([z.array(z.string()), z.object({ inlineButtons: TelegramInlineButtonsScopeSchema.optional() }).strict()]);
const SlackCapabilitiesSchema = z.union([z.array(z.string()), z.object({ interactiveReplies: z.boolean().optional() }).strict()]);
const TelegramTopicSchema = z.object({
	requireMention: z.boolean().optional(),
	disableAudioPreflight: z.boolean().optional(),
	groupPolicy: GroupPolicySchema.optional(),
	skills: z.array(z.string()).optional(),
	enabled: z.boolean().optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	systemPrompt: z.string().optional(),
	agentId: z.string().optional()
}).strict();
const TelegramGroupSchema = z.object({
	requireMention: z.boolean().optional(),
	disableAudioPreflight: z.boolean().optional(),
	groupPolicy: GroupPolicySchema.optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	skills: z.array(z.string()).optional(),
	enabled: z.boolean().optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	systemPrompt: z.string().optional(),
	topics: z.record(z.string(), TelegramTopicSchema.optional()).optional()
}).strict();
const AutoTopicLabelSchema = z.union([z.boolean(), z.object({
	enabled: z.boolean().optional(),
	prompt: z.string().optional()
}).strict()]).optional();
const TelegramDirectSchema = z.object({
	dmPolicy: DmPolicySchema.optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	skills: z.array(z.string()).optional(),
	enabled: z.boolean().optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	systemPrompt: z.string().optional(),
	topics: z.record(z.string(), TelegramTopicSchema.optional()).optional(),
	requireTopic: z.boolean().optional(),
	autoTopicLabel: AutoTopicLabelSchema
}).strict();
const TelegramCustomCommandSchema = z.object({
	command: z.string().overwrite(normalizeTelegramCommandName),
	description: z.string().overwrite(normalizeTelegramCommandDescription)
}).strict();
const validateTelegramCustomCommands = (value, ctx) => {
	if (!value.customCommands || value.customCommands.length === 0) return;
	const { issues } = resolveTelegramCustomCommands({
		commands: value.customCommands,
		checkReserved: false,
		checkDuplicates: false
	});
	for (const issue of issues) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: [
			"customCommands",
			issue.index,
			issue.field
		],
		message: issue.message
	});
};
function normalizeTelegramStreamingConfig(value) {
	value.streaming = resolveTelegramPreviewStreamMode(value);
	delete value.streamMode;
}
function normalizeDiscordStreamingConfig(value) {
	value.streaming = resolveDiscordPreviewStreamMode(value);
	delete value.streamMode;
}
function normalizeSlackStreamingConfig(value) {
	value.nativeStreaming = resolveSlackNativeStreaming(value);
	value.streaming = resolveSlackStreamingMode(value);
	delete value.streamMode;
}
const TelegramAccountSchemaBase = z.object({
	name: z.string().optional(),
	capabilities: TelegramCapabilitiesSchema.optional(),
	execApprovals: z.object({
		enabled: z.boolean().optional(),
		approvers: TelegramIdListSchema.optional(),
		agentFilter: z.array(z.string()).optional(),
		sessionFilter: z.array(z.string()).optional(),
		target: z.enum([
			"dm",
			"channel",
			"both"
		]).optional()
	}).strict().optional(),
	markdown: MarkdownConfigSchema,
	enabled: z.boolean().optional(),
	commands: ProviderCommandsSchema,
	customCommands: z.array(TelegramCustomCommandSchema).optional(),
	configWrites: z.boolean().optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	botToken: SecretInputSchema.optional().register(sensitive),
	tokenFile: z.string().optional(),
	replyToMode: ReplyToModeSchema.optional(),
	groups: z.record(z.string(), TelegramGroupSchema.optional()).optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	defaultTo: z.union([z.string(), z.number()]).optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	dms: z.record(z.string(), DmConfigSchema.optional()).optional(),
	direct: z.record(z.string(), TelegramDirectSchema.optional()).optional(),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	streaming: z.union([z.boolean(), z.enum([
		"off",
		"partial",
		"block",
		"progress"
	])]).optional(),
	blockStreaming: z.boolean().optional(),
	draftChunk: BlockStreamingChunkSchema.optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	streamMode: z.enum([
		"off",
		"partial",
		"block"
	]).optional(),
	mediaMaxMb: z.number().positive().optional(),
	timeoutSeconds: z.number().int().positive().optional(),
	retry: RetryConfigSchema,
	network: z.object({
		autoSelectFamily: z.boolean().optional(),
		dnsResultOrder: z.enum(["ipv4first", "verbatim"]).optional()
	}).strict().optional(),
	proxy: z.string().optional(),
	webhookUrl: z.string().optional().describe("Public HTTPS webhook URL registered with Telegram for inbound updates. This must be internet-reachable and requires channels.telegram.webhookSecret."),
	webhookSecret: SecretInputSchema.optional().describe("Secret token sent to Telegram during webhook registration and verified on inbound webhook requests. Telegram returns this value for verification; this is not the gateway auth token and not the bot token.").register(sensitive),
	webhookPath: z.string().optional().describe("Local webhook route path served by the gateway listener. Defaults to /telegram-webhook."),
	webhookHost: z.string().optional().describe("Local bind host for the webhook listener. Defaults to 127.0.0.1; keep loopback unless you intentionally expose direct ingress."),
	webhookPort: z.number().int().nonnegative().optional().describe("Local bind port for the webhook listener. Defaults to 8787; set to 0 to let the OS assign an ephemeral port."),
	webhookCertPath: z.string().optional().describe("Path to the self-signed certificate (PEM) to upload to Telegram during webhook registration. Required for self-signed certs (direct IP or no domain)."),
	actions: z.object({
		reactions: z.boolean().optional(),
		sendMessage: z.boolean().optional(),
		poll: z.boolean().optional(),
		deleteMessage: z.boolean().optional(),
		editMessage: z.boolean().optional(),
		sticker: z.boolean().optional(),
		createForumTopic: z.boolean().optional(),
		editForumTopic: z.boolean().optional()
	}).strict().optional(),
	threadBindings: z.object({
		enabled: z.boolean().optional(),
		idleHours: z.number().nonnegative().optional(),
		maxAgeHours: z.number().nonnegative().optional(),
		spawnSubagentSessions: z.boolean().optional(),
		spawnAcpSessions: z.boolean().optional()
	}).strict().optional(),
	reactionNotifications: z.enum([
		"off",
		"own",
		"all"
	]).optional(),
	reactionLevel: z.enum([
		"off",
		"ack",
		"minimal",
		"extensive"
	]).optional(),
	heartbeat: ChannelHeartbeatVisibilitySchema,
	healthMonitor: ChannelHealthMonitorSchema,
	linkPreview: z.boolean().optional(),
	silentErrorReplies: z.boolean().optional(),
	responsePrefix: z.string().optional(),
	ackReaction: z.string().optional(),
	apiRoot: z.string().url().optional(),
	autoTopicLabel: AutoTopicLabelSchema
}).strict();
const TelegramAccountSchema = TelegramAccountSchemaBase.superRefine((value, ctx) => {
	normalizeTelegramStreamingConfig(value);
	validateTelegramCustomCommands(value, ctx);
});
const TelegramConfigSchema = TelegramAccountSchemaBase.extend({
	accounts: z.record(z.string(), TelegramAccountSchema.optional()).optional(),
	defaultAccount: z.string().optional()
}).superRefine((value, ctx) => {
	normalizeTelegramStreamingConfig(value);
	requireOpenAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.telegram.dmPolicy=\"open\" requires channels.telegram.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.telegram.dmPolicy=\"allowlist\" requires channels.telegram.allowFrom to contain at least one sender ID"
	});
	validateTelegramCustomCommands(value, ctx);
	if (value.accounts) for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
		const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
		requireOpenAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.telegram.accounts.*.dmPolicy=\"open\" requires channels.telegram.accounts.*.allowFrom (or channels.telegram.allowFrom) to include \"*\""
		});
		requireAllowlistAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.telegram.accounts.*.dmPolicy=\"allowlist\" requires channels.telegram.accounts.*.allowFrom (or channels.telegram.allowFrom) to contain at least one sender ID"
		});
	}
	if (!value.accounts) {
		validateTelegramWebhookSecretRequirements(value, ctx);
		return;
	}
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		if (account.enabled === false) continue;
		const effectiveDmPolicy = account.dmPolicy ?? value.dmPolicy;
		const effectiveAllowFrom = Array.isArray(account.allowFrom) ? account.allowFrom : value.allowFrom;
		requireOpenAllowFrom({
			policy: effectiveDmPolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.telegram.accounts.*.dmPolicy=\"open\" requires channels.telegram.allowFrom or channels.telegram.accounts.*.allowFrom to include \"*\""
		});
		requireAllowlistAllowFrom({
			policy: effectiveDmPolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.telegram.accounts.*.dmPolicy=\"allowlist\" requires channels.telegram.allowFrom or channels.telegram.accounts.*.allowFrom to contain at least one sender ID"
		});
	}
	validateTelegramWebhookSecretRequirements(value, ctx);
});
const DiscordDmSchema = z.object({
	enabled: z.boolean().optional(),
	policy: DmPolicySchema.optional(),
	allowFrom: DiscordIdListSchema.optional(),
	groupEnabled: z.boolean().optional(),
	groupChannels: DiscordIdListSchema.optional()
}).strict();
const DiscordGuildChannelSchema = z.object({
	allow: z.boolean().optional(),
	requireMention: z.boolean().optional(),
	ignoreOtherMentions: z.boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	skills: z.array(z.string()).optional(),
	enabled: z.boolean().optional(),
	users: DiscordIdListSchema.optional(),
	roles: DiscordIdListSchema.optional(),
	systemPrompt: z.string().optional(),
	includeThreadStarter: z.boolean().optional(),
	autoThread: z.boolean().optional(),
	autoThreadName: z.enum(["message", "generated"]).optional(),
	autoArchiveDuration: z.union([
		z.enum([
			"60",
			"1440",
			"4320",
			"10080"
		]),
		z.literal(60),
		z.literal(1440),
		z.literal(4320),
		z.literal(10080)
	]).optional()
}).strict();
const DiscordGuildSchema = z.object({
	slug: z.string().optional(),
	requireMention: z.boolean().optional(),
	ignoreOtherMentions: z.boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	reactionNotifications: z.enum([
		"off",
		"own",
		"all",
		"allowlist"
	]).optional(),
	users: DiscordIdListSchema.optional(),
	roles: DiscordIdListSchema.optional(),
	channels: z.record(z.string(), DiscordGuildChannelSchema.optional()).optional()
}).strict();
const DiscordUiSchema = z.object({ components: z.object({ accentColor: HexColorSchema.optional() }).strict().optional() }).strict().optional();
const DiscordVoiceAutoJoinSchema = z.object({
	guildId: z.string().min(1),
	channelId: z.string().min(1)
}).strict();
const DiscordVoiceSchema = z.object({
	enabled: z.boolean().optional(),
	autoJoin: z.array(DiscordVoiceAutoJoinSchema).optional(),
	daveEncryption: z.boolean().optional(),
	decryptionFailureTolerance: z.number().int().min(0).optional(),
	tts: TtsConfigSchema.optional()
}).strict().optional();
const DiscordAccountSchema = z.object({
	name: z.string().optional(),
	capabilities: z.array(z.string()).optional(),
	markdown: MarkdownConfigSchema,
	enabled: z.boolean().optional(),
	commands: ProviderCommandsSchema,
	configWrites: z.boolean().optional(),
	token: SecretInputSchema.optional().register(sensitive),
	proxy: z.string().optional(),
	allowBots: z.union([z.boolean(), z.literal("mentions")]).optional(),
	dangerouslyAllowNameMatching: z.boolean().optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	dms: z.record(z.string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	blockStreaming: z.boolean().optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	streaming: z.union([z.boolean(), z.enum([
		"off",
		"partial",
		"block",
		"progress"
	])]).optional(),
	streamMode: z.enum([
		"partial",
		"block",
		"off"
	]).optional(),
	draftChunk: BlockStreamingChunkSchema.optional(),
	maxLinesPerMessage: z.number().int().positive().optional(),
	mediaMaxMb: z.number().positive().optional(),
	retry: RetryConfigSchema,
	actions: z.object({
		reactions: z.boolean().optional(),
		stickers: z.boolean().optional(),
		emojiUploads: z.boolean().optional(),
		stickerUploads: z.boolean().optional(),
		polls: z.boolean().optional(),
		permissions: z.boolean().optional(),
		messages: z.boolean().optional(),
		threads: z.boolean().optional(),
		pins: z.boolean().optional(),
		search: z.boolean().optional(),
		memberInfo: z.boolean().optional(),
		roleInfo: z.boolean().optional(),
		roles: z.boolean().optional(),
		channelInfo: z.boolean().optional(),
		voiceStatus: z.boolean().optional(),
		events: z.boolean().optional(),
		moderation: z.boolean().optional(),
		channels: z.boolean().optional(),
		presence: z.boolean().optional()
	}).strict().optional(),
	replyToMode: ReplyToModeSchema.optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: DiscordIdListSchema.optional(),
	defaultTo: z.string().optional(),
	dm: DiscordDmSchema.optional(),
	guilds: z.record(z.string(), DiscordGuildSchema.optional()).optional(),
	heartbeat: ChannelHeartbeatVisibilitySchema,
	healthMonitor: ChannelHealthMonitorSchema,
	execApprovals: z.object({
		enabled: z.boolean().optional(),
		approvers: DiscordIdListSchema.optional(),
		agentFilter: z.array(z.string()).optional(),
		sessionFilter: z.array(z.string()).optional(),
		cleanupAfterResolve: z.boolean().optional(),
		target: z.enum([
			"dm",
			"channel",
			"both"
		]).optional()
	}).strict().optional(),
	agentComponents: z.object({ enabled: z.boolean().optional() }).strict().optional(),
	ui: DiscordUiSchema,
	slashCommand: z.object({ ephemeral: z.boolean().optional() }).strict().optional(),
	threadBindings: z.object({
		enabled: z.boolean().optional(),
		idleHours: z.number().nonnegative().optional(),
		maxAgeHours: z.number().nonnegative().optional(),
		spawnSubagentSessions: z.boolean().optional(),
		spawnAcpSessions: z.boolean().optional()
	}).strict().optional(),
	intents: z.object({
		presence: z.boolean().optional(),
		guildMembers: z.boolean().optional()
	}).strict().optional(),
	voice: DiscordVoiceSchema,
	pluralkit: z.object({
		enabled: z.boolean().optional(),
		token: SecretInputSchema.optional().register(sensitive)
	}).strict().optional(),
	responsePrefix: z.string().optional(),
	ackReaction: z.string().optional(),
	ackReactionScope: z.enum([
		"group-mentions",
		"group-all",
		"direct",
		"all",
		"off",
		"none"
	]).optional(),
	activity: z.string().optional(),
	status: z.enum([
		"online",
		"dnd",
		"idle",
		"invisible"
	]).optional(),
	autoPresence: z.object({
		enabled: z.boolean().optional(),
		intervalMs: z.number().int().positive().optional(),
		minUpdateIntervalMs: z.number().int().positive().optional(),
		healthyText: z.string().optional(),
		degradedText: z.string().optional(),
		exhaustedText: z.string().optional()
	}).strict().optional(),
	activityType: z.union([
		z.literal(0),
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
		z.literal(5)
	]).optional(),
	activityUrl: z.string().url().optional(),
	inboundWorker: z.object({ runTimeoutMs: z.number().int().nonnegative().optional() }).strict().optional(),
	eventQueue: z.object({
		listenerTimeout: z.number().int().positive().optional(),
		maxQueueSize: z.number().int().positive().optional(),
		maxConcurrency: z.number().int().positive().optional()
	}).strict().optional()
}).strict().superRefine((value, ctx) => {
	normalizeDiscordStreamingConfig(value);
	const activityText = typeof value.activity === "string" ? value.activity.trim() : "";
	const hasActivity = Boolean(activityText);
	const hasActivityType = value.activityType !== void 0;
	const activityUrl = typeof value.activityUrl === "string" ? value.activityUrl.trim() : "";
	const hasActivityUrl = Boolean(activityUrl);
	if ((hasActivityType || hasActivityUrl) && !hasActivity) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "channels.discord.activity is required when activityType or activityUrl is set",
		path: ["activity"]
	});
	if (value.activityType === 1 && !hasActivityUrl) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "channels.discord.activityUrl is required when activityType is 1 (Streaming)",
		path: ["activityUrl"]
	});
	if (hasActivityUrl && value.activityType !== 1) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "channels.discord.activityType must be 1 (Streaming) when activityUrl is set",
		path: ["activityType"]
	});
	const autoPresenceInterval = value.autoPresence?.intervalMs;
	const autoPresenceMinUpdate = value.autoPresence?.minUpdateIntervalMs;
	if (typeof autoPresenceInterval === "number" && typeof autoPresenceMinUpdate === "number" && autoPresenceMinUpdate > autoPresenceInterval) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "channels.discord.autoPresence.minUpdateIntervalMs must be less than or equal to channels.discord.autoPresence.intervalMs",
		path: ["autoPresence", "minUpdateIntervalMs"]
	});
});
const DiscordConfigSchema = DiscordAccountSchema.extend({
	accounts: z.record(z.string(), DiscordAccountSchema.optional()).optional(),
	defaultAccount: z.string().optional()
}).superRefine((value, ctx) => {
	const dmPolicy = value.dmPolicy ?? value.dm?.policy ?? "pairing";
	const allowFrom = value.allowFrom ?? value.dm?.allowFrom;
	const allowFromPath = value.allowFrom !== void 0 ? ["allowFrom"] : ["dm", "allowFrom"];
	requireOpenAllowFrom({
		policy: dmPolicy,
		allowFrom,
		ctx,
		path: [...allowFromPath],
		message: "channels.discord.dmPolicy=\"open\" requires channels.discord.allowFrom (or channels.discord.dm.allowFrom) to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: dmPolicy,
		allowFrom,
		ctx,
		path: [...allowFromPath],
		message: "channels.discord.dmPolicy=\"allowlist\" requires channels.discord.allowFrom (or channels.discord.dm.allowFrom) to contain at least one sender ID"
	});
	if (!value.accounts) return;
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? account.dm?.policy ?? value.dmPolicy ?? value.dm?.policy ?? "pairing";
		const effectiveAllowFrom = account.allowFrom ?? account.dm?.allowFrom ?? value.allowFrom ?? value.dm?.allowFrom;
		requireOpenAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.discord.accounts.*.dmPolicy=\"open\" requires channels.discord.accounts.*.allowFrom (or channels.discord.allowFrom) to include \"*\""
		});
		requireAllowlistAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.discord.accounts.*.dmPolicy=\"allowlist\" requires channels.discord.accounts.*.allowFrom (or channels.discord.allowFrom) to contain at least one sender ID"
		});
	}
});
const GoogleChatDmSchema = z.object({
	enabled: z.boolean().optional(),
	policy: DmPolicySchema.optional().default("pairing"),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional()
}).strict().superRefine((value, ctx) => {
	requireOpenAllowFrom({
		policy: value.policy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.googlechat.dm.policy=\"open\" requires channels.googlechat.dm.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.policy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.googlechat.dm.policy=\"allowlist\" requires channels.googlechat.dm.allowFrom to contain at least one sender ID"
	});
});
const GoogleChatGroupSchema = z.object({
	enabled: z.boolean().optional(),
	allow: z.boolean().optional(),
	requireMention: z.boolean().optional(),
	users: z.array(z.union([z.string(), z.number()])).optional(),
	systemPrompt: z.string().optional()
}).strict();
const GoogleChatAccountSchema = z.object({
	name: z.string().optional(),
	capabilities: z.array(z.string()).optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	allowBots: z.boolean().optional(),
	dangerouslyAllowNameMatching: z.boolean().optional(),
	requireMention: z.boolean().optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groups: z.record(z.string(), GoogleChatGroupSchema.optional()).optional(),
	defaultTo: z.string().optional(),
	serviceAccount: z.union([
		z.string(),
		z.record(z.string(), z.unknown()),
		SecretRefSchema
	]).optional().register(sensitive),
	serviceAccountRef: SecretRefSchema.optional().register(sensitive),
	serviceAccountFile: z.string().optional(),
	audienceType: z.enum(["app-url", "project-number"]).optional(),
	audience: z.string().optional(),
	appPrincipal: z.string().optional(),
	webhookPath: z.string().optional(),
	webhookUrl: z.string().optional(),
	botUser: z.string().optional(),
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	dms: z.record(z.string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	blockStreaming: z.boolean().optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	streamMode: z.enum([
		"replace",
		"status_final",
		"append"
	]).optional().default("replace"),
	mediaMaxMb: z.number().positive().optional(),
	replyToMode: ReplyToModeSchema.optional(),
	actions: z.object({ reactions: z.boolean().optional() }).strict().optional(),
	dm: GoogleChatDmSchema.optional(),
	healthMonitor: ChannelHealthMonitorSchema,
	typingIndicator: z.enum([
		"none",
		"message",
		"reaction"
	]).optional(),
	responsePrefix: z.string().optional()
}).strict();
const GoogleChatConfigSchema = GoogleChatAccountSchema.extend({
	accounts: z.record(z.string(), GoogleChatAccountSchema.optional()).optional(),
	defaultAccount: z.string().optional()
});
const SlackDmSchema = z.object({
	enabled: z.boolean().optional(),
	policy: DmPolicySchema.optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groupEnabled: z.boolean().optional(),
	groupChannels: z.array(z.union([z.string(), z.number()])).optional(),
	replyToMode: ReplyToModeSchema.optional()
}).strict();
const SlackChannelSchema = z.object({
	enabled: z.boolean().optional(),
	allow: z.boolean().optional(),
	requireMention: z.boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	allowBots: z.boolean().optional(),
	users: z.array(z.union([z.string(), z.number()])).optional(),
	skills: z.array(z.string()).optional(),
	systemPrompt: z.string().optional()
}).strict();
const SlackThreadSchema = z.object({
	historyScope: z.enum(["thread", "channel"]).optional(),
	inheritParent: z.boolean().optional(),
	initialHistoryLimit: z.number().int().min(0).optional()
}).strict();
const SlackReplyToModeByChatTypeSchema = z.object({
	direct: ReplyToModeSchema.optional(),
	group: ReplyToModeSchema.optional(),
	channel: ReplyToModeSchema.optional()
}).strict();
const SlackAccountSchema = z.object({
	name: z.string().optional(),
	mode: z.enum(["socket", "http"]).optional(),
	signingSecret: SecretInputSchema.optional().register(sensitive),
	webhookPath: z.string().optional(),
	capabilities: SlackCapabilitiesSchema.optional(),
	markdown: MarkdownConfigSchema,
	enabled: z.boolean().optional(),
	commands: ProviderCommandsSchema,
	configWrites: z.boolean().optional(),
	botToken: SecretInputSchema.optional().register(sensitive),
	appToken: SecretInputSchema.optional().register(sensitive),
	userToken: SecretInputSchema.optional().register(sensitive),
	userTokenReadOnly: z.boolean().optional().default(true),
	allowBots: z.boolean().optional(),
	dangerouslyAllowNameMatching: z.boolean().optional(),
	requireMention: z.boolean().optional(),
	groupPolicy: GroupPolicySchema.optional(),
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	dms: z.record(z.string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	blockStreaming: z.boolean().optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	streaming: z.union([z.boolean(), z.enum([
		"off",
		"partial",
		"block",
		"progress"
	])]).optional(),
	nativeStreaming: z.boolean().optional(),
	streamMode: z.enum([
		"replace",
		"status_final",
		"append"
	]).optional(),
	mediaMaxMb: z.number().positive().optional(),
	reactionNotifications: z.enum([
		"off",
		"own",
		"all",
		"allowlist"
	]).optional(),
	reactionAllowlist: z.array(z.union([z.string(), z.number()])).optional(),
	replyToMode: ReplyToModeSchema.optional(),
	replyToModeByChatType: SlackReplyToModeByChatTypeSchema.optional(),
	thread: SlackThreadSchema.optional(),
	actions: z.object({
		reactions: z.boolean().optional(),
		messages: z.boolean().optional(),
		pins: z.boolean().optional(),
		search: z.boolean().optional(),
		permissions: z.boolean().optional(),
		memberInfo: z.boolean().optional(),
		channelInfo: z.boolean().optional(),
		emojiList: z.boolean().optional()
	}).strict().optional(),
	slashCommand: z.object({
		enabled: z.boolean().optional(),
		name: z.string().optional(),
		sessionPrefix: z.string().optional(),
		ephemeral: z.boolean().optional()
	}).strict().optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	defaultTo: z.string().optional(),
	dm: SlackDmSchema.optional(),
	channels: z.record(z.string(), SlackChannelSchema.optional()).optional(),
	heartbeat: ChannelHeartbeatVisibilitySchema,
	healthMonitor: ChannelHealthMonitorSchema,
	responsePrefix: z.string().optional(),
	ackReaction: z.string().optional(),
	typingReaction: z.string().optional()
}).strict().superRefine((value) => {
	normalizeSlackStreamingConfig(value);
});
const SlackConfigSchema = SlackAccountSchema.safeExtend({
	mode: z.enum(["socket", "http"]).optional().default("socket"),
	signingSecret: SecretInputSchema.optional().register(sensitive),
	webhookPath: z.string().optional().default("/slack/events"),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	accounts: z.record(z.string(), SlackAccountSchema.optional()).optional(),
	defaultAccount: z.string().optional()
}).superRefine((value, ctx) => {
	const dmPolicy = value.dmPolicy ?? value.dm?.policy ?? "pairing";
	const allowFrom = value.allowFrom ?? value.dm?.allowFrom;
	const allowFromPath = value.allowFrom !== void 0 ? ["allowFrom"] : ["dm", "allowFrom"];
	requireOpenAllowFrom({
		policy: dmPolicy,
		allowFrom,
		ctx,
		path: [...allowFromPath],
		message: "channels.slack.dmPolicy=\"open\" requires channels.slack.allowFrom (or channels.slack.dm.allowFrom) to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: dmPolicy,
		allowFrom,
		ctx,
		path: [...allowFromPath],
		message: "channels.slack.dmPolicy=\"allowlist\" requires channels.slack.allowFrom (or channels.slack.dm.allowFrom) to contain at least one sender ID"
	});
	const baseMode = value.mode ?? "socket";
	if (!value.accounts) {
		validateSlackSigningSecretRequirements(value, ctx);
		return;
	}
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		if (account.enabled === false) continue;
		const accountMode = account.mode ?? baseMode;
		const effectivePolicy = account.dmPolicy ?? account.dm?.policy ?? value.dmPolicy ?? value.dm?.policy ?? "pairing";
		const effectiveAllowFrom = account.allowFrom ?? account.dm?.allowFrom ?? value.allowFrom ?? value.dm?.allowFrom;
		requireOpenAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.slack.accounts.*.dmPolicy=\"open\" requires channels.slack.accounts.*.allowFrom (or channels.slack.allowFrom) to include \"*\""
		});
		requireAllowlistAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.slack.accounts.*.dmPolicy=\"allowlist\" requires channels.slack.accounts.*.allowFrom (or channels.slack.allowFrom) to contain at least one sender ID"
		});
		if (accountMode !== "http") continue;
	}
	validateSlackSigningSecretRequirements(value, ctx);
});
const SignalGroupEntrySchema = z.object({
	requireMention: z.boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema
}).strict();
const SignalGroupsSchema = z.record(z.string(), SignalGroupEntrySchema.optional()).optional();
const SignalAccountSchemaBase = z.object({
	name: z.string().optional(),
	capabilities: z.array(z.string()).optional(),
	markdown: MarkdownConfigSchema,
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	account: z.string().optional(),
	accountUuid: z.string().optional(),
	httpUrl: z.string().optional(),
	httpHost: z.string().optional(),
	httpPort: z.number().int().positive().optional(),
	cliPath: ExecutableTokenSchema.optional(),
	autoStart: z.boolean().optional(),
	startupTimeoutMs: z.number().int().min(1e3).max(12e4).optional(),
	receiveMode: z.union([z.literal("on-start"), z.literal("manual")]).optional(),
	ignoreAttachments: z.boolean().optional(),
	ignoreStories: z.boolean().optional(),
	sendReadReceipts: z.boolean().optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	defaultTo: z.string().optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	groups: SignalGroupsSchema,
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	dms: z.record(z.string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	blockStreaming: z.boolean().optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	mediaMaxMb: z.number().int().positive().optional(),
	reactionNotifications: z.enum([
		"off",
		"own",
		"all",
		"allowlist"
	]).optional(),
	reactionAllowlist: z.array(z.union([z.string(), z.number()])).optional(),
	actions: z.object({ reactions: z.boolean().optional() }).strict().optional(),
	reactionLevel: z.enum([
		"off",
		"ack",
		"minimal",
		"extensive"
	]).optional(),
	heartbeat: ChannelHeartbeatVisibilitySchema,
	healthMonitor: ChannelHealthMonitorSchema,
	responsePrefix: z.string().optional()
}).strict();
const SignalAccountSchema = SignalAccountSchemaBase;
const SignalConfigSchema = SignalAccountSchemaBase.extend({
	accounts: z.record(z.string(), SignalAccountSchema.optional()).optional(),
	defaultAccount: z.string().optional()
}).superRefine((value, ctx) => {
	requireOpenAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.signal.dmPolicy=\"open\" requires channels.signal.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.signal.dmPolicy=\"allowlist\" requires channels.signal.allowFrom to contain at least one sender ID"
	});
	if (!value.accounts) return;
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
		const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
		requireOpenAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.signal.accounts.*.dmPolicy=\"open\" requires channels.signal.accounts.*.allowFrom (or channels.signal.allowFrom) to include \"*\""
		});
		requireAllowlistAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.signal.accounts.*.dmPolicy=\"allowlist\" requires channels.signal.accounts.*.allowFrom (or channels.signal.allowFrom) to contain at least one sender ID"
		});
	}
});
const IrcGroupSchema = z.object({
	requireMention: z.boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	skills: z.array(z.string()).optional(),
	enabled: z.boolean().optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	systemPrompt: z.string().optional()
}).strict();
const IrcNickServSchema = z.object({
	enabled: z.boolean().optional(),
	service: z.string().optional(),
	password: SecretInputSchema.optional().register(sensitive),
	passwordFile: z.string().optional(),
	register: z.boolean().optional(),
	registerEmail: z.string().optional()
}).strict();
const IrcAccountSchemaBase = z.object({
	name: z.string().optional(),
	capabilities: z.array(z.string()).optional(),
	markdown: MarkdownConfigSchema,
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	host: z.string().optional(),
	port: z.number().int().min(1).max(65535).optional(),
	tls: z.boolean().optional(),
	nick: z.string().optional(),
	username: z.string().optional(),
	realname: z.string().optional(),
	password: SecretInputSchema.optional().register(sensitive),
	passwordFile: z.string().optional(),
	nickserv: IrcNickServSchema.optional(),
	channels: z.array(z.string()).optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	defaultTo: z.string().optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	groups: z.record(z.string(), IrcGroupSchema.optional()).optional(),
	mentionPatterns: z.array(z.string()).optional(),
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	dms: z.record(z.string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	blockStreaming: z.boolean().optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	mediaMaxMb: z.number().positive().optional(),
	heartbeat: ChannelHeartbeatVisibilitySchema,
	healthMonitor: ChannelHealthMonitorSchema,
	responsePrefix: z.string().optional()
}).strict();
function refineIrcAllowFromAndNickserv(value, ctx) {
	requireOpenAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.irc.dmPolicy=\"open\" requires channels.irc.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.irc.dmPolicy=\"allowlist\" requires channels.irc.allowFrom to contain at least one sender ID"
	});
	if (value.nickserv?.register && !value.nickserv.registerEmail?.trim()) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["nickserv", "registerEmail"],
		message: "channels.irc.nickserv.register=true requires channels.irc.nickserv.registerEmail"
	});
}
const IrcAccountSchema = IrcAccountSchemaBase.superRefine((value, ctx) => {
	if (value.nickserv?.register && !value.nickserv.registerEmail?.trim()) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: ["nickserv", "registerEmail"],
		message: "channels.irc.nickserv.register=true requires channels.irc.nickserv.registerEmail"
	});
});
const IrcConfigSchema = IrcAccountSchemaBase.extend({
	accounts: z.record(z.string(), IrcAccountSchema.optional()).optional(),
	defaultAccount: z.string().optional()
}).superRefine((value, ctx) => {
	refineIrcAllowFromAndNickserv(value, ctx);
	if (!value.accounts) return;
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
		const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
		requireOpenAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.irc.accounts.*.dmPolicy=\"open\" requires channels.irc.accounts.*.allowFrom (or channels.irc.allowFrom) to include \"*\""
		});
		requireAllowlistAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.irc.accounts.*.dmPolicy=\"allowlist\" requires channels.irc.accounts.*.allowFrom (or channels.irc.allowFrom) to contain at least one sender ID"
		});
	}
});
const IMessageAccountSchemaBase = z.object({
	name: z.string().optional(),
	capabilities: z.array(z.string()).optional(),
	markdown: MarkdownConfigSchema,
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	cliPath: ExecutableTokenSchema.optional(),
	dbPath: z.string().optional(),
	remoteHost: z.string().refine(isSafeScpRemoteHost, "expected SSH host or user@host (no spaces/options)").optional(),
	service: z.union([
		z.literal("imessage"),
		z.literal("sms"),
		z.literal("auto")
	]).optional(),
	region: z.string().optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	defaultTo: z.string().optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	dms: z.record(z.string(), DmConfigSchema.optional()).optional(),
	includeAttachments: z.boolean().optional(),
	attachmentRoots: z.array(z.string().refine(isValidInboundPathRootPattern, "expected absolute path root")).optional(),
	remoteAttachmentRoots: z.array(z.string().refine(isValidInboundPathRootPattern, "expected absolute path root")).optional(),
	mediaMaxMb: z.number().int().positive().optional(),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	blockStreaming: z.boolean().optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	groups: z.record(z.string(), z.object({
		requireMention: z.boolean().optional(),
		tools: ToolPolicySchema,
		toolsBySender: ToolPolicyBySenderSchema
	}).strict().optional()).optional(),
	heartbeat: ChannelHeartbeatVisibilitySchema,
	healthMonitor: ChannelHealthMonitorSchema,
	responsePrefix: z.string().optional()
}).strict();
const IMessageAccountSchema = IMessageAccountSchemaBase;
const IMessageConfigSchema = IMessageAccountSchemaBase.extend({
	accounts: z.record(z.string(), IMessageAccountSchema.optional()).optional(),
	defaultAccount: z.string().optional()
}).superRefine((value, ctx) => {
	requireOpenAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.imessage.dmPolicy=\"open\" requires channels.imessage.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.imessage.dmPolicy=\"allowlist\" requires channels.imessage.allowFrom to contain at least one sender ID"
	});
	if (!value.accounts) return;
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
		const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
		requireOpenAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.imessage.accounts.*.dmPolicy=\"open\" requires channels.imessage.accounts.*.allowFrom (or channels.imessage.allowFrom) to include \"*\""
		});
		requireAllowlistAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.imessage.accounts.*.dmPolicy=\"allowlist\" requires channels.imessage.accounts.*.allowFrom (or channels.imessage.allowFrom) to contain at least one sender ID"
		});
	}
});
const BlueBubblesAllowFromEntry = z.union([z.string(), z.number()]);
const BlueBubblesActionSchema = z.object({
	reactions: z.boolean().optional(),
	edit: z.boolean().optional(),
	unsend: z.boolean().optional(),
	reply: z.boolean().optional(),
	sendWithEffect: z.boolean().optional(),
	renameGroup: z.boolean().optional(),
	setGroupIcon: z.boolean().optional(),
	addParticipant: z.boolean().optional(),
	removeParticipant: z.boolean().optional(),
	leaveGroup: z.boolean().optional(),
	sendAttachment: z.boolean().optional()
}).strict().optional();
const BlueBubblesGroupConfigSchema = z.object({
	requireMention: z.boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema
}).strict();
const BlueBubblesAccountSchemaBase = z.object({
	name: z.string().optional(),
	capabilities: z.array(z.string()).optional(),
	markdown: MarkdownConfigSchema,
	configWrites: z.boolean().optional(),
	enabled: z.boolean().optional(),
	serverUrl: z.string().optional(),
	password: SecretInputSchema.optional().register(sensitive),
	webhookPath: z.string().optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	allowFrom: z.array(BlueBubblesAllowFromEntry).optional(),
	groupAllowFrom: z.array(BlueBubblesAllowFromEntry).optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	dms: z.record(z.string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	mediaMaxMb: z.number().int().positive().optional(),
	mediaLocalRoots: z.array(z.string()).optional(),
	sendReadReceipts: z.boolean().optional(),
	allowPrivateNetwork: z.boolean().optional(),
	blockStreaming: z.boolean().optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	groups: z.record(z.string(), BlueBubblesGroupConfigSchema.optional()).optional(),
	heartbeat: ChannelHeartbeatVisibilitySchema,
	healthMonitor: ChannelHealthMonitorSchema,
	responsePrefix: z.string().optional()
}).strict();
const BlueBubblesAccountSchema = BlueBubblesAccountSchemaBase;
const BlueBubblesConfigSchema = BlueBubblesAccountSchemaBase.extend({
	accounts: z.record(z.string(), BlueBubblesAccountSchema.optional()).optional(),
	defaultAccount: z.string().optional(),
	actions: BlueBubblesActionSchema
}).superRefine((value, ctx) => {
	requireOpenAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.bluebubbles.dmPolicy=\"open\" requires channels.bluebubbles.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.bluebubbles.dmPolicy=\"allowlist\" requires channels.bluebubbles.allowFrom to contain at least one sender ID"
	});
	if (!value.accounts) return;
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
		const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
		requireOpenAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.bluebubbles.accounts.*.dmPolicy=\"open\" requires channels.bluebubbles.accounts.*.allowFrom (or channels.bluebubbles.allowFrom) to include \"*\""
		});
		requireAllowlistAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.bluebubbles.accounts.*.dmPolicy=\"allowlist\" requires channels.bluebubbles.accounts.*.allowFrom (or channels.bluebubbles.allowFrom) to contain at least one sender ID"
		});
	}
});
const MSTeamsChannelSchema = z.object({
	requireMention: z.boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	replyStyle: MSTeamsReplyStyleSchema.optional()
}).strict();
const MSTeamsTeamSchema = z.object({
	requireMention: z.boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	replyStyle: MSTeamsReplyStyleSchema.optional(),
	channels: z.record(z.string(), MSTeamsChannelSchema.optional()).optional()
}).strict();
const MSTeamsConfigSchema = z.object({
	enabled: z.boolean().optional(),
	capabilities: z.array(z.string()).optional(),
	dangerouslyAllowNameMatching: z.boolean().optional(),
	markdown: MarkdownConfigSchema,
	configWrites: z.boolean().optional(),
	appId: z.string().optional(),
	appPassword: SecretInputSchema.optional().register(sensitive),
	tenantId: z.string().optional(),
	webhook: z.object({
		port: z.number().int().positive().optional(),
		path: z.string().optional()
	}).strict().optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	allowFrom: z.array(z.string()).optional(),
	defaultTo: z.string().optional(),
	groupAllowFrom: z.array(z.string()).optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	blockStreaming: z.boolean().optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	mediaAllowHosts: z.array(z.string()).optional(),
	mediaAuthAllowHosts: z.array(z.string()).optional(),
	requireMention: z.boolean().optional(),
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	dms: z.record(z.string(), DmConfigSchema.optional()).optional(),
	replyStyle: MSTeamsReplyStyleSchema.optional(),
	teams: z.record(z.string(), MSTeamsTeamSchema.optional()).optional(),
	mediaMaxMb: z.number().positive().optional(),
	sharePointSiteId: z.string().optional(),
	heartbeat: ChannelHeartbeatVisibilitySchema,
	healthMonitor: ChannelHealthMonitorSchema,
	responsePrefix: z.string().optional(),
	welcomeCard: z.boolean().optional(),
	promptStarters: z.array(z.string()).optional(),
	groupWelcomeCard: z.boolean().optional(),
	feedbackEnabled: z.boolean().optional(),
	feedbackReflection: z.boolean().optional(),
	feedbackReflectionCooldownMs: z.number().int().min(0).optional()
}).strict().superRefine((value, ctx) => {
	requireOpenAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.msteams.dmPolicy=\"open\" requires channels.msteams.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.msteams.dmPolicy=\"allowlist\" requires channels.msteams.allowFrom to contain at least one sender ID"
	});
});
//#endregion
export { formatSlackStreamingBooleanMigrationMessage as C, resolveSlackStreamingMode as D, resolveSlackNativeStreaming as E, resolveTelegramPreviewStreamMode as O, formatSlackStreamModeMigrationMessage as S, resolveDiscordPreviewStreamMode as T, TELEGRAM_COMMAND_NAME_PATTERN as _, IrcConfigSchema as a, ChannelHealthMonitorSchema as b, SlackConfigSchema as c, isInboundPathAllowed as d, isValidInboundPathRootPattern as f, resolveIMessageRemoteAttachmentRoots as g, resolveIMessageAttachmentRoots as h, IMessageConfigSchema as i, TelegramConfigSchema as l, normalizeInboundPathRoots as m, DiscordConfigSchema as n, MSTeamsConfigSchema as o, mergeInboundPathRoots as p, GoogleChatConfigSchema as r, SignalConfigSchema as s, BlueBubblesConfigSchema as t, DEFAULT_IMESSAGE_ATTACHMENT_ROOTS as u, normalizeTelegramCommandName as v, mapStreamingModeToSlackLegacyDraftStreamMode as w, ChannelHeartbeatVisibilitySchema as x, resolveTelegramCustomCommands as y };
