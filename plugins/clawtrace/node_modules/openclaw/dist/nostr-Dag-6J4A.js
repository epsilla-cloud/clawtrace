import "./auth-profiles-B5ypC5S-.js";
import "./zod-schema.core-CGoKjdG2.js";
import "./config-schema-DGr8UxxF.js";
import "./status-helpers-CH_H6L7d.js";
import "./ssrf-BkIVE4hp.js";
import "./webhook-ingress-CTk9JGVm.js";
import "./channel-reply-pipeline-DFacxqeY.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-d1xYdpXz.js";
//#region src/plugin-sdk/nostr.ts
const nostrSetup = createOptionalChannelSetupSurface({
	channel: "nostr",
	label: "Nostr",
	npmSpec: "@openclaw/nostr",
	docsPath: "/channels/nostr"
});
const nostrSetupAdapter = nostrSetup.setupAdapter;
const nostrSetupWizard = nostrSetup.setupWizard;
//#endregion
export { nostrSetupWizard as n, nostrSetupAdapter as t };
