//#region src/plugin-sdk/tool-send.ts
/** Extract the canonical send target fields from tool arguments when the action matches. */
function extractToolSend(args, expectedAction = "sendMessage") {
	if ((typeof args.action === "string" ? args.action.trim() : "") !== expectedAction) return null;
	const to = typeof args.to === "string" ? args.to : void 0;
	if (!to) return null;
	const accountId = typeof args.accountId === "string" ? args.accountId.trim() : void 0;
	const threadIdRaw = typeof args.threadId === "string" ? args.threadId.trim() : typeof args.threadId === "number" ? String(args.threadId) : "";
	return {
		to,
		accountId,
		threadId: threadIdRaw.length > 0 ? threadIdRaw : void 0
	};
}
//#endregion
export { extractToolSend as t };
