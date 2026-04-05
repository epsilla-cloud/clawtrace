import { _L as resolveWhatsAppGroupToolPolicy, gL as resolveWhatsAppGroupRequireMention, mL as resolveWhatsAppGroupIntroHint } from "../../auth-profiles-B5ypC5S-.js";
import { a as defineSetupPluginEntry } from "../../core-CFWy4f9Z.js";
import { t as whatsappSetupAdapter } from "../../setup-core-DZL9tc26.js";
import { i as whatsappSetupWizardProxy, n as createWhatsAppPluginBase } from "../../shared-1Dmd8bew.js";
import { d as webAuthExists } from "../../auth-store-98jWycU0.js";
//#region extensions/whatsapp/src/channel.setup.ts
const whatsappSetupPlugin = { ...createWhatsAppPluginBase({
	groups: {
		resolveRequireMention: resolveWhatsAppGroupRequireMention,
		resolveToolPolicy: resolveWhatsAppGroupToolPolicy,
		resolveGroupIntroHint: resolveWhatsAppGroupIntroHint
	},
	setupWizard: whatsappSetupWizardProxy,
	setup: whatsappSetupAdapter,
	isConfigured: async (account) => await webAuthExists(account.authDir)
}) };
//#endregion
//#region extensions/whatsapp/setup-entry.ts
var setup_entry_default = defineSetupPluginEntry(whatsappSetupPlugin);
//#endregion
export { setup_entry_default as default, whatsappSetupPlugin };
