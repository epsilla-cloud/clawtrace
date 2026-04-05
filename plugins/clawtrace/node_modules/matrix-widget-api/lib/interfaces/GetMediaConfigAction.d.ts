import { IWidgetApiRequest, IWidgetApiRequestData } from "./IWidgetApiRequest";
import { IWidgetApiResponseData } from "./IWidgetApiResponse";
import { WidgetApiFromWidgetAction } from "./WidgetApiAction";
export interface IGetMediaConfigActionFromWidgetRequestData extends IWidgetApiRequestData {
}
export interface IGetMediaConfigActionFromWidgetActionRequest extends IWidgetApiRequest {
    action: WidgetApiFromWidgetAction.MSC4039GetMediaConfigAction;
    data: IGetMediaConfigActionFromWidgetRequestData;
}
export interface IGetMediaConfigActionFromWidgetResponseData extends IWidgetApiResponseData {
    "m.upload.size"?: number;
}
export interface IGetMediaConfigActionFromWidgetActionResponse extends IGetMediaConfigActionFromWidgetActionRequest {
    response: IGetMediaConfigActionFromWidgetResponseData;
}
