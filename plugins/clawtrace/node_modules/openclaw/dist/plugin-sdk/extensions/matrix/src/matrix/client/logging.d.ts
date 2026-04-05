type MatrixJsSdkLogger = {
    trace: (...messageOrObject: unknown[]) => void;
    debug: (...messageOrObject: unknown[]) => void;
    info: (...messageOrObject: unknown[]) => void;
    warn: (...messageOrObject: unknown[]) => void;
    error: (...messageOrObject: unknown[]) => void;
    getChild: (namespace: string) => MatrixJsSdkLogger;
};
export declare function ensureMatrixSdkLoggingConfigured(): void;
export declare function setMatrixSdkLogMode(mode: "default" | "quiet"): void;
export declare function setMatrixSdkConsoleLogging(enabled: boolean): void;
export declare function createMatrixJsSdkClientLogger(prefix?: string): MatrixJsSdkLogger;
export {};
