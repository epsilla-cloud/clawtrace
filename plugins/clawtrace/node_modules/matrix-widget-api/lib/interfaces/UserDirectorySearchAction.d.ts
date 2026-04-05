import { IWidgetApiRequest, IWidgetApiRequestData } from "./IWidgetApiRequest";
import { IWidgetApiResponseData } from "./IWidgetApiResponse";
import { WidgetApiFromWidgetAction } from "./WidgetApiAction";
export interface IUserDirectorySearchFromWidgetRequestData extends IWidgetApiRequestData {
    search_term: string;
    limit?: number;
}
export interface IUserDirectorySearchFromWidgetActionRequest extends IWidgetApiRequest {
    action: WidgetApiFromWidgetAction.MSC3973UserDirectorySearch;
    data: IUserDirectorySearchFromWidgetRequestData;
}
export interface IUserDirectorySearchFromWidgetResponseData extends IWidgetApiResponseData {
    limited: boolean;
    results: Array<{
        user_id: string;
        display_name?: string;
        avatar_url?: string;
    }>;
}
export interface IUserDirectorySearchFromWidgetActionResponse extends IUserDirectorySearchFromWidgetActionRequest {
    response: IUserDirectorySearchFromWidgetResponseData;
}
