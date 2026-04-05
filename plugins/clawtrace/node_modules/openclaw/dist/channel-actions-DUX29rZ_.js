import { i as stringEnum } from "./typebox-D58sO6U5.js";
import { m as readStringOrNumberParam } from "./common-B7JFWTj2.js";
import { Type } from "@sinclair/typebox";
//#region src/channels/plugins/actions/shared.ts
function listTokenSourcedAccounts(accounts) {
	return accounts.filter((account) => account.tokenSource !== "none");
}
function createUnionActionGate(accounts, createGate) {
	const gates = accounts.map((account) => createGate(account));
	return (key, defaultValue = true) => gates.some((gate) => gate(key, defaultValue));
}
//#endregion
//#region src/channels/plugins/actions/reaction-message-id.ts
function resolveReactionMessageId(params) {
	return readStringOrNumberParam(params.args, "messageId") ?? params.toolContext?.currentMessageId;
}
//#endregion
//#region src/plugin-sdk/channel-actions.ts
/** Schema helper for channels that expose button rows on the shared `message` tool. */
function createMessageToolButtonsSchema() {
	return Type.Optional(Type.Array(Type.Array(Type.Object({
		text: Type.String(),
		callback_data: Type.String(),
		style: Type.Optional(stringEnum([
			"danger",
			"success",
			"primary"
		]))
	})), { description: "Button rows for channels that support button-style actions." }));
}
/** Schema helper for channels that accept provider-native card payloads. */
function createMessageToolCardSchema() {
	return Type.Optional(Type.Object({}, {
		additionalProperties: true,
		description: "Structured card payload for channels that support card-style messages."
	}));
}
//#endregion
export { listTokenSourcedAccounts as a, createUnionActionGate as i, createMessageToolCardSchema as n, resolveReactionMessageId as r, createMessageToolButtonsSchema as t };
