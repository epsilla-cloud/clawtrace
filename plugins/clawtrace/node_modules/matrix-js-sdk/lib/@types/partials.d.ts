export declare enum Visibility {
    Public = "public",
    Private = "private"
}
export declare enum Preset {
    PrivateChat = "private_chat",
    TrustedPrivateChat = "trusted_private_chat",
    PublicChat = "public_chat"
}
export type ResizeMethod = "crop" | "scale";
export type IdServerUnbindResult = "no-support" | "success";
export declare enum JoinRule {
    Public = "public",
    Invite = "invite",
    /**
     * @deprecated Reserved keyword. Should not be used. Not yet implemented.
     */
    Private = "private",
    Knock = "knock",
    Restricted = "restricted"
}
export declare enum RestrictedAllowType {
    RoomMembership = "m.room_membership"
}
export declare enum GuestAccess {
    CanJoin = "can_join",
    Forbidden = "forbidden"
}
export declare enum HistoryVisibility {
    Invited = "invited",
    Joined = "joined",
    Shared = "shared",
    WorldReadable = "world_readable"
}
export interface IUsageLimit {
    limit_type: "monthly_active_user" | "hs_disabled" | string;
    admin_contact?: string;
}
/**
 * A policy name & url in a specific internationalisation
 * @see https://spec.matrix.org/v1.13/identity-service-api/#get_matrixidentityv2terms_response-200_internationalised-policy
 */
export interface InternationalisedPolicy {
    name: string;
    url: string;
}
/**
 * A versioned policy with internationalised variants
 * @see https://spec.matrix.org/v1.13/identity-service-api/#get_matrixidentityv2terms_response-200_policy-object
 */
export interface Policy {
    /**
     * The version for the policy.
     * There are no requirements on what this might be and could be “alpha”, semantically versioned, or arbitrary.
     */
    version: string;
    /**
     * The policy information for the specified language.
     * @remarks the type has to include a union with string due to limitations in the type system.
     */
    [lang: string]: InternationalisedPolicy | string;
}
/**
 * Response from the Terms API for Identity servers
 * @see https://spec.matrix.org/v1.13/identity-service-api/#get_matrixidentityv2terms
 */
export interface Terms {
    policies: {
        [policyName: string]: Policy;
    };
}
//# sourceMappingURL=partials.d.ts.map