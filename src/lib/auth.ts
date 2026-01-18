import { hash, compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET; // Ensured via env validation usually

if (!JWT_SECRET) {
  // Warn in dev, throw in prod ideally. For now console warn.
  console.warn("JWT_SECRET is not defined in environment variables.");
}

/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return compare(password, hash);
}

/**
 * Sign a JWT token for a user
 */
export function signToken(payload: { userId: string; role: string }): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }
  return sign(payload, JWT_SECRET, { expiresIn: "1d" }); // 1 day expiration
}

/**
 * Verify a JWT token
 */
export function verifyToken(
  token: string,
): { userId: string; role: string } | null {
  if (!JWT_SECRET) return null;
  try {
    return verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch (_error) {
    return null;
  }
}
