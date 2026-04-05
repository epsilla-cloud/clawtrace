import type { NextcloudTalkWebhookHeaders } from "./types.js";
/**
 * Verify the HMAC-SHA256 signature of an incoming webhook request.
 * Signature is calculated as: HMAC-SHA256(random + body, secret)
 */
export declare function verifyNextcloudTalkSignature(params: {
    signature: string;
    random: string;
    body: string;
    secret: string;
}): boolean;
/**
 * Extract webhook headers from an incoming request.
 */
export declare function extractNextcloudTalkHeaders(headers: Record<string, string | string[] | undefined>): NextcloudTalkWebhookHeaders | null;
/**
 * Generate signature headers for an outbound request to Nextcloud Talk.
 */
export declare function generateNextcloudTalkSignature(params: {
    body: string;
    secret: string;
}): {
    random: string;
    signature: string;
};
