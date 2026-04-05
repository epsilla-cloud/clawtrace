import { postJsonWithRetry, type EmbeddingBatchExecutionParams, type EmbeddingBatchStatus, type ProviderBatchOutputLine, uploadBatchJsonlFile, withRemoteHttpResponse } from "./batch-embedding-common.js";
import type { VoyageEmbeddingClient } from "./embeddings-voyage.js";
/**
 * Voyage Batch API Input Line format.
 * See: https://docs.voyageai.com/docs/batch-inference
 */
export type VoyageBatchRequest = {
    custom_id: string;
    body: {
        input: string | string[];
    };
};
export type VoyageBatchStatus = EmbeddingBatchStatus;
export type VoyageBatchOutputLine = ProviderBatchOutputLine;
export declare const VOYAGE_BATCH_ENDPOINT = "/v1/embeddings";
type VoyageBatchDeps = {
    now: () => number;
    sleep: (ms: number) => Promise<void>;
    postJsonWithRetry: typeof postJsonWithRetry;
    uploadBatchJsonlFile: typeof uploadBatchJsonlFile;
    withRemoteHttpResponse: typeof withRemoteHttpResponse;
};
export declare function runVoyageEmbeddingBatches(params: {
    client: VoyageEmbeddingClient;
    agentId: string;
    requests: VoyageBatchRequest[];
    deps?: Partial<VoyageBatchDeps>;
} & EmbeddingBatchExecutionParams): Promise<Map<string, number[]>>;
export {};
