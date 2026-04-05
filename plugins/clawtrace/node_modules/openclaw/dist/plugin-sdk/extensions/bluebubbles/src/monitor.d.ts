import type { IncomingMessage, ServerResponse } from "node:http";
import { _resetBlueBubblesShortIdState, resolveBlueBubblesMessageId } from "./monitor-reply-cache.js";
import { resolveWebhookPathFromConfig, type BlueBubblesMonitorOptions, type WebhookTarget } from "./monitor-shared.js";
export declare function clearBlueBubblesWebhookSecurityStateForTest(): void;
export declare function registerBlueBubblesWebhookTarget(target: WebhookTarget): () => void;
export declare function handleBlueBubblesWebhookRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean>;
export declare function monitorBlueBubblesProvider(options: BlueBubblesMonitorOptions): Promise<void>;
export { _resetBlueBubblesShortIdState, resolveBlueBubblesMessageId, resolveWebhookPathFromConfig };
