import { UnstableValue } from "matrix-events-sdk";
export declare const POLICIES_ACCOUNT_EVENT_TYPE: UnstableValue<"m.policies", "org.matrix.msc3847.policies">;
export declare const IGNORE_INVITES_ACCOUNT_EVENT_KEY: UnstableValue<"m.ignore.invites", "org.matrix.msc3847.ignore.invites">;
export declare enum PolicyRecommendation {
    Ban = "m.ban"
}
/**
 * The various scopes for policies.
 */
export declare enum PolicyScope {
    /**
     * The policy deals with an individual user, e.g. reject invites
     * from this user.
     */
    User = "m.policy.user",
    /**
     * The policy deals with a room, e.g. reject invites towards
     * a specific room.
     */
    Room = "m.policy.room",
    /**
     * The policy deals with a server, e.g. reject invites from
     * this server.
     */
    Server = "m.policy.server"
}
//# sourceMappingURL=invites-ignorer-types.d.ts.map