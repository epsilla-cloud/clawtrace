import { S as sleep } from "../../utils-BfvDpbwh.js";
import { t as definePluginEntry } from "../../plugin-entry-BFhzQSoP.js";
import "../../api-CVW3u_qN.js";
import { a as resolveUserPath, c as validateProviderConfig, i as setupTailscaleExposureRoute, n as cleanupTailscaleExposureRoute, o as VoiceCallConfigSchema, r as getTailscaleSelfInfo, s as resolveVoiceCallConfig, t as createVoiceCallRuntime } from "../../runtime-entry-DDTMVa7c.js";
import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";
import { format } from "node:util";
import { Type } from "@sinclair/typebox";
//#region extensions/voice-call/src/cli.ts
function writeStdoutLine(...values) {
	process.stdout.write(`${format(...values)}\n`);
}
function writeStdoutJson(value) {
	process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function resolveMode(input) {
	const raw = input.trim().toLowerCase();
	if (raw === "serve" || raw === "off") return raw;
	return "funnel";
}
function resolveDefaultStorePath(config) {
	const resolvedPreferred = resolveUserPath(path.join(os.homedir(), ".openclaw", "voice-calls"));
	const existing = [resolvedPreferred].find((dir) => {
		try {
			return fsSync.existsSync(path.join(dir, "calls.jsonl")) || fsSync.existsSync(dir);
		} catch {
			return false;
		}
	}) ?? resolvedPreferred;
	const base = config.store?.trim() ? resolveUserPath(config.store) : existing;
	return path.join(base, "calls.jsonl");
}
function percentile(values, p) {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(p / 100 * sorted.length) - 1))] ?? 0;
}
function summarizeSeries(values) {
	if (values.length === 0) return {
		count: 0,
		minMs: 0,
		maxMs: 0,
		avgMs: 0,
		p50Ms: 0,
		p95Ms: 0
	};
	const minMs = values.reduce((min, value) => value < min ? value : min, Number.POSITIVE_INFINITY);
	const maxMs = values.reduce((max, value) => value > max ? value : max, Number.NEGATIVE_INFINITY);
	const avgMs = values.reduce((sum, value) => sum + value, 0) / values.length;
	return {
		count: values.length,
		minMs,
		maxMs,
		avgMs,
		p50Ms: percentile(values, 50),
		p95Ms: percentile(values, 95)
	};
}
function resolveCallMode(mode) {
	return mode === "notify" || mode === "conversation" ? mode : void 0;
}
async function initiateCallAndPrintId(params) {
	const result = await params.runtime.manager.initiateCall(params.to, void 0, {
		message: params.message,
		mode: resolveCallMode(params.mode)
	});
	if (!result.success) throw new Error(result.error || "initiate failed");
	writeStdoutJson({ callId: result.callId });
}
function registerVoiceCallCli(params) {
	const { program, config, ensureRuntime, logger } = params;
	const root = program.command("voicecall").description("Voice call utilities").addHelpText("after", () => `\nDocs: https://docs.openclaw.ai/cli/voicecall\n`);
	root.command("call").description("Initiate an outbound voice call").requiredOption("-m, --message <text>", "Message to speak when call connects").option("-t, --to <phone>", "Phone number to call (E.164 format, uses config toNumber if not set)").option("--mode <mode>", "Call mode: notify (hangup after message) or conversation (stay open)", "conversation").action(async (options) => {
		const rt = await ensureRuntime();
		const to = options.to ?? rt.config.toNumber;
		if (!to) throw new Error("Missing --to and no toNumber configured");
		await initiateCallAndPrintId({
			runtime: rt,
			to,
			message: options.message,
			mode: options.mode
		});
	});
	root.command("start").description("Alias for voicecall call").requiredOption("--to <phone>", "Phone number to call").option("--message <text>", "Message to speak when call connects").option("--mode <mode>", "Call mode: notify (hangup after message) or conversation (stay open)", "conversation").action(async (options) => {
		await initiateCallAndPrintId({
			runtime: await ensureRuntime(),
			to: options.to,
			message: options.message,
			mode: options.mode
		});
	});
	root.command("continue").description("Speak a message and wait for a response").requiredOption("--call-id <id>", "Call ID").requiredOption("--message <text>", "Message to speak").action(async (options) => {
		const result = await (await ensureRuntime()).manager.continueCall(options.callId, options.message);
		if (!result.success) throw new Error(result.error || "continue failed");
		writeStdoutJson(result);
	});
	root.command("speak").description("Speak a message without waiting for response").requiredOption("--call-id <id>", "Call ID").requiredOption("--message <text>", "Message to speak").action(async (options) => {
		const result = await (await ensureRuntime()).manager.speak(options.callId, options.message);
		if (!result.success) throw new Error(result.error || "speak failed");
		writeStdoutJson(result);
	});
	root.command("end").description("Hang up an active call").requiredOption("--call-id <id>", "Call ID").action(async (options) => {
		const result = await (await ensureRuntime()).manager.endCall(options.callId);
		if (!result.success) throw new Error(result.error || "end failed");
		writeStdoutJson(result);
	});
	root.command("status").description("Show call status").requiredOption("--call-id <id>", "Call ID").action(async (options) => {
		writeStdoutJson((await ensureRuntime()).manager.getCall(options.callId) ?? { found: false });
	});
	root.command("tail").description("Tail voice-call JSONL logs (prints new lines; useful during provider tests)").option("--file <path>", "Path to calls.jsonl", resolveDefaultStorePath(config)).option("--since <n>", "Print last N lines first", "25").option("--poll <ms>", "Poll interval in ms", "250").action(async (options) => {
		const file = options.file;
		const since = Math.max(0, Number(options.since ?? 0));
		const pollMs = Math.max(50, Number(options.poll ?? 250));
		if (!fsSync.existsSync(file)) {
			logger.error(`No log file at ${file}`);
			process.exit(1);
		}
		const initial = fsSync.readFileSync(file, "utf8");
		const lines = initial.split("\n").filter(Boolean);
		for (const line of lines.slice(Math.max(0, lines.length - since))) writeStdoutLine(line);
		let offset = Buffer.byteLength(initial, "utf8");
		for (;;) {
			try {
				const stat = fsSync.statSync(file);
				if (stat.size < offset) offset = 0;
				if (stat.size > offset) {
					const fd = fsSync.openSync(file, "r");
					try {
						const buf = Buffer.alloc(stat.size - offset);
						fsSync.readSync(fd, buf, 0, buf.length, offset);
						offset = stat.size;
						const text = buf.toString("utf8");
						for (const line of text.split("\n").filter(Boolean)) writeStdoutLine(line);
					} finally {
						fsSync.closeSync(fd);
					}
				}
			} catch {}
			await sleep(pollMs);
		}
	});
	root.command("latency").description("Summarize turn latency metrics from voice-call JSONL logs").option("--file <path>", "Path to calls.jsonl", resolveDefaultStorePath(config)).option("--last <n>", "Analyze last N records", "200").action(async (options) => {
		const file = options.file;
		const last = Math.max(1, Number(options.last ?? 200));
		if (!fsSync.existsSync(file)) throw new Error("No log file at " + file);
		const lines = fsSync.readFileSync(file, "utf8").split("\n").filter(Boolean).slice(-last);
		const turnLatencyMs = [];
		const listenWaitMs = [];
		for (const line of lines) try {
			const parsed = JSON.parse(line);
			const latency = parsed.metadata?.lastTurnLatencyMs;
			const listenWait = parsed.metadata?.lastTurnListenWaitMs;
			if (typeof latency === "number" && Number.isFinite(latency)) turnLatencyMs.push(latency);
			if (typeof listenWait === "number" && Number.isFinite(listenWait)) listenWaitMs.push(listenWait);
		} catch {}
		writeStdoutJson({
			recordsScanned: lines.length,
			turnLatency: summarizeSeries(turnLatencyMs),
			listenWait: summarizeSeries(listenWaitMs)
		});
	});
	root.command("expose").description("Enable/disable Tailscale serve/funnel for the webhook").option("--mode <mode>", "off | serve (tailnet) | funnel (public)", "funnel").option("--path <path>", "Tailscale path to expose (recommend matching serve.path)").option("--port <port>", "Local webhook port").option("--serve-path <path>", "Local webhook path").action(async (options) => {
		const mode = resolveMode(options.mode ?? "funnel");
		const servePort = Number(options.port ?? config.serve.port ?? 3334);
		const servePath = String(options.servePath ?? config.serve.path ?? "/voice/webhook");
		const tsPath = String(options.path ?? config.tailscale?.path ?? servePath);
		const localUrl = `http://127.0.0.1:${servePort}`;
		if (mode === "off") {
			await cleanupTailscaleExposureRoute({
				mode: "serve",
				path: tsPath
			});
			await cleanupTailscaleExposureRoute({
				mode: "funnel",
				path: tsPath
			});
			writeStdoutJson({
				ok: true,
				mode: "off",
				path: tsPath
			});
			return;
		}
		const publicUrl = await setupTailscaleExposureRoute({
			mode,
			path: tsPath,
			localUrl
		});
		const tsInfo = publicUrl ? null : await getTailscaleSelfInfo();
		const enableUrl = tsInfo?.nodeId ? `https://login.tailscale.com/f/${mode}?node=${tsInfo.nodeId}` : null;
		writeStdoutJson({
			ok: Boolean(publicUrl),
			mode,
			path: tsPath,
			localUrl,
			publicUrl,
			hint: publicUrl ? void 0 : {
				note: "Tailscale serve/funnel may be disabled on this tailnet (or require admin enable).",
				enableUrl
			}
		});
	});
}
//#endregion
//#region extensions/voice-call/index.ts
const voiceCallConfigSchema = {
	parse(value) {
		const raw = value && typeof value === "object" && !Array.isArray(value) ? value : {};
		const twilio = raw.twilio;
		const legacyFrom = typeof twilio?.from === "string" ? twilio.from : void 0;
		const enabled = typeof raw.enabled === "boolean" ? raw.enabled : true;
		const provider = (raw.provider === "log" ? "mock" : raw.provider) ?? (enabled ? "mock" : void 0);
		return VoiceCallConfigSchema.parse({
			...raw,
			enabled,
			provider,
			fromNumber: raw.fromNumber ?? legacyFrom
		});
	},
	uiHints: {
		provider: {
			label: "Provider",
			help: "Use twilio, telnyx, or mock for dev/no-network."
		},
		fromNumber: {
			label: "From Number",
			placeholder: "+15550001234"
		},
		toNumber: {
			label: "Default To Number",
			placeholder: "+15550001234"
		},
		inboundPolicy: { label: "Inbound Policy" },
		allowFrom: { label: "Inbound Allowlist" },
		inboundGreeting: {
			label: "Inbound Greeting",
			advanced: true
		},
		"telnyx.apiKey": {
			label: "Telnyx API Key",
			sensitive: true
		},
		"telnyx.connectionId": { label: "Telnyx Connection ID" },
		"telnyx.publicKey": {
			label: "Telnyx Public Key",
			sensitive: true
		},
		"twilio.accountSid": { label: "Twilio Account SID" },
		"twilio.authToken": {
			label: "Twilio Auth Token",
			sensitive: true
		},
		"outbound.defaultMode": { label: "Default Call Mode" },
		"outbound.notifyHangupDelaySec": {
			label: "Notify Hangup Delay (sec)",
			advanced: true
		},
		"serve.port": { label: "Webhook Port" },
		"serve.bind": { label: "Webhook Bind" },
		"serve.path": { label: "Webhook Path" },
		"tailscale.mode": {
			label: "Tailscale Mode",
			advanced: true
		},
		"tailscale.path": {
			label: "Tailscale Path",
			advanced: true
		},
		"tunnel.provider": {
			label: "Tunnel Provider",
			advanced: true
		},
		"tunnel.ngrokAuthToken": {
			label: "ngrok Auth Token",
			sensitive: true,
			advanced: true
		},
		"tunnel.ngrokDomain": {
			label: "ngrok Domain",
			advanced: true
		},
		"tunnel.allowNgrokFreeTierLoopbackBypass": {
			label: "Allow ngrok Free Tier (Loopback Bypass)",
			advanced: true
		},
		"streaming.enabled": {
			label: "Enable Streaming",
			advanced: true
		},
		"streaming.openaiApiKey": {
			label: "OpenAI Realtime API Key",
			sensitive: true,
			advanced: true
		},
		"streaming.sttModel": {
			label: "Realtime STT Model",
			advanced: true
		},
		"streaming.streamPath": {
			label: "Media Stream Path",
			advanced: true
		},
		"tts.provider": {
			label: "TTS Provider Override",
			help: "Deep-merges with messages.tts (Microsoft is ignored for calls).",
			advanced: true
		},
		"tts.openai.model": {
			label: "OpenAI TTS Model",
			advanced: true
		},
		"tts.openai.voice": {
			label: "OpenAI TTS Voice",
			advanced: true
		},
		"tts.openai.apiKey": {
			label: "OpenAI API Key",
			sensitive: true,
			advanced: true
		},
		"tts.elevenlabs.modelId": {
			label: "ElevenLabs Model ID",
			advanced: true
		},
		"tts.elevenlabs.voiceId": {
			label: "ElevenLabs Voice ID",
			advanced: true
		},
		"tts.elevenlabs.apiKey": {
			label: "ElevenLabs API Key",
			sensitive: true,
			advanced: true
		},
		"tts.elevenlabs.baseUrl": {
			label: "ElevenLabs Base URL",
			advanced: true
		},
		publicUrl: {
			label: "Public Webhook URL",
			advanced: true
		},
		skipSignatureVerification: {
			label: "Skip Signature Verification",
			advanced: true
		},
		store: {
			label: "Call Log Store Path",
			advanced: true
		},
		responseModel: {
			label: "Response Model",
			advanced: true
		},
		responseSystemPrompt: {
			label: "Response System Prompt",
			advanced: true
		},
		responseTimeoutMs: {
			label: "Response Timeout (ms)",
			advanced: true
		}
	}
};
const VoiceCallToolSchema = Type.Union([
	Type.Object({
		action: Type.Literal("initiate_call"),
		to: Type.Optional(Type.String({ description: "Call target" })),
		message: Type.String({ description: "Intro message" }),
		mode: Type.Optional(Type.Union([Type.Literal("notify"), Type.Literal("conversation")]))
	}),
	Type.Object({
		action: Type.Literal("continue_call"),
		callId: Type.String({ description: "Call ID" }),
		message: Type.String({ description: "Follow-up message" })
	}),
	Type.Object({
		action: Type.Literal("speak_to_user"),
		callId: Type.String({ description: "Call ID" }),
		message: Type.String({ description: "Message to speak" })
	}),
	Type.Object({
		action: Type.Literal("end_call"),
		callId: Type.String({ description: "Call ID" })
	}),
	Type.Object({
		action: Type.Literal("get_status"),
		callId: Type.String({ description: "Call ID" })
	}),
	Type.Object({
		mode: Type.Optional(Type.Union([Type.Literal("call"), Type.Literal("status")])),
		to: Type.Optional(Type.String({ description: "Call target" })),
		sid: Type.Optional(Type.String({ description: "Call SID" })),
		message: Type.Optional(Type.String({ description: "Optional intro message" }))
	})
]);
var voice_call_default = definePluginEntry({
	id: "voice-call",
	name: "Voice Call",
	description: "Voice-call plugin with Telnyx/Twilio/Plivo providers",
	configSchema: voiceCallConfigSchema,
	register(api) {
		const config = resolveVoiceCallConfig(voiceCallConfigSchema.parse(api.pluginConfig));
		const validation = validateProviderConfig(config);
		if (api.pluginConfig && typeof api.pluginConfig === "object") {
			const raw = api.pluginConfig;
			const twilio = raw.twilio;
			if (raw.provider === "log") api.logger.warn("[voice-call] provider \"log\" is deprecated; use \"mock\" instead");
			if (typeof twilio?.from === "string") api.logger.warn("[voice-call] twilio.from is deprecated; use fromNumber instead");
		}
		let runtimePromise = null;
		let runtime = null;
		const ensureRuntime = async () => {
			if (!config.enabled) throw new Error("Voice call disabled in plugin config");
			if (!validation.valid) throw new Error(validation.errors.join("; "));
			if (runtime) return runtime;
			if (!runtimePromise) runtimePromise = createVoiceCallRuntime({
				config,
				coreConfig: api.config,
				agentRuntime: api.runtime.agent,
				ttsRuntime: api.runtime.tts,
				logger: api.logger
			});
			try {
				runtime = await runtimePromise;
			} catch (err) {
				runtimePromise = null;
				throw err;
			}
			return runtime;
		};
		const sendError = (respond, err) => {
			respond(false, { error: err instanceof Error ? err.message : String(err) });
		};
		const resolveCallMessageRequest = async (params) => {
			const callId = typeof params?.callId === "string" ? params.callId.trim() : "";
			const message = typeof params?.message === "string" ? params.message.trim() : "";
			if (!callId || !message) return { error: "callId and message required" };
			return {
				rt: await ensureRuntime(),
				callId,
				message
			};
		};
		const initiateCallAndRespond = async (params) => {
			const result = await params.rt.manager.initiateCall(params.to, void 0, {
				message: params.message,
				mode: params.mode
			});
			if (!result.success) {
				params.respond(false, { error: result.error || "initiate failed" });
				return;
			}
			params.respond(true, {
				callId: result.callId,
				initiated: true
			});
		};
		const respondToCallMessageAction = async (params) => {
			const request = await resolveCallMessageRequest(params.requestParams);
			if ("error" in request) {
				params.respond(false, { error: request.error });
				return;
			}
			const result = await params.action(request);
			if (!result.success) {
				params.respond(false, { error: result.error || params.failure });
				return;
			}
			params.respond(true, params.includeTranscript ? {
				success: true,
				transcript: result.transcript
			} : { success: true });
		};
		api.registerGatewayMethod("voicecall.initiate", async ({ params, respond }) => {
			try {
				const message = typeof params?.message === "string" ? params.message.trim() : "";
				if (!message) {
					respond(false, { error: "message required" });
					return;
				}
				const rt = await ensureRuntime();
				const to = typeof params?.to === "string" && params.to.trim() ? params.to.trim() : rt.config.toNumber;
				if (!to) {
					respond(false, { error: "to required" });
					return;
				}
				await initiateCallAndRespond({
					rt,
					respond,
					to,
					message,
					mode: params?.mode === "notify" || params?.mode === "conversation" ? params.mode : void 0
				});
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("voicecall.continue", async ({ params, respond }) => {
			try {
				await respondToCallMessageAction({
					requestParams: params,
					respond,
					action: (request) => request.rt.manager.continueCall(request.callId, request.message),
					failure: "continue failed",
					includeTranscript: true
				});
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("voicecall.speak", async ({ params, respond }) => {
			try {
				await respondToCallMessageAction({
					requestParams: params,
					respond,
					action: (request) => request.rt.manager.speak(request.callId, request.message),
					failure: "speak failed"
				});
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("voicecall.end", async ({ params, respond }) => {
			try {
				const callId = typeof params?.callId === "string" ? params.callId.trim() : "";
				if (!callId) {
					respond(false, { error: "callId required" });
					return;
				}
				const result = await (await ensureRuntime()).manager.endCall(callId);
				if (!result.success) {
					respond(false, { error: result.error || "end failed" });
					return;
				}
				respond(true, { success: true });
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("voicecall.status", async ({ params, respond }) => {
			try {
				const raw = typeof params?.callId === "string" ? params.callId.trim() : typeof params?.sid === "string" ? params.sid.trim() : "";
				if (!raw) {
					respond(false, { error: "callId required" });
					return;
				}
				const rt = await ensureRuntime();
				const call = rt.manager.getCall(raw) || rt.manager.getCallByProviderCallId(raw);
				if (!call) {
					respond(true, { found: false });
					return;
				}
				respond(true, {
					found: true,
					call
				});
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerGatewayMethod("voicecall.start", async ({ params, respond }) => {
			try {
				const to = typeof params?.to === "string" ? params.to.trim() : "";
				const message = typeof params?.message === "string" ? params.message.trim() : "";
				if (!to) {
					respond(false, { error: "to required" });
					return;
				}
				await initiateCallAndRespond({
					rt: await ensureRuntime(),
					respond,
					to,
					message: message || void 0
				});
			} catch (err) {
				sendError(respond, err);
			}
		});
		api.registerTool({
			name: "voice_call",
			label: "Voice Call",
			description: "Make phone calls and have voice conversations via the voice-call plugin.",
			parameters: VoiceCallToolSchema,
			async execute(_toolCallId, params) {
				const json = (payload) => ({
					content: [{
						type: "text",
						text: JSON.stringify(payload, null, 2)
					}],
					details: payload
				});
				try {
					const rt = await ensureRuntime();
					if (typeof params?.action === "string") switch (params.action) {
						case "initiate_call": {
							const message = String(params.message || "").trim();
							if (!message) throw new Error("message required");
							const to = typeof params.to === "string" && params.to.trim() ? params.to.trim() : rt.config.toNumber;
							if (!to) throw new Error("to required");
							const result = await rt.manager.initiateCall(to, void 0, {
								message,
								mode: params.mode === "notify" || params.mode === "conversation" ? params.mode : void 0
							});
							if (!result.success) throw new Error(result.error || "initiate failed");
							return json({
								callId: result.callId,
								initiated: true
							});
						}
						case "continue_call": {
							const callId = String(params.callId || "").trim();
							const message = String(params.message || "").trim();
							if (!callId || !message) throw new Error("callId and message required");
							const result = await rt.manager.continueCall(callId, message);
							if (!result.success) throw new Error(result.error || "continue failed");
							return json({
								success: true,
								transcript: result.transcript
							});
						}
						case "speak_to_user": {
							const callId = String(params.callId || "").trim();
							const message = String(params.message || "").trim();
							if (!callId || !message) throw new Error("callId and message required");
							const result = await rt.manager.speak(callId, message);
							if (!result.success) throw new Error(result.error || "speak failed");
							return json({ success: true });
						}
						case "end_call": {
							const callId = String(params.callId || "").trim();
							if (!callId) throw new Error("callId required");
							const result = await rt.manager.endCall(callId);
							if (!result.success) throw new Error(result.error || "end failed");
							return json({ success: true });
						}
						case "get_status": {
							const callId = String(params.callId || "").trim();
							if (!callId) throw new Error("callId required");
							const call = rt.manager.getCall(callId) || rt.manager.getCallByProviderCallId(callId);
							return json(call ? {
								found: true,
								call
							} : { found: false });
						}
					}
					if ((params?.mode ?? "call") === "status") {
						const sid = typeof params.sid === "string" ? params.sid.trim() : "";
						if (!sid) throw new Error("sid required for status");
						const call = rt.manager.getCall(sid) || rt.manager.getCallByProviderCallId(sid);
						return json(call ? {
							found: true,
							call
						} : { found: false });
					}
					const to = typeof params.to === "string" && params.to.trim() ? params.to.trim() : rt.config.toNumber;
					if (!to) throw new Error("to required for call");
					const result = await rt.manager.initiateCall(to, void 0, { message: typeof params.message === "string" && params.message.trim() ? params.message.trim() : void 0 });
					if (!result.success) throw new Error(result.error || "initiate failed");
					return json({
						callId: result.callId,
						initiated: true
					});
				} catch (err) {
					return json({ error: err instanceof Error ? err.message : String(err) });
				}
			}
		});
		api.registerCli(({ program }) => registerVoiceCallCli({
			program,
			config,
			ensureRuntime,
			logger: api.logger
		}), { commands: ["voicecall"] });
		api.registerService({
			id: "voicecall",
			start: async () => {
				if (!config.enabled) return;
				try {
					await ensureRuntime();
				} catch (err) {
					api.logger.error(`[voice-call] Failed to start runtime: ${err instanceof Error ? err.message : String(err)}`);
				}
			},
			stop: async () => {
				if (!runtimePromise) return;
				try {
					await (await runtimePromise).stop();
				} finally {
					runtimePromise = null;
					runtime = null;
				}
			}
		});
	}
});
//#endregion
export { voice_call_default as default };
