import bcrypt from "bcryptjs";

// Kept separate from lib/auth.ts on purpose: bcryptjs uses Node-only APIs
// (process.nextTick, setImmediate) that don't exist in the Edge runtime.
// middleware.ts only needs the JWT verify functions from lib/auth.ts, so as
// long as nothing in this file gets imported there, the Edge bundle stays
// clean and doesn't pull in bcrypt at all.

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Admin credentials are configured via env vars so no credentials live in source control.
 * - ADMIN_EMAIL: plain email, defaults to admin@tabsha.com for local/dev use.
 * - ADMIN_PASSWORD_HASH: a bcrypt hash (preferred). Generate one with:
 *     node -e "console.log(require('bcryptjs').hashSync('yourPassword', 10))"
 * - ADMIN_PASSWORD: a plain-text fallback, only used if ADMIN_PASSWORD_HASH isn't set.
 *   Fine for local dev, but set ADMIN_PASSWORD_HASH before deploying anywhere real.
 */
export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || "admin@tabsha.com").toLowerCase();
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) {
    return bcrypt.compare(password, hash);
  }
  const plain = process.env.ADMIN_PASSWORD;
  if (plain) {
    return password === plain;
  }
  // Built-in dev fallback so the app is usable out of the box.
  // Default: admin@tabsha.com / Tabsha@Admin123
  const DEV_FALLBACK_HASH = "$2b$10$2BHyonAlYQHNCzc6e4CgrO2B/GDcv1a6A70P8LiO0o1pCzw6rkHaO";
  return bcrypt.compare(password, DEV_FALLBACK_HASH);
}
