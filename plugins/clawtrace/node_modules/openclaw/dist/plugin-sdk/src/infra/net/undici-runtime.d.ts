export declare const TEST_UNDICI_RUNTIME_DEPS_KEY = "__OPENCLAW_TEST_UNDICI_RUNTIME_DEPS__";
export type UndiciRuntimeDeps = {
    Agent: typeof import("undici").Agent;
    EnvHttpProxyAgent: typeof import("undici").EnvHttpProxyAgent;
    ProxyAgent: typeof import("undici").ProxyAgent;
};
export declare function loadUndiciRuntimeDeps(): UndiciRuntimeDeps;
