import { type RendezvousCode, type RendezvousIntent, type RendezvousFailureReason } from "./index.ts";
export interface RendezvousChannel<T> {
    /**
     * @returns the checksum/confirmation digits to be shown to the user
     */
    connect(): Promise<string>;
    /**
     * Send a payload via the channel.
     * @param data - payload to send
     */
    send(data: T): Promise<void>;
    /**
     * Receive a payload from the channel.
     * @returns the received payload
     */
    receive(): Promise<Partial<T> | undefined>;
    /**
     * Close the channel and clear up any resources.
     */
    close(): Promise<void>;
    /**
     * @returns a representation of the channel that can be encoded in a QR or similar
     */
    generateCode(intent: RendezvousIntent): Promise<RendezvousCode>;
    cancel(reason: RendezvousFailureReason): Promise<void>;
}
//# sourceMappingURL=RendezvousChannel.d.ts.map