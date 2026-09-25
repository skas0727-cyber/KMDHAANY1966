// admin session: ADMIN_PASSWORD env + signed httpOnly cookie, checked per-request (no middleware)
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "kmd_admin";
const VERSION = "kmd-admin-v1";
const MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12h

// HMAC first: gives every input a fixed-length digest so timingSafeEqual never leaks length via a throw
function hmac(key: string, data: string): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

// unset, blank or short password = admin disabled in production (fail closed; never sign with an empty/guessable key)
// ponytail: local `npm run dev` with no ADMIN_PASSWORD and no real data store falls back to "1234" so /admin works
// without an .env; builds compile NODE_ENV to "production", so deployments still need a 16+ char ADMIN_PASSWORD
export function adminSecret(): string | null {
  const s = process.env.ADMIN_PASSWORD;
  if (s && s.length >= 16) return s;
  return process.env.NODE_ENV === "development" && !s && !process.env.SUPABASE_SERVICE_ROLE_KEY ? "1234" : null;
}

// cookie signing key is derived with scrypt, so a stolen cookie can't be brute-forced back to the password cheaply
let key: { secret: string; buf: Buffer } | null = null;
function signingKey(secret: string): Buffer {
  if (key?.secret !== secret) key = { secret, buf: scryptSync(secret, VERSION, 32) };
  return key.buf;
}
const sign = (secret: string, exp: number) => createHmac("sha256", signingKey(secret)).update(`${VERSION}.${exp}`).digest("hex");

// compares input against ADMIN_PASSWORD without ever string-comparing raw passwords
export function checkPassword(input: string): boolean {
  const secret = adminSecret();
  return !!secret && safeEqual(hmac(VERSION, input), hmac(VERSION, secret));
}

export async function setAdminCookie(): Promise<void> {
  const secret = adminSecret();
  if (!secret) return;
  const exp = Date.now() + MAX_AGE_MS;
  const sig = sign(secret, exp);
  (await cookies()).set(COOKIE, `${exp}.${sig}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: MAX_AGE_MS / 1000,
  });
}

export async function clearAdminCookie(): Promise<void> {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isAdmin(): Promise<boolean> {
  const secret = adminSecret();
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!secret || !raw) return false;
  const dot = raw.indexOf(".");
  if (dot < 0) return false;
  const exp = Number(raw.slice(0, dot));
  if (!Number.isFinite(exp) || exp <= Date.now()) return false;
  const expected = sign(secret, exp);
  return safeEqual(Buffer.from(raw.slice(dot + 1)), Buffer.from(expected));
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
