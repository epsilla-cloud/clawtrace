import { type IMinimalEvent } from "./sync-accumulator.ts";
/**
 * Summarises the read receipts within a room. Used by the sync accumulator.
 *
 * Given receipts for users, picks the most recently-received one and provides
 * the results in a new fake receipt event returned from
 * buildAccumulatedReceiptEvent().
 *
 * Handles unthreaded receipts and receipts in each thread separately, so the
 * returned event contains the most recently received unthreaded receipt, and
 * the most recently received receipt in each thread.
 */
export declare class ReceiptAccumulator {
    /** user_id -\> most-recently-received unthreaded receipt */
    private unthreadedReadReceipts;
    /** thread_id -\> user_id -\> most-recently-received receipt for this thread */
    private threadedReadReceipts;
    /**
     * Provide an unthreaded receipt for this user. Overwrites any other
     * unthreaded receipt we have for this user.
     */
    private setUnthreaded;
    /**
     * Provide a receipt for this user in this thread. Overwrites any other
     * receipt we have for this user in this thread.
     */
    private setThreaded;
    /**
     * @returns an iterator of pairs of [userId, AccumulatedReceipt] - all the
     *          most recently-received unthreaded receipts for each user.
     */
    private allUnthreaded;
    /**
     * @returns an iterator of pairs of [userId, AccumulatedReceipt] - all the
     *          most recently-received threaded receipts for each user, in all
     *          threads.
     */
    private allThreaded;
    /**
     * Given a list of ephemeral events, find the receipts and store the
     * relevant ones to be returned later from buildAccumulatedReceiptEvent().
     */
    consumeEphemeralEvents(events: IMinimalEvent[] | undefined): void;
    /**
     * Build a receipt event that contains all relevant information for this
     * room, taking the most recently received receipt for each user in an
     * unthreaded context, and in each thread.
     */
    buildAccumulatedReceiptEvent(roomId: string): IMinimalEvent | null;
}
//# sourceMappingURL=receipt-accumulator.d.ts.map