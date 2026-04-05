import { MemoryStore, type ISyncData, type ISyncResponse, type IStoredClientOpts } from "matrix-js-sdk/lib/matrix.js";
export declare class FileBackedMatrixSyncStore extends MemoryStore {
    private readonly storagePath;
    private readonly persistLock;
    private readonly accumulator;
    private savedSync;
    private savedClientOptions;
    private readonly hadSavedSyncOnLoad;
    private readonly hadCleanShutdownOnLoad;
    private cleanShutdown;
    private dirty;
    private persistTimer;
    private persistPromise;
    constructor(storagePath: string);
    hasSavedSync(): boolean;
    hasSavedSyncFromCleanShutdown(): boolean;
    getSavedSync(): Promise<ISyncData | null>;
    getSavedSyncToken(): Promise<string | null>;
    setSyncData(syncData: ISyncResponse): Promise<void>;
    getClientOptions(): Promise<IStoredClientOpts | undefined>;
    storeClientOptions(options: IStoredClientOpts): Promise<void>;
    save(force?: boolean): Promise<void>;
    wantsSave(): boolean;
    deleteAllData(): Promise<void>;
    markCleanShutdown(): void;
    flush(): Promise<void>;
    private markDirtyAndSchedulePersist;
    private persist;
}
