import { type IServerVersions } from "./client.ts";
export declare enum ServerSupport {
    Stable = 0,
    Unstable = 1,
    Unsupported = 2
}
export declare enum Feature {
    Thread = "Thread",
    ThreadUnreadNotifications = "ThreadUnreadNotifications",
    /**
     * @deprecated this is now exposed as a capability not a feature
     */
    LoginTokenRequest = "LoginTokenRequest",
    RelationBasedRedactions = "RelationBasedRedactions",
    AccountDataDeletion = "AccountDataDeletion",
    RelationsRecursion = "RelationsRecursion",
    IntentionalMentions = "IntentionalMentions"
}
export declare function buildFeatureSupportMap(versions: IServerVersions): Promise<Map<Feature, ServerSupport>>;
//# sourceMappingURL=feature.d.ts.map