import { type OlmMachine, type OutgoingRequest, PutDehydratedDeviceRequest, UploadSigningKeysRequest } from "@matrix-org/matrix-sdk-crypto-wasm";
import { type Logger } from "../logger.ts";
import { type IHttpOpts, type MatrixHttpApi } from "../http-api/index.ts";
import { type UIAuthCallback } from "../interactive-auth.ts";
/**
 * OutgoingRequestManager: turns `OutgoingRequest`s from the rust sdk into HTTP requests
 *
 * We have one of these per `RustCrypto` (and hence per `MatrixClient`), not that it does anything terribly complicated.
 * It's responsible for:
 *
 *   * holding the reference to the `MatrixHttpApi`
 *   * turning `OutgoingRequest`s from the rust backend into HTTP requests, and sending them
 *   * sending the results of such requests back to the rust backend.
 *
 * @internal
 */
export declare class OutgoingRequestProcessor {
    private readonly logger;
    private readonly olmMachine;
    private readonly http;
    constructor(logger: Logger, olmMachine: OlmMachine, http: MatrixHttpApi<IHttpOpts & {
        onlyData: true;
    }>);
    makeOutgoingRequest<T>(msg: OutgoingRequest | UploadSigningKeysRequest | PutDehydratedDeviceRequest, uiaCallback?: UIAuthCallback<T>): Promise<void>;
    /**
     * Send the HTTP request for a `ToDeviceRequest`
     *
     * @param request - request to send
     * @returns JSON-serialized body of the response, if successful
     */
    private sendToDeviceRequest;
    private makeRequestWithUIA;
    private requestWithRetry;
    private rawJsonRequest;
}
//# sourceMappingURL=OutgoingRequestProcessor.d.ts.map