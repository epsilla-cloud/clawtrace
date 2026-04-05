export type AsyncLock = <T>(fn: () => Promise<T>) => Promise<T>;
export declare function createAsyncLock(): AsyncLock;
