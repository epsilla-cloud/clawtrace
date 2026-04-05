/**
 * Matrix Poll Types (MSC3381)
 *
 * Defines types for Matrix poll events:
 * - m.poll.start - Creates a new poll
 * - m.poll.response - Records a vote
 * - m.poll.end - Closes a poll
 */
import { type PollInput } from "../runtime-api.js";
export declare const M_POLL_START: "m.poll.start";
export declare const M_POLL_RESPONSE: "m.poll.response";
export declare const M_POLL_END: "m.poll.end";
export declare const ORG_POLL_START: "org.matrix.msc3381.poll.start";
export declare const ORG_POLL_RESPONSE: "org.matrix.msc3381.poll.response";
export declare const ORG_POLL_END: "org.matrix.msc3381.poll.end";
export declare const POLL_EVENT_TYPES: ("m.poll.start" | "org.matrix.msc3381.poll.start" | "m.poll.end" | "org.matrix.msc3381.poll.end" | "m.poll.response" | "org.matrix.msc3381.poll.response")[];
export declare const POLL_START_TYPES: ("m.poll.start" | "org.matrix.msc3381.poll.start")[];
export declare const POLL_RESPONSE_TYPES: ("m.poll.response" | "org.matrix.msc3381.poll.response")[];
export declare const POLL_END_TYPES: ("m.poll.end" | "org.matrix.msc3381.poll.end")[];
export type PollKind = "m.poll.disclosed" | "m.poll.undisclosed";
export type TextContent = {
    "m.text"?: string;
    "org.matrix.msc1767.text"?: string;
    body?: string;
};
export type PollAnswer = {
    id: string;
} & TextContent;
export type PollParsedAnswer = {
    id: string;
    text: string;
};
export type PollStartSubtype = {
    question: TextContent;
    kind?: PollKind;
    max_selections?: number;
    answers: PollAnswer[];
};
export type LegacyPollStartContent = {
    "m.poll"?: PollStartSubtype;
};
export type PollStartContent = {
    [M_POLL_START]?: PollStartSubtype;
    [ORG_POLL_START]?: PollStartSubtype;
    "m.poll"?: PollStartSubtype;
    "m.text"?: string;
    "org.matrix.msc1767.text"?: string;
};
export type PollSummary = {
    eventId: string;
    roomId: string;
    sender: string;
    senderName: string;
    question: string;
    answers: string[];
    kind: PollKind;
    maxSelections: number;
};
export type PollResultsSummary = PollSummary & {
    entries: Array<{
        id: string;
        text: string;
        votes: number;
    }>;
    totalVotes: number;
    closed: boolean;
};
export type ParsedPollStart = {
    question: string;
    answers: PollParsedAnswer[];
    kind: PollKind;
    maxSelections: number;
};
export type PollResponseSubtype = {
    answers: string[];
};
export type PollResponseContent = {
    [M_POLL_RESPONSE]?: PollResponseSubtype;
    [ORG_POLL_RESPONSE]?: PollResponseSubtype;
    "m.relates_to": {
        rel_type: "m.reference";
        event_id: string;
    };
};
export declare function isPollStartType(eventType: string): boolean;
export declare function isPollResponseType(eventType: string): boolean;
export declare function isPollEndType(eventType: string): boolean;
export declare function isPollEventType(eventType: string): boolean;
export declare function getTextContent(text?: TextContent): string;
export declare function parsePollStart(content: PollStartContent): ParsedPollStart | null;
export declare function parsePollStartContent(content: PollStartContent): PollSummary | null;
export declare function formatPollAsText(summary: PollSummary): string;
export declare function resolvePollReferenceEventId(content: unknown): string | null;
export declare function parsePollResponseAnswerIds(content: unknown): string[] | null;
export declare function buildPollResultsSummary(params: {
    pollEventId: string;
    roomId: string;
    sender: string;
    senderName: string;
    content: PollStartContent;
    relationEvents: Array<{
        event_id?: string;
        sender?: string;
        type?: string;
        origin_server_ts?: number;
        content?: Record<string, unknown>;
        unsigned?: {
            redacted_because?: unknown;
        };
    }>;
}): PollResultsSummary | null;
export declare function formatPollResultsAsText(summary: PollResultsSummary): string;
export declare function buildPollStartContent(poll: PollInput): PollStartContent;
export declare function buildPollResponseContent(pollEventId: string, answerIds: string[]): PollResponseContent;
