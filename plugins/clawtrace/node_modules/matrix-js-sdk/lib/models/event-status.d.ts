/**
 * Enum for event statuses.
 * @readonly
 */
export declare enum EventStatus {
    /** The event was not sent and will no longer be retried. */
    NOT_SENT = "not_sent",
    /** The message is being encrypted */
    ENCRYPTING = "encrypting",
    /** The event is in the process of being sent. */
    SENDING = "sending",
    /** The event is in a queue waiting to be sent. */
    QUEUED = "queued",
    /** The event has been sent to the server, but we have not yet received the echo. */
    SENT = "sent",
    /** The event was cancelled before it was successfully sent. */
    CANCELLED = "cancelled"
}
//# sourceMappingURL=event-status.d.ts.map