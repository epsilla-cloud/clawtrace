import { IWidgetApiRequest, IWidgetApiRequestData } from "./IWidgetApiRequest";
import { WidgetApiToWidgetAction } from "./WidgetApiAction";
import { IWidgetApiAcknowledgeResponseData } from "./IWidgetApiResponse";
export interface ILanguageChangeActionRequestData extends IWidgetApiRequestData {
    /**
     * The BCP 47 identifier for the client's current language.
     */
    lang: string;
}
export interface ILanguageChangeActionRequest extends IWidgetApiRequest {
    action: WidgetApiToWidgetAction.LanguageChange;
    data: ILanguageChangeActionRequestData;
}
export interface ILanguageChangeActionResponse extends ILanguageChangeActionRequest {
    response: IWidgetApiAcknowledgeResponseData;
}
