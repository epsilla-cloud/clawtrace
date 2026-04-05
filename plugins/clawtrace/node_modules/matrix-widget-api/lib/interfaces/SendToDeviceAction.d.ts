import { IWidgetApiRequest, IWidgetApiRequestData } from "./IWidgetApiRequest";
import { WidgetApiFromWidgetAction, WidgetApiToWidgetAction } from "./WidgetApiAction";
import { IWidgetApiResponseData } from "./IWidgetApiResponse";
import { IToDeviceMessage } from "./IToDeviceMessage";
export interface ISendToDeviceFromWidgetRequestData extends IWidgetApiRequestData {
    type: string;
    encrypted: boolean;
    messages: {
        [userId: string]: {
            [deviceId: string]: object;
        };
    };
}
export interface ISendToDeviceFromWidgetActionRequest extends IWidgetApiRequest {
    action: WidgetApiFromWidgetAction.SendToDevice;
    data: ISendToDeviceFromWidgetRequestData;
}
export interface ISendToDeviceFromWidgetResponseData extends IWidgetApiResponseData {
}
export interface ISendToDeviceFromWidgetActionResponse extends ISendToDeviceFromWidgetActionRequest {
    response: ISendToDeviceFromWidgetResponseData;
}
export interface ISendToDeviceToWidgetRequestData extends IWidgetApiRequestData, IToDeviceMessage {
    encrypted: boolean;
}
export interface ISendToDeviceToWidgetActionRequest extends IWidgetApiRequest {
    action: WidgetApiToWidgetAction.SendToDevice;
    data: ISendToDeviceToWidgetRequestData;
}
export interface ISendToDeviceToWidgetResponseData extends IWidgetApiResponseData {
}
export interface ISendToDeviceToWidgetActionResponse extends ISendToDeviceToWidgetActionRequest {
    response: ISendToDeviceToWidgetResponseData;
}
