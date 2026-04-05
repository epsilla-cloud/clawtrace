/**
 * A stripped m.room.member event which contains the key renderable fields from the event,
 * sent only in simplified sliding sync (not `/v3/sync`).
 * This is very similar to MSC4186Hero from sliding-sync.ts but an internal format with
 * camelCase rather than underscores.
 */
export type Hero = {
    userId: string;
    displayName?: string;
    avatarUrl?: string;
    /**
     * If true, the hero is from an MSC4186 summary, in which case `displayName` and `avatarUrl` will
     * have been set by the server if available. If false, the `Hero` has been constructed from a `/v3/sync` response,
     * so these fields will always be undefined.
     */
    fromMSC4186: boolean;
};
/**
 * High level summary information for a room, as returned by `/v3/sync`.
 */
export interface IRoomSummary {
    /**
     * The room heroes: a selected set of members that can be used when summarising or
     * generating a name for a room. List of user IDs.
     */
    "m.heroes": string[];
    /**
     * The number of joined members in the room.
     */
    "m.joined_member_count"?: number;
    /**
     * The number of invited members in the room.
     */
    "m.invited_member_count"?: number;
}
interface IInfo {
    /** The title of the room (e.g. `m.room.name`) */
    title: string;
    /** The description of the room (e.g. `m.room.topic`) */
    desc?: string;
    /** The number of joined users. */
    numMembers?: number;
    /** The list of aliases for this room. */
    aliases?: string[];
    /** The timestamp for this room. */
    timestamp?: number;
}
/**
 * Construct a new Room Summary. A summary can be used for display on a recent
 * list, without having to load the entire room list into memory.
 * @param roomId - Required. The ID of this room.
 * @param info - Optional. The summary info. Additional keys are supported.
 */
export declare class RoomSummary {
    readonly roomId: string;
    constructor(roomId: string, info?: IInfo);
}
export {};
//# sourceMappingURL=room-summary.d.ts.map