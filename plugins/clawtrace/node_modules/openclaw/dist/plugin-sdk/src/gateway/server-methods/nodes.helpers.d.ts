import type { ErrorObject } from "ajv";
import type { RespondFn } from "./types.js";
type ValidatorFn = ((value: unknown) => boolean) & {
    errors?: ErrorObject[] | null;
};
export declare function respondInvalidParams(params: {
    respond: RespondFn;
    method: string;
    validator: ValidatorFn;
}): void;
export declare function respondUnavailableOnThrow(respond: RespondFn, fn: () => Promise<void>): Promise<void>;
export declare function uniqueSortedStrings(values: unknown[]): string[];
export declare function safeParseJson(value: string | null | undefined): unknown;
export declare function respondUnavailableOnNodeInvokeError<T extends {
    ok: boolean;
    error?: unknown;
}>(respond: RespondFn, res: T): res is T & {
    ok: true;
};
export {};
