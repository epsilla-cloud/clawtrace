import { type OlmMachine } from "@matrix-org/matrix-sdk-crypto-wasm";
import { type OutgoingRequestProcessor } from "./OutgoingRequestProcessor.ts";
import { type Logger } from "../logger.ts";
/**
 * OutgoingRequestsManager: responsible for processing outgoing requests from the OlmMachine.
 * Ensure that only one loop is going on at once, and that the requests are processed in order.
 */
export declare class OutgoingRequestsManager {
    private readonly logger;
    private readonly olmMachine;
    readonly outgoingRequestProcessor: OutgoingRequestProcessor;
    /** whether {@link stop} has been called */
    private stopped;
    /** whether {@link outgoingRequestLoop} is currently running */
    private outgoingRequestLoopRunning;
    /**
     * If there are additional calls to doProcessOutgoingRequests() while there is a current call running
     * we need to remember in order to call `doProcessOutgoingRequests` again (as there could be new requests).
     *
     * If this is defined, it is an indication that we need to do another iteration; in this case the deferred
     * will resolve once that next iteration completes. If it is undefined, there have been no new calls
     * to `doProcessOutgoingRequests` since the current iteration started.
     */
    private nextLoopDeferred?;
    constructor(logger: Logger, olmMachine: OlmMachine, outgoingRequestProcessor: OutgoingRequestProcessor);
    /**
     * Shut down as soon as possible the current loop of outgoing requests processing.
     */
    stop(): void;
    /**
     * Process the OutgoingRequests from the OlmMachine.
     *
     * This should be called at the end of each sync, to process any OlmMachine OutgoingRequests created by the rust sdk.
     * In some cases if OutgoingRequests need to be sent immediately, this can be called directly.
     *
     * Calls to doProcessOutgoingRequests() are processed synchronously, one after the other, in order.
     * If doProcessOutgoingRequests() is called while another call is still being processed, it will be queued.
     * Multiple calls to doProcessOutgoingRequests() when a call is already processing will be batched together.
     */
    doProcessOutgoingRequests(): Promise<void>;
    private outgoingRequestLoop;
    /**
     * Make a single request to `olmMachine.outgoingRequests` and do the corresponding requests.
     */
    private processOutgoingRequests;
}
//# sourceMappingURL=OutgoingRequestsManager.d.ts.map