import type { WebhookRequestBody } from "@line/bot-sdk";
export { validateLineSignature } from "./signature.js";
export declare function parseLineWebhookBody(rawBody: string): WebhookRequestBody | null;
