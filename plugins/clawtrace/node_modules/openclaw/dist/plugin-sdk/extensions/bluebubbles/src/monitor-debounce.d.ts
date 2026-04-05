import type { NormalizedWebhookMessage } from "./monitor-normalize.js";
import type { WebhookTarget } from "./monitor-shared.js";
/**
 * Entry type for debouncing inbound messages.
 * Captures the normalized message and its target for later combined processing.
 */
type BlueBubblesDebounceEntry = {
    message: NormalizedWebhookMessage;
    target: WebhookTarget;
};
export type BlueBubblesDebouncer = {
    enqueue: (item: BlueBubblesDebounceEntry) => Promise<void>;
    flushKey: (key: string) => Promise<void>;
};
export type BlueBubblesDebounceRegistry = {
    getOrCreateDebouncer: (target: WebhookTarget) => BlueBubblesDebouncer;
    removeDebouncer: (target: WebhookTarget) => void;
};
export declare function createBlueBubblesDebounceRegistry(params: {
    processMessage: (message: NormalizedWebhookMessage, target: WebhookTarget) => Promise<void>;
}): BlueBubblesDebounceRegistry;
export {};
