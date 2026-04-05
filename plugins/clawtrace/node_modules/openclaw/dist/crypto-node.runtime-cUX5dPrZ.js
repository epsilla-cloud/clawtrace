import { createRequire } from "node:module";
//#region extensions/matrix/src/matrix/sdk/crypto-node.runtime.ts
const { Attachment, EncryptedAttachment } = createRequire(import.meta.url)("@matrix-org/matrix-sdk-crypto-nodejs");
//#endregion
export { Attachment, EncryptedAttachment };
