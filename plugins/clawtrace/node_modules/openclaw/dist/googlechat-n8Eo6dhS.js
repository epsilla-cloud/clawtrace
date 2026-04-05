import "./links-CNsP_rfF.js";
import "./zod-schema.providers-core-BV8OcGxh.js";
import "./registry-M0RVxNlg.js";
import "./config-schema-DGr8UxxF.js";
import "./setup-helpers-D9SEfBub.js";
import { r as resolveChannelGroupRequireMention } from "./channel-policy-CKDH6-ud.js";
import "./dm-policy-shared-C8YuyjhK.js";
import "./status-helpers-CH_H6L7d.js";
import "./common-B7JFWTj2.js";
import "./fetch-guard-dgUzueSW.js";
import "./web-media-BN6zO1RF.js";
import "./webhook-ingress-CTk9JGVm.js";
import "./setup-wizard-proxy-IaAsrs3a.js";
import "./channel-reply-pipeline-DFacxqeY.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-d1xYdpXz.js";
//#region src/plugin-sdk/googlechat.ts
function resolveGoogleChatGroupRequireMention(params) {
	return resolveChannelGroupRequireMention({
		cfg: params.cfg,
		channel: "googlechat",
		groupId: params.groupId,
		accountId: params.accountId
	});
}
const googlechatSetup = createOptionalChannelSetupSurface({
	channel: "googlechat",
	label: "Google Chat",
	npmSpec: "@openclaw/googlechat",
	docsPath: "/channels/googlechat"
});
const googlechatSetupAdapter = googlechatSetup.setupAdapter;
const googlechatSetupWizard = googlechatSetup.setupWizard;
//#endregion
export { googlechatSetupWizard as n, resolveGoogleChatGroupRequireMention as r, googlechatSetupAdapter as t };
