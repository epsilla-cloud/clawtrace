import { i as resolveChannelGroupToolsPolicy, r as resolveChannelGroupRequireMention } from "./channel-policy-CKDH6-ud.js";
//#region extensions/bluebubbles/src/group-policy.ts
function resolveBlueBubblesGroupRequireMention(params) {
	return resolveChannelGroupRequireMention({
		cfg: params.cfg,
		channel: "bluebubbles",
		groupId: params.groupId,
		accountId: params.accountId
	});
}
function resolveBlueBubblesGroupToolPolicy(params) {
	return resolveChannelGroupToolsPolicy({
		cfg: params.cfg,
		channel: "bluebubbles",
		groupId: params.groupId,
		accountId: params.accountId,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
}
//#endregion
export { resolveBlueBubblesGroupToolPolicy as n, resolveBlueBubblesGroupRequireMention as t };
