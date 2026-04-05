import { type IPublicRoomsChunkRoom } from "../client.ts";
import { type RoomType } from "./event.ts";
import { type IStrippedState } from "../sync-accumulator.ts";
export interface IHierarchyRelation extends IStrippedState {
    origin_server_ts: number;
    content: {
        order?: string;
        suggested?: boolean;
        via?: string[];
    };
}
export interface IHierarchyRoom extends IPublicRoomsChunkRoom {
    room_type?: RoomType | string;
    children_state: IHierarchyRelation[];
}
//# sourceMappingURL=spaces.d.ts.map