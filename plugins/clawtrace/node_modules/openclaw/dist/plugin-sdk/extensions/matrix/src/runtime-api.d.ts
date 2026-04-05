export { DEFAULT_ACCOUNT_ID, PAIRING_APPROVED_MESSAGE, buildChannelConfigSchema, buildProbeChannelStatusSummary, collectStatusIssuesFromLastError, createActionGate, formatZonedTimestamp, getChatChannelMeta, jsonResult, normalizeAccountId, normalizeOptionalAccountId, readNumberParam, readReactionParams, readStringArrayParam, readStringParam, } from "openclaw/plugin-sdk/matrix";
export * from "openclaw/plugin-sdk/matrix";
export { assertHttpUrlTargetsPrivateNetwork, closeDispatcher, createPinnedDispatcher, resolvePinnedHostnameWithPolicy, ssrfPolicyFromAllowPrivateNetwork, type LookupFn, type SsrFPolicy, } from "openclaw/plugin-sdk/ssrf-runtime";
export { dispatchReplyFromConfigWithSettledDispatcher, ensureConfiguredAcpBindingReady, maybeCreateMatrixMigrationSnapshot, resolveConfiguredAcpBindingRecord, } from "openclaw/plugin-sdk/matrix-runtime-heavy";
export declare function buildTimeoutAbortSignal(params: {
    timeoutMs?: number;
    signal?: AbortSignal;
}): {
    signal?: AbortSignal;
    cleanup: () => void;
};
