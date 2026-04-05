/**
 * reimplementation of window.setTimeout, which will call the callback if
 * the wallclock time goes past the deadline.
 *
 * @param func -   callback to be called after a delay
 * @param delayMs -  number of milliseconds to delay by
 *
 * @returns an identifier for this callback, which may be passed into
 *                   clearTimeout later.
 */
export declare function setTimeout(func: (...params: any[]) => void, delayMs: number, ...params: any[]): number;
/**
 * reimplementation of window.clearTimeout, which mirrors setTimeout
 *
 * @param key -   result from an earlier setTimeout call
 */
export declare function clearTimeout(key: number): void;
//# sourceMappingURL=realtime-callbacks.d.ts.map