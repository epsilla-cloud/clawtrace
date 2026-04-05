//#region src/context-engine/delegate.ts
/**
* Delegate a context-engine compaction request to OpenClaw's built-in runtime compaction path.
*
* This is the same bridge used by the legacy context engine. Third-party
* engines can call it from their own `compact()` implementations when they do
* not own the compaction algorithm but still need `/compact` and overflow
* recovery to use the stock runtime behavior.
*
* Note: `compactionTarget` is part of the public `compact()` contract, but the
* built-in runtime compaction path does not expose that knob. This helper
* ignores it to preserve legacy behavior; engines that need target-specific
* compaction should implement their own `compact()` algorithm.
*/
async function delegateCompactionToRuntime(params) {
	const { compactEmbeddedPiSessionDirect } = await import("./compact.runtime-BXK9R-Bh.js");
	const runtimeContext = params.runtimeContext ?? {};
	const currentTokenCount = params.currentTokenCount ?? (typeof runtimeContext.currentTokenCount === "number" && Number.isFinite(runtimeContext.currentTokenCount) && runtimeContext.currentTokenCount > 0 ? Math.floor(runtimeContext.currentTokenCount) : void 0);
	const result = await compactEmbeddedPiSessionDirect({
		...runtimeContext,
		sessionId: params.sessionId,
		sessionFile: params.sessionFile,
		tokenBudget: params.tokenBudget,
		...currentTokenCount !== void 0 ? { currentTokenCount } : {},
		force: params.force,
		customInstructions: params.customInstructions,
		workspaceDir: typeof runtimeContext.workspaceDir === "string" ? runtimeContext.workspaceDir : process.cwd()
	});
	return {
		ok: result.ok,
		compacted: result.compacted,
		reason: result.reason,
		result: result.result ? {
			summary: result.result.summary,
			firstKeptEntryId: result.result.firstKeptEntryId,
			tokensBefore: result.result.tokensBefore,
			tokensAfter: result.result.tokensAfter,
			details: result.result.details
		} : void 0
	};
}
//#endregion
export { delegateCompactionToRuntime as t };
