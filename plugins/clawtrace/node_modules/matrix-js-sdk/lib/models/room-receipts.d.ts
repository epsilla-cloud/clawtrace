import { type ReceiptContent } from "../@types/read_receipts.ts";
import { type Room } from "./room.ts";
/**
 * The latest receipts we have for a room.
 */
export declare class RoomReceipts {
    private room;
    private threadedReceipts;
    private unthreadedReceipts;
    private danglingReceipts;
    constructor(room: Room);
    /**
     * Remember the receipt information supplied. For each receipt:
     *
     * If we don't have the event for this receipt, store it as "dangling" so we
     * can process it later.
     *
     * Otherwise store it per-user in either the threaded store for its
     * thread_id, or the unthreaded store if there is no thread_id.
     *
     * Ignores any receipt that is before an existing receipt for the same user
     * (in the same thread, if applicable). "Before" is defined by the
     * unfilteredTimelineSet of the room.
     */
    add(receiptContent: ReceiptContent, synthetic: boolean): void;
    /**
     * Look for dangling receipts for the given event ID,
     * and add them to the thread of unthread receipts if found.
     * @param event - the event to look for
     */
    private onTimelineEvent;
    hasUserReadEvent(userId: string, eventId: string): boolean;
    /**
     * @returns true if the thread with this ID can be found, and the supplied
     *          user sent the latest message in it.
     */
    private userSentLatestEventInThread;
}
//# sourceMappingURL=room-receipts.d.ts.map