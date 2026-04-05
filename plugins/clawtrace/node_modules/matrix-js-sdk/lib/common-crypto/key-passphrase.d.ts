interface IAuthData {
    private_key_salt?: string;
    private_key_iterations?: number;
    private_key_bits?: number;
}
/**
 * Derive a backup key from a passphrase using the salt and iterations from the auth data.
 * @param authData - The auth data containing the salt and iterations
 * @param passphrase - The passphrase to derive the key from
 * @deprecated Deriving a backup key from a passphrase is not part of the matrix spec. Instead, a random key is generated and stored/shared via 4S.
 */
export declare function keyFromAuthData(authData: IAuthData, passphrase: string): Promise<Uint8Array>;
export {};
//# sourceMappingURL=key-passphrase.d.ts.map