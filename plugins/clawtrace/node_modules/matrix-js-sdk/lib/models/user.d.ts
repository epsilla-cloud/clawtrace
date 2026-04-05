import { type MatrixClient } from "../matrix.ts";
import { type MatrixEvent } from "./event.ts";
import { TypedEventEmitter } from "./typed-event-emitter.ts";
export declare enum UserEvent {
    DisplayName = "User.displayName",
    AvatarUrl = "User.avatarUrl",
    Presence = "User.presence",
    CurrentlyActive = "User.currentlyActive",
    LastPresenceTs = "User.lastPresenceTs"
}
export type UserEventHandlerMap = {
    /**
     * Fires whenever any user's display name changes.
     * @param event - The matrix event which caused this event to fire.
     * @param user - The user whose User.displayName changed.
     * @example
     * ```
     * matrixClient.on("User.displayName", function(event, user){
     *   var newName = user.displayName;
     * });
     * ```
     */
    [UserEvent.DisplayName]: (event: MatrixEvent | undefined, user: User) => void;
    /**
     * Fires whenever any user's avatar URL changes.
     * @param event - The matrix event which caused this event to fire.
     * @param user - The user whose User.avatarUrl changed.
     * @example
     * ```
     * matrixClient.on("User.avatarUrl", function(event, user){
     *   var newUrl = user.avatarUrl;
     * });
     * ```
     */
    [UserEvent.AvatarUrl]: (event: MatrixEvent | undefined, user: User) => void;
    /**
     * Fires whenever any user's presence changes.
     * @param event - The matrix event which caused this event to fire.
     * @param user - The user whose User.presence changed.
     * @example
     * ```
     * matrixClient.on("User.presence", function(event, user){
     *   var newPresence = user.presence;
     * });
     * ```
     */
    [UserEvent.Presence]: (event: MatrixEvent | undefined, user: User) => void;
    /**
     * Fires whenever any user's currentlyActive changes.
     * @param event - The matrix event which caused this event to fire.
     * @param user - The user whose User.currentlyActive changed.
     * @example
     * ```
     * matrixClient.on("User.currentlyActive", function(event, user){
     *   var newCurrentlyActive = user.currentlyActive;
     * });
     * ```
     */
    [UserEvent.CurrentlyActive]: (event: MatrixEvent | undefined, user: User) => void;
    /**
     * Fires whenever any user's lastPresenceTs changes,
     * ie. whenever any presence event is received for a user.
     * @param event - The matrix event which caused this event to fire.
     * @param user - The user whose User.lastPresenceTs changed.
     * @example
     * ```
     * matrixClient.on("User.lastPresenceTs", function(event, user){
     *   var newlastPresenceTs = user.lastPresenceTs;
     * });
     * ```
     */
    [UserEvent.LastPresenceTs]: (event: MatrixEvent | undefined, user: User) => void;
};
export declare class User extends TypedEventEmitter<UserEvent, UserEventHandlerMap> {
    readonly userId: string;
    private modified;
    /**
     * The 'displayname' of the user if known.
     * @privateRemarks
     * Should be read-only
     */
    displayName?: string;
    rawDisplayName?: string;
    /**
     * The 'avatar_url' of the user if known.
     * @privateRemarks
     * Should be read-only
     */
    avatarUrl?: string;
    /**
     * The presence status message if known.
     * @privateRemarks
     * Should be read-only
     */
    presenceStatusMsg?: string;
    /**
     * The presence enum if known.
     * @privateRemarks
     * Should be read-only
     */
    presence: string;
    /**
     * Timestamp (ms since the epoch) for when we last received presence data for this user.
     * We can subtract lastActiveAgo from this to approximate an absolute value for when a user was last active.
     * @privateRemarks
     * Should be read-only
     */
    lastActiveAgo: number;
    /**
     * The time elapsed in ms since the user interacted proactively with the server,
     * or we saw a message from the user
     * @privateRemarks
     * Should be read-only
     */
    lastPresenceTs: number;
    /**
     * Whether we should consider lastActiveAgo to be an approximation
     * and that the user should be seen as active 'now'
     * @privateRemarks
     * Should be read-only
     */
    currentlyActive: boolean;
    /**
     * The events describing this user.
     * @privateRemarks
     * Should be read-only
     */
    events: {
        /** The m.presence event for this user. */
        presence?: MatrixEvent;
        profile?: MatrixEvent;
    };
    /**
     * Construct a new User. A User must have an ID and can optionally have extra information associated with it.
     * @param userId - Required. The ID of this user.
     * @deprecated use `User.createUser`
     */
    constructor(userId: string);
    /**
     * Construct a new User whose events will also emit on MatrixClient.
     * A User must have an ID and can optionally have extra information associated with it.
     * @param userId - Required. The ID of this user.
     * @param client - An instance of MatrixClient object
     * @returns User object with reEmitter setup on client
     */
    static createUser(userId: string, client: MatrixClient): User;
    /**
     * Update this User with the given presence event. May fire "User.presence",
     * "User.avatarUrl" and/or "User.displayName" if this event updates this user's
     * properties.
     * @param event - The `m.presence` event.
     *
     * @remarks
     * Fires {@link UserEvent.Presence}
     * Fires {@link UserEvent.DisplayName}
     * Fires {@link UserEvent.AvatarUrl}
     */
    setPresenceEvent(event: MatrixEvent): void;
    /**
     * Manually set this user's display name. No event is emitted in response to this
     * as there is no underlying MatrixEvent to emit with.
     * @param name - The new display name.
     */
    setDisplayName(name: string): void;
    /**
     * Manually set this user's non-disambiguated display name. No event is emitted
     * in response to this as there is no underlying MatrixEvent to emit with.
     * @param name - The new display name.
     */
    setRawDisplayName(name?: string): void;
    /**
     * Manually set this user's avatar URL. No event is emitted in response to this
     * as there is no underlying MatrixEvent to emit with.
     * @param url - The new avatar URL.
     */
    setAvatarUrl(url?: string): void;
    /**
     * Update the last modified time to the current time.
     */
    private updateModifiedTime;
    /**
     * Get the timestamp when this User was last updated. This timestamp is
     * updated when this User receives a new Presence event which has updated a
     * property on this object. It is updated <i>before</i> firing events.
     * @returns The timestamp
     */
    getLastModifiedTime(): number;
    /**
     * Get the absolute timestamp when this User was last known active on the server.
     * It is *NOT* accurate if this.currentlyActive is true.
     * @returns The timestamp
     */
    getLastActiveTs(): number;
}
//# sourceMappingURL=user.d.ts.map