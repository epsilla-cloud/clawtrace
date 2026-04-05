/**
 * A list of the spec versions which the js-sdk is compatible with.
 *
 * In practice, this means: when we connect to a server, it must declare support for one of the versions in this list.
 *
 * Note that it does not *necessarily* mean that the js-sdk has good support for all the features in the listed spec
 * versions; only that we should be able to provide a base level of functionality with a server that offers support for
 * any of the listed versions.
 */
export declare const SUPPORTED_MATRIX_VERSIONS: string[];
/**
 * The oldest Matrix specification version the js-sdk supports.
 */
export declare const MINIMUM_MATRIX_VERSION: string;
/**
 * The most recent Matrix specification version the js-sdk supports.
 */
export declare const MAXIMUM_MATRIX_VERSION: string;
//# sourceMappingURL=version-support.d.ts.map