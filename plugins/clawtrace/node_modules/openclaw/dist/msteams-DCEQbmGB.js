import "./utils-BfvDpbwh.js";
import "./links-CNsP_rfF.js";
import "./auth-profiles-B5ypC5S-.js";
import "./zod-schema.providers-core-BV8OcGxh.js";
import "./config-schema-DGr8UxxF.js";
import "./dm-policy-shared-C8YuyjhK.js";
import "./file-lock-COakxmwX.js";
import "./json-store-9F5NU8uu.js";
import "./status-helpers-CH_H6L7d.js";
import "./mime-BFjhBApy.js";
import "./system-events-BdYO0Ful.js";
import "./ssrf-BkIVE4hp.js";
import "./fetch-guard-dgUzueSW.js";
import "./web-media-BN6zO1RF.js";
import "./setup-wizard-proxy-IaAsrs3a.js";
import "./channel-reply-pipeline-DFacxqeY.js";
import "./reply-history-Zf0VECih.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-d1xYdpXz.js";
import "./ssrf-policy-BHnhX84O.js";
//#region src/plugin-sdk/msteams.ts
const msteamsSetup = createOptionalChannelSetupSurface({
	channel: "msteams",
	label: "Microsoft Teams",
	npmSpec: "@openclaw/msteams",
	docsPath: "/channels/msteams"
});
const msteamsSetupWizard = msteamsSetup.setupWizard;
const msteamsSetupAdapter = msteamsSetup.setupAdapter;
//#endregion
export { msteamsSetupWizard as n, msteamsSetupAdapter as t };
