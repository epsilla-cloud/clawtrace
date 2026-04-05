import type { TelegramTransport } from "./fetch.js";
type TelegramPollingTransportStateOpts = {
    log: (line: string) => void;
    initialTransport?: TelegramTransport;
    createTelegramTransport?: () => TelegramTransport;
};
export declare class TelegramPollingTransportState {
    #private;
    private readonly opts;
    constructor(opts: TelegramPollingTransportStateOpts);
    markDirty(): void;
    acquireForNextCycle(): TelegramTransport | undefined;
}
export {};
