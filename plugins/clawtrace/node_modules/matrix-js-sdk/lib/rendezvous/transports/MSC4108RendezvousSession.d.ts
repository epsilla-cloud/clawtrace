import { ClientRendezvousFailureReason, MSC4108FailureReason, type RendezvousFailureListener } from "../index.ts";
import { type MatrixClient } from "../../matrix.ts";
/**
 * Prototype of the unstable [MSC4108](https://github.com/matrix-org/matrix-spec-proposals/pull/4108)
 * insecure rendezvous session protocol.
 * @experimental Note that this is UNSTABLE and may have breaking changes without notice.
 */
export declare class MSC4108RendezvousSession {
    url?: string;
    private readonly client?;
    private readonly fallbackRzServer?;
    private readonly fetchFn?;
    private readonly onFailure?;
    private etag?;
    private expiresAt?;
    private expiresTimer?;
    private _cancelled;
    private _ready;
    constructor({ onFailure, url, fetchFn, }: {
        fetchFn?: typeof globalThis.fetch;
        onFailure?: RendezvousFailureListener;
        url: string;
    });
    constructor({ onFailure, client, fallbackRzServer, fetchFn, }: {
        fetchFn?: typeof globalThis.fetch;
        onFailure?: RendezvousFailureListener;
        client?: MatrixClient;
        fallbackRzServer?: string;
    });
    /**
     * Returns whether the channel is ready to be used.
     */
    get ready(): boolean;
    /**
     * Returns whether the channel has been cancelled.
     */
    get cancelled(): boolean;
    private fetch;
    private getPostEndpoint;
    /**
     * Sends data via the rendezvous channel.
     * @param data the payload to send
     */
    send(data: string): Promise<void>;
    /**
     * Receives data from the rendezvous channel.
     * @return the returned promise won't resolve until new data is acquired or the channel is closed either by the server or the other party.
     */
    receive(): Promise<string | undefined>;
    /**
     * Cancels the rendezvous channel.
     * If the reason is user_declined or user_cancelled then the channel will also be closed.
     * @param reason the reason to cancel with
     */
    cancel(reason: MSC4108FailureReason | ClientRendezvousFailureReason): Promise<void>;
    /**
     * Closes the rendezvous channel.
     */
    close(): Promise<void>;
}
//# sourceMappingURL=MSC4108RendezvousSession.d.ts.map