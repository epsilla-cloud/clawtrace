import { z } from "zod/v4";
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Authentication capabilities supported by the client.
 *
 * Advertised during initialization to inform the agent which authentication
 * method types the client can handle. This governs opt-in types that require
 * additional client-side support.
 *
 * @experimental
 */
export declare const zAuthCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Describes a single environment variable for an [`AuthMethodEnvVar`] authentication method.
 *
 * @experimental
 */
export declare const zAuthEnvVar: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    optional: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    secret: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$loose>;
/**
 * Agent handles authentication itself.
 *
 * This is the default authentication method type.
 */
export declare const zAuthMethodAgent: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Environment variable authentication method.
 *
 * The user provides credentials that the client passes to the agent as environment variables.
 *
 * @experimental
 */
export declare const zAuthMethodEnvVar: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    link: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    vars: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        optional: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        secret: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$loose>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Terminal-based authentication method.
 *
 * The client runs an interactive terminal for the user to authenticate via a TUI.
 *
 * @experimental
 */
export declare const zAuthMethodTerminal: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$loose>;
/**
 * Describes an available authentication method.
 *
 * The `type` field acts as the discriminator in the serialized JSON form.
 * When no `type` is present, the method is treated as `agent`.
 */
export declare const zAuthMethod: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    link: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    vars: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        optional: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        secret: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"env_var">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"terminal">;
}, z.core.$loose>>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$loose>]>;
/**
 * Request parameters for the authenticate method.
 *
 * Specifies which authentication method to use.
 */
export declare const zAuthenticateRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    methodId: z.ZodString;
}, z.core.$loose>;
/**
 * Response to the `authenticate` method.
 */
export declare const zAuthenticateResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * Binary resource contents.
 */
export declare const zBlobResourceContents: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    blob: z.ZodString;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    uri: z.ZodString;
}, z.core.$loose>;
/**
 * Schema for boolean properties in an elicitation form.
 */
export declare const zBooleanPropertySchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response from closing a session.
 *
 * @experimental
 */
export declare const zCloseSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Cost information for a session.
 *
 * @experimental
 */
export declare const zCost: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodString;
}, z.core.$loose>;
/**
 * Response containing the ID of the created terminal.
 */
export declare const zCreateTerminalResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    terminalId: z.ZodString;
}, z.core.$loose>;
/**
 * A diff representing file modifications.
 *
 * Shows changes to files in a format suitable for display in the client UI.
 *
 * See protocol docs: [Content](https://agentclientprotocol.com/protocol/tool-calls#content)
 */
export declare const zDiff: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    newText: z.ZodString;
    oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    path: z.ZodString;
}, z.core.$loose>;
export declare const zElicitationContentValue: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * The user accepted the elicitation and provided content.
 *
 * @experimental
 */
export declare const zElicitationAcceptAction: z.ZodObject<{
    content: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * The user's action in response to an elicitation.
 *
 * @experimental
 */
export declare const zElicitationAction: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    content: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>>>>;
}, z.core.$loose>, z.ZodObject<{
    action: z.ZodLiteral<"accept">;
}, z.core.$loose>>, z.ZodObject<{
    action: z.ZodLiteral<"decline">;
}, z.core.$loose>, z.ZodObject<{
    action: z.ZodLiteral<"cancel">;
}, z.core.$loose>]>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Form-based elicitation capabilities.
 *
 * @experimental
 */
export declare const zElicitationFormCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Unique identifier for an elicitation.
 *
 * @experimental
 */
export declare const zElicitationId: z.ZodString;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Notification sent by the agent when a URL-based elicitation is complete.
 *
 * @experimental
 */
export declare const zElicitationCompleteNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    elicitationId: z.ZodString;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response from the client to an elicitation request.
 *
 * @experimental
 */
export declare const zElicitationResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    action: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        content: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>>>>;
    }, z.core.$loose>, z.ZodObject<{
        action: z.ZodLiteral<"accept">;
    }, z.core.$loose>>, z.ZodObject<{
        action: z.ZodLiteral<"decline">;
    }, z.core.$loose>, z.ZodObject<{
        action: z.ZodLiteral<"cancel">;
    }, z.core.$loose>]>;
}, z.core.$loose>;
/**
 * Object schema type.
 */
export declare const zElicitationSchemaType: z.ZodLiteral<"object">;
/**
 * String schema type.
 */
export declare const zElicitationStringType: z.ZodLiteral<"string">;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * URL-based elicitation capabilities.
 *
 * @experimental
 */
export declare const zElicitationUrlCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Elicitation capabilities supported by the client.
 *
 * @experimental
 */
export declare const zElicitationCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    form: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>>>;
    url: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * URL-based elicitation mode where the client directs the user to a URL.
 *
 * @experimental
 */
export declare const zElicitationUrlMode: z.ZodObject<{
    elicitationId: z.ZodString;
    url: z.ZodString;
}, z.core.$loose>;
/**
 * A titled enum option with a const value and human-readable title.
 */
export declare const zEnumOption: z.ZodObject<{
    const: z.ZodString;
    title: z.ZodString;
}, z.core.$loose>;
/**
 * An environment variable to set when launching an MCP server.
 */
export declare const zEnvVariable: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    name: z.ZodString;
    value: z.ZodString;
}, z.core.$loose>;
/**
 * Predefined error codes for common JSON-RPC and ACP-specific errors.
 *
 * These codes follow the JSON-RPC 2.0 specification for standard errors
 * and use the reserved range (-32000 to -32099) for protocol-specific errors.
 */
export declare const zErrorCode: z.ZodUnion<readonly [z.ZodLiteral<-32700>, z.ZodLiteral<-32600>, z.ZodLiteral<-32601>, z.ZodLiteral<-32602>, z.ZodLiteral<-32603>, z.ZodLiteral<-32800>, z.ZodLiteral<-32000>, z.ZodLiteral<-32002>, z.ZodLiteral<-32042>, z.ZodNumber]>;
/**
 * JSON-RPC error object.
 *
 * Represents an error that occurred during method execution, following the
 * JSON-RPC 2.0 error object specification with optional additional data.
 *
 * See protocol docs: [JSON-RPC Error Object](https://www.jsonrpc.org/specification#error_object)
 */
export declare const zError: z.ZodObject<{
    code: z.ZodUnion<readonly [z.ZodLiteral<-32700>, z.ZodLiteral<-32600>, z.ZodLiteral<-32601>, z.ZodLiteral<-32602>, z.ZodLiteral<-32603>, z.ZodLiteral<-32800>, z.ZodLiteral<-32000>, z.ZodLiteral<-32002>, z.ZodLiteral<-32042>, z.ZodNumber]>;
    data: z.ZodOptional<z.ZodUnknown>;
    message: z.ZodString;
}, z.core.$loose>;
/**
 * Allows the Agent to send an arbitrary notification that is not part of the ACP spec.
 * Extension notifications provide a way to send one-way messages for custom functionality
 * while maintaining protocol compatibility.
 *
 * See protocol docs: [Extensibility](https://agentclientprotocol.com/protocol/extensibility)
 */
export declare const zExtNotification: z.ZodUnknown;
/**
 * Allows for sending an arbitrary request that is not part of the ACP spec.
 * Extension methods provide a way to add custom functionality while maintaining
 * protocol compatibility.
 *
 * See protocol docs: [Extensibility](https://agentclientprotocol.com/protocol/extensibility)
 */
export declare const zExtRequest: z.ZodUnknown;
/**
 * Allows for sending an arbitrary response to an [`ExtRequest`] that is not part of the ACP spec.
 * Extension methods provide a way to add custom functionality while maintaining
 * protocol compatibility.
 *
 * See protocol docs: [Extensibility](https://agentclientprotocol.com/protocol/extensibility)
 */
export declare const zExtResponse: z.ZodUnknown;
/**
 * File system capabilities that a client may support.
 *
 * See protocol docs: [FileSystem](https://agentclientprotocol.com/protocol/initialization#filesystem)
 */
