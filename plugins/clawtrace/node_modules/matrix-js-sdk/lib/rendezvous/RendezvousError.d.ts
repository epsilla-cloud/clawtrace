import { type RendezvousFailureReason } from "./index.ts";
export declare class RendezvousError extends Error {
    readonly code: RendezvousFailureReason;
    constructor(message: string, code: RendezvousFailureReason);
}
//# sourceMappingURL=RendezvousError.d.ts.map