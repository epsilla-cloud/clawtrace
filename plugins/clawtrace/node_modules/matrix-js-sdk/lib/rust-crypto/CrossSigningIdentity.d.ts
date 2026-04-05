import { type OlmMachine } from "@matrix-org/matrix-sdk-crypto-wasm";
import { type BootstrapCrossSigningOpts } from "../crypto-api/index.ts";
import { type Logger } from "../logger.ts";
import { type OutgoingRequestProcessor } from "./OutgoingRequestProcessor.ts";
import { type ServerSideSecretStorage } from "../secret-storage.ts";
/** Manages the cross-signing keys for our own user.
 *
 * @internal
 */
export declare class CrossSigningIdentity {
    private readonly logger;
    private readonly olmMachine;
    private readonly outgoingRequestProcessor;
    private readonly secretStorage;
    constructor(logger: Logger, olmMachine: OlmMachine, outgoingRequestProcessor: OutgoingRequestProcessor, secretStorage: ServerSideSecretStorage);
    /**
     * Initialise our cross-signing keys by creating new keys if they do not exist, and uploading to the server
     */
    bootstrapCrossSigning(opts: BootstrapCrossSigningOpts): Promise<void>;
    /** Reset our cross-signing keys
     *
     * This method will:
     *   * Tell the OlmMachine to create new keys
     *   * Upload the new public keys and the device signature to the server
     *   * Upload the private keys to SSSS, if it is set up
     */
    private resetCrossSigning;
    /**
     * Extract the cross-signing keys from the olm machine and save them to secret storage, if it is configured
     *
     * (If secret storage is *not* configured, we assume that the export will happen when it is set up)
     */
    private exportCrossSigningKeysToStorage;
}
//# sourceMappingURL=CrossSigningIdentity.d.ts.map