export declare const zFileSystemCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    readTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    writeTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$loose>;
/**
 * Capabilities supported by the client.
 *
 * Advertised during initialization to inform the agent about
 * available features and methods.
 *
 * See protocol docs: [Client Capabilities](https://agentclientprotocol.com/protocol/initialization#client-capabilities)
 */
export declare const zClientCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$loose>>>;
    elicitation: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        form: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$loose>>>;
        url: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>>;
    fs: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        readTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        writeTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$loose>>>;
    terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$loose>;
/**
 * An HTTP header to set when making requests to the MCP server.
 */
export declare const zHttpHeader: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    name: z.ZodString;
    value: z.ZodString;
}, z.core.$loose>;
/**
 * Metadata about the implementation of the client or agent.
 * Describes the name and version of an MCP implementation, with an optional
 * title for UI representation.
 */
export declare const zImplementation: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    version: z.ZodString;
}, z.core.$loose>;
/**
 * Schema for integer properties in an elicitation form.
 */
export declare const zIntegerPropertySchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * Response to `terminal/kill` method
 */
export declare const zKillTerminalResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * Request parameters for listing existing sessions.
 *
 * Only available if the Agent supports the `sessionCapabilities.list` capability.
 */
export declare const zListSessionsRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    cwd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Logout capabilities supported by the agent.
 *
 * By supplying `{}` it means that the agent supports the logout method.
 *
 * @experimental
 */
export declare const zLogoutCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Authentication-related capabilities supported by the agent.
 *
 * @experimental
 */
export declare const zAgentAuthCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    logout: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for the logout method.
 *
 * Terminates the current authenticated session.
 *
 * @experimental
 */
export declare const zLogoutRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response to the `logout` method.
 *
 * @experimental
 */
export declare const zLogoutResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * MCP capabilities supported by the agent
 */
export declare const zMcpCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    http: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sse: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$loose>;
/**
 * HTTP transport configuration for MCP.
 */
export declare const zMcpServerHttp: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    headers: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>;
    name: z.ZodString;
    url: z.ZodString;
}, z.core.$loose>;
/**
 * SSE transport configuration for MCP.
 */
export declare const zMcpServerSse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    headers: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>;
    name: z.ZodString;
    url: z.ZodString;
}, z.core.$loose>;
/**
 * Stdio transport configuration for MCP.
 */
export declare const zMcpServerStdio: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    args: z.ZodArray<z.ZodString>;
    command: z.ZodString;
    env: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>;
    name: z.ZodString;
}, z.core.$loose>;
/**
 * Configuration for connecting to an MCP (Model Context Protocol) server.
 *
 * MCP servers provide tools and context that the agent can use when
 * processing prompts.
 *
 * See protocol docs: [MCP Servers](https://agentclientprotocol.com/protocol/session-setup#mcp-servers)
 */
export declare const zMcpServer: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    headers: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>;
    name: z.ZodString;
    url: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"http">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    headers: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>;
    name: z.ZodString;
    url: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"sse">;
}, z.core.$loose>>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    args: z.ZodArray<z.ZodString>;
    command: z.ZodString;
    env: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>;
    name: z.ZodString;
}, z.core.$loose>]>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * A unique identifier for a model.
 *
 * @experimental
 */
export declare const zModelId: z.ZodString;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Information about a selectable model.
 *
 * @experimental
 */
export declare const zModelInfo: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    modelId: z.ZodString;
    name: z.ZodString;
}, z.core.$loose>;
/**
 * Request parameters for creating a new session.
 *
 * See protocol docs: [Creating a Session](https://agentclientprotocol.com/protocol/session-setup#creating-a-session)
 */
export declare const zNewSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cwd: z.ZodString;
    mcpServers: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"http">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"sse">;
    }, z.core.$loose>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
    }, z.core.$loose>]>>;
}, z.core.$loose>;
/**
 * Schema for number (floating-point) properties in an elicitation form.
 */
export declare const zNumberPropertySchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * Unique identifier for a permission option.
 */
export declare const zPermissionOptionId: z.ZodString;
/**
 * The type of permission option being presented to the user.
 *
 * Helps clients choose appropriate icons and UI treatment.
 */
export declare const zPermissionOptionKind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
/**
 * An option presented to the user when requesting permission.
 */
export declare const zPermissionOption: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    kind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
    name: z.ZodString;
    optionId: z.ZodString;
}, z.core.$loose>;
/**
 * Priority levels for plan entries.
 *
 * Used to indicate the relative importance or urgency of different
 * tasks in the execution plan.
 * See protocol docs: [Plan Entries](https://agentclientprotocol.com/protocol/agent-plan#plan-entries)
 */
export declare const zPlanEntryPriority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
/**
 * Status of a plan entry in the execution flow.
 *
 * Tracks the lifecycle of each task from planning through completion.
 * See protocol docs: [Plan Entries](https://agentclientprotocol.com/protocol/agent-plan#plan-entries)
 */
export declare const zPlanEntryStatus: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
/**
 * A single entry in the execution plan.
 *
 * Represents a task or goal that the assistant intends to accomplish
 * as part of fulfilling the user's request.
 * See protocol docs: [Plan Entries](https://agentclientprotocol.com/protocol/agent-plan#plan-entries)
 */
export declare const zPlanEntry: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodString;
    priority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
    status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
}, z.core.$loose>;
/**
 * An execution plan for accomplishing complex tasks.
 *
 * Plans consist of multiple entries representing individual tasks or goals.
 * Agents report plans to clients to provide visibility into their execution strategy.
 * Plans can evolve during execution as the agent discovers new requirements or completes tasks.
 *
 * See protocol docs: [Agent Plan](https://agentclientprotocol.com/protocol/agent-plan)
 */
export declare const zPlan: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    entries: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodString;
        priority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
        status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
    }, z.core.$loose>>;
}, z.core.$loose>;
/**
 * Prompt capabilities supported by the agent in `session/prompt` requests.
 *
 * Baseline agent functionality requires support for [`ContentBlock::Text`]
 * and [`ContentBlock::ResourceLink`] in prompt requests.
 *
 * Other variants must be explicitly opted in to.
 * Capabilities for different types of content in prompt requests.
 *
 * Indicates which content types beyond the baseline (text and resource links)
 * the agent can process.
 *
 * See protocol docs: [Prompt Capabilities](https://agentclientprotocol.com/protocol/initialization#prompt-capabilities)
 */
export declare const zPromptCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    audio: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    embeddedContext: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    image: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$loose>;
/**
 * Protocol version identifier.
 *
 * This version is only bumped for breaking changes.
 * Non-breaking changes should be introduced via capabilities.
 */
export declare const zProtocolVersion: z.ZodNumber;
/**
 * Request parameters for the initialize method.
 *
 * Sent by the client to establish connection and negotiate capabilities.
 *
 * See protocol docs: [Initialization](https://agentclientprotocol.com/protocol/initialization)
 */
export declare const zInitializeRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    clientCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$loose>>>;
        elicitation: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            form: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$loose>>>;
            url: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>>;
        fs: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            readTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            writeTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$loose>>>;
        terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$loose>>>;
    clientInfo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        version: z.ZodString;
    }, z.core.$loose>>>;
    protocolVersion: z.ZodNumber;
}, z.core.$loose>;
/**
 * Response containing the contents of a text file.
 */
export declare const zReadTextFileResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodString;
}, z.core.$loose>;
/**
 * Response to terminal/release method
 */
export declare const zReleaseTerminalResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * JSON RPC Request Id
 *
 * An identifier established by the Client that MUST contain a String, Number, or NULL value if included. If it is not included it is assumed to be a notification. The value SHOULD normally not be Null [1] and Numbers SHOULD NOT contain fractional parts [2]
 *
 * The Server MUST reply with the same value in the Response object if included. This member is used to correlate the context between the two objects.
 *
 * [1] The use of Null as a value for the id member in a Request object is discouraged, because this specification uses a value of Null for Responses with an unknown id. Also, because JSON-RPC 1.0 uses an id value of Null for Notifications this could cause confusion in handling.
 *
 * [2] Fractional parts may be problematic, since many decimal fractions cannot be represented exactly as binary fractions.
 */
