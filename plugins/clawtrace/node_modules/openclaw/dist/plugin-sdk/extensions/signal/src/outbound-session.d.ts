import { type RoutePeer } from "openclaw/plugin-sdk/routing";
export type ResolvedSignalOutboundTarget = {
    peer: RoutePeer;
    chatType: "direct" | "group";
    from: string;
    to: string;
};
export declare function resolveSignalOutboundTarget(target: string): ResolvedSignalOutboundTarget | null;
