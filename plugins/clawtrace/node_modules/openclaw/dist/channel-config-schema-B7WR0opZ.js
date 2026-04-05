import { b as ChannelHealthMonitorSchema, x as ChannelHeartbeatVisibilitySchema } from "./zod-schema.providers-core-BV8OcGxh.js";
import { a as DmPolicySchema, c as GroupPolicySchema, i as DmConfigSchema, m as MarkdownConfigSchema, n as BlockStreamingCoalesceSchema } from "./zod-schema.core-CGoKjdG2.js";
import "./config-schema-DGr8UxxF.js";
import { o as ToolPolicySchema } from "./zod-schema.agent-runtime-CrOvVRbe.js";
import { z } from "zod";
//#region src/config/zod-schema.providers-whatsapp.ts
const ToolPolicyBySenderSchema = z.record(z.string(), ToolPolicySchema).optional();
const WhatsAppGroupEntrySchema = z.object({
	requireMention: z.boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema
}).strict().optional();
const WhatsAppGroupsSchema = z.record(z.string(), WhatsAppGroupEntrySchema).optional();
const WhatsAppAckReactionSchema = z.object({
	emoji: z.string().optional(),
	direct: z.boolean().optional().default(true),
	group: z.enum([
		"always",
		"mentions",
		"never"
	]).optional().default("mentions")
}).strict().optional();
const WhatsAppSharedSchema = z.object({
	enabled: z.boolean().optional(),
	capabilities: z.array(z.string()).optional(),
	markdown: MarkdownConfigSchema,
	configWrites: z.boolean().optional(),
	sendReadReceipts: z.boolean().optional(),
	messagePrefix: z.string().optional(),
	responsePrefix: z.string().optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	selfChatMode: z.boolean().optional(),
	allowFrom: z.array(z.string()).optional(),
	defaultTo: z.string().optional(),
	groupAllowFrom: z.array(z.string()).optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	historyLimit: z.number().int().min(0).optional(),
	dmHistoryLimit: z.number().int().min(0).optional(),
	dms: z.record(z.string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: z.number().int().positive().optional(),
	chunkMode: z.enum(["length", "newline"]).optional(),
	blockStreaming: z.boolean().optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	groups: WhatsAppGroupsSchema,
	ackReaction: WhatsAppAckReactionSchema,
	debounceMs: z.number().int().nonnegative().optional().default(0),
	heartbeat: ChannelHeartbeatVisibilitySchema,
	healthMonitor: ChannelHealthMonitorSchema
});
function enforceOpenDmPolicyAllowFromStar(params) {
	if (params.dmPolicy !== "open") return;
	if ((Array.isArray(params.allowFrom) ? params.allowFrom : []).map((v) => String(v).trim()).filter(Boolean).includes("*")) return;
	params.ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: params.path ?? ["allowFrom"],
		message: params.message
	});
}
function enforceAllowlistDmPolicyAllowFrom(params) {
	if (params.dmPolicy !== "allowlist") return;
	if ((Array.isArray(params.allowFrom) ? params.allowFrom : []).map((v) => String(v).trim()).filter(Boolean).length > 0) return;
	params.ctx.addIssue({
		code: z.ZodIssueCode.custom,
		path: params.path ?? ["allowFrom"],
		message: params.message
	});
}
const WhatsAppAccountSchema = WhatsAppSharedSchema.extend({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	authDir: z.string().optional(),
	mediaMaxMb: z.number().int().positive().optional()
}).strict();
const WhatsAppConfigSchema = WhatsAppSharedSchema.extend({
	accounts: z.record(z.string(), WhatsAppAccountSchema.optional()).optional(),
	defaultAccount: z.string().optional(),
	mediaMaxMb: z.number().int().positive().optional().default(50),
	actions: z.object({
		reactions: z.boolean().optional(),
		sendMessage: z.boolean().optional(),
		polls: z.boolean().optional()
	}).strict().optional()
}).strict().superRefine((value, ctx) => {
	enforceOpenDmPolicyAllowFromStar({
		dmPolicy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		message: "channels.whatsapp.dmPolicy=\"open\" requires channels.whatsapp.allowFrom to include \"*\""
	});
	enforceAllowlistDmPolicyAllowFrom({
		dmPolicy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		message: "channels.whatsapp.dmPolicy=\"allowlist\" requires channels.whatsapp.allowFrom to contain at least one sender ID"
	});
	if (!value.accounts) return;
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
		const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
		enforceOpenDmPolicyAllowFromStar({
			dmPolicy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.whatsapp.accounts.*.dmPolicy=\"open\" requires channels.whatsapp.accounts.*.allowFrom (or channels.whatsapp.allowFrom) to include \"*\""
		});
		enforceAllowlistDmPolicyAllowFrom({
			dmPolicy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.whatsapp.accounts.*.dmPolicy=\"allowlist\" requires channels.whatsapp.accounts.*.allowFrom (or channels.whatsapp.allowFrom) to contain at least one sender ID"
		});
	}
});
//#endregion
export { WhatsAppConfigSchema as t };
