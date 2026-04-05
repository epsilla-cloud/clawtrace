import { FetchHttpApi } from "./fetch.ts";
import { type FileType, type IContentUri, type IHttpOpts, type Upload, type UploadOpts, type UploadResponse } from "./interface.ts";
export * from "./interface.ts";
export * from "./prefix.ts";
export * from "./errors.ts";
export * from "./method.ts";
export * from "./utils.ts";
export declare class MatrixHttpApi<O extends IHttpOpts> extends FetchHttpApi<O> {
    private uploads;
    /**
     * Upload content to the homeserver
     *
     * @param file - The object to upload. On a browser, something that
     *   can be sent to XMLHttpRequest.send (typically a File).  Under node.js,
     *   a Buffer, String or ReadStream.
     *
     * @param opts - options object
     *
     * @returns Promise which resolves to response object, or rejects with an error (usually a MatrixError).
     * @throws May throw a `MatrixSafetyError` if content is deemed unsafe.
     * @see MatrixSafetyError
     */
    uploadContent(file: FileType, opts?: UploadOpts): Promise<UploadResponse>;
    cancelUpload(promise: Promise<UploadResponse>): boolean;
    getCurrentUploads(): Upload[];
    /**
     * Get the content repository url with query parameters.
     * @returns An object with a 'base', 'path' and 'params' for base URL,
     *          path and query parameters respectively.
     */
    getContentUri(): IContentUri;
}
//# sourceMappingURL=index.d.ts.map