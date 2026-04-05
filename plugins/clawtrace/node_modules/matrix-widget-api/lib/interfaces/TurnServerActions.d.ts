import { IWidgetApiRequest, IWidgetApiRequestData, IWidgetApiRequestEmptyData } from "./IWidgetApiRequest";
import { WidgetApiFromWidgetAction, WidgetApiToWidgetAction } from "./WidgetApiAction";
import { IWidgetApiAcknowledgeResponseData, IWidgetApiResponse } from "./IWidgetApiResponse";
export interface ITurnServer {
    uris: string[];
    username: string;
    password: string;
}
export interface IWatchTurnServersRequest extends IWidgetApiRequest {
    action: WidgetApiFromWidgetAction.WatchTurnServers;
    data: IWidgetApiRequestEmptyData;
}
export interface IWatchTurnServersResponse extends IWidgetApiResponse {
    response: IWidgetApiAcknowledgeResponseData;
}
export interface IUnwatchTurnServersRequest extends IWidgetApiRequest {
    action: WidgetApiFromWidgetAction.UnwatchTurnServers;
    data: IWidgetApiRequestEmptyData;
}
export interface IUnwatchTurnServersResponse extends IWidgetApiResponse {
    response: IWidgetApiAcknowledgeResponseData;
}
export interface IUpdateTurnServersRequestData extends IWidgetApiRequestData, ITurnServer {
}
export interface IUpdateTurnServersRequest extends IWidgetApiRequest {
    action: WidgetApiToWidgetAction.UpdateTurnServers;
    data: IUpdateTurnServersRequestData;
}
export interface IUpdateTurnServersResponse extends IWidgetApiResponse {
    response: IWidgetApiAcknowledgeResponseData;
}