export declare const zRequestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Notification to cancel an ongoing request.
 *
 * See protocol docs: [Cancellation](https://agentclientprotocol.com/protocol/cancellation)
 *
 * @experimental
 */
export declare const zCancelRequestNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    requestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$loose>;
/**
 * The sender or recipient of messages and data in a conversation.
 */
export declare const zRole: z.ZodEnum<{
    assistant: "assistant";
    user: "user";
}>;
/**
 * Optional annotations for the client. The client can use annotations to inform how objects are used or displayed
 */
export declare const zAnnotations: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
        assistant: "assistant";
        user: "user";
    }>>>>;
    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$loose>;
/**
 * Audio provided to or from an LLM.
 */
export declare const zAudioContent: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$loose>>>;
    data: z.ZodString;
    mimeType: z.ZodString;
}, z.core.$loose>;
/**
 * An image provided to or from an LLM.
 */
export declare const zImageContent: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$loose>>>;
    data: z.ZodString;
    mimeType: z.ZodString;
    uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * A resource that the server is capable of reading, included in a prompt or tool call result.
 */
export declare const zResourceLink: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$loose>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    uri: z.ZodString;
}, z.core.$loose>;
/**
 * The user selected one of the provided options.
 */
export declare const zSelectedPermissionOutcome: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    optionId: z.ZodString;
}, z.core.$loose>;
/**
 * The outcome of a permission request.
 */
export declare const zRequestPermissionOutcome: z.ZodUnion<readonly [z.ZodObject<{
    outcome: z.ZodLiteral<"cancelled">;
}, z.core.$loose>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    optionId: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    outcome: z.ZodLiteral<"selected">;
}, z.core.$loose>>]>;
/**
 * Response to a permission request.
 */
export declare const zRequestPermissionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    outcome: z.ZodUnion<readonly [z.ZodObject<{
        outcome: z.ZodLiteral<"cancelled">;
    }, z.core.$loose>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        optionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        outcome: z.ZodLiteral<"selected">;
    }, z.core.$loose>>]>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Capabilities for the `session/close` method.
 *
 * By supplying `{}` it means that the agent supports closing of sessions.
 *
 * @experimental
 */
export declare const zSessionCloseCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * A boolean on/off toggle session configuration option payload.
 *
 * @experimental
 */
export declare const zSessionConfigBoolean: z.ZodObject<{
    currentValue: z.ZodBoolean;
}, z.core.$loose>;
/**
 * Unique identifier for a session configuration option value group.
 */
export declare const zSessionConfigGroupId: z.ZodString;
/**
 * Unique identifier for a session configuration option.
 */
export declare const zSessionConfigId: z.ZodString;
/**
 * Semantic category for a session configuration option.
 *
 * This is intended to help Clients distinguish broadly common selectors (e.g. model selector vs
 * session mode selector vs thought/reasoning level) for UX purposes (keyboard shortcuts, icons,
 * placement). It MUST NOT be required for correctness. Clients MUST handle missing or unknown
 * categories gracefully.
 *
 * Category names beginning with `_` are free for custom use, like other ACP extension methods.
 * Category names that do not begin with `_` are reserved for the ACP spec.
 */
export declare const zSessionConfigOptionCategory: z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>;
/**
 * Unique identifier for a session configuration option value.
 */
export declare const zSessionConfigValueId: z.ZodString;
/**
 * A possible value for a session configuration option.
 */
export declare const zSessionConfigSelectOption: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    value: z.ZodString;
}, z.core.$loose>;
/**
 * A group of possible values for a session configuration option.
 */
export declare const zSessionConfigSelectGroup: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    group: z.ZodString;
    name: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>;
}, z.core.$loose>;
/**
 * Possible values for a session configuration option.
 */
export declare const zSessionConfigSelectOptions: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    value: z.ZodString;
}, z.core.$loose>>, z.ZodArray<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    group: z.ZodString;
    name: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>;
}, z.core.$loose>>]>;
/**
 * A single-value selector (dropdown) session configuration option payload.
 */
export declare const zSessionConfigSelect: z.ZodObject<{
    currentValue: z.ZodString;
    options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        group: z.ZodString;
        name: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
    }, z.core.$loose>>]>;
}, z.core.$loose>;
export declare const zSessionConfigOption: z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    currentValue: z.ZodString;
    options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        group: z.ZodString;
        name: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
    }, z.core.$loose>>]>;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"select">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    currentValue: z.ZodBoolean;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"boolean">;
}, z.core.$loose>>]>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$loose>>;
/**
 * Session configuration options have been updated.
 */
export declare const zConfigOptionUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$loose>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Capabilities for the `session/fork` method.
 *
 * By supplying `{}` it means that the agent supports forking of sessions.
 *
 * @experimental
 */
export declare const zSessionForkCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * A unique identifier for a conversation session between a client and agent.
 *
 * Sessions maintain their own context, conversation history, and state,
 * allowing multiple independent interactions with the same agent.
 *
 * See protocol docs: [Session ID](https://agentclientprotocol.com/protocol/session-setup#session-id)
 */
export declare const zSessionId: z.ZodString;
/**
 * Notification to cancel ongoing operations for a session.
 *
 * See protocol docs: [Cancellation](https://agentclientprotocol.com/protocol/prompt-turn#cancellation)
 */
export declare const zCancelNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
}, z.core.$loose>;
export declare const zClientNotification: z.ZodObject<{
    method: z.ZodString;
    params: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodUnknown]>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for closing an active session.
 *
 * If supported, the agent **must** cancel any ongoing work related to the session
 * (treat it as if `session/cancel` was called) and then free up any resources
 * associated with the session.
 *
 * Only available if the Agent supports the `session.close` capability.
 *
 * @experimental
 */
export declare const zCloseSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
}, z.core.$loose>;
/**
 * Request to create a new terminal and execute a command.
 */
export declare const zCreateTerminalRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    command: z.ZodString;
    cwd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    env: z.ZodOptional<z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$loose>>>;
    outputByteLimit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    sessionId: z.ZodString;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for forking an existing session.
 *
 * Creates a new session based on the context of an existing one, allowing
 * operations like generating summaries without affecting the original session's history.
 *
 * Only available if the Agent supports the `session.fork` capability.
 *
 * @experimental
 */
export declare const zForkSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cwd: z.ZodString;
    mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"http">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"sse">;
    }, z.core.$loose>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
    }, z.core.$loose>]>>>;
    sessionId: z.ZodString;
}, z.core.$loose>;
/**
 * Request to kill a terminal without releasing it.
 */
export declare const zKillTerminalRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
}, z.core.$loose>;
/**
 * Request parameters for loading an existing session.
 *
 * Only available if the Agent supports the `loadSession` capability.
 *
 * See protocol docs: [Loading Sessions](https://agentclientprotocol.com/protocol/session-setup#loading-sessions)
 */
export declare const zLoadSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cwd: z.ZodString;
    mcpServers: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"http">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"sse">;
    }, z.core.$loose>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
    }, z.core.$loose>]>>;
    sessionId: z.ZodString;
}, z.core.$loose>;
/**
 * Request to read content from a text file.
 *
 * Only available if the client supports the `fs.readTextFile` capability.
 */
export declare const zReadTextFileRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    limit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    path: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$loose>;
/**
 * Request to release a terminal and free its resources.
 */
export declare const zReleaseTerminalRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for resuming an existing session.
 *
 * Resumes an existing session without returning previous messages (unlike `session/load`).
 * This is useful for agents that can resume sessions but don't implement full session loading.
 *
 * Only available if the Agent supports the `session.resume` capability.
 *
 * @experimental
 */
