import { normalizeWebhookPath } from "openclaw/plugin-sdk/webhook-path";
import type { BlueBubblesAccountConfig } from "./types.js";
export { normalizeWebhookPath };
export declare const DEFAULT_WEBHOOK_PATH = "/bluebubbles-webhook";
export declare function resolveWebhookPathFromConfig(config?: BlueBubblesAccountConfig): string;
