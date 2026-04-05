import { type ExecFileOptionsWithStringEncoding } from "node:child_process";
import type { BlueBubblesParticipant } from "./monitor-normalize.js";
type ResolvePhoneNamesFn = (phoneKeys: string[]) => Promise<Map<string, string>>;
type ExecFileRunner = (file: string, args: string[], options: ExecFileOptionsWithStringEncoding) => Promise<{
    stdout: string;
    stderr: string;
}>;
type ReadDirRunner = (path: string) => Promise<string[]>;
type AccessRunner = (path: string) => Promise<unknown>;
type ParticipantContactNameDeps = {
    platform?: NodeJS.Platform;
    now?: () => number;
    resolvePhoneNames?: ResolvePhoneNamesFn;
    homeDir?: string;
    readdir?: ReadDirRunner;
    access?: AccessRunner;
    execFileAsync?: ExecFileRunner;
};
export declare function enrichBlueBubblesParticipantsWithContactNames(participants: BlueBubblesParticipant[] | undefined, deps?: ParticipantContactNameDeps): Promise<BlueBubblesParticipant[]>;
export declare function listBlueBubblesContactsDatabasesForTest(deps?: ParticipantContactNameDeps): Promise<string[]>;
export declare function queryBlueBubblesContactsDatabaseForTest(dbPath: string, phoneKeys: string[], deps?: ParticipantContactNameDeps): Promise<Array<{
    phoneKey: string;
    name: string;
}>>;
export declare function resolveBlueBubblesParticipantContactNamesFromMacOsContactsForTest(phoneKeys: string[], deps?: ParticipantContactNameDeps): Promise<Map<string, string>>;
export declare function resetBlueBubblesParticipantContactNameCacheForTest(): void;
export declare function setBlueBubblesParticipantContactDepsForTest(deps?: ParticipantContactNameDeps): void;
export {};
