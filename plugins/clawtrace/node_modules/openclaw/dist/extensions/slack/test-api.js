import { Ga as sendMessageSlack, ea as prepareSlackMessage, gt as createSlackActions, ht as slackOutbound, mt as setSlackRuntime, na as createSlackMonitorContext, pt as slackPlugin } from "../../auth-profiles-B5ypC5S-.js";
//#region extensions/slack/src/monitor/message-handler/prepare.test-helpers.ts
function createInboundSlackTestContext(params) {
	return createSlackMonitorContext({
		cfg: params.cfg,
		accountId: "default",
		botToken: "token",
		app: { client: params.appClient ?? {} },
		runtime: {},
		botUserId: "B1",
		teamId: "T1",
		apiAppId: "A1",
		historyLimit: 0,
		sessionScope: "per-sender",
		mainKey: "main",
		dmEnabled: true,
		dmPolicy: "open",
		allowFrom: [],
		allowNameMatching: false,
		groupDmEnabled: true,
		groupDmChannels: [],
		defaultRequireMention: params.defaultRequireMention ?? true,
		channelsConfig: params.channelsConfig,
		groupPolicy: "open",
		useAccessGroups: false,
		reactionMode: "off",
		reactionAllowlist: [],
		replyToMode: params.replyToMode ?? "off",
		threadHistoryScope: "thread",
		threadInheritParent: false,
		slashCommand: {
			enabled: false,
			name: "openclaw",
			sessionPrefix: "slack:slash",
			ephemeral: true
		},
		textLimit: 4e3,
		ackReactionScope: "group-mentions",
		typingReaction: "",
		mediaMaxBytes: 1024,
		removeAckAfterReply: false
	});
}
//#endregion
export { createInboundSlackTestContext, createSlackActions, prepareSlackMessage, sendMessageSlack, setSlackRuntime, slackOutbound, slackPlugin };
