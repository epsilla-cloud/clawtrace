import { IWidgetApiRequest, IWidgetApiRequestData } from "./IWidgetApiRequest";
import { WidgetApiToWidgetAction } from "./WidgetApiAction";
import { IWidgetApiAcknowledgeResponseData } from "./IWidgetApiResponse";
export interface IThemeChangeActionRequestData extends IWidgetApiRequestData {
}
export interface IThemeChangeActionRequest extends IWidgetApiRequest {
    action: WidgetApiToWidgetAction.ThemeChange;
    data: IThemeChangeActionRequestData;
}
export interface IThemeChangeActionResponse extends IThemeChangeActionRequest {
    response: IWidgetApiAcknowledgeResponseData;
}
