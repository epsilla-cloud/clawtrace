import { type RendezvousTransportDetails, type RendezvousIntent } from "./index.ts";
export interface RendezvousCode {
    intent: RendezvousIntent;
    rendezvous?: {
        transport: RendezvousTransportDetails;
        algorithm: string;
    };
}
//# sourceMappingURL=RendezvousCode.d.ts.map