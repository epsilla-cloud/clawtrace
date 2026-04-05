import { n as waitForWebLogin, t as startWebLoginWithQr } from "./login-qr-api-BtIV7xaz.js";
import { Type } from "@sinclair/typebox";
//#region extensions/whatsapp/src/agent-tools-login.ts
function createWhatsAppLoginTool() {
	return {
		label: "WhatsApp Login",
		name: "whatsapp_login",
		ownerOnly: true,
		description: "Generate a WhatsApp QR code for linking, or wait for the scan to complete.",
		parameters: Type.Object({
			action: Type.Unsafe({
				type: "string",
				enum: ["start", "wait"]
			}),
			timeoutMs: Type.Optional(Type.Number()),
			force: Type.Optional(Type.Boolean())
		}),
		execute: async (_toolCallId, args) => {
			if ((args?.action ?? "start") === "wait") {
				const result = await waitForWebLogin({ timeoutMs: typeof args.timeoutMs === "number" ? args.timeoutMs : void 0 });
				return {
					content: [{
						type: "text",
						text: result.message
					}],
					details: { connected: result.connected }
				};
			}
			const result = await startWebLoginWithQr({
				timeoutMs: typeof args.timeoutMs === "number" ? args.timeoutMs : void 0,
				force: typeof args.force === "boolean" ? args.force : false
			});
			if (!result.qrDataUrl) return {
				content: [{
					type: "text",
					text: result.message
				}],
				details: { qr: false }
			};
			return {
				content: [{
					type: "text",
					text: [
						result.message,
						"",
						"Open WhatsApp → Linked Devices and scan:",
						"",
						`![whatsapp-qr](${result.qrDataUrl})`
					].join("\n")
				}],
				details: { qr: true }
			};
		}
	};
}
//#endregion
export { createWhatsAppLoginTool as t };
