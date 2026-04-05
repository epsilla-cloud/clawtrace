import { IRoomEvent } from "./IRoomEvent";
import { IWidgetApiRequest, IWidgetApiRequestData } from "./IWidgetApiRequest";
import { IWidgetApiResponseData } from "./IWidgetApiResponse";
import { WidgetApiFromWidgetAction } from "./WidgetApiAction";
export interface IReadRelationsFromWidgetRequestData extends IWidgetApiRequestData {
    event_id: string;
    rel_type?: string;
    event_type?: string;
    room_id?: string;
    limit?: number;
    from?: string;
    to?: string;
    direction?: "f" | "b";
}
export interface IReadRelationsFromWidgetActionRequest extends IWidgetApiRequest {
    action: WidgetApiFromWidgetAction.MSC3869ReadRelations;
    data: IReadRelationsFromWidgetRequestData;
}
export interface IReadRelationsFromWidgetResponseData extends IWidgetApiResponseData {
    chunk: IRoomEvent[];
    next_batch?: string;
    prev_batch?: string;
}
export interface IReadRelationsFromWidgetActionResponse extends IReadRelationsFromWidgetActionRequest {
    response: IReadRelationsFromWidgetResponseData;
}
