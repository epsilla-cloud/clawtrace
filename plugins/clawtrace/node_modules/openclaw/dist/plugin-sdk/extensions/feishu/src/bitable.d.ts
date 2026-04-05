import type { OpenClawPluginApi } from "../runtime-api.js";
export declare class LarkApiError extends Error {
    readonly code: number;
    readonly api: string;
    readonly context?: Record<string, unknown>;
    constructor(code: number, message: string, api: string, context?: Record<string, unknown>);
}
export declare function registerFeishuBitableTools(api: OpenClawPluginApi): void;
