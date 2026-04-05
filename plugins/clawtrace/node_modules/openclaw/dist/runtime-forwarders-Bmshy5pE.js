//#region src/channels/plugins/runtime-forwarders.ts
async function resolveForwardedMethod(params) {
	const runtime = await params.getRuntime();
	const method = params.resolve(runtime);
	if (method) return method;
	throw new Error(params.unavailableMessage ?? "Runtime method is unavailable");
}
function createRuntimeDirectoryLiveAdapter(params) {
	return {
		listPeersLive: params.listPeersLive ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			resolve: params.listPeersLive
		}))(ctx) : void 0,
		listGroupsLive: params.listGroupsLive ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			resolve: params.listGroupsLive
		}))(ctx) : void 0,
		listGroupMembers: params.listGroupMembers ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			resolve: params.listGroupMembers
		}))(ctx) : void 0
	};
}
function createRuntimeOutboundDelegates(params) {
	return {
		sendText: params.sendText ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			resolve: params.sendText.resolve,
			unavailableMessage: params.sendText.unavailableMessage
		}))(ctx) : void 0,
		sendMedia: params.sendMedia ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			resolve: params.sendMedia.resolve,
			unavailableMessage: params.sendMedia.unavailableMessage
		}))(ctx) : void 0,
		sendPoll: params.sendPoll ? async (ctx) => await (await resolveForwardedMethod({
			getRuntime: params.getRuntime,
			resolve: params.sendPoll.resolve,
			unavailableMessage: params.sendPoll.unavailableMessage
		}))(ctx) : void 0
	};
}
//#endregion
export { createRuntimeOutboundDelegates as n, createRuntimeDirectoryLiveAdapter as t };
