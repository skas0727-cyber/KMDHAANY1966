"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkLogin, clearAdminCookie, requireAdmin, setAdminCookie, type LoginResult } from "./auth";
import { updateInquiry, deleteInquiry, STATUSES, type InquiryStatus } from "../inquiries";

export type LoginState = { error: string };

const LOGIN_ERRORS: Record<Exclude<LoginResult, "ok">, string> = {
  invalid: "이메일 또는 비밀번호가 올바르지 않습니다",
  forbidden: "관리자 권한이 없는 계정입니다",
  unconfigured: "관리자 로그인이 설정되지 않았습니다",
  error: "잠시 후 다시 시도하세요",
};

// ponytail: per-instance Map keyed by IP, not shared across serverless instances; add a WAF rate limit on
// POST /admin/login for real throttling. x-real-ip is only trustworthy when set by a proxy in front of us
// (e.g. Vercel) — treat it as spoofable otherwise.
const LOCK_WINDOW_MS = 15 * 60_000;
const locks = new Map<string, { fails: number; lockedUntil: number; touched: number }>();

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const ip = (await headers()).get("x-real-ip") ?? "local";
  const now = Date.now();
  for (const [key, v] of locks) if (now - v.touched > LOCK_WINDOW_MS) locks.delete(key);

  const lock = locks.get(ip);
  if (lock && now < lock.lockedUntil) return { error: "로그인 시도가 많습니다. 15분 후 다시 시도하세요" };
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const result = await checkLogin(email, password);
  if (result === "invalid") {
    const fails = (lock?.fails ?? 0) + 1;
    locks.set(ip, fails >= 5 ? { fails: 0, lockedUntil: now + LOCK_WINDOW_MS, touched: now } : { fails, lockedUntil: 0, touched: now });
  }
  if (result !== "ok") return { error: LOGIN_ERRORS[result] };
  locks.delete(ip);
  await setAdminCookie();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await requireAdmin();
  await clearAdminCookie();
  redirect("/admin/login");
}

export async function updateInquiryAction(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const status = String(formData.get("status") || "");
  const memo = String(formData.get("memo") || "");
  if (!id || !STATUSES.includes(status as InquiryStatus) || memo.length > 2000) return;
  await updateInquiry(id, { status: status as InquiryStatus, memo });
  revalidatePath("/admin");
}

export async function deleteInquiryAction(id: string): Promise<void> {
  await requireAdmin();
  if (!id) return;
  await deleteInquiry(id);
  revalidatePath("/admin");
}