export declare const zResumeSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cwd: z.ZodString;
    mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"http">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"sse">;
    }, z.core.$loose>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>;
        name: z.ZodString;
    }, z.core.$loose>]>>>;
    sessionId: z.ZodString;
}, z.core.$loose>;
/**
 * Information about a session returned by session/list
 */
export declare const zSessionInfo: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cwd: z.ZodString;
    sessionId: z.ZodString;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * Response from listing sessions.
 */
export declare const zListSessionsResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sessions: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        cwd: z.ZodString;
        sessionId: z.ZodString;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>>;
}, z.core.$loose>;
/**
 * Update to session metadata. All fields are optional to support partial updates.
 *
 * Agents send this notification to update session information like title or custom metadata.
 * This allows clients to display dynamic session names and track session state changes.
 */
export declare const zSessionInfoUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * Capabilities for the `session/list` method.
 *
 * By supplying `{}` it means that the agent supports listing of sessions.
 */
export declare const zSessionListCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * Unique identifier for a Session Mode.
 */
export declare const zSessionModeId: z.ZodString;
/**
 * The current mode of the session has changed
 *
 * See protocol docs: [Session Modes](https://agentclientprotocol.com/protocol/session-modes)
 */
export declare const zCurrentModeUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    currentModeId: z.ZodString;
}, z.core.$loose>;
/**
 * A mode the agent can operate in.
 *
 * See protocol docs: [Session Modes](https://agentclientprotocol.com/protocol/session-modes)
 */
export declare const zSessionMode: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$loose>;
/**
 * The set of modes and the one currently active.
 */
export declare const zSessionModeState: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    availableModes: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>>;
    currentModeId: z.ZodString;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * The set of models and the one currently active.
 *
 * @experimental
 */
export declare const zSessionModelState: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    availableModels: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        modelId: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>>;
    currentModelId: z.ZodString;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response from forking an existing session.
 *
 * @experimental
 */
export declare const zForkSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$loose>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>>>>>;
    models: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModels: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            modelId: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>;
        currentModelId: z.ZodString;
    }, z.core.$loose>>>;
    modes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModes: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>;
        currentModeId: z.ZodString;
    }, z.core.$loose>>>;
    sessionId: z.ZodString;
}, z.core.$loose>;
/**
 * Response from loading an existing session.
 */
export declare const zLoadSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$loose>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>>>>>;
    models: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModels: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            modelId: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>;
        currentModelId: z.ZodString;
    }, z.core.$loose>>>;
    modes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModes: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>;
        currentModeId: z.ZodString;
    }, z.core.$loose>>>;
}, z.core.$loose>;
/**
 * Response from creating a new session.
 *
 * See protocol docs: [Creating a Session](https://agentclientprotocol.com/protocol/session-setup#creating-a-session)
 */
export declare const zNewSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$loose>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>>>>>;
    models: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModels: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            modelId: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>;
        currentModelId: z.ZodString;
    }, z.core.$loose>>>;
    modes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModes: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>;
        currentModeId: z.ZodString;
    }, z.core.$loose>>>;
    sessionId: z.ZodString;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response from resuming an existing session.
 *
 * @experimental
 */
export declare const zResumeSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$loose>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>>>>>;
    models: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModels: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            modelId: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>;
        currentModelId: z.ZodString;
    }, z.core.$loose>>>;
    modes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModes: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>;
        currentModeId: z.ZodString;
    }, z.core.$loose>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Capabilities for the `session/resume` method.
 *
 * By supplying `{}` it means that the agent supports resuming of sessions.
 *
 * @experimental
 */
export declare const zSessionResumeCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * Session capabilities supported by the agent.
 *
 * As a baseline, all Agents **MUST** support `session/new`, `session/prompt`, `session/cancel`, and `session/update`.
 *
 * Optionally, they **MAY** support other session methods and notifications by specifying additional capabilities.
 *
 * Note: `session/load` is still handled by the top-level `load_session` capability. This will be unified in future versions of the protocol.
 *
 * See protocol docs: [Session Capabilities](https://agentclientprotocol.com/protocol/initialization#session-capabilities)
 */
export declare const zSessionCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    close: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>>>;
    fork: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>>>;
    list: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>>>;
    resume: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>>>;
}, z.core.$loose>;
/**
 * Capabilities supported by the agent.
 *
 * Advertised during initialization to inform the client about
 * available features and content types.
 *
 * See protocol docs: [Agent Capabilities](https://agentclientprotocol.com/protocol/initialization#agent-capabilities)
 */
export declare const zAgentCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        logout: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>>;
    loadSession: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    mcpCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        http: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        sse: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$loose>>>;
    promptCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audio: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        embeddedContext: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        image: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$loose>>>;
    sessionCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        close: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$loose>>>;
        fork: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$loose>>>;
        list: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$loose>>>;
        resume: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>>;
}, z.core.$loose>;
/**
 * Response to the `initialize` method.
 *
 * Contains the negotiated protocol version and agent capabilities.
 *
 * See protocol docs: [Initialization](https://agentclientprotocol.com/protocol/initialization)
 */
export declare const zInitializeResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    agentCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            logout: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>>;
        loadSession: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        mcpCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            http: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            sse: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$loose>>>;
        promptCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audio: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            embeddedContext: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            image: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$loose>>>;
        sessionCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            close: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$loose>>>;
            fork: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$loose>>>;
            list: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$loose>>>;
            resume: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>>;
    agentInfo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        version: z.ZodString;
    }, z.core.$loose>>>;
    authMethods: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        link: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        vars: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            optional: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            secret: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"env_var">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"terminal">;
    }, z.core.$loose>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>]>>>>;
    protocolVersion: z.ZodNumber;
}, z.core.$loose>;
export declare const zSetSessionConfigOptionRequest: z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"boolean">;
    value: z.ZodBoolean;
}, z.core.$loose>, z.ZodObject<{
    value: z.ZodString;
}, z.core.$loose>]>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configId: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$loose>>;
/**
 * Response to `session/set_config_option` method.
 */
export declare const zSetSessionConfigOptionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$loose>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>>>;
}, z.core.$loose>;
/**
 * Request parameters for setting a session mode.
 */
export declare const zSetSessionModeRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    modeId: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$loose>;
/**
 * Response to `session/set_mode` method.
 */
export declare const zSetSessionModeResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for setting a session model.
 *
 * @experimental
 */
export declare const zSetSessionModelRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    modelId: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response to `session/set_model` method.
 *
 * @experimental
 */
export declare const zSetSessionModelResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
/**
 * Reasons why an agent stops processing a prompt turn.
 *
 * See protocol docs: [Stop Reasons](https://agentclientprotocol.com/protocol/prompt-turn#stop-reasons)
 */
export declare const zStopReason: z.ZodUnion<readonly [z.ZodLiteral<"end_turn">, z.ZodLiteral<"max_tokens">, z.ZodLiteral<"max_turn_requests">, z.ZodLiteral<"refusal">, z.ZodLiteral<"cancelled">]>;
/**
 * String format types for string properties in elicitation schemas.
 */
export declare const zStringFormat: z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>;
/**
 * Schema for string properties in an elicitation form.
 *
 * When `enum` or `oneOf` is set, this represents a single-select enum
 * with `"type": "string"`.
 */
export declare const zStringPropertySchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
    maxLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        const: z.ZodString;
        title: z.ZodString;
    }, z.core.$loose>>>>;
    pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * Embed a terminal created with `terminal/create` by its id.
 *
 * The terminal must be added before calling `terminal/release`.
 *
 * See protocol docs: [Terminal](https://agentclientprotocol.com/protocol/terminals)
 */
export declare const zTerminal: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    terminalId: z.ZodString;
}, z.core.$loose>;
/**
 * Exit status of a terminal command.
 */
export declare const zTerminalExitStatus: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    exitCode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * Request to get the current output and status of a terminal.
 */
export declare const zTerminalOutputRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
}, z.core.$loose>;
/**
 * Response containing the terminal output and exit status.
 */
