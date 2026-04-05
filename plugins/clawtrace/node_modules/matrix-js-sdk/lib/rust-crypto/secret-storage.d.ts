import { type SecretStorageKey, type ServerSideSecretStorage } from "../secret-storage.ts";
/**
 * Check that the private cross signing keys (master, self signing, user signing) are stored in the secret storage and encrypted with the default secret storage key.
 *
 * @param secretStorage - The secret store using account data
 * @returns True if the cross-signing keys are all stored and encrypted with the same secret storage key.
 *
 * @internal
 */
export declare function secretStorageContainsCrossSigningKeys(secretStorage: ServerSideSecretStorage): Promise<boolean>;
/**
 *
 * Check that the secret storage can access the given secrets using the default key.
 *
 * @param secretStorage - The secret store using account data
 * @param secretNames - The secret names to check
 * @returns True if all the given secrets are accessible and encrypted with the given key.
 *
 * @internal
 */
export declare function secretStorageCanAccessSecrets(secretStorage: ServerSideSecretStorage, secretNames: SecretStorageKey[]): Promise<boolean>;
//# sourceMappingURL=secret-storage.d.ts.map