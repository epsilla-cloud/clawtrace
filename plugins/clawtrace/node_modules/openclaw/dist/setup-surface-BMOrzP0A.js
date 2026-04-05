import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-Day5KPIY.js";
import { t as formatDocsLink } from "./links-CNsP_rfF.js";
import { _ as normalizeAccountId } from "./session-key-BhxcMJEE.js";
import { t as formatCliCommand } from "./command-format-CR4nOXgc.js";
import { i as createPatchedAccountSetupAdapter, l as patchScopedAccountConfig } from "./setup-helpers-D9SEfBub.js";
import { t as formatResolvedUnresolvedNote } from "./setup-Fad77i7o.js";
import { C as createTopLevelChannelDmPolicy, D as mergeAllowFromEntries, w as createTopLevelChannelDmPolicySetter } from "./setup-wizard-proxy-IaAsrs3a.js";
import "./runtime-api-I7yZkEIc.js";
import { b as waitForZaloQrLogin, c as logoutZaloProfile, d as resolveZaloGroupsByEntries, l as resolveZaloAllowFromEntries, t as checkZaloAuthenticated, y as startZaloQrLogin } from "./zalo-js-B3-1bwTS.js";
import { i as resolveZalouserAccountSync, n as listZalouserAccountIds, r as resolveDefaultZalouserAccountId } from "./accounts-C3Ee3KOs.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/zalouser/src/qr-temp-file.ts
async function writeQrDataUrlToTempFile(qrDataUrl, profile) {
	const base64 = (qrDataUrl.trim().match(/^data:image\/png;base64,(.+)$/i)?.[1] ?? "").trim();
	if (!base64) return null;
	const safeProfile = profile.replace(/[^a-zA-Z0-9_-]+/g, "-") || "default";
	const filePath = path.join(resolvePreferredOpenClawTmpDir(), `openclaw-zalouser-qr-${safeProfile}.png`);
	await fs.writeFile(filePath, Buffer.from(base64, "base64"));
	return filePath;
}
const zalouserSetupAdapter = createPatchedAccountSetupAdapter({
	channelKey: "zalouser",
	validateInput: () => null,
	buildPatch: () => ({})
});
//#endregion
//#region extensions/zalouser/src/setup-surface.ts
const channel = "zalouser";
const setZalouserDmPolicy = createTopLevelChannelDmPolicySetter({ channel });
const ZALOUSER_ALLOW_FROM_PLACEHOLDER = "Alice, 123456789, or leave empty to configure later";
const ZALOUSER_GROUPS_PLACEHOLDER = "Family, Work, 123456789, or leave empty for now";
const ZALOUSER_DM_ACCESS_TITLE = "Zalo Personal DM access";
const ZALOUSER_ALLOWLIST_TITLE = "Zalo Personal allowlist";
const ZALOUSER_GROUPS_TITLE = "Zalo groups";
function parseZalouserEntries(raw) {
	return raw.split(/[\n,;]+/g).map((entry) => entry.trim()).filter(Boolean);
}
function setZalouserAccountScopedConfig(cfg, accountId, defaultPatch, accountPatch = defaultPatch) {
	return patchScopedAccountConfig({
		cfg,
		channelKey: channel,
		accountId,
		patch: defaultPatch,
		accountPatch
	});
}
function setZalouserGroupPolicy(cfg, accountId, groupPolicy) {
	return setZalouserAccountScopedConfig(cfg, accountId, { groupPolicy });
}
function setZalouserGroupAllowlist(cfg, accountId, groupKeys) {
	return setZalouserAccountScopedConfig(cfg, accountId, { groups: Object.fromEntries(groupKeys.map((key) => [key, {
		allow: true,
		requireMention: true
	}])) });
}
function ensureZalouserPluginEnabled(cfg) {
	const next = {
		...cfg,
		plugins: {
			...cfg.plugins,
			entries: {
				...cfg.plugins?.entries,
				zalouser: {
					...cfg.plugins?.entries?.zalouser,
					enabled: true
				}
			}
		}
	};
	const allow = next.plugins?.allow;
	if (!Array.isArray(allow) || allow.includes(channel)) return next;
	return {
		...next,
		plugins: {
			...next.plugins,
			allow: [...allow, channel]
		}
	};
}
async function noteZalouserHelp(prompter) {
	await prompter.note([
		"Zalo Personal Account login via QR code.",
		"",
		"This plugin uses zca-js directly (no external CLI dependency).",
		"",
		`Docs: ${formatDocsLink("/channels/zalouser", "zalouser")}`
	].join("\n"), "Zalo Personal Setup");
}
async function promptZalouserAllowFrom(params) {
	const { cfg, prompter, accountId } = params;
	const resolved = resolveZalouserAccountSync({
		cfg,
		accountId
	});
	const existingAllowFrom = resolved.config.allowFrom ?? [];
	while (true) {
		const entry = await prompter.text({
			message: "Zalouser allowFrom (name or user id)",
			placeholder: ZALOUSER_ALLOW_FROM_PLACEHOLDER,
			initialValue: existingAllowFrom.length > 0 ? existingAllowFrom.join(", ") : void 0
		});
		const parts = parseZalouserEntries(String(entry));
		if (parts.length === 0) {
			await prompter.note([
				"No DM allowlist entries added yet.",
				"Direct chats will stay blocked until you add people later.",
				`Tip: use \`${formatCliCommand("openclaw directory peers list --channel zalouser")}\` to look up people after onboarding.`
			].join("\n"), ZALOUSER_ALLOWLIST_TITLE);
			return setZalouserAccountScopedConfig(cfg, accountId, {
				dmPolicy: "allowlist",
				allowFrom: []
			});
		}
		const resolvedEntries = await resolveZaloAllowFromEntries({
			profile: resolved.profile,
			entries: parts
		});
		const unresolved = resolvedEntries.filter((item) => !item.resolved).map((item) => item.input);
		if (unresolved.length > 0) {
			await prompter.note(`Could not resolve: ${unresolved.join(", ")}. Use numeric user ids or exact friend names.`, ZALOUSER_ALLOWLIST_TITLE);
			continue;
		}
		const unique = mergeAllowFromEntries(existingAllowFrom, resolvedEntries.filter((item) => item.resolved && item.id).map((item) => item.id));
		const notes = resolvedEntries.filter((item) => item.note).map((item) => `${item.input} -> ${item.id} (${item.note})`);
		if (notes.length > 0) await prompter.note(notes.join("\n"), ZALOUSER_ALLOWLIST_TITLE);
		return setZalouserAccountScopedConfig(cfg, accountId, {
			dmPolicy: "allowlist",
			allowFrom: unique
		});
	}
}
const zalouserDmPolicy = createTopLevelChannelDmPolicy({
	label: "Zalo Personal",
	channel,
	policyKey: "channels.zalouser.dmPolicy",
	allowFromKey: "channels.zalouser.allowFrom",
	getCurrent: (cfg) => cfg.channels?.zalouser?.dmPolicy ?? "pairing",
	promptAllowFrom: async ({ cfg, prompter, accountId }) => {
		return await promptZalouserAllowFrom({
			cfg,
			prompter,
			accountId: accountId && normalizeAccountId(accountId) ? normalizeAccountId(accountId) ?? "default" : resolveDefaultZalouserAccountId(cfg)
		});
	}
});
async function promptZalouserQuickstartDmPolicy(params) {
	const { cfg, prompter, accountId } = params;
	const resolved = resolveZalouserAccountSync({
		cfg,
		accountId
	});
	const existingPolicy = cfg.channels?.zalouser?.dmPolicy ?? "pairing";
	const existingAllowFrom = resolved.config.allowFrom ?? [];
	const existingLabel = existingAllowFrom.length > 0 ? existingAllowFrom.join(", ") : "unset";
	await prompter.note([
		"Direct chats are configured separately from group chats.",
		"- pairing (default): unknown people get a pairing code",
		"- allowlist: only listed people can DM",
		"- open: anyone can DM",
		"- disabled: ignore DMs",
		"",
		`Current: dmPolicy=${existingPolicy}, allowFrom=${existingLabel}`,
		"If you choose allowlist now, you can leave it empty and add people later."
	].join("\n"), ZALOUSER_DM_ACCESS_TITLE);
	const policy = await prompter.select({
		message: "Zalo Personal DM policy",
		options: [
			{
				value: "pairing",
				label: "Pairing (recommended)"
			},
			{
				value: "allowlist",
				label: "Allowlist (specific users only)"
			},
			{
				value: "open",
				label: "Open (public inbound DMs)"
			},
			{
				value: "disabled",
				label: "Disabled (ignore DMs)"
			}
		],
		initialValue: existingPolicy
	});
	if (policy === "allowlist") return await promptZalouserAllowFrom({
		cfg,
		prompter,
		accountId
	});
	return setZalouserDmPolicy(cfg, policy);
}
const zalouserSetupWizard = {
	channel,
	status: {
		configuredLabel: "logged in",
		unconfiguredLabel: "needs QR login",
		configuredHint: "recommended · logged in",
		unconfiguredHint: "recommended · QR login",
		configuredScore: 1,
		unconfiguredScore: 15,
		resolveConfigured: async ({ cfg }) => {
			const ids = listZalouserAccountIds(cfg);
			for (const accountId of ids) if (await checkZaloAuthenticated(resolveZalouserAccountSync({
				cfg,
				accountId
			}).profile)) return true;
			return false;
		},
		resolveStatusLines: async ({ cfg, configured }) => {
			return [`Zalo Personal: ${configured ? "logged in" : "needs QR login"}`];
		}
	},
	prepare: async ({ cfg, accountId, prompter, options }) => {
		let next = cfg;
		const account = resolveZalouserAccountSync({
			cfg: next,
			accountId
		});
		if (!await checkZaloAuthenticated(account.profile)) {
			await noteZalouserHelp(prompter);
			if (await prompter.confirm({
				message: "Login via QR code now?",
				initialValue: true
			})) {
				const start = await startZaloQrLogin({
					profile: account.profile,
					timeoutMs: 35e3
				});
				if (start.qrDataUrl) {
					const qrPath = await writeQrDataUrlToTempFile(start.qrDataUrl, account.profile);
					await prompter.note([
						start.message,
						qrPath ? `QR image saved to: ${qrPath}` : "Could not write QR image file; use gateway web login UI instead.",
						"Scan + approve on phone, then continue."
					].join("\n"), "QR Login");
					if (await prompter.confirm({
						message: "Did you scan and approve the QR on your phone?",
						initialValue: true
					})) {
						const waited = await waitForZaloQrLogin({
							profile: account.profile,
							timeoutMs: 12e4
						});
						await prompter.note(waited.message, waited.connected ? "Success" : "Login pending");
					}
				} else await prompter.note(start.message, "Login pending");
			}
		} else if (!await prompter.confirm({
			message: "Zalo Personal already logged in. Keep session?",
			initialValue: true
		})) {
			await logoutZaloProfile(account.profile);
			const start = await startZaloQrLogin({
				profile: account.profile,
				force: true,
				timeoutMs: 35e3
			});
			if (start.qrDataUrl) {
				const qrPath = await writeQrDataUrlToTempFile(start.qrDataUrl, account.profile);
				await prompter.note([start.message, qrPath ? `QR image saved to: ${qrPath}` : void 0].filter(Boolean).join("\n"), "QR Login");
				const waited = await waitForZaloQrLogin({
					profile: account.profile,
					timeoutMs: 12e4
				});
				await prompter.note(waited.message, waited.connected ? "Success" : "Login pending");
			}
		}
		next = setZalouserAccountScopedConfig(next, accountId, { profile: account.profile !== "default" ? account.profile : void 0 }, {
			profile: account.profile,
			enabled: true
		});
		if (options?.quickstartDefaults) next = await promptZalouserQuickstartDmPolicy({
			cfg: next,
			prompter,
			accountId
		});
		return { cfg: next };
	},
	credentials: [],
	groupAccess: {
		label: "Zalo groups",
		placeholder: ZALOUSER_GROUPS_PLACEHOLDER,
		currentPolicy: ({ cfg, accountId }) => resolveZalouserAccountSync({
			cfg,
			accountId
		}).config.groupPolicy ?? "allowlist",
		currentEntries: ({ cfg, accountId }) => Object.keys(resolveZalouserAccountSync({
			cfg,
			accountId
		}).config.groups ?? {}),
		updatePrompt: ({ cfg, accountId }) => Boolean(resolveZalouserAccountSync({
			cfg,
			accountId
		}).config.groups),
		setPolicy: ({ cfg, accountId, policy }) => setZalouserGroupPolicy(cfg, accountId, policy),
		resolveAllowlist: async ({ cfg, accountId, entries, prompter }) => {
			if (entries.length === 0) {
				await prompter.note([
					"No group allowlist entries added yet.",
					"Group chats will stay blocked until you add groups later.",
					`Tip: use \`${formatCliCommand("openclaw directory groups list --channel zalouser")}\` after onboarding to find group IDs.`,
					"Mention requirement stays on by default for groups you allow later."
				].join("\n"), ZALOUSER_GROUPS_TITLE);
				return [];
			}
			const updatedAccount = resolveZalouserAccountSync({
				cfg,
				accountId
			});
			try {
				const resolved = await resolveZaloGroupsByEntries({
					profile: updatedAccount.profile,
					entries
				});
				const resolvedIds = resolved.filter((entry) => entry.resolved && entry.id).map((entry) => entry.id);
				const unresolved = resolved.filter((entry) => !entry.resolved).map((entry) => entry.input);
				const keys = [...resolvedIds, ...unresolved.map((entry) => entry.trim()).filter(Boolean)];
				const resolution = formatResolvedUnresolvedNote({
					resolved: resolvedIds,
					unresolved
				});
				if (resolution) await prompter.note(resolution, ZALOUSER_GROUPS_TITLE);
				return keys;
			} catch (err) {
				await prompter.note(`Group lookup failed; keeping entries as typed. ${String(err)}`, ZALOUSER_GROUPS_TITLE);
				return entries.map((entry) => entry.trim()).filter(Boolean);
			}
		},
		applyAllowlist: ({ cfg, accountId, resolved }) => setZalouserGroupAllowlist(cfg, accountId, resolved)
	},
	finalize: async ({ cfg, accountId, forceAllowFrom, options, prompter }) => {
		let next = cfg;
		if (forceAllowFrom && !options?.quickstartDefaults) next = await promptZalouserAllowFrom({
			cfg: next,
			prompter,
			accountId
		});
		return { cfg: ensureZalouserPluginEnabled(next) };
	},
	dmPolicy: zalouserDmPolicy
};
//#endregion
export { zalouserSetupAdapter as n, writeQrDataUrlToTempFile as r, zalouserSetupWizard as t };