export declare const zTerminalOutputResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    exitStatus: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        exitCode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>>>;
    output: z.ZodString;
    truncated: z.ZodBoolean;
}, z.core.$loose>;
/**
 * Text provided to or from an LLM.
 */
export declare const zTextContent: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$loose>>>;
    text: z.ZodString;
}, z.core.$loose>;
/**
 * Text-based resource contents.
 */
export declare const zTextResourceContents: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    text: z.ZodString;
    uri: z.ZodString;
}, z.core.$loose>;
/**
 * Resource content that can be embedded in a message.
 */
export declare const zEmbeddedResourceResource: z.ZodUnion<readonly [z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    text: z.ZodString;
    uri: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    blob: z.ZodString;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    uri: z.ZodString;
}, z.core.$loose>]>;
/**
 * The contents of a resource, embedded into a prompt or tool call result.
 */
export declare const zEmbeddedResource: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$loose>>>;
    resource: z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        text: z.ZodString;
        uri: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        blob: z.ZodString;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$loose>]>;
}, z.core.$loose>;
/**
 * Content blocks represent displayable information in the Agent Client Protocol.
 *
 * They provide a structured way to handle various types of user-facing content—whether
 * it's text from language models, images for analysis, or embedded resources for context.
 *
 * Content blocks appear in:
 * - User prompts sent via `session/prompt`
 * - Language model output streamed through `session/update` notifications
 * - Progress updates and results from tool calls
 *
 * This structure is compatible with the Model Context Protocol (MCP), enabling
 * agents to seamlessly forward content from MCP tool outputs without transformation.
 *
 * See protocol docs: [Content](https://agentclientprotocol.com/protocol/content)
 */
export declare const zContentBlock: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$loose>>>;
    text: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"text">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$loose>>>;
    data: z.ZodString;
    mimeType: z.ZodString;
    uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$loose>>>;
    data: z.ZodString;
    mimeType: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$loose>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    uri: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"resource_link">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$loose>>>;
    resource: z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        text: z.ZodString;
        uri: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        blob: z.ZodString;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$loose>]>;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"resource">;
}, z.core.$loose>>]>;
/**
 * Standard content block (text, images, resources).
 */
export declare const zContent: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        text: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$loose>>]>;
}, z.core.$loose>;
/**
 * A streamed item of content
 */
export declare const zContentChunk: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        text: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$loose>>]>;
    messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * Request parameters for sending a user prompt to the agent.
 *
 * Contains the user's message and any additional context.
 *
 * See protocol docs: [User Message](https://agentclientprotocol.com/protocol/prompt-turn#1-user-message)
 */
export declare const zPromptRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    prompt: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        text: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$loose>>]>>;
    sessionId: z.ZodString;
}, z.core.$loose>;
export declare const zClientRequest: z.ZodObject<{
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    method: z.ZodString;
    params: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        clientCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            }, z.core.$loose>>>;
            elicitation: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                form: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$loose>>>;
                url: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>>;
            fs: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                readTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                writeTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            }, z.core.$loose>>>;
            terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$loose>>>;
        clientInfo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            version: z.ZodString;
        }, z.core.$loose>>>;
        protocolVersion: z.ZodNumber;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        methodId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        cwd: z.ZodString;
        mcpServers: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"http">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"sse">;
        }, z.core.$loose>>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            args: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            env: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
        }, z.core.$loose>]>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        cwd: z.ZodString;
        mcpServers: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"http">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"sse">;
        }, z.core.$loose>>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            args: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            env: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
        }, z.core.$loose>]>>;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        cwd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        cwd: z.ZodString;
        mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"http">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"sse">;
        }, z.core.$loose>>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            args: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            env: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
        }, z.core.$loose>]>>>;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        cwd: z.ZodString;
        mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"http">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"sse">;
        }, z.core.$loose>>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            args: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            env: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
            name: z.ZodString;
        }, z.core.$loose>]>>>;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        modeId: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
        value: z.ZodBoolean;
    }, z.core.$loose>, z.ZodObject<{
        value: z.ZodString;
    }, z.core.$loose>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configId: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$loose>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        prompt: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            text: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$loose>>]>>;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        modelId: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodUnknown]>>>;
}, z.core.$loose>;
/**
 * Items definition for titled multi-select enum properties.
 */
export declare const zTitledMultiSelectItems: z.ZodObject<{
    anyOf: z.ZodArray<z.ZodObject<{
        const: z.ZodString;
        title: z.ZodString;
    }, z.core.$loose>>;
}, z.core.$loose>;
/**
 * Content produced by a tool call.
 *
 * Tool calls can produce different types of content including
 * standard content blocks (text, images) or file diffs.
 *
 * See protocol docs: [Content](https://agentclientprotocol.com/protocol/tool-calls#content)
 */
export declare const zToolCallContent: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        text: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$loose>>]>;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"content">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    newText: z.ZodString;
    oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    path: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"diff">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    terminalId: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"terminal">;
}, z.core.$loose>>]>;
/**
 * Unique identifier for a tool call within a session.
 */
export declare const zToolCallId: z.ZodString;
/**
 * A file location being accessed or modified by a tool.
 *
 * Enables clients to implement "follow-along" features that track
 * which files the agent is working with in real-time.
 *
 * See protocol docs: [Following the Agent](https://agentclientprotocol.com/protocol/tool-calls#following-the-agent)
 */
export declare const zToolCallLocation: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    path: z.ZodString;
}, z.core.$loose>;
/**
 * Execution status of a tool call.
 *
 * Tool calls progress through different statuses during their lifecycle.
 *
 * See protocol docs: [Status](https://agentclientprotocol.com/protocol/tool-calls#status)
 */
export declare const zToolCallStatus: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>;
/**
 * Categories of tools that can be invoked.
 *
 * Tool kinds help clients choose appropriate icons and optimize how they
 * display tool execution progress.
 *
 * See protocol docs: [Creating](https://agentclientprotocol.com/protocol/tool-calls#creating)
 */
export declare const zToolKind: z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>;
/**
 * Represents a tool call that the language model has requested.
 *
 * Tool calls are actions that the agent executes on behalf of the language model,
 * such as reading files, executing code, or fetching data from external sources.
 *
 * See protocol docs: [Tool Calls](https://agentclientprotocol.com/protocol/tool-calls)
 */
export declare const zToolCall: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            text: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"content">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        newText: z.ZodString;
        oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        path: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"diff">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminalId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"terminal">;
    }, z.core.$loose>>]>>>;
    kind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>;
    locations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        path: z.ZodString;
    }, z.core.$loose>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    rawOutput: z.ZodOptional<z.ZodUnknown>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>;
    title: z.ZodString;
    toolCallId: z.ZodString;
}, z.core.$loose>;
/**
 * An update to an existing tool call.
 *
 * Used to report progress and results as tools execute. All fields except
 * the tool call ID are optional - only changed fields need to be included.
 *
 * See protocol docs: [Updating](https://agentclientprotocol.com/protocol/tool-calls#updating)
 */
export declare const zToolCallUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            text: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"content">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        newText: z.ZodString;
        oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        path: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"diff">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminalId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"terminal">;
    }, z.core.$loose>>]>>>>;
    kind: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>;
    locations: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        path: z.ZodString;
    }, z.core.$loose>>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    rawOutput: z.ZodOptional<z.ZodUnknown>;
    status: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    toolCallId: z.ZodString;
}, z.core.$loose>;
/**
 * Request for user permission to execute a tool call.
 *
 * Sent when the agent needs authorization before performing a sensitive operation.
 *
 * See protocol docs: [Requesting Permission](https://agentclientprotocol.com/protocol/tool-calls#requesting-permission)
 */
export declare const zRequestPermissionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    options: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        kind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
        name: z.ZodString;
        optionId: z.ZodString;
    }, z.core.$loose>>;
    sessionId: z.ZodString;
    toolCall: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                text: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$loose>]>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$loose>>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"content">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            newText: z.ZodString;
            oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            path: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"diff">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            terminalId: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"terminal">;
        }, z.core.$loose>>]>>>>;
        kind: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>;
        locations: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            path: z.ZodString;
        }, z.core.$loose>>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        rawOutput: z.ZodOptional<z.ZodUnknown>;
        status: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        toolCallId: z.ZodString;
    }, z.core.$loose>;
}, z.core.$loose>;
/**
 * All text that was typed after the command name is provided as input.
 */
