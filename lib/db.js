import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

/**
 * Standard Neon Serverless Client
 * Optimized for HTTP-based serverless environments (Vercel/Neon)
 */
export const sql = neon(process.env.DATABASE_URL);

/**
 * Helper to generate Nanoids for primary keys
 * Replaces Prisma's cuid() logic for direct SQL
 */
import { nanoid } from 'nanoid';
export const createId = () => nanoid(12);

/**
 * Ensures the admin system is provisioned
 * Run this during startup or first login
 */
export async function ensureAdminsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS app_admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
}
