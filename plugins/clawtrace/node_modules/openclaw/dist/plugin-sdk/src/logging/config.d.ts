import type { OpenClawConfig } from "../config/config.js";
type LoggingConfig = OpenClawConfig["logging"];
export declare function shouldSkipMutatingLoggingConfigRead(argv?: string[]): boolean;
export declare function readLoggingConfig(): LoggingConfig | undefined;
export {};
