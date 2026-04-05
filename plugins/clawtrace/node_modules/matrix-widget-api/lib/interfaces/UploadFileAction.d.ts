import { IWidgetApiRequest, IWidgetApiRequestData } from "./IWidgetApiRequest";
import { IWidgetApiResponseData } from "./IWidgetApiResponse";
import { WidgetApiFromWidgetAction } from "./WidgetApiAction";
export interface IUploadFileActionFromWidgetRequestData extends IWidgetApiRequestData {
    file: XMLHttpRequestBodyInit;
}
export interface IUploadFileActionFromWidgetActionRequest extends IWidgetApiRequest {
    action: WidgetApiFromWidgetAction.MSC4039UploadFileAction;
    data: IUploadFileActionFromWidgetRequestData;
}
export interface IUploadFileActionFromWidgetResponseData extends IWidgetApiResponseData {
    content_uri: string;
}
export interface IUploadFileActionFromWidgetActionResponse extends IUploadFileActionFromWidgetActionRequest {
    response: IUploadFileActionFromWidgetResponseData;
}
