import { type CachedReceipt, type Receipt, ReceiptType, type WrappedReceipt } from "../@types/read_receipts.ts";
import { type ListenerMap, TypedEventEmitter } from "./typed-event-emitter.ts";
import { MatrixEvent } from "./event.ts";
import { type EventTimelineSet } from "./event-timeline-set.ts";
import { NotificationCountType } from "./room.ts";
/**
 * Create a synthetic receipt for the given event
 * @param userId - The user ID if the receipt sender
 * @param event - The event that is to be acknowledged
 * @param receiptType - The type of receipt
 * @param unthreaded - the receipt is unthreaded
 * @returns a new event with the synthetic receipt in it
 */
export declare function synthesizeReceipt(userId: string, event: MatrixEvent, receiptType: ReceiptType, unthreaded?: boolean): MatrixEvent;
export declare abstract class ReadReceipt<Events extends string, Arguments extends ListenerMap<Events>, SuperclassArguments extends ListenerMap<any> = Arguments> extends TypedEventEmitter<Events, Arguments, SuperclassArguments> {
    private receipts;
    private receiptCacheByEventId;
    abstract getUnfilteredTimelineSet(): EventTimelineSet;
    abstract get timeline(): MatrixEvent[];
    /**
     * Gets the latest receipt for a given user in the room
     * @param userId - The id of the user for which we want the receipt
     * @param ignoreSynthesized - Whether to ignore synthesized receipts or not
     * @param receiptType - Optional. The type of the receipt we want to get
     * @returns the latest receipts of the chosen type for the chosen user
     */
    getReadReceiptForUserId(userId: string, ignoreSynthesized?: boolean, receiptType?: ReceiptType): WrappedReceipt | null;
    private compareReceipts;
    /**
     * Get the ID of the event that a given user has read up to, or null if:
     * - we have received no read receipts for them, or
     * - the receipt we have points at an event we don't have, or
     * - the thread ID in the receipt does not match the thread root of the
     *   referenced event.
     *
     * (The event might not exist if it is not loaded, and the thread ID might
     * not match if the event has moved thread because it was redacted.)
     *
     * @param userId - The user ID to get read receipt event ID for
     * @param ignoreSynthesized - If true, return only receipts that have been
     *                            sent by the server, not implicit ones generated
     *                            by the JS SDK.
     * @returns ID of the latest existing event that the given user has read, or null.
     */
    getEventReadUpTo(userId: string, ignoreSynthesized?: boolean): string | null;
    /**
     * Returns true if the event pointed at by this receipt exists, and its
     * threadRootId is consistent with the thread information in the receipt.
     */
    private receiptPointsAtConsistentEvent;
    private getLatestReceipt;
    addReceiptToStructure(eventId: string, receiptType: ReceiptType, userId: string, receipt: Receipt, synthetic: boolean): void;
    /**
     * Get a list of receipts for the given event.
     * @param event - the event to get receipts for
     * @returns A list of receipts with a userId, type and data keys or
     * an empty list.
     */
    getReceiptsForEvent(event: MatrixEvent): CachedReceipt[];
    abstract addReceipt(event: MatrixEvent, synthetic: boolean): void;
    abstract setUnread(type: NotificationCountType, count: number): void;
    /**
     * Look in this room/thread's timeline to find an event. If `this` is a
     * room, we look in all threads, but if `this` is a thread, we look only
     * inside this thread.
     */
    abstract findEventById(eventId: string): MatrixEvent | undefined;
    /**
     * This issue should also be addressed on synapse's side and is tracked as part
     * of https://github.com/matrix-org/synapse/issues/14837
     *
     * Retrieves the read receipt for the logged in user and checks if it matches
     * the last event in the room and whether that event originated from the logged
     * in user.
     * Under those conditions we can consider the context as read. This is useful
     * because we never send read receipts against our own events
     * @param userId - the logged in user
     */
    fixupNotifications(userId: string): void;
    /**
     * Add a temporary local-echo receipt to the room to reflect in the
     * client the fact that we've sent one.
     * @param userId - The user ID if the receipt sender
     * @param e - The event that is to be acknowledged
     * @param receiptType - The type of receipt
     * @param unthreaded - the receipt is unthreaded
     */
    addLocalEchoReceipt(userId: string, e: MatrixEvent, receiptType: ReceiptType, unthreaded?: boolean): void;
    /**
     * Get a list of user IDs who have <b>read up to</b> the given event.
     * @param event - the event to get read receipts for.
     * @returns A list of user IDs.
     */
    getUsersReadUpTo(event: MatrixEvent): string[];
    /**
     * Determines if the given user has read a particular event ID with the known
     * history of the room. This is not a definitive check as it relies only on
     * what is available to the room at the time of execution.
     * @param userId - The user ID to check the read state of.
     * @param eventId - The event ID to check if the user read.
     * @returns True if the user has read the event, false otherwise.
     */
    abstract hasUserReadEvent(userId: string, eventId: string): boolean;
    /**
     * Returns the most recent unthreaded receipt for a given user
     * @param userId - the MxID of the User
     * @returns an unthreaded Receipt. Can be undefined if receipts have been disabled
     * or a user chooses to use private read receipts (or we have simply not received
     * a receipt from this user yet).
     *
     * @deprecated use `hasUserReadEvent` or `getEventReadUpTo` instead
     */
    abstract getLastUnthreadedReceiptFor(userId: string): Receipt | undefined;
}
//# sourceMappingURL=read-receipt.d.ts.map