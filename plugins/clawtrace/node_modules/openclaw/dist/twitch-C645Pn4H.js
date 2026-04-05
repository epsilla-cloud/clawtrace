import "./links-CNsP_rfF.js";
import "./zod-schema.core-CGoKjdG2.js";
import "./config-schema-DGr8UxxF.js";
import "./channel-reply-pipeline-DFacxqeY.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-d1xYdpXz.js";
//#region src/plugin-sdk/twitch.ts
const twitchSetup = createOptionalChannelSetupSurface({
	channel: "twitch",
	label: "Twitch",
	npmSpec: "@openclaw/twitch"
});
const twitchSetupAdapter = twitchSetup.setupAdapter;
const twitchSetupWizard = twitchSetup.setupWizard;
//#endregion
export { twitchSetupWizard as n, twitchSetupAdapter as t };
