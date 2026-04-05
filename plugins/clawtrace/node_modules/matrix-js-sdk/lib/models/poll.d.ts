import { type MatrixClient } from "../client.ts";
import { type PollStartEvent } from "../extensible_events_v1/PollStartEvent.ts";
import { type MatrixEvent } from "./event.ts";
import { Relations } from "./relations.ts";
import { type Room } from "./room.ts";
import { TypedEventEmitter } from "./typed-event-emitter.ts";
export declare enum PollEvent {
    New = "Poll.new",
    End = "Poll.end",
    Update = "Poll.update",
    Responses = "Poll.Responses",
    Destroy = "Poll.Destroy",
    UndecryptableRelations = "Poll.UndecryptableRelations"
}
export type PollEventHandlerMap = {
    [PollEvent.Update]: (event: MatrixEvent, poll: Poll) => void;
    [PollEvent.Destroy]: (pollIdentifier: string) => void;
    [PollEvent.End]: () => void;
    [PollEvent.Responses]: (responses: Relations) => void;
    [PollEvent.UndecryptableRelations]: (count: number) => void;
};
export declare class Poll extends TypedEventEmitter<Exclude<PollEvent, PollEvent.New>, PollEventHandlerMap> {
    readonly rootEvent: MatrixEvent;
    private matrixClient;
    private room;
    readonly roomId: string;
    readonly pollEvent: PollStartEvent;
    private _isFetchingResponses;
    private relationsNextBatch;
    private responses;
    private endEvent;
    /**
     * Keep track of undecryptable relations
     * As incomplete result sets affect poll results
     */
    private undecryptableRelationEventIds;
    constructor(rootEvent: MatrixEvent, matrixClient: MatrixClient, room: Room);
    get pollId(): string;
    get endEventId(): string | undefined;
    get isEnded(): boolean;
    get isFetchingResponses(): boolean;
    get undecryptableRelationsCount(): number;
    getResponses(): Promise<Relations>;
    /**
     *
     * @param event - event with a relation to the rootEvent
     * @returns void
     */
    onNewRelation(event: MatrixEvent): void;
    private fetchResponses;
    /**
     * Only responses made before the poll ended are valid
     * Refilter after an end event is recieved
     * To ensure responses are valid
     */
    private refilterResponsesOnEnd;
    private countUndecryptableEvents;
    private validateEndEvent;
}
/**
 * Tests whether the event is a start, response or end poll event.
 *
 * @param event - Event to test
 * @returns true if the event is a poll event, else false
 */
export declare const isPollEvent: (event: MatrixEvent) => boolean;
//# sourceMappingURL=poll.d.ts.map