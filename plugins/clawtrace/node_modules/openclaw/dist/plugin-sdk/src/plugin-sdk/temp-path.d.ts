export { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";
/** Build a unique temp file path with sanitized prefix/extension parts. */
export declare function buildRandomTempFilePath(params: {
    prefix: string;
    extension?: string;
    tmpDir?: string;
    now?: number;
    uuid?: string;
}): string;
/** Create a temporary download directory, run the callback, then clean it up best-effort. */
export declare function withTempDownloadPath<T>(params: {
    prefix: string;
    fileName?: string;
    tmpDir?: string;
}, fn: (tmpPath: string) => Promise<T>): Promise<T>;
