import { type AESEncryptedSecretStoragePayload } from "../@types/AESEncryptedSecretStoragePayload.ts";
/**
 * Encrypt a string as a secret storage item, using AES-CTR.
 *
 * @param data - the plaintext to encrypt
 * @param key - the encryption key to use as an input to the HKDF function which is used to derive the AES key for
 *    encryption. Obviously, the same key must be provided when decrypting.
 * @param name - the name of the secret. Used as an input to the HKDF operation which is used to derive the AES key,
 *    so again the same value must be provided when decrypting.
 * @param ivStr - the base64-encoded initialization vector to use. If not supplied, a random one will be generated.
 *
 * @returns The encrypted result, including the ciphertext itself, the initialization vector (as supplied in `ivStr`,
 *   or generated), and an HMAC on the ciphertext — all base64-encoded.
 */
export default function encryptAESSecretStorageItem(data: string, key: Uint8Array<ArrayBuffer>, name: string, ivStr?: string): Promise<AESEncryptedSecretStoragePayload>;
//# sourceMappingURL=encryptAESSecretStorageItem.d.ts.map