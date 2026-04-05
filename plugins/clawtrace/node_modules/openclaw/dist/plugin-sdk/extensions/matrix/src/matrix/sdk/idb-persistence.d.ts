export declare function restoreIdbFromDisk(snapshotPath?: string): Promise<boolean>;
export declare function persistIdbToDisk(params?: {
    snapshotPath?: string;
    databasePrefix?: string;
}): Promise<void>;
