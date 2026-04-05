import { type MatrixClient } from "../client.ts";
import { GroupCall } from "./groupCall.ts";
import { type RoomMember } from "../models/room-member.ts";
export declare enum GroupCallEventHandlerEvent {
    Incoming = "GroupCall.incoming",
    Outgoing = "GroupCall.outgoing",
    Ended = "GroupCall.ended",
    Participants = "GroupCall.participants"
}
export type GroupCallEventHandlerEventHandlerMap = {
    [GroupCallEventHandlerEvent.Incoming]: (call: GroupCall) => void;
    [GroupCallEventHandlerEvent.Outgoing]: (call: GroupCall) => void;
    [GroupCallEventHandlerEvent.Ended]: (call: GroupCall) => void;
    [GroupCallEventHandlerEvent.Participants]: (participants: RoomMember[], call: GroupCall) => void;
};
export declare class GroupCallEventHandler {
    private client;
    groupCalls: Map<string, GroupCall>;
    private roomDeferreds;
    constructor(client: MatrixClient);
    start(): Promise<void>;
    stop(): void;
    private getRoomDeferred;
    waitUntilRoomReadyForGroupCalls(roomId: string): Promise<void>;
    getGroupCallById(groupCallId: string): GroupCall | undefined;
    private createGroupCallForRoom;
    private createGroupCallFromRoomStateEvent;
    private onRoomsChanged;
    private onRoomStateChanged;
}
//# sourceMappingURL=groupCallEventHandler.d.ts.map