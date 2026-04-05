export type IrcPrivmsgEvent = {
    senderNick: string;
    senderUser?: string;
    senderHost?: string;
    target: string;
    text: string;
    rawLine: string;
};
export type IrcClientOptions = {
    host: string;
    port: number;
    tls: boolean;
    nick: string;
    username: string;
    realname: string;
    password?: string;
    nickserv?: IrcNickServOptions;
    channels?: string[];
    connectTimeoutMs?: number;
    messageChunkMaxChars?: number;
    abortSignal?: AbortSignal;
    onPrivmsg?: (event: IrcPrivmsgEvent) => void | Promise<void>;
    onNotice?: (text: string, target?: string) => void;
    onError?: (error: Error) => void;
    onLine?: (line: string) => void;
};
export type IrcNickServOptions = {
    enabled?: boolean;
    service?: string;
    password?: string;
    register?: boolean;
    registerEmail?: string;
};
export type IrcClient = {
    nick: string;
    isReady: () => boolean;
    sendRaw: (line: string) => void;
    join: (channel: string) => void;
    sendPrivmsg: (target: string, text: string) => void;
    quit: (reason?: string) => void;
    close: () => void;
};
export declare function buildIrcNickServCommands(options?: IrcNickServOptions): string[];
export declare function connectIrcClient(options: IrcClientOptions): Promise<IrcClient>;