export declare const zUnstructuredCommandInput: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    hint: z.ZodString;
}, z.core.$loose>;
/**
 * unstructured
 *
 * All text that was typed after the command name is provided as input.
 */
export declare const zAvailableCommandInput: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    hint: z.ZodString;
}, z.core.$loose>;
/**
 * Information about a command.
 */
export declare const zAvailableCommand: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodString;
    input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        hint: z.ZodString;
    }, z.core.$loose>>>;
    name: z.ZodString;
}, z.core.$loose>;
/**
 * Available commands are ready or have changed
 */
export declare const zAvailableCommandsUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    availableCommands: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodString;
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            hint: z.ZodString;
        }, z.core.$loose>>>;
        name: z.ZodString;
    }, z.core.$loose>>;
}, z.core.$loose>;
/**
 * Items definition for untitled multi-select enum properties.
 */
export declare const zUntitledMultiSelectItems: z.ZodObject<{
    enum: z.ZodArray<z.ZodString>;
    type: z.ZodLiteral<"string">;
}, z.core.$loose>;
/**
 * Items for a multi-select (array) property schema.
 */
export declare const zMultiSelectItems: z.ZodUnion<readonly [z.ZodObject<{
    enum: z.ZodArray<z.ZodString>;
    type: z.ZodLiteral<"string">;
}, z.core.$loose>, z.ZodObject<{
    anyOf: z.ZodArray<z.ZodObject<{
        const: z.ZodString;
        title: z.ZodString;
    }, z.core.$loose>>;
}, z.core.$loose>]>;
/**
 * Schema for multi-select (array) properties in an elicitation form.
 */
export declare const zMultiSelectPropertySchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    items: z.ZodUnion<readonly [z.ZodObject<{
        enum: z.ZodArray<z.ZodString>;
        type: z.ZodLiteral<"string">;
    }, z.core.$loose>, z.ZodObject<{
        anyOf: z.ZodArray<z.ZodObject<{
            const: z.ZodString;
            title: z.ZodString;
        }, z.core.$loose>>;
    }, z.core.$loose>]>;
    maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * Property schema for elicitation form fields.
 *
 * Each variant corresponds to a JSON Schema `"type"` value.
 * Single-select enums use the `String` variant with `enum` or `oneOf` set.
 * Multi-select enums use the `Array` variant.
 */
export declare const zElicitationPropertySchema: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
    maxLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        const: z.ZodString;
        title: z.ZodString;
    }, z.core.$loose>>>>;
    pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"string">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"number">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"integer">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"boolean">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    items: z.ZodUnion<readonly [z.ZodObject<{
        enum: z.ZodArray<z.ZodString>;
        type: z.ZodLiteral<"string">;
    }, z.core.$loose>, z.ZodObject<{
        anyOf: z.ZodArray<z.ZodObject<{
            const: z.ZodString;
            title: z.ZodString;
        }, z.core.$loose>>;
    }, z.core.$loose>]>;
    maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    type: z.ZodLiteral<"array">;
}, z.core.$loose>>]>;
/**
 * Type-safe elicitation schema for requesting structured user input.
 *
 * This represents a JSON Schema object with primitive-typed properties,
 * as required by the elicitation specification.
 */
export declare const zElicitationSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    properties: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
        maxLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        minLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            const: z.ZodString;
            title: z.ZodString;
        }, z.core.$loose>>>>;
        pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"string">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"number">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"integer">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        items: z.ZodUnion<readonly [z.ZodObject<{
            enum: z.ZodArray<z.ZodString>;
            type: z.ZodLiteral<"string">;
        }, z.core.$loose>, z.ZodObject<{
            anyOf: z.ZodArray<z.ZodObject<{
                const: z.ZodString;
                title: z.ZodString;
            }, z.core.$loose>>;
        }, z.core.$loose>]>;
        maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"array">;
    }, z.core.$loose>>]>>>>;
    required: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"object">>>;
}, z.core.$loose>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Form-based elicitation mode where the client renders a form from the provided schema.
 *
 * @experimental
 */
export declare const zElicitationFormMode: z.ZodObject<{
    requestedSchema: z.ZodObject<{
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        properties: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
            maxLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                const: z.ZodString;
                title: z.ZodString;
            }, z.core.$loose>>>>;
            pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"string">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"number">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"integer">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            items: z.ZodUnion<readonly [z.ZodObject<{
                enum: z.ZodArray<z.ZodString>;
                type: z.ZodLiteral<"string">;
            }, z.core.$loose>, z.ZodObject<{
                anyOf: z.ZodArray<z.ZodObject<{
                    const: z.ZodString;
                    title: z.ZodString;
                }, z.core.$loose>>;
            }, z.core.$loose>]>;
            maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"array">;
        }, z.core.$loose>>]>>>>;
        required: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"object">>>;
    }, z.core.$loose>;
}, z.core.$loose>;
export declare const zElicitationRequest: z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    requestedSchema: z.ZodObject<{
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        properties: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
            maxLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                const: z.ZodString;
                title: z.ZodString;
            }, z.core.$loose>>>>;
            pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"string">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"number">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"integer">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            items: z.ZodUnion<readonly [z.ZodObject<{
                enum: z.ZodArray<z.ZodString>;
                type: z.ZodLiteral<"string">;
            }, z.core.$loose>, z.ZodObject<{
                anyOf: z.ZodArray<z.ZodObject<{
                    const: z.ZodString;
                    title: z.ZodString;
                }, z.core.$loose>>;
            }, z.core.$loose>]>;
            maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"array">;
        }, z.core.$loose>>]>>>>;
        required: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"object">>>;
    }, z.core.$loose>;
}, z.core.$loose>, z.ZodObject<{
    mode: z.ZodLiteral<"form">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    elicitationId: z.ZodString;
    url: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    mode: z.ZodLiteral<"url">;
}, z.core.$loose>>]>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    message: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$loose>>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Token usage information for a prompt turn.
 *
 * @experimental
 */
export declare const zUsage: z.ZodObject<{
    cachedReadTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    cachedWriteTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    inputTokens: z.ZodNumber;
    outputTokens: z.ZodNumber;
    thoughtTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    totalTokens: z.ZodNumber;
}, z.core.$loose>;
/**
 * Response from processing a user prompt.
 *
 * See protocol docs: [Check for Completion](https://agentclientprotocol.com/protocol/prompt-turn#4-check-for-completion)
 */
export declare const zPromptResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    stopReason: z.ZodUnion<readonly [z.ZodLiteral<"end_turn">, z.ZodLiteral<"max_tokens">, z.ZodLiteral<"max_turn_requests">, z.ZodLiteral<"refusal">, z.ZodLiteral<"cancelled">]>;
    usage: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        cachedReadTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        cachedWriteTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        inputTokens: z.ZodNumber;
        outputTokens: z.ZodNumber;
        thoughtTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        totalTokens: z.ZodNumber;
    }, z.core.$loose>>>;
    userMessageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
