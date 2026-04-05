import { type NormalizedWebhookMessage, type NormalizedWebhookReaction } from "./monitor-normalize.js";
import type { BlueBubblesCoreRuntime, BlueBubblesRuntimeEnv, WebhookTarget } from "./monitor-shared.js";
export declare function logVerbose(core: BlueBubblesCoreRuntime, runtime: BlueBubblesRuntimeEnv, message: string): void;
export declare function processMessage(message: NormalizedWebhookMessage, target: WebhookTarget): Promise<void>;
export declare function processReaction(reaction: NormalizedWebhookReaction, target: WebhookTarget): Promise<void>;
