import { type AESEncryptedSecretStoragePayload } from "../@types/AESEncryptedSecretStoragePayload.ts";
/**
 * Decrypt an AES-encrypted Secret Storage item.
 *
 * @param data - the encrypted data, returned by {@link utils/encryptAESSecretStorageItem.default | encryptAESSecretStorageItem}.
 * @param key - the encryption key to use as an input to the HKDF function which is used to derive the AES key. Must
 *    be the same as provided to {@link utils/encryptAESSecretStorageItem.default | encryptAESSecretStorageItem}.
 * @param name - the name of the secret. Also used as an input to the HKDF operation which is used to derive the AES
 *    key, so again must be the same as provided to {@link utils/encryptAESSecretStorageItem.default | encryptAESSecretStorageItem}.
 */
export default function decryptAESSecretStorageItem(data: AESEncryptedSecretStoragePayload, key: Uint8Array<ArrayBuffer>, name: string): Promise<string>;
//# sourceMappingURL=decryptAESSecretStorageItem.d.ts.map