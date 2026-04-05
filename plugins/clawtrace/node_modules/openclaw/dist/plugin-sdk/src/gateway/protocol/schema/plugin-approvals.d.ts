export declare const PluginApprovalRequestParamsSchema: import("@sinclair/typebox").TObject<{
    pluginId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    title: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TString;
    severity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    toolName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    toolCallId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    agentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    sessionKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    turnSourceChannel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    turnSourceTo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    turnSourceAccountId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    turnSourceThreadId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TString, import("@sinclair/typebox").TNumber]>>;
    timeoutMs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    twoPhase: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>;
export declare const PluginApprovalResolveParamsSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    decision: import("@sinclair/typebox").TString;
}>;
