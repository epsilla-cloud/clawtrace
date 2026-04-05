import { Container, Text } from "@mariozechner/pi-tui";
import { Type } from "@sinclair/typebox";
import { constants } from "fs";
import { access as fsAccess, readFile as fsReadFile, writeFile as fsWriteFile } from "fs/promises";
import { renderDiff } from "../../modes/interactive/components/diff.js";
import { applyEditsToNormalizedContent, computeEditsDiff, detectLineEnding, generateDiffString, normalizeToLF, restoreLineEndings, stripBom, } from "./edit-diff.js";
import { withFileMutationQueue } from "./file-mutation-queue.js";
import { resolveToCwd } from "./path-utils.js";
import { invalidArgText, shortenPath, str } from "./render-utils.js";
import { wrapToolDefinition } from "./tool-definition-wrapper.js";
const replaceEditSchema = Type.Object({
    oldText: Type.String({
        description: "Exact text for one targeted replacement. It must be unique in the original file and must not overlap with any other edits[].oldText in the same call.",
    }),
    newText: Type.String({ description: "Replacement text for this targeted edit." }),
}, { additionalProperties: false });
const editSchema = Type.Object({
    path: Type.String({ description: "Path to the file to edit (relative or absolute)" }),
    oldText: Type.Optional(Type.String({
        description: "Exact text to replace for one contiguous change. Include only enough surrounding context to make the match unique. Do not use this to cover multiple distant changes in one large block.",
    })),
    newText: Type.Optional(Type.String({
        description: "Replacement text for oldText in single-replacement mode.",
    })),
    edits: Type.Optional(Type.Array(replaceEditSchema, {
        description: "Use this when changing multiple separate, disjoint regions in the same file. Each edit is matched against the original file, not incrementally. Do not include overlapping or nested edits. If two changes touch the same block or nearby lines, merge them into one edit instead.",
    })),
}, { additionalProperties: false });
const defaultEditOperations = {
    readFile: (path) => fsReadFile(path),
    writeFile: (path, content) => fsWriteFile(path, content, "utf-8"),
    access: (path) => fsAccess(path, constants.R_OK | constants.W_OK),
};
function getMultiReplaceModeInput(input) {
    if (input.edits === undefined)
        return null;
    if (input.oldText !== undefined || input.newText !== undefined) {
        throw new Error("Edit tool input is invalid. Use either edits or single replacement mode, not both.");
    }
    if (input.edits.length === 0) {
        throw new Error("Edit tool input is invalid. edits must contain at least one replacement.");
    }
    return { path: input.path, edits: input.edits };
}
function getReplaceModeInput(input) {
    const { oldText, newText } = input;
    if (oldText === undefined && newText === undefined)
        return null;
    if (input.edits !== undefined) {
        throw new Error("Edit tool input is invalid. Use either single replacement mode or edits mode, not both.");
    }
    if (oldText === undefined || newText === undefined) {
        throw new Error("Edit tool input is invalid. Single replacement mode requires both oldText and newText.");
    }
    return { path: input.path, oldText, newText };
}
function normalizeEditInput(input) {
    const multiReplaceModeInput = getMultiReplaceModeInput(input);
    if (multiReplaceModeInput) {
        return { path: multiReplaceModeInput.path, edits: multiReplaceModeInput.edits, mode: "multi" };
    }
    const replaceModeInput = getReplaceModeInput(input);
    if (replaceModeInput) {
        return {
            path: replaceModeInput.path,
            edits: [{ oldText: replaceModeInput.oldText, newText: replaceModeInput.newText }],
            mode: "single",
        };
    }
    throw new Error("Edit tool input is invalid. Provide either oldText and newText, or edits.");
}
function getRenderablePreviewInput(args) {
    if (!args || typeof args.path !== "string") {
        return null;
    }
    if (args.oldText === undefined &&
        args.newText === undefined &&
        Array.isArray(args.edits) &&
        args.edits.length > 0 &&
        args.edits.every((edit) => typeof edit?.oldText === "string" && typeof edit?.newText === "string")) {
        return { path: args.path, edits: args.edits };
    }
    if (typeof args.oldText === "string" && typeof args.newText === "string" && args.edits === undefined) {
        return { path: args.path, edits: [{ oldText: args.oldText, newText: args.newText }] };
    }
    return null;
}
function formatEditCall(args, state, theme) {
    const invalidArg = invalidArgText(theme);
    const rawPath = str(args?.file_path ?? args?.path);
    const path = rawPath !== null ? shortenPath(rawPath) : null;
    const pathDisplay = path === null ? invalidArg : path ? theme.fg("accent", path) : theme.fg("toolOutput", "...");
    let text = `${theme.fg("toolTitle", theme.bold("edit"))} ${pathDisplay}`;
    if (state.preview) {
        if ("error" in state.preview) {
            text += `\n\n${theme.fg("error", state.preview.error)}`;
        }
        else if (state.preview.diff) {
            text += `\n\n${renderDiff(state.preview.diff, { filePath: rawPath ?? undefined })}`;
        }
    }
    return text;
}
function formatEditResult(args, state, result, theme, isError) {
    const rawPath = str(args?.file_path ?? args?.path);
    if (isError) {
        const errorText = result.content
            .filter((c) => c.type === "text")
            .map((c) => c.text || "")
            .join("\n");
        let previewError;
        if (state.preview && "error" in state.preview) {
            previewError = state.preview.error;
        }
        if (!errorText || errorText === previewError) {
            return undefined;
        }
        return `\n${theme.fg("error", errorText)}`;
    }
    const previewDiff = state.preview && !("error" in state.preview) ? state.preview.diff : undefined;
    const resultDiff = result.details?.diff;
    if (!resultDiff || resultDiff === previewDiff) {
        return undefined;
    }
    return `\n${renderDiff(resultDiff, { filePath: rawPath ?? undefined })}`;
}
export function createEditToolDefinition(cwd, options) {
    const ops = options?.operations ?? defaultEditOperations;
    return {
        name: "edit",
        label: "edit",
        description: "Edit a single file using exact text replacement. Use oldText/newText only for one contiguous replacement. Use edits when changing multiple separate, disjoint regions in the same file. In edits mode, every edits[].oldText must match a unique, non-overlapping region of the original file. If two changes affect the same block or nearby lines, merge them into one edit instead of emitting overlapping edits. Do not include large unchanged regions just to connect distant changes. Do not provide both modes at once.",
        promptSnippet: "Make precise file edits with exact text replacement, including multiple disjoint edits in one call",
        promptGuidelines: [
            "Use edit for precise changes (old text must match exactly)",
            "When changing multiple separate locations in one file, use one edit call with edits[] instead of multiple edit calls",
            "Each edits[].oldText is matched against the original file, not after earlier edits are applied. Do not emit overlapping or nested edits. Merge nearby changes into one edit.",
            "Keep oldText as small as possible while still being unique in the file. Do not pad with large unchanged regions.",
        ],
        parameters: editSchema,
        async execute(_toolCallId, input, signal, _onUpdate, _ctx) {
            const { path, edits, mode } = normalizeEditInput(input);
            const absolutePath = resolveToCwd(path, cwd);
            return withFileMutationQueue(absolutePath, () => new Promise((resolve, reject) => {
                // Check if already aborted.
                if (signal?.aborted) {
                    reject(new Error("Operation aborted"));
                    return;
                }
                let aborted = false;
                // Set up abort handler.
                const onAbort = () => {
                    aborted = true;
                    reject(new Error("Operation aborted"));
                };
                if (signal) {
                    signal.addEventListener("abort", onAbort, { once: true });
                }
                // Perform the edit operation.
                void (async () => {
                    try {
                        // Check if file exists.
                        try {
                            await ops.access(absolutePath);
                        }
                        catch {
                            if (signal) {
                                signal.removeEventListener("abort", onAbort);
                            }
                            reject(new Error(`File not found: ${path}`));
                            return;
                        }
                        // Check if aborted before reading.
                        if (aborted) {
                            return;
                        }
                        // Read the file.
                        const buffer = await ops.readFile(absolutePath);
                        const rawContent = buffer.toString("utf-8");
                        // Check if aborted after reading.
                        if (aborted) {
                            return;
                        }
                        // Strip BOM before matching. The model will not include an invisible BOM in oldText.
                        const { bom, text: content } = stripBom(rawContent);
                        const originalEnding = detectLineEnding(content);
                        const normalizedContent = normalizeToLF(content);
                        const { baseContent, newContent } = applyEditsToNormalizedContent(normalizedContent, edits, path);
                        // Check if aborted before writing.
                        if (aborted) {
                            return;
                        }
                        const finalContent = bom + restoreLineEndings(newContent, originalEnding);
                        await ops.writeFile(absolutePath, finalContent);
                        // Check if aborted after writing.
                        if (aborted) {
                            return;
                        }
                        // Clean up abort handler.
                        if (signal) {
                            signal.removeEventListener("abort", onAbort);
                        }
                        const diffResult = generateDiffString(baseContent, newContent);
                        resolve({
                            content: [
                                {
                                    type: "text",
                                    text: mode === "single"
                                        ? `Successfully replaced text in ${path}.`
                                        : `Successfully replaced ${edits.length} block(s) in ${path}.`,
                                },
                            ],
                            details: { diff: diffResult.diff, firstChangedLine: diffResult.firstChangedLine },
                        });
                    }
                    catch (error) {
                        // Clean up abort handler.
                        if (signal) {
                            signal.removeEventListener("abort", onAbort);
                        }
                        if (!aborted) {
                            reject(error instanceof Error ? error : new Error(String(error)));
                        }
                    }
                })();
            }));
        },
        renderCall(args, theme, context) {
            if (context.argsComplete) {
                const previewInput = getRenderablePreviewInput(args);
                if (previewInput) {
                    const argsKey = JSON.stringify({ path: previewInput.path, edits: previewInput.edits });
                    if (context.state.argsKey !== argsKey) {
                        context.state.argsKey = argsKey;
                        computeEditsDiff(previewInput.path, previewInput.edits, context.cwd).then((preview) => {
                            if (context.state.argsKey === argsKey) {
                                context.state.preview = preview;
                                context.invalidate();
                            }
                        });
                    }
                }
            }
            const text = context.lastComponent ?? new Text("", 0, 0);
            text.setText(formatEditCall(args, context.state, theme));
            return text;
        },
        renderResult(result, _options, theme, context) {
            const output = formatEditResult(context.args, context.state, result, theme, context.isError);
            if (!output) {
                const component = context.lastComponent ?? new Container();
                component.clear();
                return component;
            }
            const text = context.lastComponent ?? new Text("", 0, 0);
            text.setText(output);
            return text;
        },
    };
}
export function createEditTool(cwd, options) {
    return wrapToolDefinition(createEditToolDefinition(cwd, options));
}
/** Default edit tool using process.cwd() for backwards compatibility. */
export const editToolDefinition = createEditToolDefinition(process.cwd());
export const editTool = createEditTool(process.cwd());
//# sourceMappingURL=edit.js.map