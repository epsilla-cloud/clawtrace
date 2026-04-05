import { type OlmMachine, type UserId } from "@matrix-org/matrix-sdk-crypto-wasm";
import { type OutgoingRequestProcessor } from "./OutgoingRequestProcessor.ts";
import { type LogSpan } from "../logger.ts";
/**
 * KeyClaimManager: linearises calls to OlmMachine.getMissingSessions to avoid races
 *
 * We have one of these per `RustCrypto` (and hence per `MatrixClient`).
 *
 * @internal
 */
export declare class KeyClaimManager {
    private readonly olmMachine;
    private readonly outgoingRequestProcessor;
    private currentClaimPromise;
    private stopped;
    constructor(olmMachine: OlmMachine, outgoingRequestProcessor: OutgoingRequestProcessor);
    /**
     * Tell the KeyClaimManager to immediately stop processing requests.
     *
     * Any further calls, and any still in the queue, will fail with an error.
     */
    stop(): void;
    /**
     * Given a list of users, attempt to ensure that we have Olm Sessions active with each of their devices
     *
     * If we don't have an active olm session, we will claim a one-time key and start one.
     * @param logger - logger to use
     * @param userList - list of userIDs to claim
     */
    ensureSessionsForUsers(logger: LogSpan, userList: Array<UserId>): Promise<void>;
    private ensureSessionsForUsersInner;
}
//# sourceMappingURL=KeyClaimManager.d.ts.map