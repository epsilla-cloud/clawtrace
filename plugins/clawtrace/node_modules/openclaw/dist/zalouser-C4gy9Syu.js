import "./tmp-openclaw-dir-Day5KPIY.js";
import "./auth-profiles-B5ypC5S-.js";
import "./zod-schema.core-CGoKjdG2.js";
import "./config-schema-DGr8UxxF.js";
import "./setup-helpers-D9SEfBub.js";
import "./status-helpers-CH_H6L7d.js";
import "./zod-schema.agent-runtime-CrOvVRbe.js";
import "./setup-wizard-proxy-IaAsrs3a.js";
import "./channel-reply-pipeline-DFacxqeY.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-d1xYdpXz.js";
//#region src/plugin-sdk/zalouser.ts
const zalouserSetup = createOptionalChannelSetupSurface({
	channel: "zalouser",
	label: "Zalo Personal",
	npmSpec: "@openclaw/zalouser",
	docsPath: "/channels/zalouser"
});
const zalouserSetupAdapter = zalouserSetup.setupAdapter;
const zalouserSetupWizard = zalouserSetup.setupWizard;
//#endregion
export { zalouserSetupWizard as n, zalouserSetupAdapter as t };