export declare const zAgentResponse: z.ZodUnion<readonly [z.ZodObject<{
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    result: z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        agentCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                logout: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>>;
            loadSession: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            mcpCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                http: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                sse: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            }, z.core.$loose>>>;
            promptCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audio: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                embeddedContext: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                image: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            }, z.core.$loose>>>;
            sessionCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                close: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$loose>>>;
                fork: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$loose>>>;
                list: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$loose>>>;
                resume: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$loose>>>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>>;
        agentInfo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            version: z.ZodString;
        }, z.core.$loose>>>;
        authMethods: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            link: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            vars: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                optional: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                secret: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            }, z.core.$loose>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"env_var">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            args: z.ZodOptional<z.ZodArray<z.ZodString>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"terminal">;
        }, z.core.$loose>>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>]>>>>;
        protocolVersion: z.ZodNumber;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodString;
            options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                group: z.ZodString;
                name: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$loose>>;
            }, z.core.$loose>>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodBoolean;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$loose>>]>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>>>>;
        models: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModels: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                modelId: z.ZodString;
                name: z.ZodString;
            }, z.core.$loose>>;
            currentModelId: z.ZodString;
        }, z.core.$loose>>>;
        modes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModes: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                id: z.ZodString;
                name: z.ZodString;
            }, z.core.$loose>>;
            currentModeId: z.ZodString;
        }, z.core.$loose>>>;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodString;
            options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                group: z.ZodString;
                name: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$loose>>;
            }, z.core.$loose>>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodBoolean;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$loose>>]>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>>>>;
        models: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModels: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                modelId: z.ZodString;
                name: z.ZodString;
            }, z.core.$loose>>;
            currentModelId: z.ZodString;
        }, z.core.$loose>>>;
        modes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModes: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                id: z.ZodString;
                name: z.ZodString;
            }, z.core.$loose>>;
            currentModeId: z.ZodString;
        }, z.core.$loose>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sessions: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            cwd: z.ZodString;
            sessionId: z.ZodString;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodString;
            options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                group: z.ZodString;
                name: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$loose>>;
            }, z.core.$loose>>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodBoolean;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$loose>>]>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>>>>;
        models: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModels: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                modelId: z.ZodString;
                name: z.ZodString;
            }, z.core.$loose>>;
            currentModelId: z.ZodString;
        }, z.core.$loose>>>;
        modes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModes: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                id: z.ZodString;
                name: z.ZodString;
            }, z.core.$loose>>;
            currentModeId: z.ZodString;
        }, z.core.$loose>>>;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodString;
            options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                group: z.ZodString;
                name: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$loose>>;
            }, z.core.$loose>>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodBoolean;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$loose>>]>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>>>>;
        models: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModels: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                modelId: z.ZodString;
                name: z.ZodString;
            }, z.core.$loose>>;
            currentModelId: z.ZodString;
        }, z.core.$loose>>>;
        modes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModes: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                id: z.ZodString;
                name: z.ZodString;
            }, z.core.$loose>>;
            currentModeId: z.ZodString;
        }, z.core.$loose>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodString;
            options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                group: z.ZodString;
                name: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$loose>>;
            }, z.core.$loose>>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodBoolean;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$loose>>]>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        stopReason: z.ZodUnion<readonly [z.ZodLiteral<"end_turn">, z.ZodLiteral<"max_tokens">, z.ZodLiteral<"max_turn_requests">, z.ZodLiteral<"refusal">, z.ZodLiteral<"cancelled">]>;
        usage: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            cachedReadTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            cachedWriteTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            inputTokens: z.ZodNumber;
            outputTokens: z.ZodNumber;
            thoughtTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalTokens: z.ZodNumber;
        }, z.core.$loose>>>;
        userMessageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>, z.ZodUnknown]>;
}, z.core.$loose>, z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodUnion<readonly [z.ZodLiteral<-32700>, z.ZodLiteral<-32600>, z.ZodLiteral<-32601>, z.ZodLiteral<-32602>, z.ZodLiteral<-32603>, z.ZodLiteral<-32800>, z.ZodLiteral<-32000>, z.ZodLiteral<-32002>, z.ZodLiteral<-32042>, z.ZodNumber]>;
        data: z.ZodOptional<z.ZodUnknown>;
        message: z.ZodString;
    }, z.core.$loose>;
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$loose>]>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Context window and cost update for a session.
 *
 * @experimental
 */
export declare const zUsageUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodString;
    }, z.core.$loose>>>;
    size: z.ZodNumber;
    used: z.ZodNumber;
}, z.core.$loose>;
/**
 * Different types of updates that can be sent during session processing.
 *
 * These updates provide real-time feedback about the agent's progress.
 *
 * See protocol docs: [Agent Reports Output](https://agentclientprotocol.com/protocol/prompt-turn#3-agent-reports-output)
 */
export declare const zSessionUpdate: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        text: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$loose>>]>;
    messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"user_message_chunk">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        text: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$loose>>]>;
    messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"agent_message_chunk">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        text: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$loose>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$loose>>]>;
    messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"agent_thought_chunk">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            text: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"content">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        newText: z.ZodString;
        oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        path: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"diff">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminalId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"terminal">;
    }, z.core.$loose>>]>>>;
    kind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>;
    locations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        path: z.ZodString;
    }, z.core.$loose>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    rawOutput: z.ZodOptional<z.ZodUnknown>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>;
    title: z.ZodString;
    toolCallId: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"tool_call">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            text: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"content">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        newText: z.ZodString;
        oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        path: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"diff">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminalId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"terminal">;
    }, z.core.$loose>>]>>>>;
    kind: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>;
    locations: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        path: z.ZodString;
    }, z.core.$loose>>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    rawOutput: z.ZodOptional<z.ZodUnknown>;
    status: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    toolCallId: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"tool_call_update">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    entries: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodString;
        priority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
        status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"plan">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    availableCommands: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodString;
        input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            hint: z.ZodString;
        }, z.core.$loose>>>;
        name: z.ZodString;
    }, z.core.$loose>>;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"available_commands_update">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    currentModeId: z.ZodString;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"current_mode_update">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$loose>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$loose>>>;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"config_option_update">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"session_info_update">;
}, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodString;
    }, z.core.$loose>>>;
    size: z.ZodNumber;
    used: z.ZodNumber;
}, z.core.$loose>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"usage_update">;
}, z.core.$loose>>]>;
/**
 * Notification containing a session update from the agent.
 *
 * Used to stream real-time progress and results during prompt processing.
 *
 * See protocol docs: [Agent Reports Output](https://agentclientprotocol.com/protocol/prompt-turn#3-agent-reports-output)
 */
