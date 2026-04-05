export interface IRoomEvent {
    type: string;
    sender: string;
    event_id: string;
    room_id: string;
    state_key?: string;
    origin_server_ts: number;
    content: Record<string, unknown>;
    unsigned: Record<string, unknown>;
    sticky?: {
        duration_ms: number;
    };
    msc4354_sticky?: {
        duration_ms: number;
    };
}
