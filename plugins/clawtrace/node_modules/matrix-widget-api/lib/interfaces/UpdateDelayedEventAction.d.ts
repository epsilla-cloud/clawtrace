import { IWidgetApiRequest, IWidgetApiRequestData } from "./IWidgetApiRequest";
import { WidgetApiFromWidgetAction } from "./WidgetApiAction";
import { IWidgetApiResponseData } from "./IWidgetApiResponse";
export declare enum UpdateDelayedEventAction {
    Cancel = "cancel",
    Restart = "restart",
    Send = "send"
}
export interface IUpdateDelayedEventFromWidgetRequestData extends IWidgetApiRequestData {
    delay_id: string;
    action: UpdateDelayedEventAction;
}
export interface IUpdateDelayedEventFromWidgetActionRequest extends IWidgetApiRequest {
    action: WidgetApiFromWidgetAction.MSC4157UpdateDelayedEvent;
    data: IUpdateDelayedEventFromWidgetRequestData;
}
export interface IUpdateDelayedEventFromWidgetResponseData extends IWidgetApiResponseData {
}
export interface IUpdateDelayedEventFromWidgetActionResponse extends IUpdateDelayedEventFromWidgetActionRequest {
    response: IUpdateDelayedEventFromWidgetResponseData;
}
