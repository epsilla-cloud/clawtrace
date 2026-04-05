import { type MatrixClient } from "./client.ts";
import { type IEvent, MatrixEvent } from "./models/event.ts";
export type EventMapper = (obj: Partial<IEvent>) => MatrixEvent;
export interface MapperOpts {
    preventReEmit?: boolean;
    decrypt?: boolean;
}
export declare function eventMapperFor(client: MatrixClient, options: MapperOpts): EventMapper;
//# sourceMappingURL=event-mapper.d.ts.map