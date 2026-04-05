export declare function readResponseWithLimit(res: Response, maxBytes: number, opts?: {
    onOverflow?: (params: {
        size: number;
        maxBytes: number;
        res: Response;
    }) => Error;
    chunkTimeoutMs?: number;
    onIdleTimeout?: (params: {
        chunkTimeoutMs: number;
    }) => Error;
}): Promise<Buffer>;
