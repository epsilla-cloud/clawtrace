/**
 * Well-known values (from the spec or MSCs) that are allowed in the
 * {@link Membership} type.
 */
export declare enum KnownMembership {
    /**
     * The user has been banned from the room, and is no longer allowed to join
     * it until they are un-banned from the room (by having their membership
     * state set to a value other than ban).
     */
    Ban = "ban",
    /**
     * The user has been invited to join a room, but has not yet joined it.
     * They may not participate in the room until they join.
     * */
    Invite = "invite",
    /**
     * The user has joined the room (possibly after accepting an invite), and
     * may participate in it.
     */
    Join = "join",
    /**
     * The user has knocked on the room, requesting permission to participate.
     * They may not participate in the room until they join.
     */
    Knock = "knock",
    /**
     * The user was once joined to the room, but has since left (possibly by
     * choice, or possibly by being kicked).
     */
    Leave = "leave"
}
/**
 * The membership state for a user in a room [1]. A value from
 * {@link KnownMembership} should be used where available, but all string values
 * are allowed to provide flexibility for upcoming spec changes or proposals.
 *
 * [1] https://spec.matrix.org/latest/client-server-api/#mroommember
 */
export type Membership = KnownMembership | string;
//# sourceMappingURL=membership.d.ts.map