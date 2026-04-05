import { type MatrixEvent } from "../models/event.ts";
import { type MatrixCall } from "./call.ts";
import { type MatrixClient } from "../client.ts";
export declare enum CallEventHandlerEvent {
    Incoming = "Call.incoming"
}
export type CallEventHandlerEventHandlerMap = {
    /**
     * Fires whenever an incoming call arrives.
     * @param call - The incoming call.
     * @example
     * ```
     * matrixClient.on("Call.incoming", function(call){
     *   call.answer(); // auto-answer
     * });
     * ```
     */
    [CallEventHandlerEvent.Incoming]: (call: MatrixCall) => void;
};
export declare class CallEventHandler {
    calls: Map<string, MatrixCall>;
    callEventBuffer: MatrixEvent[];
    nextSeqByCall: Map<string, number>;
    toDeviceEventBuffers: Map<string, Array<MatrixEvent>>;
    private client;
    private candidateEventsByCall;
    private eventBufferPromiseChain?;
    constructor(client: MatrixClient);
    start(): void;
    stop(): void;
    private onSync;
    private evaluateEventBuffer;
    private onRoomTimeline;
    private onToDeviceEvent;
    private handleCallEvent;
}
//# sourceMappingURL=callEventHandler.d.ts.map