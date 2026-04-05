import { type RendezvousFailureListener, type RendezvousFailureReason } from "./index.ts";
export interface RendezvousTransportDetails {
    type: string;
}
/**
 * Interface representing a generic rendezvous transport.
 */
export interface RendezvousTransport<T> {
    /**
     * Ready state of the transport. This is set to true when the transport is ready to be used.
     */
    readonly ready: boolean;
    /**
     * Listener for cancellation events. This is called when the rendezvous is cancelled or fails.
     */
    onFailure?: RendezvousFailureListener;
    /**
     * @returns the transport details that can be encoded in a QR or similar
     */
    details(): Promise<RendezvousTransportDetails>;
    /**
     * Send data via the transport.
     * @param data - the data itself
     */
    send(data: T): Promise<void>;
    /**
     * Receive data from the transport.
     */
    receive(): Promise<Partial<T> | undefined>;
    /**
     * Cancel the rendezvous. This will call `onCancelled()` if it is set.
     * @param reason - the reason for the cancellation/failure
     */
    cancel(reason: RendezvousFailureReason): Promise<void>;
}
//# sourceMappingURL=RendezvousTransport.d.ts.map