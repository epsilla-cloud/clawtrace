import { type Relations, type RelationsEvent, type EventHandlerMap } from "./relations.ts";
import { type MatrixEvent } from "./event.ts";
import { type Listener } from "./typed-event-emitter.ts";
export declare class RelatedRelations {
    private relations;
    constructor(relations: Relations[]);
    getRelations(): MatrixEvent[];
    on<T extends RelationsEvent>(ev: T, fn: Listener<RelationsEvent, EventHandlerMap, T>): void;
    off<T extends RelationsEvent>(ev: T, fn: Listener<RelationsEvent, EventHandlerMap, T>): void;
}
//# sourceMappingURL=related-relations.d.ts.map