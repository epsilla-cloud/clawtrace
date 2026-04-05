import type { proto } from "@whiskeysockets/baileys";
import { type NormalizedLocation } from "openclaw/plugin-sdk/channel-inbound";
import { type WhatsAppReplyContext } from "../identity.js";
export declare function extractMentionedJids(rawMessage: proto.IMessage | undefined): string[] | undefined;
export declare function extractText(rawMessage: proto.IMessage | undefined): string | undefined;
export declare function extractMediaPlaceholder(rawMessage: proto.IMessage | undefined): string | undefined;
export declare function extractLocationData(rawMessage: proto.IMessage | undefined): NormalizedLocation | null;
export declare function describeReplyContext(rawMessage: proto.IMessage | undefined): WhatsAppReplyContext | null;
