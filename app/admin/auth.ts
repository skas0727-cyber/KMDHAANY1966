// admin session: Supabase Auth email/password login + signed httpOnly cookie, checked per-request (no middleware)
import "server-only";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { storeMode } from "../inquiries";

const COOKIE = "kmd_admin";
const VERSION = "kmd-admin-v2";
const MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12h

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

// cookie signing secret: the service role key (already server-only) with Supabase, a fixed value for the local dev store
function sessionSecret(): string {
  const mode = storeMode();
  if (mode === "supabase") return process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return mode === "local" ? "local-dev" : "";
}

// cookie signing key is derived with scrypt, so a stolen cookie can't be brute-forced back to the secret cheaply
let key: { secret: string; buf: Buffer } | null = null;
function signingKey(secret: string): Buffer {
  if (key?.secret !== secret) key = { secret, buf: scryptSync(secret, VERSION, 32) };
  return key.buf;
}
const sign = (secret: string, exp: number) => createHmac("sha256", signingKey(secret)).update(`${VERSION}.${exp}`).digest("hex");

export type LoginResult = "ok" | "invalid" | "unconfigured" | "error";

// Supabase Auth password grant: every user in Authentication → Users can log in, so keep
// "Allow new users to sign up" off in Supabase, or anyone could create an account and read the inquiries
export async function checkLogin(email: string, password: string): Promise<LoginResult> {
  const mode = storeMode();
  if (mode === "unconfigured") return "unconfigured";
  // ponytail: the local JSON dev store has no Supabase Auth, so any email + "1234" logs in there
  if (mode === "local") return password === "1234" ? "ok" : "invalid";
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    cache: "no-store",
    headers: { apikey: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).catch(() => null);
  if (!res) return "error";
  if (res.ok) return "ok";
  return res.status === 400 ? "invalid" : "error"; // 400 = wrong email/password or unconfirmed email
}

export async function setAdminCookie(): Promise<void> {
  const secret = sessionSecret();
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

// ponytail: signature-only check, so removing an admin in Supabase takes effect when their 12h cookie expires;
// rotating the service role key logs everyone out immediately
export async function isAdmin(): Promise<boolean> {
  const secret = sessionSecret();
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
