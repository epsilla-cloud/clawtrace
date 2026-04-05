import { _ as normalizeAccountId } from "./session-key-BhxcMJEE.js";
import { t as formatCliCommand } from "./command-format-CR4nOXgc.js";
//#region src/channels/plugins/pairing-adapters.ts
function createPairingPrefixStripper(prefixRe, map = (entry) => entry) {
	return (entry) => map(entry.trim().replace(prefixRe, "").trim());
}
function createLoggedPairingApprovalNotifier(format, log = console.log) {
	return async (params) => {
		log(typeof format === "function" ? format(params) : format);
	};
}
function createTextPairingAdapter(params) {
	return {
		idLabel: params.idLabel,
		normalizeAllowEntry: params.normalizeAllowEntry,
		notifyApproval: async (ctx) => {
			await params.notify({
				...ctx,
				message: params.message
			});
		}
	};
}
//#endregion
//#region src/pairing/pairing-messages.ts
function buildPairingReply(params) {
	const { channel, idLine, code } = params;
	const approveCommand = formatCliCommand(`openclaw pairing approve ${channel} ${code}`);
	return [
		"OpenClaw: access not configured.",
		"",
		idLine,
		"Pairing code:",
		"```",
		code,
		"```",
		"",
		"Ask the bot owner to approve with:",
		formatCliCommand(`openclaw pairing approve ${channel} ${code}`),
		"```",
		approveCommand,
		"```"
	].join("\n");
}
//#endregion
//#region src/pairing/pairing-challenge.ts
/**
* Shared pairing challenge issuance for DM pairing policy pathways.
* Ensures every channel follows the same create-if-missing + reply flow.
*/
async function issuePairingChallenge(params) {
	const { code, created } = await params.upsertPairingRequest({
		id: params.senderId,
		meta: params.meta
	});
	if (!created) return { created: false };
	params.onCreated?.({ code });
	const replyText = params.buildReplyText?.({
		code,
		senderIdLine: params.senderIdLine
	}) ?? buildPairingReply({
		channel: params.channel,
		idLine: params.senderIdLine,
		code
	});
	try {
		await params.sendPairingReply(replyText);
	} catch (err) {
		params.onReplyError?.(err);
	}
	return {
		created: true,
		code
	};
}
//#endregion
//#region src/plugin-sdk/pairing-access.ts
/** Scope pairing store operations to one channel/account pair for plugin-facing helpers. */
function createScopedPairingAccess(params) {
	const resolvedAccountId = normalizeAccountId(params.accountId);
	return {
		accountId: resolvedAccountId,
		readAllowFromStore: () => params.core.channel.pairing.readAllowFromStore({
			channel: params.channel,
			accountId: resolvedAccountId
		}),
		readStoreForDmPolicy: (provider, accountId) => params.core.channel.pairing.readAllowFromStore({
			channel: provider,
			accountId: normalizeAccountId(accountId)
		}),
		upsertPairingRequest: (input) => params.core.channel.pairing.upsertPairingRequest({
			channel: params.channel,
			accountId: resolvedAccountId,
			...input
		})
	};
}
//#endregion
//#region src/plugin-sdk/channel-pairing.ts
/** Pre-bind the channel id and storage sink for pairing challenges. */
function createChannelPairingChallengeIssuer(params) {
	return (challenge) => issuePairingChallenge({
		channel: params.channel,
		upsertPairingRequest: params.upsertPairingRequest,
		...challenge
	});
}
/** Build the full scoped pairing controller used by channel runtime code. */
function createChannelPairingController(params) {
	const access = createScopedPairingAccess(params);
	return {
		...access,
		issueChallenge: createChannelPairingChallengeIssuer({
			channel: params.channel,
			upsertPairingRequest: access.upsertPairingRequest
		})
	};
}
//#endregion
export { createLoggedPairingApprovalNotifier as a, buildPairingReply as i, createChannelPairingController as n, createPairingPrefixStripper as o, issuePairingChallenge as r, createTextPairingAdapter as s, createChannelPairingChallengeIssuer as t };
