import { type TypedEventEmitter } from "../models/typed-event-emitter.ts";
import { Method } from "./method.ts";
import { type BaseRequestOpts, HttpApiEvent, type HttpApiEventHandlerMap, type IHttpOpts, type IRequestOpts, type Body } from "./interface.ts";
import { type QueryDict } from "../utils.ts";
export declare class FetchHttpApi<O extends IHttpOpts> {
    private eventEmitter;
    readonly opts: O;
    private abortController;
    private readonly tokenRefresher;
    constructor(eventEmitter: TypedEventEmitter<HttpApiEvent, HttpApiEventHandlerMap>, opts: O);
    abort(): void;
    fetch(resource: URL | string, options?: RequestInit): ReturnType<typeof globalThis.fetch>;
    /**
     * Sets the base URL for the identity server
     * @param url - The new base url
     */
    setIdBaseUrl(url?: string): void;
    idServerRequest<T extends object = Record<string, unknown>>(method: Method, path: string, params: Record<string, string | string[]> | undefined, prefix: string, accessToken?: string): Promise<T>;
    /**
     * Perform an authorised request to the homeserver.
     * @param method - The HTTP method e.g. "GET".
     * @param path - The HTTP path <b>after</b> the supplied prefix e.g.
     * "/createRoom".
     *
     * @param queryParams - A dict of query params (these will NOT be
     * urlencoded). If unspecified, there will be no query params.
     *
     * @param body - The HTTP JSON body.
     *
     * @param paramOpts - additional options.
     * When `paramOpts.doNotAttemptTokenRefresh` is true, token refresh will not be attempted
     * when an expired token is encountered. Used to only attempt token refresh once.
     *
     * @returns The parsed response.
     * @throws Error if a problem occurred. This includes network problems and Matrix-specific error JSON.
     */
    authedRequest<T>(method: Method, path: string, queryParams?: QueryDict, body?: Body, paramOpts?: IRequestOpts): Promise<T>;
    private doAuthedRequest;
    /**
     * Perform a request to the homeserver without any credentials.
     * @param method - The HTTP method e.g. "GET".
     * @param path - The HTTP path <b>after</b> the supplied prefix e.g.
     * "/createRoom".
     *
     * @param queryParams - A dict of query params (these will NOT be
     * urlencoded). If unspecified, there will be no query params.
     *
     * @param body - The HTTP JSON body.
     *
     * @param opts - additional options
     *
     * @returns The parsed response.
     * @throws Error if a problem occurred. This includes network problems and Matrix-specific error JSON.
     */
    request<T>(method: Method, path: string, queryParams?: QueryDict, body?: Body, opts?: IRequestOpts): Promise<T>;
    /**
     * Perform a request to an arbitrary URL.
     * @param method - The HTTP method e.g. "GET".
     * @param url - The HTTP URL object.
     *
     * @param body - The HTTP JSON body.
     *
     * @param opts - additional options
     *
     * @returns The parsed response.
     * @throws Error if a problem occurred. This includes network problems and Matrix-specific error JSON.
     */
    requestOtherUrl<T>(method: Method, url: URL | string, body?: Body, opts?: BaseRequestOpts): Promise<T>;
    private sanitizeUrlForLogs;
    /**
     * Form and return a homeserver request URL based on the given path params and prefix.
     * @param path - The HTTP path <b>after</b> the supplied prefix e.g. "/createRoom".
     * @param queryParams - A dict of query params (these will NOT be urlencoded).
     * @param prefix - The full prefix to use e.g. "/_matrix/client/v2_alpha", defaulting to this.opts.prefix.
     * @param baseUrl - The baseUrl to use e.g. "https://matrix.org", defaulting to this.opts.baseUrl.
     * @returns URL
     */
    getUrl(path: string, queryParams?: QueryDict, prefix?: string, baseUrl?: string): URL;
}
//# sourceMappingURL=fetch.d.ts.map