import { type MatrixClient } from "../client.ts";
import { type MatrixEvent } from "./event.ts";
import { type Room } from "./room.ts";
import { IGNORE_INVITES_ACCOUNT_EVENT_KEY, POLICIES_ACCOUNT_EVENT_TYPE, PolicyRecommendation, PolicyScope } from "./invites-ignorer-types.ts";
export { IGNORE_INVITES_ACCOUNT_EVENT_KEY, POLICIES_ACCOUNT_EVENT_TYPE, PolicyRecommendation, PolicyScope };
/**
 * A container for ignored invites.
 *
 * # Performance
 *
 * This implementation is extremely naive. It expects that we are dealing
 * with a very short list of sources (e.g. only one). If real-world
 * applications turn out to require longer lists, we may need to rework
 * our data structures.
 */
export declare class IgnoredInvites {
    private readonly client;
    constructor(client: MatrixClient);
    /**
     * Add a new rule.
     *
     * @param scope - The scope for this rule.
     * @param entity - The entity covered by this rule. Globs are supported.
     * @param reason - A human-readable reason for introducing this new rule.
     * @returns The event id for the new rule.
     */
    addRule(scope: PolicyScope, entity: string, reason: string): Promise<string>;
    /**
     * Remove a rule.
     */
    removeRule(event: MatrixEvent): Promise<void>;
    /**
     * Add a new room to the list of sources. If the user isn't a member of the
     * room, attempt to join it.
     *
     * @param roomId - A valid room id. If this room is already in the list
     * of sources, it will not be duplicated.
     * @returns `true` if the source was added, `false` if it was already present.
     * @throws If `roomId` isn't the id of a room that the current user is already
     * member of or can join.
     *
     * # Safety
     *
     * This method will rewrite the `Policies` object in the user's account data.
     * This rewrite is inherently racy and could overwrite or be overwritten by
     * other concurrent rewrites of the same object.
     */
    addSource(roomId: string): Promise<boolean>;
    /**
     * Find out whether an invite should be ignored.
     *
     * @param params
     * @param params.sender - The user id for the user who issued the invite.
     * @param params.roomId - The room to which the user is invited.
     * @returns A rule matching the entity, if any was found, `null` otherwise.
     */
    getRuleForInvite({ sender, roomId, }: {
        sender: string;
        roomId: string;
    }): Promise<Readonly<MatrixEvent | null>>;
    /**
     * Get the target room, i.e. the room in which any new rule should be written.
     *
     * If there is no target room setup, a target room is created.
     *
     * Note: This method is public for testing reasons. Most clients should not need
     * to call it directly.
     *
     * # Safety
     *
     * This method will rewrite the `Policies` object in the user's account data.
     * This rewrite is inherently racy and could overwrite or be overwritten by
     * other concurrent rewrites of the same object.
     */
    getOrCreateTargetRoom(): Promise<Room>;
    /**
     * Get the list of source rooms, i.e. the rooms from which rules need to be read.
     *
     * If no source rooms are setup, the target room is used as sole source room.
     *
     * Note: This method is public for testing reasons. Most clients should not need
     * to call it directly.
     *
     * # Safety
     *
     * This method will rewrite the `Policies` object in the user's account data.
     * This rewrite is inherently racy and could overwrite or be overwritten by
     * other concurrent rewrites of the same object.
     */
    getOrCreateSourceRooms(): Promise<Room[]>;
    /**
     * Fetch the `IGNORE_INVITES_POLICIES` object from account data.
     *
     * If both an unstable prefix version and a stable prefix version are available,
     * it will return the stable prefix version preferentially.
     *
     * The result is *not* validated but is guaranteed to be a non-null object.
     *
     * @returns A non-null object.
     */
    private getIgnoreInvitesPolicies;
    /**
     * Modify in place the `IGNORE_INVITES_POLICIES` object from account data.
     */
    private withIgnoreInvitesPolicies;
    /**
     * As `getIgnoreInvitesPolicies` but also return the `POLICIES_ACCOUNT_EVENT_TYPE`
     * object.
     */
    private getPoliciesAndIgnoreInvitesPolicies;
}
//# sourceMappingURL=invites-ignorer.d.ts.map