// public inquiry submission endpoint: validates, honeypot-checks, then stores via app/inquiries.ts
import { createInquiry, storeMode } from "../../inquiries";

const MAX_BODY_BYTES = 4096;
const PHONE_RE = /^[0-9-]{9,14}$/;
const BAD_CHARS_RE = /[\p{Cc}\p{Cf}]/u; // control + format chars, e.g. a U+202E direction override in a name

// ponytail: per-instance Map, not shared across serverless instances; the real limit belongs in a Vercel Firewall rule
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  for (const [key, v] of hits) if (v.reset < now) hits.delete(key);
  const hit = hits.get(ip);
  if (!hit) { hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS }); return false; }
  return ++hit.count > RATE_LIMIT;
}

export async function POST(req: Request) {
  // JSON only: forces a CORS preflight, so other sites can't make visitors' browsers submit here
  if (!req.headers.get("content-type")?.startsWith("application/json")) {
    return Response.json({ error: "잘못된 요청입니다" }, { status: 415 });
  }
  if (Number(req.headers.get("content-length")) > MAX_BODY_BYTES) {
    return Response.json({ error: "요청이 너무 큽니다" }, { status: 413 });
  }
  // x-real-ip is only trustworthy when set by a proxy in front of us (e.g. Vercel) — spoofable otherwise
  const ip = req.headers.get("x-real-ip") ?? "local";
  if (rateLimited(ip)) {
    return Response.json({ error: "잠시 후 다시 시도해 주세요" }, { status: 429 });
  }

  let body: unknown;
  try {
    const text = await req.text();
    if (Buffer.byteLength(text, "utf8") > MAX_BODY_BYTES) return Response.json({ error: "요청이 너무 큽니다" }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }
  const { name, phone, item, privacy, sms, company } = body as Record<string, unknown>;

  // honeypot: hidden field only bots fill in — pretend success, store nothing
  if (typeof company === "string" && company.trim() !== "") {
    return Response.json({ ok: true }, { status: 201 });
  }

  if (typeof name !== "string" || typeof phone !== "string" || typeof item !== "string" || typeof sms !== "boolean" || privacy !== true) {
    return Response.json({ error: "입력값을 확인해 주세요" }, { status: 400 });
  }
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const trimmedItem = item.trim();
  if (trimmedName.length < 1 || trimmedName.length > 30 || BAD_CHARS_RE.test(trimmedName)) {
    return Response.json({ error: "이름을 확인해 주세요" }, { status: 400 });
  }
  if (!PHONE_RE.test(trimmedPhone)) return Response.json({ error: "연락처를 확인해 주세요" }, { status: 400 });
  if (trimmedItem.length < 1 || trimmedItem.length > 60) return Response.json({ error: "상담 항목을 확인해 주세요" }, { status: 400 });

  if (storeMode() === "unconfigured") {
    return Response.json({ error: "문의 접수 기능이 아직 준비되지 않았습니다." }, { status: 503 });
  }

  try {
    await createInquiry({ name: trimmedName, phone: trimmedPhone, item: trimmedItem, sms_consent: sms });
  } catch (err) {
    console.error("createInquiry failed", err);
    return Response.json({ error: "잠시 후 다시 시도해 주세요" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
