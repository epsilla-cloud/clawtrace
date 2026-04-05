import { type MatrixEvent } from "matrix-js-sdk/lib/matrix.js";
type MatrixDecryptIfNeededClient = {
    decryptEventIfNeeded?: (event: MatrixEvent, opts?: {
        isRetry?: boolean;
    }) => Promise<void>;
};
type DecryptBridgeRawEvent = {
    event_id: string;
};
type MatrixCryptoRetrySignalSource = {
    on: (eventName: string, listener: (...args: unknown[]) => void) => void;
};
export declare class MatrixDecryptBridge<TRawEvent extends DecryptBridgeRawEvent> {
    private readonly deps;
    private readonly trackedEncryptedEvents;
    private readonly decryptedMessageDedupe;
    private readonly decryptRetries;
    private readonly failedDecryptionsNotified;
    private activeRetryRuns;
    private readonly retryIdleResolvers;
    private cryptoRetrySignalsBound;
    constructor(deps: {
        client: MatrixDecryptIfNeededClient;
        toRaw: (event: MatrixEvent) => TRawEvent;
        emitDecryptedEvent: (roomId: string, event: TRawEvent) => void;
        emitMessage: (roomId: string, event: TRawEvent) => void;
        emitFailedDecryption: (roomId: string, event: TRawEvent, error: Error) => void;
    });
    shouldEmitUnencryptedMessage(roomId: string, eventId: string): boolean;
    attachEncryptedEvent(event: MatrixEvent, roomId: string): void;
    retryPendingNow(reason: string): void;
    bindCryptoRetrySignals(crypto: MatrixCryptoRetrySignalSource | undefined): void;
    stop(): void;
    drainPendingDecryptions(reason: string): Promise<void>;
    private handleEncryptedEventDecrypted;
    private emitFailedDecryptionOnce;
    private scheduleDecryptRetry;
    private runDecryptRetry;
    private clearDecryptRetry;
    private rememberDecryptedMessage;
    private pruneDecryptedMessageDedupe;
    private waitForActiveRetryRunsToFinish;
    private resolveRetryIdleIfNeeded;
}
export {};
