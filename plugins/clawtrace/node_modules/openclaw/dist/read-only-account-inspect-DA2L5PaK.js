//#region src/channels/read-only-account-inspect.ts
let discordInspectModulePromise;
let slackInspectModulePromise;
let telegramInspectModulePromise;
function loadDiscordInspectModule() {
	discordInspectModulePromise ??= import("./read-only-account-inspect.discord.runtime-Bs9selsL.js");
	return discordInspectModulePromise;
}
function loadSlackInspectModule() {
	slackInspectModulePromise ??= import("./read-only-account-inspect.slack.runtime-BG3Y-vbC.js");
	return slackInspectModulePromise;
}
function loadTelegramInspectModule() {
	telegramInspectModulePromise ??= import("./read-only-account-inspect.telegram.runtime-CJV2wEQY.js");
	return telegramInspectModulePromise;
}
async function inspectReadOnlyChannelAccount(params) {
	if (params.channelId === "discord") {
		const { inspectDiscordAccount } = await loadDiscordInspectModule();
		return inspectDiscordAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
	}
	if (params.channelId === "slack") {
		const { inspectSlackAccount } = await loadSlackInspectModule();
		return inspectSlackAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
	}
	if (params.channelId === "telegram") {
		const { inspectTelegramAccount } = await loadTelegramInspectModule();
		return inspectTelegramAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
	}
	return null;
}
//#endregion
export { inspectReadOnlyChannelAccount as t };
