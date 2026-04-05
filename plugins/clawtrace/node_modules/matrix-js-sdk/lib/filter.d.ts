import { type EventType, type RelationType } from "./@types/event.ts";
import { FilterComponent, type IFilterComponent } from "./filter-component.ts";
import { type MatrixEvent } from "./models/event.ts";
export interface IFilterDefinition {
    event_fields?: string[];
    event_format?: "client" | "federation";
    presence?: IFilterComponent;
    account_data?: IFilterComponent;
    room?: IRoomFilter;
}
export interface IRoomEventFilter extends IFilterComponent {
    "lazy_load_members"?: boolean;
    "include_redundant_members"?: boolean;
    "types"?: Array<EventType | string>;
    "related_by_senders"?: Array<RelationType | string>;
    "related_by_rel_types"?: string[];
    "unread_thread_notifications"?: boolean;
    "org.matrix.msc3773.unread_thread_notifications"?: boolean;
    "io.element.relation_senders"?: Array<RelationType | string>;
    "io.element.relation_types"?: string[];
}
interface IStateFilter extends IRoomEventFilter {
}
interface IRoomFilter {
    not_rooms?: string[];
    rooms?: string[];
    ephemeral?: IRoomEventFilter;
    include_leave?: boolean;
    state?: IStateFilter;
    timeline?: IRoomEventFilter;
    account_data?: IRoomEventFilter;
}
export declare class Filter {
    readonly userId: string | undefined | null;
    filterId?: string | undefined;
    static LAZY_LOADING_MESSAGES_FILTER: {
        lazy_load_members: boolean;
    };
    /**
     * Create a filter from existing data.
     */
    static fromJson(userId: string | undefined | null, filterId: string, jsonObj: IFilterDefinition): Filter;
    private definition;
    private roomFilter?;
    private roomTimelineFilter?;
    /**
     * Construct a new Filter.
     * @param userId - The user ID for this filter.
     * @param filterId - The filter ID if known.
     */
    constructor(userId: string | undefined | null, filterId?: string | undefined);
    /**
     * Get the ID of this filter on your homeserver (if known)
     * @returns The filter ID
     */
    getFilterId(): string | undefined;
    /**
     * Get the JSON body of the filter.
     * @returns The filter definition
     */
    getDefinition(): IFilterDefinition;
    /**
     * Set the JSON body of the filter
     * @param definition - The filter definition
     */
    setDefinition(definition: IFilterDefinition): void;
    /**
     * Get the room.timeline filter component of the filter
     * @returns room timeline filter component
     */
    getRoomTimelineFilterComponent(): FilterComponent | undefined;
    /**
     * Filter the list of events based on whether they are allowed in a timeline
     * based on this filter
     * @param events -  the list of events being filtered
     * @returns the list of events which match the filter
     */
    filterRoomTimeline(events: MatrixEvent[]): MatrixEvent[];
    /**
     * Set the max number of events to return for each room's timeline.
     * @param limit - The max number of events to return for each room.
     */
    setTimelineLimit(limit: number): void;
    /**
     * Enable threads unread notification
     */
    setUnreadThreadNotifications(enabled: boolean): void;
    setLazyLoadMembers(enabled: boolean): void;
    /**
     * Control whether left rooms should be included in responses.
     * @param includeLeave - True to make rooms the user has left appear
     * in responses.
     */
    setIncludeLeaveRooms(includeLeave: boolean): void;
}
export {};
//# sourceMappingURL=filter.d.ts.map