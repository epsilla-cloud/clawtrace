import { m as defaultRuntime } from "./subsystem-CJEvHE2o.js";
import { t as formatDocsLink } from "./links-CNsP_rfF.js";
import { n as isRich, r as theme, t as colorize } from "./theme-D-TumEpz.js";
import { Ky as addGatewayClientOptions, hT as parseAbsoluteTimeMs, oT as resolveCronStaggerMs, qy as callGatewayFromCli } from "./auth-profiles-B5ypC5S-.js";
import { f as sanitizeAgentId } from "./session-key-BhxcMJEE.js";
import { t as danger } from "./globals-0H99T-Tx.js";
import { n as listChannelPlugins } from "./plugins-BQ9CTy5q.js";
import { n as formatDurationHuman } from "./format-duration-QPQGNRFx.js";
import { n as parsePositiveIntOrUndefined } from "./helpers-Cza5XHbK.js";
//#region src/infra/format-time/parse-offsetless-zoned-datetime.ts
const OFFSETLESS_ISO_DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?$/;
const OFFSETLESS_ISO_DATETIME_PARTS_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/;
function isOffsetlessIsoDateTime(raw) {
	return OFFSETLESS_ISO_DATETIME_RE.test(raw);
}
function parseOffsetlessIsoDateTimeInTimeZone(raw, timeZone) {
	const expectedParts = parseOffsetlessIsoDateTimeParts(raw);
	if (!expectedParts) return null;
	try {
		getZonedDateTimeParts(Date.now(), timeZone);
		const naiveMs = (/* @__PURE__ */ new Date(`${raw}Z`)).getTime();
		if (Number.isNaN(naiveMs)) return null;
		const resolvedMs = naiveMs - getTimeZoneOffsetMs(naiveMs - getTimeZoneOffsetMs(naiveMs, timeZone), timeZone);
		if (!matchesOffsetlessIsoDateTimeParts(resolvedMs, timeZone, expectedParts)) return null;
		return new Date(resolvedMs).toISOString();
	} catch {
		return null;
	}
}
function parseOffsetlessIsoDateTimeParts(raw) {
	const match = OFFSETLESS_ISO_DATETIME_PARTS_RE.exec(raw);
	if (!match) return null;
	const fractionalMs = (match[7] ?? "").padEnd(3, "0").slice(0, 3);
	return {
		year: Number.parseInt(match[1] ?? "0", 10),
		month: Number.parseInt(match[2] ?? "0", 10),
		day: Number.parseInt(match[3] ?? "0", 10),
		hour: Number.parseInt(match[4] ?? "0", 10),
		minute: Number.parseInt(match[5] ?? "0", 10),
		second: Number.parseInt(match[6] ?? "0", 10),
		millisecond: Number.parseInt(fractionalMs || "0", 10)
	};
}
function matchesOffsetlessIsoDateTimeParts(utcMs, timeZone, expected) {
	const actual = getZonedDateTimeParts(utcMs, timeZone);
	return actual.year === expected.year && actual.month === expected.month && actual.day === expected.day && actual.hour === expected.hour && actual.minute === expected.minute && actual.second === expected.second && actual.millisecond === expected.millisecond;
}
function getTimeZoneOffsetMs(utcMs, timeZone) {
	const parts = getZonedDateTimeParts(utcMs, timeZone);
	return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - utcMs;
}
function getZonedDateTimeParts(utcMs, timeZone) {
	const utcDate = new Date(utcMs);
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
		hourCycle: "h23"
	}).formatToParts(utcDate);
	const getNumericPart = (type) => {
		const part = parts.find((candidate) => candidate.type === type);
		return Number.parseInt(part?.value ?? "0", 10);
	};
	return {
		year: getNumericPart("year"),
		month: getNumericPart("month"),
		day: getNumericPart("day"),
		hour: getNumericPart("hour"),
		minute: getNumericPart("minute"),
		second: getNumericPart("second"),
		millisecond: utcDate.getUTCMilliseconds()
	};
}
//#endregion
//#region src/cli/cron-cli/shared.ts
const getCronChannelOptions = () => ["last", ...listChannelPlugins().map((plugin) => plugin.id)].join("|");
function printCronJson(value) {
	defaultRuntime.writeJson(value);
}
function handleCronCliError(err) {
	defaultRuntime.error(danger(String(err)));
	defaultRuntime.exit(1);
}
async function warnIfCronSchedulerDisabled(opts) {
	try {
		const res = await callGatewayFromCli("cron.status", opts, {});
		if (res?.enabled === true) return;
		const store = typeof res?.storePath === "string" ? res.storePath : "";
		defaultRuntime.error([
			"warning: cron scheduler is disabled in the Gateway; jobs are saved but will not run automatically.",
			"Re-enable with `cron.enabled: true` (or remove `cron.enabled: false`) and restart the Gateway.",
			store ? `store: ${store}` : ""
		].filter(Boolean).join("\n"));
	} catch {}
}
function parseDurationMs(input) {
	const raw = input.trim();
	if (!raw) return null;
	const match = raw.match(/^(\d+(?:\.\d+)?)(ms|s|m|h|d)$/i);
	if (!match) return null;
	const n = Number.parseFloat(match[1] ?? "");
	if (!Number.isFinite(n) || n <= 0) return null;
	const unit = (match[2] ?? "").toLowerCase();
	return Math.floor(n * (unit === "ms" ? 1 : unit === "s" ? 1e3 : unit === "m" ? 6e4 : unit === "h" ? 36e5 : 864e5));
}
function parseCronStaggerMs(params) {
	if (params.useExact) return 0;
	if (!params.staggerRaw) return;
	const parsed = parseDurationMs(params.staggerRaw);
	if (!parsed) throw new Error("Invalid --stagger; use e.g. 30s, 1m, 5m");
	return parsed;
}
/**
* Parse a one-shot `--at` value into an ISO string (UTC).
*
* When `tz` is provided and the input is an offset-less datetime
* (e.g. `2026-03-23T23:00:00`), the datetime is interpreted in
* that IANA timezone instead of UTC.
*/
function parseAt(input, tz) {
	const raw = input.trim();
	if (!raw) return null;
	if (tz && isOffsetlessIsoDateTime(raw)) return parseOffsetlessIsoDateTimeInTimeZone(raw, tz);
	const absolute = parseAbsoluteTimeMs(raw);
	if (absolute !== null) return new Date(absolute).toISOString();
	const dur = parseDurationMs(raw);
	if (dur !== null) return new Date(Date.now() + dur).toISOString();
	return null;
}
const CRON_ID_PAD = 36;
const CRON_NAME_PAD = 24;
const CRON_SCHEDULE_PAD = 32;
const CRON_NEXT_PAD = 10;
const CRON_LAST_PAD = 10;
const CRON_STATUS_PAD = 9;
const CRON_TARGET_PAD = 9;
const CRON_AGENT_PAD = 10;
const CRON_MODEL_PAD = 20;
const pad = (value, width) => value.padEnd(width);
const truncate = (value, width) => {
	if (value.length <= width) return value;
	if (width <= 3) return value.slice(0, width);
	return `${value.slice(0, width - 3)}...`;
};
const formatIsoMinute = (iso) => {
	const parsed = parseAbsoluteTimeMs(iso);
	const d = new Date(parsed ?? NaN);
	if (Number.isNaN(d.getTime())) return "-";
	const isoStr = d.toISOString();
	return `${isoStr.slice(0, 10)} ${isoStr.slice(11, 16)}Z`;
};
const formatSpan = (ms) => {
	if (ms < 6e4) return "<1m";
	if (ms < 36e5) return `${Math.round(ms / 6e4)}m`;
	if (ms < 864e5) return `${Math.round(ms / 36e5)}h`;
	return `${Math.round(ms / 864e5)}d`;
};
const formatRelative = (ms, nowMs) => {
	if (!ms) return "-";
	const delta = ms - nowMs;
	const label = formatSpan(Math.abs(delta));
	return delta >= 0 ? `in ${label}` : `${label} ago`;
};
const formatSchedule = (schedule) => {
	if (schedule.kind === "at") return `at ${formatIsoMinute(schedule.at)}`;
	if (schedule.kind === "every") return `every ${formatDurationHuman(schedule.everyMs)}`;
	const base = schedule.tz ? `cron ${schedule.expr} @ ${schedule.tz}` : `cron ${schedule.expr}`;
	const staggerMs = resolveCronStaggerMs(schedule);
	if (staggerMs <= 0) return `${base} (exact)`;
	return `${base} (stagger ${formatDurationHuman(staggerMs)})`;
};
const formatStatus = (job) => {
	if (!job.enabled) return "disabled";
	if (job.state.runningAtMs) return "running";
	return job.state.lastStatus ?? "idle";
};
function printCronList(jobs, runtime = defaultRuntime) {
	if (jobs.length === 0) {
		runtime.log("No cron jobs.");
		return;
	}
	const rich = isRich();
	const header = [
		pad("ID", CRON_ID_PAD),
		pad("Name", CRON_NAME_PAD),
		pad("Schedule", CRON_SCHEDULE_PAD),
		pad("Next", CRON_NEXT_PAD),
		pad("Last", CRON_LAST_PAD),
		pad("Status", CRON_STATUS_PAD),
		pad("Target", CRON_TARGET_PAD),
		pad("Agent ID", CRON_AGENT_PAD),
		pad("Model", CRON_MODEL_PAD)
	].join(" ");
	runtime.log(rich ? theme.heading(header) : header);
	const now = Date.now();
	for (const job of jobs) {
		const idLabel = pad(job.id, CRON_ID_PAD);
		const nameLabel = pad(truncate(job.name, CRON_NAME_PAD), CRON_NAME_PAD);
		const scheduleLabel = pad(truncate(formatSchedule(job.schedule), CRON_SCHEDULE_PAD), CRON_SCHEDULE_PAD);
		const nextLabel = pad(job.enabled ? formatRelative(job.state.nextRunAtMs, now) : "-", CRON_NEXT_PAD);
		const lastLabel = pad(formatRelative(job.state.lastRunAtMs, now), CRON_LAST_PAD);
		const statusRaw = formatStatus(job);
		const statusLabel = pad(statusRaw, CRON_STATUS_PAD);
		const targetLabel = pad(job.sessionTarget ?? "-", CRON_TARGET_PAD);
		const agentLabel = pad(truncate(job.agentId ?? "-", CRON_AGENT_PAD), CRON_AGENT_PAD);
		const modelLabel = pad(truncate((job.payload.kind === "agentTurn" ? job.payload.model : void 0) ?? "-", CRON_MODEL_PAD), CRON_MODEL_PAD);
		const coloredStatus = (() => {
			if (statusRaw === "ok") return colorize(rich, theme.success, statusLabel);
			if (statusRaw === "error") return colorize(rich, theme.error, statusLabel);
			if (statusRaw === "running") return colorize(rich, theme.warn, statusLabel);
			if (statusRaw === "skipped") return colorize(rich, theme.muted, statusLabel);
			return colorize(rich, theme.muted, statusLabel);
		})();
		const coloredTarget = job.sessionTarget === "main" ? colorize(rich, theme.accent, targetLabel) : colorize(rich, theme.accentBright, targetLabel);
		const coloredAgent = job.agentId ? colorize(rich, theme.info, agentLabel) : colorize(rich, theme.muted, agentLabel);
		const line = [
			colorize(rich, theme.accent, idLabel),
			colorize(rich, theme.info, nameLabel),
			colorize(rich, theme.info, scheduleLabel),
			colorize(rich, theme.muted, nextLabel),
			colorize(rich, theme.muted, lastLabel),
			coloredStatus,
			coloredTarget,
			coloredAgent,
			job.payload.kind === "agentTurn" && job.payload.model ? colorize(rich, theme.info, modelLabel) : colorize(rich, theme.muted, modelLabel)
		].join(" ");
		runtime.log(line.trimEnd());
	}
}
//#endregion
//#region src/cli/cron-cli/schedule-options.ts
function resolveCronCreateSchedule(options) {
	const normalized = normalizeScheduleOptions(options);
	if (countChosenSchedules(normalized) !== 1) throw new Error("Choose exactly one schedule: --at, --every, or --cron");
	const schedule = resolveDirectSchedule(normalized);
	if (!schedule) throw new Error("Choose exactly one schedule: --at, --every, or --cron");
	return schedule;
}
function resolveCronEditScheduleRequest(options) {
	const normalized = normalizeScheduleOptions(options);
	if (countChosenSchedules(normalized) > 1) throw new Error("Choose at most one schedule change");
	const schedule = resolveDirectSchedule(normalized);
	if (schedule) return {
		kind: "direct",
		schedule
	};
	if (normalized.requestedStaggerMs !== void 0 || normalized.tz !== void 0) return {
		kind: "patch-existing-cron",
		tz: normalized.tz,
		staggerMs: normalized.requestedStaggerMs
	};
	return { kind: "none" };
}
function applyExistingCronSchedulePatch(existingSchedule, request) {
	if (existingSchedule.kind !== "cron") throw new Error("Current job is not a cron schedule; use --cron to convert first");
	return {
		kind: "cron",
		expr: existingSchedule.expr,
		tz: request.tz ?? existingSchedule.tz,
		staggerMs: request.staggerMs !== void 0 ? request.staggerMs : existingSchedule.staggerMs
	};
}
function normalizeScheduleOptions(options) {
	const staggerRaw = readTrimmedString(options.stagger);
	const useExact = Boolean(options.exact);
	if (staggerRaw && useExact) throw new Error("Choose either --stagger or --exact, not both");
	return {
		at: readTrimmedString(options.at),
		every: readTrimmedString(options.every),
		cronExpr: readTrimmedString(options.cron),
		tz: readOptionalString(options.tz),
		requestedStaggerMs: parseCronStaggerMs({
			staggerRaw,
			useExact
		})
	};
}
function countChosenSchedules(options) {
	return [
		Boolean(options.at),
		Boolean(options.every),
		Boolean(options.cronExpr)
	].filter(Boolean).length;
}
function resolveDirectSchedule(options) {
	if (options.tz && options.every) throw new Error("--tz is only valid with --cron or offset-less --at");
	if (options.requestedStaggerMs !== void 0 && (options.at || options.every)) throw new Error("--stagger/--exact are only valid for cron schedules");
	if (options.at) {
		const atIso = parseAt(options.at, options.tz);
		if (!atIso) throw new Error("Invalid --at; use ISO time or duration like 20m");
		return {
			kind: "at",
			at: atIso
		};
	}
	if (options.every) {
		const everyMs = parseDurationMs(options.every);
		if (!everyMs) throw new Error("Invalid --every; use e.g. 10m, 1h, 1d");
		return {
			kind: "every",
			everyMs
		};
	}
	if (options.cronExpr) return {
		kind: "cron",
		expr: options.cronExpr,
		tz: options.tz,
		staggerMs: options.requestedStaggerMs
	};
}
function readOptionalString(value) {
	return readTrimmedString(value) || void 0;
}
function readTrimmedString(value) {
	return typeof value === "string" ? value.trim() : "";
}
//#endregion
//#region src/cli/cron-cli/register.cron-add.ts
function registerCronStatusCommand(cron) {
	addGatewayClientOptions(cron.command("status").description("Show cron scheduler status").option("--json", "Output JSON", false).action(async (opts) => {
		try {
			printCronJson(await callGatewayFromCli("cron.status", opts, {}));
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
function registerCronListCommand(cron) {
	addGatewayClientOptions(cron.command("list").description("List cron jobs").option("--all", "Include disabled jobs", false).option("--json", "Output JSON", false).action(async (opts) => {
		try {
			const res = await callGatewayFromCli("cron.list", opts, { includeDisabled: Boolean(opts.all) });
			if (opts.json) {
				printCronJson(res);
				return;
			}
			printCronList(res?.jobs ?? [], defaultRuntime);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
function registerCronAddCommand(cron) {
	addGatewayClientOptions(cron.command("add").alias("create").description("Add a cron job").requiredOption("--name <name>", "Job name").option("--description <text>", "Optional description").option("--disabled", "Create job disabled", false).option("--delete-after-run", "Delete one-shot job after it succeeds", false).option("--keep-after-run", "Keep one-shot job after it succeeds", false).option("--agent <id>", "Agent id for this job").option("--session <target>", "Session target (main|isolated)").option("--session-key <key>", "Session key for job routing (e.g. agent:my-agent:my-session)").option("--wake <mode>", "Wake mode (now|next-heartbeat)", "now").option("--at <when>", "Run once at time (ISO with offset, or +duration). Use --tz for offset-less datetimes").option("--every <duration>", "Run every duration (e.g. 10m, 1h)").option("--cron <expr>", "Cron expression (5-field or 6-field with seconds)").option("--tz <iana>", "Timezone for cron expressions (IANA)", "").option("--stagger <duration>", "Cron stagger window (e.g. 30s, 5m)").option("--exact", "Disable cron staggering (set stagger to 0)", false).option("--system-event <text>", "System event payload (main session)").option("--message <text>", "Agent message payload").option("--thinking <level>", "Thinking level for agent jobs (off|minimal|low|medium|high|xhigh)").option("--model <model>", "Model override for agent jobs (provider/model or alias)").option("--timeout-seconds <n>", "Timeout seconds for agent jobs").option("--light-context", "Use lightweight bootstrap context for agent jobs", false).option("--announce", "Announce summary to a chat (subagent-style)", false).option("--deliver", "Deprecated (use --announce). Announces a summary to a chat.").option("--no-deliver", "Disable announce delivery and skip main-session summary").option("--channel <channel>", `Delivery channel (${getCronChannelOptions()})`, "last").option("--to <dest>", "Delivery destination (E.164, Telegram chatId, or Discord channel/user)").option("--account <id>", "Channel account id for delivery (multi-account setups)").option("--best-effort-deliver", "Do not fail the job if delivery fails", false).option("--json", "Output JSON", false).action(async (opts, cmd) => {
		try {
			const schedule = resolveCronCreateSchedule({
				at: opts.at,
				cron: opts.cron,
				every: opts.every,
				exact: opts.exact,
				stagger: opts.stagger,
				tz: opts.tz
			});
			const wakeMode = (typeof opts.wake === "string" ? opts.wake : "now").trim() || "now";
			if (wakeMode !== "now" && wakeMode !== "next-heartbeat") throw new Error("--wake must be now or next-heartbeat");
			const agentId = typeof opts.agent === "string" && opts.agent.trim() ? sanitizeAgentId(opts.agent.trim()) : void 0;
			const hasAnnounce = Boolean(opts.announce) || opts.deliver === true;
			const hasNoDeliver = opts.deliver === false;
			if ([hasAnnounce, hasNoDeliver].filter(Boolean).length > 1) throw new Error("Choose at most one of --announce or --no-deliver");
			const payload = (() => {
				const systemEvent = typeof opts.systemEvent === "string" ? opts.systemEvent.trim() : "";
				const message = typeof opts.message === "string" ? opts.message.trim() : "";
				if ([Boolean(systemEvent), Boolean(message)].filter(Boolean).length !== 1) throw new Error("Choose exactly one payload: --system-event or --message");
				if (systemEvent) return {
					kind: "systemEvent",
					text: systemEvent
				};
				const timeoutSeconds = parsePositiveIntOrUndefined(opts.timeoutSeconds);
				return {
					kind: "agentTurn",
					message,
					model: typeof opts.model === "string" && opts.model.trim() ? opts.model.trim() : void 0,
					thinking: typeof opts.thinking === "string" && opts.thinking.trim() ? opts.thinking.trim() : void 0,
					timeoutSeconds: timeoutSeconds && Number.isFinite(timeoutSeconds) ? timeoutSeconds : void 0,
					lightContext: opts.lightContext === true ? true : void 0
				};
			})();
			const sessionSource = (typeof cmd?.getOptionValueSource === "function" ? (name) => cmd.getOptionValueSource(name) : () => void 0)("session");
			const sessionTargetRaw = typeof opts.session === "string" ? opts.session.trim() : "";
			const inferredSessionTarget = payload.kind === "agentTurn" ? "isolated" : "main";
			const sessionTarget = sessionSource === "cli" ? sessionTargetRaw || "" : inferredSessionTarget;
			const isCustomSessionTarget = sessionTarget.toLowerCase().startsWith("session:") && sessionTarget.slice(8).trim().length > 0;
			const isIsolatedLikeSessionTarget = sessionTarget === "isolated" || sessionTarget === "current" || isCustomSessionTarget;
			if (sessionTarget !== "main" && !isIsolatedLikeSessionTarget) throw new Error("--session must be main, isolated, current, or session:<id>");
			if (opts.deleteAfterRun && opts.keepAfterRun) throw new Error("Choose --delete-after-run or --keep-after-run, not both");
			if (sessionTarget === "main" && payload.kind !== "systemEvent") throw new Error("Main jobs require --system-event (systemEvent).");
			if (isIsolatedLikeSessionTarget && payload.kind !== "agentTurn") throw new Error("Isolated/current/custom-session jobs require --message (agentTurn).");
			if ((opts.announce || typeof opts.deliver === "boolean") && (!isIsolatedLikeSessionTarget || payload.kind !== "agentTurn")) throw new Error("--announce/--no-deliver require a non-main agentTurn session target.");
			const accountId = typeof opts.account === "string" && opts.account.trim() ? opts.account.trim() : void 0;
			if (accountId && (!isIsolatedLikeSessionTarget || payload.kind !== "agentTurn")) throw new Error("--account requires a non-main agentTurn job with delivery.");
			const deliveryMode = isIsolatedLikeSessionTarget && payload.kind === "agentTurn" ? hasAnnounce ? "announce" : hasNoDeliver ? "none" : "announce" : void 0;
			const name = (typeof opts.name === "string" ? opts.name : "").trim();
			if (!name) throw new Error("--name is required");
			const description = typeof opts.description === "string" && opts.description.trim() ? opts.description.trim() : void 0;
			const sessionKey = typeof opts.sessionKey === "string" && opts.sessionKey.trim() ? opts.sessionKey.trim() : void 0;
			printCronJson(await callGatewayFromCli("cron.add", opts, {
				name,
				description,
				enabled: !opts.disabled,
				deleteAfterRun: opts.deleteAfterRun ? true : opts.keepAfterRun ? false : void 0,
				agentId,
				sessionKey,
				schedule,
				sessionTarget,
				wakeMode,
				payload,
				delivery: deliveryMode ? {
					mode: deliveryMode,
					channel: typeof opts.channel === "string" && opts.channel.trim() ? opts.channel.trim() : void 0,
					to: typeof opts.to === "string" && opts.to.trim() ? opts.to.trim() : void 0,
					accountId,
					bestEffort: opts.bestEffortDeliver ? true : void 0
				} : void 0
			}));
			await warnIfCronSchedulerDisabled(opts);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
//#endregion
//#region src/cli/cron-cli/register.cron-edit.ts
const assignIf = (target, key, value, shouldAssign) => {
	if (shouldAssign) target[key] = value;
};
function registerCronEditCommand(cron) {
	addGatewayClientOptions(cron.command("edit").description("Edit a cron job (patch fields)").argument("<id>", "Job id").option("--name <name>", "Set name").option("--description <text>", "Set description").option("--enable", "Enable job", false).option("--disable", "Disable job", false).option("--delete-after-run", "Delete one-shot job after it succeeds", false).option("--keep-after-run", "Keep one-shot job after it succeeds", false).option("--session <target>", "Session target (main|isolated)").option("--agent <id>", "Set agent id").option("--clear-agent", "Unset agent and use default", false).option("--session-key <key>", "Set session key for job routing").option("--clear-session-key", "Unset session key", false).option("--wake <mode>", "Wake mode (now|next-heartbeat)").option("--at <when>", "Set one-shot time (ISO) or duration like 20m").option("--every <duration>", "Set interval duration like 10m").option("--cron <expr>", "Set cron expression").option("--tz <iana>", "Timezone for cron expressions (IANA)").option("--stagger <duration>", "Cron stagger window (e.g. 30s, 5m)").option("--exact", "Disable cron staggering (set stagger to 0)").option("--system-event <text>", "Set systemEvent payload").option("--message <text>", "Set agentTurn payload message").option("--thinking <level>", "Thinking level for agent jobs (off|minimal|low|medium|high|xhigh)").option("--model <model>", "Model override for agent jobs").option("--timeout-seconds <n>", "Timeout seconds for agent jobs").option("--light-context", "Enable lightweight bootstrap context for agent jobs").option("--no-light-context", "Disable lightweight bootstrap context for agent jobs").option("--announce", "Announce summary to a chat (subagent-style)").option("--deliver", "Deprecated (use --announce). Announces a summary to a chat.").option("--no-deliver", "Disable announce delivery").option("--channel <channel>", `Delivery channel (${getCronChannelOptions()})`).option("--to <dest>", "Delivery destination (E.164, Telegram chatId, or Discord channel/user)").option("--account <id>", "Channel account id for delivery (multi-account setups)").option("--best-effort-deliver", "Do not fail job if delivery fails").option("--no-best-effort-deliver", "Fail job when delivery fails").option("--failure-alert", "Enable failure alerts for this job").option("--no-failure-alert", "Disable failure alerts for this job").option("--failure-alert-after <n>", "Alert after N consecutive job errors").option("--failure-alert-channel <channel>", `Failure alert channel (${getCronChannelOptions()})`).option("--failure-alert-to <dest>", "Failure alert destination").option("--failure-alert-cooldown <duration>", "Minimum time between alerts (e.g. 1h, 30m)").option("--failure-alert-mode <mode>", "Failure alert delivery mode (announce or webhook)").option("--failure-alert-account-id <id>", "Account ID for failure alert channel (multi-account setups)").action(async (id, opts) => {
		try {
			if (opts.session === "main" && opts.message) throw new Error("Main jobs cannot use --message; use --system-event or --session isolated.");
			if (opts.session === "isolated" && opts.systemEvent) throw new Error("Isolated jobs cannot use --system-event; use --message or --session main.");
			if (opts.announce && typeof opts.deliver === "boolean") throw new Error("Choose --announce or --no-deliver (not multiple).");
			const patch = {};
			if (typeof opts.name === "string") patch.name = opts.name;
			if (typeof opts.description === "string") patch.description = opts.description;
			if (opts.enable && opts.disable) throw new Error("Choose --enable or --disable, not both");
			if (opts.enable) patch.enabled = true;
			if (opts.disable) patch.enabled = false;
			if (opts.deleteAfterRun && opts.keepAfterRun) throw new Error("Choose --delete-after-run or --keep-after-run, not both");
			if (opts.deleteAfterRun) patch.deleteAfterRun = true;
			if (opts.keepAfterRun) patch.deleteAfterRun = false;
			if (typeof opts.session === "string") patch.sessionTarget = opts.session;
			if (typeof opts.wake === "string") patch.wakeMode = opts.wake;
			if (opts.agent && opts.clearAgent) throw new Error("Use --agent or --clear-agent, not both");
			if (typeof opts.agent === "string" && opts.agent.trim()) patch.agentId = sanitizeAgentId(opts.agent.trim());
			if (opts.clearAgent) patch.agentId = null;
			if (opts.sessionKey && opts.clearSessionKey) throw new Error("Use --session-key or --clear-session-key, not both");
			if (typeof opts.sessionKey === "string" && opts.sessionKey.trim()) patch.sessionKey = opts.sessionKey.trim();
			if (opts.clearSessionKey) patch.sessionKey = null;
			const scheduleRequest = resolveCronEditScheduleRequest({
				at: opts.at,
				cron: opts.cron,
				every: opts.every,
				exact: opts.exact,
				stagger: opts.stagger,
				tz: opts.tz
			});
			if (scheduleRequest.kind === "direct") patch.schedule = scheduleRequest.schedule;
			else if (scheduleRequest.kind === "patch-existing-cron") {
				const existing = ((await callGatewayFromCli("cron.list", opts, { includeDisabled: true }))?.jobs ?? []).find((job) => job.id === id);
				if (!existing) throw new Error(`unknown cron job id: ${id}`);
				patch.schedule = applyExistingCronSchedulePatch(existing.schedule, scheduleRequest);
			}
			const hasSystemEventPatch = typeof opts.systemEvent === "string";
			const model = typeof opts.model === "string" && opts.model.trim() ? opts.model.trim() : void 0;
			const thinking = typeof opts.thinking === "string" && opts.thinking.trim() ? opts.thinking.trim() : void 0;
			const timeoutSeconds = opts.timeoutSeconds ? Number.parseInt(String(opts.timeoutSeconds), 10) : void 0;
			const hasTimeoutSeconds = Boolean(timeoutSeconds && Number.isFinite(timeoutSeconds));
			const hasDeliveryModeFlag = opts.announce || typeof opts.deliver === "boolean";
			const hasDeliveryTarget = typeof opts.channel === "string" || typeof opts.to === "string";
			const hasDeliveryAccount = typeof opts.account === "string";
			const hasBestEffort = typeof opts.bestEffortDeliver === "boolean";
			const hasAgentTurnPatch = typeof opts.message === "string" || Boolean(model) || Boolean(thinking) || hasTimeoutSeconds || typeof opts.lightContext === "boolean" || hasDeliveryModeFlag || hasDeliveryTarget || hasDeliveryAccount || hasBestEffort;
			if (hasSystemEventPatch && hasAgentTurnPatch) throw new Error("Choose at most one payload change");
			if (hasSystemEventPatch) patch.payload = {
				kind: "systemEvent",
				text: String(opts.systemEvent)
			};
			else if (hasAgentTurnPatch) {
				const payload = { kind: "agentTurn" };
				assignIf(payload, "message", String(opts.message), typeof opts.message === "string");
				assignIf(payload, "model", model, Boolean(model));
				assignIf(payload, "thinking", thinking, Boolean(thinking));
				assignIf(payload, "timeoutSeconds", timeoutSeconds, hasTimeoutSeconds);
				assignIf(payload, "lightContext", opts.lightContext, typeof opts.lightContext === "boolean");
				patch.payload = payload;
			}
			if (hasDeliveryModeFlag || hasDeliveryTarget || hasDeliveryAccount || hasBestEffort) {
				const delivery = {};
				if (hasDeliveryModeFlag) delivery.mode = opts.announce || opts.deliver === true ? "announce" : "none";
				else if (hasBestEffort) delivery.mode = "announce";
				if (typeof opts.channel === "string") {
					const channel = opts.channel.trim();
					delivery.channel = channel ? channel : void 0;
				}
				if (typeof opts.to === "string") {
					const to = opts.to.trim();
					delivery.to = to ? to : void 0;
				}
				if (typeof opts.account === "string") {
					const account = opts.account.trim();
					delivery.accountId = account ? account : void 0;
				}
				if (typeof opts.bestEffortDeliver === "boolean") delivery.bestEffort = opts.bestEffortDeliver;
				patch.delivery = delivery;
			}
			const hasFailureAlertAfter = typeof opts.failureAlertAfter === "string";
			const hasFailureAlertChannel = typeof opts.failureAlertChannel === "string";
			const hasFailureAlertTo = typeof opts.failureAlertTo === "string";
			const hasFailureAlertCooldown = typeof opts.failureAlertCooldown === "string";
			const hasFailureAlertMode = typeof opts.failureAlertMode === "string";
			const hasFailureAlertAccountId = typeof opts.failureAlertAccountId === "string";
			const hasFailureAlertFields = hasFailureAlertAfter || hasFailureAlertChannel || hasFailureAlertTo || hasFailureAlertCooldown || hasFailureAlertMode || hasFailureAlertAccountId;
			const failureAlertFlag = typeof opts.failureAlert === "boolean" ? opts.failureAlert : void 0;
			if (failureAlertFlag === false && hasFailureAlertFields) throw new Error("Use --no-failure-alert alone (without failure-alert-* options).");
			if (failureAlertFlag === false) patch.failureAlert = false;
			else if (failureAlertFlag === true || hasFailureAlertFields) {
				const failureAlert = {};
				if (hasFailureAlertAfter) {
					const after = Number.parseInt(String(opts.failureAlertAfter), 10);
					if (!Number.isFinite(after) || after <= 0) throw new Error("Invalid --failure-alert-after (must be a positive integer).");
					failureAlert.after = after;
				}
				if (hasFailureAlertChannel) {
					const channel = String(opts.failureAlertChannel).trim().toLowerCase();
					failureAlert.channel = channel ? channel : void 0;
				}
				if (hasFailureAlertTo) {
					const to = String(opts.failureAlertTo).trim();
					failureAlert.to = to ? to : void 0;
				}
				if (hasFailureAlertCooldown) {
					const cooldownMs = parseDurationMs(String(opts.failureAlertCooldown));
					if (!cooldownMs && cooldownMs !== 0) throw new Error("Invalid --failure-alert-cooldown.");
					failureAlert.cooldownMs = cooldownMs;
				}
				if (hasFailureAlertMode) {
					const mode = String(opts.failureAlertMode).trim().toLowerCase();
					if (mode !== "announce" && mode !== "webhook") throw new Error("Invalid --failure-alert-mode (must be 'announce' or 'webhook').");
					failureAlert.mode = mode;
				}
				if (hasFailureAlertAccountId) {
					const accountId = String(opts.failureAlertAccountId).trim();
					failureAlert.accountId = accountId ? accountId : void 0;
				}
				patch.failureAlert = failureAlert;
			}
			const res = await callGatewayFromCli("cron.update", opts, {
				id,
				patch
			});
			defaultRuntime.writeJson(res);
			await warnIfCronSchedulerDisabled(opts);
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	}));
}
//#endregion
//#region src/cli/cron-cli/register.cron-simple.ts
function registerCronToggleCommand(params) {
	addGatewayClientOptions(params.cron.command(params.name).description(params.description).argument("<id>", "Job id").action(async (id, opts) => {
		try {
			printCronJson(await callGatewayFromCli("cron.update", opts, {
				id,
				patch: { enabled: params.enabled }
			}));
			await warnIfCronSchedulerDisabled(opts);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
function registerCronSimpleCommands(cron) {
	addGatewayClientOptions(cron.command("rm").alias("remove").alias("delete").description("Remove a cron job").argument("<id>", "Job id").option("--json", "Output JSON", false).action(async (id, opts) => {
		try {
			printCronJson(await callGatewayFromCli("cron.remove", opts, { id }));
		} catch (err) {
			handleCronCliError(err);
		}
	}));
	registerCronToggleCommand({
		cron,
		name: "enable",
		description: "Enable a cron job",
		enabled: true
	});
	registerCronToggleCommand({
		cron,
		name: "disable",
		description: "Disable a cron job",
		enabled: false
	});
	addGatewayClientOptions(cron.command("runs").description("Show cron run history (JSONL-backed)").requiredOption("--id <id>", "Job id").option("--limit <n>", "Max entries (default 50)", "50").action(async (opts) => {
		try {
			const limitRaw = Number.parseInt(String(opts.limit ?? "50"), 10);
			const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 50;
			printCronJson(await callGatewayFromCli("cron.runs", opts, {
				id: String(opts.id),
				limit
			}));
		} catch (err) {
			handleCronCliError(err);
		}
	}));
	addGatewayClientOptions(cron.command("run").description("Run a cron job now (debug)").argument("<id>", "Job id").option("--due", "Run only when due (default behavior in older versions)", false).action(async (id, opts, command) => {
		try {
			if (command.getOptionValueSource("timeout") === "default") opts.timeout = "600000";
			const res = await callGatewayFromCli("cron.run", opts, {
				id,
				mode: opts.due ? "due" : "force"
			});
			printCronJson(res);
			const result = res;
			defaultRuntime.exit(result?.ok && (result?.ran || result?.enqueued) ? 0 : 1);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
//#endregion
//#region src/cli/cron-cli/register.ts
function registerCronCli(program) {
	const cron = program.command("cron").description("Manage cron jobs (via Gateway)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/cron", "docs.openclaw.ai/cli/cron")}\n${theme.muted("Upgrade tip:")} run \`openclaw doctor --fix\` to normalize legacy cron job storage.\n`);
	registerCronStatusCommand(cron);
	registerCronListCommand(cron);
	registerCronAddCommand(cron);
	registerCronSimpleCommands(cron);
	registerCronEditCommand(cron);
}
//#endregion
export { registerCronCli };
