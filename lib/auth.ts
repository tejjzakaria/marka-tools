/**
 * @author Zakaria Tejjani
 * @date 2025-12-11
 */

import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

const ALGORITHM = 'HS256';

export interface AdminTokenPayload {
  isAdmin: boolean;
  iat: number;
  exp: number;
}

/**
 * Generate a JWT token for admin authentication
 */
export async function generateAdminToken(): Promise<string> {
  const token = await new SignJWT({ isAdmin: true })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime('24h') // Token expires in 24 hours
    .sign(SECRET_KEY);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // Validate that the payload has the expected structure
    if (payload && typeof payload.isAdmin === 'boolean') {
      return payload as unknown as AdminTokenPayload;
    }

    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Verify PIN (only used for initial login)
 */
export function verifyPin(pin: string): boolean {
  return pin === process.env.ADMIN_PIN;
}
