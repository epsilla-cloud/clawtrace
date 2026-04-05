import { EventEmitter } from "events";
import { ITransport } from "./transport/ITransport";
import { Widget } from "./models/Widget";
import { Capability } from "./interfaces/Capabilities";
import { WidgetDriver } from "./driver/WidgetDriver";
import { ApiVersion } from "./interfaces/ApiVersion";
import { IScreenshotActionResponseData } from "./interfaces/ScreenshotAction";
import { IWidgetApiResponseData } from "./interfaces/IWidgetApiResponse";
import { IModalWidgetOpenRequestData, IModalWidgetOpenRequestDataButton, IModalWidgetReturnData } from "./interfaces/ModalWidgetActions";
import { IRoomEvent } from "./interfaces/IRoomEvent";
import { Symbols } from "./Symbols";
import { IThemeChangeActionRequestData } from "./interfaces/ThemeChangeAction";
import { IToDeviceMessage } from "./interfaces/IToDeviceMessage";
/**
 * API handler for the client side of widgets. This raises events
 * for each action received as `action:${action}` (eg: "action:screenshot").
 * Default handling can be prevented by using preventDefault() on the
 * raised event. The default handling varies for each action: ones
 * which the SDK can handle safely are acknowledged appropriately and
 * ones which are unhandled (custom or require the client to do something)
 * are rejected with an error.
 *
 * Events which are preventDefault()ed must reply using the transport.
 * The events raised will have a default of an IWidgetApiRequest
 * interface.
 *
 * When the ClientWidgetApi is ready to start sending requests, it will
 * raise a "ready" CustomEvent. After the ready event fires, actions can
 * be sent and the transport will be ready.
 *
 * When the widget has indicated it has loaded, this class raises a
 * "preparing" CustomEvent. The preparing event does not indicate that
 * the widget is ready to receive communications - that is signified by
 * the ready event exclusively.
 *
 * This class only handles one widget at a time.
 */
