// inquiry storage: Supabase (PostgREST via plain fetch) in prod, JSON file in local dev, throws when unconfigured
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type InquiryStatus = "new" | "in_progress" | "done";
export type Inquiry = { id: string; created_at: string; name: string; phone: string; item: string; sms_consent: boolean; status: InquiryStatus; memo: string };

export const STATUS_LABEL: Record<InquiryStatus, string> = { new: "신규", in_progress: "상담중", done: "완료" };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUUID(id: string): void {
  if (!UUID_RE.test(id)) throw new Error("invalid inquiry id");
}

export function storeMode(): "supabase" | "local" | "unconfigured" {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  if (process.env.NODE_ENV !== "production") return "local";
  return "unconfigured";
}

// --- Supabase (PostgREST) ---

async function supabaseFetch(query: string, init?: RequestInit): Promise<Response> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/inquiries${query}`, {
    ...init,
    cache: "no-store",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal", ...init?.headers },
  });
  if (!res.ok) throw new Error(`inquiry store request failed (${res.status})`);
  return res;
}

// PostgREST or=(...) filters break on these characters; strip them from user-supplied search terms
function sanitizeSearchTerm(q: string): string {
  return q.replace(/[,()*.:'"\\]/g, "");
}

// --- Local JSON file (dev only, no env configured) ---

const DATA_FILE = path.join(process.cwd(), ".data", "inquiries.json");

async function readLocal(): Promise<Inquiry[]> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8")) as Inquiry[];
  } catch {
    return [];
  }
}

async function writeLocal(rows: Inquiry[]): Promise<void> {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
}

export async function createInquiry(input: { name: string; phone: string; item: string; sms_consent: boolean }): Promise<void> {
  const mode = storeMode();
  if (mode === "unconfigured") throw new Error("inquiry store not configured");
  if (mode === "supabase") {
    await supabaseFetch("", { method: "POST", body: JSON.stringify({ ...input, status: "new", memo: "" }) });
    return;
  }
  const rows = await readLocal();
  rows.push({ id: randomUUID(), created_at: new Date().toISOString(), ...input, status: "new", memo: "" });
  await writeLocal(rows);
}

export async function listInquiries(opts?: { status?: InquiryStatus; q?: string }): Promise<Inquiry[]> {
  const mode = storeMode();
  if (mode === "unconfigured") throw new Error("inquiry store not configured");
  if (mode === "supabase") {
    const params = new URLSearchParams({ select: "*", order: "created_at.desc" });
    if (opts?.status) params.set("status", `eq.${opts.status}`);
    const term = opts?.q ? sanitizeSearchTerm(opts.q) : "";
    if (term) params.set("or", `(name.ilike.*${term}*,phone.ilike.*${term}*)`);
    const res = await supabaseFetch(`?${params.toString()}`);
    return (await res.json()) as Inquiry[];
  }
  let rows = await readLocal();
  if (opts?.status) rows = rows.filter((r) => r.status === opts.status);
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    rows = rows.filter((r) => r.name.toLowerCase().includes(q) || r.phone.toLowerCase().includes(q));
  }
  return rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function updateInquiry(id: string, patch: { status?: InquiryStatus; memo?: string }): Promise<void> {
  assertUUID(id);
  const mode = storeMode();
  if (mode === "unconfigured") throw new Error("inquiry store not configured");
  if (mode === "supabase") {
    await supabaseFetch(`?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    return;
  }
  const rows = await readLocal();
  const row = rows.find((r) => r.id === id);
  if (!row) return;
  Object.assign(row, patch);
  await writeLocal(rows);
}

export async function deleteInquiry(id: string): Promise<void> {
  assertUUID(id);
  const mode = storeMode();
  if (mode === "unconfigured") throw new Error("inquiry store not configured");
  if (mode === "supabase") {
    await supabaseFetch(`?id=eq.${id}`, { method: "DELETE" });
    return;
  }
  const rows = await readLocal();
  await writeLocal(rows.filter((r) => r.id !== id));
}
