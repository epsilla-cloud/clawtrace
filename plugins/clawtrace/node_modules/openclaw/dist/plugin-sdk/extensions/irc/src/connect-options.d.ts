import type { ResolvedIrcAccount } from "./accounts.js";
import type { IrcClientOptions } from "./client.js";
type IrcConnectOverrides = Omit<Partial<IrcClientOptions>, "host" | "port" | "tls" | "nick" | "username" | "realname" | "password" | "nickserv">;
export declare function buildIrcConnectOptions(account: ResolvedIrcAccount, overrides?: IrcConnectOverrides): IrcClientOptions;
export {};
