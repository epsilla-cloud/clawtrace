export { HEARTBEAT_PROMPT } from "./auto-reply/heartbeat.js";
export { HEARTBEAT_TOKEN } from "./auto-reply/tokens.js";
export { loadWebMedia, optimizeImageToJpeg } from "./media/web-media.js";
export { createWaSocket, extractMediaPlaceholder, extractText, formatError, getStatusCode, logWebSelfId, loginWeb, logoutWeb, monitorWebChannel, monitorWebInbox, pickWebChannel, resolveHeartbeatRecipients, runWebHeartbeatOnce, sendMessageWhatsApp, sendReactionWhatsApp, waitForWaConnection, webAuthExists, } from "./plugins/runtime/runtime-whatsapp-boundary.js";
export declare const WA_WEB_AUTH_DIR: string;
