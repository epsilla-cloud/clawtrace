import { type GroupPolicy, type SenderGroupAccessDecision } from "./runtime-api.js";
export declare function isZaloSenderAllowed(senderId: string, allowFrom: string[]): boolean;
export declare function resolveZaloRuntimeGroupPolicy(params: {
    providerConfigPresent: boolean;
    groupPolicy?: GroupPolicy;
    defaultGroupPolicy?: GroupPolicy;
}): {
    groupPolicy: GroupPolicy;
    providerMissingFallbackApplied: boolean;
};
export declare function evaluateZaloGroupAccess(params: {
    providerConfigPresent: boolean;
    configuredGroupPolicy?: GroupPolicy;
    defaultGroupPolicy?: GroupPolicy;
    groupAllowFrom: string[];
    senderId: string;
}): SenderGroupAccessDecision;
