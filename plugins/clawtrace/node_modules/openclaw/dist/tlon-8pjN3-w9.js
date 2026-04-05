import "./links-CNsP_rfF.js";
import "./config-schema-DGr8UxxF.js";
import "./setup-helpers-D9SEfBub.js";
import "./status-helpers-CH_H6L7d.js";
import "./ssrf-BkIVE4hp.js";
import "./fetch-guard-dgUzueSW.js";
import "./channel-reply-pipeline-DFacxqeY.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-d1xYdpXz.js";
import "./runtime-shvBB17a.js";
//#region src/plugin-sdk/tlon.ts
const tlonSetup = createOptionalChannelSetupSurface({
	channel: "tlon",
	label: "Tlon",
	npmSpec: "@openclaw/tlon",
	docsPath: "/channels/tlon"
});
const tlonSetupAdapter = tlonSetup.setupAdapter;
const tlonSetupWizard = tlonSetup.setupWizard;
//#endregion
export { tlonSetupWizard as n, tlonSetupAdapter as t };