export declare const zSessionNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    update: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            text: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$loose>>]>;
        messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"user_message_chunk">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            text: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$loose>>]>;
        messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"agent_message_chunk">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            text: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$loose>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$loose>>]>;
        messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"agent_thought_chunk">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                text: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$loose>]>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$loose>>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"content">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            newText: z.ZodString;
            oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            path: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"diff">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            terminalId: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"terminal">;
        }, z.core.$loose>>]>>>;
        kind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>;
        locations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            path: z.ZodString;
        }, z.core.$loose>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        rawOutput: z.ZodOptional<z.ZodUnknown>;
        status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>;
        title: z.ZodString;
        toolCallId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"tool_call">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                text: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$loose>]>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$loose>>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"content">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            newText: z.ZodString;
            oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            path: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"diff">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            terminalId: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"terminal">;
        }, z.core.$loose>>]>>>>;
        kind: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>;
        locations: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            path: z.ZodString;
        }, z.core.$loose>>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        rawOutput: z.ZodOptional<z.ZodUnknown>;
        status: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        toolCallId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"tool_call_update">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        entries: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodString;
            priority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
            status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"plan">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableCommands: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodString;
            input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                hint: z.ZodString;
            }, z.core.$loose>>>;
            name: z.ZodString;
        }, z.core.$loose>>;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"available_commands_update">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        currentModeId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"current_mode_update">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodString;
            options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                group: z.ZodString;
                name: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$loose>>;
            }, z.core.$loose>>]>;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodBoolean;
        }, z.core.$loose>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$loose>>]>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$loose>>>;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"config_option_update">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"session_info_update">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            amount: z.ZodNumber;
            currency: z.ZodString;
        }, z.core.$loose>>>;
        size: z.ZodNumber;
        used: z.ZodNumber;
    }, z.core.$loose>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"usage_update">;
    }, z.core.$loose>>]>;
}, z.core.$loose>;
export declare const zAgentNotification: z.ZodObject<{
    method: z.ZodString;
    params: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        update: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                text: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$loose>]>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$loose>>]>;
            messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"user_message_chunk">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                text: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$loose>]>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$loose>>]>;
            messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"agent_message_chunk">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                text: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$loose>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$loose>]>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$loose>>]>;
            messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"agent_thought_chunk">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    text: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"text">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                    uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"image">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"audio">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"resource_link">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    resource: z.ZodUnion<readonly [z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        text: z.ZodString;
                        uri: z.ZodString;
                    }, z.core.$loose>, z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        blob: z.ZodString;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        uri: z.ZodString;
                    }, z.core.$loose>]>;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"resource">;
                }, z.core.$loose>>]>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"content">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                newText: z.ZodString;
                oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                path: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"diff">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                terminalId: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"terminal">;
            }, z.core.$loose>>]>>>;
            kind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>;
            locations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                path: z.ZodString;
            }, z.core.$loose>>>;
            rawInput: z.ZodOptional<z.ZodUnknown>;
            rawOutput: z.ZodOptional<z.ZodUnknown>;
            status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>;
            title: z.ZodString;
            toolCallId: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"tool_call">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    text: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"text">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                    uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"image">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"audio">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"resource_link">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    resource: z.ZodUnion<readonly [z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        text: z.ZodString;
                        uri: z.ZodString;
                    }, z.core.$loose>, z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        blob: z.ZodString;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        uri: z.ZodString;
                    }, z.core.$loose>]>;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"resource">;
                }, z.core.$loose>>]>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"content">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                newText: z.ZodString;
                oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                path: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"diff">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                terminalId: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"terminal">;
            }, z.core.$loose>>]>>>>;
            kind: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>;
            locations: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                path: z.ZodString;
            }, z.core.$loose>>>>;
            rawInput: z.ZodOptional<z.ZodUnknown>;
            rawOutput: z.ZodOptional<z.ZodUnknown>;
            status: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            toolCallId: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"tool_call_update">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            entries: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                content: z.ZodString;
                priority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
                status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
            }, z.core.$loose>>;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"plan">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableCommands: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodString;
                input: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    hint: z.ZodString;
                }, z.core.$loose>>>;
                name: z.ZodString;
            }, z.core.$loose>>;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"available_commands_update">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            currentModeId: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"current_mode_update">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            configOptions: z.ZodArray<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                currentValue: z.ZodString;
                options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$loose>>, z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    group: z.ZodString;
                    name: z.ZodString;
                    options: z.ZodArray<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        name: z.ZodString;
                        value: z.ZodString;
                    }, z.core.$loose>>;
                }, z.core.$loose>>]>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"select">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                currentValue: z.ZodBoolean;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"boolean">;
            }, z.core.$loose>>]>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                category: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                id: z.ZodString;
                name: z.ZodString;
            }, z.core.$loose>>>;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"config_option_update">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"session_info_update">;
        }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            cost: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                amount: z.ZodNumber;
                currency: z.ZodString;
            }, z.core.$loose>>>;
            size: z.ZodNumber;
            used: z.ZodNumber;
        }, z.core.$loose>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"usage_update">;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        elicitationId: z.ZodString;
    }, z.core.$loose>, z.ZodUnknown]>>>;
}, z.core.$loose>;
/**
 * Request to wait for a terminal command to exit.
 */
export declare const zWaitForTerminalExitRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
}, z.core.$loose>;
/**
 * Response containing the exit status of a terminal command.
 */
export declare const zWaitForTerminalExitResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    exitCode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
/**
 * Request to write content to a text file.
 *
 * Only available if the client supports the `fs.writeTextFile` capability.
 */
export declare const zWriteTextFileRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodString;
    path: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$loose>;
export declare const zAgentRequest: z.ZodObject<{
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    method: z.ZodString;
    params: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodString;
        path: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        limit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        path: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        options: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            kind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
            name: z.ZodString;
            optionId: z.ZodString;
        }, z.core.$loose>>;
        sessionId: z.ZodString;
        toolCall: z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    text: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"text">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                    uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"image">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"audio">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"resource_link">;
                }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$loose>>>;
                    resource: z.ZodUnion<readonly [z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        text: z.ZodString;
                        uri: z.ZodString;
                    }, z.core.$loose>, z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        blob: z.ZodString;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        uri: z.ZodString;
                    }, z.core.$loose>]>;
                }, z.core.$loose>, z.ZodObject<{
                    type: z.ZodLiteral<"resource">;
                }, z.core.$loose>>]>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"content">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                newText: z.ZodString;
                oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                path: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"diff">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                terminalId: z.ZodString;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"terminal">;
            }, z.core.$loose>>]>>>>;
            kind: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>;
            locations: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                line: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                path: z.ZodString;
            }, z.core.$loose>>>>;
            rawInput: z.ZodOptional<z.ZodUnknown>;
            rawOutput: z.ZodOptional<z.ZodUnknown>;
            status: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            toolCallId: z.ZodString;
        }, z.core.$loose>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        command: z.ZodString;
        cwd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        env: z.ZodOptional<z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$loose>>>;
        outputByteLimit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sessionId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
    }, z.core.$loose>, z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        requestedSchema: z.ZodObject<{
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            properties: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
                maxLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                minLength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                    const: z.ZodString;
                    title: z.ZodString;
                }, z.core.$loose>>>>;
                pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"string">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"number">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"integer">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"boolean">;
            }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
                default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                items: z.ZodUnion<readonly [z.ZodObject<{
                    enum: z.ZodArray<z.ZodString>;
                    type: z.ZodLiteral<"string">;
                }, z.core.$loose>, z.ZodObject<{
                    anyOf: z.ZodArray<z.ZodObject<{
                        const: z.ZodString;
                        title: z.ZodString;
                    }, z.core.$loose>>;
                }, z.core.$loose>]>;
                maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"array">;
            }, z.core.$loose>>]>>>>;
            required: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"object">>>;
        }, z.core.$loose>;
    }, z.core.$loose>, z.ZodObject<{
        mode: z.ZodLiteral<"form">;
    }, z.core.$loose>>, z.ZodIntersection<z.ZodObject<{
        elicitationId: z.ZodString;
        url: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        mode: z.ZodLiteral<"url">;
    }, z.core.$loose>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        message: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$loose>>, z.ZodUnknown]>>>;
}, z.core.$loose>;
/**
 * Response to `fs/write_text_file`
 */
export declare const zWriteTextFileResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$loose>;
export declare const zClientResponse: z.ZodUnion<readonly [z.ZodObject<{
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    result: z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        outcome: z.ZodUnion<readonly [z.ZodObject<{
            outcome: z.ZodLiteral<"cancelled">;
        }, z.core.$loose>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            optionId: z.ZodString;
        }, z.core.$loose>, z.ZodObject<{
            outcome: z.ZodLiteral<"selected">;
        }, z.core.$loose>>]>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminalId: z.ZodString;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        exitStatus: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            exitCode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>>>;
        output: z.ZodString;
        truncated: z.ZodBoolean;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        exitCode: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$loose>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        action: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            content: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>>>>;
        }, z.core.$loose>, z.ZodObject<{
            action: z.ZodLiteral<"accept">;
        }, z.core.$loose>>, z.ZodObject<{
            action: z.ZodLiteral<"decline">;
        }, z.core.$loose>, z.ZodObject<{
            action: z.ZodLiteral<"cancel">;
        }, z.core.$loose>]>;
    }, z.core.$loose>, z.ZodUnknown]>;
}, z.core.$loose>, z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodUnion<readonly [z.ZodLiteral<-32700>, z.ZodLiteral<-32600>, z.ZodLiteral<-32601>, z.ZodLiteral<-32602>, z.ZodLiteral<-32603>, z.ZodLiteral<-32800>, z.ZodLiteral<-32000>, z.ZodLiteral<-32002>, z.ZodLiteral<-32042>, z.ZodNumber]>;
        data: z.ZodOptional<z.ZodUnknown>;
        message: z.ZodString;
    }, z.core.$loose>;
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$loose>]>;
