/**
 * This file is a secondary entrypoint for the js-sdk library, exposing utilities which might be useful for writing tests.
 *
 * In general, it should not be included in runtime applications.
 *
 * @packageDocumentation
 */
import { type IContent, type IUnsigned, MatrixEvent } from "./models/event.ts";
import { EventType } from "./@types/event.ts";
import { type DecryptionFailureCode } from "./crypto-api/index.ts";
import { type OidcClientConfig, type ValidatedAuthMetadata } from "./oidc/index.ts";
/**
 * Create a {@link MatrixEvent}.
 *
 * @param opts - Values for the event.
 */
export declare function mkMatrixEvent(opts: {
    /** Room ID of the event. */
    roomId: string;
    /** The sender of the event. */
    sender: string;
    /** The type of the event. */
    type: EventType | string;
    /** Optional `state_key` for the event. If unspecified, a non-state event is created. */
    stateKey?: string;
    /** Optional `origin_server_ts` for the event. If unspecified, the timestamp will be set to 0. */
    ts?: number;
    /** Optional `event_id` for the event. If provided will be used as event ID; else an ID is generated. */
    eventId?: string;
    /** Content of the event. */
    content: IContent;
    /** Optional `unsigned` data for the event. */
    unsigned?: IUnsigned;
}): MatrixEvent;
/**
 * Create a `MatrixEvent` representing a successfully-decrypted `m.room.encrypted` event.
 *
 * @param opts - Values for the event.
 */
export declare function mkEncryptedMatrixEvent(opts: {
    /** Room ID of the event. */
    roomId: string;
    /** The sender of the event. */
    sender: string;
    /** The type the event will have, once it has been decrypted. */
    plainType: EventType | string;
    /** The content the event will have, once it has been decrypted. */
    plainContent: IContent;
    /** Optional `event_id` for the event. If provided will be used as event ID; else an ID is generated. */
    eventId?: string;
}): Promise<MatrixEvent>;
/**
 * Create a `MatrixEvent` representing a `m.room.encrypted` event which could not be decrypted.
 *
 * @param opts - Values for the event.
 */
export declare function mkDecryptionFailureMatrixEvent(opts: {
    /** Room ID of the event. */
    roomId: string;
    /** The sender of the event. */
    sender: string;
    /** The reason code for the failure */
    code: DecryptionFailureCode;
    /** A textual reason for the failure */
    msg: string;
    /** Optional `event_id` for the event. If provided will be used as event ID; else an ID is generated. */
    eventId?: string;
}): Promise<MatrixEvent>;
/**
 * Given an event previously returned by {@link mkDecryptionFailureMatrixEvent}, simulate a successful re-decryption
 * attempt.
 *
 * @param mxEvent - The event that will be decrypted.
 * @param opts - New data for the successful decryption.
 */
export declare function decryptExistingEvent(mxEvent: MatrixEvent, opts: {
    /** The type the event will have, once it has been decrypted. */
    plainType: EventType | string;
    /** The content the event will have, once it has been decrypted. */
    plainContent: IContent;
}): Promise<void>;
/**
 * Makes a valid OidcClientConfig with minimum valid values
 * @param issuer used as the base for all other urls
 * @param additionalGrantTypes to add to the default grant types
 * @returns OidcClientConfig
 * @experimental
 */
export declare const makeDelegatedAuthConfig: (issuer?: string, additionalGrantTypes?: string[]) => OidcClientConfig;
/**
 * Useful for mocking <issuer>/.well-known/openid-configuration
 * @param issuer used as the base for all other urls
 * @param additionalGrantTypes to add to the default grant types
 * @returns ValidatedAuthMetadata
 * @experimental
 */
export declare const mockOpenIdConfiguration: (issuer?: string, additionalGrantTypes?: string[]) => ValidatedAuthMetadata;
//# sourceMappingURL=testing.d.ts.map