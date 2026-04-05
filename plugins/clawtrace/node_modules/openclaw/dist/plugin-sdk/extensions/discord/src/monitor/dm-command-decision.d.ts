import { upsertChannelPairingRequest } from "openclaw/plugin-sdk/conversation-runtime";
import type { DiscordDmCommandAccess } from "./dm-command-auth.js";
export declare function handleDiscordDmCommandDecision(params: {
    dmAccess: DiscordDmCommandAccess;
    accountId: string;
    sender: {
        id: string;
        tag?: string;
        name?: string;
    };
    onPairingCreated: (code: string) => Promise<void>;
    onUnauthorized: () => Promise<void>;
    upsertPairingRequest?: typeof upsertChannelPairingRequest;
}): Promise<boolean>;
