import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

// Uses `jose` rather than `jsonwebtoken` because this module is imported from
// middleware.ts, which runs on Next.js's Edge runtime. `jsonwebtoken` relies on
// Node's `crypto` module and silently fails to verify tokens under Edge (it
// throws inside jwt.verify, which a try/catch then turns into a false "invalid
// token" — the exact bug that was rejecting valid admin logins). `jose` uses
// the standard Web Crypto API instead, so it works the same in both the Edge
// middleware and regular Node.js API routes.
//
// Keep this file free of bcrypt (see lib/passwords.ts) — anything imported
// here gets pulled into the Edge middleware bundle.

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-insecure-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const ADMIN_COOKIE_NAME = "tabsha_admin_token";
export const USER_COOKIE_NAME = "tabsha_user_token";

export interface AdminTokenPayload {
  email: string;
  role: "admin";
}

export interface UserTokenPayload {
  userId: string;
  email: string;
  role: "customer";
}

export async function signUserToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ userId, email, role: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
}

export async function verifyUserToken(token: string): Promise<UserTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role !== "customer") return null;
    return payload as unknown as UserTokenPayload;
  } catch {
    return null;
  }
}

export async function signAdminToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey);
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role !== "admin") return null;
    return payload as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
}