export declare class ClientWidgetApi extends EventEmitter {
    readonly widget: Widget;
    private readonly driver;
    readonly transport: ITransport;
    private cachedWidgetVersions;
    private contentLoadedActionSent;
    private readonly allowedCapabilities;
    private readonly allowedEvents;
    private isStopped;
    private turnServers;
    private contentLoadedWaitTimer?;
    private readonly pushRoomStateTasks;
    private readonly pushRoomStateResult;
    private flushRoomStateTask;
    /**
     * Creates a new client widget API. This will instantiate the transport
     * and start everything. When the iframe is loaded under the widget's
     * conditions, a "ready" event will be raised.
     * @param {Widget} widget The widget to communicate with.
     * @param {HTMLIFrameElement} iframe The iframe the widget is in.
     * @param {WidgetDriver} driver The driver for this widget/client.
     */
    constructor(widget: Widget, iframe: HTMLIFrameElement, driver: WidgetDriver);
    hasCapability(capability: Capability): boolean;
    canUseRoomTimeline(roomId: string | Symbols.AnyRoom): boolean;
    canSendRoomEvent(eventType: string, msgtype?: string | null): boolean;
    canSendStateEvent(eventType: string, stateKey: string): boolean;
    canSendToDeviceEvent(eventType: string): boolean;
    canReceiveRoomEvent(eventType: string, msgtype?: string | null): boolean;
    canReceiveStateEvent(eventType: string, stateKey: string | null): boolean;
    canReceiveToDeviceEvent(eventType: string): boolean;
    canReceiveRoomAccountData(eventType: string): boolean;
    stop(): void;
    getWidgetVersions(): Promise<ApiVersion[]>;
    private beginCapabilities;
    private allowCapabilities;
    private onIframeLoad;
    private handleContentLoadedAction;
    private replyVersions;
    private supportsUpdateState;
    private handleCapabilitiesRenegotiate;
    private handleNavigate;
    private handleOIDC;
    private handleReadRoomAccountData;
    private handleReadEvents;
    private handleSendEvent;
    private handleUpdateDelayedEvent;
    private handleSendToDevice;
    private pollTurnServers;
    private handleWatchTurnServers;
    private handleUnwatchTurnServers;
    private handleReadRelations;
    private handleUserDirectorySearch;
    private handleGetMediaConfig;
    private handleUploadFile;
    private handleDownloadFile;
    private handleDriverError;
    private handleMessage;
    /**
     * Informs the widget that the client's theme has changed.
     * @param theme The theme data, as an object with arbitrary contents.
     */
    updateTheme(theme: IThemeChangeActionRequestData): Promise<IWidgetApiResponseData>;
    /**
     * Informs the widget that the client's language has changed.
     * @param lang The BCP 47 identifier representing the client's current language.
     */
    updateLanguage(lang: string): Promise<IWidgetApiResponseData>;
    /**
     * Takes a screenshot of the widget.
     * @returns Resolves to the widget's screenshot.
     * @throws Throws if there is a problem.
     */
    takeScreenshot(): Promise<IScreenshotActionResponseData>;
    /**
     * Alerts the widget to whether or not it is currently visible.
     * @param {boolean} isVisible Whether the widget is visible or not.
     * @returns {Promise<IWidgetApiResponseData>} Resolves when the widget acknowledges the update.
     */
    updateVisibility(isVisible: boolean): Promise<IWidgetApiResponseData>;
    sendWidgetConfig(data: IModalWidgetOpenRequestData): Promise<void>;
    notifyModalWidgetButtonClicked(id: IModalWidgetOpenRequestDataButton["id"]): Promise<void>;
    notifyModalWidgetClose(data: IModalWidgetReturnData): Promise<void>;
    /**
     * Feeds an event to the widget. As a client you are expected to call this
     * for every new event in every room to which you are joined or invited.
     * @param {IRoomEvent} rawEvent The event to (try to) send to the widget.
     * @param {string} currentViewedRoomId The room ID the user is currently
     *   interacting with. Not the room ID of the event.
     * @returns {Promise<void>} Resolves when delivered or if the widget is not
     *   able to read the event due to permissions, rejects if the widget failed
     *   to handle the event.
     * @deprecated It is recommended to communicate the viewed room ID by calling
     *   {@link ClientWidgetApi.setViewedRoomId} rather than passing it to this
     *   method.
     */
    feedEvent(rawEvent: IRoomEvent, currentViewedRoomId: string): Promise<void>;
    /**
     * Feeds an event to the widget. As a client you are expected to call this
     * for every new event (including state events) in every room to which you are joined or invited.
     * @param {IRoomEvent} rawEvent The event to (try to) send to the widget.
     * @returns {Promise<void>} Resolves when delivered or if the widget is not
     *   able to read the event due to permissions, rejects if the widget failed
     *   to handle the event.
     */
    feedEvent(rawEvent: IRoomEvent): Promise<void>;
    /**
     * Feeds a to-device event to the widget. As a client you are expected to
     * call this for every to-device event you receive.
     * @param {IRoomEvent} rawEvent The event to (try to) send to the widget.
     * @param {boolean} encrypted Whether the event contents were encrypted.
     * @returns {Promise<void>} Resolves when delivered or if the widget is not
     *   able to receive the event due to permissions, rejects if the widget
     *   failed to handle the event.
     */
    feedToDevice(message: IToDeviceMessage, encrypted: boolean): Promise<void>;
    private viewedRoomId;
    /**
     * Indicate that a room is being viewed (making it possible for the widget
     * to interact with it).
     */
    setViewedRoomId(roomId: string | null): void;
    private flushRoomState;
    /**
     * Reads the current sticky state of the room and pushes it to the widget.
     *
     * It will only push events that the widget is allowed to receive.
     * @param roomId
     * @private
     */
    private pushStickyState;
    /**
     * Read the room's state and push all entries that the widget is allowed to
     * read through to the widget.
     */
    private pushRoomState;
    /**
     * Feeds a room state update to the widget. As a client you are expected to
     * call this for every state update in every room to which you are joined or
     * invited.
     * @param {IRoomEvent} rawEvent The state event corresponding to the updated
     *   room state entry.
     * @returns {Promise<void>} Resolves when delivered or if the widget is not
     *   able to receive the room state due to permissions, rejects if the
     *   widget failed to handle the update.
     */
    feedStateUpdate(rawEvent: IRoomEvent): Promise<void>;
}
