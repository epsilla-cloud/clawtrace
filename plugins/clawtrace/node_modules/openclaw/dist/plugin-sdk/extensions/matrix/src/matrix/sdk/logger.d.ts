export type Logger = {
    trace: (module: string, ...messageOrObject: unknown[]) => void;
    debug: (module: string, ...messageOrObject: unknown[]) => void;
    info: (module: string, ...messageOrObject: unknown[]) => void;
    warn: (module: string, ...messageOrObject: unknown[]) => void;
    error: (module: string, ...messageOrObject: unknown[]) => void;
};
export declare function noop(): void;
export declare function setMatrixConsoleLogging(enabled: boolean): void;
export declare class ConsoleLogger {
    private emit;
    trace(module: string, ...messageOrObject: unknown[]): void;
    debug(module: string, ...messageOrObject: unknown[]): void;
    info(module: string, ...messageOrObject: unknown[]): void;
    warn(module: string, ...messageOrObject: unknown[]): void;
    error(module: string, ...messageOrObject: unknown[]): void;
}
export declare const LogService: {
    setLogger(logger: Logger): void;
    trace(module: string, ...messageOrObject: unknown[]): void;
    debug(module: string, ...messageOrObject: unknown[]): void;
    info(module: string, ...messageOrObject: unknown[]): void;
    warn(module: string, ...messageOrObject: unknown[]): void;
    error(module: string, ...messageOrObject: unknown[]): void;
};
