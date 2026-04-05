import type { RuntimeEnv } from "openclaw/plugin-sdk/runtime-env";
export type TelegramApiLogger = (message: string) => void;
type TelegramApiLoggingParams<T> = {
    operation: string;
    fn: () => Promise<T>;
    runtime?: RuntimeEnv;
    logger?: TelegramApiLogger;
    shouldLog?: (err: unknown) => boolean;
};
export declare function withTelegramApiErrorLogging<T>({ operation, fn, runtime, logger, shouldLog, }: TelegramApiLoggingParams<T>): Promise<T>;
export {};
