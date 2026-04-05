import { IWidgetApiRequest, IWidgetApiRequestData } from "./IWidgetApiRequest";
import { IWidgetApiResponseData } from "./IWidgetApiResponse";
import { WidgetApiFromWidgetAction } from "./WidgetApiAction";
export interface IDownloadFileActionFromWidgetRequestData extends IWidgetApiRequestData {
    content_uri: string;
}
export interface IDownloadFileActionFromWidgetActionRequest extends IWidgetApiRequest {
    action: WidgetApiFromWidgetAction.MSC4039DownloadFileAction;
    data: IDownloadFileActionFromWidgetRequestData;
}
export interface IDownloadFileActionFromWidgetResponseData extends IWidgetApiResponseData {
    file: XMLHttpRequestBodyInit;
}
export interface IDownloadFileActionFromWidgetActionResponse extends IDownloadFileActionFromWidgetActionRequest {
    response: IDownloadFileActionFromWidgetResponseData;
}
