import { IWidgetApiRequest, IWidgetApiRequestData } from "./IWidgetApiRequest";
import { WidgetApiToWidgetAction } from "./WidgetApiAction";
import { IWidgetApiResponseData } from "./IWidgetApiResponse";
import { IRoomEvent } from "./IRoomEvent";
export interface IUpdateStateToWidgetRequestData extends IWidgetApiRequestData {
    state: IRoomEvent[];
}
export interface IUpdateStateToWidgetActionRequest extends IWidgetApiRequest {
    action: WidgetApiToWidgetAction.UpdateState;
    data: IUpdateStateToWidgetRequestData;
}
export interface IUpdateStateToWidgetResponseData extends IWidgetApiResponseData {
}
export interface IUpdateStateToWidgetActionResponse extends IUpdateStateToWidgetActionRequest {
    response: IUpdateStateToWidgetResponseData;
}
