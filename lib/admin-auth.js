import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'node:crypto';

const SECRET = process.env.CLERK_SECRET_KEY || 'parity_admin_secret_fallback_8293';

/**
 * Hash a password using scrypt (standard Node implementation)
 * Returns a string in the format: salt:hash
 */
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored format: salt:hash
 */
export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const candidateHash = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(hash), Buffer.from(candidateHash));
}

/**
 * Sign a session payload (simple HMAC signature for session cookies)
 * Format: payload.signature
 */
export function signSession(payload) {
  const data = JSON.stringify(payload);
  const signature = createHmac('sha256', SECRET).update(data).digest('hex');
  return `${Buffer.from(data).toString('base64')}.${signature}`;
}

/**
 * Verify and decode a session token
 */
export function verifySession(token) {
  if (!token) return null;
  const [dataB64, signature] = token.split('.');
  if (!dataB64 || !signature) return null;

  const dataString = Buffer.from(dataB64, 'base64').toString();
  const expectedSignature = createHmac('sha256', SECRET).update(dataString).digest('hex');

  if (timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    try {
      const payload = JSON.parse(dataString);
      // Basic check: Expire in 24 hours
      if (payload.exp < Date.now()) return null;
      return payload;
    } catch {
      return null;
    }
  }
  return null;
}
