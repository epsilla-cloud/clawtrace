import type { ChannelDirectoryEntry, DirectoryConfigParams } from "openclaw/plugin-sdk/directory-runtime";
export declare function listSlackDirectoryPeersLive(params: DirectoryConfigParams): Promise<ChannelDirectoryEntry[]>;
export declare function listSlackDirectoryGroupsLive(params: DirectoryConfigParams): Promise<ChannelDirectoryEntry[]>;
