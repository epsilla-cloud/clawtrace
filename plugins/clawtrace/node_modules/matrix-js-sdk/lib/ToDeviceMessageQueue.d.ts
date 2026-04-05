import { type Logger } from "./logger.ts";
import { type MatrixClient } from "./client.ts";
import { type ToDeviceBatch } from "./models/ToDeviceMessage.ts";
/**
 * Maintains a queue of outgoing to-device messages, sending them
 * as soon as the homeserver is reachable.
 */
export declare class ToDeviceMessageQueue {
    private client;
    private readonly logger;
    private sending;
    private running;
    private retryTimeout;
    private retryAttempts;
    constructor(client: MatrixClient, logger: Logger);
    start(): void;
    stop(): void;
    queueBatch(batch: ToDeviceBatch): Promise<void>;
    sendQueue: () => Promise<void>;
    /**
     * Attempts to send a batch of to-device messages.
     */
    private sendBatch;
    /**
     * Listen to sync state changes and automatically resend any pending events
     * once syncing is resumed
     */
    private onResumedSync;
}
//# sourceMappingURL=ToDeviceMessageQueue.d.ts.map