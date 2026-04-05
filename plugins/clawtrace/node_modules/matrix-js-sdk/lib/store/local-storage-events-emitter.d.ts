import { TypedEventEmitter } from "../models/typed-event-emitter.ts";
export declare enum LocalStorageErrors {
    Global = "Global",
    SetItemError = "setItem",
    GetItemError = "getItem",
    RemoveItemError = "removeItem",
    ClearError = "clear",
    QuotaExceededError = "QuotaExceededError"
}
type EventHandlerMap = {
    [LocalStorageErrors.Global]: (error: Error) => void;
    [LocalStorageErrors.SetItemError]: (error: Error) => void;
    [LocalStorageErrors.GetItemError]: (error: Error) => void;
    [LocalStorageErrors.RemoveItemError]: (error: Error) => void;
    [LocalStorageErrors.ClearError]: (error: Error) => void;
    [LocalStorageErrors.QuotaExceededError]: (error: Error) => void;
};
/**
 * Used in element-web as a temporary hack to handle all the localStorage errors on the highest level possible
 * As of 15.11.2021 (DD/MM/YYYY) we're not properly handling local storage exceptions anywhere.
 * This store, as an event emitter, is used to re-emit local storage exceptions so that we can handle them
 * and show some kind of a "It's dead Jim" modal to the users, telling them that hey,
 * maybe you should check out your disk, as it's probably dying and your session may die with it.
 * See: https://github.com/vector-im/element-web/issues/18423
 */
declare class LocalStorageErrorsEventsEmitter extends TypedEventEmitter<LocalStorageErrors, EventHandlerMap> {
}
export declare const localStorageErrorsEventsEmitter: LocalStorageErrorsEventsEmitter;
export {};
//# sourceMappingURL=local-storage-events-emitter.d.ts.map