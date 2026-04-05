import type { FileLockOptions } from "./file-lock.js";
export type PersistentDedupeOptions = {
    ttlMs: number;
    memoryMaxSize: number;
    fileMaxEntries: number;
    resolveFilePath: (namespace: string) => string;
    lockOptions?: Partial<FileLockOptions>;
    onDiskError?: (error: unknown) => void;
};
export type PersistentDedupeCheckOptions = {
    namespace?: string;
    now?: number;
    onDiskError?: (error: unknown) => void;
};
export type PersistentDedupe = {
    checkAndRecord: (key: string, options?: PersistentDedupeCheckOptions) => Promise<boolean>;
    warmup: (namespace?: string, onError?: (error: unknown) => void) => Promise<number>;
    clearMemory: () => void;
    memorySize: () => number;
};
/** Create a dedupe helper that combines in-memory fast checks with a lock-protected disk store. */
export declare function createPersistentDedupe(options: PersistentDedupeOptions): PersistentDedupe;
