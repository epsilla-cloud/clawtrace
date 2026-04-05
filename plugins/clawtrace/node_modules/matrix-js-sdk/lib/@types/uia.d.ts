import { type AuthDict } from "../interactive-auth.ts";
/**
 * Helper type to represent HTTP request body for a UIA enabled endpoint
 */
export type UIARequest<T> = T & {
    auth?: AuthDict;
};
//# sourceMappingURL=uia.d.ts.map