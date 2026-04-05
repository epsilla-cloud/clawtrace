import { type DirectoryConfigParams } from "openclaw/plugin-sdk/directory-runtime";
export declare const listSlackDirectoryPeersFromConfig: (configParams: DirectoryConfigParams) => Promise<import("openclaw/plugin-sdk/directory-runtime").ChannelDirectoryEntry[]>;
export declare const listSlackDirectoryGroupsFromConfig: (configParams: DirectoryConfigParams) => Promise<import("openclaw/plugin-sdk/directory-runtime").ChannelDirectoryEntry[]>;
