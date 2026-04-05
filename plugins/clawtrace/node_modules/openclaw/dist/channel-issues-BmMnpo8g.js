//#region src/commands/status-all/channel-issues.ts
function groupChannelIssuesByChannel(issues) {
	const byChannel = /* @__PURE__ */ new Map();
	for (const issue of issues) {
		const key = issue.channel;
		const list = byChannel.get(key);
		if (list) list.push(issue);
		else byChannel.set(key, [issue]);
	}
	return byChannel;
}
//#endregion
export { groupChannelIssuesByChannel as t };
