export type MatrixResolvedStringField = "homeserver" | "userId" | "accessToken" | "password" | "deviceId" | "deviceName";
export type MatrixResolvedStringValues = Record<MatrixResolvedStringField, string>;
type MatrixStringSourceMap = Partial<Record<MatrixResolvedStringField, string>>;
export declare function resolveMatrixAccountStringValues(params: {
    accountId: string;
    account?: MatrixStringSourceMap;
    scopedEnv?: MatrixStringSourceMap;
    channel?: MatrixStringSourceMap;
    globalEnv?: MatrixStringSourceMap;
}): MatrixResolvedStringValues;
export {};
