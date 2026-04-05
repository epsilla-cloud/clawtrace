/**
 * Acquires a reference to the shared AudioContext.
 * It's highly recommended to reuse this AudioContext rather than creating your
 * own, because multiple AudioContexts can be problematic in some browsers.
 * Make sure to call releaseContext when you're done using it.
 * @returns The shared AudioContext
 */
export declare const acquireContext: () => AudioContext;
/**
 * Signals that one of the references to the shared AudioContext has been
 * released, allowing the context and associated hardware resources to be
 * cleaned up if nothing else is using it.
 */
export declare const releaseContext: () => void;
//# sourceMappingURL=audioContext.d.ts.map