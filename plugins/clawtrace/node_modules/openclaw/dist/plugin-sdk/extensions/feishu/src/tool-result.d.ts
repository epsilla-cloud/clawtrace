export declare function jsonToolResult(data: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
    details: unknown;
};
export declare function unknownToolActionResult(action: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
    details: unknown;
};
export declare function toolExecutionErrorResult(error: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
    details: unknown;
};
