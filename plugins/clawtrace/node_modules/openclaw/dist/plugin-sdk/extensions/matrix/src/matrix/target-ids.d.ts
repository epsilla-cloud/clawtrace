type MatrixTarget = {
    kind: "room";
    id: string;
} | {
    kind: "user";
    id: string;
};
export declare function resolveMatrixTargetIdentity(raw: string): MatrixTarget | null;
export declare function isMatrixQualifiedUserId(raw: string): boolean;
export declare function normalizeMatrixResolvableTarget(raw: string): string;
export declare function normalizeMatrixMessagingTarget(raw: string): string | undefined;
export declare function normalizeMatrixDirectoryUserId(raw: string): string | undefined;
export declare function normalizeMatrixDirectoryGroupId(raw: string): string | undefined;
export declare function resolveMatrixDirectUserId(params: {
    from?: string;
    to?: string;
    chatType?: string;
}): string | undefined;
export {};
