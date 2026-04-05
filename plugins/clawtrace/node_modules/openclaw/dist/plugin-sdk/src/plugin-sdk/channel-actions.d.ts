export { createUnionActionGate, listTokenSourcedAccounts, } from "../channels/plugins/actions/shared.js";
export { resolveReactionMessageId } from "../channels/plugins/actions/reaction-message-id.js";
export { optionalStringEnum, stringEnum } from "../agents/schema/typebox.js";
import type { TSchema } from "@sinclair/typebox";
/** Schema helper for channels that expose button rows on the shared `message` tool. */
export declare function createMessageToolButtonsSchema(): TSchema;
/** Schema helper for channels that accept provider-native card payloads. */
export declare function createMessageToolCardSchema(): TSchema;
