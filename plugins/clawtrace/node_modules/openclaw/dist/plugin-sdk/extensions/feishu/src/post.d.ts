type PostParseResult = {
    textContent: string;
    imageKeys: string[];
    mediaKeys: Array<{
        fileKey: string;
        fileName?: string;
    }>;
    mentionedOpenIds: string[];
};
export declare function parsePostContent(content: string): PostParseResult;
export {};
