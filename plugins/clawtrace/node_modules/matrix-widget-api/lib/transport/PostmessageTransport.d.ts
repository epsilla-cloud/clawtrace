import { EventEmitter } from "events";
import { ITransport } from "./ITransport";
import { IWidgetApiRequest, IWidgetApiRequestData, IWidgetApiResponse, IWidgetApiResponseData, WidgetApiAction, WidgetApiDirection } from "..";
/**
 * Transport for the Widget API over postMessage.
 */
export declare class PostmessageTransport extends EventEmitter implements ITransport {
    private readonly sendDirection;
    private readonly transportWindow;
    private readonly inboundWindow;
    strictOriginCheck: boolean;
    targetOrigin: string;
    timeoutSeconds: number;
    private _ready;
    private _widgetId;
    private readonly outboundRequests;
    private readonly stopController;
    get ready(): boolean;
    get widgetId(): string | null;
    constructor(sendDirection: WidgetApiDirection, initialWidgetId: string | null, transportWindow: Window | typeof globalThis, inboundWindow: Window | typeof globalThis);
    private get nextRequestId();
    private sendInternal;
    reply<T extends IWidgetApiResponseData>(request: IWidgetApiRequest, responseData: T): void;
    send<T extends IWidgetApiRequestData, R extends IWidgetApiResponseData>(action: WidgetApiAction, data: T): Promise<R>;
    sendComplete<T extends IWidgetApiRequestData, R extends IWidgetApiResponse>(action: WidgetApiAction, data: T): Promise<R>;
    start(): void;
    stop(): void;
    private readonly handleMessage;
    private handleRequest;
    private handleResponse;
}
