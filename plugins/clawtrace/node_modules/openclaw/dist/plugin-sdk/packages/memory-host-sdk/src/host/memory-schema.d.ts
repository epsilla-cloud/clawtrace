import type { DatabaseSync } from "node:sqlite";
export declare function ensureMemoryIndexSchema(params: {
    db: DatabaseSync;
    embeddingCacheTable: string;
    cacheEnabled: boolean;
    ftsTable: string;
    ftsEnabled: boolean;
}): {
    ftsAvailable: boolean;
    ftsError?: string;
};
