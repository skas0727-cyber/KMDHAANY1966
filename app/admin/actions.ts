"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminSecret, checkPassword, clearAdminCookie, requireAdmin, setAdminCookie } from "./auth";
import { updateInquiry, deleteInquiry, type InquiryStatus } from "../inquiries";

const STATUSES: InquiryStatus[] = ["new", "in_progress", "done"];

export type LoginState = { error: string };

// ponytail: per-instance lockout (5 fails → 15 min), not shared across serverless instances; add a WAF rate limit on POST /admin/login for real throttling
let fails = 0, lockedUntil = 0;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminSecret()) return { error: "관리자 로그인이 설정되지 않았습니다" };
  if (Date.now() < lockedUntil) return { error: "로그인 시도가 많습니다. 15분 후 다시 시도하세요" };
  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) {
    if (++fails >= 5) { fails = 0; lockedUntil = Date.now() + 15 * 60_000; }
    return { error: "비밀번호가 올바르지 않습니다" };
  }
  fails = 0;
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
