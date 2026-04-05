import { type MatrixEvent } from "./models/event.ts";
import { type MatrixError } from "./http-api/index.ts";
import { type ISendEventResponse } from "./@types/requests.ts";
/**
 * The function to invoke to process (send) events in the queue.
 * @param event - The event to send.
 * @returns Resolved/rejected depending on the outcome of the request.
 */
type ProcessFunction<T> = (event: MatrixEvent) => Promise<T>;
export declare class MatrixScheduler<T = ISendEventResponse> {
    /**
     * The retry algorithm to apply when retrying events. To stop retrying, return
     * `-1`. If this event was part of a queue, it will be removed from
     * the queue.
     * @param event - The event being retried.
     * @param attempts - The number of failed attempts. This will always be \>= 1.
     * @param err - The most recent error message received when trying
     * to send this event.
     * @returns The number of milliseconds to wait before trying again. If
     * this is 0, the request will be immediately retried. If this is
     * `-1`, the event will be marked as
     * {@link EventStatus.NOT_SENT} and will not be retried.
     */
    readonly retryAlgorithm: typeof MatrixScheduler.RETRY_BACKOFF_RATELIMIT;
    /**
     * The queuing algorithm to apply to events. This function must be idempotent as
     * it may be called multiple times with the same event. All queues created are
     * serviced in a FIFO manner. To send the event ASAP, return `null`
     * which will not put this event in a queue. Events that fail to send that form
     * part of a queue will be removed from the queue and the next event in the
     * queue will be sent.
     * @param event - The event to be sent.
     * @returns The name of the queue to put the event into. If a queue with
     * this name does not exist, it will be created. If this is `null`,
     * the event is not put into a queue and will be sent concurrently.
     */
    readonly queueAlgorithm: typeof MatrixScheduler.QUEUE_MESSAGES;
    /**
     * Default retry algorithm for the matrix scheduler. Retries events up to 4 times with exponential backoff.
     * @param attempts - Number of attempts that have been made, including the one that just failed (ie. starting at 1)
     * @see retryAlgorithm
     */
    static RETRY_BACKOFF_RATELIMIT(event: MatrixEvent | null, attempts: number, err: MatrixError): number;
    /**
     * Queues `m.room.message` events and lets other events continue
     * concurrently.
     * @see queueAlgorithm
     */
    static QUEUE_MESSAGES(event: MatrixEvent): string | null;
    private readonly queues;
    private activeQueues;
    private procFn;
    /**
     * Construct a scheduler for Matrix. Requires
     * {@link MatrixScheduler#setProcessFunction} to be provided
     * with a way of processing events.
     * @param retryAlgorithm - Optional. The retry
     * algorithm to apply when determining when to try to send an event again.
     * Defaults to {@link MatrixScheduler.RETRY_BACKOFF_RATELIMIT}.
     * @param queueAlgorithm - Optional. The queuing
     * algorithm to apply when determining which events should be sent before the
     * given event. Defaults to {@link MatrixScheduler.QUEUE_MESSAGES}.
     */
    constructor(
    /**
     * The retry algorithm to apply when retrying events. To stop retrying, return
     * `-1`. If this event was part of a queue, it will be removed from
     * the queue.
     * @param event - The event being retried.
     * @param attempts - The number of failed attempts. This will always be \>= 1.
     * @param err - The most recent error message received when trying
     * to send this event.
     * @returns The number of milliseconds to wait before trying again. If
     * this is 0, the request will be immediately retried. If this is
     * `-1`, the event will be marked as
     * {@link EventStatus.NOT_SENT} and will not be retried.
     */
    retryAlgorithm?: typeof MatrixScheduler.RETRY_BACKOFF_RATELIMIT, 
    /**
     * The queuing algorithm to apply to events. This function must be idempotent as
     * it may be called multiple times with the same event. All queues created are
     * serviced in a FIFO manner. To send the event ASAP, return `null`
     * which will not put this event in a queue. Events that fail to send that form
     * part of a queue will be removed from the queue and the next event in the
     * queue will be sent.
     * @param event - The event to be sent.
     * @returns The name of the queue to put the event into. If a queue with
     * this name does not exist, it will be created. If this is `null`,
     * the event is not put into a queue and will be sent concurrently.
     */
    queueAlgorithm?: typeof MatrixScheduler.QUEUE_MESSAGES);
    /**
     * Retrieve a queue based on an event. The event provided does not need to be in
     * the queue.
     * @param event - An event to get the queue for.
     * @returns A shallow copy of events in the queue or null.
     * Modifying this array will not modify the list itself. Modifying events in
     * this array <i>will</i> modify the underlying event in the queue.
     * @see MatrixScheduler.removeEventFromQueue To remove an event from the queue.
     */
    getQueueForEvent(event: MatrixEvent): MatrixEvent[] | null;
    /**
     * Remove this event from the queue. The event is equal to another event if they
     * have the same ID returned from event.getId().
     * @param event - The event to remove.
     * @returns True if this event was removed.
     */
    removeEventFromQueue(event: MatrixEvent): boolean;
    /**
     * Set the process function. Required for events in the queue to be processed.
     * If set after events have been added to the queue, this will immediately start
     * processing them.
     * @param fn - The function that can process events
     * in the queue.
     */
    setProcessFunction(fn: ProcessFunction<T>): void;
    /**
     * Queue an event if it is required and start processing queues.
     * @param event - The event that may be queued.
     * @returns A promise if the event was queued, which will be
     * resolved or rejected in due time, else null.
     */
    queueEvent(event: MatrixEvent): Promise<T> | null;
    private startProcessingQueues;
    private processQueue;
    private disableQueue;
    private clearQueue;
    private peekNextEvent;
    private removeNextEvent;
}
export {};
//# sourceMappingURL=scheduler.d.ts.map