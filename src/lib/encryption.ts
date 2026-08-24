import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 12 bytes recommended for GCM
const AUTH_TAG_LENGTH = 16; // 16 bytes authentication tag

function getEncryptionKey(): Buffer {
  const secret = process.env.JOURNAL_ENCRYPTION_SECRET || process.env.JWT_SECRET || "celys-care-sanctuary-master-encryption-key-32bytes!";
  // Derive a strong 32-byte key using scrypt
  return crypto.scryptSync(secret, "celys-care-salt-v1", 32);
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts plaintext string using AES-256-GCM authenticated encryption.
 */
export function encryptJournalText(plaintext: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted,
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

/**
 * Decrypts AES-256-GCM ciphertext using IV and Auth Tag.
 */
export function decryptJournalText(
  ciphertext: string,
  ivBase64: string,
  authTagBase64: string
): string {
  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(authTagBase64, "base64");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Journal decryption error:", error);
    return "[Decryption failed: integrity verification error]";
  }
}
